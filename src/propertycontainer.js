module.exports = class PropertyContainer {
    constructor() {
        this._properties = [];
    }

    _defineProperty(name, initialValue = 0, validator = null, getTransformer = null) {
        this._properties[name] = initialValue;

        Object.defineProperty(this, name, {
            get: (value) => {
                if (getTransformer) {
                    return getTransformer(this._properties[name]);
                }
                return this._properties[name];
            },
            set: (value) => {
                if (validator) {
                    value = validator(value);
                }
                this._properties[name] = value;
            }
        });
    }

    _defineByte(name, initialValue = 0) {
        this._defineProperty(name, initialValue, (value) => {
            value = parseInt(value);
            if (value < 0 || value > 255) {
                throw new Error(`${name} should be a byte.`);
            }
            return value;
        });
    }

    _defineDouble(name, initialValue = 0) {
        this._defineProperty(name, initialValue, (value) => {
            value = parseInt(value);
            if (value < 0 || value > 0xFFFF) {
                throw new Error(`${name} should be a byte.`);
            }
            return value;
        });
    }

    _defineString(name, length) {
        this._defineProperty(name, '', (value) => {
            value = String(value);
            if (value.length > length) {
                throw new Error(`${name} has a maximum length of ${length}.`);
            }
            return value;
        });
    }

    _defineIp(name, length) {
        this._defineProperty(name, [0, 0, 0, 0], (value) => {
            value = Array.from(value);
            if (!Array.isArray(value) || value.length !== 4) {
                throw new Error(`${name} should be an array of four bytes.`);
            }

            for (let i = 0; i < 4; i++) {
                value[i] = parseInt(value[i]);

                if (value[i] < 0 || value[i] > 0xFF) {
                    throw new Error(`${name} should be an array of four bytes.`);
                }
            }

            return value;
        });
    }

    _defineMac(name, length) {
        this._defineProperty(name, [0, 0, 0, 0], (value) => {
            if (!Array.isArray(value) || value.length !== 6) {
                throw new Error(`${name} should be an array of six bytes.`);
            }

            for (let i = 0; i < 6; i++) {
                value[i] = parseInt(value[i]);

                if (value[i] < 0 || value[i] > 0xFF) {
                    throw new Error(`${name} should be an array of six bytes.`);
                }
            }

            return value;
        });
    }

    _defineBoolean(name, initialValue = false) {
        this._defineProperty(name, initialValue, (value) => {
            return value ? true : false;
        });
    }
}
