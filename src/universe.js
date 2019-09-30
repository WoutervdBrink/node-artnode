const { EventEmitter } = require('events');

module.exports = class Universe extends EventEmitter {
    constructor(universe) {
        super();

        this._data = new Uint8Array(512);
        this._universe = universe;
    }

    get universe() {
        return this._universe;
    }

    get data() {
        return new Uint8Array(this._data);
    }

    readDmx(packet) {
        const data = packet.data;
        let changed = [];

        for (let i = 0; i < 512; i++) {
            if (data[i] !== this._data[i]) {
                changed.push({
                    address: i,
                    value: data[i]
                });
                this._data[i] = data[i];
            }
        }

        if (changed.length) {
            this.emit('data', { data, changed });
        }
    }
};