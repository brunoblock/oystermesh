// Bruno Block
// v0.01

// GLOBAL VARS
window.OY_MESH_DYNASTY = "BRUNO_GENESIS_TESTNET";//mesh dynasty definition
window.OY_MESH_VERSION = 1;//mesh version, increments every significant code upgrade
window.OY_MESH_TOLERANCE = 2;//max version iterations until peering is refused (similar to hard-fork)
window.OY_NODE_TOLERANCE = 3;//max amount of protocol communication violations until node is blacklisted
window.OY_NODE_BLACKTIME = 259200;//seconds to blacklist a punished node for
window.OY_NODE_PROPOSETIME = 600;//seconds for peer proposal session duration
window.OY_PEER_MAX = 9;//maximum mutual peers per zone (applicable difference is for gateway nodes)
window.OY_LATENCY_SIZE = 1000;//size of latency ping payload, larger is more accurate yet more taxing, vice-versa applies
window.OY_LATENCY_REPEAT = 3;//how many ping round trips should be performed to conclude the latency test
window.OY_LATENCY_TOLERANCE = 2;//tolerance buffer factor for receiving ping requested from a proposed-to node
window.OY_LATENCY_MAX = 4;//max amount seconds for latency test before peership is refused or starts breaking down
window.OY_DATA_MAX = 64000;//max size of data that can be sent to another node

// INIT
window.OY_CONN = null;//global P2P connection handle
window.OY_INIT = 0;//prevents multiple instances of oy_init() from running simultaneously
window.OY_PEER_COUNT = 0;//how many active connections with mutual peers
window.OY_MAIN = {};//tracks important information that is worth persisting between sessions such as self ID
window.OY_PEERS = {};//optimization for quick and inexpensive checks for mutual peering
window.OY_NODES = {};//P2P connection handling for individual nodes, is not mirrored in localStorage due to DOM restrictions
window.OY_ZONES = {};//handling and tracking zone allegiances TODO might turn into SECTOR_ALPHA and SECTOR_BETA
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

function oy_local_store(oy_local_name, oy_local_data) {
    localStorage.setItem(oy_local_name, JSON.stringify(oy_local_data));
    oy_log("Updated localStorage retention of "+oy_local_name);
    return true;
}

function oy_local_get(oy_local_name) {
    var oy_local_raw = localStorage.getItem(oy_local_name);
    if (oy_local_raw===null||oy_local_raw.length===0) return {};
    var oy_local_data = JSON.parse(oy_local_raw);
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
    window.OY_PEERS[oy_peer_id] = [Date.now()/1000|0, 0, -1, []];//[date added timestamp last msg timestamp, latency avg, latency history]
    window.OY_PEER_COUNT++;
    oy_local_store("oy_peers", window.OY_PEERS);
    return true;
}

function oy_peer_remove(oy_peer_id) {
    //TODO remember to implement sector compliance checks here
    delete window.OY_PEERS[oy_peer_id];
    oy_local_store("oy_peers", window.OY_PEERS);
    window.OY_PEER_COUNT--;
    if (window.OY_PEER_COUNT<0) {
        oy_log("Peer management system failed", 1);
        return false;
    }
}

//updates latency tracking of peer
function oy_peer_latency(oy_peer_id, oy_latency_new) {
    if (typeof(window.OY_PEERS[oy_peer_id])==="undefined") {
        oy_log("Peer latency tracking was called on a non-existant peer");
        return false;
    }
    window.OY_PEERS[oy_peer_id][3].push(oy_latency_new);
    if (window.OY_PEERS[oy_peer_id][3].length>100) {//TODO need to verify that this part works properly and then define global var for 100
        window.OY_PEERS[oy_peer_id][3].pop();
    }
    window.OY_PEERS[oy_peer_id][2] = window.OY_PEERS[oy_peer_id][3].length;
}

//checks if peer is still valid for mutual peering
function oy_peer_verify(oy_peer_id) {

}

function oy_peers_verify() {
    //scroll through all peers and invoke oy_peer_verify()
}

//retrieved mutual peer definitions from localStorage
function oy_peers_get() {
    var oy_peers_raw = localStorage.getItem("oy_peers");
    if (oy_peers_raw===null||oy_peers_raw.length===0) return false;
    var oy_peers = JSON.parse(oy_peers_raw);
    if (oy_peers===null) return false;
    return oy_peers;
}

//remove all peer relationships, this function might only get used in manual instances
function oy_peers_reset() {
    var oy_peer_local;
    for (oy_peer_local in window.OY_PEERS) {
        oy_data_send(oy_peer_local, "OY_PEER_TERMINATE", null);
    }
    window.OY_PEERS = {};
    window.OY_PEER_COUNT = 0;
    localStorage.removeItem("oy_peers");
}

function oy_peer_process(oy_peer_id, oy_data) {
    window.OY_PEERS[oy_peer_id][1] = (Date.now()/1000|0);//update last msg timestamp for peer, no need to update localstorage via oy_local_store() (could be expensive)
    oy_log("Mutual peer "+oy_peer_id+" sent data sequence with flag: "+oy_data[4]);
    //is self's peer asking for self to refer some of self's other peers
    if (oy_data[4]==="OY_PEER_TERMINATE") {
        oy_peer_remove(oy_peer_id);//return the favour
        oy_log("Removed peer "+oy_peer_id+" who terminated peership first");
        //TODO should there be some game theory logic for blacklisting here?
        return true;
    }
    else if (oy_data[4]==="OY_PEER_REFER") {

    }
    else if (oy_data[4]==="OY_LATENCY_RESPONSE") {
        if (window.OY_LATENCY[oy_peer_id][5]==="OY_PEER_CONNECT") {

        }
        else if (window.OY_LATENCY[oy_peer_id][5]==="OY_PEER_ROUTINE") {

        }
    }
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

//checks if node is in mutually paired list
function oy_node_check(oy_node_id) {
    return typeof(window.OY_PEERS[oy_node_id])!=="undefined";
}

//checks for peering proposal session
function oy_node_proposed(oy_node_id) {
    if (typeof(window.OY_PROPOSED[oy_node_id])!=="undefined") {
        if (window.OY_PROPOSED[oy_node_id]<(Date.now()/1000|0)) {//check if proposal session expired
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
        if (window.OY_BLACKLIST[oy_node_id][1]<(Date.now()/1000|0)) {
            delete window.OY_BLACKLIST[oy_node_id];//remove node from blacklist if block expiration was reached
            oy_local_store("oy_blacklist", window.OY_BLACKLIST);
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
    window.OY_PROPOSED[oy_node_id] = (Date.now()/1000|0)+window.OY_NODE_PROPOSETIME;//set proposal session with expiration timestamp
    oy_local_store("oy_proposed", window.OY_PROPOSED);
    return true;
}

//respond to a node that is not mutually peered with self
function oy_node_negotiate(oy_node_id, oy_data) {
    if (oy_data[4]==="OY_LATENCY_RESPONSE") {
        if (typeof(window.OY_LATENCY[oy_node_id])==="undefined") {
            oy_log("Node "+oy_node_id+" sent a latency response whilst no latency session exists");
            return false;
        }
        if (window.OY_LATENCY[oy_node_id][0].repeat(window.OY_LATENCY_SIZE)===oy_data[5]) {//check if payload data matches latency session definition
            oy_log("Node "+oy_node_id+" sent a valid latency ping");
            window.OY_LATENCY[oy_node_id][2]++;
            window.OY_LATENCY[oy_node_id][4] += (Date.now()/1000|0)-window.OY_LATENCY[oy_node_id][3];//calculate how long the round trip took, and add it to aggregate time
            if (window.OY_LATENCY[oy_node_id][1]!==window.OY_LATENCY[oy_node_id][2]) {
                oy_log("There was a problem with the latency test with node "+oy_node_id+", perhaps simultaneous instances");
                return false;
            }
            if (window.OY_LATENCY[oy_node_id][2]>=window.OY_LATENCY_REPEAT) {
                var oy_latency_result = window.OY_LATENCY[oy_node_id][4]/window.OY_LATENCY[oy_node_id][2];
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
                        var oy_peer_local;
                        for (oy_peer_local in window.OY_PEERS) {

                        }
                    }
                    return true;
                }
                return false;
            }
            oy_latency_test(oy_node_id, window.OY_LATENCY[oy_node_id][5]);
        }
    }
    else if (oy_data[4]==="OY_PEER_TERMINATE") {
        oy_log("Received termination notice from non-peer, most likely we terminated him first");
        return false;
    }
    else if (oy_data[4]==="OY_PEER_AFFIRM") {
        oy_log("Received an peership affirmation notice from a non-peer, something went wrong");
        return false;
    }
    else if (oy_node_proposed(oy_node_id)) {//check if this node was previously proposed to for peering by self
        if (oy_data[4]==="OY_LATENCY_SPARK") {//respond to latency ping from node with peer proposal arrangement
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
        oy_latency_test(oy_node_id, "OY_PEER_REQUEST");
        return true;
    }
    else {
        oy_log("Node "+oy_node_id+" sent an incoherent message");
        return false;
    }
}

//test latency performance between self and node
function oy_latency_test(oy_node_id, oy_followup) {
    if (typeof(window.OY_LATENCY[oy_node_id])==="undefined") {
        //[0] is pending payload unique string
        //[1] is pings sent
        //[2] is valid pings received back
        //[3] is most start time for latency test timer
        //[4] is aggregate time taken (between all received pings)
        //[5] is followup flag i.e. what logic should follow after the latency test concludes
        window.OY_LATENCY[oy_node_id] = [0, 0, 0, 0, 0, oy_followup];
    }
    if (oy_followup!==window.OY_LATENCY[oy_node_id][5]) {
        oy_log("Two simultaneous latency test instances crashed into each other", 1);
        return false;
    }
    //ping a unique payload string that is repeated OY_LATENCY_SIZE amount of times
    window.OY_LATENCY[oy_node_id][0] = oy_gen_rand(4);
    if (oy_data_send(oy_node_id, "OY_LATENCY_SPARK", window.OY_LATENCY[oy_node_id][0].repeat(window.OY_LATENCY_SIZE))) {
        window.OY_LATENCY[oy_node_id][1]++;
        window.OY_LATENCY[oy_node_id][3] = (Date.now()/1000|0);
        oy_log("Latency ping sent to node "+oy_node_id);
        return true;
    }
    oy_log("Latency ping to node "+oy_node_id+" failed", 1);
    return false;
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
    var oy_data = [window.OY_MESH_DYNASTY, window.OY_MESH_VERSION, window.OY_MAIN['oy_self_id'], window.OY_ZONES, oy_data_flag, oy_data_payload];
    var oy_data_raw = JSON.stringify(oy_data);//convert data array to JSON
    if (oy_data_raw.length>window.OY_DATA_MAX) {
        oy_log("System is misconfigured, almost sent an excessively sized data sequence", 1);
        return false;
    }
    //console.log("chin"+oy_data_flag);
    //console.log(window.OY_NODES[oy_node_id]);
    //console.log("chilla");
    //return false;
    oy_log("Send data to node "+oy_node_id+": "+oy_data_raw);
    window.OY_NODES[oy_node_id].send(oy_data_raw);//send the JSON-converted data array to the destination node
    return true;
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
       var oy_data = JSON.parse(oy_data_raw);
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

    window.OY_PEERS = oy_local_get("oy_peers");
    var oy_peer_local;
    for (oy_peer_local in window.OY_PEERS) {
        window.OY_PEER_COUNT++;
        oy_node_connect(oy_peer_local);
        oy_latency_test(oy_peer_local, "OY_PEER_CONNECT");
    }
    window.OY_ZONES = oy_local_get("oy_zones");
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
            oy_log("Data with size "+oy_data_raw.length+" received from node "+oy_conn.peer);
            if (oy_data_raw.length>window.OY_DATA_MAX) {
                oy_log("Node "+oy_conn.peer+" sent an excessively sized data sequence, will punish and cease session");
                oy_node_punish(oy_conn.peer);
                return false;
            }
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
                oy_log("Node "+oy_conn.peer+" is either unknown or was recently proposed to for peering");
                oy_node_negotiate(oy_conn.peer, oy_data);
            }
        });
    });
}