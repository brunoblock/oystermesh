// Bruno Block
// v0.01

// GLOBAL VARS
window.OY_MESH_DYNASTY = "BRUNO_GENESIS_A1";
window.OY_PEER_MAX = 9;//9 maximum mutually peered neighbors

// INIT

function oy_peer_add(oy_peer_id) {
    var oy_peer_local = [Date.now()/1000|0, -1, []];//[date added, latency avg, latency history]
    var oy_peers = oy_peers_get();
    if (oy_peers===false) oy_peers = {};
    if (typeof oy_peers[oy_peer_id]!=='undefined') return false;//cancel if peer already exists in list
    if (oy_peers.length >= window.OY_PEER_MAX) {
        //TODO purge weakest peer
    }
    oy_peers[oy_peer_id] = oy_peer_local;
    localStorage.setItem("oy_peers", JSON.stringify(oy_peers));
    return true;
}

function oy_peer_verify(oy_peer_id) {

}

function oy_peers_verify() {
    //scroll through all peers and invoke oy_peer_verify()
}

function oy_peers_get() {
    var oy_peers_raw = localStorage.getItem("oy_peers");
    if (oy_peers_raw===null||typeof(oy_peers_raw)==='undefined'||oy_peers_raw.length===0) return false;
    var oy_peers = JSON.parse(oy_peers_raw);
    if (oy_peers===null) return false;
    return oy_peers;
}

function oy_peers_clear() {
    localStorage.removeItem("oy_peers");
}