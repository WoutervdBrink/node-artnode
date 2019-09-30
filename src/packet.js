const { jspack } = require('jspack');

module.exports = class Packet {
    get format() {
        return [];
    }

    get packFormat() {
        return this.format.map(([format, name]) => format).join('');
    }

    constructor(data = {}) {
        this._data = [];
        let counter = -1;
        this.format.forEach(([format, identifier, flags = []], count) => {
            counter++;
            // TODO: Very lazy solution to the variable scope problem.
            const i = counter / 1;
            this._data[i] = 0;
            if (identifier === 'x') {
                return;
            }

            if (identifier.match(/_lo$/)) {
                const name = identifier.substring(0, identifier.length - 3);
                Object.defineProperty(this, name, {
                    get: function () {
                        return this._data[i + 1] * 256 + this._data[i];
                    },
                    set: function (value) {
                        this[`${name}_hi`] = (value >> 8) & 0xFF;
                        this[`${name}_lo`] = value & 0xFF;
                    }
                });
            }

            Object.defineProperty(this, identifier, {
                get: function () {
                    return this._data[i];
                },
                set: function (value) {
                    this._data[i] = value;
                }
            });

            flags.forEach((flag, f) => {
                if (flag === '') {
                    return;
                }
                const mask = 0b10000000 >> f;
                Object.defineProperty(this, flag, {
                    get: function () {
                        return this._data[i] & mask ? true : false;
                    },
                    set: function (value) {
                        if (value) {
                            this._data[i] = this._data[i] | mask & 0xFF;
                            return;
                        }
                        this._data[i] = ~mask & this._data[i] & 0xFF;
                    }
                });

                if (data[flag]) {
                    this._data[i] = this._data[i] | mask & 0xFF;
                }
            });

            if (data[identifier]) {
                this._data[i] = data[identifier];
            } else {
                this._data[i] = 0;
            }
        });

        this.op = this.OP_CODE;
        this.id = 'Art-Net';
        if (this.hasOwnProperty('protocolVersion')) {
            this.protocolVersion = 14;
        }
    }

    read(packet) {
        this._data = [];
        const data = jspack.Unpack(this.packFormat, packet);
        if (typeof data === 'undefined') {
            throw new Error('Parse error');
        }
        this._data = data;
    }

    write() {
        return new Buffer(jspack.Pack(this.packFormat, this._data));
    }

    toString() {
        return this.format.map(([format, identifier, flags = []], i) => {
            if (identifier === 'x') {
                return '';
            }

            return `${identifier} (${format} @ ${i}): ${this._data[i]}`
                    + (flags.length ? '\n' + flags.filter((x) => x.length).map((flag) => `  - ${flag}: ${this[flag]}`).join('\n') : '');
        }).filter((x) => x.length).join('\n')
    }

    static read(packet) {
        const p = new this();
        p.read(packet);
        return p;
    }
}
