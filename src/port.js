const PropertyContainer = require('./propertycontainer');

module.exports = class Port extends PropertyContainer {
    constructor() {
        super();

        this._defineBoolean('isOutput');
        this._defineBoolean('isInput');
        this._defineBoolean('isDmx');
        this._defineBoolean('isAvab');
        this._defineBoolean('isColortranCmx');
        this._defineBoolean('isAdb625');
        this._defineBoolean('isArtNet');

        this._defineBoolean('received');
        this._defineBoolean('testReceived');
        this._defineBoolean('sipReceived');
        this._defineBoolean('textReceived');
        this._defineBoolean('inputEnabled');
        this._defineBoolean('errorsDetected');

        this._defineBoolean('transmitted');
        this._defineBoolean('testTransmitted');
        this._defineBoolean('sipTransmitted');
        this._defineBoolean('textTransmitted');
        this._defineBoolean('merging');
        this._defineBoolean('short');
        this._defineBoolean('mergeHtp');

        this._defineDouble('inAddress');
        this._defineDouble('outAddress');
    }
}
