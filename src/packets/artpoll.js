const Packet = require('../packet');

module.exports = class ArtPoll extends Packet {
    get OP_CODE() {
        return 0x2000;
    }

    get format() {
        return [
            ['8s', 'id'],
            ['B', 'op_lo'],
            ['B', 'op_hi'],
            ['h', 'protocolVersion'],
            ['B', 'flags', ['', '', '', 'vlc', 'unicastDiagnostics', 'diagnostics', 'unilateralPollReply', '']],
            ['B', 'priority']
        ];
    }
};
