# ArtNode
A Node.JS work-in-progress implementation of [Art-Net](https://art-net.org.uk/), a protocol which allows for DMX512
communications over ethernet.

# Setting up
Install the package using `npm` or `yarn`:

```shell script
npm install artnode
# or
yarn add artnode
```

# Options
TODO

# Examples

## Listening for DMX
```javascript
const ArtNet = require('../src/artnet');

const artnet = new Artnet({isController: true});

/*
   use getUniverse(0, false) to receive every data packet
   regardless of whether they contain changes to previous
   data or not
*/
const universe = artnet.getUniverse(0);

universe.on('data', ({ data, changed }) => {
    changed.forEach(({ address, value }) => {
        console.log(`DMX ${address} set to ${value}.`);
    });
    
    data.forEach((value, address) => {
        console.log(`DMX ${address} is ${value}`);
    });
});

artnet.start();
```

## Device discovery
```javascript
const { ArtNet } = require('artnode');

const artnet = new ArtNet({isController: true});

artnet.on('device', (device) => {
    console.log(`New device: ${device.shortName} @ ${device.ip}`);
});

artnet.on('deviceOffline', (device) => {
    console.log(`Device ${device.shortName} @ ${device.ip} went offline.`);
});

artnet.start();
```
