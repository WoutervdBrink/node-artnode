const Packet = require('../packet');

module.exports = class ArtDmx extends Packet {
    get OP_CODE() {
        return 0x5000;
    }

    get format() {
        return [
            ['8s', 'id'],
            ['H', 'op'],
            ['H', 'protocolVersion'],
            ['B', 'sequence'],
            ['B', 'physicalPort'],
            ['B', 'subnet'],
            ['B', 'net'],
            ['H', 'length'],
            ['512A', 'dmxData']
        ];
    }

    get universe() {
        return this.net * 256 + this.subnet;
    }

    get data() {
        return Array.from(this.dmxData).splice(0, this.length);
    }
};
