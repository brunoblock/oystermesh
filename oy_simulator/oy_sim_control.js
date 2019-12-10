const fs = require("fs");
const { Worker, isMainThread } = require('worker_threads');

const oy_mesh_id = "123456789";

const oy_base = "/dev/shm/oy_simulator/"+oy_mesh_id;
if (!fs.existsSync(oy_base)) fs.mkdirSync(oy_base);

let OY_NODES = {};
let OY_NODES_PRE = {};

oy_log("MESH CONTROL BOOT FOR: "+oy_mesh_id);

function oy_log(oy_log_msg) {
    fs.writeFile(oy_base+"/oy_sim_control.log", "["+(Date.now()/1000)+"] "+oy_log_msg);
    console.log(oy_log_msg);
}

function oy_rand_gen(oy_gen_custom, oy_rand_secure) {
    if (typeof(oy_gen_custom)==="undefined") oy_gen_custom = 1;
    if (typeof(oy_rand_secure)!=="undefined"&&oy_rand_secure===true) return oy_uint8_hex(nacl.randomBytes(oy_gen_custom*2));
    let oy_rand_gen_fast = function() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    };
    if (oy_gen_custom===1) return oy_rand_gen_fast();
    return "x".repeat(oy_gen_custom).replace(/x/g, oy_rand_gen_fast);
}

if (isMainThread) {
    oy_log("ERROR: Mesh control instance was assigned main thread");
}
else {
    let oy_node_id_pre = oy_rand_gen(4);
    OY_NODES_PRE[oy_node_id_pre] = new Worker("/srv/oystermesh.js");

    OY_NODES_PRE[oy_node_id_pre].once('message', (message) => {
        console.log("["+oy_node_id_pre+"] "+message);
    });
}