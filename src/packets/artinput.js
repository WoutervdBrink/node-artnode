const Packet = require('../packet');

module.exports = class ArtInput extends Packet {
    get OP_CODE() {
        return 0x7000;
    }

    get format() {
        return [
            ['8s', 'id'],
            ['H', 'op'],
            ['H', 'protocolVersion'],
            ['B', 'network'],
            // Filler
            ['B', 'x'],
            ['B', 'bindIndex'],
            ['H', 'numPorts'],
            ['B', 'input1', ['', '', '', '', '', '', '', 'port1Enabled']],
            ['B', 'input2', ['', '', '', '', '', '', '', 'port2Enabled']],
            ['B', 'input3', ['', '', '', '', '', '', '', 'port3Enabled']],
            ['B', 'input4', ['', '', '', '', '', '', '', 'port4Enabled']]
        ];
    }
};
