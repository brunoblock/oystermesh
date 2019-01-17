// Bruno Block
// v0.1

// GLOBAL VARS
window.OY_MESH_DYNASTY = "BRUNO_GENESIS_TESTNET";//mesh dynasty definition
window.OY_MESH_VERSION = 1;//mesh version, increments every significant code upgrade
window.OY_MESH_FLOW = 4000;//characters per second allowed per peer, and for all aggregate non-peer nodes
window.OY_MESH_MEASURE = 30;//seconds by which to measure mesh flow, larger means more tracking of nearby node, peer and sector activity
window.OY_MESH_PULL_BUFFER = 2.25;//multiplication factor for mesh inflow buffer, to give some leeway to compliant peers
window.OY_MESH_PUSH_MAIN = 0.1;//probability that a peer will forward a data_push when the nonce was not previously stored on self
window.OY_MESH_PUSH_BOOST = 0.3;//probability that a peer will forward a data_push when the nonce was previously stored on self
window.OY_MESH_PULL_MAIN = 0.1;//probability that a peer will forward a data_pull when the nonce was found on self
window.OY_MESH_PULL_BOOST = 0.4;//probability that a peer will forward a data_pull when the nonce was not found on self
window.OY_MESH_FULLFILL = 0.05;//probability that data is stored whilst fulfilling a pull request, this makes data intelligently migrate and refresh overtime
window.OY_MESH_SOURCE = 3;//node in route passport (from destination) that is assigned with defining the source variable
window.OY_MESH_TOLERANCE = 2;//max version iterations until peering is refused (similar to hard-fork)
window.OY_NODE_TOLERANCE = 3;//max amount of protocol communication violations until node is blacklisted
window.OY_NODE_BLACKTIME = 259200;//seconds to blacklist a punished node for
window.OY_NODE_PROPOSETIME = 60;//seconds for peer proposal session duration
window.OY_PEER_LATENCYTIME = 60;//peers are expected to communicate with each other within this interval in seconds
window.OY_PEER_KEEPTIME = 8;//peers are expected to communicate with each other within this interval in seconds
window.OY_PEER_REFERTIME = 20;//interval in which self asks peers for peer recommendations (as needed)
window.OY_PEER_MAX = 5;//maximum mutual peers per zone (applicable difference is for gateway nodes)
window.OY_LATENCY_SIZE = 100;//size of latency ping payload, larger is more accurate yet more taxing, vice-versa applies
window.OY_LATENCY_REPEAT = 2;//how many ping round trips should be performed to conclude the latency test
window.OY_LATENCY_TOLERANCE = 2;//tolerance buffer factor for receiving ping requested from a proposed-to node
window.OY_LATENCY_MAX = 40;//max amount of seconds for latency test before peership is refused or starts breaking down
window.OY_LATENCY_TRACK = 200;//how many latency measurements to keep at a time per peer
window.OY_DATA_MAX = 64000;//max size of data that can be sent to another node
window.OY_DATA_CHUNK = 8000;//32000//chunk size by which data is split up and sent per transmission
window.OY_DATA_PUSH_INTERVAL = 500;//ms per chunk per push loop iteration
window.OY_DATA_PULL_INTERVAL = 250;//ms per chunk per pull loop iteration
window.OY_DEPOSIT_CHAR = 100000;//character rate for data deposit sizing, helps establish storage limits
window.OY_DEPOSIT_MAX_BUFFER = 0.9;//max character length capacity factor of data deposit (0.9 means 10% buffer until hard limit is reached)
window.OY_DEPOSIT_COMMIT = 5;//commit data to disk every 10 nonce pushes
//window.OY_SECTOR_PEERSHIP = 3600;//seconds required of continuous peership until a sector can be joined or formed
window.OY_SECTOR_MAX = 50;//max amount of nodes that can belong to a single sector
window.OY_SECTOR_EXPOSURE = 3;//minimum amount of peers to have belong to a designated sector for director to accept new member
window.OY_ENGINE_INTERVAL = 2000;//ms interval for core mesh engine to run, the time must clear a reasonable latency round-about

// INIT
window.OY_CONN = null;//global P2P connection handle
window.OY_INIT = 0;//prevents multiple instances of oy_init() from running simultaneously
window.OY_PEER_COUNT = 0;//how many active connections with mutual peers
window.OY_DEPOSIT_MAX = 0;//max localStorage capacity with buffer considered
window.OY_MAIN = {};//tracks important information that is worth persisting between sessions such as self ID
window.OY_MAIN['oy_deposit_size'] = 0;//aggregate size of current data deposit
window.OY_MAIN['oy_deposit_counter'] = 0;//counter for tracking deposit commit
window.OY_ENGINE = [{}, {}];//tracking object for core engine variables, [0] is latency tracking
window.OY_DEPOSIT = {};//object for storing main payload data, crucial variable for mirroring to localStorage
window.OY_PURGE = [];//track order of DEPOSIT to determine what data gets deleted ('purged') first
window.OY_COLLECT = {};//object for tracking pull fulfillments
window.OY_CONSTRUCT = {};//data considered valid from OY_COLLECT is stored here, awaiting for final data reconstruction
window.OY_DATA_PUSH = {};//object for tracking data push threads
window.OY_DATA_PULL = {};//object for tracking data pull threads
window.OY_PEERS = {"oy_aggregate_node":[-1, -1, -1, [], [], [], [null, null]]};//optimization for quick and inexpensive checks for mutual peering
window.OY_NODES = {};//P2P connection handling for individual nodes, is not mirrored in localStorage due to DOM restrictions
window.OY_SECTOR_ALPHA = [null, null, 0, 0, []];//handling and tracking of sector alpha allegiance
window.OY_SECTOR_BETA = [null, null, 0, 0, []];//handling and tracking of sector beta allegiance
window.OY_LATENCY = {};//handle latency sessions
window.OY_PROPOSED = {};//nodes that have been recently proposed to for mutual peering
window.OY_REFER = {};//track when a node was asked by self for a recommendation
window.OY_BLACKLIST = {};//nodes to block for x amount of time

function oy_log(oy_log_msg, oy_log_flag) {
    if (typeof(oy_log_flag)==="undefined") oy_log_flag = 0;
    if (oy_log_flag===1) oy_log_msg = "FATAL ERROR: "+oy_log_msg;
    //TODO add custom interface for HTML console
    console.log(oy_log_msg);
}

function oy_gen_rand(oy_gen_custom) {
    function oy_gen_rand_sub() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    if (typeof(oy_gen_custom)==="undefined") return "xxxxxxxx".replace(/x/g, oy_gen_rand_sub);
    return "x".repeat(oy_gen_custom).replace(/x/g, oy_gen_rand_sub);
}

function oy_gen_hash(oy_data_value) {
    return CryptoJS.SHA1(oy_data_value).toString()
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
    if (oy_local_raw===null||oy_local_raw.length===0) {
        if (oy_local_name==="oy_peers") return {"oy_aggregate_node":[-1, -1, -1, [], [], [], [null, null]]};
        else if (oy_local_name==="oy_purge") return [];
        return {};
    }
    let oy_local_data = JSON.parse(oy_local_raw);
    if (oy_local_data===null) return false;
    oy_log("Retrieved localStorage retention of "+oy_local_name);
    return oy_local_data;
}

//tests localstorage capacity, function ported from FrozenJar
function oy_local_check() {
    function oy_local_check_sub(oy_counter, oy_heavy) {
        try {
            localStorage.setItem("oy_store_check_"+oy_counter, oy_heavy);
            return true;
        }
        catch(e) {
            return false;
        }
    }
    localStorage.clear();
    let oy_heavy = "0123456789".repeat(window.OY_DEPOSIT_CHAR/10);
    let oy_counter = 0;
    while (oy_local_check_sub(oy_counter, oy_heavy)) oy_counter++;
    oy_heavy = null;
    localStorage.clear();
    return oy_counter;
}

function oy_peer_add(oy_peer_id) {
    if (oy_peer_check(oy_peer_id)) {
        oy_log("Failed to add node "+oy_peer_id+" to peer list that already exists in peer list");
        return false;//cancel if peer already exists in list
    }
    if (window.OY_PEER_COUNT>=window.OY_PEER_MAX) {
        oy_log("Failed to add node "+oy_peer_id+" whilst peer list is saturated");
        return false;//cancel if peer list is saturated
    }
    window.OY_PEERS[oy_peer_id] = [-1, -1, -1, [], [], [], [null, null]];//[last msg timestamp, last latency timestamp, latency avg, latency history, data push history, data pull history, sector allegiances]
    window.OY_PEER_COUNT++;
    oy_local_store("oy_peers", window.OY_PEERS);
    oy_node_connect(oy_peer_id);
    return true;
}

function oy_peer_remove(oy_peer_id) {
    //TODO remember to implement sector compliance checks here
    if (!oy_peer_check(oy_peer_id)) {
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

//remove all peer relationships, this function might only get used in manual instances
function oy_peers_reset() {
    let oy_peer_local;
    for (oy_peer_local in window.OY_PEERS) {
        if (oy_peer_local==="oy_aggregate_node") continue;
        oy_data_send(oy_peer_local, "OY_PEER_TERMINATE", null);
        oy_node_disconnect(oy_peer_local);
    }
    window.OY_PEERS = {};
    window.OY_PEER_COUNT = 0;
    localStorage.removeItem("oy_peers");
}

//updates latency tracking of peer
function oy_peer_latency(oy_peer_id, oy_latency_new) {
    if (!oy_peer_check(oy_peer_id)) {
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
    return oy_peers_keys[oy_peers_keys.length * Math.random() << 0];
}

//process data sequence received from mutual peer oy_peer_id
function oy_peer_process(oy_peer_id, oy_data) {
    if (!oy_peer_check(oy_peer_id)) {
        oy_log("Tried to call peer_process on a non-existent peer", 1);
        return false;
    }
    window.OY_PEERS[oy_peer_id][0] = (Date.now()/1000);//update last msg timestamp for peer, no need to update localstorage via oy_local_store() (could be expensive)
    oy_log("Mutual peer "+oy_peer_id+" sent data sequence with flag: "+oy_data[4]);
    //I've decided it's better that nodes do not respond with acknowledgement packets for DATA_PUSH, to ease on mesh congestion. oy_engine() will make sure that peers are compliant anyways.
    if (oy_data[4]==="OY_DATA_PUSH") {//store received data and potentially forward the push request to peers
        //data received here will be committed to data_deposit without further checks, mesh flow restrictions from oy_init() are sufficient
        //oy_data[5] = [oy_data_handle, oy_data_nonce, oy_data_value]
        if (oy_data[5].length!==3||oy_handle_check(oy_data[5][0])===false||oy_data[5][2].length>window.OY_DATA_CHUNK) {
            oy_log("Peer "+oy_peer_id+" sent invalid DATA_PUSH data sequence, will punish");
            oy_node_punish(oy_peer_id);
            return false;
        }
        let oy_fwd_chance = window.OY_MESH_PUSH_MAIN;
        if (!oy_data_deposit(oy_data[5][0], oy_data[5][1], oy_data[5][2])) {
            oy_fwd_chance = window.OY_MESH_PUSH_BOOST;
            oy_log("Handle "+oy_data[5][0]+" at nonce "+oy_data[5][1]+" is already stored, forwarding chances boosted");
        }
        let oy_peers_exception = [oy_peer_id];
        let oy_peer_select;
        for (let i = 0; i < window.OY_PEER_COUNT; i++) {
            if (Math.random()<=oy_fwd_chance) {
                oy_log("Randomness led to pushing handle "+oy_data[5][0]+" forward along the mesh");
                oy_peer_select = oy_data_route(["OY_LOGIC_SPREAD"], "OY_DATA_PUSH", oy_data[5], oy_peers_exception);
                if (oy_peer_select!==false) oy_peers_exception.push(oy_peer_select);
            }
        }
        return true;
    }
    else if (oy_data[4]==="OY_DATA_PULL") {
        //oy_data[5] = [oy_route_passport, oy_data_handle]
        if (oy_data[5].length!==2||oy_handle_check(oy_data[5][1])===false) {
            oy_log("Peer "+oy_peer_id+" sent invalid DATA_PULL data sequence, will punish");
            oy_node_punish(oy_peer_id);
            return false;
        }
        if (oy_data[5][0].indexOf(window.OY_MAIN['oy_self_id'])!==-1) {
            oy_log("Received a pull request that self already processed before, will ignore");
            return false;
        }
        let oy_fwd_chance = window.OY_MESH_PULL_BOOST;
        if (typeof(window.OY_DEPOSIT[oy_data[5][1]])!=="undefined") {
            oy_log("Found nonce(s) for handle "+oy_data[5][1]);
            for (let oy_data_nonce in window.OY_DEPOSIT[oy_data[5][1]]) {//scroll through all available nonces of the requested handle
                //DATA_FULFILL has a defined payload of: [0] is the route passport (return back to the peer doing the original pull), [1] is the handle, [2] is the nonce, [3] is the source, [4] is the data
                setTimeout(function() {
                    oy_data_route(["OY_LOGIC_REVERSE"], "OY_DATA_FULFILL", [oy_data[5][0], oy_data[5][1], oy_data_nonce,
                        (oy_data[5][0].length===window.OY_MESH_SOURCE)?oy_data[5][0].join():"oy_source_void", window.OY_DEPOSIT[oy_data[5][1]][oy_data_nonce]]);
                }, oy_data_nonce*500);
            }
            oy_fwd_chance = window.OY_MESH_PULL_MAIN;
        }
        let oy_peers_exception = [oy_peer_id];
        let oy_peer_select;
        for (let i = 0; i < window.OY_PEER_COUNT; i++) {
            if (Math.random()<=oy_fwd_chance) {
                oy_log("Randomness led to pulling handle "+oy_data[5][1]+" forward along the mesh");
                oy_data[5][0].push(window.OY_MAIN['oy_self_id']);
                oy_peer_select = oy_data_route(["OY_LOGIC_SPREAD"], "OY_DATA_PULL", oy_data[5], oy_peers_exception);
                if (oy_peer_select!==false) oy_peers_exception.push(oy_peer_select);
            }
        }
    }
    else if (oy_data[4]==="OY_DATA_FULFILL") {
        //oy_data[5] = [oy_route_passport, oy_data_handle, oy_data_nonce, oy_data_source, oy_data_value]
        if (oy_data[5].length!==5||oy_handle_check(oy_data[5][1])===false||oy_data[5][0].length===0) {
            oy_log("Peer "+oy_peer_id+" sent invalid DATA_FULFILL data sequence, will punish");
            oy_node_punish(oy_peer_id);
            return false;
        }
        if (oy_data[5][0][0]===window.OY_MAIN['oy_self_id']) {
            oy_log("Data fulfillment sequence with handle "+oy_data[5][1]+" at nonce "+oy_data[5][2]+" found self as the intended final destination");
            oy_data_collect(oy_data[5][1], oy_data[5][2], oy_data[5][3], oy_data[5][4]);
        }
        else {//carry on reversing the passport until the data reaches the intended destination
            oy_log("Continuing fulfillment of handle "+oy_data[5][1]);
            if (oy_data[5][0].length===window.OY_MESH_SOURCE) oy_data[5][3] = oy_data[5][0].join();
            oy_data_route(["OY_LOGIC_REVERSE"], "OY_DATA_FULFILL", oy_data[5]);
            if (Math.random()>window.OY_MESH_FULLFILL) {
                oy_log("Data deposit upon mesh fulfill invoked");
                oy_data_deposit(oy_data[5][1], oy_data[2], oy_data[4]);
            }
        }
        return true;
    }
    else if (oy_data[4]==="OY_PEER_LATENCY") {
        oy_log("Responding to latency request from peer "+oy_peer_id);
        oy_data_send(oy_peer_id, "OY_LATENCY_RESPONSE", oy_data[5]);
    }
    else if (oy_data[4]==="OY_PEER_TERMINATE") {
        oy_peer_remove(oy_peer_id);//return the favour
        oy_node_punish(oy_peer_id);
        oy_log("Removed and punished peer "+oy_peer_id+" who terminated peership first");
        return true;
    }
    else if (oy_data[4]==="OY_PEER_REFER") {//is self's peer asking for self to refer some of self's other peers
        let oy_peers_local = {};
        for (let oy_peer_local in window.OY_PEERS) {
            if (oy_peer_local==="oy_aggregate_node") continue;
            oy_peers_local[oy_peer_local] = window.OY_PEERS[oy_peer_local];
        }
        let oy_peer_select = oy_peer_rand(oy_peers_local, [oy_peer_id]);
        if (oy_peer_select===false) {
            oy_log("Self doesn't have any available peers to recommend");
            return false;
        }
        oy_data_send(oy_peer_id, "OY_PEER_RECOMMEND", oy_peer_select);
    }
    else if (oy_data[4]==="OY_PEER_RECOMMEND") {
        if (oy_peer_id===oy_data[5]) {
            oy_log("Peer "+oy_peer_id+" recommended themselves, will punish");
            oy_node_punish(oy_peer_id);
        }
        oy_node_initiate(oy_data[5]);
    }
    else if (oy_data[4]==="OY_SECTOR_SURVEY") {
        if (window.OY_SECTOR_ALPHA[0]!==null&&window.OY_SECTOR_ALPHA[2]<window.OY_SECTOR_MAX) {
            oy_data_send(oy_peer_id, "OY_SECTOR_RESPONSE", window.OY_SECTOR_ALPHA);
            oy_log("Sent "+oy_peer_id+" information on sector alpha");
        }
        else if (window.OY_SECTOR_BETA[0]!==null&&window.OY_SECTOR_BETA[2]<window.OY_SECTOR_MAX) {
            oy_data_send(oy_peer_id, "OY_SECTOR_RESPONSE", window.OY_SECTOR_BETA);
            oy_log("Sent "+oy_peer_id+" information on sector beta");
        }
    }
    else if (oy_data[4]==="OY_SECTOR_RESPONSE") {
        if (window.OY_SECTOR_ALPHA[0]===null||window.OY_SECTOR_BETA[0]===null) {
            oy_log("Received sector response whilst needing new sector(s)");
            //[0] is sector ID, [1] is director ID, [2] is sector size, [3] is sector genesis date [4] is sector itinerary
            if (oy_data[5][2]>=window.OY_SECTOR_MAX) {
                oy_log("Received a sector that is already full, will punish");
                oy_node_punish(oy_peer_id);
                return false;
            }
            else if (window.OY_PEER_COUNT<window.OY_SECTOR_EXPOSURE) {
                oy_log("Insufficient peer count to join sector "+oy_data[5][0]);
                return false;
            }
            else {
                let oy_sector_peers = [];
                let oy_sector_exposure_local = 0;
                for (let oy_peer_local in window.OY_PEERS[oy_peer_id]) {
                    if (oy_peer_local==="oy_aggregate_node") continue;
                    if (window.OY_PEERS[oy_peer_id][oy_peer_local][6].indexOf(oy_data[5][0])!==-1) {
                        oy_sector_peers.push(oy_peer_local);
                        oy_sector_exposure_local++;
                    }
                }
                if (oy_sector_exposure_local<window.OY_SECTOR_EXPOSURE) {
                    oy_log("Self has insufficient exposure to join sector "+oy_data[5][0]);
                    return false;
                }
                else {
                    oy_log("Self has sufficient exposure to join sector "+oy_data[5][0]);
                    oy_data_route(["OY_LOGIC_SECTOR_DIRECTOR", oy_data[5][0], oy_data[5][1]], "OY_SECTOR_JOIN", null, oy_sector_peers);
                }
            }
        }
        else {
            oy_log("Received sector response whilst sectors have already been established");
            return false;
        }
    }
}

//checks if node is in mutually paired list
function oy_peer_check(oy_node_id) {
    return typeof(window.OY_PEERS[oy_node_id])!=="undefined";
}

function oy_node_connect(oy_node_id, oy_callback) {
    if (oy_node_id===false||oy_node_id===window.OY_MAIN['oy_self_id']) {
        oy_log("Tried to connect to invalid node ID", 1);//functions need to validate node_id before forwarding here
        return false;
    }
    if (typeof(window.OY_NODES[oy_node_id])==="undefined"||window.OY_NODES[oy_node_id].open===false) {
        oy_log("Connection warming up with node "+oy_node_id);
        let oy_local_conn = window.OY_CONN.connect(oy_node_id);
        if (typeof(oy_local_conn)==="undefined") {
              oy_log("Connection to node "+oy_node_id+" failed");
              return false;
        }
        else {
            oy_local_conn.on('open', function() {
                window.OY_NODES[oy_node_id] = oy_local_conn;
                oy_log("Connection status: "+window.OY_NODES[oy_node_id].open+" with node "+oy_node_id);
                if (typeof(oy_callback)==="function") oy_callback();
            });
        }
        return oy_local_conn;
    }
    return window.OY_NODES[oy_node_id];
}

function oy_node_disconnect(oy_node_id) {
    if (typeof(window.OY_NODES[oy_node_id])!=="undefined"&&window.OY_NODES[oy_node_id].open===true) {
        window.OY_NODES[oy_node_id].close();
        delete window.OY_NODES[oy_node_id];
        oy_log("Disconnected from node "+oy_node_id);
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
        if (oy_peer_check(oy_node_id)) oy_peer_remove(oy_node_id);
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
    if (oy_peer_check(oy_node_id)) {
        oy_log("Tried to initiate peership with an already agreed upon peer");
        return false;
    }
    let oy_local_callback = function() {
        oy_data_send(oy_node_id, "OY_PEER_REQUEST", null);
        window.OY_PROPOSED[oy_node_id] = (Date.now()/1000)+window.OY_NODE_PROPOSETIME;//set proposal session with expiration timestamp
        oy_local_store("oy_proposed", window.OY_PROPOSED);
    };
    if (oy_node_connect(oy_node_id, oy_local_callback).open===true) oy_local_callback();
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
        oy_node_punish(oy_node_id);
        return false;
    }
    else if (oy_node_proposed(oy_node_id)) {//check if this node was previously proposed to for peering by self
        if (oy_data[4]==="OY_PEER_LATENCY") {//respond to latency ping from node with peer proposal arrangement
            oy_data_send(oy_node_id, "OY_LATENCY_RESPONSE", oy_data[5]);
        }
        else if (oy_data[4]==="OY_PEER_ACCEPT") {//node has accepted self's peer request
            oy_latency_test(oy_node_id, "OY_PEER_ACCEPT", true);
            //oy_peer_add(oy_node_id);
            //oy_data_send(oy_node_id, "OY_PEER_AFFIRM", null);//as of now, is not crucial nor mandatory
        }
        else if (oy_data[4]==="OY_PEER_REJECT") {//node has rejected self's peer request
            oy_log("Node "+oy_node_id+" rejected peer request with reason: "+oy_data[5]);
            oy_node_punish(oy_node_id);//we need to prevent nodes with far distances/long latencies from repeatedly communicating
            return true;
        }
    }
    else if (oy_data[4]==="OY_PEER_REQUEST") {
        let oy_local_callback = function() {
            oy_latency_test(oy_node_id, "OY_PEER_REQUEST", true);
        };
        if (oy_node_connect(oy_node_id, oy_local_callback).open===true) oy_local_callback();
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

        if (oy_peer_check(oy_node_id)) window.OY_PEERS[oy_node_id][0] = (Date.now()/1000);//update last msg timestamp for peer, no need to update localstorage via oy_local_store() (could be expensive)

        window.OY_LATENCY[oy_node_id][2]++;
        window.OY_LATENCY[oy_node_id][4] += (Date.now()/1000)-window.OY_LATENCY[oy_node_id][3];//calculate how long the round trip took, and add it to aggregate time
        if (window.OY_LATENCY[oy_node_id][1]!==window.OY_LATENCY[oy_node_id][2]) {
            oy_log("There was a problem with the latency test with node "+oy_node_id+", perhaps simultaneous instances");
            return false;
        }
        if (window.OY_LATENCY[oy_node_id][2]>=window.OY_LATENCY_REPEAT) {
            let oy_latency_result = window.OY_LATENCY[oy_node_id][4]/window.OY_LATENCY[oy_node_id][2];
            oy_log("Finished latency test with node "+oy_node_id+" with average round-about: "+oy_latency_result+" seconds");
            if (oy_peer_check(oy_node_id)) window.OY_PEERS[oy_node_id][1] = (Date.now()/1000);
            if (window.OY_LATENCY[oy_node_id][5]==="OY_PEER_REQUEST"||window.OY_LATENCY[oy_node_id][5]==="OY_PEER_ACCEPT") {
                //logic for accepting a peer request begins here
                if (oy_latency_result>window.OY_LATENCY_MAX) {
                    if (window.OY_LATENCY[oy_node_id][5]==="OY_PEER_ACCEPT") oy_data_send(oy_node_id, "OY_PEER_TERMINATE", "OY_REASON_LATENCY_BREACHES_MAX");
                    else oy_data_send(oy_node_id, "OY_PEER_REJECT", "OY_REASON_LATENCY_BREACHES_MAX");
                    oy_node_punish(oy_node_id);
                }
                else if (window.OY_PEER_COUNT<window.OY_PEER_MAX) {
                    oy_data_send(oy_node_id, "OY_PEER_ACCEPT", null);
                    oy_peer_add(oy_node_id);
                    oy_peer_latency(oy_node_id, oy_latency_result);
                    if (window.OY_LATENCY[oy_node_id][5]==="OY_PEER_ACCEPT") oy_data_send(oy_node_id, "OY_PEER_AFFIRM", null);//as of now, is not crucial nor mandatory
                }
                else {
                    let oy_peer_weak = [false, -1];
                    let oy_peer_local;
                    for (oy_peer_local in window.OY_PEERS) {
                        if (oy_peer_local==="oy_aggregate_node") continue;
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
                        if (window.OY_LATENCY[oy_node_id][5]==="OY_PEER_ACCEPT") oy_data_send(oy_node_id, "OY_PEER_AFFIRM", null);//as of now, is not crucial nor mandatory
                        oy_log("Removed peer "+oy_peer_weak[0]+" and added peer "+oy_node_id);
                    }
                    else {
                        oy_log("New peer request has insufficient latency");
                        if (window.OY_LATENCY[oy_node_id][5]==="OY_PEER_ACCEPT") oy_data_send(oy_node_id, "OY_PEER_TERMINATE", "OY_REASON_LATENCY_INSUFFICIENT");
                        else oy_data_send(oy_node_id, "OY_PEER_REJECT", "OY_REASON_LATENCY_INSUFFICIENT");
                        oy_node_punish(oy_node_id);
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
    if (!oy_peer_check(oy_node_id)&&oy_node_id!=="oy_aggregate_node") {
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
    for (let oy_peer_local in window.OY_PEERS[oy_node_id][oy_array_select]) oy_measure_total += window.OY_PEERS[oy_node_id][oy_array_select][oy_peer_local][1];
    //either mesh overflow has occurred (parent function will respond accordingly), or mesh flow is in compliance
    return !((oy_measure_total/(oy_time_local-window.OY_PEERS[oy_node_id][oy_array_select][0][0]))>(window.OY_MESH_FLOW*((oy_data_push===false)?window.OY_MESH_PULL_BUFFER:1)));
}

//pushes data onto the mesh, data_logic indicates strategy for data pushing
function oy_data_push(oy_data_logic, oy_data_value, oy_data_handle) {
    let oy_data_superhandle = false;
    if (typeof(oy_data_handle)==="undefined") {
        oy_data_handle = oy_gen_hash(oy_data_value);
        oy_data_superhandle = oy_data_handle+Math.ceil(oy_data_value.length/window.OY_DATA_CHUNK);
    }
    oy_log("Pushing handle "+oy_data_handle+" with logic: "+oy_data_logic);
    if (typeof(window.OY_DATA_PUSH[oy_data_handle])==="undefined") window.OY_DATA_PUSH[oy_data_handle] = true;
    else if (window.OY_DATA_PUSH[oy_data_handle]===false) {
        delete window.OY_DATA_PUSH[oy_data_handle];
        oy_log("Cancelled data push loop");
        return true;
    }
    let oy_data_nonce = 0;
    if (oy_data_value.length<window.OY_DATA_CHUNK) {
        oy_data_route(oy_data_logic, "OY_DATA_PUSH", [oy_data_handle, oy_data_nonce, oy_data_value], []);
    }
    else {
        for (let i = 0; i < oy_data_value.length; i += window.OY_DATA_CHUNK) {
            //TODO potentially stagger the timing of each nonce push
            oy_data_route(oy_data_logic, "OY_DATA_PUSH", [oy_data_handle, oy_data_nonce, oy_data_value.slice(i, i+window.OY_DATA_CHUNK)], []);
            oy_data_nonce++;
        }
    }
    setTimeout(function() {
        oy_data_push(oy_data_logic, oy_data_value, oy_data_handle);
    }, window.OY_DATA_PUSH_INTERVAL*(oy_data_nonce+1));
    if (oy_data_superhandle!==false) return oy_data_superhandle;
}

//pulls data from the mesh
function oy_data_pull(oy_callback, oy_data_logic, oy_data_handle, oy_data_nonce_max) {
    if (typeof(oy_data_nonce_max)==="undefined") {
        oy_data_nonce_max = parseInt(oy_data_handle.substr(40));
        oy_data_handle = oy_data_handle.substr(0, 40);//40 is for length of SHA1
    }
    oy_log("Pulling handle "+oy_data_handle+" with logic: "+oy_data_logic);
    if (typeof(window.OY_DATA_PULL[oy_data_handle])==="undefined") window.OY_DATA_PULL[oy_data_handle] = true;
    else if (window.OY_DATA_PULL[oy_data_handle]===false) {
        delete window.OY_DATA_PULL[oy_data_handle];
        delete window.OY_COLLECT[oy_data_handle];
        delete window.OY_CONSTRUCT[oy_data_handle];
        oy_log("Cancelled data pull loop");
        return false;
    }
    oy_data_route(oy_data_logic, "OY_DATA_PULL", [[window.OY_MAIN['oy_self_id']], oy_data_handle], []);

    //check OY_COLLECT to see if anything came back
    if (typeof(window.OY_COLLECT[oy_data_handle])==="undefined") window.OY_COLLECT[oy_data_handle] = {};
    if (typeof(window.OY_CONSTRUCT[oy_data_handle])==="undefined") window.OY_CONSTRUCT[oy_data_handle] = [];
    for (let oy_data_nonce in window.OY_COLLECT[oy_data_handle]) {
        if (oy_data_nonce>=oy_data_nonce_max) continue;
        let oy_source_highest = 0;
        let oy_source_data = null;
        for (let oy_data_value in window.OY_COLLECT[oy_data_handle][oy_data_nonce]) {
            if (window.OY_COLLECT[oy_data_handle][oy_data_nonce][oy_data_value].length>oy_source_highest) {
                oy_source_highest = window.OY_COLLECT[oy_data_handle][oy_data_nonce][oy_data_value].length;
                oy_source_data = oy_data_value;
            }
        }
        window.OY_CONSTRUCT[oy_data_handle][oy_data_nonce] = oy_source_data;
        oy_log("Committed construct for "+oy_data_handle+" at nonce "+oy_data_nonce);
    }
    if (window.OY_CONSTRUCT[oy_data_handle].length===oy_data_nonce_max) {
        oy_log("Construct for "+oy_data_handle+" achieved all nonces");
        let oy_data_construct = window.OY_CONSTRUCT[oy_data_handle].join("");
        if (oy_data_handle===oy_gen_hash(oy_data_construct)) {
            oy_log("Construct for "+oy_data_handle+" cleared hash check");
            delete window.OY_DATA_PULL[oy_data_handle];
            delete window.OY_COLLECT[oy_data_handle];
            delete window.OY_CONSTRUCT[oy_data_handle];
            oy_callback(oy_data_handle+oy_data_nonce_max, oy_data_construct);
            return true;//end the pull loop
        }
        else oy_log("Construct for "+oy_data_handle+" failed hash check");
    }
    setTimeout(function() {
        oy_data_pull(oy_callback, oy_data_logic, oy_data_handle, oy_data_nonce_max);
    }, window.OY_DATA_PULL_INTERVAL*oy_data_nonce_max);
}

function oy_data_collect(oy_data_handle, oy_data_nonce, oy_data_source, oy_data_value) {
    if (!oy_handle_check(oy_data_handle)) {
        oy_log("Collect received an invalid handle, will not process");
        return false;
    }
    if (typeof(window.OY_COLLECT[oy_data_handle])==="undefined") window.OY_COLLECT[oy_data_handle] = {};
    if (typeof(window.OY_COLLECT[oy_data_handle][oy_data_nonce])==="undefined") window.OY_COLLECT[oy_data_handle][oy_data_nonce] = {};
    if (typeof(window.OY_COLLECT[oy_data_handle][oy_data_nonce][oy_data_value])==="undefined") window.OY_COLLECT[oy_data_handle][oy_data_nonce][oy_data_value] = [oy_data_source];
    else if (window.OY_COLLECT[oy_data_handle][oy_data_nonce][oy_data_value].indexOf(oy_data_source)===-1) window.OY_COLLECT[oy_data_handle][oy_data_nonce][oy_data_value].push(oy_data_source);
}

//routes data pushes and data forwards to the intended destination
function oy_data_route(oy_data_logic, oy_data_flag, oy_data_payload, oy_peers_define) {
    let oy_peer_select = false;
    if (oy_data_logic[0]==="OY_LOGIC_SPREAD") {
        let oy_peers_local = {};
        for (let oy_peer_local in window.OY_PEERS) {
            if (oy_peer_local==="oy_aggregate_node") continue;
            oy_peers_local[oy_peer_local] = window.OY_PEERS[oy_peer_local];
        }
        oy_peer_select = oy_peer_rand(oy_peers_local, oy_peers_define);
        if (oy_peer_select===false) {
            oy_log("Data route doesn't have any available peers to send to");
            return false;
        }
        oy_log("Routing data via peer "+oy_peer_select+" with flag "+oy_data_flag);
        oy_data_send(oy_peer_select, oy_data_flag, oy_data_payload);
    }
    else if (oy_data_logic[0]==="OY_LOGIC_REVERSE") {
        oy_peer_select = oy_data_payload[0].pop();//select the next peer on the passport
        if (oy_data_payload[0].length===0) oy_data_payload[0].push(oy_peer_select);
        oy_data_send(oy_peer_select, oy_data_flag, oy_data_payload);
    }
    else if (oy_data_logic[0]==="OY_LOGIC_SECTOR_DIRECTOR") {
        if ((window.OY_SECTOR_ALPHA[0]===oy_data_logic[1]&&window.OY_SECTOR_ALPHA[1]===oy_data_logic[2])||(window.OY_SECTOR_BETA[0]===oy_data_logic[1]&&window.OY_SECTOR_BETA[1]===oy_data_logic[2])) {
            oy_log("Recognized sector but wrong director is assigned");
            return false;
        }
        let oy_director_find = oy_peers_define.indexOf(oy_data_logic[2]);
        if (oy_director_find!==-1) oy_data_send(oy_peers_define[oy_director_find], oy_data_flag, oy_data_payload);
        else {
            for (let i in oy_peers_define) {
                oy_data_send(oy_peers_define[i], oy_data_flag, oy_data_payload);
            }
        }
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
    let oy_local_callback = function() {
        let oy_data = [window.OY_MESH_DYNASTY, window.OY_MESH_VERSION, window.OY_MAIN['oy_self_id'], [window.OY_SECTOR_ALPHA[0], window.OY_SECTOR_BETA[0]], oy_data_flag, oy_data_payload];
        let oy_data_raw = JSON.stringify(oy_data);//convert data array to JSON
        if (oy_data_raw.length>window.OY_DATA_MAX) {
            oy_log("System is misconfigured, almost sent an excessively sized data sequence", 1);
            return false;
        }
        if (oy_data_flag==="OY_DATA_PUSH"&&oy_peer_check(oy_node_id)&&oy_data_measure(true, oy_node_id, null)===false) {
            oy_log("Cooling off, skipping OY_DATA_PUSH to "+oy_node_id);
            return true;
        }
        oy_data_measure(true, oy_node_id, oy_data_raw.length);
        window.OY_NODES[oy_node_id].send(oy_data_raw);//send the JSON-converted data array to the destination node
        oy_log("Sent data to node "+oy_node_id+": "+oy_data_raw);
    };
    if (oy_node_connect(oy_node_id, oy_local_callback).open===true) oy_local_callback();
    return true;
}

//deposits data for local retention
function oy_data_deposit(oy_data_handle, oy_data_nonce, oy_data_value) {
    if (typeof(window.OY_DEPOSIT[oy_data_handle])==="undefined") window.OY_DEPOSIT[oy_data_handle] = [];
    if (typeof(window.OY_DEPOSIT[oy_data_handle][oy_data_nonce])!=="undefined") return false;
    window.OY_DEPOSIT[oy_data_handle][oy_data_nonce] = oy_data_value;
    window.OY_MAIN['oy_deposit_size'] += oy_data_value.length;
    window.OY_PURGE = window.OY_PURGE.filter(oy_handle => oy_handle!==oy_data_handle);
    window.OY_PURGE.push(oy_data_handle);
    let oy_safety_overflow = 0;
    while (window.OY_MAIN['oy_deposit_size']>window.OY_DEPOSIT_MAX) {
        let oy_deposit_local = window.OY_PURGE.shift();
        window.OY_MAIN['oy_deposit_size'] -= window.OY_DEPOSIT[oy_deposit_local].join("").length;
        delete window.OY_DEPOSIT[oy_deposit_local];
        if (oy_safety_overflow++>1000) break;
    }
    oy_log("Stored handle "+oy_data_handle+" at nonce "+oy_data_nonce);
    if (window.OY_MAIN['oy_deposit_counter']>=window.OY_DEPOSIT_COMMIT) {
        oy_local_store("oy_deposit", window.OY_DEPOSIT);
        oy_local_store("oy_purge", window.OY_PURGE);
        window.OY_MAIN['oy_deposit_counter'] = 0;
        oy_log("Committed data to disk");
    }
    else window.OY_MAIN['oy_deposit_counter']++;
    return true;
}

//incoming data validation
//[0] is dynasty definition
//[1] is version difference tolerance
//[2] is sending node's identity
//[3] is sending node's sector allegiances
//[4] is payload definition
//[5] is payload
function oy_data_validate(oy_peer_id, oy_data_raw) {
   try {
       let oy_data = JSON.parse(oy_data_raw);
       if (oy_data&&typeof(oy_data)==="object"&&oy_data[2]===oy_peer_id&&oy_data[0]===window.OY_MESH_DYNASTY&&Math.abs(oy_data[1]-window.OY_MESH_VERSION)<=window.OY_MESH_TOLERANCE) {
           window.OY_PEERS[oy_peer_id][6][0] = oy_data[3][0];
           window.OY_PEERS[oy_peer_id][6][1] = oy_data[3][1];//no need to update localstorage, sector allegiances get updated frequently enough
           return oy_data;//only continue if dynasty and version of node are compliant
       }
   }
   catch (oy_error) {
       oy_log("Data validation exception occurred: "+oy_error);
   }
   oy_log("Node "+oy_peer_id+" failed validation");
   return false
}

//asks peers for sectors that are available for peering
function oy_sector_survey() {
    oy_data_route(["OY_LOGIC_SPREAD"], "OY_SECTOR_SURVEY", null, []);
}

//core loop that runs critical functions and checks
function oy_engine() {
    //TODO scroll through PROPOSED and BLACKLIST to remove expired elements
    //service check on all peers
    let oy_time_local = (Date.now()/1000);
    let oy_time_diff_last;
    let oy_time_diff_latency;
    let oy_peer_local;
    for (oy_peer_local in window.OY_PEERS) {
        if (oy_peer_local==="oy_aggregate_node") continue;
        oy_time_diff_last = oy_time_local-window.OY_PEERS[oy_peer_local][0];
        oy_time_diff_latency = oy_time_local-window.OY_PEERS[oy_peer_local][1];
        if (oy_time_diff_last>window.OY_PEER_KEEPTIME||oy_time_diff_latency>window.OY_PEER_LATENCYTIME) {
            if (typeof(window.OY_ENGINE[0][oy_peer_local])==="undefined") {
                oy_log("Engine initiating latency test with peer "+oy_peer_local+"):" +
                    "time_diff_last: "+oy_time_diff_last+"/"+window.OY_PEER_KEEPTIME+", time_diff_latency: "+oy_time_diff_latency+"/"+window.OY_PEER_LATENCYTIME);
                window.OY_ENGINE[0][oy_peer_local] = oy_time_local;
                oy_latency_test(oy_peer_local, "OY_PEER_CONNECT", true);
            }
            else if (oy_time_local-window.OY_ENGINE[0][oy_peer_local]>window.OY_LATENCY_MAX) {
                oy_log("Engine found non-responsive peer "+oy_peer_local+" with latency lag: "+(oy_time_local-window.OY_ENGINE[0][oy_peer_local])+", will punish");
                oy_node_punish(oy_peer_local);
            }
        }
        else delete window.OY_ENGINE[0][oy_peer_local];
        if (window.OY_PEER_COUNT<window.OY_PEER_MAX&&oy_peer_check(oy_peer_local)) {
            if (typeof(window.OY_REFER[oy_peer_local])==="undefined"||(oy_time_local-window.OY_REFER[oy_peer_local])>window.OY_PEER_REFERTIME) {
                window.OY_REFER[oy_peer_local] = oy_time_local;
                oy_data_send(oy_peer_local, "OY_PEER_REFER", null);
                oy_log("Asked peer "+oy_peer_local+" for peer recommendation");
            }
        }
    }
    if (window.OY_PEER_COUNT>=window.OY_SECTOR_EXPOSURE&&(window.OY_SECTOR_ALPHA[0]===null||window.OY_SECTOR_BETA[0]===null)) {
        oy_log("Engine initiating sector survey to discover unfulfilled sector(s)");
        oy_sector_survey();
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
    window.OY_PURGE = oy_local_get("oy_purge");
    window.OY_PEERS = oy_local_get("oy_peers");
    let oy_peer_local;
    for (oy_peer_local in window.OY_PEERS) {
        if (oy_peer_local==="oy_aggregate_node") continue;
        oy_log("Recovering peer "+oy_peer_local);
        window.OY_PEER_COUNT++;
        oy_node_connect(oy_peer_local);
        oy_latency_test(oy_peer_local, "OY_PEER_CONNECT", true);
    }
    window.OY_SECTOR_ALPHA = oy_local_get("oy_sector_alpha");
    window.OY_SECTOR_BETA = oy_local_get("oy_sector_beta");
    window.OY_LATENCY = oy_local_get("oy_latency");
    window.OY_PROPOSED = oy_local_get("oy_proposed");
    window.OY_BLACKLIST = oy_local_get("oy_blacklist");

    //resets localstorage and tests storage limit
    window.OY_DEPOSIT_MAX = Math.floor((oy_local_check()*window.OY_DEPOSIT_CHAR)*window.OY_DEPOSIT_MAX_BUFFER);

    //restore localstorage
    oy_local_store("oy_main", window.OY_MAIN);
    oy_local_store("oy_deposit", window.OY_DEPOSIT);
    oy_local_store("oy_purge", window.OY_PURGE);
    oy_local_store("oy_peers", window.OY_PEERS);
    oy_local_store("oy_sector_alpha", window.OY_SECTOR_ALPHA);
    oy_local_store("oy_sector_beta", window.OY_SECTOR_BETA);
    oy_local_store("oy_latency", window.OY_LATENCY);
    oy_local_store("oy_proposed", window.OY_PROPOSED);
    oy_local_store("oy_blacklist", window.OY_BLACKLIST);

    window.OY_CONN.on('open', function(oy_self_id) {
        oy_log("P2P connection ready with self ID "+oy_self_id);
    });
    window.OY_CONN.on('connection', function(oy_conn) {
        // Receive messages
        oy_conn.on('data', function (oy_data_raw) {
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
                oy_peer_process(oy_conn.peer, oy_data);
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
                if (oy_data_measure(false, "oy_aggregate_node", oy_data_raw.length)===false) oy_log("Node "+oy_conn.peer+" pushed aggregate mesh flow compliance beyond limit");
                else oy_node_negotiate(oy_conn.peer, oy_data);
            }
        });
    });
    setTimeout("oy_engine()", 1);
}