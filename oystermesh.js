// Bruno Block
// v0.1

// GLOBAL VARS
window.OY_MESH_DYNASTY = "BRUNO_GENESIS_TESTNET";//mesh dynasty definition
window.OY_MESH_VERSION = 1;//mesh version, increments every significant code upgrade
window.OY_MESH_FLOW = 8000;//characters per second allowed per peer, and for all aggregate non-peer nodes
window.OY_MESH_MEASURE = 30;//seconds by which to measure mesh flow, larger means more tracking of nearby node, peer and sector activity
window.OY_MESH_SAMPLE = 10;//time/data measurements to determine mesh flow required to state a result, too low can lead to volatile and inaccurate readings
window.OY_MESH_PULL_BUFFER = 2.25;//multiplication factor for mesh inflow buffer, to give some leeway to compliant peers
window.OY_MESH_PUSH_MAIN = 0.1;//probability that a peer will forward a data_push when the nonce was not previously stored on self
window.OY_MESH_PUSH_BOOST = 0.3;//probability that a peer will forward a data_push when the nonce was previously stored on self
window.OY_MESH_PULL_MAIN = 0.1;//probability that a peer will forward a data_pull when the nonce was found on self
window.OY_MESH_PULL_BOOST = 0.4;//probability that a peer will forward a data_pull when the nonce was not found on self
window.OY_MESH_FULLFILL = 0.05;//probability that data is stored whilst fulfilling a pull request, this makes data intelligently migrate and refresh overtime
window.OY_MESH_SOURCE = 3;//node in route passport (from destination) that is assigned with defining the source variable
window.OY_MESH_TOLERANCE = 2;//max version iterations until peering is refused (similar to hard-fork)
window.OY_NODE_TOLERANCE = 3;//max amount of protocol communication violations until node is blacklisted
window.OY_NODE_BLACKTIME = 3600;//seconds to blacklist a punished node for
window.OY_NODE_PROPOSETIME = 12;//seconds for peer proposal session duration
window.OY_NODE_ASSIGNTTIME = 10;//minimum interval between node_assign instances to/from central
window.OY_PEER_LATENCYTIME = 60;//peers are expected to establish latency timing with each other within this interval in seconds
window.OY_PEER_KEEPTIME = 8;//peers are expected to communicate with each other within this interval in seconds
window.OY_PEER_REFERTIME = 240;//interval in which self asks peers for peer recommendations (as needed)
window.OY_PEER_REPORTTIME = 10;//interval to report peer list to central
window.OY_PEER_REMOVETIME = 4000;//ms to wait before peer removal is complete, so that the termination flag can be sent properly
window.OY_PEER_PRETIME = 20;//seconds which a node is waiting as 'pre-peer'
window.OY_PEER_MAX = 5;//maximum mutual peers per zone (applicable difference is for gateway nodes)
window.OY_PEER_MIN = 2;//minimum peers needed to perform pushes
window.OY_LATENCY_SIZE = 80;//size of latency ping payload, larger is more accurate yet more taxing, vice-versa applies
window.OY_LATENCY_LENGTH = 8;//length of rand sequence which is repeated for payload and signed for ID verification
window.OY_LATENCY_REPEAT = 2;//how many ping round trips should be performed to conclude the latency test
window.OY_LATENCY_TOLERANCE = 2;//tolerance buffer factor for receiving ping requested from a proposed-to node
window.OY_LATENCY_MAX = 20;//max amount of seconds for latency test before peership is refused or starts breaking down
window.OY_LATENCY_TRACK = 200;//how many latency measurements to keep at a time per peer
window.OY_LATENCY_WEAK_BUFFER = 0.8;//percentage buffer for comparing latency with peers, higher means less likely the weakest peer will be dropped and hence less peer turnover
window.OY_DATA_MAX = 64000;//max size of data that can be sent to another node
window.OY_DATA_CHUNK = 16000;//32000//chunk size by which data is split up and sent per transmission
window.OY_DATA_PUSH_INTERVAL = 1500;//ms per chunk per push loop iteration
window.OY_DATA_PULL_INTERVAL = 750;//ms per chunk per pull loop iteration
window.OY_DEPOSIT_CHAR = 100000;//character rate for data deposit sizing, helps establish storage limits
window.OY_DEPOSIT_MAX_BUFFER = 0.9;//max character length capacity factor of data deposit (0.9 means 10% buffer until hard limit is reached)
window.OY_DEPOSIT_COMMIT = 5;//commit data to disk every x nonce pushes
window.OY_SECTOR_ROUTING = false;//true to enable sector routing (currently not stable)
window.OY_SECTOR_PEERSHIP = 3600;//seconds required of continuous peership until a sector can be formed
window.OY_SECTOR_MAX = 50;//max amount of nodes that can belong to a single sector
window.OY_SECTOR_EXPOSURE = 3;//minimum amount of peers to have belong to a designated sector for director to accept new member, value must be 2 or greater
window.OY_SECTOR_JOINTIME = 4;//second interval a node has to send sector join requests to the director via its exposure peers
window.OY_ENGINE_INTERVAL = 2000;//ms interval for core mesh engine to run, the time must clear a reasonable latency round-about
window.OY_READY_RETRY = 3000;//ms interval to retry connection if READY is still false
window.OY_PASSIVE_MODE = false;//console output is silenced, and no explicit inputs are expected
window.OY_DEBUG_MODE = true;//oy_debug() is captured and data is sent to central for analysis

// INIT
window.OY_CONN = null;//global P2P connection handle
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
window.OY_PEERS = {"oy_aggregate_node":[-1, -1, -1, -1, [], -1, [], -1, [], [null, null]]};//optimization for quick and inexpensive checks for mutual peering
window.OY_PEERS_PRE = {};//tracks nodes that are almost peers, will become peers once PEER_AFFIRM is received from other node
window.OY_NODES = {};//P2P connection handling for individual nodes, is not mirrored in localStorage due to DOM restrictions
window.OY_SECTOR_ALPHA = [null, null, 0, 0, []];//handling and tracking of sector alpha allegiance
window.OY_SECTOR_BETA = [null, null, 0, 0, []];//handling and tracking of sector beta allegiance
window.OY_SECTOR_DIRECTOR = [null, {}];//handling and tracking of sector director duties, [0] id sector ID where assigned as director, [1] is sector_join requests
window.OY_LATENCY = {};//handle latency sessions
window.OY_PROPOSED = {};//nodes that have been recently proposed to for mutual peering
window.OY_BLACKLIST = {};//nodes to block for x amount of time
window.OY_PUSH_HOLD = {};//holds data contents ready for pushing to mesh
window.OY_DEBUG = [];//holds custom debug data during a debug session

function oy_log(oy_log_msg, oy_log_flag) {
    if (window.OY_PASSIVE_MODE===true) return false;
    if (typeof(oy_log_flag)==="undefined") oy_log_flag = 0;
    oy_log_msg = "["+(Date.now()/1000|0)+"] "+oy_log_msg;
    if (oy_log_flag===1) oy_log_msg = "FATAL ERROR: "+oy_log_msg;
    //TODO add custom interface for HTML console
    console.log(oy_log_msg);
}

function oy_log_debug(oy_log_msg) {
    if (window.OY_DEBUG_MODE===false) return false;
    if (typeof(window.OY_MAIN['oy_self_id'])==="undefined") return false;
    let oy_xhttp = new XMLHttpRequest();
    oy_xhttp.open("POST", "http://central.oyster.org/oy_log_catch.php", true);
    oy_xhttp.send("oy_log_catch="+JSON.stringify([oy_short(window.OY_MAIN['oy_self_id']), oy_log_msg]));
}


function oy_short(oy_message) {
    return oy_message.substr(0, 6);
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
    return oy_crypt_salt.toString()+oy_crypt_iv.toString()+CryptoJS.AES.encrypt(oy_crypt_data, oy_crypt_key, {
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
    return CryptoJS.AES.decrypt(oy_crypt_cipher.substring(64), oy_crypt_key, {
        iv: oy_crypt_iv,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC

    }).toString(CryptoJS.enc.Utf8);
}

function oy_key_verify(oy_key_public, oy_key_signature, oy_key_data, oy_callback) {
    window.crypto.subtle.importKey(
        "jwk",
        {   //this is an example jwk key, other key types are Uint8Array objects
            kty: "RSA",
            e: "AQAB",
            n: oy_key_public,
            alg: "PS256",
            ext: true,
        },
        {   //these are the algorithm options
            name: "RSA-PSS",
            hash: {name: "SHA-256"}, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
        },
        false, //whether the key is extractable (i.e. can be used in exportKey)
        ["verify"] //"verify" for public key import, "sign" for private key imports
    ).then(function(oy_key_public) {
        window.crypto.subtle.verify(
            {
                name: "RSA-PSS",
                saltLength: 32, //the length of the salt
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
    window.crypto.subtle.importKey(
        "jwk", JSON.parse(oy_key_private),
        {   //these are the algorithm options
            name: "RSA-PSS",
            hash: {name: "SHA-256"}, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
        },
        false, //whether the key is extractable (i.e. can be used in exportKey)
        ["sign"] //"verify" for public key import, "sign" for private key imports
    ).then(function(oy_key_private_raw) {
        window.crypto.subtle.sign(
            {
                name: "RSA-PSS",
                saltLength: 32, //the length of the salt
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
            name: "RSA-PSS",
            modulusLength: 1024, //can be 1024, 2048, or 4096
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            hash: {name: "SHA-256"}, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
        }, true, ["sign", "verify"]
    ).then(function(key) {
        window.crypto.subtle.exportKey("jwk", key.privateKey).then(function(oy_key_pass) {
            oy_callback(JSON.stringify(oy_key_pass), oy_key_pass.n);
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
        if (oy_local_name==="oy_main") return {"oy_ready":false, "oy_deposit_size":0, "oy_deposit_counter":0};
        else if (oy_local_name==="oy_peers") return {"oy_aggregate_node":[-1, -1, -1, -1, [], -1, [], -1, [], [null, null]]};
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
    delete window.OY_PEERS_PRE[oy_peer_id];
    if (oy_peer_check(oy_peer_id)) {
        oy_log("Failed to add node "+oy_short(oy_peer_id)+" to peer list that already exists in peer list");
        return false;//cancel if peer already exists in list
    }
    //[peership timestamp, last msg timestamp, last latency timestamp, latency avg, latency history, data push, data push history, data pull, data pull history, sector allegiances]
    window.OY_PEERS[oy_peer_id] = [Date.now()/1000|0, -1, -1, -1, [], -1, [], -1, [], [null, null]];
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
    delete window.OY_LATENCY[oy_peer_id];
    if (window.OY_PEER_COUNT<0) {
        oy_log("Peer management system failed", 1);
        return false;
    }
    setTimeout(function() {
        oy_node_disconnect(oy_peer_id);
    }, window.OY_PEER_REMOVETIME);
}

function oy_peer_pre_add(oy_node_id) {
    window.OY_PEERS_PRE[oy_node_id] = Date.now()/1000;
    return true;
}

function oy_peer_pre_check(oy_node_id) {
    return typeof window.OY_PEERS_PRE[oy_node_id]!=="undefined"&&Date.now()/1000-window.OY_PEERS_PRE[oy_node_id]<window.OY_PEER_PRETIME;
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
    window.OY_PEERS[oy_peer_id][4].unshift(oy_latency_new);
    if (window.OY_PEERS[oy_peer_id][4].length>window.OY_LATENCY_TRACK) {
        window.OY_PEERS[oy_peer_id][4].pop();
    }
    window.OY_PEERS[oy_peer_id][3] = (window.OY_PEERS[oy_peer_id][4].reduce(oy_reduce_sum))/window.OY_PEERS[oy_peer_id][4].length;
    oy_local_store("oy_peers", window.OY_PEERS);
    oy_log("Latency data updated for peer "+oy_short(oy_peer_id));
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
    let oy_time_local = Date.now()/1000;
    window.OY_PEERS[oy_peer_id][1] = oy_time_local;//update last msg timestamp for peer, no need to update localstorage via oy_local_store() (could be expensive)
    oy_log("Mutual peer "+oy_short(oy_peer_id)+" sent data sequence with flag: "+oy_data[4]);
    //I've decided it's better that nodes do not respond with acknowledgement packets for DATA_PUSH, to ease on mesh congestion. oy_engine() will make sure that peers are compliant anyways.
    if (oy_data[4]==="OY_DATA_PUSH") {//store received data and potentially forward the push request to peers
        //data received here will be committed to data_deposit without further checks, mesh flow restrictions from oy_init() are sufficient
        //oy_data[5] = [oy_data_handle, oy_data_nonce, oy_data_value]
        if (oy_data[5].length!==3||oy_handle_check(oy_data[5][0])===false||oy_data[5][2].length>window.OY_DATA_CHUNK) {
            oy_log("Peer "+oy_short(oy_peer_id)+" sent invalid DATA_PUSH data sequence, will punish");
            oy_node_punish(oy_peer_id, "OY_PUNISH_PUSH_INVALID");
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
            oy_log("Peer "+oy_short(oy_peer_id)+" sent invalid DATA_PULL data sequence, will punish");
            oy_node_punish(oy_peer_id, "OY_PUNISH_PULL_INVALID");
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
            oy_log("Peer "+oy_short(oy_peer_id)+" sent invalid DATA_FULFILL data sequence, will punish");
            oy_node_punish(oy_peer_id, "OY_PUNISH_FULFILL_INVALID");
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
        oy_log("Responding to latency request from peer "+oy_short(oy_peer_id));
        oy_key_sign(window.OY_MAIN['oy_self_private'], oy_data[5][0], function(oy_key_signature) {
            oy_log("Signed peer latency sequence from "+oy_short(oy_peer_id));
            oy_data[5][0] = oy_key_signature;
            oy_data_send(oy_peer_id, "OY_LATENCY_RESPONSE", oy_data[5]);
        });
    }
    else if (oy_data[4]==="OY_PEER_TERMINATE") {
        oy_peer_remove(oy_peer_id);//return the favour
        oy_log("Removed peer "+oy_short(oy_peer_id)+" who terminated peership first");
        return true;
    }
    else if (oy_data[4]==="OY_BLACKLIST") {
        oy_peer_remove(oy_peer_id);//return the favour
        oy_node_punish(oy_peer_id, "OY_PUNISH_BLACKLIST_RETURN");
        oy_log("Punished peer "+oy_short(oy_peer_id)+" who blacklisted self");
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
            oy_log("Peer "+oy_short(oy_peer_id)+" recommended themselves, will punish");
            oy_node_punish(oy_peer_id, "OY_PUNISH_RECOMMEND_SELF");
            return false;
        }
        oy_node_initiate(oy_data[5], true);
    }
    else if (oy_data[4]==="OY_SECTOR_SURVEY") {
        if (window.OY_SECTOR_ALPHA[0]!==null&&window.OY_SECTOR_ALPHA[2]<window.OY_SECTOR_MAX) {
            oy_data_send(oy_peer_id, "OY_SECTOR_RESPONSE", window.OY_SECTOR_ALPHA);
            oy_log("Sent "+oy_short(oy_peer_id)+" information on sector alpha");
        }
        else if (window.OY_SECTOR_BETA[0]!==null&&window.OY_SECTOR_BETA[2]<window.OY_SECTOR_MAX) {
            oy_data_send(oy_peer_id, "OY_SECTOR_RESPONSE", window.OY_SECTOR_BETA);
            oy_log("Sent "+oy_short(oy_peer_id)+" information on sector beta");
        }
    }
    else if (oy_data[4]==="OY_SECTOR_RESPONSE") {
        if (window.OY_SECTOR_ALPHA[0]===null||window.OY_SECTOR_BETA[0]===null) {
            oy_log("Received sector response whilst needing new sector(s)");
            //[0] is sector ID, [1] is director ID, [2] is sector size, [3] is sector genesis date [4] is sector itinerary
            if (oy_data[5][2]>=window.OY_SECTOR_MAX) {
                oy_log("Received a sector that is already full, will punish");
                oy_node_punish(oy_peer_id, "OY_PUNISH_SECTOR_FULL");
                return false;
            }
            else if (window.OY_PEER_COUNT<window.OY_SECTOR_EXPOSURE) {
                oy_log("Insufficient peer count to join sector "+oy_data[5][0]);
                return false;
            }
            else {
                let oy_sector_peers = [];
                let oy_sector_exposure_local = 0;
                for (let oy_peer_local in window.OY_PEERS) {
                    if (oy_peer_local==="oy_aggregate_node") continue;
                    if (window.OY_PEERS[oy_peer_local][9].indexOf(oy_data[5][0])!==-1) {
                        oy_sector_peers.push(oy_peer_local);
                        oy_sector_exposure_local++;
                    }
                }
                if (oy_sector_exposure_local<window.OY_SECTOR_EXPOSURE) {
                    oy_log("Self does not have sufficient exposure to join sector "+oy_data[5][0]);
                    return false;
                }
                else {
                    oy_log("Self has sufficient exposure to join sector "+oy_data[5][0]);
                    //TODO initiate sector session for joining
                    oy_data_route(["OY_LOGIC_SECTOR_DIRECTOR"], "OY_SECTOR_JOIN", [[], oy_data[5][0], oy_data[5][1]], []);
                }
            }
        }
        else {
            oy_log("Received sector response whilst sectors have already been established");
            return false;
        }
    }
    else if (oy_data[4]==="OY_SECTOR_JOIN") {
        if ((window.OY_SECTOR_ALPHA[0]===oy_data[5][1]&&window.OY_SECTOR_ALPHA[1]===oy_data[5][2])||(window.OY_SECTOR_BETA[0]===oy_data[5][1]&&window.OY_SECTOR_BETA[1]===oy_data[5][2])) {
            if (oy_data[5][1]===window.OY_SECTOR_DIRECTOR[0]&&oy_data[5][2]===window.OY_MAIN['oy_self_id']) {
                oy_log("Self is director of sector "+oy_data[5][1]+" will interpret join request");
                //TODO here we need to track join requests in a sector session variable, if the exposure is sufficient and within a short time range then we announce acceptance to the asking node,
                // upon affirmation the entire sector is notified

                if (typeof(window.OY_SECTOR_DIRECTOR[1][oy_data[5][0][0]])==="undefined") window.OY_SECTOR_DIRECTOR[1][oy_data[5][0][0]] = [oy_time_local, []];
                if (window.OY_SECTOR_DIRECTOR[1][oy_data[5][0][0]][1].indexOf(oy_data[5][0][1])===-1) window.OY_SECTOR_DIRECTOR[1][oy_data[5][0][0]][1].push(oy_data[5][0][1]);
                if (oy_time_local-window.OY_SECTOR_DIRECTOR[1][oy_data[5][0][0]][0]>window.OY_SECTOR_JOINTIME) {
                    oy_log("Sector join requests came too far apart");
                    return false;
                }
                if (window.OY_SECTOR_DIRECTOR[1][oy_data[5][0][0]][1].length<window.OY_SECTOR_EXPOSURE) {
                    oy_log("Node "+oy_data[5][0][0]+" does not have sufficient exposure to join sector "+oy_data[5][1]);
                    return false;
                }
                else {
                    oy_log("Node "+oy_data[5][0][0]+" has sufficient exposure to join sector "+oy_data[5][1]);
                }
            }
            else {
                oy_log("Received sector join request, will attempt to forward to director");
                oy_data_route(["OY_LOGIC_SECTOR_DIRECTOR"], "OY_SECTOR_JOIN", oy_data[5], []);
            }
        }
        else {
            oy_log("Received sector join request to an unaffiliated sector "+oy_data[5][1]);
            return false;
        }
    }
}

//checks if node is in mutually paired list
function oy_peer_check(oy_node_id) {
    return typeof(window.OY_PEERS[oy_node_id])!=="undefined";
}

//reports peership data to central, leads to seeing mesh big picture, mesh stability development
function oy_peer_report() {
    let oy_xhttp = new XMLHttpRequest();
    oy_xhttp.onreadystatechange = function() {
        if (this.readyState===4&&this.status===200) {
            if (this.responseText.substr(0, 5)==="ERROR"||this.responseText.length===0) {
                oy_log("Received error from peer_report@central: "+this.responseText);
                return false;
            }
            if (this.responseText==="OY_REPORT_SUCCESS") oy_log("Peer report to central succeeded");
            else oy_log("Peer report to central failed");
        }
    };
    oy_xhttp.open("POST", "http://central.oyster.org/oy_peer_report.php", true);
    oy_xhttp.send("oy_peer_report="+JSON.stringify([window.OY_MAIN['oy_self_id'], window.OY_PEERS, window.OY_BLACKLIST]));
}

function oy_node_connect(oy_node_id, oy_callback) {
    if (oy_node_id===false||oy_node_id===window.OY_MAIN['oy_self_id']) {
        oy_log("Tried to connect to invalid node ID", 1);//functions need to validate node_id before forwarding here
        return false;
    }
    if (typeof(window.OY_NODES[oy_node_id])==="undefined"||window.OY_NODES[oy_node_id].open===false) {
        oy_log("Connection warming up with node "+oy_short(oy_node_id));
        let oy_local_conn = window.OY_CONN.connect(oy_node_id);
        if (typeof(oy_local_conn)==="undefined") {
              oy_log("Connection to node "+oy_short(oy_node_id)+" failed");
              return false;
        }
        else {
            oy_local_conn.on('open', function() {
                window.OY_NODES[oy_node_id] = oy_local_conn;
                oy_log("Connection status: "+window.OY_NODES[oy_node_id].open+" with node "+oy_short(oy_node_id));
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
        oy_log("Disconnected from node "+oy_short(oy_node_id));
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
    if (typeof(oy_punish_reason)==="undefined") oy_punish_reason = null;
    if (typeof(window.OY_BLACKLIST[oy_node_id])==="undefined") {
        //[0] is inform count, [1] is blacklist expiration time, [2] is inform boolean (if node was informed of blacklist), [3] is punish reason tracking (for diagnostics, reported to central)
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
        oy_data_send(oy_node_id, "OY_PEER_REQUEST", null);
        window.OY_PROPOSED[oy_node_id] = (Date.now()/1000)+window.OY_NODE_PROPOSETIME;//set proposal session with expiration timestamp
        oy_local_store("oy_proposed", window.OY_PROPOSED);
    };
    if (oy_node_connect(oy_node_id, oy_callback_local).open===true) oy_callback_local();
    return true;
}

//retrieves nodes from and submit self id to central.oyster.org
function oy_node_assign() {
    let oy_xhttp = new XMLHttpRequest();
    oy_xhttp.onreadystatechange = function() {
        if (this.readyState===4&&this.status===200) {
            if (this.responseText.substr(0, 5)==="ERROR"||this.responseText.length===0) {
                oy_log("Received error from node_assign@central: "+this.responseText);
                return false;
            }
            let oy_node_array = JSON.parse(this.responseText);
            for (let i in oy_node_array) {
                oy_node_initiate(oy_node_array[i]);
            }
        }
    };
    oy_xhttp.open("POST", "http://central.oyster.org/oy_node_assign.php", true);
    oy_xhttp.send("oy_node_id="+window.OY_MAIN['oy_self_id']);
}

//respond to a node that is not mutually peered with self
function oy_node_negotiate(oy_node_id, oy_data) {
    if (oy_data[4]==="OY_BLACKLIST") {
        oy_log("Node "+oy_short(oy_node_id)+" blacklisted us, will return the favour");
        oy_node_punish(oy_node_id, "OY_PUNISH_BLACKLIST_RETURN");
        return false;
    }
    else if (oy_data[4]==="OY_PEER_TERMINATE") {
        oy_log("Received termination notice from non-peer, most likely we terminated him first");
        return false;
    }
    else if (oy_data[4]==="OY_PEER_AFFIRM") {
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
    else if (oy_data[4]==="OY_PEER_LATENCY"&&(oy_node_proposed(oy_node_id)||oy_peer_pre_check(oy_node_id))) {//respond to latency ping from node with peer proposal arrangement
        oy_key_sign(window.OY_MAIN['oy_self_private'], oy_data[5][0], function(oy_key_signature) {
            oy_log("Signed peer latency sequence from "+oy_short(oy_node_id));
            oy_data[5][0] = oy_key_signature;
            oy_data_send(oy_node_id, "OY_LATENCY_RESPONSE", oy_data[5]);
        });
    }
    else if (oy_node_proposed(oy_node_id)) {//check if this node was previously proposed to for peering by self
        if (oy_data[4]==="OY_PEER_ACCEPT") {//node has accepted self's peer request
            oy_latency_test(oy_node_id, "OY_PEER_ACCEPT", true);
            //oy_peer_add(oy_node_id);
            //oy_data_send(oy_node_id, "OY_PEER_AFFIRM", null);//as of now, is not crucial nor mandatory
        }
        else if (oy_data[4]==="OY_PEER_REJECT") {//node has rejected self's peer request
            oy_log("Node "+oy_short(oy_node_id)+" rejected peer request with reason: "+oy_data[5]);
            oy_node_punish(oy_node_id, "OY_PUNISH_REJECT_RETURN");//we need to prevent nodes with far distances/long latencies from repeatedly communicating
            return true;
        }
    }
    else if (oy_data[4]==="OY_PEER_REQUEST") {
        let oy_callback_local = function() {
            oy_latency_test(oy_node_id, "OY_PEER_REQUEST", true);
        };
        if (oy_node_connect(oy_node_id, oy_callback_local).open===true) oy_callback_local();
        return true;
    }
    else if (oy_data[4]==="OY_PEER_LATENCY") {
        oy_log("Node "+oy_short(oy_node_id)+" sent a latency spark request whilst not a peer, will ignore");
        return false;
    }
    else {
        oy_log("Node "+oy_short(oy_node_id)+" sent an incoherent message");
        return false;
    }
}

function oy_latency_response(oy_node_id, oy_data) {
    if (typeof(window.OY_LATENCY[oy_node_id])==="undefined") {
        oy_log("Node "+oy_short(oy_node_id)+" sent a latency response whilst no latency session exists");
        return false;
    }
    let oy_time_local = Date.now()/1000;
    oy_key_verify(oy_node_id, oy_data[5][0], window.OY_LATENCY[oy_node_id][0], function(oy_key_valid) {
        if (oy_key_valid===false) {
            oy_log("Node "+oy_short(oy_node_id)+" failed to sign latency sequence, will punish");
            oy_node_punish(oy_node_id, "OY_PUNISH_SIGN_FAIL");
            delete window.OY_LATENCY[oy_node_id];
            return false;
        }
        oy_log("Node "+oy_short(oy_node_id)+" successfully signed latency sequence");
        if (window.OY_LATENCY[oy_node_id][0].repeat(window.OY_LATENCY_SIZE)===oy_data[5][1]) {//check if payload data matches latency session definition
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
                oy_log("Finished latency test ("+window.OY_LATENCY[oy_node_id][5]+") with node "+oy_short(oy_node_id)+" with average round-about: "+oy_latency_result+" seconds");
                if (window.OY_LATENCY[oy_node_id][5]==="OY_PEER_REQUEST"||window.OY_LATENCY[oy_node_id][5]==="OY_PEER_ACCEPT") {
                    //logic for accepting a peer request begins here
                    if (oy_latency_result>window.OY_LATENCY_MAX) {
                        oy_log("Node "+oy_short(oy_node_id)+" has latency that breaches max, will punish");
                        if (window.OY_LATENCY[oy_node_id][5]==="OY_PEER_ACCEPT") oy_data_send(oy_node_id, "OY_PEER_TERMINATE", "OY_PUNISH_LATENCY_BREACH");
                        else oy_data_send(oy_node_id, "OY_PEER_REJECT", "OY_PUNISH_LATENCY_BREACH");
                        oy_node_punish(oy_node_id, "OY_PUNISH_LATENCY_BREACH");
                    }
                    else if (window.OY_PEER_COUNT<window.OY_PEER_MAX) {
                        if (window.OY_LATENCY[oy_node_id][5]==="OY_PEER_ACCEPT") {
                            oy_peer_add(oy_node_id);
                            oy_data_send(oy_node_id, "OY_PEER_AFFIRM", null);
                            oy_log("Added node "+oy_short(oy_node_id)+" as a peer");
                        }
                        else {
                            oy_peer_pre_add(oy_node_id);
                            oy_data_send(oy_node_id, "OY_PEER_ACCEPT", null);
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
                            if (window.OY_LATENCY[oy_node_id][5]==="OY_PEER_ACCEPT") {
                                oy_peer_add(oy_node_id);
                                oy_data_send(oy_node_id, "OY_PEER_AFFIRM", null);
                                oy_log("Added node "+oy_short(oy_node_id)+" as a peer");
                            }
                            else {
                                oy_peer_pre_add(oy_node_id);
                                oy_data_send(oy_node_id, "OY_PEER_ACCEPT", null);
                                oy_log("Added node "+oy_short(oy_node_id)+" to pre peer list");
                            }
                            oy_peer_latency(oy_node_id, oy_latency_result);
                            oy_log("Removed peer "+oy_short(oy_peer_weak[0])+" and potentially added peer "+oy_short(oy_node_id));
                        }
                        else {
                            oy_log("New peer request has insufficient latency");
                            if (window.OY_LATENCY[oy_node_id][5]==="OY_PEER_ACCEPT") oy_data_send(oy_node_id, "OY_PEER_TERMINATE", "OY_PUNISH_LATENCY_WEAK");
                            else oy_data_send(oy_node_id, "OY_PEER_REJECT", "OY_PUNISH_LATENCY_WEAK");
                            oy_node_punish(oy_node_id, "OY_PUNISH_LATENCY_WEAK");
                        }
                    }
                }
                else if (oy_peer_check(oy_node_id)&&(window.OY_LATENCY[oy_node_id][5]==="OY_PEER_CONNECT"||window.OY_LATENCY[oy_node_id][5]==="OY_PEER_ROUTINE")) {
                    oy_data_send(oy_node_id, "OY_PEER_AFFIRM", null);
                    oy_peer_latency(oy_node_id, oy_latency_result);
                }
                if (oy_peer_check(oy_node_id)) window.OY_PEERS[oy_node_id][2] = oy_time_local;
                delete window.OY_LATENCY[oy_node_id];
                return true
            }
            oy_latency_test(oy_node_id, window.OY_LATENCY[oy_node_id][5], false);
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
        //[5] is followup flag i.e. what logic should follow after the latency test concludes
        window.OY_LATENCY[oy_node_id] = [null, 0, 0, 0, 0, oy_latency_followup];
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
    window.OY_LATENCY[oy_node_id][0] = oy_rand_gen(window.OY_LATENCY_LENGTH);
    if (oy_data_send(oy_node_id, "OY_PEER_LATENCY", [window.OY_LATENCY[oy_node_id][0], window.OY_LATENCY[oy_node_id][0].repeat(window.OY_LATENCY_SIZE)])) {
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

//measures data flow on the mesh in either push or pull direction
//returns false on mesh flow violation and true on compliance
function oy_data_measure(oy_data_push, oy_node_id, oy_data_length) {
    if (!oy_peer_check(oy_node_id)&&oy_node_id!=="oy_aggregate_node") {
        oy_log("Call to data_measure was made with non-existent peer: "+oy_short(oy_node_id));
        return false;
    }
    let oy_time_local = Date.now()/1000;
    let oy_array_select;
    if (oy_data_push===false) oy_array_select = 8;
    else oy_array_select = 6;
    if (oy_data_length!==null) window.OY_PEERS[oy_node_id][oy_array_select].push([oy_time_local, oy_data_length]);
    while ((oy_time_local-window.OY_PEERS[oy_node_id][oy_array_select][0][0])>window.OY_MESH_MEASURE) window.OY_PEERS[oy_node_id][oy_array_select].shift();
    if (window.OY_PEERS[oy_node_id][oy_array_select].length<window.OY_MESH_SAMPLE) return true;//do not punish node if there is an insufficient survey to determine accurate mesh flow
    let oy_measure_total = 0;
    for (let i in window.OY_PEERS[oy_node_id][oy_array_select]) oy_measure_total += window.OY_PEERS[oy_node_id][oy_array_select][i][1];
    //either mesh overflow has occurred (parent function will respond accordingly), or mesh flow is in compliance
    window.OY_PEERS[oy_node_id][oy_array_select-1] = (oy_measure_total/(oy_time_local-window.OY_PEERS[oy_node_id][oy_array_select][0][0]));
    return !(window.OY_PEERS[oy_node_id][oy_array_select-1]>(window.OY_MESH_FLOW*((oy_data_push===false)?window.OY_MESH_PULL_BUFFER:1)));
}

//pushes data onto the mesh, data_logic indicates strategy for data pushing
function oy_data_push(oy_data_logic, oy_data_value, oy_data_handle) {
    if (window.OY_PEER_COUNT<=window.OY_PEER_MIN) {
        oy_log("Data push terminated, peer count is "+window.OY_PEER_COUNT+"/"+window.OY_PEER_MAX);
        return false;
    }
    let oy_data_superhandle = false;
    if (typeof(oy_data_handle)==="undefined") {
        oy_data_handle = oy_rand_gen(2)+oy_hash_gen(oy_data_value);
        let oy_key_pass = oy_rand_gen();
        oy_data_value = oy_crypt_encrypt(oy_data_value, oy_key_pass);
        oy_data_superhandle = oy_key_pass+oy_data_handle+Math.ceil(oy_data_value.length/window.OY_DATA_CHUNK);
    }
    if (typeof(window.OY_PUSH_HOLD[oy_data_handle])==="undefined"&&oy_data_value!==null) {
        window.OY_PUSH_HOLD[oy_data_handle] = oy_data_value;
        oy_data_value = null;
    }
    oy_log("Pushing handle "+oy_data_handle+" with logic: "+oy_data_logic);
    if (typeof(window.OY_DATA_PUSH[oy_data_handle])==="undefined") window.OY_DATA_PUSH[oy_data_handle] = true;
    else if (window.OY_DATA_PUSH[oy_data_handle]===false) {
        delete window.OY_DATA_PUSH[oy_data_handle];
        delete window.OY_PUSH_HOLD[oy_data_handle];
        oy_log("Cancelled data push loop");
        return true;
    }
    let oy_push_delay = 0;
    if (window.OY_PUSH_HOLD[oy_data_handle].length<window.OY_DATA_CHUNK) {
        oy_data_route(oy_data_logic, "OY_DATA_PUSH", [oy_data_handle, null, null], [], [0, 0, window.OY_PUSH_HOLD[oy_data_handle].length]);
    }
    else {
        let oy_data_array = [];
        for (let i = 0; i < window.OY_PUSH_HOLD[oy_data_handle].length; i += window.OY_DATA_CHUNK) {
            oy_data_array.push([i, i+window.OY_DATA_CHUNK]);
        }
        for (let oy_data_nonce in oy_data_array) {
            setTimeout(function() {
                oy_data_route(oy_data_logic, "OY_DATA_PUSH", [oy_data_handle, null, null], [],
                    [oy_data_nonce, oy_data_array[oy_data_nonce][0], oy_data_array[oy_data_nonce][1]]);
            }, window.OY_DATA_PUSH_INTERVAL*oy_data_nonce);
            oy_push_delay += window.OY_DATA_PUSH_INTERVAL;
        }
    }
    setTimeout(function() {
        oy_data_push(oy_data_logic, oy_data_value, oy_data_handle);
    }, oy_push_delay);
    if (oy_data_superhandle!==false) return oy_data_superhandle;
}

//pulls data from the mesh
function oy_data_pull(oy_callback, oy_data_logic, oy_data_handle, oy_data_nonce_max, oy_crypt_pass) {
    if (window.OY_PEER_COUNT<=window.OY_PEER_MIN) {
        oy_log("Data pull terminated, peer count is "+window.OY_PEER_COUNT+"/"+window.OY_PEER_MAX);
        return false;
    }
    if (typeof(oy_data_nonce_max)==="undefined"||typeof(oy_crypt_pass)==="undefined") {
        oy_data_nonce_max = parseInt(oy_data_handle.substr(80));
        oy_crypt_pass = oy_data_handle.substr(0, 32);
        oy_data_handle = oy_data_handle.substr(32, 48);//32 is for encryption key, 48 is length of salt (8) integrity SHA1 (40), 32+48 = 80
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
        let oy_data_construct = oy_crypt_decrypt(window.OY_CONSTRUCT[oy_data_handle].join(""), oy_crypt_pass);
        if (oy_data_handle.substr(8, 40)===oy_hash_gen(oy_data_construct)) {
            oy_log("Construct for "+oy_data_handle+" cleared hash check");
            delete window.OY_DATA_PULL[oy_data_handle];
            delete window.OY_COLLECT[oy_data_handle];
            delete window.OY_CONSTRUCT[oy_data_handle];
            oy_callback(oy_crypt_pass+oy_data_handle+oy_data_nonce_max, oy_data_construct);
            return true;//end the pull loop
        }
        else oy_log("Construct for "+oy_data_handle+" failed hash check");
    }
    else oy_log("Construct for "+oy_data_handle+" did not achieve all nonces");
    setTimeout(function() {
        oy_data_pull(oy_callback, oy_data_logic, oy_data_handle, oy_data_nonce_max, oy_crypt_pass);
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
function oy_data_route(oy_data_logic, oy_data_flag, oy_data_payload, oy_peers_exception, oy_push_define) {
    if (typeof(oy_push_define)!=="undefined") {
        if (typeof(window.OY_DATA_PUSH[oy_data_payload[0]])==="undefined"||window.OY_DATA_PUSH[oy_data_payload[0]]===false||typeof(window.OY_PUSH_HOLD[oy_data_payload[0]])==="undefined") {
            oy_log("Cancelled data route for handle "+oy_data_payload[0]+" due to push session cancellation");
            return true;
        }
        oy_data_payload[1] = oy_push_define[0];
        oy_data_payload[2] = window.OY_PUSH_HOLD[oy_data_payload[0]].slice(oy_push_define[1], oy_push_define[2]);
    }
    let oy_peer_select = false;
    if (oy_data_logic[0]==="OY_LOGIC_SPREAD") {
        let oy_peers_local = {};
        for (let oy_peer_local in window.OY_PEERS) {
            if (oy_peer_local==="oy_aggregate_node") continue;
            oy_peers_local[oy_peer_local] = window.OY_PEERS[oy_peer_local];
        }
        oy_peer_select = oy_peer_rand(oy_peers_local, oy_peers_exception);
        if (oy_peer_select===false) {
            oy_log("Data route doesn't have any available peers to send to");
            return false;
        }
        oy_log("Routing data via peer "+oy_short(oy_peer_select)+" with flag "+oy_data_flag);
        oy_data_send(oy_peer_select, oy_data_flag, oy_data_payload);
    }
    else if (oy_data_logic[0]==="OY_LOGIC_REVERSE") {
        oy_peer_select = oy_data_payload[0].pop();//select the next peer on the passport
        if (oy_data_payload[0].length===0) oy_data_payload[0].push(oy_peer_select);
        oy_log("Routing data via peer "+oy_short(oy_peer_select)+" with flag "+oy_data_flag);
        oy_data_send(oy_peer_select, oy_data_flag, oy_data_payload);
    }
    else if (oy_data_logic[0]==="OY_LOGIC_SECTOR_DIRECTOR") {
        if ((window.OY_SECTOR_ALPHA[0]===oy_data_payload[1]&&window.OY_SECTOR_ALPHA[1]===oy_data_payload[2])||(window.OY_SECTOR_BETA[0]===oy_data_payload[1]&&window.OY_SECTOR_BETA[1]===oy_data_payload[2])) {
            oy_log("Recognized sector but wrong director is assigned");
            return false;
        }
        oy_data_payload[0].push(window.OY_MAIN['oy_self_id']);
        let oy_director_find = window.OY_PEERS.indexOf(oy_data_payload[2]);
        if (oy_director_find!==-1) oy_data_send(window.OY_PEERS[oy_director_find], oy_data_flag, oy_data_payload);
        else {
            for (let oy_peer_local in window.OY_PEERS) {
                if (oy_peer_local==="oy_aggregate_node") continue;
                if (window.OY_PEERS[oy_peer_local][9].indexOf(oy_data_payload[1])!==-1) {
                    if (oy_data_payload[0].indexOf(oy_peer_local)!==-1) {
                        oy_log("Prevented sending a sector data sequence in a loop to peer "+oy_short(oy_peer_local));
                        continue;
                    }
                    oy_log("Routing data via peer "+oy_short(oy_peer_local)+" with flag "+oy_data_flag);
                    oy_data_send(oy_peer_local, oy_data_flag, oy_data_payload);
                }
            }
        }
    }
    return oy_peer_select;
}

//send data
function oy_data_send(oy_node_id, oy_data_flag, oy_data_payload) {
    if (window.OY_CONN===null||window.OY_CONN.disconnected!==false) {
        oy_log("Connection handler crashed, skipping "+oy_data_flag+" to "+oy_short(oy_node_id));
        return false;
    }
    let oy_callback_local = function() {
        let oy_data = [window.OY_MESH_DYNASTY, window.OY_MESH_VERSION, window.OY_MAIN['oy_self_id'], [window.OY_SECTOR_ALPHA[0], window.OY_SECTOR_BETA[0]], oy_data_flag, oy_data_payload];
        let oy_data_raw = JSON.stringify(oy_data);//convert data array to JSON
        if (oy_data_raw.length>window.OY_DATA_MAX) {
            oy_log("System is misconfigured, almost sent an excessively sized data sequence", 1);
            return false;
        }
        if ((oy_data_flag==="OY_DATA_PUSH"||oy_data_flag==="OY_DATA_FULFILL")&&oy_peer_check(oy_node_id)&&oy_data_measure(true, oy_node_id, null)===false) {
            oy_log("Cooling off, skipping "+oy_data_flag+" to "+oy_short(oy_node_id));
            return true;
        }
        oy_data_measure(true, oy_node_id, oy_data_raw.length);
        window.OY_NODES[oy_node_id].send(oy_data_raw);//send the JSON-converted data array to the destination node
        oy_log("Sent data to node "+oy_short(oy_node_id)+" with size: "+oy_data_raw.length);
    };
    if (oy_node_connect(oy_node_id, oy_callback_local).open===true) oy_callback_local();
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
function oy_data_validate(oy_node_id, oy_data_raw) {
   try {
       let oy_data = JSON.parse(oy_data_raw);
       if (oy_data&&typeof(oy_data)==="object"&&oy_data[2]===oy_node_id&&oy_data[0]===window.OY_MESH_DYNASTY&&Math.abs(oy_data[1]-window.OY_MESH_VERSION)<=window.OY_MESH_TOLERANCE) {
           if (oy_peer_check(oy_node_id)) {
               window.OY_PEERS[oy_node_id][9][0] = oy_data[3][0];
               window.OY_PEERS[oy_node_id][9][1] = oy_data[3][1];//no need to update localstorage, sector allegiances get updated frequently enough
           }
           return oy_data;//only continue if dynasty and version of node are compliant
       }
   }
   catch (oy_error) {
       oy_log("Data validation exception occurred: "+oy_error);
   }
   oy_log("Node "+oy_short(oy_node_id)+" failed validation");
   return false
}

//asks peers for sectors that are available for peering
function oy_sector_survey() {
    oy_data_route(["OY_LOGIC_SPREAD"], "OY_SECTOR_SURVEY", null, []);
}

//core loop that runs critical functions and checks
function oy_engine(oy_thread_track) {
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
                oy_log("Engine initiating latency test with peer "+oy_short(oy_peer_local)+":" +
                    "time_diff_last: "+oy_time_diff_last+"/"+window.OY_PEER_KEEPTIME+", time_diff_latency: "+oy_time_diff_latency+"/"+window.OY_PEER_LATENCYTIME);
                if (oy_latency_test(oy_peer_local, "OY_PEER_ROUTINE", true)) window.OY_ENGINE[0][oy_peer_local] = oy_time_local;
                else oy_log("Latency test with peer "+oy_short(oy_peer_local)+" was unable to launch");
            }
            else if (oy_time_local-window.OY_ENGINE[0][oy_peer_local]>window.OY_LATENCY_MAX) {
                oy_log("Engine found non-responsive peer "+oy_short(oy_peer_local)+" with latency lag: "+(oy_time_local-window.OY_ENGINE[0][oy_peer_local])+", will remove and punish");
                oy_peer_remove(oy_peer_local);
                oy_node_punish(oy_peer_local, "OY_PUNISH_LATENCY_LAG");
            }
        }
        else delete window.OY_ENGINE[0][oy_peer_local];
    }

    let oy_peers_local = window.OY_PEERS;
    let oy_peer_refer = oy_peer_rand(oy_peers_local, []);
    if (window.OY_PEER_COUNT<=window.OY_PEER_MAX) {
        if ((oy_time_local-window.OY_REFER_LAST)>window.OY_PEER_REFERTIME) {
            window.OY_REFER_LAST = oy_time_local;
            oy_data_send(oy_peer_refer, "OY_PEER_REFER", null);
            oy_log("Asked peer "+oy_short(oy_peer_local)+" for peer recommendation");
        }
    }

    if (window.OY_SECTOR_ROUTING===true) {
        if (window.OY_PEER_COUNT>=window.OY_SECTOR_EXPOSURE&&(window.OY_SECTOR_ALPHA[0]===null||window.OY_SECTOR_BETA[0]===null)) {
            oy_log("Engine initiating sector survey to discover unfulfilled sector(s)");
            oy_sector_survey();
        }
        if (window.OY_SECTOR_DIRECTOR[0]!==null) {
            for (let oy_node_local in window.OY_SECTOR_DIRECTOR[1]) {
                if (oy_time_local-window.OY_SECTOR_DIRECTOR[1][oy_node_local][0]>window.OY_SECTOR_JOINTIME) {
                    delete window.OY_SECTOR_DIRECTOR[1][oy_node_local];
                    oy_log("Engine deleted sector join session for "+oy_node_local);
                }
            }
        }
        /*
        if (oy_time_local-window.OY_SECTOR_DIRECTOR[1][oy_data[5][0][0]][0]>window.OY_SECTOR_JOINTIME) {
            oy_log("Sector join requests came too far apart");
            return false;
        }
        */
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

    //TODO scroll through PROPOSED and BLACKLIST to remove expired elements

    setTimeout(function() {
        oy_engine(oy_thread_track);
    }, window.OY_ENGINE_INTERVAL);
}

//initialize oyster mesh boot up sequence
function oy_init(oy_callback, oy_passthru) {
    if (typeof(oy_passthru)==="undefined") {
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
            oy_log("Recovering P2P session with recovered ID "+oy_short(window.OY_MAIN['oy_self_id']));
        }
        else {
            oy_key_gen(function(oy_key_private, oy_key_public) {
                //TODO need to make sure every possible public ID is compatible with peerjs server

                //reset cryptographic node id for self, and any persisting variables that are related to the old self id (if any)
                window.OY_MAIN['oy_self_private'] = oy_key_private;
                window.OY_MAIN['oy_self_id'] = oy_key_public;
                window.OY_PEERS = {"oy_aggregate_node":[-1, -1, -1, -1, [], -1, [], -1, [], [null, null]]};
                window.OY_SECTOR_ALPHA = {};
                window.OY_SECTOR_BETA = {};
                window.OY_PROPOSED = {};
                oy_local_store("oy_main", window.OY_MAIN);
                oy_local_store("oy_peers", window.OY_PEERS);
                oy_local_store("oy_sector_alpha", window.OY_SECTOR_ALPHA);
                oy_local_store("oy_sector_beta", window.OY_SECTOR_BETA);
                oy_local_store("oy_proposed", window.OY_PROPOSED);
                oy_log("Initiating new P2P session with new ID "+oy_short(window.OY_MAIN['oy_self_id']));
                oy_init(oy_callback, true);
            });
            return true;
        }
    }

    window.OY_DEPOSIT = oy_local_get("oy_deposit");
    window.OY_PURGE = oy_local_get("oy_purge");
    window.OY_PEERS = oy_local_get("oy_peers");
    window.OY_SECTOR_ALPHA = oy_local_get("oy_sector_alpha");
    window.OY_SECTOR_BETA = oy_local_get("oy_sector_beta");
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
    oy_local_store("oy_sector_alpha", window.OY_SECTOR_ALPHA);
    oy_local_store("oy_sector_beta", window.OY_SECTOR_BETA);
    //oy_local_store("oy_latency", window.OY_LATENCY);
    oy_local_store("oy_proposed", window.OY_PROPOSED);
    oy_local_store("oy_blacklist", window.OY_BLACKLIST);

    window.OY_CONN = new Peer(window.OY_MAIN['oy_self_id'], {key: 'lwjd5qra8257b9'});
    window.OY_CONN.on('open', function(oy_self_id) {
        window.OY_MAIN['oy_ready'] = true;
        oy_log("P2P connection ready with self ID "+oy_short(oy_self_id));
        let oy_peer_local;
        for (oy_peer_local in window.OY_PEERS) {
            if (oy_peer_local==="oy_aggregate_node") continue;
            oy_log("Recovering peer "+oy_short(oy_peer_local));
            window.OY_PEER_COUNT++;
            oy_node_connect(oy_peer_local);
            oy_latency_test(oy_peer_local, "OY_PEER_CONNECT", true);
        }
        oy_local_store("oy_main", window.OY_MAIN);
        if (typeof(oy_callback)==="function") oy_callback();
    });
    window.OY_CONN.on('connection', function(oy_conn) {
        // Receive messages
        oy_conn.on('data', function (oy_data_raw) {
            oy_log("Data with size "+oy_data_raw.length+" received from node "+oy_short(oy_conn.peer)+" DATA: "+oy_data_raw);
            if (oy_data_raw.length>window.OY_DATA_MAX) {
                oy_log("Node "+oy_short(oy_conn.peer)+" sent an excessively sized data sequence, will punish and cease session");
                oy_node_punish(oy_conn.peer, "OY_PUNISH_DATA_BREACH");
                return false;
            }
            let oy_data = oy_data_validate(oy_conn.peer, oy_data_raw);
            if (oy_data===false) {
                oy_log("Node "+oy_short(oy_conn.peer)+" sent invalid data, will punish and cease session");
                oy_node_punish(oy_conn.peer, "OY_PUNISH_DATA_INVALID");
                return false;
            }
            if (oy_data[4]==="OY_LATENCY_RESPONSE") {
                oy_latency_response(oy_conn.peer, oy_data);
            }
            else if (oy_peer_check(oy_conn.peer)) {
                oy_log("Node "+oy_short(oy_conn.peer)+" is mutually peered");
                if (oy_data_measure(false, oy_conn.peer, oy_data_raw.length)===false) {
                    oy_log("Peer "+oy_short(oy_conn.peer)+" exceeded mesh flow compliance limits, will punish");
                    oy_node_punish(oy_conn.peer, "OY_PUNISH_MESH_FLOW");
                    oy_log_debug("MESH FLOW PUNISH FOR "+oy_short(oy_conn.peer)+" AT PULL "+window.OY_PEERS[oy_conn.peer][7]);
                }
                oy_peer_process(oy_conn.peer, oy_data);
            }
            else if (oy_node_blocked(oy_conn.peer)) {
                oy_log("Node "+oy_short(oy_conn.peer)+" is on blacklist, informed: "+window.OY_BLACKLIST[oy_conn.peer][2]);
                if (window.OY_BLACKLIST[oy_conn.peer][2]===false) {
                    window.OY_BLACKLIST[oy_conn.peer][2] = true;
                    oy_data_send(oy_conn.peer, "OY_BLACKLIST", null);
                }
            }
            else {
                oy_log("Node "+oy_short(oy_conn.peer)+" is either unknown or was recently proposed to for peering");
                if (oy_data_measure(false, "oy_aggregate_node", oy_data_raw.length)===false) oy_log("Node "+oy_short(oy_conn.peer)+" pushed aggregate mesh flow compliance beyond limit");
                else oy_node_negotiate(oy_conn.peer, oy_data);
            }
        });
    });
    setTimeout(function() {
        if (window.OY_MAIN['oy_ready']===true) {
            oy_log("Connection is now ready, sparking engine");
            oy_engine();
        }
        else {
            oy_log("Connection is was not established before the ready cutoff, re-sparking INIT");
            window.OY_INIT = 0;
            oy_init(oy_callback);
        }
    }, window.OY_READY_RETRY);
}