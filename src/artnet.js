const { EventEmitter } = require('events');
const dgram = require('dgram');
const { jspack } = require('jspack');
const packets = require('./packets');
const Device = require('./device');
const Universe = require('./universe');

const isIpEqual = (ip1, ip2) => {
    ip1 = Array.from(ip1);
    ip2 = Array.from(ip2);

    for (let i = 0; i < 4; i++) {
        if (ip1[i] !== ip2[i]) {
            return false;
        }
    }

    return true;
};

module.exports = class Artnet extends EventEmitter {
    constructor(config) {
        super();

        const options = config || {};

        this._host = options.host || '255.255.255.255';
        this._port = parseInt(options.port, 10) || 6454;
        this._iface = options.iface || null;
        this._isController = options.isController || false;

        this._socket = dgram.createSocket({ type: 'udp4', reuseAddr: true });

        this._socket.on('error', (err) => {
            this.emit('error', err);
        });

        this._socket.on('message', this._onMessage.bind(this));

        this._pollInterval = 0;

        this._devices = [];
        this._universes = {};

        this._device = new Device();
        this._device.ip = [127, 0, 0, 1];
        this._device.port = 6454;
        this._device.oem = 0xFFFF;
        this._device.shortName = 'Node.JS';
        this._device.longName = 'Node.JS Art-Net Implementation';
    }

    start() {
        if (this._iface && this._host === '255.255.255.255') {
            this._socket.bind(this._port, this._iface, () => {
                this._socket.setBroadcast(true);
            });
        } else if (this._host.match(/255$/)) {
            this._socket.bind(this._port, () => {
                this._socket.setBroadcast(true);
            });
        }

        if (this._isController) {
            this._pollInterval = setInterval(this._poll.bind(this), 2500);
        }
    }

    getUniverse(universe) {
        if (!this._universes[universe]) {
            this._universes[universe] = new Universe(universe);
        }
        return this._universes[universe];
    }

    _onMessage(msg, { address, family, port, size }) {
        if (size < 10) {
            // Not Art-Net.
            return;
        }

        const id = String(jspack.Unpack('8s', msg));

        if (id !== 'Art-Net\u0000') {
            console.warn('Not Art-Net', id);
            return;
        }

        const opcode = parseInt(jspack.Unpack('<h', msg, 8) || 0);
        let packet;

        try {
            switch (opcode) {
                case 0x2000: // OpPoll
                    packet = packets.ArtPoll.read(msg);
                    this._onPoll(packet, address);
                    break;
                case 0x2100: // OpPollReply
                    packet = packets.ArtPollReply.read(msg);
                    this._onPollReply(packet);
                    break;
                case 0x6000: // OpAddress
                    packet = packets.ArtAddress.read(msg);
                    break;
                case 0x7000: // OpInput
                    packet = packets.ArtInput.read(msg);
                    break;
                case 0xf800: // OpIpProg
                    break;
                case 0xf900: // OpIpProgReply
                    break;
                case 0x2400: // OpCommand
                    break;
                case 0x5000: // OpDmx
                    packet = packets.ArtDmx.read(msg);
                    this._onDmx(packet);
                    break;
                case 0x5100: // OpNzs
                    packet = packets.ArtNzs.read(msg);
                    break;
                case 0x5200: // OpSync
                    packet = packets.ArtSync.read(msg);
                    break;
                default:
                    packet = null;

            }
        } catch (e) {
            console.warn(e);
        }
        
        if (packet) {
            this.emit('packet', packet);
        }
    }

    _onPoll(packet, source) {
        const reply = this._device.writePollReply();
        this._socket.send(reply.write(), 0, reply.write().length, 6454, source);
    }

    _onPollReply(packet) {
        let i;

        for (i = 0; i < this._devices.length; i++) {
            if (isIpEqual(packet.ip, this._devices[i].ip) && packet.shortName === this._devices[i].shortName) {
                break;
            }
        }

        let device = this._devices[i];
        let isNew = false;

        if (!device) {
            device = new Device();
            this._devices.push(device);
            isNew = true;
        }

        device.readPollReply(packet);
        if (isNew) {
            this.emit('device', device);
        }
    }

    _poll() {
        const aliveDevices = [];
        for (let i = 0; i < this._devices.length; i++) {
            if (Date.now() - this._devices[i].lastSeen < 4000) {
                aliveDevices.push(this._devices[i]);
            } else {
                this.emit('deviceOffline', this._devices[i]);
            }
        }
        this._devices = aliveDevices;
        const pollPacket = new packets.ArtPoll();
        pollPacket.flags = 0;
        pollPacket.priority = 0;
        this._socket.send(pollPacket.write(), 0, pollPacket.write().length, 6454, '127.255.255.255');
    }

    _onDmx(packet) {
        if (!this._universes[packet.universe]) {
            this._universes[packet.universe] = new Universe(packet.universe);
        }

        this._universes[packet.universe].readDmx(packet);
    }
}
