// OYSTER MESH
// Bruno Block
// v0.1
// License: GNU GPLv3

// GLOBAL VARS
window.OY_MESH_DYNASTY = "BRUNO_GENESIS_V1";//mesh dynasty definition, changing this will cause a hard-fork
window.OY_MESH_EDGE = 10;//maximum seconds that it should take for a transaction to reach the furthest edge-to-edge distance of the mesh, this variable should stay at 10
window.OY_MESH_FLOW = 128000;//characters per second allowed per peer, and for all aggregate non-peer nodes
window.OY_MESH_MEASURE = 10;//seconds by which to measure mesh flow, larger means more tracking of nearby node and peer activity
window.OY_MESH_BEAM_SAMPLE = 3;//time/data measurements to determine mesh beam flow required to state a result, too low can lead to volatile and inaccurate readings
window.OY_MESH_BEAM_BUFFER = 0.8;//multiplication factor for mesh outflow/beam buffer, to give some leeway to compliant peers
window.OY_MESH_SOAK_SAMPLE = 5;//time/data measurements to determine mesh soak flow required to state a result, too low can lead to volatile and inaccurate readings
window.OY_MESH_SOAK_BUFFER = 1.5;//multiplication factor for mesh inflow/soak buffer, to give some leeway to compliant peers
window.OY_MESH_PUSH_CHANCE = 0.85;//probability that self will forward a data_push when the nonce was not previously stored on self
window.OY_MESH_PUSH_CHANCE_STORED = 0.95;//probability that self will forward a data_push when the nonce was previously stored on self
window.OY_MESH_DEPOSIT_CHANCE = 0.4;//probability that self will deposit pushed data
window.OY_MESH_FULLFILL_CHANCE = 0.2;//probability that data is stored whilst fulfilling a pull request, this makes data intelligently migrate and recommit overtime
window.OY_MESH_SOURCE = 2;//node in route passport (from destination) that is assigned with defining the source variable
window.OY_NODE_TOLERANCE = 3;//max amount of protocol communication violations until node is blacklisted
window.OY_NODE_BLACKTIME = 600;//seconds to blacklist a punished node for
window.OY_NODE_PROPOSETIME = 12;//seconds for peer proposal session duration
window.OY_NODE_ASSIGNTTIME = 10;//minimum interval between node_assign instances to/from top
window.OY_NODE_DELAYTIME = 6;//minimum expected time to connect or transmit data to a node
window.OY_PEER_LATENCYTIME = 60;//peers are expected to establish latency timing with each other within this interval in seconds
window.OY_PEER_KEEPTIME = 20;//peers are expected to communicate with each other within this interval in seconds
window.OY_PEER_REFERTIME = 480;//interval in which self asks peers for peer recommendations (as needed)
window.OY_PEER_REPORTTIME = 10;//interval to report peer list to top
window.OY_PEER_PRETIME = 20;//seconds which a node is waiting as a 'pre-peer'
window.OY_PEER_MAX = 5;//maximum mutual peers per zone (applicable difference is for gateway nodes)
window.OY_ROUTE_DYNAMIC_KEEP = 1000;//how many dynamic identifiers for a routed data sequence to remember and block
window.OY_LATENCY_SIZE = 80;//size of latency ping payload, larger is more accurate yet more taxing, vice-versa applies
window.OY_LATENCY_LENGTH = 8;//length of rand sequence which is repeated for payload and signed for ID verification
window.OY_LATENCY_REPEAT = 2;//how many ping round trips should be performed to conclude the latency test
window.OY_LATENCY_TOLERANCE = 2;//tolerance buffer factor for receiving ping requested from a proposed-to node
window.OY_LATENCY_MAX = 20;//max amount of seconds for latency test before peership is refused or starts breaking down
window.OY_LATENCY_TRACK = 200;//how many latency measurements to keep at a time per peer
window.OY_LATENCY_WEAK_BUFFER = 9.5;//percentage buffer for comparing latency with peers, higher means less likely the weakest peer will be dropped and hence less peer turnover
window.OY_DATA_MAX = 64000;//max size of data that can be sent to another node
window.OY_DATA_CHUNK = 48000;//chunk size by which data is split up and sent per transmission
window.OY_DATA_PUSH_INTERVAL = 190;//ms per chunk per push loop iteration
window.OY_DATA_PUSH_NONCE_MAX = 15;//maximum amount of nonces to push per push loop iteration
window.OY_DATA_PULL_INTERVAL = 500;//ms per pull loop iteration
window.OY_DATA_PULL_NONCE_MAX = 5;//maximum amount of nonces to request per pull beam, if too high fulfill will overrun soak limits and cause time/resource waste
window.OY_DATA_PULL_PACKET_MAX = 150;//maximum size for a packet that is routed via OY_DATA_PULL (OY_LOGIC_ALL)
window.OY_DATA_FULFILL_INTERVAL = 4000;//ms per chunk per fulfill loop iteration
window.OY_DATA_FULFILL_EXPIRE = 25;//seconds before self will resent a pull fulfillment to the same node for the same handle
window.OY_DEPOSIT_CHAR = 100000;//character rate for data deposit sizing, helps establish storage limits
window.OY_DEPOSIT_MAX_BUFFER = 0.9;//max character length capacity factor of data deposit (0.9 means 10% buffer until hard limit is reached)
window.OY_DEPOSIT_COMMIT = 3;//commit data to disk every x nonce pushes, too high will lead to unnecessary data loss
window.OY_CHANNEL_BROADCAST_PACKET_MAX = 800;//maximum size for a packet is is routed via OY_CHANNEL_BROADCAST (OY_LOGIC_ALL)
window.OY_LOGIC_ALL_LIMIT = 100;//ms interval allowed for an OY_LOGIC_ALL packet beam/soak, the larger this number the easier it is for a service denial attack
window.OY_ENGINE_INTERVAL = 2000;//ms interval for core mesh engine to run, the time must clear a reasonable latency round-about
window.OY_READY_RETRY = 3000;//ms interval to retry connection if READY is still false
window.OY_BLOCK_LOOP = 200;//a lower value means more opportunity within the 10 second window to propagate transactions
window.OY_CUT_LENGTH = 32;//key variable for negotiating with the trilemma, higher is more secure/less scalable, lower is less secure/more scalable, changing this requires a hardfork
window.OY_CHANNEL_VERIFY_CHANCE = 0.5;//chance a node will verify a channel broadcast, higher means more aggregate CPU usage and less bandwidth, lower means less aggregate CPU and more bandwidth
window.OY_CHANNEL_KEEPTIME = 40;//channel bearing nodes are expected to broadcast a logic_all packet within this interval
window.OY_CHANNEL_FORGETIME = 60;//seconds since last signed message from channel bearing node
window.OY_CHANNEL_RECOVERTIME = 30;//second interval between channel recovery requests per node, should be at least MESH_EDGE*2
window.OY_CHANNEL_RESPOND_MAX = 5;//max amount of broadcast payloads to send in response to a channel recover request
window.OY_SHORT_LENGTH = 6;//various data value such as nonce IDs, data handles, data values are shortened for efficiency
window.OY_PASSIVE_MODE = false;//console output is silenced, and no explicit inputs are expected

// INIT
window.OY_CONN = null;//global P2P connection handle
window.OY_ENGINE_KILL = false;//forces engine to stop its loop
window.OY_CONSOLE = null;//custom function for handling console
window.OY_MAP = null;//custom function for tracking passive passports
window.OY_INIT = 0;//prevents multiple instances of oy_init() from running simultaneously
window.OY_PEER_COUNT = 0;//how many active connections with mutual peers
window.OY_REFER_LAST = 0;//last time self asked a peer for a peer recommendation
window.OY_DEPOSIT_MAX = 0;//max localStorage capacity with buffer considered
window.OY_MAIN = {"oy_ready":false, "oy_deposit_size":0, "oy_deposit_counter":0};//tracks important information that is worth persisting between sessions such as self ID
window.OY_ENGINE = [{}, {}];//tracking object for core engine variables, [0] is latency tracking
window.OY_DEPOSIT = {};//object for storing main payload data, crucial variable for mirroring to localStorage
window.OY_PURGE = [];//track order of DEPOSIT to determine what data gets deleted ('purged') first
window.OY_COLLECT = {};//object for tracking pull fulfillments
window.OY_CONSTRUCT = {};//data considered valid from OY_COLLECT is stored here, awaiting for final data reconstruction
window.OY_DATA_PUSH = {};//object for tracking data push threads
window.OY_DATA_PULL = {};//object for tracking data pull threads
window.OY_PEERS = {"oy_aggregate_node":[-1, -1, -1, 0, [], 0, [], 0, [], -1, -1]};//optimization for quick and inexpensive checks for mutual peering
window.OY_PEERS_PRE = {};//tracks nodes that are almost peers, will become peers once PEER_AFFIRM is received from other node
window.OY_NODES = {};//P2P connection handling for individual nodes, is not mirrored in localStorage due to DOM restrictions
window.OY_WARM = {};//tracking connections to nodes that are warming up
window.OY_COLD = {};//tracking connection shutdowns to specific nodes
window.OY_ROUTE_DYNAMIC = [];//tracks dynamic identifier for a routed data sequence
window.OY_LATENCY = {};//handle latency sessions
window.OY_PROPOSED = {};//nodes that have been recently proposed to for mutual peering
window.OY_BLACKLIST = {};//nodes to block for x amount of time
window.OY_PUSH_HOLD = {};//holds data contents ready for pushing to mesh
window.OY_PUSH_TALLY = {};//tracks data push nonces that were deposited on the mesh
window.OY_BLOCK = [null];//block from the block that keeps consensus-approved transactions
window.OY_BLOCK_HASH = null;//hash of the most current block
window.OY_BLOCK_PREV = null;//the most recent block timestamp
window.OY_BLOCK_TRIGGER = new Event('oy_block_trigger');//trigger-able event for when a new block is issued
window.OY_CHANNEL_LISTEN = {};//track channels to listen for
window.OY_CHANNEL_KEEP = {};//stored broadcasts that are re-shared
window.OY_CHANNEL_ECHO = {};//track channels to listen for
window.OY_CHANNEL_TOP = {};//track current channel topology
window.OY_CHANNEL_RENDER = {};//track channel broadcasts that have been rendered

function oy_log(oy_log_msg, oy_log_flag) {
    //oy_log_debug(oy_log_msg);
    if (window.OY_PASSIVE_MODE===true) return false;
    if (typeof(oy_log_flag)==="undefined") oy_log_flag = 0;
    if (oy_log_flag===1) oy_log_msg = "FATAL ERROR: "+oy_log_msg;
    if (window.OY_CONSOLE===null) console.log(oy_log_msg);
    else window.OY_CONSOLE(oy_log_msg);
}

function oy_log_debug(oy_log_msg) {
    if (typeof(window.OY_MAIN['oy_self_id'])==="undefined") return false;
    oy_log_msg = "["+(Date.now()/1000)+"] "+oy_log_msg;
    let oy_xhttp = new XMLHttpRequest();
    oy_xhttp.open("POST", "https://top.oyster.org/oy_log_catch.php", true);
    oy_xhttp.send("oy_log_catch="+JSON.stringify([window.OY_MAIN['oy_self_short'], oy_log_msg]));
}

function oy_cut(oy_key_public) {
    return oy_key_public.substr(0, window.OY_CUT_LENGTH);
}

function oy_short(oy_message) {
    return oy_message.substr(0, window.OY_SHORT_LENGTH);
}

function oy_rand_gen(oy_gen_custom) {
    function oy_rand_gen_sub() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    if (typeof(oy_gen_custom)==="undefined") return "xxxxxxxx".replace(/x/g, oy_rand_gen_sub);
    return "x".repeat(oy_gen_custom).replace(/x/g, oy_rand_gen_sub);
}

function oy_hash_gen(oy_data_value) {
    return CryptoJS.SHA1(oy_data_value).toString()
}

function oy_base_encode(oy_base_raw) {
    return encodeURIComponent(oy_base_raw);
}

function oy_base_decode(oy_base_base) {
    return decodeURIComponent(oy_base_base);
}

function oy_buffer_encode(oy_buffer_text, oy_buffer_base64) {
    let binary_string;
    if (oy_buffer_base64===true) binary_string =  window.atob(oy_buffer_text);
    else binary_string =  oy_buffer_text;
    let len = binary_string.length;
    let bytes = new Uint8Array( len );
    for (let i = 0; i < len; i++)        {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}

function oy_buffer_decode(oy_buffer_buffer, oy_buffer_base64) {
    let binary = '';
    let bytes = new Uint8Array(oy_buffer_buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    if (oy_buffer_base64===true) return window.btoa(binary);
    return binary;
}

function oy_crypt_encrypt(oy_crypt_data, oy_crypt_pass) {
    let oy_crypt_salt = CryptoJS.lib.WordArray.random(128/8);
    let oy_crypt_key = CryptoJS.PBKDF2(oy_crypt_pass, oy_crypt_salt, {
        keySize: 8,
        iterations: 100
    });
    let oy_crypt_iv = CryptoJS.lib.WordArray.random(128/8);
    return oy_crypt_salt.toString()+oy_crypt_iv.toString()+CryptoJS.AES.encrypt(oy_crypt_data.toString(), oy_crypt_key, {
        iv: oy_crypt_iv,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
    }).toString();
}

function oy_crypt_decrypt(oy_crypt_cipher, oy_crypt_pass) {
    let oy_crypt_salt = CryptoJS.enc.Hex.parse(oy_crypt_cipher.substr(0, 32));
    let oy_crypt_iv = CryptoJS.enc.Hex.parse(oy_crypt_cipher.substr(32, 32));
    let oy_crypt_key = CryptoJS.PBKDF2(oy_crypt_pass, oy_crypt_salt, {
        keySize: 8,
        iterations: 100
    });
    // noinspection JSCheckFunctionSignatures
    return CryptoJS.AES.decrypt(oy_crypt_cipher.substring(64), oy_crypt_key, {
        iv: oy_crypt_iv,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
    }).toString(CryptoJS.enc.Utf8);
}

function oy_key_verify(oy_key_public, oy_key_signature, oy_key_data, oy_callback) {
    oy_key_public = oy_key_public.replace(/!/g, "-");
    window.crypto.subtle.importKey(
        "jwk", //can be "jwk" (public or private), "spki" (public only), or "pkcs8" (private only)
        {
            kty: "EC",
            crv: "P-256",
            x: oy_key_public.substr(0, 43),
            y: oy_key_public.substr(43),
            ext: true,
        },
        {   //these are the algorithm options
            name: "ECDSA",
            namedCurve: "P-256", //can be "P-256", "P-384", or "P-521"
        },
        false, //whether the key is extractable (i.e. can be used in exportKey)
        ["verify"] //"verify" for public key import, "sign" for private key imports
    ).then(function(oy_key_public) {
        window.crypto.subtle.verify(
            {
                name: "ECDSA",
                hash: {name: "SHA-256"}, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
            },
            oy_key_public, //from generateKey or importKey above
            oy_buffer_encode(oy_key_signature, true),
            oy_buffer_encode(oy_key_data, false) //ArrayBuffer of data you want to sign
        ).then(function(oy_key_valid) {
            oy_callback(oy_key_valid);
        }).catch(function(oy_error) {
            oy_log("Cryptographic error "+oy_error, 1);
        });
    }).catch(function(oy_error) {
        oy_log("Cryptographic error "+oy_error, 1);
    });
}

function oy_key_sign(oy_key_private, oy_key_data, oy_callback) {
    oy_key_private = window.atob(oy_key_private).replace(/!/g, "-");
    window.crypto.subtle.importKey(
        "jwk", //can be "jwk" (public or private), "spki" (public only), or "pkcs8" (private only)
        {
            kty: "EC",
            crv: "P-256",
            d: oy_key_private.substr(0, 43),
            x: oy_key_private.substr(43, 43),
            y: oy_key_private.substr(86),
            ext: true,
        },
        {
            name: "ECDSA",
            namedCurve: "P-256", //can be "P-256", "P-384", or "P-521"
        },
        false, //whether the key is extractable (i.e. can be used in exportKey)
        ["sign"] //"verify" for public key import, "sign" for private key imports
    ).then(function(oy_key_private_raw) {
        window.crypto.subtle.sign(
            {
                name: "ECDSA",
                hash: {name: "SHA-256"}, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
            },
            oy_key_private_raw, //from generateKey or importKey above
            oy_buffer_encode(oy_key_data, false) //ArrayBuffer of data you want to sign
        ).then(function(oy_key_signature_raw) {
            oy_callback(oy_buffer_decode(oy_key_signature_raw, true));
        }).catch(function(oy_error) {
            oy_log("Cryptographic error "+oy_error, 1);
        });
    }).catch(function(oy_error) {
        oy_log("Cryptographic error "+oy_error, 1);
    });
}

function oy_key_gen(oy_callback) {
    window.crypto.subtle.generateKey(
        {
            name: "ECDSA",
            namedCurve: "P-256", //can be "P-256", "P-384", or "P-521"
        },
        true,
        ["sign", "verify"]
    ).then(function(key) {
        window.crypto.subtle.exportKey("jwk", key.privateKey).then(function(oy_key_pass) {
            oy_callback(window.btoa((oy_key_pass.d+oy_key_pass.x+oy_key_pass.y).replace(/-/g, "!")), (oy_key_pass.x+oy_key_pass.y).replace(/-/g, "!"));
        }).catch(function(oy_error) {
            oy_log("Cryptographic error "+oy_error, 1);
        });
    }).catch(function(oy_error) {
        oy_log("Cryptographic error "+oy_error, 1);
    });
}

function oy_reduce_sum(oy_reduce_total, oy_reduce_num) {
    return oy_reduce_total + oy_reduce_num;
}

function oy_handle_check(oy_data_handle) {
    return typeof(oy_data_handle)==="string"&&oy_data_handle.substr(0, 2)==="OY"&&oy_data_handle.length>20;
}

function oy_local_store(oy_local_name, oy_local_data) {
    /*
    function oy_local_check_sub2(oy_heavy) {
        try {
            localStorage.setItem("oy_store_check", oy_heavy);
            return true;
        }
        catch(e) {
            return false;
        }
    }
    if (oy_local_name==="oy_deposit") {
        let oy_heavy = "";
        while (oy_local_check_sub2(oy_heavy)) oy_heavy += "0123456789".repeat(10000);
        localStorage.removeItem("oy_store_check");
        console.log("SIZE LIMIT REMAINING: "+oy_heavy.length);
        oy_heavy = "";
    }
    console.log("DATA: "+oy_local_name+" SIZE: "+JSON.stringify(oy_local_data).length);
    */
    localStorage.setItem(oy_local_name, JSON.stringify(oy_local_data));
    oy_log("Updated localStorage retention of "+oy_local_name);
    return true;
}

function oy_local_get(oy_local_name) {
    let oy_local_raw = localStorage.getItem(oy_local_name);
    if (oy_local_raw===null||oy_local_raw.length===0) {
        if (oy_local_name==="oy_main") return {"oy_ready":false, "oy_deposit_size":0, "oy_deposit_counter":0};
        else if (oy_local_name==="oy_peers") return {"oy_aggregate_node":[-1, -1, -1, 0, [], 0, [], 0, [], -1, -1]};
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
        oy_log("Failed to add node "+oy_short(oy_peer_id)+" to peer list that already exists in peer list");
        return false;//cancel if peer already exists in list
    }
    let oy_callback_local = function() {
        //[peership timestamp, last msg timestamp, last latency timestamp, latency avg, latency history, data beam, data beam history, data soak, data soak history, logic_all last beamed, logic_all last soaked]
        window.OY_PEERS[oy_peer_id] = [Date.now()/1000|0, -1, -1, 0, [], 0, [], 0, [], -1, -1];
        window.OY_PEER_COUNT++;
        oy_local_store("oy_peers", window.OY_PEERS);
        oy_node_reset(oy_peer_id);
    };
    if (oy_node_connect(oy_peer_id, oy_callback_local)===true) oy_callback_local();
    return true;
}

function oy_peer_remove(oy_peer_id) {
    if (!oy_peer_check(oy_peer_id)) {
        oy_log("Tried to remove non-existent peer");
        return false;
    }
    oy_data_beam(oy_peer_id, "OY_PEER_TERMINATE", "OY_REASON_PEER_REMOVE");
    window.OY_PEER_COUNT--;
    delete window.OY_PEERS[oy_peer_id];
    oy_local_store("oy_peers", window.OY_PEERS);
    oy_node_reset(oy_peer_id);
    if (window.OY_PEER_COUNT<0) {
        oy_log("Peer management system failed", 1);
        return false;
    }
    oy_node_disconnect(oy_peer_id);
}

function oy_peer_pre_add(oy_node_id) {
    window.OY_PEERS_PRE[oy_node_id] = (Date.now()/1000|0)+window.OY_PEER_PRETIME;
    return true;
}

function oy_peer_pre_check(oy_node_id) {
    return typeof window.OY_PEERS_PRE[oy_node_id]!=="undefined"&&window.OY_PEERS_PRE[oy_node_id]>=(Date.now()/1000|0);
}

//remove all peer relationships, this function might only get used in manual instances
/*
function oy_peers_reset() {
    let oy_peer_local;
    for (oy_peer_local in window.OY_PEERS) {
        if (oy_peer_local==="oy_aggregate_node") continue;
        oy_data_beam(oy_peer_local, "OY_PEER_TERMINATE", "OY_REASON_PEER_RESET");
        oy_node_disconnect(oy_peer_local);
    }
    window.OY_PEERS = {};
    window.OY_PEER_COUNT = 0;
    localStorage.removeItem("oy_peers");
}
*/

//updates latency tracking of peer
function oy_peer_latency(oy_peer_id, oy_latency_new) {
    if (!oy_peer_check(oy_peer_id)) {
        oy_log("Peer latency tracking was called on a non-existent peer");
        return false;
    }
    window.OY_PEERS[oy_peer_id][4].unshift(oy_latency_new);
    if (window.OY_PEERS[oy_peer_id][4].length>window.OY_LATENCY_TRACK) {
        window.OY_PEERS[oy_peer_id][4].pop();
    }
    window.OY_PEERS[oy_peer_id][3] = (window.OY_PEERS[oy_peer_id][4].reduce(oy_reduce_sum))/window.OY_PEERS[oy_peer_id][4].length;
    oy_local_store("oy_peers", window.OY_PEERS);
    oy_log("Latency data updated for peer "+oy_short(oy_peer_id));
}

//checks if short id of node correlates with a mutual peer
function oy_peer_find(oy_peer_short) {
    for (let oy_peer_local in window.OY_PEERS) {
        if (oy_peer_local==="oy_aggregate_node") continue;
        if (oy_peer_short===oy_short(oy_peer_local)) return oy_peer_local;
    }
    return false;
}

//select a random peer, main use is for data pushing
function oy_peer_rand(oy_peers_exception) {
    let oy_peers_local = {};
    for (let oy_peer_local in window.OY_PEERS) {
        if (oy_peer_local==="oy_aggregate_node"||oy_peers_exception.indexOf(oy_short(oy_peer_local))!==-1) continue;
        oy_peers_local[oy_peer_local] = window.OY_PEERS[oy_peer_local];
    }
    if (Object.keys(oy_peers_local).length===0) {
        oy_log("Tried to select a peer whilst the peer list ran empty");
        return false;
    }
    let oy_peers_keys = Object.keys(oy_peers_local);
    return oy_peers_keys[oy_peers_keys.length * Math.random() << 0];
}

//process data sequence received from mutual peer oy_peer_id
function oy_peer_process(oy_peer_id, oy_data_flag, oy_data_payload) {
    if (!oy_peer_check(oy_peer_id)) {
        oy_log("Tried to call peer_process on a non-existent peer", 1);
        return false;
    }
    let oy_local_time = Date.now()/1000;
    window.OY_PEERS[oy_peer_id][1] = oy_local_time;//update last msg timestamp for peer, no need to update localstorage via oy_local_store() (could be expensive)
    oy_log("Mutual peer "+oy_short(oy_peer_id)+" sent data sequence with flag: "+oy_data_flag);
    if (oy_data_flag==="OY_DATA_PUSH") {//store received data and potentially forward the push request to peers
        //oy_data_payload = [oy_route_passport_passive, oy_data_handle, oy_data_nonce, oy_data_value]
        //data received here will be committed to data_deposit with only randomness restrictions, mesh flow restrictions from oy_init() are sufficient
        if (oy_data_payload.length!==4||!oy_handle_check(oy_data_payload[1])||oy_data_payload[3].length>window.OY_DATA_CHUNK) {
            oy_log("Peer "+oy_short(oy_peer_id)+" sent invalid push data sequence, will punish");
            oy_node_punish(oy_peer_id, "OY_PUNISH_PUSH_INVALID");
            return false;
        }
        let oy_fwd_chance = window.OY_MESH_PUSH_CHANCE;
        if (oy_data_deposit(oy_data_payload[1], oy_data_payload[2], oy_data_payload[3])||(typeof(window.OY_DEPOSIT[oy_data_payload[1]])!=="undefined"&&typeof(window.OY_DEPOSIT[oy_data_payload[1]][oy_data_payload[2]])!=="undefined")) {
            oy_fwd_chance = window.OY_MESH_PUSH_CHANCE_STORED;
            setTimeout(function() {
                oy_data_route("OY_LOGIC_FOLLOW", "OY_DATA_DEPOSIT", [[], oy_data_payload[0], window.OY_MAIN['oy_self_short'], oy_data_payload[1], oy_data_payload[2], oy_short(oy_data_payload[3])]);
            }, 1);
        }
        if (Math.random()<=oy_fwd_chance) {
            oy_log("Randomness led to beaming handle "+oy_short(oy_data_payload[1])+" forward along the mesh");
            oy_data_route("OY_LOGIC_CHAOS", "OY_DATA_PUSH", oy_data_payload);
        }
        return true;
    }
    else if (oy_data_flag==="OY_DATA_PULL") {
        //oy_data_payload = [oy_route_passport_passive, oy_route_dynamic, oy_data_handle, oy_data_nonce_set]
        if (oy_data_payload.length!==4||!oy_handle_check(oy_data_payload[2])||oy_data_payload[3].length>window.OY_DATA_PULL_NONCE_MAX) {
            oy_log("Peer "+oy_short(oy_peer_id)+" sent invalid pull data sequence, will punish");
            oy_node_punish(oy_peer_id, "OY_PUNISH_PULL_INVALID");
            return false;
        }
        let oy_nonce_purge = [];
        let oy_nonce_array = oy_data_payload[3];
        let oy_fulfill_delay = 0;
        for (let i in oy_data_payload[3]) {
            if (typeof(window.OY_DEPOSIT[oy_data_payload[2]])!=="undefined"&&typeof(window.OY_DEPOSIT[oy_data_payload[2]][oy_data_payload[3][i]])!=="undefined") {
                oy_log("Found nonce "+oy_data_payload[3][i]+" for handle "+oy_data_payload[2]);
                if (window.OY_DEPOSIT[oy_data_payload[2]][oy_data_payload[3][i]]===null) {
                    oy_log("Data deposit was lost at handle "+oy_data_payload[2]+" at nonce "+oy_data_payload[3][i]);
                    continue;
                }
                setTimeout(function() {
                    oy_data_route("OY_LOGIC_FOLLOW", "OY_DATA_FULFILL", [[], oy_data_payload[0], "oy_source_void", oy_data_payload[2], oy_nonce_array[i], window.OY_DEPOSIT[oy_data_payload[2]][oy_nonce_array[i]]]);
                }, oy_fulfill_delay);
                oy_fulfill_delay += window.OY_DATA_FULFILL_INTERVAL;
            }
            else oy_nonce_purge.push(oy_data_payload[3][i]);
        }

        if (oy_nonce_purge.length>0) {
            oy_data_payload[3] = oy_nonce_purge;
            oy_log("Beaming handle "+oy_short(oy_data_payload[2])+" forward along the mesh");
            oy_data_route("OY_LOGIC_ALL", "OY_DATA_PULL", oy_data_payload);
        }
        return true;
    }
    else if (oy_data_flag==="OY_DATA_DEPOSIT") {
        //oy_data_payload = [oy_route_passport_passive, oy_route_passport_active, oy_data_source, oy_data_handle, oy_data_nonce, oy_data_short]
        if (oy_data_payload.length!==6||oy_data_payload[1].length===0||!oy_handle_check(oy_data_payload[3])) {
            oy_log("Peer "+oy_short(oy_peer_id)+" sent invalid deposit data sequence, will punish");
            oy_node_punish(oy_peer_id, "OY_PUNISH_DEPOSIT_INVALID");
            return false;
        }
        if (oy_data_payload[1][0]===window.OY_MAIN['oy_self_short']) {
            oy_log("Data deposit sequence with handle "+oy_short(oy_data_payload[3])+" at nonce "+oy_data_payload[4]+" found self as the intended final destination");
            oy_data_tally(oy_data_payload[2], oy_data_payload[3], oy_data_payload[4], oy_data_payload[5], oy_data_payload[0].length);
        }
        else {//carry on reversing the passport until the data reaches the intended destination
            oy_log("Continuing deposit confirmation of handle "+oy_short(oy_data_payload[3]));
            oy_data_route("OY_LOGIC_FOLLOW", "OY_DATA_DEPOSIT", oy_data_payload);
        }
        return true;
    }
    else if (oy_data_flag==="OY_DATA_FULFILL") {
        //oy_data_payload = [oy_route_passport_passive, oy_route_passport_active, oy_data_source, oy_data_handle, oy_data_nonce, oy_data_value]
        if (oy_data_payload.length!==6||oy_data_payload[1].length===0||!oy_handle_check(oy_data_payload[3])) {
            oy_log("Peer "+oy_short(oy_peer_id)+" sent invalid fulfill data sequence, will punish");
            oy_node_punish(oy_peer_id, "OY_PUNISH_FULFILL_INVALID");
            return false;
        }
        if (oy_data_payload[1][0]===window.OY_MAIN['oy_self_short']) {
            oy_log("Data fulfillment sequence with handle "+oy_short(oy_data_payload[3])+" at nonce "+oy_data_payload[4]+" found self as the intended final destination");
            oy_data_collect(oy_data_payload[2], oy_data_payload[3], oy_data_payload[4], oy_data_payload[5]);
        }
        else {//carry on reversing the passport until the data reaches the intended destination
            oy_log("Continuing fulfillment of handle "+oy_short(oy_data_payload[3]));
            if (oy_data_payload[1].length===window.OY_MESH_SOURCE) oy_data_payload[2] = oy_data_payload[1].join("!");
            oy_data_route("OY_LOGIC_FOLLOW", "OY_DATA_FULFILL", oy_data_payload);
            if (Math.random()<=window.OY_MESH_FULLFILL_CHANCE) {
                oy_log("Data deposit upon mesh fulfill invoked for handle "+oy_short(oy_data_payload[3]));
                oy_data_deposit(oy_data_payload[3], oy_data_payload[4], oy_data_payload[5]);
            }
        }
        return true;
    }
    else if (oy_data_flag==="OY_CHANNEL_BROADCAST") {
        //oy_data_payload = [oy_route_passport_passive, oy_route_dynamic, oy_channel_id, oy_channel_payload, oy_payload_crypt, oy_key_public, oy_broadcast_time]
        if (oy_data_payload.length!==6||oy_data_payload[1].length===0||!oy_channel_check(oy_data_payload[2])) {
            oy_log("Peer "+oy_short(oy_peer_id)+" sent invalid fulfill data sequence, will punish");
            oy_node_punish(oy_peer_id, "OY_PUNISH_CHANNEL_INVALID");
            return false;
        }

        let oy_local_beam = function() {
            oy_log("Beaming channel "+oy_short(oy_data_payload[2])+" forward along the mesh");
            oy_data_route("OY_LOGIC_ALL", "OY_CHANNEL_BROADCAST", oy_data_payload);

            if (typeof(window.OY_CHANNEL_LISTEN[oy_data_payload[2]])!=="undefined") {

                if (typeof(window.OY_CHANNEL_RENDER[oy_data_payload[2]])==="undefined") window.OY_CHANNEL_RENDER[oy_data_payload[2]] = {};

                let oy_broadcast_hash = oy_hash_gen(oy_data_payload[4]);

                if (typeof(window.OY_CHANNEL_RENDER[oy_data_payload[2]][oy_broadcast_hash])!=="undefined") {
                    oy_log("Already rendered broadcast hash "+oy_short(oy_broadcast_hash)+" from channel "+oy_short(oy_data_payload[2])+", will ignore");
                    return false;
                }

                window.OY_CHANNEL_RENDER[oy_data_payload[2]][oy_broadcast_hash] = true;
                window.OY_CHANNEL_LISTEN[oy_data_payload[2]][2](oy_data_payload);

                if (typeof(window.OY_CHANNEL_TOP[oy_data_payload[2]])==="undefined") window.OY_CHANNEL_TOP[oy_data_payload[2]] = {};
                window.OY_CHANNEL_TOP[oy_data_payload[2]][oy_data_payload[0][0]] = [oy_local_time, -1, oy_data_payload[0]];

                let oy_broadcast_payload = oy_data_payload;
                oy_broadcast_payload[0] = null;
                oy_broadcast_payload[1] = null;
                oy_broadcast_payload[7] = [];

                if (window.OY_CHANNEL_LISTEN[oy_data_payload[2]][0]!==null) {
                    oy_key_sign(window.OY_CHANNEL_LISTEN[oy_data_payload[2]][0], oy_data_payload[4], function(oy_data_crypt) {
                        oy_broadcast_payload[7].push([oy_data_crypt, window.OY_CHANNEL_LISTEN[oy_data_payload[2]][1]]);
                        if (typeof(window.OY_CHANNEL_KEEP[oy_data_payload[2]])==="undefined") window.OY_CHANNEL_KEEP[oy_data_payload[2]] = {};
                        if (typeof(window.OY_CHANNEL_KEEP[oy_data_payload[2]][oy_broadcast_hash])==="undefined") window.OY_CHANNEL_KEEP[oy_data_payload[2]][oy_broadcast_hash] = oy_broadcast_payload;
                    });

                    oy_key_sign(window.OY_CHANNEL_LISTEN[oy_data_payload[2]][0], oy_broadcast_hash, function(oy_echo_crypt) {
                        oy_log("Beaming echo for channel "+oy_short(oy_data_payload[2]));
                        oy_data_route("OY_LOGIC_FOLLOW", "OY_CHANNEL_ECHO", [[], oy_data_payload[0], oy_data_payload[1], oy_data_payload[2], oy_echo_crypt, window.OY_CHANNEL_LISTEN[oy_data_payload[2]][1]]);
                    });
                }
            }
        };

        if (Math.random()<=window.OY_CHANNEL_VERIFY_CHANCE||typeof(window.OY_CHANNEL_LISTEN[oy_data_payload[2]])!=="undefined") {
            oy_channel_verify(oy_data_payload, function(oy_verify_pass) {
                if (oy_verify_pass===null) oy_log("Was unable to verify broadcast from channel "+oy_short(oy_data_payload[2])+" at no fault of the sending peer");
                else if (oy_verify_pass===true) oy_local_beam();
                else {
                    oy_log("Peer "+oy_short(oy_peer_id)+" sent an unverifiable channel broadcast, will punish");
                    oy_node_punish(oy_peer_id, "OY_PUNISH_CHANNEL_VERIFY");
                    return false;
                }
            });
        }
        else oy_local_beam();
    }
    else if (oy_data_flag==="OY_CHANNEL_ECHO") {
        //oy_data_payload = [oy_route_passport_passive, oy_route_passport_active, oy_route_dynamic_prev, oy_channel_id, oy_echo_crypt, oy_key_public]
        if (oy_data_payload.length!==6||oy_data_payload[1].length===0||!oy_channel_check(oy_data_payload[3])) {
            oy_log("Peer "+oy_short(oy_peer_id)+" sent invalid channel echo, will punish");
            oy_node_punish(oy_peer_id, "OY_PUNISH_ECHO_INVALID");
            return false;
        }
        if (oy_data_payload[1][0]===window.OY_MAIN['oy_self_short']) {
            oy_log("Echo for channel "+oy_short(oy_data_payload[3])+" found self as the intended final destination");
            oy_echo_process(oy_data_payload);
        }
        else {//carry on reversing the passport until the data reaches the intended destination
            oy_log("Continuing echo of channel "+oy_short(oy_data_payload[3]));
            oy_data_route("OY_LOGIC_FOLLOW", "OY_CHANNEL_ECHO", oy_data_payload);
        }
    }
    else if (oy_data_flag==="OY_CHANNEL_RECOVER") {
        //oy_data_payload = [oy_route_passport_passive, oy_route_passport_active, oy_channel_id, oy_hash_keep]
        if (oy_data_payload.length!==4||oy_data_payload[1].length===0||!oy_channel_check(oy_data_payload[2])) {
            oy_log("Peer "+oy_short(oy_peer_id)+" sent invalid channel recover request, will punish");
            oy_node_punish(oy_peer_id, "OY_PUNISH_RECOVER_INVALID");
            return false;
        }
        if (oy_data_payload[1][0]===window.OY_MAIN['oy_self_short']) {
            oy_log("Channel recover request for channel "+oy_short(oy_data_payload[2])+" found self as the intended final destination");
            if (typeof(window.OY_CHANNEL_LISTEN[oy_data_payload[2]])==="undefined"||typeof(window.OY_CHANNEL_KEEP[oy_data_payload[2]])==="undefined") {
                oy_log("Channel "+oy_short(oy_data_payload[2])+" is not being kept locally");
                return false;
            }
            else {
                let oy_channel_respond = [];
                for (let oy_broadcast_hash in window.OY_CHANNEL_KEEP[oy_data_payload[2]]) {
                    if (oy_data_payload[3].indexOf(oy_broadcast_hash)===-1) oy_channel_respond.push([oy_broadcast_hash, window.OY_CHANNEL_KEEP[oy_data_payload[2]][oy_broadcast_hash]]);
                }
                if (oy_channel_respond.length===0) {
                    oy_log("No unknown broadcast payloads found for channel "+oy_short(oy_data_payload[2]));
                    return false;
                }
                oy_channel_respond.sort(function(){return 0.5 - Math.random()});
                while (oy_channel_respond.length>window.OY_CHANNEL_RESPOND_MAX) oy_channel_respond.pop();
                oy_data_route("OY_LOGIC_FOLLOW", "OY_CHANNEL_RESPOND", [[], oy_data_payload[0], oy_data_payload[2], oy_channel_respond]);
            }
        }
        else {//carry on reversing the passport until the data reaches the intended destination
            oy_log("Continuing channel recover request of channel "+oy_short(oy_data_payload[2]));
            oy_data_route("OY_LOGIC_FOLLOW", "OY_CHANNEL_RECOVER", oy_data_payload);
        }
        return true;
    }
    else if (oy_data_flag==="OY_CHANNEL_RESPOND") {
        //oy_data_payload = [oy_route_passport_passive, oy_route_passport_active, oy_channel_id, oy_channel_respond]
        if (oy_data_payload.length!==4||oy_data_payload[1].length===0||!oy_channel_check(oy_data_payload[2])||oy_data_payload[3].length===0) {
            oy_log("Peer "+oy_short(oy_peer_id)+" sent invalid channel respond sequence, will punish");
            oy_node_punish(oy_peer_id, "OY_PUNISH_RESPOND_INVALID");
            return false;
        }
        if (oy_data_payload[1][0]===window.OY_MAIN['oy_self_short']) {
            oy_log("Channel respond sequence for channel "+oy_short(oy_data_payload[2])+" found self as the intended final destination");
            if (typeof(window.OY_CHANNEL_TOP[oy_data_payload[2]])!=="undefined"&&typeof(window.OY_CHANNEL_TOP[oy_data_payload[2]][oy_data_payload[0][0]])!=="undefined"&&oy_local_time-window.OY_CHANNEL_TOP[oy_data_payload[2]][oy_data_payload[0][0]][1]<window.OY_CHANNEL_RECOVERTIME) {
                oy_log("A local session was not found for respond sequence for channel "+oy_short(oy_data_payload[2]));
                return false;
            }
            else {
                oy_log("Local session found for respond sequence for channel "+oy_short(oy_data_payload[2]));
                window.OY_CHANNEL_TOP[oy_data_payload[2]][oy_data_payload[0][0]][0] = oy_local_time;
                window.OY_CHANNEL_TOP[oy_data_payload[2]][oy_data_payload[0][0]][2] = oy_data_payload[0];

                if (typeof(window.OY_CHANNEL_KEEP[oy_data_payload[2]])==="undefined") window.OY_CHANNEL_KEEP[oy_data_payload[2]] = {};

                for (let i in oy_data_payload[3]) {
                    if (oy_channel_approved(oy_data_payload[2], oy_data_payload[3][i][1][8])&&oy_channel_approved(oy_data_payload[2], oy_data_payload[3][i][1][5])) {
                        oy_key_verify(oy_data_payload[3][i][1][8], oy_data_payload[3][i][1][7], oy_data_payload[3][i][1][4], function(oy_key_valid) {
                            if (oy_key_valid===true) {
                                oy_log("Valid secondary signature for broadcast hash "+oy_short(oy_data_payload[3][i][0])+" from channel "+oy_short(oy_data_payload[2]));
                                oy_key_verify(oy_data_payload[3][i][1][5], oy_data_payload[3][i][1][4], oy_data_payload[3][i][1][3], function(oy_key_valid) {
                                    if (oy_key_valid===true) {
                                        oy_log("Valid primary signature for broadcast hash "+oy_short(oy_data_payload[3][i][0])+" from channel "+oy_short(oy_data_payload[2]));
                                        if (typeof(window.OY_CHANNEL_KEEP[oy_data_payload[2]][oy_data_payload[3][i][0]])==="undefined") window.OY_CHANNEL_KEEP[oy_data_payload[2]][oy_data_payload[3][i][0]] = [oy_data_payload[3][i][1][0], oy_data_payload[3][i][1][1], oy_data_payload[3][i][1][2], oy_data_payload[3][i][1][3], oy_data_payload[3][i][1][4], oy_data_payload[3][i][1][5], oy_data_payload[3][i][1][6], [[oy_data_payload[3][i][1][7], oy_data_payload[3][i][1][8]]]];
                                        else if (typeof(window.OY_CHANNEL_KEEP[oy_data_payload[2]][oy_data_payload[3][i][0]][7])!=="undefined") window.OY_CHANNEL_KEEP[oy_data_payload[2]][oy_data_payload[3][i][0]][7].push([oy_data_payload[3][i][1][7], oy_data_payload[3][i][1][8]]);
                                        else oy_log("Could not record channel respond sequence for broadcast hash "+oy_short(oy_data_payload[3][i][0])+" from channel "+oy_short(oy_data_payload[2])+", go tell Bruno", 1);
                                    }
                                    else oy_log("Invalid primary signature for broadcast hash "+oy_short(oy_data_payload[3][i][0])+" from channel "+oy_short(oy_data_payload[2]));
                                });
                            }
                            else oy_log("Invalid secondary signature for broadcast hash "+oy_short(oy_data_payload[3][i][0])+" from channel "+oy_short(oy_data_payload[2]));
                        });
                    }
                    else oy_log("Primary and/or secondary signatures were not found in the approval list of the current block for channel "+oy_short(oy_data_payload[2]))
                    //oy_data_payload[3][i][1];
                }
            }
        }
        else {//carry on reversing the passport until the data reaches the intended destination
            oy_log("Continuing channel respond sequence of channel "+oy_short(oy_data_payload[2]));
            oy_data_route("OY_LOGIC_FOLLOW", "OY_CHANNEL_RESPOND", oy_data_payload);
        }
    }
    else if (oy_data_flag==="OY_PEER_LATENCY") {
        oy_log("Responding to latency request from peer "+oy_short(oy_peer_id));
        oy_key_sign(window.OY_MAIN['oy_self_private'], window.OY_MESH_DYNASTY+oy_data_payload[0], function(oy_key_signature) {
            oy_log("Signed peer latency sequence from "+oy_short(oy_peer_id));
            oy_data_payload[0] = oy_key_signature;
            if (oy_data_payload[1]===null) oy_data_payload[1] = window.OY_MAIN['oy_self_public'];
            oy_data_beam(oy_peer_id, "OY_LATENCY_RESPONSE", oy_data_payload);
        });
    }
    else if (oy_data_flag==="OY_PEER_TERMINATE") {
        oy_peer_remove(oy_peer_id);//return the favour
        oy_log("Removed peer "+oy_short(oy_peer_id)+" who terminated peership first with reason: "+oy_data_payload);
        return true;
    }
    else if (oy_data_flag==="OY_BLACKLIST") {
        oy_peer_remove(oy_peer_id);//return the favour
        oy_node_punish(oy_peer_id, "OY_PUNISH_BLACKLIST_RETURN");
        oy_log("Punished peer "+oy_short(oy_peer_id)+" who blacklisted self");
        return true;
    }
    else if (oy_data_flag==="OY_LATENCY_DECLINE") {
        oy_log("Peer "+oy_short(oy_peer_id)+" declined our latency request, will cease and punish");
        oy_node_reset(oy_peer_id);
        oy_node_punish(oy_peer_id, "OY_PUNISH_LATENCY_DECLINE");
        return false;
    }
    else if (oy_data_flag==="OY_PEER_REFER") {//is self's peer asking for self to refer some of self's other peers
        let oy_peer_select = oy_peer_rand([oy_short(oy_peer_id)]);
        if (oy_peer_select===false) {
            oy_log("Self doesn't have any available peers to recommend");
            return false;
        }
        oy_data_beam(oy_peer_id, "OY_PEER_RECOMMEND", oy_peer_select);
    }
    else if (oy_data_flag==="OY_PEER_RECOMMEND") {
        if (oy_peer_id===oy_data_payload) {
            oy_log("Peer "+oy_short(oy_peer_id)+" recommended themselves, will punish");
            oy_node_punish(oy_peer_id, "OY_PUNISH_RECOMMEND_SELF");
            return false;
        }
        oy_node_initiate(oy_data_payload, true);
    }
}

//checks if node is in mutually paired list
function oy_peer_check(oy_node_id) {
    return typeof(window.OY_PEERS[oy_node_id])!=="undefined";
}

//reports peership data to top, leads to seeing mesh big picture, mesh stability development
function oy_peer_report() {
    let oy_xhttp = new XMLHttpRequest();
    oy_xhttp.onreadystatechange = function() {
        if (this.readyState===4&&this.status===200) {
            if (this.responseText.substr(0, 5)==="ERROR"||this.responseText.length===0) {
                oy_log("Received error from peer_report@top: "+this.responseText);
                return false;
            }
            if (this.responseText==="OY_REPORT_SUCCESS") oy_log("Peer report to top succeeded");
            else oy_log("Peer report to top failed");
        }
    };
    oy_xhttp.open("POST", "https://top.oyster.org/oy_peer_report.php", true);
    oy_xhttp.send("oy_peer_report="+JSON.stringify([window.OY_MAIN['oy_self_id'], window.OY_PEERS, window.OY_BLACKLIST]));
}

function oy_node_reset(oy_node_id) {
    delete window.OY_LATENCY[oy_node_id];
    delete window.OY_PROPOSED[oy_node_id];
    delete window.OY_PEERS_PRE[oy_node_id];
    delete window.OY_ENGINE[0][oy_node_id];
}

function oy_node_connect(oy_node_id, oy_callback) {
    if (oy_node_id===false||oy_node_id===window.OY_MAIN['oy_self_id']) {
        oy_log("Tried to connect to invalid node ID: "+oy_node_id, 1);//functions need to validate node_id before forwarding here
        return false;
    }
    if (typeof(window.OY_WARM[oy_node_id])!=="undefined") {
        oy_log("Connection with node "+oy_short(oy_node_id)+" is already warming up");
        return false;
    }
    else if (typeof(window.OY_COLD[oy_node_id])!=="undefined") {
        oy_log("Connection with node "+oy_short(oy_node_id)+" is cold");
        return false;
    }
    else if (typeof(window.OY_NODES[oy_node_id])==="undefined"||window.OY_NODES[oy_node_id].open===false) {
        window.OY_WARM[oy_node_id] = Date.now()/1000;
        oy_log("Connection warming up with node "+oy_short(oy_node_id));
        let oy_local_conn = window.OY_CONN.connect(oy_node_id);
        oy_local_conn.on('open', function() {
            delete window.OY_WARM[oy_node_id];
            window.OY_NODES[oy_node_id] = oy_local_conn;
            oy_log("Connection status: "+window.OY_NODES[oy_node_id].open+" with node "+oy_short(oy_node_id));
            if (typeof(oy_callback)==="function") oy_callback();
        });
        oy_local_conn.on('error', function() {
            delete window.OY_WARM[oy_node_id];
            delete window.OY_NODES[oy_node_id];
            oy_log("Connection to node "+oy_short(oy_node_id)+" failed, will punish");
            oy_node_punish(oy_node_id, "OY_PUNISH_CONNECT_FAIL");
        });
        return false;
    }
    return window.OY_NODES[oy_node_id].open;
}

function oy_node_disconnect(oy_node_id) {
    if (typeof(window.OY_COLD[oy_node_id])==="undefined"&&typeof(window.OY_NODES[oy_node_id])!=="undefined") {
        if (window.OY_NODES[oy_node_id].open===true) {
            window.OY_COLD[oy_node_id] = true;
            setTimeout(function() {
                window.OY_NODES[oy_node_id].close();
                delete window.OY_COLD[oy_node_id];
                delete window.OY_NODES[oy_node_id];
                oy_log("Disconnected from node "+oy_short(oy_node_id));
            }, window.OY_NODE_DELAYTIME*1000);
        }
        else delete window.OY_NODES[oy_node_id];
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
function oy_node_punish(oy_node_id, oy_punish_reason) {
    oy_node_reset(oy_node_id);
    if (typeof(oy_punish_reason)==="undefined") oy_punish_reason = null;
    if (typeof(window.OY_BLACKLIST[oy_node_id])==="undefined") {
        //[0] is inform count, [1] is blacklist expiration time, [2] is inform boolean (if node was informed of blacklist), [3] is punish reason tracking (for diagnostics, reported to top)
        window.OY_BLACKLIST[oy_node_id] = [1, (Date.now()/1000)+window.OY_NODE_BLACKTIME, false, [oy_punish_reason]];//ban expiration time is defined here since we do not know if OY_NODE_TOLERANCE will change in the future
    }
    else {
        window.OY_BLACKLIST[oy_node_id][0]++;
        window.OY_BLACKLIST[oy_node_id][1] = (Date.now()/1000)+window.OY_NODE_BLACKTIME;
        window.OY_BLACKLIST[oy_node_id][3].push(oy_punish_reason);
    }
    if (window.OY_BLACKLIST[oy_node_id][0]>window.OY_NODE_TOLERANCE&&oy_peer_check(oy_node_id)) oy_peer_remove(oy_node_id);
    oy_local_store("oy_blacklist", window.OY_BLACKLIST);
    return true;
}

//where the aggregate connectivity of the entire mesh begins
function oy_node_initiate(oy_node_id, oy_list_force) {
    if (oy_peer_check(oy_node_id)) {
        oy_log("Halted initiation with agreed upon peer "+oy_short(oy_node_id));
        return false;
    }
    else if (oy_peer_pre_check(oy_node_id)) {
        oy_log("Halted initiation with pre peer "+oy_short(oy_node_id));
        return false;
    }
    else if (oy_node_proposed(oy_node_id)) {
        oy_log("Halted initiation with proposed-to node "+oy_short(oy_node_id));
        return false;
    }
    else if (oy_node_blocked(oy_node_id)) {
        oy_log("Halted initiation with blacklisted node "+oy_short(oy_node_id));
        return false;
    }
    else if (oy_latency_check(oy_node_id)) {
        oy_log("Halted initiation with node "+oy_short(oy_node_id)+" during a latency session");
        return false;
    }
    else if (window.OY_PEER_COUNT>=window.OY_PEER_MAX&&typeof(oy_list_force)==="undefined"||window.OY_PEER_COUNT>(window.OY_PEER_MAX+1)) {
        oy_log("Halted initiation whilst peer list is saturated");
        return false;
    }
    let oy_callback_local = function() {
        oy_data_beam(oy_node_id, "OY_PEER_REQUEST", null);
        window.OY_PROPOSED[oy_node_id] = (Date.now()/1000)+window.OY_NODE_PROPOSETIME;//set proposal session with expiration timestamp
        oy_local_store("oy_proposed", window.OY_PROPOSED);
    };
    if (oy_node_connect(oy_node_id, oy_callback_local)===true) oy_callback_local();
    return true;
}

//retrieves nodes from and submit self id to top.oyster.org
function oy_node_assign() {
    let oy_xhttp = new XMLHttpRequest();
    oy_xhttp.onreadystatechange = function() {
        if (this.readyState===4&&this.status===200) {
            if (this.responseText.substr(0, 5)==="ERROR"||this.responseText.length===0) {
                oy_log("Received error from node_assign@top: "+this.responseText);
                return false;
            }
            let oy_node_array = JSON.parse(this.responseText);
            for (let i in oy_node_array) {
                oy_node_initiate(oy_node_array[i]);
            }
        }
    };
    oy_xhttp.open("POST", "https://top.oyster.org/oy_node_assign.php", true);
    oy_xhttp.send("oy_node_id="+window.OY_MAIN['oy_self_id']);
}

//respond to a node that is not mutually peered with self
function oy_node_negotiate(oy_node_id, oy_data_flag, oy_data_payload) {
    if (oy_data_flag==="OY_BLACKLIST") {
        oy_log("Node "+oy_short(oy_node_id)+" blacklisted us, will return the favour");
        oy_node_punish(oy_node_id, "OY_PUNISH_BLACKLIST_RETURN");
        oy_node_disconnect(oy_node_id);
        return false;
    }
    else if (oy_data_flag==="OY_PEER_TERMINATE") {
        oy_log("Received termination notice with reason: "+oy_data_payload+" from non-peer, most likely we terminated him first");
        oy_node_reset(oy_node_id);
        oy_node_disconnect(oy_node_id);
        return false;
    }
    else if (oy_data_flag==="OY_PEER_AFFIRM") {
        if (oy_peer_pre_check(oy_node_id)) {
            oy_peer_add(oy_node_id);
            oy_log("Confirmed mutual peer "+oy_short(oy_node_id));
            return true;
        }
        else {
            oy_log("Received a peership affirmation notice from a non-peer, will punish");
            oy_node_punish(oy_node_id, "OY_PUNISH_FALSE_AFFIRM");
            return false;
        }
    }
    else if (oy_data_flag==="OY_PEER_LATENCY"&&(oy_node_proposed(oy_node_id)||oy_peer_pre_check(oy_node_id))) {//respond to latency ping from node with peer proposal arrangement
        oy_key_sign(window.OY_MAIN['oy_self_private'], window.OY_MESH_DYNASTY+oy_data_payload[0], function(oy_key_signature) {
            oy_log("Signed peer latency sequence from "+oy_short(oy_node_id));
            oy_data_payload[0] = oy_key_signature;
            if (oy_data_payload[1]===null) oy_data_payload[1] = window.OY_MAIN['oy_self_public'];
            oy_data_beam(oy_node_id, "OY_LATENCY_RESPONSE", oy_data_payload);
        });
    }
    else if (oy_node_proposed(oy_node_id)) {//check if this node was previously proposed to for peering by self
        if (oy_data_flag==="OY_PEER_ACCEPT") {//node has accepted self's peer request
            oy_latency_test(oy_node_id, "OY_PEER_ACCEPT", true);
        }
        else if (oy_data_flag==="OY_PEER_REJECT") {//node has rejected self's peer request
            oy_log("Node "+oy_short(oy_node_id)+" rejected peer request with reason: "+oy_data_payload);
            oy_node_punish(oy_node_id, "OY_PUNISH_REJECT_RETURN");//we need to prevent nodes with far distances/long latencies from repeatedly communicating
            oy_node_disconnect(oy_node_id);
            return true;
        }
    }
    else if (oy_data_flag==="OY_PEER_REQUEST") {
        let oy_callback_local = function() {
            oy_latency_test(oy_node_id, "OY_PEER_REQUEST", true);
        };
        if (oy_node_connect(oy_node_id, oy_callback_local)===true) oy_callback_local();
        return true;
    }
    else if (oy_data_flag==="OY_PEER_LATENCY") {
        oy_log("Node "+oy_short(oy_node_id)+" sent a latency spark request whilst not a peer, will ignore");
        oy_data_beam(oy_node_id, "OY_LATENCY_DECLINE", null);
        oy_node_disconnect(oy_node_id);
        return false;
    }
    else if (oy_data_flag==="OY_LATENCY_DECLINE") {
        oy_log("Node "+oy_short(oy_node_id)+" declined our latency request, will cease and punish");
        oy_node_punish(oy_node_id, "OY_PUNISH_LATENCY_DECLINE");
        oy_node_disconnect(oy_node_id);
        return false;
    }
    else {
        oy_log("Node "+oy_short(oy_node_id)+" sent an incoherent message with flag "+oy_data_flag);
        oy_node_punish(oy_node_id, "OY_PUNISH_DATA_INCOHERENT");
        oy_node_disconnect(oy_node_id);
        return false;
    }
}

//process the latency response from another node
function oy_latency_response(oy_node_id, oy_data_payload) {
    if (typeof(window.OY_LATENCY[oy_node_id])==="undefined") {
        oy_log("Node "+oy_short(oy_node_id)+" sent a latency response whilst no latency session exists");
        oy_node_punish(oy_node_id, "OY_PUNISH_LATENCY_NONE");
        return false;
    }
    let oy_time_local = Date.now()/1000;
    if (window.OY_LATENCY[oy_node_id][5]===null) {
        if (typeof(oy_data_payload[1])==="undefined"||oy_data_payload[1]===null) {
            oy_log("Node "+oy_short(oy_node_id)+" sent a latency response without any public key");
            oy_node_punish(oy_node_id, "OY_PUNISH_SIGN_NONE");
            delete window.OY_LATENCY[oy_node_id];
            return false;
        }
        let oy_implicit_id = oy_hash_gen(oy_data_payload[1]);
        if (oy_implicit_id!==oy_node_id) {
            oy_log("Node "+oy_short(oy_node_id)+" sent a latency response with an invalid public key");
            oy_node_punish(oy_node_id, "OY_PUNISH_SIGN_INVALID");
            delete window.OY_LATENCY[oy_node_id];
            return false;
        }
        window.OY_LATENCY[oy_node_id][5] = oy_data_payload[1];
    }
    oy_key_verify(window.OY_LATENCY[oy_node_id][5], oy_data_payload[0], window.OY_MESH_DYNASTY+window.OY_LATENCY[oy_node_id][0], function(oy_key_valid) {
        if (oy_key_valid===false) {
            oy_log("Node "+oy_short(oy_node_id)+" failed to sign latency sequence, will punish");
            oy_node_punish(oy_node_id, "OY_PUNISH_SIGN_FAIL");
            delete window.OY_LATENCY[oy_node_id];
            return false;
        }
        if (window.OY_LATENCY[oy_node_id][0].repeat(window.OY_LATENCY_SIZE)===oy_data_payload[2]) {//check if payload data matches latency session definition
            oy_log("Node "+oy_short(oy_node_id)+" sent a valid latency ping");

            if (oy_peer_check(oy_node_id)) window.OY_PEERS[oy_node_id][1] = oy_time_local;//update last msg timestamp for peer, no need to update localstorage via oy_local_store() (could be expensive)

            window.OY_LATENCY[oy_node_id][2]++;
            window.OY_LATENCY[oy_node_id][4] += oy_time_local-window.OY_LATENCY[oy_node_id][3];//calculate how long the round trip took, and add it to aggregate time
            if (window.OY_LATENCY[oy_node_id][1]!==window.OY_LATENCY[oy_node_id][2]) {
                oy_log("There was a problem with the latency test with node "+oy_short(oy_node_id)+", perhaps simultaneous instances");
                return false;
            }
            if (window.OY_LATENCY[oy_node_id][2]>=window.OY_LATENCY_REPEAT) {
                let oy_latency_result = window.OY_LATENCY[oy_node_id][4]/window.OY_LATENCY[oy_node_id][2];
                oy_log("Finished latency test ["+window.OY_LATENCY[oy_node_id][6]+"] with node "+oy_short(oy_node_id)+" with average round-about: "+oy_latency_result+" seconds");
                if (window.OY_LATENCY[oy_node_id][6]==="OY_PEER_REQUEST"||window.OY_LATENCY[oy_node_id][6]==="OY_PEER_ACCEPT") {
                    //logic for accepting a peer request begins here
                    if (oy_latency_result>window.OY_LATENCY_MAX) {
                        oy_log("Node "+oy_short(oy_node_id)+" has latency that breaches max, will punish");
                        if (window.OY_LATENCY[oy_node_id][6]==="OY_PEER_ACCEPT") oy_data_beam(oy_node_id, "OY_PEER_TERMINATE", "OY_PUNISH_LATENCY_BREACH");
                        else oy_data_beam(oy_node_id, "OY_PEER_REJECT", "OY_PUNISH_LATENCY_BREACH");
                        oy_node_punish(oy_node_id, "OY_PUNISH_LATENCY_BREACH");
                    }
                    else if (window.OY_PEER_COUNT<window.OY_PEER_MAX) {
                        if (window.OY_LATENCY[oy_node_id][6]==="OY_PEER_ACCEPT") {
                            oy_peer_add(oy_node_id);
                            oy_data_beam(oy_node_id, "OY_PEER_AFFIRM", null);
                            oy_log("Added node "+oy_short(oy_node_id)+" as a peer");
                        }
                        else {
                            oy_peer_pre_add(oy_node_id);
                            oy_data_beam(oy_node_id, "OY_PEER_ACCEPT", null);
                            oy_log("Added node "+oy_short(oy_node_id)+" to pre peer list");
                        }
                        oy_peer_latency(oy_node_id, oy_latency_result);
                    }
                    else if (window.OY_PEER_COUNT<=window.OY_PEER_MAX) {
                        let oy_peer_weak = [false, -1];
                        let oy_peer_local;
                        for (oy_peer_local in window.OY_PEERS) {
                            if (oy_peer_local==="oy_aggregate_node") continue;
                            if (window.OY_PEERS[oy_peer_local][3]>oy_peer_weak[1]) {
                                oy_peer_weak = [oy_peer_local, window.OY_PEERS[oy_peer_local][3]];
                            }
                        }
                        oy_log("Current weakest peer is "+oy_short(oy_peer_weak[0])+" with latency of "+oy_peer_weak[1]);
                        if ((oy_latency_result*(1+window.OY_LATENCY_WEAK_BUFFER))<oy_peer_weak[1]) {
                            oy_log("New peer request has better latency than current weakest peer");
                            oy_peer_remove(oy_peer_weak[0]);
                            if (window.OY_LATENCY[oy_node_id][6]==="OY_PEER_ACCEPT") {
                                oy_peer_add(oy_node_id);
                                oy_data_beam(oy_node_id, "OY_PEER_AFFIRM", null);
                                oy_log("Added node "+oy_short(oy_node_id)+" as a peer");
                            }
                            else {
                                oy_peer_pre_add(oy_node_id);
                                oy_data_beam(oy_node_id, "OY_PEER_ACCEPT", null);
                                oy_log("Added node "+oy_short(oy_node_id)+" to pre peer list");
                            }
                            oy_peer_latency(oy_node_id, oy_latency_result);
                            oy_log("Removed peer "+oy_short(oy_peer_weak[0])+" and potentially added peer "+oy_short(oy_node_id));
                        }
                        else {
                            oy_log("New peer request has insufficient latency");
                            if (window.OY_LATENCY[oy_node_id][6]==="OY_PEER_ACCEPT") oy_data_beam(oy_node_id, "OY_PEER_TERMINATE", "OY_PUNISH_LATENCY_WEAK");
                            else oy_data_beam(oy_node_id, "OY_PEER_REJECT", "OY_PUNISH_LATENCY_WEAK");
                            oy_node_punish(oy_node_id, "OY_PUNISH_LATENCY_WEAK");
                        }
                    }
                }
                else if (oy_peer_check(oy_node_id)&&window.OY_LATENCY[oy_node_id][6]==="OY_PEER_ROUTINE") {
                    oy_data_beam(oy_node_id, "OY_PEER_AFFIRM", null);
                    oy_peer_latency(oy_node_id, oy_latency_result);
                }
                if (oy_peer_check(oy_node_id)) window.OY_PEERS[oy_node_id][2] = oy_time_local;
                delete window.OY_LATENCY[oy_node_id];
                return true
            }
            oy_latency_test(oy_node_id, window.OY_LATENCY[oy_node_id][6], false);
        }
        else {
            oy_log("Node "+oy_short(oy_node_id)+" sent an invalid latency ping, will punish");
            oy_node_punish(oy_node_id, "OY_PUNISH_LATENCY_INVALID");
        }
    });
}

//test latency performance between self and node
function oy_latency_test(oy_node_id, oy_latency_followup, oy_latency_new) {
    if (typeof(window.OY_LATENCY[oy_node_id])==="undefined") {
        //[0] is pending payload unique string
        //[1] is ping stage (multiple pings per stage)
        //[2] is valid pings received back
        //[3] is start time for latency test timer
        //[4] is aggregate time taken (between all received pings)
        //[5] is counter-node's public key
        //[6] is followup flag i.e. what logic should follow after the latency test concludes
        window.OY_LATENCY[oy_node_id] = [null, 0, 0, 0, 0, null, oy_latency_followup];
    }
    else if (oy_latency_new===true) {
        oy_log("New duplicate latency instance with "+oy_short(oy_node_id)+" was blocked");
        return false;
    }
    if (oy_latency_followup!==window.OY_LATENCY[oy_node_id][6]) {
        oy_log("Two simultaneous latency test instances crashed into each other", 1);
        return false;
    }
    //ping a unique payload string that is repeated OY_LATENCY_SIZE amount of times
    window.OY_LATENCY[oy_node_id][0] = oy_rand_gen(window.OY_LATENCY_LENGTH);
    if (oy_data_beam(oy_node_id, "OY_PEER_LATENCY", [window.OY_LATENCY[oy_node_id][0], window.OY_LATENCY[oy_node_id][5], window.OY_LATENCY[oy_node_id][0].repeat(window.OY_LATENCY_SIZE)])) {
        window.OY_LATENCY[oy_node_id][1]++;
        window.OY_LATENCY[oy_node_id][3] = Date.now()/1000;
        oy_log("Latency ping sent to node "+oy_short(oy_node_id));
        return true;
    }
    delete window.OY_LATENCY[oy_node_id];
    oy_log("Latency ping to node "+oy_short(oy_node_id)+" failed", 1);
    return false;
}

function oy_latency_check(oy_node_id) {
    return typeof(window.OY_LATENCY[oy_node_id])!=="undefined";
}

//measures data flow on the mesh in either beam or soak direction
//returns false on mesh flow violation and true on compliance
function oy_data_measure(oy_data_beam, oy_node_id, oy_data_length) {
    if (!oy_peer_check(oy_node_id)&&oy_node_id!=="oy_aggregate_node") {
        oy_log("Call to data_measure was made with non-existent peer: "+oy_short(oy_node_id));
        return false;
    }
    let oy_time_local = Date.now()/1000;
    let oy_array_select;
    if (oy_data_beam===false) oy_array_select = 8;
    else oy_array_select = 6;
    if (oy_data_length!==null) window.OY_PEERS[oy_node_id][oy_array_select].push([oy_time_local, oy_data_length]);
    if (typeof(window.OY_PEERS[oy_node_id][oy_array_select][0])==="undefined"||typeof(window.OY_PEERS[oy_node_id][oy_array_select][0][0])==="undefined") {
        window.OY_PEERS[oy_node_id][oy_array_select-1] = 0;
        return true;
    }
    while (typeof(window.OY_PEERS[oy_node_id][oy_array_select][0])!=="undefined"&&(oy_time_local-window.OY_PEERS[oy_node_id][oy_array_select][0][0])>window.OY_MESH_MEASURE) window.OY_PEERS[oy_node_id][oy_array_select].shift();
    //do not punish node if there is an insufficient survey to determine accurate mesh flow
    if (window.OY_PEERS[oy_node_id][oy_array_select].length<((oy_data_beam===false)?window.OY_MESH_SOAK_SAMPLE:window.OY_MESH_BEAM_SAMPLE)||window.OY_PEERS[oy_node_id][oy_array_select][0][0]===oy_time_local) {
        window.OY_PEERS[oy_node_id][oy_array_select-1] = 0;
        return true;
    }
    let oy_measure_total = 0;
    for (let i in window.OY_PEERS[oy_node_id][oy_array_select]) oy_measure_total += window.OY_PEERS[oy_node_id][oy_array_select][i][1];
    //either mesh overflow has occurred (parent function will respond accordingly), or mesh flow is in compliance
    window.OY_PEERS[oy_node_id][oy_array_select-1] = Math.round(oy_measure_total/(oy_time_local-window.OY_PEERS[oy_node_id][oy_array_select][0][0]));
    return !(window.OY_PEERS[oy_node_id][oy_array_select-1]>(window.OY_MESH_FLOW*((oy_data_beam===false)?window.OY_MESH_SOAK_BUFFER:window.OY_MESH_BEAM_BUFFER)));
}

//pushes data onto the mesh, data_logic indicates strategy for data pushing
function oy_data_push(oy_data_value, oy_data_handle, oy_callback_tally) {
    let oy_data_superhandle = false;
    if (typeof(oy_data_handle)==="undefined"||oy_data_handle===null) {
        oy_data_value = oy_base_encode(oy_data_value);
        let oy_key_pass = oy_rand_gen();
        oy_data_value = oy_crypt_encrypt(oy_data_value, oy_key_pass);
        oy_data_handle = "OY"+oy_rand_gen(1)+oy_hash_gen(oy_data_value);
        oy_data_superhandle = oy_data_handle+Math.ceil(oy_data_value.length/window.OY_DATA_CHUNK)+"@"+oy_key_pass;
        oy_key_pass = null;
    }
    if (typeof(window.OY_PUSH_HOLD[oy_data_handle])==="undefined") {
        if (oy_data_value===null) {
            oy_log("Halted data push loop for handle "+oy_short(oy_data_handle));
            return true;
        }
        window.OY_PUSH_HOLD[oy_data_handle] = oy_data_value;
        oy_data_value = null;
        window.OY_PUSH_TALLY[oy_data_handle] = [];
        for (let i = 0; i < window.OY_PUSH_HOLD[oy_data_handle].length; i += window.OY_DATA_CHUNK) {
            window.OY_PUSH_TALLY[oy_data_handle].push([i, i+window.OY_DATA_CHUNK, window.OY_PUSH_HOLD[oy_data_handle].slice(i, i+window.OY_SHORT_LENGTH), []]);
        }
    }
    if (typeof(window.OY_DATA_PUSH[oy_data_handle])==="undefined") {
        if (typeof(oy_callback_tally)==="function") window.OY_DATA_PUSH[oy_data_handle] = oy_callback_tally;
        else window.OY_DATA_PUSH[oy_data_handle] = true;
    }
    else if (window.OY_DATA_PUSH[oy_data_handle]===false) {
        oy_log("Halted data push loop for handle "+oy_short(oy_data_handle));
        return true;
    }
    let oy_push_delay = 0;
    if (window.OY_PUSH_HOLD[oy_data_handle].length<window.OY_DATA_CHUNK) {
        oy_log("Pushing handle "+oy_short(oy_data_handle)+" at exclusive nonce: 0");
        oy_data_route("OY_LOGIC_CHAOS", "OY_DATA_PUSH", [[], oy_data_handle, 0, null], [0, window.OY_PUSH_HOLD[oy_data_handle].length]);
        oy_push_delay += window.OY_DATA_PUSH_INTERVAL;
    }
    else {
        let oy_source_lowest = -1;
        let oy_data_nonce_set = [];
        for (let oy_data_nonce in window.OY_PUSH_TALLY[oy_data_handle]) {
            if (window.OY_PUSH_TALLY[oy_data_handle][oy_data_nonce][3].length<oy_source_lowest||oy_source_lowest===-1) {
                oy_source_lowest = window.OY_PUSH_TALLY[oy_data_handle][oy_data_nonce][3].length;
                oy_data_nonce_set = [];
            }
            if (window.OY_PUSH_TALLY[oy_data_handle][oy_data_nonce][3].length>oy_source_lowest) continue;
            oy_data_nonce_set.push(parseInt(oy_data_nonce));
        }
        oy_data_nonce_set.sort(function(){return 0.5 - Math.random()});
        while (oy_data_nonce_set.length>window.OY_DATA_PUSH_NONCE_MAX) oy_data_nonce_set.pop();
        for (let i in oy_data_nonce_set) {
            setTimeout(function() {
                if (typeof(window.OY_PUSH_TALLY[oy_data_handle])==="undefined") return false;
                oy_log("Pushing handle "+oy_short(oy_data_handle)+" at nonce: "+oy_data_nonce_set[i]);
                oy_data_route("OY_LOGIC_CHAOS", "OY_DATA_PUSH", [[], oy_data_handle, oy_data_nonce_set[i], null], [window.OY_PUSH_TALLY[oy_data_handle][oy_data_nonce_set[i]][0], window.OY_PUSH_TALLY[oy_data_handle][oy_data_nonce_set[i]][1]]);
            }, oy_push_delay);
            oy_push_delay += window.OY_DATA_PUSH_INTERVAL;
        }
    }
    setTimeout(function() {
        oy_data_push(oy_data_value, oy_data_handle, null);
    }, oy_push_delay);
    if (oy_data_superhandle!==false) return oy_data_superhandle;
}

function oy_data_push_reset(oy_data_handle) {
    if (!oy_handle_check(oy_data_handle)) return false;
    delete window.OY_DATA_PUSH[oy_data_handle];
    delete window.OY_PUSH_HOLD[oy_data_handle];
    delete window.OY_PUSH_TALLY[oy_data_handle];
    oy_log("Reset data push loop for handle "+oy_short(oy_data_handle));
}

//receives deposit confirmations
function oy_data_tally(oy_data_source, oy_data_handle, oy_data_nonce, oy_data_short, oy_passport_passive_length) {
    if (typeof(window.OY_PUSH_TALLY[oy_data_handle])==="undefined"||typeof(window.OY_PUSH_TALLY[oy_data_handle][oy_data_nonce])==="undefined") {
        oy_log("Received invalid deposit tally for unknown handle "+oy_short(oy_data_handle));
        return false;
    }
    if (window.OY_PUSH_TALLY[oy_data_handle][oy_data_nonce][2]!==oy_data_short) {
        oy_log("Received invalid deposit tally for handle "+oy_short(oy_data_handle));
        return false;
    }
    oy_log("Received matching deposit tally for handle "+oy_short(oy_data_handle));
    if (window.OY_PUSH_TALLY[oy_data_handle][oy_data_nonce][3].indexOf(oy_data_source)===-1) window.OY_PUSH_TALLY[oy_data_handle][oy_data_nonce][3].push(oy_data_source);
    if (typeof(window.OY_DATA_PUSH[oy_data_handle])==="function") window.OY_DATA_PUSH[oy_data_handle](oy_data_nonce, window.OY_PUSH_TALLY[oy_data_handle][oy_data_nonce][3].length, oy_passport_passive_length);
    return true;
}

//pulls data from the mesh
function oy_data_pull(oy_callback, oy_data_handle, oy_callback_collect, oy_data_nonce_max, oy_crypt_pass) {
    if (typeof(oy_data_nonce_max)==="undefined"||typeof(oy_crypt_pass)==="undefined") {
        if (oy_data_handle.indexOf("@")===-1) {
            oy_data_nonce_max = parseInt(oy_data_handle.substr(46));
            oy_crypt_pass = null;
        }
        else {
            let oy_data_handle_split = oy_data_handle.split("@");
            oy_data_nonce_max = parseInt(oy_data_handle_split[0].substr(46));
            oy_crypt_pass = oy_data_handle_split[1];
        }
        oy_data_handle = oy_data_handle.substr(0, 46);
    }
    if (typeof(oy_callback_collect)!=="function") oy_callback_collect = null;
    if (typeof(window.OY_DATA_PULL[oy_data_handle])==="undefined") window.OY_DATA_PULL[oy_data_handle] = [oy_callback, oy_callback_collect, oy_data_nonce_max, oy_crypt_pass];
    else if (window.OY_DATA_PULL[oy_data_handle]===false) {
        oy_log("Halted data pull loop for handle "+oy_short(oy_data_handle));
        return false;
    }
    let oy_nonce_all = {};
    for (let i = 0; i < oy_data_nonce_max; i++) {
        oy_nonce_all[i] = true;
    }
    for (let oy_data_nonce in window.OY_COLLECT[oy_data_handle]) {
        if (Object.keys(window.OY_COLLECT[oy_data_handle][oy_data_nonce]).length===1) delete oy_nonce_all[oy_data_nonce];
    }
    let oy_data_nonce_set = [];
    for (let oy_data_nonce in oy_nonce_all) {
        oy_data_nonce_set.push(parseInt(oy_data_nonce));
    }
    oy_data_nonce_set.sort(function(){return 0.5 - Math.random()});
    while (oy_data_nonce_set.length>window.OY_DATA_PULL_NONCE_MAX) oy_data_nonce_set.pop();
    oy_log("Pulling handle "+oy_short(oy_data_handle)+" with nonce max: "+oy_data_nonce_max+" and nonce set: "+JSON.stringify(oy_data_nonce_set));
    oy_data_route("OY_LOGIC_ALL", "OY_DATA_PULL", [[], oy_rand_gen(), oy_data_handle, oy_data_nonce_set]);
    setTimeout(function() {
        oy_data_pull(oy_callback, oy_data_handle, oy_callback_collect, oy_data_nonce_max, oy_crypt_pass);
    }, window.OY_DATA_PULL_INTERVAL);
}

function oy_data_pull_reset(oy_data_handle) {
    if (!oy_handle_check(oy_data_handle)) return false;
    delete window.OY_DATA_PULL[oy_data_handle];
    delete window.OY_COLLECT[oy_data_handle];
    delete window.OY_CONSTRUCT[oy_data_handle];
    oy_log("Reset data push loop for handle "+oy_short(oy_data_handle));
}

//collects data from fulfill
function oy_data_collect(oy_data_source, oy_data_handle, oy_data_nonce, oy_data_value) {
    if (!oy_handle_check(oy_data_handle)) {
        oy_log("Collect received an invalid handle: "+oy_data_handle+", will not process");
        return false;
    }
    if (typeof(window.OY_DATA_PULL[oy_data_handle])==="undefined") {
        oy_log("Collect could not find a pull session for handle: "+oy_data_handle+", will not process");
        return false;
    }
    if (typeof(window.OY_COLLECT[oy_data_handle])==="undefined") window.OY_COLLECT[oy_data_handle] = {};
    if (typeof(window.OY_COLLECT[oy_data_handle][oy_data_nonce])==="undefined") window.OY_COLLECT[oy_data_handle][oy_data_nonce] = {};
    if (typeof(window.OY_COLLECT[oy_data_handle][oy_data_nonce][oy_data_value])==="undefined") window.OY_COLLECT[oy_data_handle][oy_data_nonce][oy_data_value] = [oy_data_source];
    else if (window.OY_COLLECT[oy_data_handle][oy_data_nonce][oy_data_value].indexOf(oy_data_source)===-1) {
        let oy_source_local;
        for (let oy_data_value_sub in window.OY_COLLECT[oy_data_handle][oy_data_nonce]) {
            if (oy_data_value===oy_data_value_sub) continue;
            oy_source_local = false;
            window.OY_COLLECT[oy_data_handle][oy_data_nonce][oy_data_value_sub].shift();
            if (window.OY_COLLECT[oy_data_handle][oy_data_nonce][oy_data_value_sub].length===0) delete window.OY_COLLECT[oy_data_handle][oy_data_nonce][oy_data_value_sub];
            break;
        }
        if (oy_source_local!==false) window.OY_COLLECT[oy_data_handle][oy_data_nonce][oy_data_value].push(oy_data_source);
    }

    if (typeof(window.OY_DATA_PULL[oy_data_handle][1])==="function") {
        let oy_source_count_highest = -1;
        for (let oy_data_value_sub in window.OY_COLLECT[oy_data_handle][oy_data_nonce]) {
            if (window.OY_COLLECT[oy_data_handle][oy_data_nonce][oy_data_value_sub].length>oy_source_count_highest||oy_source_count_highest===-1) oy_source_count_highest = window.OY_COLLECT[oy_data_handle][oy_data_nonce][oy_data_value_sub].length;
        }
        window.OY_DATA_PULL[oy_data_handle][1](oy_data_nonce, oy_source_count_highest, Object.keys(window.OY_COLLECT[oy_data_handle][oy_data_nonce]).length);
    }

    if (typeof(window.OY_DATA_PULL[oy_data_handle])!=="undefined"&&window.OY_DATA_PULL[oy_data_handle]!==false&&Object.keys(window.OY_COLLECT[oy_data_handle]).length===window.OY_DATA_PULL[oy_data_handle][2]) {
        if (typeof(window.OY_CONSTRUCT[oy_data_handle])==="undefined") window.OY_CONSTRUCT[oy_data_handle] = [];
        for (let oy_data_nonce in window.OY_COLLECT[oy_data_handle]) {
            if (oy_data_nonce>=window.OY_DATA_PULL[oy_data_handle][2]) continue;
            let oy_source_highest = 0;
            let oy_source_data = null;
            for (let oy_data_value in window.OY_COLLECT[oy_data_handle][oy_data_nonce]) {
                if (window.OY_COLLECT[oy_data_handle][oy_data_nonce][oy_data_value].length>oy_source_highest) {
                    oy_source_highest = window.OY_COLLECT[oy_data_handle][oy_data_nonce][oy_data_value].length;
                    oy_source_data = oy_data_value;
                }
            }
            window.OY_CONSTRUCT[oy_data_handle][oy_data_nonce] = oy_source_data;
        }

        if (Object.keys(window.OY_CONSTRUCT[oy_data_handle]).length===window.OY_DATA_PULL[oy_data_handle][2]) {
            oy_log("Construct for "+oy_data_handle+" achieved all "+window.OY_DATA_PULL[oy_data_handle][2]+" nonce(s)");
            let oy_data_construct = window.OY_CONSTRUCT[oy_data_handle].join("");
            if (oy_data_handle.substr(6, 40)===oy_hash_gen(oy_data_construct)) {
                delete window.OY_COLLECT[oy_data_handle];
                delete window.OY_CONSTRUCT[oy_data_handle];
                oy_log("Construct for "+oy_data_handle+" cleared hash check");
                window.OY_DATA_PULL[oy_data_handle][0]("OY"+oy_data_handle+window.OY_DATA_PULL[oy_data_handle][2]+((window.OY_DATA_PULL[oy_data_handle][3]===null)?"":"@"+window.OY_DATA_PULL[oy_data_handle][3]), (window.OY_DATA_PULL[oy_data_handle][3]===null)?null:oy_base_decode(oy_crypt_decrypt(oy_data_construct, window.OY_DATA_PULL[oy_data_handle][3])), oy_data_construct);
                window.OY_DATA_PULL[oy_data_handle] = false;
                return true;
            }
            else oy_log("Construct for handle "+oy_short(oy_data_handle)+" failed hash check");
        }
        else oy_log("Construct for handle "+oy_short(oy_data_handle)+" did not achieve all nonces");
    }
    else oy_log("Collect for handle "+oy_short(oy_data_handle)+" did not achieve all nonces");
}

//routes data pushes and data forwards to the intended destination
function oy_data_route(oy_data_logic, oy_data_flag, oy_data_payload, oy_push_define) {
    if (oy_data_payload[0].indexOf(window.OY_MAIN['oy_self_short'])!==-1) {
        oy_log("Self already stamped passive passport with flag "+oy_data_flag+", will cease date_route");
        return false;
    }
    if (typeof(oy_push_define)!=="undefined") {
        if (typeof(window.OY_DATA_PUSH[oy_data_payload[1]])==="undefined"||window.OY_DATA_PUSH[oy_data_payload[1]]===false||typeof(window.OY_PUSH_HOLD[oy_data_payload[1]])==="undefined") {
            oy_log("Cancelled data route for handle "+oy_data_payload[1]+" due to push session cancellation");
            return true;
        }
        oy_data_payload[3] = window.OY_PUSH_HOLD[oy_data_payload[1]].slice(oy_push_define[0], oy_push_define[1]);
    }
    let oy_peer_select = false;
    if (oy_data_logic==="OY_LOGIC_CHAOS") {
        //oy_data_payload[0] is oy_route_passport_passive
        oy_peer_select = oy_peer_rand(oy_data_payload[0]);
        if (oy_peer_select===false) {
            oy_log("Data route cannot chaos transmit flag "+oy_data_flag);
            return false;
        }
        oy_data_payload[0].push(window.OY_MAIN['oy_self_short']);
        oy_log("Routing data via peer "+oy_short(oy_peer_select)+" with flag "+oy_data_flag);
        oy_data_beam(oy_peer_select, oy_data_flag, oy_data_payload);
    }
    else if (oy_data_logic==="OY_LOGIC_ALL") {
        //oy_data_payload[0] is oy_route_passport_passive
        oy_data_payload[0].push(window.OY_MAIN['oy_self_short']);
        for (let oy_peer_select in window.OY_PEERS) {
            if (oy_peer_select==="oy_aggregate_node"||oy_data_payload[0].indexOf(oy_short(oy_peer_select))!==-1) continue;
            oy_log("Routing data via peer "+oy_short(oy_peer_select)+" with flag "+oy_data_flag);
            oy_data_beam(oy_peer_select, oy_data_flag, oy_data_payload);
        }
    }
    else if (oy_data_logic==="OY_LOGIC_FOLLOW") {
        //oy_data_payload[0] is oy_route_passport_passive
        //oy_data_payload[1] is oy_route_passport_active
        if (oy_data_payload[1].length===0) {
            oy_log("Active passport ran empty on reversal with flag "+oy_data_flag+", will cancel routing");
            return false;
        }
        let oy_peer_final = oy_peer_find(oy_data_payload[1][0]);
        if (oy_peer_final!==false) oy_peer_select = oy_peer_final;
        else oy_peer_select = oy_peer_find(oy_data_payload[1].pop());//select the next peer on the active passport
        if (oy_peer_select===false||!oy_peer_check(oy_peer_select)) {
            oy_log("Data route couldn't find reversal peer to send to for flag "+oy_data_flag);
            return false;
        }
        //if (oy_data_payload[1].length===0) oy_data_payload[1].push(oy_peer_select);
        oy_data_payload[0].push(window.OY_MAIN['oy_self_short']);
        oy_log("Routing data via peer "+oy_short(oy_peer_select)+" with flag "+oy_data_flag);
        oy_data_beam(oy_peer_select, oy_data_flag, oy_data_payload);
    }
    else {
        oy_log("Invalid data_logic provided: "+oy_data_logic+", will cancel");
        return false;
    }
    return true;
}

//send data
function oy_data_beam(oy_node_id, oy_data_flag, oy_data_payload) {
    if (window.OY_CONN===null||window.OY_CONN.disconnected!==false) {
        oy_log("Connection handler crashed, skipping "+oy_data_flag+" to "+oy_short(oy_node_id));
        return false;
    }
    let oy_callback_local = function() {
        let oy_data_raw = JSON.stringify([oy_data_flag, oy_data_payload]);//convert data array to JSON
        oy_data_payload = null;
        if (oy_data_raw.length>window.OY_DATA_MAX||(oy_data_flag==="OY_DATA_PULL"&&oy_data_raw.length>window.OY_DATA_PULL_PACKET_MAX)||(oy_data_flag==="OY_CHANNEL_BROADCAST"&&oy_data_raw.length>window.OY_CHANNEL_BROADCAST_PACKET_MAX)) {
            oy_log("Almost sent an excessively sized data sequence for flag "+oy_data_flag+", go tell Bruno", 1);
            return false;
        }
        if ((oy_data_flag==="OY_DATA_PUSH"||oy_data_flag==="OY_DATA_DEPOSIT"||oy_data_flag==="OY_DATA_FULFILL")&&oy_peer_check(oy_node_id)&&!oy_data_measure(true, oy_node_id, null)) {
            oy_log("Cooling off, skipping "+oy_data_flag+" to "+oy_short(oy_node_id));
            return true;
        }
        if (oy_data_flag==="OY_DATA_PULL"||oy_data_flag==="OY_CHANNEL_BROADCAST") {
            let oy_microtime_local = Date.now();
            if (oy_microtime_local-window.OY_PEERS[oy_node_id][9]<=window.OY_LOGIC_ALL_LIMIT) {
                oy_log("Pending beam breached logic_all limit for flag "+oy_data_flag+" to "+oy_short(oy_node_id));
                return true;
            }
            window.OY_PEERS[oy_node_id][9] = oy_microtime_local;
        }
        if (oy_peer_check(oy_node_id)) oy_data_measure(true, oy_node_id, oy_data_raw.length);
        window.OY_NODES[oy_node_id].send(oy_data_raw);//send the JSON-converted data array to the destination node
        oy_log("Sent data to node "+oy_short(oy_node_id)+" with size: "+oy_data_raw.length);
    };
    if (oy_node_connect(oy_node_id, oy_callback_local)===true) oy_callback_local();
    return true;
}

//incoming data validation
function oy_data_soak(oy_node_id, oy_data_raw) {
   try {
       let oy_data = JSON.parse(oy_data_raw);
       if (oy_data&&typeof(oy_data)==="object") {
           if (oy_data[0]==="OY_DATA_PUSH"||oy_data[0]==="OY_DATA_PULL"||oy_data[0]==="OY_DATA_DEPOSIT"||oy_data[0]==="OY_DATA_FULFILL") {
               let oy_peer_last = oy_data[1][0][oy_data[1][0].length-1];
               if (oy_peer_last!==oy_short(oy_node_id)) {
                   oy_log("Peer "+oy_short(oy_node_id)+" lied on the passport, will remove and punish");
                   oy_peer_remove(oy_peer_last);
                   oy_node_punish(oy_peer_last, "OY_PUNISH_PASSPORT_MISMATCH");
                   return false;
               }
               else if (oy_data[1][0].indexOf(window.OY_MAIN['oy_self_short'])!==-1) {
                   oy_log("Peer "+oy_short(oy_node_id)+" sent a data sequence we already processed, will remove and punish");
                   oy_peer_remove(oy_node_id);
                   oy_node_punish(oy_node_id, "OY_PUNISH_PASSPORT_ALREADY");
                   return false;
               }
               if (typeof(window.OY_MAP)==="function") window.OY_MAP(oy_data[0], oy_data[1][0], (oy_data[0]==="OY_DATA_DEPOSIT"||oy_data[0]==="OY_DATA_FULFILL")?oy_data[1][1]:null);
               if (oy_data[0]==="OY_DATA_PUSH"||oy_data[0]==="OY_DATA_PULL"||oy_data[0]==="OY_CHANNEL_BROADCAST") {
                   if (oy_data[1][0].length>1&&!!oy_peer_find(oy_data[1][0][0])) {
                       oy_log("We are peers with the origination node "+oy_data[1][0][0]+", will cease routing");
                       return true;
                   }
                   if (oy_data[0]==="OY_DATA_PULL"||oy_data[0]==="OY_CHANNEL_BROADCAST") {
                       let oy_microtime_local = Date.now();
                       if (!oy_peer_check(oy_node_id)) {
                           oy_log("Soaked OY_LOGIC_ALL from a non-peer "+oy_short(oy_node_id)+", will cease");
                           return false;
                       }
                       else if (oy_microtime_local-window.OY_PEERS[oy_node_id][10]<window.OY_LOGIC_ALL_LIMIT) {
                           oy_log("Peer "+oy_short(oy_node_id)+" breached logic_all limit, will remove and punish");
                           oy_peer_remove(oy_node_id);
                           oy_node_punish(oy_node_id, "OY_PUNISH_LOGIC_BREACH");
                           return false;
                       }
                       window.OY_PEERS[oy_node_id][10] = oy_microtime_local;
                       if (oy_data_raw.length>(oy_data[0]==="OY_DATA_PULL")?window.OY_DATA_PULL_PACKET_MAX:window.OY_CHANNEL_BROADCAST_PACKET_MAX) {
                           oy_log("Peer "+oy_short(oy_node_id)+" sent a data sequence that is too large for "+oy_data[0]+", will remove and punish");
                           oy_peer_remove(oy_node_id);
                           oy_node_punish(oy_node_id, "OY_PUNISH_LOGIC_LARGE");
                           return false;
                       }
                       if (window.OY_ROUTE_DYNAMIC.indexOf(oy_data[1][1])!==-1) {
                           oy_log("We already processed route dynamic "+oy_short(oy_data[1][1])+", will cease routing");
                           return true;
                       }
                       window.OY_ROUTE_DYNAMIC.push(oy_data[1][1]);
                       while (window.OY_ROUTE_DYNAMIC.length>window.OY_ROUTE_DYNAMIC_KEEP) window.OY_ROUTE_DYNAMIC.shift();
                   }
               }
           }
           return oy_data;
       }
   }
   catch (oy_error) {
       oy_log("Data validation exception occurred: "+oy_error);
   }
   oy_log("Node "+oy_short(oy_node_id)+" failed validation");
   return false
}

//deposits data for local retention
function oy_data_deposit(oy_data_handle, oy_data_nonce, oy_data_value) {
    if (typeof(window.OY_DEPOSIT[oy_data_handle])!=="undefined"&&typeof(window.OY_DEPOSIT[oy_data_handle][oy_data_nonce])!=="undefined") return false;
    if (oy_data_value===null) {
        oy_log("Did not store null value for handle "+oy_data_handle+" at nonce "+oy_data_nonce);
        return false;
    }
    if (Math.random()>window.OY_MESH_DEPOSIT_CHANCE) return false;
    if (typeof(window.OY_DEPOSIT[oy_data_handle])==="undefined") window.OY_DEPOSIT[oy_data_handle] = [];
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
        oy_log("Committed data to disk with handle "+oy_data_handle+" at nonce "+oy_data_nonce);
    }
    else window.OY_MAIN['oy_deposit_counter']++;
    return true;
}

function oy_channel_check(oy_channel_id) {
    return oy_channel_id.length===40;
}

//checks if the public key is on the admin or approve list in the current block
function oy_channel_approved(oy_channel_id, oy_key_public) {
    //TODO the public key might need to get referenced from the pearl wallet list section of the block, to save block space
    return (typeof(window.OY_BLOCK[2][oy_channel_id])==="undefined"&&(window.OY_BLOCK[2][oy_channel_id][2].indexOf(oy_key_public)!==-1||window.OY_BLOCK[2][oy_channel_id][3].indexOf(oy_key_public)!==-1));
}

function oy_channel_verify(oy_data_payload, oy_callback) {
    let oy_time_local = Date.now()/1000;
    if (window.OY_BLOCK_HASH===null) {
        oy_callback(null);
        return null;
    }
    else if (oy_channel_approved(oy_data_payload[2], oy_data_payload[5])&&oy_data_payload[6]<=oy_time_local&&oy_data_payload[6]>oy_time_local-window.OY_MESH_EDGE) {
        oy_key_verify(oy_data_payload[5], oy_data_payload[4], oy_data_payload[6]+oy_data_payload[3], function(oy_key_valid) {
            oy_callback(oy_key_valid);
        });
        return null;
    }
    oy_callback(false);
    return null;
}

//broadcasts a signed message for a specified channel
function oy_channel_broadcast(oy_channel_id, oy_channel_payload, oy_key_private, oy_key_public, oy_callback_echo) {
    let oy_time_local = Math.floor(Date.now()/1000);
    oy_key_sign(oy_key_private, oy_time_local+oy_channel_payload, function(oy_payload_crypt) {
        let oy_data_payload = [[], oy_rand_gen(), oy_channel_id, oy_channel_payload, oy_payload_crypt, oy_key_public, oy_time_local];
        oy_channel_verify(oy_data_payload, function(oy_verify_pass) {
            if (oy_verify_pass===true) {
                if (typeof(oy_callback_echo)==="function") window.OY_CHANNEL_ECHO[oy_channel_id+oy_data_payload[1]] = [oy_time_local+window.OY_MESH_EDGE, oy_hash_gen(oy_payload_crypt), oy_callback_echo];
                oy_data_route("OY_LOGIC_ALL", "OY_CHANNEL_BROADCAST", oy_data_payload);
            }
        });
    });
}

//listens for signed messages on a specified channel
function oy_channel_listen(oy_channel_id, oy_callback, oy_key_private, oy_key_public) {
    if (typeof(oy_key_private)==="undefined") oy_key_private = null;
    if (typeof(oy_key_public)==="undefined") oy_key_public = null;
    window.OY_CHANNEL_LISTEN[oy_channel_id] = [oy_key_private, oy_key_public, oy_callback];
}

function oy_channel_mute(oy_channel_id) {
    delete window.OY_CHANNEL_LISTEN[oy_channel_id];
    delete window.OY_CHANNEL_KEEP[oy_channel_id];
    delete window.OY_CHANNEL_TOP[oy_channel_id];
    delete window.OY_CHANNEL_RENDER[oy_channel_id];
}

function oy_echo_process(oy_data_payload) {
    let oy_echo_key = oy_data_payload[3]+oy_data_payload[2];
    if (typeof(window.OY_CHANNEL_ECHO[oy_echo_key])==="undefined") {
        oy_log("Could not find echo session for channel "+oy_short(oy_data_payload[3]));
        return false;
    }
    if ((Date.now/1000|0)>window.OY_CHANNEL_ECHO[oy_echo_key][0]) {
        oy_log("Echo session for channel "+oy_short(oy_data_payload[3])+" has expired");
        delete window.OY_CHANNEL_ECHO[oy_echo_key];
        return false;
    }
    oy_key_verify(oy_data_payload[5], oy_data_payload[4], window.OY_CHANNEL_ECHO[oy_echo_key][1], function(oy_key_valid) {
        if (oy_key_valid===true) {
            oy_log("Valid echo received for channel "+oy_short(oy_data_payload[3]));
            window.OY_CHANNEL_ECHO[oy_echo_key][2](oy_data_payload[3]);
        }
        else oy_log("Invalid echo received for channel "+oy_short(oy_data_payload[3]));
    });
}

function oy_block_time() {
    return (Math.floor(Date.now()/10000))*10;
}

function oy_block_loop() {
    let oy_block_time_local = oy_block_time();
    if (oy_block_time_local!==window.OY_BLOCK_PREV) {
        window.OY_BLOCK_PREV = oy_block_time_local;
        //trigger for mesh consensus

        //----------transitory centralized solution
        let oy_xhttp = new XMLHttpRequest();
        oy_xhttp.onreadystatechange = function() {
            if (this.readyState===4&&this.status===200) {
                window.OY_BLOCK = JSON.parse(this.responseText);
                window.OY_BLOCK_HASH = oy_hash_gen(JSON.stringify(window.OY_BLOCK));//this is what this line will look like in the decentralized version
                document.dispatchEvent(window.OY_BLOCK_TRIGGER);
            }
        };
        oy_xhttp.open("POST", "https://top.oyster.org/oy_block_update.php", true);
        oy_xhttp.send();
        //----------transitory centralized solution
    }
    setTimeout("oy_block_loop()", window.OY_BLOCK_LOOP);
}

//core loop that runs critical functions and checks
function oy_engine(oy_thread_track) {
    if (window.OY_ENGINE_KILL===true) {
        window.OY_ENGINE_KILL = false;
        return true;
    }
    //reboot INIT if the connection was lost
    if (window.OY_MAIN['oy_ready']===true&&(window.OY_CONN===null||window.OY_CONN.disconnected!==false)) {
        oy_log("Engine found connection handler dead, will reboot INIT and kill engine chain");
        window.OY_INIT = 0;
        oy_init();
        return true;
    }

    //service check on all peers
    let oy_time_local = Date.now()/1000;
    if (typeof(oy_thread_track)==="undefined") oy_thread_track = [0, oy_time_local];
    let oy_time_diff_last;
    let oy_time_diff_latency;
    let oy_peer_local;
    for (oy_peer_local in window.OY_PEERS) {
        if (oy_peer_local==="oy_aggregate_node") continue;
        oy_time_diff_last = oy_time_local-window.OY_PEERS[oy_peer_local][1];
        oy_time_diff_latency = oy_time_local-window.OY_PEERS[oy_peer_local][2];
        if (oy_time_diff_last>window.OY_PEER_KEEPTIME||oy_time_diff_latency>window.OY_PEER_LATENCYTIME) {
            if (typeof(window.OY_ENGINE[0][oy_peer_local])==="undefined") {
                oy_log("Engine initiating latency test with peer "+oy_short(oy_peer_local)+", time_diff_last: "+oy_time_diff_last+"/"+window.OY_PEER_KEEPTIME+", time_diff_latency: "+oy_time_diff_latency+"/"+window.OY_PEER_LATENCYTIME);
                if (oy_latency_test(oy_peer_local, "OY_PEER_ROUTINE", true)) window.OY_ENGINE[0][oy_peer_local] = oy_time_local;
                else oy_log("Latency test with peer "+oy_short(oy_peer_local)+" was unable to launch");
            }
            else if (oy_time_local-window.OY_ENGINE[0][oy_peer_local]>window.OY_LATENCY_MAX) {
                oy_log("Engine found non-responsive peer "+oy_short(oy_peer_local)+" with latency lag: "+(oy_time_local-window.OY_ENGINE[0][oy_peer_local])+", will punish");
                oy_node_punish(oy_peer_local, "OY_PUNISH_LATENCY_LAG");
            }
        }
        else delete window.OY_ENGINE[0][oy_peer_local];
    }

    let oy_peer_refer = oy_peer_rand([]);
    if (oy_peer_refer!==false&&window.OY_PEER_COUNT<=window.OY_PEER_MAX&&(oy_time_local-window.OY_REFER_LAST)>window.OY_PEER_REFERTIME) {
        window.OY_REFER_LAST = oy_time_local;
        oy_data_beam(oy_peer_refer, "OY_PEER_REFER", null);
        oy_log("Asked peer "+oy_short(oy_peer_local)+" for peer recommendation");
    }

    if (window.OY_PEER_COUNT<window.OY_PEER_MAX&&(oy_time_local-oy_thread_track[0])>window.OY_NODE_ASSIGNTTIME) {
        oy_thread_track[0] = oy_time_local;
        oy_log("Engine initiating node_assign, peer count is "+window.OY_PEER_COUNT+"/"+window.OY_PEER_MAX);
        oy_node_assign();
    }

    if (window.OY_PEER_COUNT>0&&(oy_time_local-oy_thread_track[1])>window.OY_PEER_REPORTTIME) {
        oy_thread_track[1] = oy_time_local;
        oy_log("Engine initiating peer_report, peer count is "+window.OY_PEER_COUNT+"/"+window.OY_PEER_MAX);
        oy_peer_report();
    }

    for (let oy_node_select in window.OY_WARM) {
        if (oy_time_local-window.OY_WARM[oy_node_select]>window.OY_NODE_DELAYTIME) {
            if (oy_peer_check(oy_node_select)) {
                oy_log("Engine found peer "+oy_short(oy_node_select)+" unable to warm up, will remove and punish");
                oy_peer_remove(oy_node_select);
            }
            oy_node_punish(oy_node_select, "OY_PUNISH_WARM_LAG");
            delete window.OY_WARM[oy_node_select];
            oy_log("Cleaned up expired warming session for node: "+oy_short(oy_node_select));
        }
    }

    let oy_hash_keep = [];
    for (let oy_channel_id in window.OY_CHANNEL_KEEP) {
        let oy_top_count = Object.keys(window.OY_CHANNEL_KEEP[oy_channel_id]).length;
        for (let oy_broadcast_hash in window.OY_CHANNEL_KEEP[oy_channel_id]) {
            if (typeof(window.OY_CHANNEL_LISTEN[oy_channel_id])!=="undefined"&&window.OY_CHANNEL_KEEP[oy_channel_id][oy_broadcast_hash][7].length>Math.floor(oy_top_count*0.5)) {
                oy_hash_keep.push(oy_broadcast_hash);
                if (typeof(window.OY_CHANNEL_RENDER[oy_channel_id])==="undefined") window.OY_CHANNEL_RENDER[oy_channel_id] = {};
                if (typeof(window.OY_CHANNEL_RENDER[oy_channel_id][oy_broadcast_hash])==="undefined") {
                    window.OY_CHANNEL_RENDER[oy_channel_id][oy_broadcast_hash] = true;
                    window.OY_CHANNEL_LISTEN[oy_channel_id][2](window.OY_CHANNEL_KEEP[oy_channel_id][oy_broadcast_hash]);
                }
            }
        }
    }
    for (let oy_channel_id in window.OY_CHANNEL_TOP) {
        if (typeof(window.OY_CHANNEL_LISTEN[oy_channel_id])==="undefined") continue;
        for (let oy_node_select in window.OY_CHANNEL_TOP[oy_channel_id]) {
            if (oy_time_local-window.OY_CHANNEL_TOP[oy_channel_id][oy_node_select][0]>window.OY_CHANNEL_FORGETIME) delete window.OY_CHANNEL_TOP[oy_channel_id][oy_node_select];
            else if (oy_time_local-window.OY_CHANNEL_TOP[oy_channel_id][oy_node_select][1]>window.OY_CHANNEL_RECOVERTIME) {
                window.OY_CHANNEL_TOP[oy_channel_id][oy_node_select][1] = oy_time_local;
                oy_data_route("OY_LOGIC_FOLLOW", "OY_CHANNEL_RECOVER", [[], window.OY_CHANNEL_TOP[oy_channel_id][oy_node_select][2], oy_channel_id, oy_hash_keep])
            }
        }
    }

    for (let oy_echo_key in window.OY_CHANNEL_ECHO) {
        if (window.OY_CHANNEL_ECHO[oy_echo_key][0]<oy_time_local) {
            delete window.OY_CHANNEL_ECHO[oy_echo_key];
            oy_log("Cleaned up expired echo session with key: "+oy_short(oy_echo_key));
        }
    }

    for (let oy_node_select in window.OY_LATENCY) {
        if (oy_time_local-window.OY_LATENCY[oy_node_select][3]>window.OY_LATENCY_MAX) {
            delete window.OY_LATENCY[oy_node_select];
            oy_log("Cleaned up expired latency session for node: "+oy_short(oy_node_select));
        }
    }

    for (let oy_node_select in window.OY_PEERS_PRE) {
        if (window.OY_PEERS_PRE[oy_node_select]<oy_time_local) {
            delete window.OY_PEERS_PRE[oy_node_select];
            oy_log("Cleaned up expired pre peer session for node: "+oy_short(oy_node_select));
        }
    }

    for (let oy_node_select in window.OY_PROPOSED) {
        if (window.OY_PROPOSED[oy_node_select]<oy_time_local) {
            delete window.OY_PROPOSED[oy_node_select];
            oy_log("Cleaned up expired proposal session for node: "+oy_short(oy_node_select));
        }
    }

    for (let oy_node_select in window.OY_BLACKLIST) {
        if (window.OY_BLACKLIST[oy_node_select]<oy_time_local) {
            delete window.OY_BLACKLIST[oy_node_select];
            oy_log("Cleaned up expired blacklist flag for node: "+oy_short(oy_node_select));
        }
    }

    setTimeout(function() {
        oy_engine(oy_thread_track);
    }, window.OY_ENGINE_INTERVAL);
}

//initialize oyster mesh boot up sequence
function oy_init(oy_callback, oy_passthru, oy_console) {
    localStorage.clear();
    if (typeof(oy_console)==="function") {
        console.log("Console redirected to custom function");
        window.OY_CONSOLE = oy_console;
    }
    if (typeof(oy_passthru)==="undefined"||oy_passthru===null) {
        if (window.OY_INIT===1) {
            oy_log("Clashing instance of INIT prevented from running", 1);
            return false;
        }
        window.OY_INIT = 1;
        oy_log("Oyster Mesh initializing...");

        //recover session variables from localstorage
        window.OY_MAIN = oy_local_get("oy_main");
        if (window.OY_MAIN['oy_ready']===true) {
            window.OY_MAIN['oy_ready'] = false;
            oy_log("Recovering P2P session with recovered ID "+window.OY_MAIN['oy_self_short']);
        }
        else {
            oy_key_gen(function(oy_key_private, oy_key_public) {
                //reset cryptographic node id for self, and any persisting variables that are related to the old self id (if any)
                window.OY_MAIN['oy_self_private'] = oy_key_private;
                window.OY_MAIN['oy_self_public'] = oy_key_public;
                window.OY_MAIN['oy_self_id'] = oy_hash_gen(oy_key_public);
                window.OY_MAIN['oy_self_short'] = oy_short(window.OY_MAIN['oy_self_id']);
                window.OY_PEERS = {"oy_aggregate_node":[-1, -1, -1, 0, [], 0, [], 0, [], -1, -1]};
                window.OY_PROPOSED = {};
                oy_local_store("oy_main", window.OY_MAIN);
                oy_local_store("oy_peers", window.OY_PEERS);
                oy_local_store("oy_proposed", window.OY_PROPOSED);
                oy_log("Initiating new P2P session with new ID "+window.OY_MAIN['oy_self_short']);
                oy_init(oy_callback, true);
            });
            return true;
        }
    }

    //TODO most likely this system of clearing out localstorage for absolute measurement will be replaced with an incremental measurement system

    window.OY_DEPOSIT = oy_local_get("oy_deposit");
    window.OY_PURGE = oy_local_get("oy_purge");
    window.OY_PEERS = oy_local_get("oy_peers");
    //window.OY_LATENCY = oy_local_get("oy_latency");
    window.OY_PROPOSED = oy_local_get("oy_proposed");
    window.OY_BLACKLIST = oy_local_get("oy_blacklist");

    //resets localstorage and tests storage limit
    window.OY_DEPOSIT_MAX = Math.floor((oy_local_check()*window.OY_DEPOSIT_CHAR)*window.OY_DEPOSIT_MAX_BUFFER);

    //restore localstorage
    oy_local_store("oy_main", window.OY_MAIN);
    oy_local_store("oy_deposit", window.OY_DEPOSIT);
    oy_local_store("oy_purge", window.OY_PURGE);
    oy_local_store("oy_peers", window.OY_PEERS);
    //oy_local_store("oy_latency", window.OY_LATENCY);
    oy_local_store("oy_proposed", window.OY_PROPOSED);
    oy_local_store("oy_blacklist", window.OY_BLACKLIST);

    window.OY_CONN = new Peer(window.OY_MAIN['oy_self_id'], {host: 'top.oyster.org', port: 8200, path: '/', secure:true});
    window.OY_CONN.on('open', function(oy_self_id) {
        window.OY_MAIN['oy_ready'] = true;
        oy_log("P2P connection ready with self ID "+oy_short(oy_self_id));
        let oy_peer_local;
        for (oy_peer_local in window.OY_PEERS) {
            if (oy_peer_local==="oy_aggregate_node") continue;
            oy_log("Recovering peer "+oy_short(oy_peer_local));
            window.OY_PEER_COUNT++;
            oy_node_connect(oy_peer_local);
        }
        oy_local_store("oy_main", window.OY_MAIN);
        if (typeof(oy_callback)==="function") oy_callback();
    }, null);
    window.OY_CONN.on('connection', function(oy_conn) {
        // Receive messages
        oy_conn.on('data', function (oy_data_raw) {
            oy_log("Data with size "+oy_data_raw.length+" received from node "+oy_short(oy_conn.peer));
            if (oy_data_raw.length>window.OY_DATA_MAX) {
                oy_log("Node "+oy_short(oy_conn.peer)+" sent an excessively sized data sequence, will punish and cease session");
                oy_node_punish(oy_conn.peer, "OY_PUNISH_DATA_BREACH");
                return false;
            }
            let oy_data = oy_data_soak(oy_conn.peer, oy_data_raw);
            if (oy_data===true) return true;
            else if (oy_data===false) {
                oy_log("Node "+oy_short(oy_conn.peer)+" sent invalid data, will remove/punish and cease session");
                oy_node_punish(oy_conn.peer, "OY_PUNISH_DATA_INVALID");
                return false;
            }
            if (oy_data[0]==="OY_LATENCY_RESPONSE") {
                oy_latency_response(oy_conn.peer, oy_data[1]);
            }
            else if (oy_peer_check(oy_conn.peer)) {
                oy_log("Node "+oy_short(oy_conn.peer)+" is mutually peered");
                if (oy_data_measure(false, oy_conn.peer, oy_data_raw.length)===false) {
                    oy_log("Peer "+oy_short(oy_conn.peer)+" exceeded mesh flow compliance limits, will punish");
                    oy_node_punish(oy_conn.peer, "OY_PUNISH_MESH_FLOW");
                }
                oy_peer_process(oy_conn.peer, oy_data[0], oy_data[1]);
            }
            else if (oy_node_blocked(oy_conn.peer)) {
                oy_log("Node "+oy_short(oy_conn.peer)+" is on blacklist, informed: "+window.OY_BLACKLIST[oy_conn.peer][2]);
                if (window.OY_BLACKLIST[oy_conn.peer][2]===false) {
                    window.OY_BLACKLIST[oy_conn.peer][2] = true;
                    oy_data_beam(oy_conn.peer, "OY_BLACKLIST", null);
                }
            }
            else {
                oy_log("Node "+oy_short(oy_conn.peer)+" is either unknown or was recently proposed to for peering");
                if (oy_data_measure(false, "oy_aggregate_node", oy_data_raw.length)===false) oy_log("Node "+oy_short(oy_conn.peer)+" pushed aggregate mesh flow compliance beyond limit");
                else oy_node_negotiate(oy_conn.peer, oy_data[0], oy_data[1]);
            }
        });
    }, null);
    setTimeout(function() {
        if (window.OY_MAIN['oy_ready']===true) {
            oy_log("Connection is now ready, sparking engine");
            setTimeout("oy_engine()", 200);
            setTimeout("oy_block_loop()", 1);
        }
        else {
            oy_log("Connection is was not established before the ready cutoff, re-sparking INIT");
            window.OY_INIT = 0;
            oy_init(oy_callback);
        }
    }, window.OY_READY_RETRY);
}