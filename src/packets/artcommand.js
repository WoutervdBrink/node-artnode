const Packet = require('../packet');

module.exports = class ArtCommand extends Packet {
    get OP_CODE() {
        return 0x2400;
    }

    get format() {
        return [
            ['8s', 'id'],
            ['H', 'op'],
            ['H', 'protocolVersion'],
            ['H', 'estaCode'],
            ['H', 'length'],
            ['512A', 'data']
        ];
    }
};
