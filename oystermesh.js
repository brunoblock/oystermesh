// Bruno Block
// v0.01

// GLOBAL VARS
window.OY_MESH_DYNASTY = "BRUNO_GENESIS_TESTNET";//mesh dynasty definition
window.OY_MESH_VERSION = 1;//mesh version, increments every significant code upgrade
window.OY_MESH_FLOW = 64000;//characters per second allowed per peer, and for all aggregate non-peer nodes
window.OY_MESH_MEASURE = 30;//seconds by which to measure mesh flow, larger means more tracking of nearby node, peer and sector activity
window.OY_MESH_PULL_BUFFER = 1.1;//multiplication factor for mesh inflow buffer, to give some leeway to compliant peers
window.OY_MESH_FWD_MAIN = 0.5;//probability that a peer will forward a data_push when the nonce was not previously stored on self
window.OY_MESH_FWD_BOOST = 0.65;//probability that a peer will forward a data_push when the nonce was previously stored on self
window.OY_MESH_TOLERANCE = 2;//max version iterations until peering is refused (similar to hard-fork)
window.OY_NODE_TOLERANCE = 3;//max amount of protocol communication violations until node is blacklisted
window.OY_NODE_BLACKTIME = 259200;//seconds to blacklist a punished node for
window.OY_NODE_PROPOSETIME = 60;//seconds for peer proposal session duration
window.OY_PEER_KEEPTIME = 30;//peers are expected to communicate with each other within this interval in seconds
window.OY_PEER_MAX = 5;//maximum mutual peers per zone (applicable difference is for gateway nodes)
window.OY_LATENCY_SIZE = 100;//size of latency ping payload, larger is more accurate yet more taxing, vice-versa applies
window.OY_LATENCY_REPEAT = 2;//how many ping round trips should be performed to conclude the latency test
window.OY_LATENCY_TOLERANCE = 2;//tolerance buffer factor for receiving ping requested from a proposed-to node
window.OY_LATENCY_MAX = 4;//max amount seconds for latency test before peership is refused or starts breaking down
window.OY_LATENCY_TRACK = 200;//how many latency measurements to keep at a time per peer
window.OY_DATA_MAX = 64000;//max size of data that can be sent to another node
window.OY_DATA_CHUNK = 2;//32000//chunk size by which data is split up and sent per transmission
window.OY_DATA_PUSH_INTERVAL = 800;//ms per chunk per push loop iteration
window.OY_DATA_PULL_INTERVAL = 200;//ms per chunk per pull loop iteration
window.OY_ENGINE_INTERVAL = 1000;//ms interval for core mesh engine to run, the time must clear a reasonable latency round-about

// INIT
window.OY_CONN = null;//global P2P connection handle
window.OY_INIT = 0;//prevents multiple instances of oy_init() from running simultaneously
window.OY_PEER_COUNT = 0;//how many active connections with mutual peers
window.OY_MAIN = {};//tracks important information that is worth persisting between sessions such as self ID
window.OY_ENGINE = [{}, {}];//tracking object for core engine variables, [0] is latency tracking
window.OY_DEPOSIT = {};//object for storing main payload data, crucial variable for mirroring to localStorage
window.OY_DATA = {};//object for tracking data push or pull threads
window.OY_PEERS = {};//optimization for quick and inexpensive checks for mutual peering
window.OY_NODES = {};//P2P connection handling for individual nodes, is not mirrored in localStorage due to DOM restrictions
window.OY_SECTORS = {};//handling and tracking sector allegiances TODO might turn into SECTOR_ALPHA and SECTOR_BETA
window.OY_LATENCY = {};//handle latency sessions
window.OY_PROPOSED = {};//nodes that have been recently proposed to for mutual peering
window.OY_BLACKLIST = {};//nodes to block for x amount of time

function oy_log(oy_log_msg, oy_log_flag) {
    if (typeof(oy_log_flag)==="undefined") oy_log_flag = 0;
    if (oy_log_flag===1) oy_log_msg = "FATAL ERROR: "+oy_log_msg;
    //TODO add custom interface for HTML console
    console.log(oy_log_msg);
}

function oy_gen_rand(oy_gen_custom) {
    if (typeof(oy_gen_custom)==="undefined") return "xxxxxxxx".replace(/x/g, oy_gen_rand_sub);
    return "x".repeat(oy_gen_custom).replace(/x/g, oy_gen_rand_sub);
}

function oy_gen_rand_sub() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}

function oy_reduce_sum(oy_reduce_total, oy_reduce_num) {
    return oy_reduce_total + oy_reduce_num;
}

function oy_handle_check() {
    return true;//TODO
}

function oy_local_store(oy_local_name, oy_local_data) {
    localStorage.setItem(oy_local_name, JSON.stringify(oy_local_data));
    oy_log("Updated localStorage retention of "+oy_local_name);
    return true;
}

function oy_local_get(oy_local_name) {
    let oy_local_raw = localStorage.getItem(oy_local_name);
    if (oy_local_raw===null||oy_local_raw.length===0) return {};
    let oy_local_data = JSON.parse(oy_local_raw);
    if (oy_local_data===null) return false;
    oy_log("Retrieved localStorage retention of "+oy_local_name);
    return oy_local_data;
}

function oy_peer_add(oy_peer_id) {
    if (typeof(window.OY_PEERS[oy_peer_id])!=='undefined') {
        oy_log("Failed to add node "+oy_peer_id+" to peer list that already exists in peer list");
        return false;//cancel if peer already exists in list
    }
    if (window.OY_PEER_COUNT>=window.OY_PEER_MAX) {
        oy_log("Failed to add node "+oy_peer_id+" whilst peer list is saturated");
        return false;//cancel if peer list is saturated
    }
    window.OY_PEERS[oy_peer_id] = [(Date.now()/1000), -1, -1, [], [], []];//[date added timestamp, last msg timestamp, latency avg, latency history, data push history, data pull history]
    window.OY_PEER_COUNT++;
    oy_local_store("oy_peers", window.OY_PEERS);
    return true;
}

function oy_peer_remove(oy_peer_id) {
    //TODO remember to implement sector compliance checks here
    if (typeof(window.OY_PEERS[oy_peer_id])==="undefined") {
        oy_log("Tried to remove non-existent peer", 1);
        return false;
    }
    oy_data_send(oy_peer_id, "OY_PEER_TERMINATE", null);
    window.OY_PEER_COUNT--;
    delete window.OY_PEERS[oy_peer_id];
    oy_local_store("oy_peers", window.OY_PEERS);
    oy_node_disconnect(oy_peer_id);
    if (window.OY_PEER_COUNT<0) {
        oy_log("Peer management system failed", 1);
        return false;
    }
}

//updates latency tracking of peer
function oy_peer_latency(oy_peer_id, oy_latency_new) {
    if (typeof(window.OY_PEERS[oy_peer_id])==="undefined") {
        oy_log("Peer latency tracking was called on a non-existent peer");
        return false;
    }
    window.OY_PEERS[oy_peer_id][3].unshift(oy_latency_new);
    if (window.OY_PEERS[oy_peer_id][3].length>window.OY_LATENCY_TRACK) {
        window.OY_PEERS[oy_peer_id][3].pop();
    }
    window.OY_PEERS[oy_peer_id][2] = (window.OY_PEERS[oy_peer_id][3].reduce(oy_reduce_sum))/window.OY_PEERS[oy_peer_id][3].length;
    oy_local_store("oy_peers", window.OY_PEERS);
    oy_log("Latency data updated for peer "+oy_peer_id);
}

//select a random peer for data pushing
function oy_peer_rand(oy_peers_local, oy_peers_exception) {
    for (let i in oy_peers_local) {
        if (oy_peers_exception.indexOf(i)!==-1) {
            delete oy_peers_local[i];
            delete oy_peers_exception[i];
        }
    }
    if (Object.keys(oy_peers_local).length===0) {
        oy_log("Tried to select a peer whilst the peer list ran empty");
        return false;
    }
    let oy_peers_keys = Object.keys(oy_peers_local);
    let oy_peer_select = oy_peers_keys[oy_peers_keys.length * Math.random() << 0];
    if (oy_data_measure(true, oy_peer_select, null)===false) {
        delete oy_peers_local[oy_peer_select];
        return oy_peer_rand(oy_peers_local, []);
    }
    return oy_peer_select;
}

//retrieve mutual peer definitions from localStorage
function oy_peers_get() {
    let oy_peers_raw = localStorage.getItem("oy_peers");
    if (oy_peers_raw===null||oy_peers_raw.length===0) return false;
    let oy_peers = JSON.parse(oy_peers_raw);
    if (oy_peers===null) return false;
    return oy_peers;
}

//remove all peer relationships, this function might only get used in manual instances
function oy_peers_reset() {
    let oy_peer_local;
    for (oy_peer_local in window.OY_PEERS) {
        oy_data_send(oy_peer_local, "OY_PEER_TERMINATE", null);
    }
    window.OY_PEERS = {};
    window.OY_PEER_COUNT = 0;
    localStorage.removeItem("oy_peers");
}

//process data sequence received from mutual peer oy_peer_id
function oy_peer_process(oy_peer_id, oy_data) {
    if (typeof(window.OY_PEERS[oy_peer_id])==="undefined") {
        oy_log("Tried to call peer_process on a non-existent peer", 1);
        return false;
    }
    window.OY_PEERS[oy_peer_id][1] = (Date.now()/1000);//update last msg timestamp for peer, no need to update localstorage via oy_local_store() (could be expensive)
    oy_log("Mutual peer "+oy_peer_id+" sent data sequence with flag: "+oy_data[4]);
    //is self's peer asking for self to refer some of self's other peers
    //I've decided it's better that nodes do not respond with acknowledgement packets for DATA_PUSH, to ease on mesh congestion. oy_engine() will make sure that peers are compliant anyways.
    if (oy_data[4]==="OY_DATA_PUSH") {
        //data received here will be committed to data_deposit without further checks, mesh flow restrictions from oy_init() are sufficient
        //oy_data[5] = [oy_data_handle, oy_data_nonce, oy_data_value]
        if (oy_data[5].length!==3||oy_handle_check(oy_data[5][0])===false||oy_data[5][2].length>window.OY_DATA_CHUNK) {
            oy_log("Peer "+oy_peer_id+" sent invalid DATA_PUSH data sequence, will punish");
            oy_node_punish(oy_peer_id);
            return false;
        }
        let oy_fwd_chance = window.OY_MESH_FWD_MAIN;
        if (typeof(window.OY_DEPOSIT[oy_data[5][0]])==="undefined") window.OY_DEPOSIT[oy_data[5][0]] = [];
        if (typeof(window.OY_DEPOSIT[oy_data[5][0]][oy_data[5][1]])!=="undefined") {
            oy_fwd_chance = window.OY_MESH_FWD_BOOST;
            oy_log("Handle "+oy_data[5][0]+" at nonce "+oy_data[5][1]+" is already stored, forwarding chances boosted");
        }
        else {
            //TODO implement old data removal for DEPOSIT, session and localStorage should have different values (session should handle more)
            window.OY_DEPOSIT[oy_data[5][0]][oy_data[5][1]] = oy_data[5][2];
            oy_local_store("oy_deposit", window.OY_DEPOSIT);
            oy_log("Stored handle "+oy_data[5][0]+" at nonce "+oy_data[5][1]);
        }
        let oy_peers_exception = [oy_peer_id];
        let oy_peer_select;
        for (let i = 0; i < window.OY_PEER_COUNT; i++) {
            if (Math.random()<=oy_fwd_chance) {
                oy_log("Randomness led to pushing handle "+oy_data[5][0]+" forward along the mesh");
                oy_peer_select = oy_data_route("OY_LOGIC_SPREAD", "OY_DATA_PUSH", oy_data[5], oy_peers_exception);
                if (oy_peer_select!==false) oy_peers_exception.push(oy_peer_select);
            }
        }
        return true;
    }
    else if (oy_data[4]==="OY_DATA_PULL") {

    }
    else if (oy_data[4]==="OY_PEER_LATENCY") {
        //TODO put conditions for obliging with peer latency requests, however generic restrictions from init and engine may be sufficient
        oy_data_send(oy_peer_id, "OY_LATENCY_RESPONSE", oy_data[5]);
    }
    else if (oy_data[4]==="OY_PEER_TERMINATE") {
        oy_peer_remove(oy_peer_id);//return the favour
        oy_log("Removed peer "+oy_peer_id+" who terminated peership first");
        //TODO should there be some game theory logic for blacklisting here?
        return true;
    }
    else if (oy_data[4]==="OY_PEER_REFER") {

    }
}

//checks if node is in mutually paired list
function oy_peer_check(oy_node_id) {
    return typeof(window.OY_PEERS[oy_node_id])!=="undefined";
}

function oy_node_connect(oy_node_id) {
    if (typeof(window.OY_NODES[oy_node_id])==="undefined"||window.OY_NODES[oy_node_id].disconnected===false) {
        var oy_local_conn = window.OY_CONN.connect(oy_node_id);
        oy_local_conn.on('open', function() {
            window.OY_NODES[oy_node_id] = oy_local_conn;
        });
        return true;
    }
    return false;
}

function oy_node_disconnect(oy_node_id) {
    if (typeof(window.OY_NODES[oy_node_id])!=="undefined"&&window.OY_NODES[oy_node_id].disconnected===false) {
        window.OY_NODES[oy_node_id].close();
        delete window.OY_NODES[oy_node_id];
        return true;
    }
    return false;
}

//checks for peering proposal session
function oy_node_proposed(oy_node_id) {
    if (typeof(window.OY_PROPOSED[oy_node_id])!=="undefined") {
        if (window.OY_PROPOSED[oy_node_id]<(Date.now()/1000)) {//check if proposal session expired
            delete window.OY_PROPOSED[oy_node_id];
            oy_local_store("oy_proposed", window.OY_PROPOSED);
            return false;
        }
        return true;
    }
    return false;
}

//checks if node is in blacklist
function oy_node_blocked(oy_node_id) {
    if (typeof(window.OY_BLACKLIST[oy_node_id])!=="undefined"&&window.OY_BLACKLIST[oy_node_id][0]>window.OY_NODE_TOLERANCE) {
        if (window.OY_BLACKLIST[oy_node_id][1]<(Date.now()/1000)) {
            delete window.OY_BLACKLIST[oy_node_id];//remove node from blacklist if block expiration was reached
            oy_local_store("oy_blacklist", window.OY_BLACKLIST);
            return false;
        }
        if (typeof(window.OY_PEERS[oy_node_id])!=="undefined") {
            oy_peer_remove(oy_node_id);
        }
        return true;
    }
    return false;
}

//increments a node's status in the blacklist subsystem
//might add some 'forgiveness buffer' for important nodes such as zone gateway nodes
function oy_node_punish(oy_node_id) {
    if (typeof(window.OY_BLACKLIST[oy_node_id])==="undefined") {
        window.OY_BLACKLIST[oy_node_id] = [1, (Date.now()/1000)+window.OY_NODE_BLACKTIME, false];//ban expiration time is defined here since we do not know if OY_NODE_TOLERANCE will change in the future
    }
    else {
        window.OY_BLACKLIST[oy_node_id][0]++;
        window.OY_BLACKLIST[oy_node_id][1] = (Date.now()/1000)+window.OY_NODE_BLACKTIME;
    }
    if (window.OY_BLACKLIST[oy_node_id][0]>window.OY_NODE_TOLERANCE&&oy_peer_check(oy_node_id)) {
        oy_peer_remove(oy_node_id);
    }
    oy_local_store("oy_blacklist", window.OY_BLACKLIST);
    return true;
}

//where the aggregate connectivity of the entire mesh begins
function oy_node_initiate(oy_node_id) {
    if (typeof(window.OY_PEERS[oy_node_id])!=="undefined") {
        oy_log("Tried to initiate peership with an already agreed upon peer");
        return false;
    }
    oy_data_send(oy_node_id, "OY_PEER_REQUEST", null);
    window.OY_PROPOSED[oy_node_id] = (Date.now()/1000)+window.OY_NODE_PROPOSETIME;//set proposal session with expiration timestamp
    oy_local_store("oy_proposed", window.OY_PROPOSED);
    return true;
}

//respond to a node that is not mutually peered with self
function oy_node_negotiate(oy_node_id, oy_data) {
    if (oy_data[4]==="OY_BLACKLIST") {
        oy_log("Node "+oy_node_id+" blacklisted us, will return the favour");
        oy_node_punish(oy_node_id);
        return false;
    }
    else if (oy_data[4]==="OY_PEER_TERMINATE") {
        oy_log("Received termination notice from non-peer, most likely we terminated him first");
        return false;
    }
    else if (oy_data[4]==="OY_PEER_AFFIRM") {
        oy_log("Received a peership affirmation notice from a non-peer, something went wrong");
        return false;
    }
    else if (oy_node_proposed(oy_node_id)) {//check if this node was previously proposed to for peering by self
        if (oy_data[4]==="OY_PEER_LATENCY") {//respond to latency ping from node with peer proposal arrangement
            oy_data_send(oy_node_id, "OY_LATENCY_RESPONSE", oy_data[5]);
        }
        else if (oy_data[4]==="OY_PEER_ACCEPT") {//node has accepted self's peer request
            oy_peer_add(oy_node_id);
            oy_data_send(oy_node_id, "OY_PEER_AFFIRM", null);//as of now, is not crucial nor mandatory
        }
        else if (oy_data[4]==="OY_PEER_REJECT") {//node has rejected self's peer request
            oy_log("Node "+oy_node_id+" rejected peer request with reason: "+oy_data[5]);
            oy_node_punish(oy_node_id);//we need to prevent nodes with far distances/long latencies from repeatedly communicating
            return true;
        }
    }
    else if (oy_data[4]==="OY_PEER_REQUEST") {
        oy_latency_test(oy_node_id, "OY_PEER_REQUEST", true);
        return true;
    }
    else if (oy_data[4]==="OY_PEER_LATENCY") {
        oy_log("Node "+oy_node_id+" sent a latency spark request whilst not a peer, will ignore");
        return false;
    }
    else {
        oy_log("Node "+oy_node_id+" sent an incoherent message");
        return false;
    }
}

function oy_latency_response(oy_node_id, oy_data) {
    if (typeof(window.OY_LATENCY[oy_node_id])==="undefined") {
        oy_log("Node "+oy_node_id+" sent a latency response whilst no latency session exists");
        return false;
    }
    if (window.OY_LATENCY[oy_node_id][0].repeat(window.OY_LATENCY_SIZE)===oy_data[5]) {//check if payload data matches latency session definition
        oy_log("Node "+oy_node_id+" sent a valid latency ping");

        if (typeof(window.OY_PEERS[oy_node_id])!=="undefined") {
            window.OY_PEERS[oy_node_id][1] = (Date.now()/1000);//update last msg timestamp for peer, no need to update localstorage via oy_local_store() (could be expensive)
        }

        window.OY_LATENCY[oy_node_id][2]++;
        window.OY_LATENCY[oy_node_id][4] += (Date.now()/1000)-window.OY_LATENCY[oy_node_id][3];//calculate how long the round trip took, and add it to aggregate time
        if (window.OY_LATENCY[oy_node_id][1]!==window.OY_LATENCY[oy_node_id][2]) {
            oy_log("There was a problem with the latency test with node "+oy_node_id+", perhaps simultaneous instances");
            return false;
        }
        if (window.OY_LATENCY[oy_node_id][2]>=window.OY_LATENCY_REPEAT) {
            let oy_latency_result = window.OY_LATENCY[oy_node_id][4]/window.OY_LATENCY[oy_node_id][2];
            oy_log("Finished latency test with node "+oy_node_id+" with average round-about: "+oy_latency_result+" seconds");
            if (window.OY_LATENCY[oy_node_id][5]==="OY_PEER_REQUEST") {
                //logic for accepting a peer request begins here
                if (oy_latency_result>window.OY_LATENCY_MAX) {
                    oy_data_send(oy_node_id, "OY_PEER_REJECT", "OY_REASON_LATENCY_BREACHES_MAX");
                    oy_node_punish(oy_node_id);
                }
                else if (window.OY_PEER_COUNT<window.OY_PEER_MAX) {
                    oy_data_send(oy_node_id, "OY_PEER_ACCEPT", null);
                    oy_peer_add(oy_node_id);
                    oy_peer_latency(oy_node_id, oy_latency_result);
                }
                else {
                    let oy_peer_weak = [false, -1];
                    let oy_peer_local;
                    for (oy_peer_local in window.OY_PEERS) {
                        if (window.OY_PEERS[oy_peer_local][2]>oy_peer_weak[1]) {
                            oy_peer_weak = [oy_peer_local, window.OY_PEERS[oy_peer_local][2]];
                        }
                    }
                    oy_log("Current weakest peer is "+oy_peer_weak[0]+" with latency of "+oy_peer_weak[1]);
                    if (oy_latency_result<oy_peer_weak[1]) {
                        oy_log("New peer request has better latency than current weakest peer");
                        oy_peer_remove(oy_peer_weak[0]);
                        oy_peer_add(oy_node_id);
                        oy_peer_latency(oy_node_id, oy_latency_result);
                        oy_log("Removed peer "+oy_peer_weak[0]+" and added peer "+oy_node_id);
                    }
                }
                delete window.OY_LATENCY[oy_node_id];
                return true;
            }
            else if (window.OY_LATENCY[oy_node_id][5]==="OY_PEER_CONNECT"||window.OY_LATENCY[oy_node_id][5]==="OY_PEER_ROUTINE") {
                oy_data_send(oy_node_id, "OY_PEER_AFFIRM", null);
                oy_peer_latency(oy_node_id, oy_latency_result);
                delete window.OY_LATENCY[oy_node_id];
                return true;
            }
            delete window.OY_LATENCY[oy_node_id];
            return false;
        }
        oy_latency_test(oy_node_id, window.OY_LATENCY[oy_node_id][5], false);
    }
}

//test latency performance between self and node
function oy_latency_test(oy_node_id, oy_latency_followup, oy_latency_new) {
    if (typeof(window.OY_LATENCY[oy_node_id])==="undefined") {
        //[0] is pending payload unique string
        //[1] is pings sent
        //[2] is valid pings received back
        //[3] is most start time for latency test timer
        //[4] is aggregate time taken (between all received pings)
        //[5] is followup flag i.e. what logic should follow after the latency test concludes
        window.OY_LATENCY[oy_node_id] = [0, 0, 0, 0, 0, oy_latency_followup];
    }
    else if (oy_latency_new===true) {
        oy_log("New duplicate latency instance was blocked");
        return false;
    }
    if (oy_latency_followup!==window.OY_LATENCY[oy_node_id][5]) {
        oy_log("Two simultaneous latency test instances crashed into each other", 1);
        return false;
    }
    //ping a unique payload string that is repeated OY_LATENCY_SIZE amount of times
    window.OY_LATENCY[oy_node_id][0] = oy_gen_rand(4);
    if (oy_data_send(oy_node_id, "OY_PEER_LATENCY", window.OY_LATENCY[oy_node_id][0].repeat(window.OY_LATENCY_SIZE))) {
        window.OY_LATENCY[oy_node_id][1]++;
        window.OY_LATENCY[oy_node_id][3] = (Date.now()/1000);
        oy_log("Latency ping sent to node "+oy_node_id);
        return true;
    }
    oy_log("Latency ping to node "+oy_node_id+" failed", 1);
    return false;
}

//measures data flow on the mesh in either push or pull direction
//returns false on mesh flow violation and true on compliance
function oy_data_measure(oy_data_push, oy_node_id, oy_data_length) {
    if (typeof(window.OY_PEERS[oy_node_id])==="undefined") {
        oy_log("Call to data_measure was made with non-existent peer: "+oy_node_id);
        return false;
    }
    let oy_time_local = Date.now()/1000|0;
    let oy_array_select;
    if (oy_data_push===false) oy_array_select = 5;
    else oy_array_select = 4;
    if (oy_data_length!==null) window.OY_PEERS[oy_node_id][oy_array_select].push([oy_time_local, oy_data_length]);
    if (window.OY_PEERS[oy_node_id][oy_array_select].length<10) return true;//do not punish node if there is an insufficient survey to determine accurate mesh flow
    while ((oy_time_local-window.OY_PEERS[oy_node_id][oy_array_select][0][0])>window.OY_MESH_MEASURE) window.OY_PEERS[oy_node_id][oy_array_select].shift();
    let oy_measure_total = 0;
    for (let i in window.OY_PEERS[oy_node_id][oy_array_select]) oy_measure_total += window.OY_PEERS[oy_node_id][oy_array_select][i][1];
    //either mesh overflow has occurred, parent function will respond accordingly, or mesh flow is in compliance
    return !((oy_measure_total/(oy_time_local-window.OY_PEERS[oy_node_id][oy_array_select][0][0]))>(window.OY_MESH_FLOW*((oy_data_push===false)?window.OY_MESH_PULL_BUFFER:1)));
}

//pushes data onto the mesh, data_logic indicates strategy for data pushing
function oy_data_push(oy_data_logic, oy_data_handle, oy_data_value) {
    oy_log("Pushing data with logic: "+oy_data_logic);
    if (typeof(window.OY_DATA[oy_data_handle])==="undefined") window.OY_DATA[oy_data_handle] = true;
    else if (window.OY_DATA[oy_data_handle]===false) {
        delete window.OY_DATA[oy_data_handle];
        oy_log("Cancelled data push attempt");
        return true;
    }
    let oy_data_nonce = 0;
    if (oy_data_value.length<window.OY_DATA_CHUNK) {
        oy_data_route(oy_data_logic, "OY_DATA_PUSH", [oy_data_handle, oy_data_nonce, oy_data_value], []);
    }
    else {
        for (let i = 0; i < oy_data_value.length; i += window.OY_DATA_CHUNK) {
            oy_data_route(oy_data_logic, "OY_DATA_PUSH", [oy_data_handle, oy_data_nonce, oy_data_value.slice(i, i+window.OY_DATA_CHUNK)], []);
            oy_data_nonce++;
        }
    }
    setTimeout("oy_data_push(\""+oy_data_logic+"\", \""+oy_data_handle+"\", \""+oy_data_value+"\")", window.OY_DATA_PUSH_INTERVAL*(oy_data_nonce+1));
}

//pulls data from the mesh
function oy_data_pull(oy_data_logic, oy_data_handle, oy_data_nonce_max) {
    let oy_data_nonce = 0;
    while (oy_data_nonce < oy_data_nonce_max) {
        oy_data_route(oy_data_logic, "OY_DATA_PULL", [oy_data_handle, oy_data_nonce, [window.OY_MAIN['oy_self_id']]], []);
        oy_data_nonce++;
    }
}

//routes data pushes and data forwards to the intended destination
function oy_data_route(oy_data_logic, oy_data_flag, oy_data_payload, oy_peers_exception) {
    let oy_peer_select = false;
    if (oy_data_logic==="OY_LOGIC_SPREAD") {
        let oy_peers_local = {};
        for (let i in window.OY_PEERS) {
            oy_peers_local[i] = window.OY_PEERS[i];
        }
        oy_peer_select = oy_peer_rand(oy_peers_local, oy_peers_exception);
        if (oy_peer_select===false) {
            oy_log("Data route doesn't have any available peers to send to");
            return false;
        }
        oy_log("Routing data via peer "+oy_peer_select+" with flag "+oy_data_flag);
        oy_data_send(oy_peer_select, oy_data_flag, oy_data_payload);
    }
    return oy_peer_select;
}

//initiates and keeps alive the P2P connection session
function oy_data_conn() {
    if (window.OY_CONN===null||window.OY_CONN.disconnected!==false) {
        if (typeof(window.OY_MAIN['oy_self_id'])==="undefined") {
            window.OY_MAIN['oy_self_id'] = oy_gen_rand();
            oy_local_store("oy_main", window.OY_MAIN);
            oy_log("Generated self ID "+window.OY_MAIN['oy_self_id']);
        }
        oy_log("Initiating new P2P session");
        window.OY_CONN = new Peer(window.OY_MAIN['oy_self_id'], {key: 'lwjd5qra8257b9'});
    }
    return !window.OY_CONN.disconnected;
}

//send data
function oy_data_send(oy_node_id, oy_data_flag, oy_data_payload) {
    if (!window.OY_CONN.disconnected&&!oy_data_conn()) {
        oy_log("Connection handler was unable to create a persisting P2P session", 1);
        return false;
    }
    if (oy_node_connect(oy_node_id)) {
        setTimeout("oy_data_send(\""+oy_node_id+"\", \""+oy_data_flag+"\", \""+oy_data_payload+"\")", 300);
        return true;//might need something more elegant/accurate here
    }
    let oy_data = [window.OY_MESH_DYNASTY, window.OY_MESH_VERSION, window.OY_MAIN['oy_self_id'], window.OY_ZONES, oy_data_flag, oy_data_payload];
    let oy_data_raw = JSON.stringify(oy_data);//convert data array to JSON
    if (oy_data_raw.length>window.OY_DATA_MAX) {
        oy_log("System is misconfigured, almost sent an excessively sized data sequence", 1);
        return false;
    }
    oy_log("Send data to node "+oy_node_id+": "+oy_data_raw);
    window.OY_NODES[oy_node_id].send(oy_data_raw);//send the JSON-converted data array to the destination node
    return true;
}

function oy_data_nonce(oy_data_length) {
    return Math.ceil(oy_data_length/window.OY_DATA_CHUNK);
}

//incoming data validation
//[0] is dynasty definition
//[1] is version difference tolerance
//[2] is sending node's identity
//[3] is sending node's zone allegiances
//[4] is payload definition
//[5] is payload
function oy_data_validate(oy_peer_id, oy_data_raw) {
   try {
       let oy_data = JSON.parse(oy_data_raw);
       if (oy_data&&typeof(oy_data)==="object"&&oy_data[2]===oy_peer_id&&oy_data[0]===window.OY_MESH_DYNASTY&&Math.abs(oy_data[1]-window.OY_MESH_VERSION)<=window.OY_MESH_TOLERANCE) {
           return oy_data;//only continue if dynasty and version of node is compliant
       }
   }
   catch (oy_error) {
       oy_log("Data validation exception occurred: "+oy_error);
   }
   oy_log("Node "+oy_peer_id+" failed validation");
   return false
}

//core loop that runs critical functions and checks
function oy_engine() {
    //service check on all peers
    let oy_time_local = (Date.now()/1000);
    let oy_time_diff;
    let oy_peer_local;
    for (oy_peer_local in window.OY_PEERS) {
        oy_time_diff = oy_time_local-window.OY_PEERS[oy_peer_local][1];
        if (oy_time_diff>window.OY_PEER_KEEPTIME) {
            if (typeof(window.OY_ENGINE[0][oy_peer_local])==="undefined") {
                oy_log("Engine initiating latency test with peer "+oy_peer_local+", time_diff of "+oy_time_diff+" with requirement of "+window.OY_PEER_KEEPTIME);
                window.OY_ENGINE[0][oy_peer_local] = true;
                oy_latency_test(oy_peer_local, "OY_PEER_CONNECT", true);
            }
            else {
                oy_log("Engine found non-responsive peer "+oy_peer_local+", will punish");
                oy_node_punish(oy_peer_local);
            }
        }
        else delete window.OY_ENGINE[0][oy_peer_local];
    }
    setTimeout("oy_engine()", window.OY_ENGINE_INTERVAL);
}

//initialize oyster mesh boot up sequence
function oy_init() {
    if (window.OY_INIT===1) {
        oy_log("Clashing instance of INIT prevented from running", 1);
        return false;
    }
    window.OY_INIT = 1;

    //recover session variables from localstorage
    window.OY_MAIN = oy_local_get("oy_main");

    if (!oy_data_conn()) {
        oy_log("Connection handler was unable to create a persisting P2P session", 1);
        return false
    }
    window.OY_DEPOSIT = oy_local_get("oy_deposit");
    window.OY_PEERS = oy_local_get("oy_peers");
    let oy_peer_local;
    for (oy_peer_local in window.OY_PEERS) {
        oy_log("Recovering peer "+oy_peer_local);
        window.OY_PEER_COUNT++;
        oy_node_connect(oy_peer_local);
        oy_latency_test(oy_peer_local, "OY_PEER_CONNECT", true);
    }
    window.OY_ZONES = oy_local_get("oy_sectors");
    window.OY_LATENCY = oy_local_get("oy_latency");
    window.OY_PROPOSED = oy_local_get("oy_proposed");
    window.OY_BLACKLIST = oy_local_get("oy_blacklist");

    //TODO scroll through PROPOSED and BLACKLIST to remove expired elements

    window.OY_CONN.on('open', function(oy_self_id) {
        oy_log("P2P connection ready with self ID "+oy_self_id);
    });
    window.OY_CONN.on('connection', function(oy_conn) {
        // Receive messages
        oy_conn.on('data', function (oy_data_raw) {
            //TODO put bandwidth restrictions for 1) aggregate non-peers 2) individual peers 3) sectors
            oy_log("Data with size "+oy_data_raw.length+" received from node "+oy_conn.peer);
            if (oy_data_raw.length>window.OY_DATA_MAX) {
                oy_log("Node "+oy_conn.peer+" sent an excessively sized data sequence, will punish and cease session");
                oy_node_punish(oy_conn.peer);
                return false;
            }
            let oy_data = oy_data_validate(oy_conn.peer, oy_data_raw);
            if (oy_data===false) {
                oy_log("Node "+oy_conn.peer+" sent invalid data, will punish and cease session");
                oy_node_punish(oy_conn.peer);
                return false;
            }
            if (oy_data[4]==="OY_LATENCY_RESPONSE") {
                oy_latency_response(oy_conn.peer, oy_data);
            }
            else if (oy_peer_check(oy_conn.peer)) {
                oy_log("Node "+oy_conn.peer+" is mutually peered");
                if (oy_data_measure(false, oy_conn.peer, oy_data_raw.length)===false) {
                    oy_log("Peer "+oy_conn.peer+" exceeded mesh flow compliance limits, will punish");
                    oy_node_punish(oy_conn.peer);
                }
                oy_peer_process(oy_conn.peer, oy_data)
            }
            else if (oy_node_blocked(oy_conn.peer)) {
                oy_log("Node "+oy_conn.peer+" is on blacklist, informed: "+window.OY_BLACKLIST[oy_conn.peer][2]);
                if (window.OY_BLACKLIST[oy_conn.peer][2]===false) {
                    window.OY_BLACKLIST[oy_conn.peer][2] = true;
                    oy_data_send(oy_conn.peer, "OY_BLACKLIST", null);
                }
            }
            else {
                oy_log("Node "+oy_conn.peer+" is either unknown or was recently proposed to for peering");
                oy_node_negotiate(oy_conn.peer, oy_data);
            }
        });
    });
    setTimeout("oy_engine()", 1);
}