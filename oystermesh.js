// Bruno Block
// v0.01

// GLOBAL VARS
window.OY_PEER_MAX = 9;//9 maximum mutually peered neighbors

function oy_get_peers() {
    var oy_peers = JSON.parse(localStorage.getItem("oy_peers"));
    if (oy_peers===null) return false;
    alert(oy_peers);
}

function oy_verify_peers() {

}