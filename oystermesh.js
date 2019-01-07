// Bruno Block
// v0.01

// GLOBAL VARS
window.OY_MESH_DYNASTY = "BRUNO_GENESIS_";//mesh dynasty definition
window.OY_MESH_VERSION = 1;//mesh version, increments every significant code upgrade
window.OY_MESH_TOLERANCE = 2;//max version iterations until peering is refused (similar to hard-fork)
window.OY_PEER_MAX = 9;//9 maximum mutually peered neighbors

// INIT
window.OY_PEERS = {};//optimization for quick and inexpensive checks for mutual peering

function oy_log(oy_msg) {
    //add custom interface for HTML console
    console.log(oy_msg);
}

function oy_gen_id(oy_zone) {
    if (oy_zone===false) return "xxxxxxxx".replace(/x/g, oy_gen_id_sub);
    else return "xxxx".replace(/x/g, oy_gen_id_sub);
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

//checks if peer is in mutually paired list
function oy_peer_check(oy_peer_id) {
    return typeof(window.OY_PEERS[oy_peer_id])!=="undefined";
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

function oy_init() {
    //TODO needs to load peers from storage to session, then modify oy_peers_get() as needed
    var oy_self_id = localStorage.getItem("oy_self_id");
    if (oy_self_id===null) {
        oy_self_id = oy_gen_id();
        localStorage.setItem("oy_self_id", oy_self_id);
    }
    var peer = new Peer(oy_self_id, {key: 'lwjd5qra8257b9'});
    peer.on('open', function(id) {
        oy_log("P2P connection ready with self ID "+id);
    });
    peer.on('connection', function(conn) {
        // Receive messages
        conn.on('data', function (data) {
            oy_log("Data with size "+data.length+" received from node "+conn.peer);
            if (oy_peer_check(conn.peer)) {
                oy_log("Node "+conn.peer+" is mutually peered");
            }
            else {
                oy_log("Node "+conn.peer+" is unknown");
                if (data==="OY_PEER_REQUEST") {

                }
            }
        });
    });
}