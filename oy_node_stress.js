const Worker = require('worker_threads').Worker;
let keccak256 = require('js-sha3').keccak256;

function oy_worker_internal() {
    let parentPort = require('worker_threads').parentPort;
    keccak256 = require('js-sha3').keccak256;

    parentPort.on('message', (oy_data) => {
        console.log("THREAD: "+oy_data);
        while (true) keccak256(Math.random().toString());
    });
}

const oy_worker_define = "("+oy_worker_internal.toString()+")()";

let oy_worker_array = [];
for (let i=0;i<8;i++) {
    oy_worker_array.push(new Worker(oy_worker_define, {eval:true}));
}
for (let i in oy_worker_array) {
    oy_worker_array[i].postMessage(i);
}