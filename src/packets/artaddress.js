const Packet = require('../packet');

module.exports = class ArtAddress extends Packet {
    get OP_CODE() {
        return 0x6000;
    }

    get format() {
        return [
            ['8s', 'id'],
            ['H', 'op'],
            ['H', 'protocolVersion'],
            ['B', 'network'],
            ['B', 'bindIndex'],
            ['18s', 'shortName'],
            ['64s', 'longName'],
            ['B', 'swIn1'],
            ['B', 'swIn2'],
            ['B', 'swIn3'],
            ['B', 'swIn4'],
            ['B', 'swOut1'],
            ['B', 'swOut2'],
            ['B', 'swOut3'],
            ['B', 'swOut4'],
            ['B', 'subnet'],
            // SwVideo is deprecated
            ['B', 'x'],
            ['B', 'command']
        ];
    }
};
