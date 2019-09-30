const Packet = require('../packet');

module.exports = class ArtSync extends Packet {
    get OP_CODE() {
        return 0x5200;
    }

    get format() {
        return [
            ['8s', 'id'],
            ['H', 'op'],
            ['H', 'protocolVersion'],
            ['B', 'aux1'],
            ['B', 'aux2']
        ];
    }
};
