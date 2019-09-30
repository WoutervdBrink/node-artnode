const Port = require('./port');
const PropertyContainer = require('./propertycontainer');
const { ArtPollReply } = require('./packets');

module.exports = class Device extends PropertyContainer {
    constructor() {
        super();

        this._defineIp('ip');
        this._defineDouble('port');
        this._defineDouble('firmwareVersion');
        this._defineByte('net');
        this._defineByte('subnet');
        this._defineDouble('oem');
        this._defineByte('ubeaVersion');
        this._defineDouble('estaCode', 0xFFFF);
        this._defineString('shortName', 18);
        this._defineString('longName', 64);
        this._defineString('nodeReport', 64);
        this._defineMac('mac');
        this._defineIp('bindIp');
        this._defineByte('bindIndex');
        this._defineBoolean('isArtNet3');
        this._defineBoolean('dhcpEnabled');
        this._defineBoolean('hasDhcpConfig');
        this._defineBoolean('hasWebInterface');

        this._ports = [];

        for (let i = 0; i < 4; i++) {
            this._ports[i] = new Port();
        }

        this._lastSeen = Date.now();
    }

    getPort(port) {
        return this._ports[i] || null;
    }

    get lastSeen() {
        return this._lastSeen;
    }

    readPollReply(pollReply) {
        this._lastSeen = Date.now();
        this.ip = pollReply.ip;
        this.port = pollReply.port;
        this.firmwareVersion = pollReply.firmwareVersion;
        this.net = pollReply.net;
        this.subnet = pollReply.subnet;
        this.oem = pollReply.oem;
        this.ubeaVersion = pollReply.ubeaVersion;
        this.estaCode = pollReply.estaCode;
        this.shortName = pollReply.shortName;
        this.longName = pollReply.longName;
        this.nodeReport = pollReply.nodeReport;
        for (let i = 0; i < 4; i++) {
            const port = this._ports[i];
            port.isOutput = pollReply[`isPort${i+1}Output`];
            port.isInput = pollReply[`isPort${i+1}Input`];
            port.isDmx = pollReply[`isPort${i+1}Dmx`];
            port.isAvab = pollReply[`isPort${i+1}Avab`];
            port.isColortranCmx = pollReply[`isPort${i+1}ColortranCmx`];
            port.isAdb625 = pollReply[`isPort${i+1}Adb625`];
            port.isArtNet = pollReply[`isPort${i+1}ArtNet`];

            port.received = pollReply[`port${i+1}Received`];
            port.testReceived = pollReply[`port${i+1}TestReceived`];
            port.sipReceived = pollReply[`port${i+1}SipReceived`];
            port.textReceived = pollReply[`port${i+1}textReceived`];
            port.inputEnabled = pollReply[`port${i+1}InputEnabled`];
            port.errorsDetected = pollReply[`port${i+1}errorsDetected`];

            port.transmitted = pollReply[`port${i+1}Transmitted`];
            port.testTransmitted = pollReply[`port${i+1}TestTransmitted`];
            port.sipTransmitted = pollReply[`port${i+1}Transmitted`];
            port.textTransmitted = pollReply[`port${i+1}TextTransmitted`];
            port.merging = pollReply[`port${i+1}Merging`];
            port.short = pollReply[`port${i+1}Short`];
            port.mergeHtp = pollReply[`port${i}MergeHtp`];

            port.inAddress = this.net * 256 + this.subnet * 16 + pollReply[`swIn${i+1}`];
            port.outAddress = this.net * 256 + this.subnet * 16 + pollReply[`swOut${i+1}`];
        }
    }

    writePollReply() {
        const reply = new ArtPollReply();

        reply.ip = this.ip;
        reply.port = this.port;
        reply.firmwareVersion = this.firmwareVersion;
        reply.net = this.net;
        reply.subnet = this.subnet;
        reply.oem = this.oem;
        reply.ubeaVersion = this.ubeaVersion;
        reply.estaCode = this.estaCode;
        reply.shortName = this.shortName;
        reply.longName = this.longName;
        reply.nodeReport = this.nodeReport;
        for (let i = 0; i < 4; i++) {
            const port = this._ports[i];

            reply[`isPort${i+1}Output`] = port.isOutput;
            reply[`isPort${i+1}Input`] = port.isInput;
            reply[`isPort${i+1}Dmx`] = port.isDmx;
            reply[`isPort${i+1}Avab`] = port.isAvab;
            reply[`isPort${i+1}ColortranCmx`] = port.isColortranCmx;
            reply[`isPort${i+1}Adb625`] = port.isAdb625;
            reply[`isPort${i+1}ArtNet`] = port.isArtNet;

            reply[`port${i+1}Received`] = port.received;
            reply[`port${i+1}TestReceived`] = port.testReceived;
            reply[`port${i+1}SipReceived`] = port.sipReceived;
            reply[`port${i+1}textReceived`] = port.textReceived;
            reply[`port${i+1}InputEnabled`] = port.inputEnabled;
            reply[`port${i+1}errorsDetected`] = port.errorsDetected;

            reply[`port${i+1}Transmitted`] = port.transmitted;
            reply[`port${i+1}TestTransmitted`] = port.testTransmitted;
            reply[`port${i+1}Transmitted`] = port.sipTransmitted;
            reply[`port${i+1}TextTransmitted`] = port.textTransmitted;
            reply[`port${i+1}Merging`] = port.merging;
            reply[`port${i+1}Short`] = port.short;
            reply[`port${i}MergeHtp`] = port.mergeHtp;

            // TODO swIn and swOut
        }

        return reply;
    }
}
