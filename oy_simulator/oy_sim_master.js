const fs = require("fs");

const oy_base = "/dev/shm/oy_simulator";
if (!fs.existsSync(oy_base)) fs.mkdirSync(oy_base);

oy_log("OYSTER SIMULATOR BOOT-UP INITIATED");

function oy_log(oy_log_msg) {
    fs.writeFile(oy_base+"/oy_sim_control.log", "["+(Date.now()/1000)+"] "+oy_log_msg);
    console.log(oy_log_msg);
}

//run spawn() on sim_control.js. mesh characteristics are decided here