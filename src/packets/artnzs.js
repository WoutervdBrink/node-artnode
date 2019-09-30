const Packet = require('../packet');

module.exports = class ArtNzs extends Packet {
    get OP_CODE() {
        return 0x5100;
    }

    get format() {
        return [
            ['8s', 'id'],
            ['H', 'op'],
            ['H', 'protocolVersion'],
            ['B', 'sequence'],
            ['B', 'startCode'],
            ['B', 'subnet'],
            ['B', 'network'],
            ['H', 'length'],
            ['512A', 'dmxData']
        ];
    }

    get data() {
        return Array.from(this.dmxData).splice(0, this.length);
    }
};
