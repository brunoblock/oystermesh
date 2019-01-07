// Bruno Block
// v0.01

// GLOBAL VARS
window.OY_MESH_DYNASTY = "BRUNO_GENESIS_TESTNET";//mesh dynasty definition
window.OY_MESH_VERSION = 1;//mesh version, increments every significant code upgrade
window.OY_MESH_TOLERANCE = 2;//max version iterations until peering is refused (similar to hard-fork)
window.OY_NODE_TOLERANCE = 3;//max amount of protocol communication violations until node is blacklisted
window.OY_NODE_BLACKTIME = 604800;//seconds to blacklist a punished node for
window.OY_PEER_MAX = 9;//maximum mutual peers per zone (applicable difference is for gateway nodes)

// INIT
window.OY_CONN = null;//global P2P connection handle
window.OY_INIT = 0;//prevents multiple instances of oy_init() from running simultaneously
window.OY_PEERS = {};//optimization for quick and inexpensive checks for mutual peering and connection handling
window.OY_BLACKLIST = {};//nodes to block for x amount of time
window.OY_PROPOSED = {};//nodes that have been recently proposed to for mutual peering

function oy_log(oy_log_msg, oy_log_flag) {
    if (typeof(oy_log_flag)==="undefined") oy_log_flag = 0;
    if (oy_log_flag===1) oy_log_msg = "FATAL ERROR: "+oy_log_msg;
    //TODO add custom interface for HTML console
    console.log(oy_log_msg);
}

function oy_gen_id(oy_zone) {
    if (oy_zone===false) return "xxxxxxxx".replace(/x/g, oy_gen_id_sub);
    return "xxxx".replace(/x/g, oy_gen_id_sub);
}
function oy_gen_id_sub() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}

function oy_peer_add(oy_peer_id) {
    var oy_peer_local = [Date.now()/1000|0, 0, -1, []];//[date added, last msg, latency avg, latency history]
    var oy_peers = oy_peers_get();
    if (oy_peers===false) oy_peers = {};
    if (typeof oy_peers[oy_peer_id]!=='undefined') return false;//cancel if peer already exists in list
    if (oy_peers.length >= window.OY_PEER_MAX) {
        //TODO purge weakest peer
    }
    oy_peers[oy_peer_id] = oy_peer_local;
    localStorage.setItem("oy_peers", JSON.stringify(oy_peers));
    window.OY_PEERS[oy_peer_id] = true;
    return true;
}

function oy_peer_remove(oy_peer_id) {
    //TODO remember to implement zone compliance checks here
}

//checks if peer is still valid for mutual peering
function oy_peer_verify(oy_peer_id) {

}

function oy_peers_verify() {
    //scroll through all peers and invoke oy_peer_verify()
}

function oy_peers_get() {
    var oy_peers_raw = localStorage.getItem("oy_peers");
    if (oy_peers_raw===null||oy_peers_raw.length===0) return false;
    var oy_peers = JSON.parse(oy_peers_raw);
    if (oy_peers===null) return false;
    return oy_peers;
}

function oy_peers_clear() {
    localStorage.removeItem("oy_peers");
    window.OY_PEERS = {};
}

function oy_peer_process(oy_peer_id, oy_data) {
    //is self's peer asking for self to refer some of self's other peers
    if (oy_data[4]==="OY_PEER_REFER") {

    }
}

//checks if node is in mutually paired list
function oy_node_check(oy_node_id) {
    return typeof(window.OY_PEERS[oy_peer_id])!=="undefined";
}

//checks for peering proposal session
function oy_node_proposed(oy_node_id) {

}

//checks if node is in blacklist
function oy_node_blocked(oy_node_id) {
    if (typeof(window.OY_BLACKLIST[oy_node_id])!=="undefined"&&window.OY_BLACKLIST[oy_node_id][0]>window.OY_NODE_TOLERANCE) {
        if (window.OY_BLACKLIST[oy_node_id][1]>(Date.now()/1000|0)) {
            delete window.OY_BLACKLIST[oy_node_id];//remove node from blacklist if block expiration was reached
            return false;
        }
        oy_peer_remove(oy_node_id);
        return true;
    }
    return false;
}

//increments a node's status in the blacklist subsystem
//might add some 'forgiveness buffer' for important nodes such as zone gateway nodes
function oy_node_punish(oy_node_id) {
    if (typeof(window.OY_BLACKLIST[oy_node_id])==="undefined") {
        window.OY_BLACKLIST[oy_node_id] = [1, (Date.now()/1000|0)+window.OY_NODE_BLACKTIME];//ban expiration time is defined here since we do not know if OY_NODE_TOLERANCE will change in the future
    }
    else {
        window.OY_BLACKLIST[oy_node_id][0]++;
        window.OY_BLACKLIST[oy_node_id][1] = (Date.now()/1000|0)+window.OY_NODE_BLACKTIME;
    }
    if (window.OY_BLACKLIST[oy_node_id][0]>window.OY_NODE_TOLERANCE&&oy_node_check(oy_node_id)) {
        oy_peer_remove(oy_node_id);
    }
}

function oy_node_negotiate(oy_node_id, oy_data) {
    //check if this node was previously proposed to for peering by self
    if (oy_node_proposed(oy_node_id)) {
        //node has accepted self's peer request
        if (oy_data[4]==="OY_PEER_ACCEPT") {

        }
        //node has rejected self's peer request
        else if (oy_data[4]==="OY_PEER_REJECT") {

        }
    }
    else if (oy_data[4]==="OY_PEER_REQUEST") {
        oy_latency_check(oy_node_id);
    }
}

function oy_latency_test(oy_node_id) {
    oy_data_send(oy_node_id, "OY_LATENCY_TEST", "PAYLOADPAYLOADPAYLOADPAYLOAD");
}

//initiates and keeps alive the P2P connection session
function oy_data_conn() {
    if (window.OY_CONN===null||window.OY_CONN.disconnected!==false) {
        var oy_self_id = localStorage.getItem("oy_self_id");
        if (oy_self_id===null) {
            oy_self_id = oy_gen_id();
            localStorage.setItem("oy_self_id", oy_self_id);
        }
        window.OY_CONN = new Peer(oy_self_id, {key: 'lwjd5qra8257b9'});
    }
    return !window.OY_CONN.disconnected;
}

//send data
function oy_data_send(oy_node_id, oy_data_flag, oy_data_payload) {
    if (!window.OY_CONN.disconnected&&!oy_data_conn()) {
        oy_log("Connection handler was unable to create a persisting P2P session", 1);
        return false
    }
    var oy_conn = window.OY_CONN.connect(oy_node_id);
    oy_conn.on('open')
    //oy_conn.id
}

//incoming data validation
//[0] is dynasty definition
//[1] is version difference tolerance
//[2] is sending node's identity
//[3] is sending node's zone allegiances
//[4] is nature of business definition
//[5] is payload
function oy_data_validate(oy_peer_id, oy_data_raw) {
   try {
       var oy_data = JSON.parse(oy_data_raw);
       if (oy_data&&typeof(oy_data)==="object") {
           if (oy_data[2]===oy_peer_id&&oy_data[0]===window.OY_MESH_DYNASTY&&Math.abs(oy_data[1]-window.OY_MESH_VERSION)<=window.OY_MESH_TOLERANCE) return oy_data;//only continue if dynasty and version of node is compliant
       }
   }
   catch (oy_error) {
       oy_log("Data validation exception occurred: "+oy_error);
   }
   oy_log("Node "+oy_peer_id+" failed validation");
   return false
}

//initialize oyster mesh boot up sequence
function oy_init() {
    if (window.OY_INIT===1) {
        oy_log("Clashing instance of INIT prevented from running");
        return false;
    }
    window.OY_INIT = 1;
    //TODO needs to load peers from storage to session, then modify oy_peers_get() as needed
    var oy_peers = oy_peers_get();
    if (oy_peers!==false) {
        window.OY_PEERS = {};
        for (i in oy_peers) {
            window.OY_PEERS[i] = true;
        }
        //delete oy_peers;//free up memory?
    }
    if (!oy_data_conn()) {
        oy_log("Connection handler was unable to create a persisting P2P session", 1);
        return false
    }
    window.OY_CONN.on('open', function(oy_self_id) {
        oy_log("P2P connection ready with self ID "+oy_self_id);
    });
    window.OY_CONN.on('connection', function(oy_conn) {
        // Receive messages
        oy_conn.on('data', function (oy_data_raw) {
            oy_log("Data with size "+oy_data_raw.length+" received from node "+oy_conn.peer);
            var oy_data = oy_data_validate(oy_conn.peer, oy_data_raw);
            if (oy_data===false) {
                oy_log("Node "+oy_conn.peer+" sent invalid data, will punish and cease session");
                oy_node_punish(oy_conn.peer);
                return false;
            }
            if (oy_node_check(oy_conn.peer)) {
                oy_log("Node "+oy_conn.peer+" is mutually peered");
                oy_peer_process(oy_conn.peer, oy_data)
            }
            else if (oy_node_blocked(oy_conn.peer)) {
                oy_log("Node "+oy_conn.peer+" is on blacklist");
            }
            else {
                oy_log("Node "+oy_conn.peer+" is either unknown or was recently proposed for peering");
                oy_node_negotiate(oy_conn.peer, oy_data);
            }
        });
    });
}