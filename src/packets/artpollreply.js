const Packet = require('../packet');

module.exports = class ArtPollReply extends Packet {
    get OP_CODE() {
        return 0x0021;
    }

    get format() {
        return [
            ['8s', 'id'],
            ['H', 'op'],
            ['4A', 'ip'],
            ['B', 'port_lo'],
            ['B', 'port_hi'],
            ['H', 'firmwareVersion'],
            ['B', 'net'],
            ['B', 'subnet'],
            ['B', 'oem_lo'],
            ['B', 'oem_hi'],
            ['B', 'ubeaVersion'],
            ['B', 'status1', ['', '', 'portsSetByNetwork', 'portsSetByFrontpanel', '', 'isFactoryBoot', 'rdmEnabled', 'ubeaEnabled']],
            ['B', 'estaCode_lo'],
            ['B', 'estaCode_hi'],
            ['18s', 'shortName'],
            ['64s', 'longName'],
            ['64s', 'nodeReport'],
            ['B', 'x'],
            ['B', 'numPorts'],
            ['B', 'port1', ['isPort1Output', 'isPort1Input', 'isPort1dmx', 'isPort1Avab', 'isPort1ColortranCmx', 'isPort1Adb625', 'isPort1ArtNet']],
            ['B', 'port2', ['isPort2Output', 'isPort2Input', 'isPort2dmx', 'isPort2Avab', 'isPort2ColortranCmx', 'isPort2Adb625', 'isPort2ArtNet']],
            ['B', 'port3', ['isPort3Output', 'isPort3Input', 'isPort3dmx', 'isPort3Avab', 'isPort3ColortranCmx', 'isPort3Adb625', 'isPort3ArtNet']],
            ['B', 'port4', ['isPort4Output', 'isPort4Input', 'isPort4dmx', 'isPort4Avab', 'isPort4ColortranCmx', 'isPort4Adb625', 'isPort4ArtNet']],
            ['B', 'inputPort1', ['port1Received', 'port1TestReceived', 'port1SipReceived', 'port1TextReceived', 'port1InputEnabled', 'port1ErrorsDetected', '', '']],
            ['B', 'inputPort2', ['port2Received', 'port2TestReceived', 'port2SipReceived', 'port2TextReceived', 'port2InputEnabled', 'port2ErrorsDetected', '', '']],
            ['B', 'inputPort3', ['port3Received', 'port3TestReceived', 'port3SipReceived', 'port3TextReceived', 'port3InputEnabled', 'port3ErrorsDetected', '', '']],
            ['B', 'inputPort4', ['port4Received', 'port4TestReceived', 'port4SipReceived', 'port4TextReceived', 'port4InputEnabled', 'port4ErrorsDetected', '', '']],
            ['B', 'outputPort1', ['port1Transmitted', 'port1TestTransmitted', 'port1SipTransmitted', 'port1TextTransmitted', 'port1Merging', 'port1Short', 'port1MergeHtp', '']],
            ['B', 'outputPort2', ['port2Transmitted', 'port2TestTransmitted', 'port2SipTransmitted', 'port2TextTransmitted', 'port2Merging', 'port2Short', 'port2MergeHtp', '']],
            ['B', 'outputPort3', ['port3Transmitted', 'port3TestTransmitted', 'port3SipTransmitted', 'port3TextTransmitted', 'port3Merging', 'port3Short', 'port3MergeHtp', '']],
            ['B', 'outputPort4', ['port4Transmitted', 'port4TestTransmitted', 'port4SipTransmitted', 'port4TextTransmitted', 'port4Merging', 'port4Short', 'port4MergeHtp', '']],
            ['B', 'swIn1'],
            ['B', 'swIn2'],
            ['B', 'swIn3'],
            ['B', 'swIn4'],
            ['B', 'swOut1'],
            ['B', 'swOut2'],
            ['B', 'swOut3'],
            ['B', 'swOut4'],
            // SwVideo, SwMacro and SwRemote are deprecated
            ['B', 'x'], ['B', 'x'], ['B', 'x'],
            // Three spares
            ['B', 'x'], ['B', 'x'], ['B', 'x'],
            ['B', 'style'],
            ['6A', 'mac'],
            ['4A', 'bindIp'],
            ['B', 'bindIndex'],
            ['B', 'status2', ['', '', '', '', 'isArtNet3', 'dhcpEnabled', 'hasDhcpConfig', 'hasWebInterface']]
        ];
    }
};
