// OYSTER MESH
// Bruno Block
// v0.3
// License: GNU GPLv3

// GLOBAL VARS
window.OY_MESH_DYNASTY = "BRUNO_GENESIS_V3";//mesh dynasty definition, changing this will cause a hard-fork
window.OY_MESH_EDGE = 2;//maximum seconds that it should take for a transaction to reach the furthest edge-to-edge distance of the mesh, do not change this unless you know what you are doing
window.OY_MESH_FUTURE = 0.5;//seconds buffer a block command's timestamp is allowed to be in the future, this variable exists to deal with slight mis-calibrations between node clocks
window.OY_MESH_HOP = 0.8;//maximum time allocation per hop for specific broadcasts, in seconds
window.OY_MESH_FLOW = 128000;//characters per second allowed per peer, and for all aggregate non-peer nodes
window.OY_MESH_MEASURE = 10;//seconds by which to measure mesh flow, larger means more tracking of nearby node and peer activity
window.OY_MESH_BEAM_SAMPLE = 3;//time/data measurements to determine mesh beam flow required to state a result, too low can lead to volatile and inaccurate readings
window.OY_MESH_BEAM_BUFFER = 1.5;//multiplication factor for mesh outflow/beam buffer, to give some leeway to compliant peers
window.OY_MESH_SOAK_SAMPLE = 5;//time/data measurements to determine mesh soak flow required to state a result, too low can lead to volatile and inaccurate readings
window.OY_MESH_SOAK_BUFFER = 1;//multiplication factor for mesh inflow/soak buffer, to give some leeway to compliant peers
window.OY_MESH_PUSH_CHANCE = 0.85;//probability that self will forward a data_push when the nonce was not previously stored on self
window.OY_MESH_PUSH_CHANCE_STORED = 0.95;//probability that self will forward a data_push when the nonce was previously stored on self
window.OY_MESH_DEPOSIT_CHANCE = 0.4;//probability that self will deposit pushed data
window.OY_MESH_FULLFILL_CHANCE = 0.2;//probability that data is stored whilst fulfilling a pull request, this makes data intelligently migrate and recommit overtime
window.OY_MESH_SOURCE = 3;//node in route passport (from destination) that is assigned with defining the source variable
window.OY_BLOCK_CONSENSUS = 0.6;//mesh topology corroboration to agree on confirming a meshblock transaction
window.OY_BLOCK_SECTORS = [[4, 4000], [12, 12000]];//timing definitions for the meshblock
window.OY_BLOCK_LAUNCHTIME = 200;//ms delay from block_trigger to launch a command broadcast
window.OY_BLOCK_CHALLENGETIME = 800;//ms delay until meshblock challenge to peers is enforced
window.OY_BLOCK_CLONETIME = 800;//ms delay until meshblock clone
window.OY_BLOCK_KEY_LIMIT = 4;//permitted transactions per wallet per block (20 seconds)
window.OY_BLOCK_HASH_KEEP = 20;//how many hashes of previous blocks to keep in the current meshblock, value is for 6 months worth//1577
window.OY_BLOCK_DENSITY = 0.8;//higher means block OY_LOGIC_ALL packets are more spread out
window.OY_BLOCK_PEERS_MIN = 3;//minimum peer count to be able to act as origin for clones and broadcast SYNC/DIVE
window.OY_BLOCK_DIVE_PACKET_MAX = 8000;//maximum size for a packet that is routed via OY_BLOCK_DIVE_PACKET_MAX (OY_LOGIC_ALL)
window.OY_CHALLENGE_EDGE = 6;//maximum seconds that it should take for a challenged transaction to reach the furthest edge-to-edge distance of the mesh
window.OY_CHALLENGE_TRIGGER = 0.2;//higher means more challenge congestion (more secure, less scalable), lower means less challenge congestion (less secure, more scalable)
window.OY_CHALLENGE_BUFFER = 1;//amount of node hop buffer for challenge broadcasts, higher means more chance the challenge will be received yet more bandwidth taxing
window.OY_AKOYA_DECIMALS = 100000000;//zeros after the decimal point for akoya currency
window.OY_AKOYA_MAX_SUPPY = 10000000*window.OY_AKOYA_DECIMALS;//akoya max supply
window.OY_AKOYA_FEE = 0.000001*window.OY_AKOYA_DECIMALS;//akoya fee per block
window.OY_NODE_TOLERANCE = 3;//max amount of protocol communication violations until node is blacklisted
window.OY_NODE_BLACKTIME = 600;//seconds to blacklist a punished node for
window.OY_NODE_PROPOSETIME = 12;//seconds for peer proposal session duration
window.OY_NODE_ASSIGNTTIME = 10;//minimum interval between node_assign instances to/from top
window.OY_NODE_DELAYTIME = 6;//minimum expected time to connect or transmit data to a node
window.OY_NODE_EXPIRETIME = 600;//seconds of non-interaction until a node's connection session is deleted
window.OY_CLONE_UPTIME_MIN = 60;//seconds since able to keep up with the meshblock required to become a clone origin
window.OY_CLONE_LIVETIME = 40;//seconds to keep a node as a clone
window.OY_CLONE_CHUNK = 52000;//chunk size by which the meshblock is split up and sent per clone transmission
window.OY_PEER_LATENCYTIME = 60;//peers are expected to establish latency timing with each other within this interval in seconds
window.OY_PEER_KEEPTIME = 20;//peers are expected to communicate with each other within this interval in seconds
window.OY_PEER_REFERTIME = 15;//interval in which self asks peers for peer recommendations (as needed)
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
window.OY_LATENCY_GEO_SENS = 90;//percentage buffer for comparing latency with peers, higher means less likely weakest peer will be dropped and mesh is less geo-sensitive
window.OY_DATA_MAX = 64000;//max size of data that can be sent to another node
window.OY_DATA_CHUNK = 48000;//chunk size by which data is split up and sent per transmission
window.OY_DATA_PURGE = 4;//how many handles to delete if localstorage limit is reached
window.OY_DATA_PUSH_INTERVAL = 190;//ms per chunk per push loop iteration
window.OY_DATA_PUSH_NONCE_MAX = 15;//maximum amount of nonces to push per push loop iteration
window.OY_DATA_PULL_INTERVAL = 500;//ms per pull loop iteration
window.OY_DATA_PULL_NONCE_MAX = 5;//maximum amount of nonces to request per pull beam, if too high fulfill will overrun soak limits and cause time/resource waste
window.OY_DATA_FULFILL_INTERVAL = 4000;//ms per chunk per fulfill loop iteration
window.OY_DATA_FULFILL_EXPIRE = 25;//seconds before self will resent a pull fulfillment to the same node for the same handle
window.OY_DEPOSIT_CHAR = 100000;//character rate for data deposit sizing, helps establish storage limits
window.OY_DEPOSIT_MAX_BUFFER = 0.9;//max character length capacity factor of data deposit (0.9 means 10% buffer until hard limit is reached)
window.OY_ENGINE_INTERVAL = 2000;//ms interval for core mesh engine to run, the time must clear a reasonable latency round-about
window.OY_READY_RETRY = 3000;//ms interval to retry connection if READY is still false
window.OY_BLOCK_LOOP = 200;//a lower value means more opportunity within the 10 second window to propagate transactions
window.OY_LOGIC_ALL_MULTI = 8;//multiplication factor for packet weight, higher means more restrictive OY_LOGIC_ALL flow and vice-versa
window.OY_LOGIC_ALL_MAX = 1100;//maximum size for a packet that is routed via OY_LOGIC_ALL, except OY_CHANNEL_BROADCAST
window.OY_CHANNEL_BROADCAST_PACKET_MAX = 5000;//maximum size for a packet that is routed via OY_CHANNEL_BROADCAST (OY_LOGIC_ALL)
window.OY_CHANNEL_KEEPTIME = 15;//channel bearing nodes are expected to broadcast a logic_all packet within this interval
window.OY_CHANNEL_FORGETIME = 60;//seconds since last signed message from channel bearing node
window.OY_CHANNEL_RECOVERTIME = 10;//second interval between channel recovery requests per node, should be at least MESH_EDGE*2
window.OY_CHANNEL_EXPIRETIME = 1209600;//seconds until a broadcast expires and is dropped from nodes listening on the channel
window.OY_CHANNEL_RESPOND_MAX = 30;//max amount of broadcast payloads to send in response to a channel recover request, divided by online count
window.OY_CHANNEL_ALLOWANCE = 8;//broadcast allowance in seconds per public key, an anti-spam mechanism to prevent abuse of OY_LOGIC_ALL
window.OY_KEY_BRUNO = "XLp6_wVPBF3Zg-QNRkEj6U8bOYEZddQITs1n2pyeRqwOG5k9w_1A-RMIESIrVv_5HbvzoLhq-xPLE7z2na0C6M";//prevent impersonation
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
window.OY_MAIN = {"oy_ready":false};//tracks important information that is worth persisting between sessions such as self ID
window.OY_ENGINE = [{}, {}];//tracking object for core engine variables, [0] is latency tracking
window.OY_PURGE = [];//track order of DEPOSIT to determine what data gets deleted ('purged') first
window.OY_COLLECT = {};//object for tracking pull fulfillments
window.OY_CONSTRUCT = {};//data considered valid from OY_COLLECT is stored here, awaiting for final data reconstruction
window.OY_DATA_PUSH = {};//object for tracking data push threads
window.OY_DATA_PULL = {};//object for tracking data pull threads
window.OY_PEERS = {"oy_aggregate_node":[-1, -1, -1, 0, [], 0, [], 0, [], -1, -1]};//optimization for quick and inexpensive checks for mutual peering
window.OY_PEERS_PRE = {};//tracks nodes that are almost peers, will become peers once PEER_AFFIRM is received from other node
window.OY_PEERS_NULL = new Event('oy_peers_null');//trigger-able event for when peer_count == 0
window.OY_PEERS_RECOVER = new Event('oy_peers_recover');//trigger-able event for when peer_count > 0
window.OY_NODES = {};//P2P connection handling for individual nodes, is not mirrored in localStorage due to DOM restrictions
window.OY_WARM = {};//tracking connections to nodes that are warming up
window.OY_COLD = {};//tracking connection shutdowns to specific nodes
window.OY_ROUTE_DYNAMIC = [];//tracks dynamic identifier for a routed data sequence
window.OY_LATENCY = {};//handle latency sessions
window.OY_PROPOSED = {};//nodes that have been recently proposed to for mutual peering
window.OY_BLACKLIST = {};//nodes to block for x amount of time
window.OY_PUSH_HOLD = {};//holds data contents ready for pushing to mesh
window.OY_PUSH_TALLY = {};//tracks data push nonces that were deposited on the mesh
window.OY_ORIGINS = {};
window.OY_CLONES = {};
window.OY_CLONE_UPTIME = null;
window.OY_CLONE_BUILD = [];
window.OY_LOGIC_ALL_TYPE = ["OY_BLOCK_COMMAND", "OY_BLOCK_SYNC", "OY_BLOCK_SYNC_CHALLENGE", "OY_BLOCK_DIVE", "OY_DATA_PULL", "OY_CHANNEL_BROADCAST"];//OY_LOGIC_ALL definitions
window.OY_LOGIC_FOLLOW_TYPE = ["OY_BLOCK_SYNC_CHALLENGE_RESPONSE", "OY_DATA_DEPOSIT", "OY_DATA_FULFILL", "OY_CHANNEL_ECHO", "OY_CHANNEL_RESPOND", "OY_CHANNEL_RECOVER"];//OY_LOGIC_FOLLOW definitions
window.OY_BLOCK_TEMP = [null];//temporary centralized block
window.OY_BLOCK_TEMP_HASH = null;//hash of the most current block
window.OY_BLOCK = [[null, []], {}, {}, {}, {}];//the current meshblock - [oy_meta_sector, oy_history_sector, oy_akoya_sector, oy_dns_sector, oy_channel_sector]
window.OY_BLOCK_HASH = null;//hash of the most current block
window.OY_BLOCK_SIGN = null;
window.OY_BLOCK_TIME = oy_block_time(false);//the most recent block timestamp
window.OY_BLOCK_NEXT = oy_block_time(true);//the next block timestamp
window.OY_BLOCK_COMMANDS = {
    "OY_AKOYA_SEND":[function(oy_command_array) {
        if (oy_command_array.length===5&&//check the element count in the command
            oy_command_array[3]>0&&//check that the sending amount is greater than zero
            oy_command_array[3]<window.OY_AKOYA_MAX_SUPPY&&//check that the sending amount smaller than the max supply
            typeof(window.OY_BLOCK[2][oy_command_array[2]])!=="undefined"&&//check the sending wallet exists
            oy_command_array[3]<=window.OY_BLOCK[2][oy_command_array[2]]) return true;//check the sending wallet has sufficient akoya
        return false;
        //TODO - check that receiving address is a valid address
        //TODO - either one wallet transaction per block or need additional checks
    }],
    "OY_AKOYA_BURN":[function(oy_command_array) {
        if (oy_command_array.length===4) return true;//check the element count in the command
        return false;
        //TODO
    }],
    "OY_DNS_SET":[function(oy_command_array) {
        if (oy_command_array.length===4) return true;//check the element count in the command
        return false;
        //TODO
    }],
    "OY_DNS_TRANSFER":[function(oy_command_array) {
        if (oy_command_array.length===4) return true;//check the element count in the command
        return false;
        //TODO
    }]
};
window.OY_BLOCK_COMMAND = {};
window.OY_BLOCK_COMMAND_KEY = {};
window.OY_BLOCK_SYNC = {};
window.OY_BLOCK_DIVE = {};
window.OY_BLOCK_DIVE_SET = [];
window.OY_BLOCK_DIVE_REWARD = "OY_NULL";
window.OY_BLOCK_CONFIRM = {};
window.OY_BLOCK_SEEDTIME = null;
window.OY_BLOCK_TRIGGER = new Event('oy_block_trigger');//trigger-able event for when a new block is issued
window.OY_CHALLENGE = {};//objects for tracking peers that are challenged for the new meshblock hash
window.OY_CHANNEL_DYNAMIC = {};//track channel broadcasts to ensure allowance compliance
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

// noinspection JSUnusedGlobalSymbols
function oy_log_debug(oy_log_msg) {
    if (typeof(window.OY_MAIN['oy_self_public'])==="undefined") return false;
    oy_log_msg = "["+(Date.now()/1000)+"] "+oy_log_msg;
    let oy_xhttp = new XMLHttpRequest();
    oy_xhttp.open("POST", "https://top.oyster.org/oy_log_catch.php", true);
    oy_xhttp.send("oy_log_catch="+JSON.stringify([window.OY_MAIN['oy_self_short'], oy_log_msg]));
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

function oy_base_encode(oy_base_raw) {
    return window.btoa(oy_base_raw);
}

function oy_base_decode(oy_base_encoded) {
    return window.atob(oy_base_encoded);
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
    window.crypto.subtle.importKey(
        "jwk",
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
    ).then(function(oy_key_public_raw) {
        window.crypto.subtle.verify(
            {
                name: "ECDSA",
                hash: {name: "SHA-256"}, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
            },
            oy_key_public_raw, //from generateKey or importKey above
            oy_buffer_encode(oy_key_signature, true),
            oy_buffer_encode(oy_key_data, false) //ArrayBuffer of data you want to sign
        ).then(function(oy_key_valid) {
            oy_callback(oy_key_valid);
        }).catch(function(oy_error) {
            oy_log("Cryptographic error [VERIFY_B] "+oy_error, 1);
            console.log(oy_callback);
        });
    }).catch(function(oy_error) {
        oy_log("Cryptographic error [VERIFY_A]: "+oy_error, 1);
    });
}

function oy_key_sign(oy_key_private, oy_key_data, oy_callback) {
    oy_key_private = window.atob(oy_key_private);
    window.crypto.subtle.importKey(
        "jwk",
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
            oy_log("Cryptographic error [SIGN_B]: "+oy_error, 1);
        });
    }).catch(function(oy_error) {
        oy_log("Cryptographic error [SIGN_A]: "+oy_error, 1);
        console.log(oy_callback);
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
            oy_callback(window.btoa((oy_key_pass.d+oy_key_pass.x+oy_key_pass.y)), (oy_key_pass.x+oy_key_pass.y));
        }).catch(function(oy_error) {
            oy_log("Cryptographic error [GEN_B]: "+oy_error, 1);
        });
    }).catch(function(oy_error) {
        oy_log("Cryptographic error [GEN_A]: "+oy_error, 1);
    });
}

function oy_reduce_sum(oy_reduce_total, oy_reduce_num) {
    return oy_reduce_total + oy_reduce_num;
}

function oy_handle_check(oy_data_handle) {
    return typeof(oy_data_handle)==="string"&&oy_data_handle.substr(0, 2)==="OY"&&oy_data_handle.length>20;
}

function oy_local_store(oy_local_name, oy_local_data) {
    try {
        localStorage.setItem(oy_local_name, JSON.stringify(oy_local_data));
    }
    catch(e) {
        oy_data_deposit_purge();
    }
    oy_log("Updated localStorage retention of "+oy_local_name);
    return true;
}

function oy_local_get(oy_local_name) {
    let oy_local_raw = localStorage.getItem(oy_local_name);
    if (oy_local_raw===null||oy_local_raw.length===0) {
        if (oy_local_name==="oy_main") return {"oy_ready":false};
        else if (oy_local_name==="oy_peers") return {"oy_aggregate_node":[-1, -1, -1, 0, [], 0, [], 0, [], -1, -1]};
        else if (oy_local_name==="oy_purge") return [];
        return {};
    }
    let oy_local_data = JSON.parse(oy_local_raw);
    if (oy_local_data===null) return false;
    oy_log("Retrieved localStorage retention of "+oy_local_name);
    return oy_local_data;
}

function oy_peer_add(oy_peer_id) {
    if (oy_peer_check(oy_peer_id)) {
        oy_log("Failed to add node "+oy_short(oy_peer_id)+" to peer list that already exists in peer list");
        return false;//cancel if peer already exists in list
    }
    let oy_callback_local = function() {
        //[peership timestamp, last msg timestamp, last latency timestamp, latency avg, latency history, data beam, data beam history, data soak, data soak history, logic_all last beamed, logic_all last soaked]
        window.OY_PEERS[oy_peer_id] = [Date.now()/1000|0, -1, -1, 0, [], 0, [], 0, [], -1, -1];
        if (window.OY_PEER_COUNT===0) document.dispatchEvent(window.OY_PEERS_RECOVER);
        window.OY_PEER_COUNT++;
        oy_local_store("oy_peers", window.OY_PEERS);
        oy_node_reset(oy_peer_id);
    };
    oy_node_connect(oy_peer_id, oy_callback_local);
    return true;
}

function oy_peer_remove(oy_peer_id, oy_punish_reason) {
    if (!oy_peer_check(oy_peer_id)) {
        oy_log("Tried to remove non-existent peer");
        return false;
    }
    oy_data_beam(oy_peer_id, "OY_PEER_TERMINATE", (typeof(oy_punish_reason)==="undefined")?"OY_REASON_PEER_REMOVE":oy_punish_reason);
    window.OY_PEER_COUNT--;
    delete window.OY_PEERS[oy_peer_id];
    if (window.OY_PEER_COUNT===0) document.dispatchEvent(window.OY_PEERS_NULL);
    oy_local_store("oy_peers", window.OY_PEERS);
    oy_node_reset(oy_peer_id);
    if (window.OY_PEER_COUNT<0) {
        oy_log("Peer management system failed", 1);
        return false;
    }
    oy_log("Removed peer "+oy_short(oy_peer_id)+" with reason "+oy_punish_reason);
    if (typeof(oy_punish_reason)!=="undefined") oy_node_punish(oy_peer_id, oy_punish_reason);
}

function oy_peer_pre_add(oy_node_id) {
    window.OY_PEERS_PRE[oy_node_id] = (Date.now()/1000|0)+window.OY_PEER_PRETIME;
    return true;
}

function oy_peer_pre_check(oy_node_id) {
    return typeof window.OY_PEERS_PRE[oy_node_id]!=="undefined"&&window.OY_PEERS_PRE[oy_node_id]>=(Date.now()/1000|0);
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

//checks if short id of node correlates with a mutual peer
function oy_peer_find(oy_peer_short) {
    if (oy_peer_short===window.OY_MAIN['oy_self_short']) return false;
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
    if (!oy_peer_check(oy_peer_id)&&typeof(window.OY_ORIGINS[oy_peer_id])==="undefined") {
        oy_log("Tried to call peer_process on a non-existent peer", 1);
        return false;
    }
    let oy_time_local = Date.now()/1000;
    if (typeof(window.OY_ORIGINS[oy_peer_id])==="undefined") window.OY_PEERS[oy_peer_id][1] = oy_time_local;//update last msg timestamp for peer, no need to update localstorage via oy_local_store() (could be expensive)
    oy_log("Mutual peer "+oy_short(oy_peer_id)+" sent data sequence with flag: "+oy_data_flag);
    if (oy_data_flag==="OY_BLOCK_COMMAND") {
        //oy_data_payload = [oy_route_passport_passive, oy_route_dynamic, oy_command_array, oy_command_crypt]
        if (oy_data_payload.length!==4||typeof(oy_data_payload[0])!=="object"||oy_data_payload[1].length===0) {
            oy_log("Peer "+oy_short(oy_peer_id)+" sent invalid block command, will punish");
            oy_node_punish(oy_peer_id, "OY_PUNISH_COMMAND_INVALID");
            return false;
        }

        if (oy_data_payload[2][1]<oy_time_local+window.OY_MESH_FUTURE&&//check that the broadcast timestamp is not in the future, with buffer leniency
            oy_time_local-oy_data_payload[2][1]<window.OY_MESH_EDGE+window.OY_MESH_FUTURE&&//check that the broadcast timestamp complies with MESH_EDGE restrictions
            oy_data_payload[2][1]-window.OY_BLOCK_TIME>=0&&//check that the broadcast timestamp is in the first sector of the current block
            oy_data_payload[2][1]-window.OY_BLOCK_TIME<window.OY_BLOCK_SECTORS[0][0]&&//check that the broadcast timestamp is in the first sector of the current block
            oy_time_local-window.OY_BLOCK_TIME>=0&&//check that the broadcast is being processed in the current block
            oy_time_local<window.OY_BLOCK_NEXT) {//check that the broadcast is being processed before the next block (current block)

            let oy_command_hash = oy_hash_gen(JSON.stringify(oy_data_payload[2]));
            if (typeof(window.OY_BLOCK_COMMAND_KEY[oy_data_payload[2][2]])==="undefined") window.OY_BLOCK_COMMAND_KEY[oy_data_payload[2][2]] = [];
            if (window.OY_BLOCK_COMMAND_KEY[oy_data_payload[2][2]].length>=window.OY_BLOCK_KEY_LIMIT||window.OY_BLOCK_COMMAND_KEY[oy_data_payload[2][2]].indexOf(oy_command_hash)!==-1) return false;
            window.OY_BLOCK_COMMAND_KEY[oy_data_payload[2][2]].push(oy_command_hash);

            oy_block_command_verify([oy_data_payload[2], oy_data_payload[3]], function(oy_verify_valid) {
                if (oy_verify_valid===true) {
                    window.OY_BLOCK_COMMAND[oy_command_hash] = oy_data_payload;
                    oy_data_route("OY_LOGIC_ALL", "OY_BLOCK_COMMAND", oy_data_payload);
                }
            });
        }
        return true;
    }
    else if (oy_data_flag==="OY_BLOCK_SYNC") {
        //oy_data_payload = [oy_route_passport_passive, oy_route_dynamic, oy_sync_time, oy_sync_crypt, oy_sync_command, oy_key_public, oy_dive_reward]
        if (oy_data_payload.length!==7||typeof(oy_data_payload[0])!=="object"||oy_data_payload[1].length===0||oy_data_payload[0][0]!==oy_short(oy_data_payload[5])) {
            //oy_log_debug("PUNISH1: "+JSON.stringify(oy_data_payload));
            oy_log("Peer "+oy_short(oy_peer_id)+" sent invalid block sync, will punish");
            oy_node_punish(oy_peer_id, "OY_PUNISH_SYNC_INVALID");
            return false;
        }

        if (typeof(window.OY_BLOCK_SYNC[oy_data_payload[5]])!=="undefined") return false;

        if (oy_data_payload[2]<oy_time_local+window.OY_MESH_FUTURE&&//check that the broadcast timestamp is not in the future, with buffer leniency
            oy_time_local-oy_data_payload[2]<window.OY_CHALLENGE_EDGE+window.OY_MESH_FUTURE&&//check that the broadcast timestamp complies with MESH_EDGE restrictions
            oy_time_local-oy_data_payload[2]<window.OY_MESH_HOP*oy_data_payload[0].length&&//check that the broadcast timestamp complies with MESH_HOP restrictions
            oy_data_payload[2]-window.OY_BLOCK_TIME>=window.OY_BLOCK_SECTORS[0][0]&&//check that the broadcast timestamp is in the sync processing zone
            oy_data_payload[2]-window.OY_BLOCK_TIME<window.OY_BLOCK_SECTORS[0][0]+(window.OY_BLOCK_SECTORS[1][0]*window.OY_BLOCK_DENSITY)&&//check that the broadcast timestamp is in the sync processing zone
            oy_time_local-window.OY_BLOCK_TIME>=0&&//check that the broadcast is being processed in the current block
            oy_time_local<window.OY_BLOCK_NEXT) {//check that the broadcast is being processed before the next block (current block)

            let oy_sync_hash = oy_hash_gen(JSON.stringify(oy_data_payload[4]));
            oy_key_verify(oy_data_payload[5], oy_data_payload[3], oy_data_payload[2]+oy_sync_hash+oy_data_payload[6], function(oy_key_valid) {
                if (oy_key_valid===true) {
                    let oy_command_pool = {};
                    let oy_command_inherit = [];
                    for (let i in oy_data_payload[4]) {
                        let oy_command_hash = oy_hash_gen(JSON.stringify(oy_data_payload[4][i][0]));
                        if (typeof(oy_command_pool[oy_command_hash])!=="undefined") return false;//node sent same command twice, so discard their entire sync broadcast
                        oy_command_pool[oy_command_hash] = oy_data_payload[4][i][0];
                        if (typeof(window.OY_BLOCK_COMMAND[oy_command_hash])==="undefined") oy_command_inherit.push(oy_data_payload[4][i]);
                    }
                    oy_block_sync_verify(oy_command_inherit, function(oy_sync_verify) {
                        if (oy_sync_verify===true) {
                            if (typeof(window.OY_ORIGINS[oy_peer_id])!=="undefined"&&oy_time_local<window.OY_ORIGINS[oy_peer_id]) window.OY_BLOCK_SYNC[oy_data_payload[5]] = [true, null, oy_data_payload, oy_command_pool];
                            else {
                                let oy_sync_challenge = oy_rand_gen();
                                if (Math.random()<window.OY_CHALLENGE_TRIGGER) {
                                    window.OY_BLOCK_SYNC[oy_data_payload[5]] = [false, oy_sync_challenge+oy_sync_hash, oy_data_payload, oy_command_pool];
                                    let oy_route_skip = oy_data_payload[0].slice();
                                    let oy_route_target = oy_route_skip.shift();
                                    oy_data_route("OY_LOGIC_CHALLENGE", "OY_BLOCK_SYNC_CHALLENGE", [[], oy_rand_gen(), oy_route_skip, oy_route_target, oy_data_payload[1], oy_sync_challenge]);
                                }
                                else {
                                    window.OY_BLOCK_SYNC[oy_data_payload[5]] = [true, oy_sync_challenge+oy_sync_hash, oy_data_payload, oy_command_pool];
                                    oy_data_route("OY_LOGIC_ALL", "OY_BLOCK_SYNC", oy_data_payload);
                                }
                            }
                        }
                    });
                }
            });
        }
        return true;
    }
    else if (oy_data_flag==="OY_BLOCK_SYNC_CHALLENGE") {
        //oy_data_payload = [oy_route_passport_passive, oy_route_dynamic, oy_route_skip, oy_route_target, oy_route_dynamic_prev, oy_sync_challenge]
        if (oy_data_payload.length!==6||typeof(oy_data_payload[0])!=="object"||oy_data_payload[1].length===0) {
            //oy_log_debug("PUNISH2: "+JSON.stringify(oy_data_payload));
            oy_log("Peer "+oy_short(oy_peer_id)+" sent invalid block sync challenge will punish");
            oy_node_punish(oy_peer_id, "OY_PUNISH_SYNC_INVALID");
            return false;
        }
        if (oy_data_payload[3]===window.OY_MAIN['oy_self_short']) {
            if (oy_data_payload[4]===window.OY_BLOCK_SYNC_DYNAMIC&&oy_time_local-window.OY_BLOCK_TIME>=window.OY_BLOCK_SECTORS[0][0]&&oy_time_local-window.OY_BLOCK_SECTORS[0][0]+window.OY_BLOCK_SECTORS[1][0]) {
                oy_key_sign(window.OY_MAIN['oy_self_private'], oy_data_payload[5]+window.OY_BLOCK_SYNC_HASH, function(oy_challenge_crypt) {
                    oy_data_route("OY_LOGIC_FOLLOW", "OY_BLOCK_SYNC_CHALLENGE_RESPONSE", [[], oy_data_payload[0], window.OY_MAIN['oy_self_public'], oy_challenge_crypt]);
                });
            }
        }
        else oy_data_route("OY_LOGIC_CHALLENGE", "OY_BLOCK_SYNC_CHALLENGE", oy_data_payload);
        return true;
    }
    else if (oy_data_flag==="OY_BLOCK_SYNC_CHALLENGE_RESPONSE") {
        //oy_data_payload = [oy_route_passport_passive, oy_route_passport_active, oy_key_public, oy_challenge_crypt]
        if (oy_data_payload.length!==4||typeof(oy_data_payload[0])!=="object"||typeof(oy_data_payload[1])!=="object"||oy_data_payload[1].length===0||oy_data_payload[0][0]!==oy_short(oy_data_payload[2])) {
            //oy_log_debug("PUNISH3: "+JSON.stringify(oy_data_payload));
            oy_log("Peer "+oy_short(oy_peer_id)+" sent invalid block sync challenge response, will punish");
            oy_node_punish(oy_peer_id, "OY_PUNISH_SYNC_INVALID");
            return false;
        }

        if (oy_data_payload[1][0]===window.OY_MAIN['oy_self_short']) {
            if (typeof(window.OY_BLOCK_SYNC[oy_data_payload[2]])!=="undefined") {
                oy_key_verify(oy_data_payload[2], oy_data_payload[3], window.OY_BLOCK_SYNC[oy_data_payload[2]][1], function(oy_key_valid) {
                    if (oy_key_valid===true) {
                        window.OY_BLOCK_SYNC[oy_data_payload[2]][0] = true;
                        oy_data_route("OY_LOGIC_ALL", "OY_BLOCK_SYNC", window.OY_BLOCK_SYNC[oy_data_payload[2]][2]);
                    }
                });
            }
        }
        else {//carry on reversing the passport until the data reaches the intended destination
            //oy_log("Continuing block sync challenge response for public key "+oy_short(oy_data_payload[2]));
            oy_data_route("OY_LOGIC_FOLLOW", "OY_BLOCK_SYNC_CHALLENGE_RESPONSE", oy_data_payload);
        }
        return true;
    }
    else if (oy_data_flag==="OY_BLOCK_DIVE") {
        //oy_data_payload = [oy_route_passport_passive, oy_route_dynamic, oy_dive_time, oy_dive_crypt, oy_dive_pool, oy_key_public]
        if (oy_data_payload.length!==6||typeof(oy_data_payload[0])!=="object"||oy_data_payload[1].length===0||oy_data_payload[0][0]!==oy_short(oy_data_payload[5])) {
            oy_log("Peer "+oy_short(oy_peer_id)+" sent invalid block dive, will punish");
            oy_node_punish(oy_peer_id, "OY_PUNISH_DIVE_INVALID");
            return false;
        }

        if (window.OY_BLOCK_DIVE_SET.indexOf(oy_data_payload[5])===-1&&//check that dive_set did not already process this dive broadcast
            typeof(window.OY_BLOCK_SYNC[oy_data_payload[5]])!=="undefined"&&//check that the public key of the node was validated during block_sync
            oy_data_payload[2]-window.OY_BLOCK_TIME>=window.OY_BLOCK_SECTORS[0][0]+window.OY_BLOCK_SECTORS[1][0]&&//check that the broadcast timestamp is in the dive processing zone
            oy_data_payload[2]-window.OY_BLOCK_TIME<window.OY_BLOCK_SECTORS[0][0]+window.OY_BLOCK_SECTORS[1][0]+(window.OY_BLOCK_SECTORS[0][0]*window.OY_BLOCK_DENSITY)&&//check that the broadcast timestamp is in the dive processing zone
            oy_time_local-window.OY_BLOCK_TIME>=0&&//check that the broadcast is being processed in the current block
            oy_time_local<window.OY_BLOCK_NEXT) {//check that the broadcast is being processed before the next block (current block)

            let oy_dive_hash = oy_hash_gen(JSON.stringify(oy_data_payload[4]));
            oy_key_verify(oy_data_payload[5], oy_data_payload[3], oy_data_payload[2]+oy_dive_hash, function(oy_key_valid) {
                if (oy_key_valid===true) {
                    window.OY_BLOCK_DIVE_SET.push(oy_data_payload[5]);
                    oy_data_route("OY_LOGIC_ALL", "OY_BLOCK_DIVE", oy_data_payload);
                    for (let i in oy_data_payload[4]) {
                        if (typeof(window.OY_BLOCK_DIVE[oy_data_payload[4][i][0]])==="undefined") window.OY_BLOCK_DIVE[oy_data_payload[4][i][0]] = {};
                        if (typeof(window.OY_BLOCK_DIVE[oy_data_payload[4][i][0]][oy_data_payload[4][i][1]])==="undefined") window.OY_BLOCK_DIVE[oy_data_payload[4][i][0]][oy_data_payload[4][i][1]] = 0;
                        window.OY_BLOCK_DIVE[oy_data_payload[4][i][0]][oy_data_payload[4][i][1]]++;
                    }
                }
            });
        }
        return true;
    }
    else if (oy_data_flag==="OY_DATA_PUSH") {//store received data and potentially forward the push request to peers
        //oy_data_payload = [oy_route_passport_passive, oy_data_handle, oy_data_nonce, oy_data_value]
        //data received here will be committed to data_deposit with only randomness restrictions, mesh flow restrictions from oy_init() are sufficient
        if (oy_data_payload.length!==4||typeof(oy_data_payload[0])!=="object"||!oy_handle_check(oy_data_payload[1])||oy_data_payload[3].length>window.OY_DATA_CHUNK) {
            oy_log("Peer "+oy_short(oy_peer_id)+" sent invalid push data sequence, will punish");
            oy_node_punish(oy_peer_id, "OY_PUNISH_PUSH_INVALID");
            return false;
        }
        let oy_fwd_chance = window.OY_MESH_PUSH_CHANCE;
        if (oy_data_deposit(oy_data_payload[1], oy_data_payload[2], oy_data_payload[3])||!!oy_data_deposit_get(oy_data_payload[1], oy_data_payload[2])) {
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
        if (oy_data_payload.length!==4||typeof(oy_data_payload[0])!=="object"||oy_data_payload[1].length===0||!oy_handle_check(oy_data_payload[2])||oy_data_payload[3].length>window.OY_DATA_PULL_NONCE_MAX) {
            oy_log("Peer "+oy_short(oy_peer_id)+" sent invalid pull data sequence, will punish");
            oy_node_punish(oy_peer_id, "OY_PUNISH_PULL_INVALID");
            return false;
        }
        let oy_nonce_purge = [];
        let oy_nonce_array = oy_data_payload[3];
        let oy_fulfill_delay = 0;
        for (let i in oy_data_payload[3]) {
            let oy_deposit_get = oy_data_deposit_get(oy_data_payload[2], oy_data_payload[3][i]);
            if (!!oy_deposit_get) {
                oy_log("Found nonce "+oy_data_payload[3][i]+" for handle "+oy_data_payload[2]);
                setTimeout(function() {
                    oy_data_route("OY_LOGIC_FOLLOW", "OY_DATA_FULFILL", [[], oy_data_payload[0], "oy_source_void", oy_data_payload[2], oy_nonce_array[i], oy_deposit_get]);
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
        if (oy_data_payload.length!==6||typeof(oy_data_payload[0])!=="object"||typeof(oy_data_payload[1])!=="object"||oy_data_payload[1].length===0||!oy_handle_check(oy_data_payload[3])) {
            oy_log("Peer "+oy_short(oy_peer_id)+" sent invalid deposit data sequence, will punish");
            oy_node_punish(oy_peer_id, "OY_PUNISH_DEPOSIT_INVALID");
            return false;
        }
        if (oy_data_payload[1][0]===window.OY_MAIN['oy_self_short']) {
            oy_log("Data deposit sequence with handle "+oy_short(oy_data_payload[3])+" at nonce "+oy_data_payload[4]+" found self as the final destination");
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
        if (oy_data_payload.length!==6||typeof(oy_data_payload[0])!=="object"||typeof(oy_data_payload[1])!=="object"||oy_data_payload[1].length===0||!oy_handle_check(oy_data_payload[3])) {
            oy_log("Peer "+oy_short(oy_peer_id)+" sent invalid fulfill data sequence, will punish");
            oy_node_punish(oy_peer_id, "OY_PUNISH_FULFILL_INVALID");
            return false;
        }
        if (oy_data_payload[1][0]===window.OY_MAIN['oy_self_short']) {
            oy_log("Data fulfillment sequence with handle "+oy_short(oy_data_payload[3])+" at nonce "+oy_data_payload[4]+" found self as the final destination");
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
        if (oy_data_payload.length!==7||typeof(oy_data_payload[0])!=="object"||oy_data_payload[1].length===0||!oy_channel_check(oy_data_payload[2])) {
            oy_log("Peer "+oy_short(oy_peer_id)+" sent invalid channel broadcast, will punish");
            oy_node_punish(oy_peer_id, "OY_PUNISH_CHANNEL_INVALID");
            return false;
        }
        oy_channel_verify(oy_data_payload, function(oy_verify_pass) {
            if (oy_verify_pass===null) oy_log("Was unable to verify broadcast from channel "+oy_short(oy_data_payload[2])+" at no fault of the sending peer");
            else if (oy_verify_pass===true) {
                oy_log("Beaming channel "+oy_short(oy_data_payload[2])+" forward along the mesh");
                oy_data_route("OY_LOGIC_ALL", "OY_CHANNEL_BROADCAST", oy_data_payload);
                if (typeof(window.OY_CHANNEL_LISTEN[oy_data_payload[2]])!=="undefined") {
                    oy_channel_top(oy_data_payload[2], oy_data_payload[0], true);

                    let oy_broadcast_hash = oy_hash_gen(oy_data_payload[4]);

                    let oy_echo_beam = function() {
                        if (window.OY_CHANNEL_LISTEN[oy_data_payload[2]][0]===null) return false;
                        oy_key_sign(window.OY_CHANNEL_LISTEN[oy_data_payload[2]][0], oy_broadcast_hash, function(oy_echo_crypt) {
                            oy_log("Beaming echo for channel "+oy_short(oy_data_payload[2]));
                            oy_data_route("OY_LOGIC_FOLLOW", "OY_CHANNEL_ECHO", [[], oy_data_payload[0], oy_data_payload[1], oy_data_payload[2], oy_echo_crypt, window.OY_CHANNEL_LISTEN[oy_data_payload[2]][1]]);
                        });
                    };

                    if (oy_data_payload[3]==="OY_CHANNEL_PING") {
                        oy_log("Received ping broadcast for channel "+oy_short(oy_data_payload[2]));
                        oy_echo_beam();
                        return true;
                    }

                    if (typeof(window.OY_CHANNEL_RENDER[oy_data_payload[2]])==="undefined") window.OY_CHANNEL_RENDER[oy_data_payload[2]] = {};

                    if (typeof(window.OY_CHANNEL_RENDER[oy_data_payload[2]][oy_broadcast_hash])!=="undefined") {
                        oy_log("Already rendered broadcast hash "+oy_short(oy_broadcast_hash)+" from channel "+oy_short(oy_data_payload[2])+", will ignore");
                        return false;
                    }

                    window.OY_CHANNEL_RENDER[oy_data_payload[2]][oy_broadcast_hash] = true;
                    let oy_render_payload = oy_data_payload.slice();
                    oy_render_payload[3] = oy_base_decode(oy_render_payload[3]);
                    window.OY_CHANNEL_LISTEN[oy_data_payload[2]][2](oy_broadcast_hash, oy_render_payload);
                    oy_render_payload = null;

                    let oy_broadcast_payload = oy_data_payload.slice();
                    oy_broadcast_payload[0] = null;
                    oy_broadcast_payload[1] = null;
                    oy_broadcast_payload[7] = [];

                    if (window.OY_CHANNEL_LISTEN[oy_data_payload[2]][0]!==null) {
                        oy_key_sign(window.OY_CHANNEL_LISTEN[oy_data_payload[2]][0], oy_data_payload[4], function(oy_data_crypt) {
                            oy_broadcast_payload[7].push([oy_data_crypt, window.OY_CHANNEL_LISTEN[oy_data_payload[2]][1]]);
                            if (typeof(window.OY_CHANNEL_KEEP[oy_data_payload[2]])==="undefined") window.OY_CHANNEL_KEEP[oy_data_payload[2]] = {};
                            if (typeof(window.OY_CHANNEL_KEEP[oy_data_payload[2]][oy_broadcast_hash])==="undefined") window.OY_CHANNEL_KEEP[oy_data_payload[2]][oy_broadcast_hash] = oy_broadcast_payload;
                            oy_local_store("oy_channel_keep", window.OY_CHANNEL_KEEP);
                        });

                        oy_echo_beam();
                    }
                }
            }
            else {
                oy_log("Peer "+oy_short(oy_peer_id)+" sent an unverifiable channel broadcast, will punish");
                oy_node_punish(oy_peer_id, "OY_PUNISH_CHANNEL_VERIFY");
                return false;
            }
        });
    }
    else if (oy_data_flag==="OY_CHANNEL_ECHO") {
        //oy_data_payload = [oy_route_passport_passive, oy_route_passport_active, oy_route_dynamic_prev, oy_channel_id, oy_echo_crypt, oy_key_public]
        if (oy_data_payload.length!==6||typeof(oy_data_payload[0])!=="object"||typeof(oy_data_payload[1])!=="object"||oy_data_payload[1].length===0||!oy_channel_check(oy_data_payload[3])) {
            oy_log("Peer "+oy_short(oy_peer_id)+" sent invalid channel echo, will punish");
            oy_node_punish(oy_peer_id, "OY_PUNISH_ECHO_INVALID");
            return false;
        }
        if (oy_data_payload[1][0]===window.OY_MAIN['oy_self_short']) {
            oy_log("Echo for channel "+oy_short(oy_data_payload[3])+" found self as the final destination");

            let oy_echo_key = oy_data_payload[3]+oy_data_payload[2];
            if (typeof(window.OY_CHANNEL_ECHO[oy_echo_key])==="undefined") {
                oy_log("Could not find echo session for channel "+oy_short(oy_data_payload[3]));
                return false;
            }
            if (oy_time_local>window.OY_CHANNEL_ECHO[oy_echo_key][0]) {
                oy_log("Echo session for channel "+oy_short(oy_data_payload[3])+" has expired");
                delete window.OY_CHANNEL_ECHO[oy_echo_key];
                return false;
            }
            if (!oy_channel_approved(oy_data_payload[3], oy_data_payload[5])) {
                oy_log("Received echo from unapproved public key for channel "+oy_short(oy_data_payload[3]));
                return false;
            }
            if (window.OY_CHANNEL_ECHO[oy_echo_key][3].indexOf(oy_data_payload[5])!==-1) {
                oy_log("Received duplicate echo for channel "+oy_short(oy_data_payload[3]));
                return false;
            }
            window.OY_CHANNEL_ECHO[oy_echo_key][3].push(oy_data_payload[5]);

            oy_key_verify(oy_data_payload[5], oy_data_payload[4], window.OY_CHANNEL_ECHO[oy_echo_key][1], function(oy_key_valid) {
                if (oy_key_valid===true) {
                    oy_log("Valid echo received for channel "+oy_short(oy_data_payload[3]));
                    //TODO verify that passive passports from echo are similar to broadcast, prevent engine recovery from only working partially
                    oy_channel_top(oy_data_payload[3], oy_data_payload[0], true);

                    window.OY_CHANNEL_ECHO[oy_echo_key][2](window.OY_CHANNEL_ECHO[oy_echo_key][1]);
                }
                else oy_log("Invalid echo received for channel "+oy_short(oy_data_payload[3]));
            });
        }
        else {//carry on reversing the passport until the data reaches the intended destination
            oy_log("Continuing echo of channel "+oy_short(oy_data_payload[3]));
            oy_data_route("OY_LOGIC_FOLLOW", "OY_CHANNEL_ECHO", oy_data_payload);
        }
    }
    else if (oy_data_flag==="OY_CHANNEL_RECOVER") {
        //oy_data_payload = [oy_route_passport_passive, oy_route_passport_active, oy_channel_id, oy_hash_keep, oy_challenge_crypt, oy_key_public, oy_sign_time]
        if (oy_data_payload.length!==7||typeof(oy_data_payload[0])!=="object"||typeof(oy_data_payload[1])!=="object"||oy_data_payload[1].length===0||!oy_channel_check(oy_data_payload[2])) {
            oy_log("Peer "+oy_short(oy_peer_id)+" sent invalid channel recover request, will punish");
            oy_node_punish(oy_peer_id, "OY_PUNISH_RECOVER_INVALID");
            return false;
        }
        if (oy_data_payload[1][0]===window.OY_MAIN['oy_self_short']) {
            oy_log("Channel recover request for channel "+oy_short(oy_data_payload[2])+" found self as the final destination");
            if (typeof(window.OY_CHANNEL_LISTEN[oy_data_payload[2]])==="undefined"||typeof(window.OY_CHANNEL_KEEP[oy_data_payload[2]])==="undefined") {
                oy_log("Channel "+oy_short(oy_data_payload[2])+" is not being kept locally");
                return false;
            }
            else {
                if (oy_data_payload[4]===null||oy_data_payload[5]===null||oy_time_local-oy_data_payload[6]>window.OY_MESH_EDGE) oy_channel_top(oy_data_payload[2], oy_data_payload[0], false);
                else {
                    oy_key_verify(oy_data_payload[5], oy_data_payload[4], oy_data_payload[6]+oy_data_payload[2], function(oy_key_valid) {
                        oy_channel_top(oy_data_payload[2], oy_data_payload[0], oy_key_valid);
                    });
                }

                let oy_channel_respond = [];
                for (let oy_broadcast_hash in window.OY_CHANNEL_KEEP[oy_data_payload[2]]) {
                    if (oy_data_payload[3].indexOf(oy_broadcast_hash)===-1) oy_channel_respond.push([oy_broadcast_hash, window.OY_CHANNEL_KEEP[oy_data_payload[2]][oy_broadcast_hash]]);
                }
                if (oy_channel_respond.length===0) {
                    oy_log("No unknown broadcast payloads found for channel "+oy_short(oy_data_payload[2]));
                    return false;
                }
                oy_channel_respond.sort(function(a, b) {
                    return b[1][6] - a[1][6];
                });
                let oy_respond_max = Math.ceil(window.OY_CHANNEL_RESPOND_MAX/Math.max(oy_channel_top_count(oy_data_payload[2])[0], 1));
                while (oy_channel_respond.length>oy_respond_max) oy_channel_respond.pop();
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
        if (oy_data_payload.length!==4||typeof(oy_data_payload[0])!=="object"||typeof(oy_data_payload[1])!=="object"||oy_data_payload[1].length===0||!oy_channel_check(oy_data_payload[2])||oy_data_payload[3].length===0) {
            oy_log("Peer "+oy_short(oy_peer_id)+" sent invalid channel respond sequence, will punish");
            oy_node_punish(oy_peer_id, "OY_PUNISH_RESPOND_INVALID");
            return false;
        }
        if (oy_data_payload[1][0]===window.OY_MAIN['oy_self_short']) {
            oy_log("Channel respond sequence for channel "+oy_short(oy_data_payload[2])+" found self as the final destination");
            if (typeof(window.OY_CHANNEL_TOP[oy_data_payload[2]])==="undefined"||typeof(window.OY_CHANNEL_TOP[oy_data_payload[2]][oy_data_payload[0][0]])==="undefined"||oy_time_local-window.OY_CHANNEL_TOP[oy_data_payload[2]][oy_data_payload[0][0]][1]>window.OY_CHANNEL_RECOVERTIME) {
                oy_log("A local session was not found for respond sequence for channel "+oy_short(oy_data_payload[2]));
                return false;
            }
            else {
                oy_log("Local session found for respond sequence for channel "+oy_short(oy_data_payload[2]));
                oy_channel_top(oy_data_payload[2], oy_data_payload[0], null);

                if (typeof(window.OY_CHANNEL_KEEP[oy_data_payload[2]])==="undefined") window.OY_CHANNEL_KEEP[oy_data_payload[2]] = {};

                for (let i in oy_data_payload[3]) {
                    if (oy_channel_approved(oy_data_payload[2], oy_data_payload[3][i][1][5])&&oy_time_local-oy_data_payload[3][i][1][6]<=window.OY_CHANNEL_EXPIRETIME) {
                        oy_key_verify(oy_data_payload[3][i][1][5], oy_data_payload[3][i][1][4], oy_data_payload[3][i][1][6]+oy_data_payload[3][i][1][3], function(oy_key_valid) {
                            if (oy_key_valid===true) {
                                oy_log("Valid primary signature for broadcast hash "+oy_short(oy_data_payload[3][i][0])+" from channel "+oy_short(oy_data_payload[2]));
                                for (let x in oy_data_payload[3][i][1][7]) {
                                    if (oy_data_payload[3][i][1][7][x][1]!==oy_data_payload[3][i][1][5]&&oy_channel_approved(oy_data_payload[2], oy_data_payload[3][i][1][7][x][1])) {
                                        oy_key_verify(oy_data_payload[3][i][1][7][x][1], oy_data_payload[3][i][1][7][x][0], oy_data_payload[3][i][1][4], function(oy_key_valid) {
                                            if (oy_key_valid===true) {
                                                oy_log("Valid secondary signature for broadcast hash "+oy_short(oy_data_payload[3][i][0])+" from channel "+oy_short(oy_data_payload[2]));
                                                if (typeof(window.OY_CHANNEL_KEEP[oy_data_payload[2]][oy_data_payload[3][i][0]])==="undefined") {
                                                    window.OY_CHANNEL_KEEP[oy_data_payload[2]][oy_data_payload[3][i][0]] = [oy_data_payload[3][i][1][0], oy_data_payload[3][i][1][1], oy_data_payload[3][i][1][2], oy_data_payload[3][i][1][3], oy_data_payload[3][i][1][4], oy_data_payload[3][i][1][5], oy_data_payload[3][i][1][6], [[oy_data_payload[3][i][1][7][x][0], oy_data_payload[3][i][1][7][x][1]]]];
                                                    oy_local_store("oy_channel_keep", window.OY_CHANNEL_KEEP);
                                                }
                                                else if (typeof(window.OY_CHANNEL_KEEP[oy_data_payload[2]][oy_data_payload[3][i][0]][7])!=="undefined") {
                                                    window.OY_CHANNEL_KEEP[oy_data_payload[2]][oy_data_payload[3][i][0]][7].push([oy_data_payload[3][i][1][7][x][0], oy_data_payload[3][i][1][7][x][1]]);
                                                    oy_local_store("oy_channel_keep", window.OY_CHANNEL_KEEP);
                                                }
                                                else oy_log("Could not record channel respond sequence for broadcast hash "+oy_short(oy_data_payload[3][i][0])+" from channel "+oy_short(oy_data_payload[2])+", go tell Bruno", 1);
                                            }
                                            else oy_log("Invalid secondary signature for broadcast hash "+oy_short(oy_data_payload[3][i][0])+" from channel "+oy_short(oy_data_payload[2]));
                                        });
                                    }
                                    else oy_log("Unapproved secondary signature for broadcast hash "+oy_short(oy_data_payload[3][i][0])+" from channel "+oy_short(oy_data_payload[2]));
                                }
                            }
                            else oy_log("Invalid primary signature for broadcast hash "+oy_short(oy_data_payload[3][i][0])+" from channel "+oy_short(oy_data_payload[2]));
                        });
                    }
                    else oy_log("Primary and/or secondary signatures were not found in the approval list of the current block for channel "+oy_short(oy_data_payload[2]));
                }
            }
        }
        else {//carry on reversing the passport until the data reaches the intended destination
            oy_log("Continuing channel respond sequence of channel "+oy_short(oy_data_payload[2]));
            oy_data_route("OY_LOGIC_FOLLOW", "OY_CHANNEL_RESPOND", oy_data_payload);
        }
    }
    else if (oy_data_flag==="OY_PEER_CHALLENGE") {
        if (typeof(window.OY_CHALLENGE[oy_peer_id])!=="undefined") {
            oy_key_verify(oy_peer_id, oy_data_payload, window.OY_MESH_DYNASTY+window.OY_BLOCK_HASH, function(oy_key_valid) {
                if (oy_key_valid===true) delete window.OY_CHALLENGE[oy_peer_id];
            });
        }
    }
    else if (oy_data_flag==="OY_PEER_LATENCY") {
        oy_key_sign(window.OY_MAIN['oy_self_private'], window.OY_MESH_DYNASTY+window.OY_BLOCK_HASH+oy_data_payload[0], function(oy_key_signature) {
            oy_log("Signed peer latency sequence from "+oy_short(oy_peer_id));
            oy_data_payload[0] = oy_key_signature;
            oy_data_beam(oy_peer_id, "OY_LATENCY_RESPONSE", oy_data_payload);
        });
    }
    else if (oy_data_flag==="OY_PEER_TERMINATE") {
        oy_peer_remove(oy_peer_id, "OY_PUNISH_TERMINATE_RETURN");//return the favour
        oy_log("Removed peer "+oy_short(oy_peer_id)+" who terminated with reason: "+oy_data_payload);
        return true;
    }
    else if (oy_data_flag==="OY_PEER_BLACKLIST") {
        oy_peer_remove(oy_peer_id, "OY_PUNISH_BLACKLIST_RETURN");//return the favour
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
    oy_xhttp.send("oy_peer_report="+JSON.stringify([window.OY_MAIN['oy_self_public'], window.OY_PEERS, window.OY_BLACKLIST]));
}

function oy_node_reset(oy_node_id) {
    delete window.OY_CHALLENGE[oy_node_id];
    delete window.OY_LATENCY[oy_node_id];
    delete window.OY_PROPOSED[oy_node_id];
    delete window.OY_PEERS_PRE[oy_node_id];
    delete window.OY_ENGINE[0][oy_node_id];
}

function oy_node_connect(oy_node_id, oy_callback) {
    if (oy_node_id===false||oy_node_id===window.OY_MAIN['oy_self_public']) {
        oy_log("Tried to connect to invalid node ID: "+oy_node_id, 1);//functions need to validate node_id before forwarding here
        return false;
    }
    let oy_time_local = Date.now()/1000;
    if (typeof(window.OY_WARM[oy_node_id])!=="undefined") {
        oy_log("Connection with node "+oy_short(oy_node_id)+" is already warming up");
        return false;
    }
    else if (typeof(window.OY_COLD[oy_node_id])!=="undefined") {
        oy_log("Connection with node "+oy_short(oy_node_id)+" is cold");
        return false;
    }
    else if (typeof(window.OY_NODES[oy_node_id])==="undefined"||window.OY_NODES[oy_node_id][0].open===false) {
        if (typeof(window.OY_NODES[oy_node_id])!=="undefined") window.OY_NODES[oy_node_id][0].close();
        window.OY_WARM[oy_node_id] = oy_time_local;
        oy_log("Connection warming up with node "+oy_short(oy_node_id));
        let oy_local_conn = window.OY_CONN.connect(oy_node_id);

        oy_local_conn.on('open', function() {
            delete window.OY_WARM[oy_node_id];
            window.OY_NODES[oy_node_id] = [oy_local_conn, oy_time_local];
            oy_log("Connection status: "+window.OY_NODES[oy_node_id][0].open+" with node "+oy_short(oy_node_id));
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
    else if (window.OY_NODES[oy_node_id][0].open===true) {
        window.OY_NODES[oy_node_id][1] = oy_time_local;
        if (typeof(oy_callback)==="function") oy_callback();
        return true;
    }
    return false;
}

function oy_node_disconnect(oy_node_id) {
    if (typeof(window.OY_COLD[oy_node_id])==="undefined"&&typeof(window.OY_NODES[oy_node_id])!=="undefined") {
        if (window.OY_NODES[oy_node_id][0].open===true) {
            window.OY_COLD[oy_node_id] = true;
            setTimeout(function() {
                window.OY_NODES[oy_node_id][0].close();
                delete window.OY_COLD[oy_node_id];
                delete window.OY_NODES[oy_node_id];
                oy_log("Disconnected from node "+oy_short(oy_node_id));
            }, window.OY_NODE_DELAYTIME*1000);
        }
        else {
            window.OY_NODES[oy_node_id][0].close();
            delete window.OY_NODES[oy_node_id];
        }
        return true;
    }
    return false;
}

//checks for peering proposal session
function oy_node_proposed(oy_node_id, oy_clone_flag) {
    if (typeof(window.OY_PROPOSED[oy_node_id])!=="undefined") {
        if (window.OY_PROPOSED[oy_node_id][0]<(Date.now()/1000)) {//check if proposal session expired
            delete window.OY_PROPOSED[oy_node_id];
            oy_local_store("oy_proposed", window.OY_PROPOSED);
            return false;
        }
        if (typeof(oy_clone_flag)!=="undefined") return window.OY_PROPOSED[oy_node_id][1]===oy_clone_flag;
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
    if (window.OY_BLACKLIST[oy_node_id][0]>window.OY_NODE_TOLERANCE&&oy_peer_check(oy_node_id)) oy_peer_remove(oy_node_id, oy_punish_reason);
    oy_local_store("oy_blacklist", window.OY_BLACKLIST);
    oy_log("Punished node "+oy_short(oy_node_id)+" with reason "+oy_punish_reason);
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
    else if (window.OY_BLOCK_SEEDTIME!==null&&Date.now()/1000<=window.OY_BLOCK_SEEDTIME) {
        oy_log("Halted initiation for pending meshblock seeding event");
        return false;
    }
    let oy_callback_peer = function() {
        oy_data_beam(oy_node_id, "OY_PEER_REQUEST", null);
        window.OY_PROPOSED[oy_node_id] = [(Date.now()/1000)+window.OY_NODE_PROPOSETIME, false];//set proposal session with expiration timestamp and clone flag
        oy_local_store("oy_proposed", window.OY_PROPOSED);
    };
    let oy_callback_clone = function() {
        oy_data_beam(oy_node_id, "OY_CLONE_REQUEST", null);
        window.OY_PROPOSED[oy_node_id] = [(Date.now()/1000)+window.OY_NODE_PROPOSETIME, true];//set proposal session with expiration timestamp and clone flag
        oy_local_store("oy_proposed", window.OY_PROPOSED);
    };
    oy_node_connect(oy_node_id, (window.OY_BLOCK_HASH===null)?oy_callback_clone:oy_callback_peer);
    return true;
}

//retrieves nodes from and submit self id to top.oyster.org
function oy_node_assign() {
    if (window.OY_BLOCK_SEEDTIME!==null&&Date.now()/1000<=window.OY_BLOCK_SEEDTIME) return false;
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
    oy_xhttp.open("POST", "https://top.oyster.org/oy_node_assign_beta.php", true);
    oy_xhttp.send("oy_node_id="+window.OY_MAIN['oy_self_public']);
}

//respond to a node that is not mutually peered with self
function oy_node_negotiate(oy_node_id, oy_data_flag, oy_data_payload) {
    let oy_time_local = Date.now()/1000;
    if (oy_data_flag==="OY_PEER_TERMINATE") {
        oy_log("Received termination notice with reason: "+oy_data_payload+" from non-peer, most likely we terminated him first");
        oy_node_reset(oy_node_id);
        return false;
    }
    else if (oy_data_flag==="OY_PEER_BLACKLIST") {
        oy_log("Node "+oy_short(oy_node_id)+" blacklisted us, will return the favour");
        oy_node_punish(oy_node_id, "OY_PUNISH_BLACKLIST_RETURN");
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
    else if (oy_data_flag==="OY_PEER_LATENCY"&&(oy_node_proposed(oy_node_id, false)||oy_peer_pre_check(oy_node_id))) {//respond to latency ping from node with peer proposal arrangement
        oy_key_sign(window.OY_MAIN['oy_self_private'], window.OY_MESH_DYNASTY+window.OY_BLOCK_HASH+oy_data_payload[0], function(oy_key_signature) {
            oy_log("Signed peer latency sequence from "+oy_short(oy_node_id));
            oy_data_payload[0] = oy_key_signature;
            oy_data_beam(oy_node_id, "OY_LATENCY_RESPONSE", oy_data_payload);
        });
    }
    else if (oy_data_flag==="OY_PEER_LATENCY") {
        oy_log("Node "+oy_short(oy_node_id)+" sent a latency spark request whilst not a peer, will decline");
        oy_data_beam(oy_node_id, "OY_LATENCY_DECLINE", null);
        return false;
    }
    else if (oy_data_flag==="OY_PEER_REQUEST") {
        let oy_callback_local;
        if (window.OY_BLOCK_HASH===null||(window.OY_BLOCK_SEEDTIME!==null&&oy_time_local<=window.OY_BLOCK_SEEDTIME)) {
            oy_callback_local = function() {
                oy_data_beam(oy_node_id, "OY_PEER_UNREADY", null);
            };
        }
        else {
            oy_callback_local = function() {
                oy_latency_test(oy_node_id, "OY_PEER_REQUEST", true);
            };
        }
        oy_node_connect(oy_node_id, oy_callback_local);
        return true;
    }
    else if (oy_data_flag==="OY_CLONE_REQUEST") {
        let oy_callback_local;
        if ((window.OY_BLOCK_SEEDTIME===null||oy_time_local>window.OY_BLOCK_SEEDTIME)&&window.OY_BLOCK_HASH!==null&&window.OY_CLONE_UPTIME!==null&&window.OY_CLONE_UPTIME>=window.OY_CLONE_UPTIME_MIN&&window.OY_PEER_COUNT>=window.OY_BLOCK_PEERS_MIN) {
            oy_callback_local = function() {
                window.OY_CLONES[oy_node_id] = [oy_time_local+window.OY_CLONE_LIVETIME, 0];
                oy_data_beam(oy_node_id, "OY_CLONE_ACCEPT", null);
            };
        }
        else {
            oy_callback_local = function() {
                oy_data_beam(oy_node_id, "OY_CLONE_UNREADY", null);
            };
        }
        oy_node_connect(oy_node_id, oy_callback_local);
        return true;
    }
    else if (oy_data_flag==="OY_CLONE_AFFIRM") {
        if (typeof(window.OY_CLONES[oy_node_id])!=="undefined"&&oy_time_local<window.OY_CLONES[oy_node_id][0]&&window.OY_CLONES[oy_node_id][1]===0) window.OY_CLONES[oy_node_id][1] = 1;
        return true;
    }
    else if (oy_data_flag==="OY_CLONE_PUSH") {
        if (typeof(window.OY_ORIGINS[oy_node_id])!=="undefined"&&oy_time_local<window.OY_ORIGINS[oy_node_id]&&oy_time_local<window.OY_BLOCK_TIME+window.OY_BLOCK_SECTORS[0][0]) {
            window.OY_CLONE_BUILD[oy_data_payload[1]] = oy_data_payload[2];
            let oy_nonce_count = -1;
            // noinspection JSUnusedLocalSymbols
            for (let oy_clone_nonce in window.OY_CLONE_BUILD) {
                oy_nonce_count++;
            }
            if (oy_nonce_count===oy_data_payload[0]) {
                let oy_block_flat = window.OY_CLONE_BUILD.join("");
                window.OY_BLOCK = JSON.parse(oy_block_flat);
                window.OY_BLOCK_HASH = oy_hash_gen(oy_block_flat);
                oy_data_beam(oy_node_id, "OY_CLONE_HASH", window.OY_BLOCK_HASH);
            }
        }
        return true;
    }
    else if (oy_data_flag==="OY_CLONE_HASH") {
        if (typeof(window.OY_CLONES[oy_node_id])!=="undefined"&&oy_time_local<window.OY_CLONES[oy_node_id][0]&&window.OY_CLONES[oy_node_id][1]===2&&oy_time_local<window.OY_BLOCK_TIME+window.OY_BLOCK_SECTORS[0][0]&&oy_data_payload===window.OY_BLOCK_HASH) window.OY_CLONES[oy_node_id][1] = 3;
        return true;
    }
    else if (oy_data_flag==="OY_LATENCY_DECLINE") {
        oy_log("Node "+oy_short(oy_node_id)+" declined our latency request, will cease and punish");
        oy_node_punish(oy_node_id, "OY_PUNISH_LATENCY_DECLINE");
        return false;
    }
    else if (oy_node_proposed(oy_node_id, false)) {//check if this node was previously proposed to for peering by self
        if (oy_data_flag==="OY_PEER_ACCEPT") {//node has accepted self's peer request
            oy_latency_test(oy_node_id, "OY_PEER_ACCEPT", true);
        }
        else {
            oy_log("Node "+oy_short(oy_node_id)+" rejected peer request ["+oy_data_flag+"] with reason: "+oy_data_payload);
            oy_node_punish(oy_node_id, "OY_PUNISH_PEER_REJECT");//we need to prevent nodes with far distances/long latencies from repeatedly communicating
        }
        return true;
    }
    else if (oy_node_proposed(oy_node_id, true)) {//check if this node was previously proposed to for cloning by self
        if (oy_data_flag==="OY_CLONE_ACCEPT") {//node has accepted self's clone request
            window.OY_ORIGINS[oy_node_id] = oy_time_local+window.OY_CLONE_LIVETIME;
            oy_data_beam(oy_node_id, "OY_CLONE_AFFIRM", null);
        }
        else {
            oy_log("Node "+oy_short(oy_node_id)+" rejected clone request ["+oy_data_flag+"]");
            oy_node_punish(oy_node_id, "OY_PUNISH_CLONE_REJECT");
        }
        return true;
    }
    else {
        oy_log("Node "+oy_short(oy_node_id)+" sent an incoherent message with flag "+oy_data_flag);
        oy_node_punish(oy_node_id, "OY_PUNISH_DATA_INCOHERENT");
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
    oy_key_verify(oy_node_id, oy_data_payload[0], window.OY_MESH_DYNASTY+window.OY_BLOCK_HASH+window.OY_LATENCY[oy_node_id][0], function(oy_key_valid) {
        if (oy_key_valid===false) {
            oy_log("Node "+oy_short(oy_node_id)+" failed to sign latency sequence, will punish");
            oy_node_punish(oy_node_id, "OY_PUNISH_SIGN_FAIL");
            delete window.OY_LATENCY[oy_node_id];
            return false;
        }
        if (window.OY_LATENCY[oy_node_id][0].repeat(window.OY_LATENCY_SIZE)===oy_data_payload[1]) {//check if payload data matches latency session definition
            if (oy_peer_check(oy_node_id)) window.OY_PEERS[oy_node_id][1] = oy_time_local;//update last msg timestamp for peer, no need to update localstorage via oy_local_store() (could be expensive)

            window.OY_LATENCY[oy_node_id][2]++;
            window.OY_LATENCY[oy_node_id][4] += oy_time_local-window.OY_LATENCY[oy_node_id][3];//calculate how long the round trip took, and add it to aggregate time
            if (window.OY_LATENCY[oy_node_id][1]!==window.OY_LATENCY[oy_node_id][2]) {
                oy_log("There was a problem with the latency test with node "+oy_short(oy_node_id)+", perhaps simultaneous instances");
                return false;
            }
            if (window.OY_LATENCY[oy_node_id][2]>=window.OY_LATENCY_REPEAT) {
                let oy_latency_result = window.OY_LATENCY[oy_node_id][4]/window.OY_LATENCY[oy_node_id][2];
                oy_log("Finished latency test ["+window.OY_LATENCY[oy_node_id][5]+"] with node "+oy_short(oy_node_id)+": "+oy_latency_result.toFixed(2)+" seconds");
                if (window.OY_LATENCY[oy_node_id][5]==="OY_PEER_REQUEST"||window.OY_LATENCY[oy_node_id][5]==="OY_PEER_ACCEPT") {
                    //logic for accepting a peer request begins here
                    if (oy_latency_result>window.OY_LATENCY_MAX) {
                        oy_log("Node "+oy_short(oy_node_id)+" has latency that breaches max, will punish");
                        if (window.OY_LATENCY[oy_node_id][5]==="OY_PEER_ACCEPT") oy_data_beam(oy_node_id, "OY_PEER_TERMINATE", "OY_PUNISH_LATENCY_BREACH");
                        else oy_data_beam(oy_node_id, "OY_PEER_REJECT", "OY_PUNISH_LATENCY_BREACH");
                        oy_node_punish(oy_node_id, "OY_PUNISH_LATENCY_BREACH");
                    }
                    else if (window.OY_PEER_COUNT<window.OY_PEER_MAX) {
                        if (window.OY_LATENCY[oy_node_id][5]==="OY_PEER_ACCEPT") {
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
                        oy_log("Current weakest peer is "+oy_short(oy_peer_weak[0])+" with latency of "+oy_peer_weak[1].toFixed(4));
                        if ((oy_latency_result*(1+window.OY_LATENCY_GEO_SENS))<oy_peer_weak[1]) {
                            oy_log("New peer request has better latency than current weakest peer");
                            oy_peer_remove(oy_peer_weak[0], "OY_PUNISH_LATENCY_DROP");
                            if (window.OY_LATENCY[oy_node_id][5]==="OY_PEER_ACCEPT") {
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
                            if (window.OY_LATENCY[oy_node_id][5]==="OY_PEER_ACCEPT") oy_data_beam(oy_node_id, "OY_PEER_TERMINATE", "OY_PUNISH_LATENCY_WEAK");
                            else oy_data_beam(oy_node_id, "OY_PEER_REJECT", "OY_PUNISH_LATENCY_WEAK");
                            oy_node_punish(oy_node_id, "OY_PUNISH_LATENCY_WEAK");
                        }
                    }
                }
                else if (oy_peer_check(oy_node_id)&&window.OY_LATENCY[oy_node_id][5]==="OY_PEER_ROUTINE") {
                    oy_data_beam(oy_node_id, "OY_PEER_AFFIRM", null);
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
        oy_log("New duplicate latency instance with "+oy_short(oy_node_id)+" was blocked");
        return false;
    }
    if (oy_latency_followup!==window.OY_LATENCY[oy_node_id][5]) {
        oy_log("Two simultaneous latency test instances crashed into each other", 1);
        return false;
    }
    //ping a unique payload string that is repeated OY_LATENCY_SIZE amount of times
    window.OY_LATENCY[oy_node_id][0] = oy_rand_gen(window.OY_LATENCY_LENGTH);
    if (oy_data_beam(oy_node_id, "OY_PEER_LATENCY", [window.OY_LATENCY[oy_node_id][0], window.OY_LATENCY[oy_node_id][0].repeat(window.OY_LATENCY_SIZE)])) {
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
//returns false on mesh flow violation/cooling state and true on compliance
function oy_data_measure(oy_data_beam, oy_node_id, oy_data_length) {
    if (!oy_peer_check(oy_node_id)&&oy_node_id!=="oy_aggregate_node") {
        oy_log("Call to data_measure was made with non-existent peer: "+oy_short(oy_node_id));
        return false;
    }
    let oy_time_local = Date.now()/1000;
    let oy_array_select;
    if (oy_data_beam===false) oy_array_select = 8;
    else oy_array_select = 6;
    if (typeof(window.OY_PEERS[oy_node_id][oy_array_select][0])==="undefined"||typeof(window.OY_PEERS[oy_node_id][oy_array_select][0][0])==="undefined") {
        window.OY_PEERS[oy_node_id][oy_array_select-1] = 0;
        window.OY_PEERS[oy_node_id][oy_array_select].push([oy_time_local, oy_data_length]);
        return true;
    }
    while (typeof(window.OY_PEERS[oy_node_id][oy_array_select][0])!=="undefined"&&(oy_time_local-window.OY_PEERS[oy_node_id][oy_array_select][0][0])>window.OY_MESH_MEASURE) window.OY_PEERS[oy_node_id][oy_array_select].shift();
    //do not punish node if there is an insufficient survey to determine accurate mesh flow
    if (window.OY_PEERS[oy_node_id][oy_array_select].length<((oy_data_beam===false)?window.OY_MESH_SOAK_SAMPLE:window.OY_MESH_BEAM_SAMPLE)||window.OY_PEERS[oy_node_id][oy_array_select][0][0]===oy_time_local) {
        window.OY_PEERS[oy_node_id][oy_array_select-1] = 0;
        window.OY_PEERS[oy_node_id][oy_array_select].push([oy_time_local, oy_data_length]);
        return true;
    }
    let oy_measure_total = 0;
    for (let i in window.OY_PEERS[oy_node_id][oy_array_select]) oy_measure_total += window.OY_PEERS[oy_node_id][oy_array_select][i][1];
    //either mesh overflow has occurred (parent function will respond accordingly), or mesh flow is in compliance
    window.OY_PEERS[oy_node_id][oy_array_select-1] = Math.round(oy_measure_total/(oy_time_local-window.OY_PEERS[oy_node_id][oy_array_select][0][0]));
    if (oy_data_beam===false) {
        window.OY_PEERS[oy_node_id][oy_array_select].push([oy_time_local, oy_data_length]);
        return (window.OY_PEERS[oy_node_id][oy_array_select-1]<=(window.OY_MESH_FLOW*window.OY_MESH_SOAK_BUFFER));
    }
    else {
        let oy_return = (Math.random()>window.OY_PEERS[oy_node_id][oy_array_select-1]/(window.OY_MESH_FLOW*window.OY_MESH_BEAM_BUFFER));
        if (oy_return===true) window.OY_PEERS[oy_node_id][oy_array_select].push([oy_time_local, oy_data_length]);
        return oy_return;
    }
}

//pushes data onto the mesh, data_logic indicates strategy for data pushing
function oy_data_push(oy_data_value, oy_data_handle, oy_callback_tally) {
    let oy_data_superhandle = false;
    if (typeof(oy_data_handle)==="undefined"||oy_data_handle===null) {
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
            oy_log("Construct for "+oy_short(oy_data_handle)+" achieved all "+window.OY_DATA_PULL[oy_data_handle][2]+" nonce(s)");
            let oy_data_construct = window.OY_CONSTRUCT[oy_data_handle].join("");
            if (oy_data_handle.substr(6, 40)===oy_hash_gen(oy_data_construct)) {
                delete window.OY_COLLECT[oy_data_handle];
                delete window.OY_CONSTRUCT[oy_data_handle];
                oy_log("Construct for "+oy_short(oy_data_handle)+" cleared hash check");
                window.OY_DATA_PULL[oy_data_handle][0]("OY"+oy_data_handle+window.OY_DATA_PULL[oy_data_handle][2]+((window.OY_DATA_PULL[oy_data_handle][3]===null)?"":"@"+window.OY_DATA_PULL[oy_data_handle][3]), (window.OY_DATA_PULL[oy_data_handle][3]===null)?null:oy_crypt_decrypt(oy_data_construct, window.OY_DATA_PULL[oy_data_handle][3]), oy_data_construct);
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
            oy_log("Cancelled data route for handle "+oy_short(oy_data_payload[1])+" due to push session cancellation");
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
        //oy_data_payload[1] is oy_route_dynamic
        oy_data_payload[0].push(window.OY_MAIN['oy_self_short']);
        for (let oy_peer_select in window.OY_PEERS) {
            if (oy_peer_select==="oy_aggregate_node"||oy_data_payload[0].indexOf(oy_short(oy_peer_select))!==-1) continue;
            oy_log("Routing data via peer "+oy_short(oy_peer_select)+" with flag "+oy_data_flag);
            oy_data_beam(oy_peer_select, oy_data_flag, oy_data_payload);
        }
        if (oy_data_flag==="OY_BLOCK_SYNC"||oy_data_flag==="OY_BLOCK_DIVE") {
            let oy_time_local = Date.now()/1000;
            for (let oy_clone_select in window.OY_CLONES) {
                if (window.OY_CLONES[oy_clone_select][1]===3&&oy_time_local<window.OY_CLONES[oy_clone_select][0]) {
                    oy_log("Routing data via clone "+oy_short(oy_clone_select)+" with flag "+oy_data_flag);
                    oy_data_beam(oy_clone_select, oy_data_flag, oy_data_payload);
                }
            }
        }
    }
    else if (oy_data_logic==="OY_LOGIC_CHALLENGE") {
        //oy_data_payload[0] is oy_route_passport_passive
        //oy_data_payload[1] is oy_route_dynamic
        //oy_data_payload[2] is oy_route_skip
        //oy_data_payload[3] is oy_route_target
        if (oy_data_payload[0].length>oy_data_payload[2].length+window.OY_CHALLENGE_BUFFER) return false;
        oy_data_payload[0].push(window.OY_MAIN['oy_self_short']);
        let oy_peer_final = oy_peer_find(oy_data_payload[3]);
        if (!!oy_peer_final) oy_data_beam(oy_peer_final, oy_data_flag, oy_data_payload);
        else {
            for (let oy_peer_select in window.OY_PEERS) {
                if (oy_peer_select==="oy_aggregate_node"||oy_data_payload[0].indexOf(oy_short(oy_peer_select))!==-1||oy_data_payload[2].indexOf(oy_short(oy_peer_select))!==-1) continue;
                oy_log("Routing data via peer "+oy_short(oy_peer_select)+" with flag "+oy_data_flag);
                oy_data_beam(oy_peer_select, oy_data_flag, oy_data_payload);
            }
        }
    }
    else if (oy_data_logic==="OY_LOGIC_FOLLOW") {
        //oy_data_payload[0] is oy_route_passport_passive
        //oy_data_payload[1] is oy_route_passport_active
        if (oy_data_payload[1].length===0) {
            oy_log("Active passport ran empty on reversal with flag "+oy_data_flag+", will cancel routing");
            return false;
        }
        let oy_peer_final;
        let oy_active_build = [];
        for (let i in oy_data_payload[1]) {
            oy_active_build.push(oy_data_payload[1][i]);
            oy_peer_final = oy_peer_find(oy_data_payload[1][i]);
            if (!!oy_peer_final) break;
        }
        if (oy_peer_final===false||!oy_peer_check(oy_peer_final)) {
            oy_log("Data route couldn't find reversal peer to send to for flag "+oy_data_flag);
            return false;
        }
        oy_data_payload[1] = oy_active_build.slice();
        oy_data_payload[0].push(window.OY_MAIN['oy_self_short']);
        oy_log("Routing data via peer "+oy_short(oy_peer_final)+" with flag "+oy_data_flag);
        oy_data_beam(oy_peer_final, oy_data_flag, oy_data_payload);
    }
    else {
        oy_log("Invalid data_logic provided: "+oy_data_logic+", will cancel");
        return false;
    }
    return true;
}

function oy_data_direct(oy_data_flag) {
    return !(oy_data_flag.indexOf("OY_PEER")===-1&&oy_data_flag.indexOf("OY_LATENCY")===-1&&oy_data_flag.indexOf("OY_CLONE")===-1);
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
        //if (oy_data_direct(oy_data_flag)) console.log("BEAM["+oy_data_flag+"]["+oy_short(oy_node_id)+"]");
        let oy_data_direct_bool = oy_data_direct(oy_data_flag);
        let oy_logic_all_bool = window.OY_LOGIC_ALL_TYPE.indexOf(oy_data_flag)!==-1;
        if (oy_data_raw.length>window.OY_DATA_MAX||
            (oy_logic_all_bool===true&&(
                (oy_data_flag==="OY_CHANNEL_BROADCAST"&&oy_data_raw.length>window.OY_CHANNEL_BROADCAST_PACKET_MAX)||
                (oy_data_flag==="OY_BLOCK_DIVE"&&oy_data_raw.length>window.OY_BLOCK_DIVE_PACKET_MAX)||
                (oy_data_flag!=="OY_CHANNEL_BROADCAST"&&oy_data_flag!=="OY_BLOCK_DIVE"&&oy_data_raw.length>window.OY_LOGIC_ALL_MAX)))) {
            oy_log("Almost sent an excessively sized data sequence for flag "+oy_data_flag+", go tell Bruno", 1);
            return false;
        }
        let oy_data_cool = false;
        if (oy_peer_check(oy_node_id)) oy_data_cool = !oy_data_measure(true, oy_node_id, (oy_logic_all_bool===true)?oy_data_raw.length*window.OY_LOGIC_ALL_MULTI:oy_data_raw.length);
        if (oy_data_cool===true&&oy_data_direct_bool===false&&window.OY_LOGIC_FOLLOW_TYPE.indexOf(oy_data_flag)===-1) {
            oy_log("Cooling off, skipping "+oy_data_flag+" to "+oy_short(oy_node_id));
            return true;
        }
        window.OY_NODES[oy_node_id][0].send(oy_data_raw);//send the JSON-converted data array to the destination node
        //oy_log("Beamed data to node "+oy_short(oy_node_id)+" with size: "+oy_data_raw.length);
    };
    oy_node_connect(oy_node_id, oy_callback_local);
    return true;
}

//incoming data validation
function oy_data_soak(oy_node_id, oy_data_raw) {
   try {
       if (oy_data_raw.length>window.OY_DATA_MAX) {
           oy_log("Node "+oy_short(oy_node_id)+" sent an excessively sized data sequence, will punish and cease session");
           oy_node_punish(oy_node_id, "OY_PUNISH_DATA_LARGE");
           return false;
       }
       let oy_data = JSON.parse(oy_data_raw);
       if (oy_data&&typeof(oy_data)==="object") {
           //if (oy_data_direct(oy_data[0])) console.log("SOAK["+oy_data[0]+"]["+oy_short(oy_node_id)+"]");
           if (!oy_data_direct(oy_data[0])) {
               let oy_peer_last = oy_data[1][0][oy_data[1][0].length-1];
               if (oy_peer_last!==oy_short(oy_node_id)) {
                   oy_log("Peer "+oy_short(oy_node_id)+" lied on the passport, will remove and punish");
                   oy_peer_remove(oy_peer_last, "OY_PUNISH_PASSPORT_MISMATCH");
                   return false;
               }
               else if (oy_data[1][0].indexOf(window.OY_MAIN['oy_self_short'])!==-1) {
                   oy_log("Peer "+oy_short(oy_node_id)+" sent a data sequence we already processed, will remove and punish");
                   oy_peer_remove(oy_node_id, "OY_PUNISH_PASSPORT_ALREADY");
                   return false;
               }
               if (typeof(window.OY_MAP)==="function") window.OY_MAP(oy_data[0], oy_data[1][0], (oy_data[0]==="OY_DATA_DEPOSIT"||oy_data[0]==="OY_DATA_FULFILL")?oy_data[1][1]:null);
               if (typeof(oy_data[1][0])==="object"&&oy_data[1][0].length>1&&!!oy_peer_find(oy_data[1][0][0])) {
                   oy_log("We are peers with the origination node "+oy_data[1][0][0]+", will cease routing");
                   return true;
               }
               if (window.OY_LOGIC_ALL_TYPE.indexOf(oy_data[0])!==-1) {
                   let oy_time_local = Date.now()/1000;
                   if (!oy_peer_check(oy_node_id)&&typeof(window.OY_ORIGINS[oy_node_id])==="undefined") {
                       oy_log("Soaked OY_LOGIC_ALL from a non-peer "+oy_short(oy_node_id)+", will cease");
                       return false;
                   }
                   //TODO convert [9] and [10] from OY_PEERS
                   if ((oy_data[0]==="OY_CHANNEL_BROADCAST"&&oy_data_raw.length>window.OY_CHANNEL_BROADCAST_PACKET_MAX)||
                       (oy_data[0]==="OY_BLOCK_DIVE"&&oy_data_raw.length>window.OY_BLOCK_DIVE_PACKET_MAX)||
                       (oy_data[0]!=="OY_CHANNEL_BROADCAST"&&oy_data[0]!=="OY_BLOCK_DIVE"&&oy_data_raw.length>window.OY_LOGIC_ALL_MAX)) {
                       oy_log("Peer "+oy_short(oy_node_id)+" sent a data sequence that is too large for "+oy_data[0]+", will remove and punish");
                       oy_peer_remove(oy_node_id, "OY_PUNISH_LOGIC_LARGE");
                       return false;
                   }

                   if (window.OY_ROUTE_DYNAMIC.indexOf(oy_data[1][1])!==-1) return true;
                   window.OY_ROUTE_DYNAMIC.push(oy_data[1][1]);
                   while (window.OY_ROUTE_DYNAMIC.length>window.OY_ROUTE_DYNAMIC_KEEP) window.OY_ROUTE_DYNAMIC.shift();

                   if (oy_data[0]==="OY_CHANNEL_BROADCAST"&&oy_data[1][3]!=="OY_CHANNEL_PING"&&oy_data[1][5]!==window.OY_KEY_BRUNO) {
                       if (typeof(window.OY_CHANNEL_DYNAMIC[oy_data[1][5]])!=="undefined"&&oy_time_local-window.OY_CHANNEL_DYNAMIC[oy_data[1][5]]<window.OY_CHANNEL_ALLOWANCE) {
                           oy_log("Peer "+oy_short(oy_node_id)+" sent a channel broadcast from an abusive key, will remove and punish");
                           oy_peer_remove(oy_node_id, "OY_PUNISH_BROADCAST_ABUSE");
                           return false;
                       }
                       window.OY_CHANNEL_DYNAMIC[oy_data[1][5]] = oy_time_local;
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
   return false;
}

//deposits data for local retention
function oy_data_deposit(oy_data_handle, oy_data_nonce, oy_data_value) {
    if (Math.random()>window.OY_MESH_DEPOSIT_CHANCE) return false;

    let oy_deposit_object = {};
    if (window.OY_PURGE.indexOf(oy_data_handle)!==-1) oy_deposit_object = JSON.parse(localStorage.getItem("oy_deposit_"+oy_data_handle));
    if (typeof(oy_deposit_object[oy_data_nonce])!=="undefined") return false;
    oy_deposit_object[oy_data_nonce] = oy_data_value;
    let oy_deposit_full = false;
    try {
        localStorage.setItem("oy_deposit_"+oy_data_handle, JSON.stringify(oy_deposit_object));
    }
    catch(e) {
        oy_deposit_full = true;
        oy_data_deposit_purge();
    }
    if (oy_deposit_full===true) return false;
    oy_deposit_object = null;
    window.OY_PURGE = window.OY_PURGE.filter(oy_handle => oy_handle!==oy_data_handle);
    window.OY_PURGE.push(oy_data_handle);
    oy_local_store("oy_purge", window.OY_PURGE);

    oy_log("Stored handle "+oy_data_handle+" at nonce "+oy_data_nonce);
    return true;
}

function oy_data_deposit_purge() {
    for (let i = 0; i<window.OY_DATA_PURGE;i++) localStorage.removeItem("oy_deposit_"+window.OY_PURGE.shift());
    oy_log("Purged "+window.OY_DATA_PURGE+" handles from deposit");
}

function oy_data_deposit_get(oy_data_handle, oy_data_nonce) {
    if (window.OY_PURGE.indexOf(oy_data_handle)===-1) return false;
    let oy_deposit_object = JSON.parse(localStorage.getItem("oy_deposit_"+oy_data_handle));
    if (typeof(oy_deposit_object[oy_data_nonce])==="undefined") return false;
    return oy_deposit_object[oy_data_nonce];
}

function oy_channel_check(oy_channel_id) {
    return oy_channel_id.length===40;
}

//updates map of channel node topology
function oy_channel_top(oy_channel_id, oy_passport_passive, oy_channel_approved) {
    let oy_time_local = Date.now()/1000|0;

    if (typeof(window.OY_CHANNEL_TOP[oy_channel_id])==="undefined") window.OY_CHANNEL_TOP[oy_channel_id] = {};
    if (typeof(window.OY_CHANNEL_TOP[oy_channel_id][oy_passport_passive[0]])==="undefined") window.OY_CHANNEL_TOP[oy_channel_id][oy_passport_passive[0]] = [oy_time_local, -1, oy_passport_passive, (oy_channel_approved===null)?false:oy_channel_approved];
    else {
        window.OY_CHANNEL_TOP[oy_channel_id][oy_passport_passive[0]][0] = oy_time_local;
        window.OY_CHANNEL_TOP[oy_channel_id][oy_passport_passive[0]][2] = oy_passport_passive;
        if (oy_channel_approved!==null) window.OY_CHANNEL_TOP[oy_channel_id][oy_passport_passive[0]][3] = oy_channel_approved;
    }
}

function oy_channel_top_count(oy_channel_id) {
    let oy_online = 0;
    let oy_watching = 0;
    if (typeof(window.OY_CHANNEL_TOP[oy_channel_id])!=="undefined") {
        for (let oy_node_short in window.OY_CHANNEL_TOP[oy_channel_id]) {
            if (window.OY_CHANNEL_TOP[oy_channel_id][oy_node_short][3]===true) oy_online++;
            else oy_watching++;
        }
    }
    return [oy_online, oy_watching];
}

//checks if the public key is on the admin or approve list in the current block
function oy_channel_approved(oy_channel_id, oy_key_public) {
    //TODO the public key might need to get referenced from the pearl wallet list section of the block, to save block space
    return (typeof(window.OY_BLOCK_TEMP[2][oy_channel_id])!=="undefined"&&(window.OY_BLOCK_TEMP[2][oy_channel_id][2].indexOf(oy_key_public)!==-1||window.OY_BLOCK_TEMP[2][oy_channel_id][3].indexOf(oy_key_public)!==-1));
}

function oy_channel_verify(oy_data_payload, oy_callback) {
    let oy_time_local = Date.now()/1000;
    if (window.OY_BLOCK_TEMP_HASH===null) {
        oy_callback(null);
        return null;
    }
    else if (oy_channel_approved(oy_data_payload[2], oy_data_payload[5])&&oy_data_payload[6]<=oy_time_local+window.OY_MESH_FUTURE&&oy_data_payload[6]>oy_time_local-window.OY_MESH_EDGE) {
        oy_key_verify(oy_data_payload[5], oy_data_payload[4], oy_data_payload[6]+oy_data_payload[3], function(oy_key_valid) {
            oy_callback(oy_key_valid);
        });
        return null;
    }
    oy_callback(false);
    return null;
}

//broadcasts a signed message for a specified channel
function oy_channel_broadcast(oy_channel_id, oy_channel_payload, oy_key_private, oy_key_public, oy_callback_complete, oy_callback_echo) {
    let oy_time_local = Date.now()/1000;
    let oy_channel_base;
    if (oy_channel_payload==="OY_CHANNEL_PING") oy_channel_base = oy_channel_payload;
    else oy_channel_base = oy_base_encode(oy_channel_payload);
    oy_key_sign(oy_key_private, oy_time_local+oy_channel_base, function(oy_payload_crypt) {
        let oy_data_payload = [[], oy_rand_gen(), oy_channel_id, oy_channel_base, oy_payload_crypt, oy_key_public, oy_time_local];
        oy_channel_verify(oy_data_payload, function(oy_verify_pass) {
            if (oy_verify_pass===true) {
                let oy_broadcast_hash = oy_hash_gen(oy_payload_crypt);
                if (typeof(oy_callback_echo)==="function") window.OY_CHANNEL_ECHO[oy_channel_id+oy_data_payload[1]] = [oy_time_local+window.OY_MESH_EDGE, oy_broadcast_hash, oy_callback_echo, []];
                if (typeof(window.OY_CHANNEL_LISTEN[oy_channel_id])!=="undefined"&&window.OY_CHANNEL_LISTEN[oy_channel_id][0]===oy_key_private&&window.OY_CHANNEL_LISTEN[oy_channel_id][1]===oy_key_public) window.OY_CHANNEL_LISTEN[oy_channel_id][3] = oy_time_local;
                oy_data_route("OY_LOGIC_ALL", "OY_CHANNEL_BROADCAST", oy_data_payload);
                let oy_render_payload = oy_data_payload.slice();
                oy_render_payload[3] = oy_channel_payload;
                if (typeof(oy_callback_complete)==="function") oy_callback_complete(oy_broadcast_hash, oy_render_payload);
            }
        });
    });
}

//listens for signed messages on a specified channel
function oy_channel_listen(oy_channel_id, oy_callback, oy_key_private, oy_key_public) {
    if (typeof(oy_key_private)==="undefined"||typeof(oy_key_public)==="undefined") {
        oy_key_private = null;
        oy_key_public = null;
    }
    window.OY_CHANNEL_LISTEN[oy_channel_id] = [oy_key_private, oy_key_public, oy_callback, -1];
}

// noinspection JSUnusedGlobalSymbols
function oy_channel_mute(oy_channel_id) {
    delete window.OY_CHANNEL_LISTEN[oy_channel_id];
    delete window.OY_CHANNEL_KEEP[oy_channel_id];
    delete window.OY_CHANNEL_TOP[oy_channel_id];
    delete window.OY_CHANNEL_RENDER[oy_channel_id];
    oy_local_store("oy_channel_keep", window.OY_CHANNEL_KEEP);
}

function oy_akoya_transfer(oy_key_private, oy_key_public, oy_transfer_amount, oy_receive_public, oy_callback_confirm) {
    oy_transfer_amount = Math.floor(oy_transfer_amount*window.OY_AKOYA_DECIMALS);
    oy_block_command(oy_key_private, ["OY_AKOYA_SEND", -1, oy_key_public, oy_transfer_amount, oy_receive_public], oy_callback_confirm);
}

function oy_block_command(oy_key_private, oy_command_array, oy_callback_confirm) {
    let oy_block_command_execute = function() {
        document.removeEventListener("oy_block_trigger", oy_block_command_execute, false);
        setTimeout(function() {
            oy_command_array[1] = Date.now()/1000;
            let oy_command_flat = JSON.stringify(oy_command_array);
            if (typeof(oy_callback_confirm)!=="undefined") window.OY_BLOCK_CONFIRM[oy_hash_gen(oy_command_flat)] = oy_callback_confirm;
            oy_key_sign(oy_key_private, oy_command_flat, function(oy_command_crypt) {
                oy_block_command_verify([oy_command_array, oy_command_crypt], function(oy_verify_valid) {
                    console.log(oy_verify_valid);
                    if (oy_verify_valid===true) {
                        let oy_command_hash = oy_hash_gen(oy_command_flat);
                        let oy_data_payload = [[], null, oy_command_array, oy_command_crypt];
                        window.OY_BLOCK_COMMAND[oy_command_hash] = oy_data_payload;
                        for (let oy_delay = 0;oy_delay <= 300;oy_delay += 50) {
                            setTimeout(function() {
                                let oy_broadcast_payload = oy_data_payload.slice();
                                oy_broadcast_payload[1] = oy_rand_gen();
                                console.log(oy_broadcast_payload);
                                oy_data_route("OY_LOGIC_ALL", "OY_BLOCK_COMMAND", oy_broadcast_payload);
                            }, oy_delay);
                        }
                    }
                });
            });
        }, window.OY_BLOCK_LAUNCHTIME);
    };
    document.addEventListener("oy_block_trigger", oy_block_command_execute, false);
}

function oy_block_command_verify(oy_command_select, oy_callback) {
    if (typeof(oy_command_select[0][0])==="undefined"||//check that a command was given
        typeof(window.OY_BLOCK_COMMANDS[oy_command_select[0][0]])==="undefined") {//check that the signed command is a recognizable command
        oy_callback(false);
    }
    else {
        oy_key_verify(oy_command_select[0][2], oy_command_select[1], JSON.stringify(oy_command_select[0]), function(oy_key_valid) {
            if (oy_key_valid===true) oy_callback(window.OY_BLOCK_COMMANDS[oy_command_select[0][0]][0](oy_command_select[0]));
            else oy_callback(false);
        });
    }
}

function oy_block_sync_verify(oy_command_inherit, oy_callback) {
    if (oy_command_inherit.length===0) oy_callback(true);
    else oy_block_command_verify(oy_command_inherit.pop(), function(oy_command_valid) {
        if (oy_command_valid===true) oy_block_sync_verify(oy_command_inherit, oy_callback);
        else oy_callback(false);
    });
}

function oy_block_time(oy_next) {
    if (oy_next===true) return (Math.ceil(Date.now()/10000)*10)+10;
    return (Math.floor(Date.now()/10000)*10);
}

function oy_block_loop() {
    let oy_block_time_local = oy_block_time(false);
    setTimeout("oy_block_loop()", window.OY_BLOCK_LOOP);
    if (oy_block_time_local!==window.OY_BLOCK_TIME&&(oy_block_time_local/10)%2===0) {
        window.OY_BLOCK_TIME = oy_block_time_local;
        window.OY_BLOCK_NEXT = oy_block_time(true);
        window.OY_BLOCK_COMMAND = {};

        //BLOCK SEED--------------------------------------------------
        if (window.OY_BLOCK_TIME===window.OY_BLOCK_SEEDTIME) {
            window.OY_BLOCK = [[null, []], {}, {}, {}, {}];

            //SEED DEFINITION------------------------------------
            window.OY_BLOCK[2][window.OY_KEY_BRUNO] = 9000*window.OY_AKOYA_DECIMALS;
            //SEED DEFINITION------------------------------------

            window.OY_BLOCK_HASH = oy_hash_gen(JSON.stringify(window.OY_BLOCK));
        }
        //BLOCK SEED--------------------------------------------------

        let oy_block_challenge = function(oy_block_sign) {
            if (oy_block_sign!==null) {
                for (let oy_peer_select in window.OY_PEERS) {
                    if (oy_peer_select==="oy_aggregate_node") continue;
                    oy_data_beam(oy_peer_select, "OY_PEER_CHALLENGE", oy_block_sign);
                }
            }
        };

        setTimeout(function() {
            window.OY_CLONE_BUILD = [];
            for (let oy_clone_select in window.OY_CLONES) {
                if (window.OY_CLONES[oy_clone_select][1]===0||window.OY_CLONES[oy_clone_select][1]===2||Date.now()/1000>=window.OY_CLONES[oy_clone_select][0]) delete window.OY_CLONES[oy_clone_select];
            }
            if (window.OY_BLOCK_HASH===null) {
                window.OY_CHALLENGE = {};
                console.log("BLOCK SKIP["+(Date.now()/1000)+"]: "+oy_block_time_local);
                return false;
            }

            if (window.OY_BLOCK[0][0]!==null&&window.OY_BLOCK[0][0]!==oy_block_time_local-20) {
                window.OY_BLOCK_HASH = null;
                window.OY_BLOCK_SIGN = null;
                console.log("BLOCK MISSTEP");
                return false;
            }

            if (Math.floor((Date.now()-30000)/10000000)!==Math.floor((Date.now()-10000)/10000000)) {//10000000
                oy_log_debug("SNAPSHOT: "+window.OY_BLOCK_HASH+"/"+JSON.stringify(window.OY_BLOCK));
                window.OY_BLOCK[1] = {};
                window.OY_BLOCK[0][1].push(window.OY_BLOCK_HASH);

                while (window.OY_BLOCK[0][1].length>window.OY_BLOCK_HASH_KEEP) window.OY_BLOCK[0][1].shift();
            }

            oy_block_challenge(window.OY_BLOCK_SIGN);

            for (let oy_peer_select in window.OY_CHALLENGE) {
                oy_peer_remove(oy_peer_select, "OY_PUNISH_BLOCK_HASH");
                delete window.OY_CHALLENGE[oy_peer_select];
                oy_log("Removed and punished peer "+oy_short(oy_peer_select)+" who failed meshblock challenge");
                //oy_log_debug("PUNISH HASH["+window.OY_MAIN['oy_self_short']+"]["+oy_short(oy_peer_select)+"]: "+window.OY_BLOCK_HASH);
            }

            window.OY_BLOCK[0][0] = oy_block_time_local;
            //oy_log_debug("COMMAND KEY: "+JSON.stringify(window.OY_BLOCK_COMMAND_KEY));
            window.OY_BLOCK_COMMAND_KEY = {};
            let oy_sync_command = [];
            let oy_sync_keep = {};
            for (let oy_command_hash in window.OY_BLOCK_COMMAND) {
                oy_sync_command.push([window.OY_BLOCK_COMMAND[oy_command_hash][2], window.OY_BLOCK_COMMAND[oy_command_hash][3]]);//[oy_command_array, oy_command_crypt]
                oy_sync_keep[oy_command_hash] = window.OY_BLOCK_COMMAND[oy_command_hash][2];
            }

            oy_sync_command.sort(function(a, b) {//TODO this might need to be random instead to increase hash diversity/security
                return a[0] - b[0];
            });

            oy_log_debug("COMMAND: "+JSON.stringify(window.OY_BLOCK_COMMAND)+"\nSYNC COMMAND: "+JSON.stringify(oy_sync_command));

            //TODO problem: there is something along the process that can hang which causes the meshblock to be assigned at the wrong time, at the minimum time checks need to be enforced

            window.OY_BLOCK_SYNC = {};
            window.OY_BLOCK_SYNC_HASH = oy_hash_gen(JSON.stringify(oy_sync_command));
            window.OY_BLOCK_SYNC_DYNAMIC = oy_rand_gen();

            let oy_dive_reward = (" "+window.OY_BLOCK_DIVE_REWARD).slice(1);
            if (window.OY_PEER_COUNT>=window.OY_BLOCK_PEERS_MIN) {
                setTimeout(function() {
                    let oy_sync_time = Date.now()/1000;
                    oy_key_sign(window.OY_MAIN['oy_self_private'], oy_sync_time+window.OY_BLOCK_SYNC_HASH+oy_dive_reward, function(oy_sync_crypt) {
                        oy_data_route("OY_LOGIC_ALL", "OY_BLOCK_SYNC", [[], window.OY_BLOCK_SYNC_DYNAMIC, oy_sync_time, oy_sync_crypt, oy_sync_command, window.OY_MAIN['oy_self_public'], oy_dive_reward]);
                        oy_sync_command = null;
                    });
                }, Math.floor(Math.random()*window.OY_BLOCK_SECTORS[1][1]*window.OY_BLOCK_DENSITY));
            }
            setTimeout(function() {
                let oy_command_pool = {};
                let oy_node_consensus = 0;
                //oy_log_debug("SYNC: "+Object.keys(window.OY_BLOCK_SYNC).length);
                for (let oy_key_public in window.OY_BLOCK_SYNC) {
                    if (window.OY_BLOCK_SYNC[oy_key_public][0]===true) {
                        oy_node_consensus++;
                        for (let oy_command_hash in window.OY_BLOCK_SYNC[oy_key_public][3]) {
                            if (typeof(oy_command_pool[oy_command_hash])==="undefined") oy_command_pool[oy_command_hash] = [1, window.OY_BLOCK_SYNC[oy_key_public][3][oy_command_hash]];
                            else oy_command_pool[oy_command_hash][0]++;
                        }
                    }
                }
                for (let oy_command_hash in oy_sync_keep) {
                    if (typeof(oy_command_pool[oy_command_hash])==="undefined") oy_command_pool[oy_command_hash] = [1, oy_sync_keep[oy_command_hash]];
                    else oy_command_pool[oy_command_hash][0]++;
                }
                oy_node_consensus = Math.ceil(oy_node_consensus*window.OY_BLOCK_CONSENSUS);
                //oy_log_debug("SYNC: "+JSON.stringify(window.OY_BLOCK_SYNC)+"\nCOMMAND POOL: "+JSON.stringify(oy_command_pool)+"\nCONSENSUS: "+oy_node_consensus);
                oy_log_debug("COMMAND POOL: "+JSON.stringify(oy_command_pool)+"\nCONSENSUS: "+oy_node_consensus);
                let oy_command_execute = [];
                for (let oy_command_hash in oy_command_pool) {
                    if (oy_command_pool[oy_command_hash][0]>=oy_node_consensus) {
                        oy_command_execute.push([oy_command_hash, oy_command_pool[oy_command_hash][1]]);
                        delete oy_command_pool[oy_command_hash];
                    }
                }
                oy_command_execute.sort(function(a, b) {
                    if (a[1][1]===b[1][1]) {
                        let x = a[0].toLowerCase();
                        let y = b[0].toLowerCase();

                        return x < y ? -1 : x > y ? 1 : 0;
                    }
                    return a[1][1] - b[1][1];
                });
                let oy_dive_pool = [];
                if (oy_dive_reward!=="OY_NULL") oy_dive_pool.push([oy_dive_reward, window.OY_MAIN['oy_self_public']]);
                for (let oy_key_public in window.OY_BLOCK_SYNC) {
                    if (window.OY_BLOCK_SYNC[oy_key_public][2][6]!=="OY_NULL") oy_dive_pool.push([window.OY_BLOCK_SYNC[oy_key_public][2][6], oy_key_public]);//TODO review security
                }
                window.OY_BLOCK_DIVE = {};
                window.OY_BLOCK_DIVE_SET = [];
                if (window.OY_PEER_COUNT>=window.OY_BLOCK_PEERS_MIN) {
                    setTimeout(function () {
                        let oy_dive_time = Date.now()/1000;
                        oy_key_sign(window.OY_MAIN['oy_self_private'], oy_dive_time + oy_hash_gen(JSON.stringify(oy_dive_pool)), function(oy_dive_crypt) {
                            oy_data_route("OY_LOGIC_ALL", "OY_BLOCK_DIVE", [[], oy_rand_gen(), oy_dive_time, oy_dive_crypt, oy_dive_pool, window.OY_MAIN['oy_self_public']]);
                            oy_dive_pool = null;
                        });
                    }, Math.floor(Math.random()*window.OY_BLOCK_SECTORS[0][1]*window.OY_BLOCK_DENSITY));
                }
                setTimeout(function() {
                    oy_node_consensus = Math.ceil(window.OY_BLOCK_DIVE_SET.length*window.OY_BLOCK_CONSENSUS);
                    oy_log_debug("DIVE: "+JSON.stringify(window.OY_BLOCK_DIVE)+"\nCONSENSUS: "+oy_node_consensus);
                    let oy_dive_reward_pool = [];
                    for (let oy_key_dive in window.OY_BLOCK_DIVE) {
                        for (let oy_key_public in window.OY_BLOCK_DIVE[oy_key_dive]) {
                            if (window.OY_BLOCK_DIVE[oy_key_dive][oy_key_public]>=oy_node_consensus) oy_dive_reward_pool.push(oy_key_dive);
                        }
                    }

                    window.OY_BLOCK_DIVE = {};

                    let oy_supply_pre = 0;
                    let oy_dive_bounty = 0;
                    for (let oy_key_public in window.OY_BLOCK[2]) {
                        oy_supply_pre += window.OY_BLOCK[2][oy_key_public];
                        let oy_balance_prev = window.OY_BLOCK[2][oy_key_public];
                        window.OY_BLOCK[2][oy_key_public] -= window.OY_AKOYA_FEE;
                        window.OY_BLOCK[2][oy_key_public] = Math.max(window.OY_BLOCK[2][oy_key_public], 0);
                        oy_dive_bounty += oy_balance_prev - window.OY_BLOCK[2][oy_key_public];
                        if (window.OY_BLOCK[2][oy_key_public]<=0) delete window.OY_BLOCK[2][oy_key_public];
                    }

                    if (oy_dive_reward_pool.length>0) {
                        let oy_dive_share = Math.floor(oy_dive_bounty/oy_dive_reward_pool.length);//TODO verify math to make sure odd balances don't cause a gradual decrease of the entire supply
                        if (oy_dive_share>0) {
                            for (let i in oy_dive_reward_pool) {
                                if (typeof(window.OY_BLOCK[2][oy_dive_reward_pool[i]])==="undefined") window.OY_BLOCK[2][oy_dive_reward_pool[i]] = oy_dive_share;
                                else window.OY_BLOCK[2][oy_dive_reward_pool[i]] += oy_dive_share;
                            }
                        }
                    }

                    oy_log_debug("EXECUTE: "+JSON.stringify(oy_command_execute));

                    //["OY_AKOYA_SEND", -1, oy_key_public, oy_transfer_amount, oy_receive_public]
                    for (let i in oy_command_execute) {
                        if (oy_command_execute[i][1][0]==="OY_AKOYA_SEND"&&typeof(window.OY_BLOCK[2][oy_command_execute[i][1][2]])!=="undefined"&&window.OY_BLOCK[2][oy_command_execute[i][1][2]]>=oy_command_execute[i][1][3]) {
                            if (typeof(window.OY_BLOCK[2][oy_command_execute[i][1][4]])==="undefined") window.OY_BLOCK[2][oy_command_execute[i][1][4]] = 0;
                            let oy_balance_send = window.OY_BLOCK[2][oy_command_execute[i][1][2]];
                            let oy_balance_receive = window.OY_BLOCK[2][oy_command_execute[i][1][4]];
                            window.OY_BLOCK[2][oy_command_execute[i][1][2]] -= oy_command_execute[i][1][3];
                            window.OY_BLOCK[2][oy_command_execute[i][1][4]] += oy_command_execute[i][1][3];
                            if (window.OY_BLOCK[2][oy_command_execute[i][1][2]]+window.OY_BLOCK[2][oy_command_execute[i][1][4]]!==oy_balance_send+oy_balance_receive) {
                                window.OY_BLOCK[2][oy_command_execute[i][1][2]] = oy_balance_send;
                                window.OY_BLOCK[2][oy_command_execute[i][1][4]] = oy_balance_receive;
                            }
                            else {
                                if (window.OY_BLOCK[2][oy_command_execute[i][1][2]]<=0) delete window.OY_BLOCK[2][oy_command_execute[i][1][2]];
                                if (window.OY_BLOCK[2][oy_command_execute[i][1][4]]<=0) delete window.OY_BLOCK[2][oy_command_execute[i][1][4]];
                                window.OY_BLOCK[1][oy_command_execute[i][0]] = oy_command_execute[i][1];
                            }
                        }
                    }

                    let oy_supply_post = 0;
                    for (let oy_key_public in window.OY_BLOCK[2]) {
                        oy_supply_post += window.OY_BLOCK[2][oy_key_public];
                    }
                    if (oy_supply_post>oy_supply_pre||oy_supply_post>window.OY_AKOYA_MAX_SUPPY) {
                        return false;//fallback to previous meshblock and log an error
                    }

                    for (let oy_peer_select in window.OY_PEERS) {
                        if (oy_peer_select==="oy_aggregate_node") continue;
                        window.OY_CHALLENGE[oy_peer_select] = true;
                    }

                    let oy_block_flat = JSON.stringify(window.OY_BLOCK);

                    window.OY_BLOCK_HASH = oy_hash_gen(oy_block_flat);

                    window.OY_CLONE_UPTIME = Date.now()/1000;

                    oy_log("NEW MESHBLOCK HASH "+window.OY_BLOCK_HASH);
                    console.log("NEW MESHBLOCK HASH "+window.OY_BLOCK_HASH);

                    oy_log_debug("HASH: "+window.OY_BLOCK_HASH+"\nBLOCK: "+oy_block_flat);

                    setTimeout(function() {
                        oy_key_sign(window.OY_MAIN['oy_self_private'], window.OY_MESH_DYNASTY+window.OY_BLOCK_HASH, function(oy_key_signature) {
                            window.OY_BLOCK_SIGN = oy_key_signature;
                            oy_block_challenge(window.OY_BLOCK_SIGN);
                        });
                    }, window.OY_BLOCK_CHALLENGETIME);

                    document.dispatchEvent(window.OY_BLOCK_TRIGGER);

                    setTimeout(function() {
                        if (window.OY_BLOCK_HASH!==null&&window.OY_CLONE_UPTIME!==null&&window.OY_CLONE_UPTIME>=window.OY_CLONE_UPTIME_MIN&&window.OY_PEER_COUNT>=window.OY_BLOCK_PEERS_MIN) {
                            if (Object.keys(window.OY_CLONES).length>0) {
                                let oy_block_split = null;
                                let oy_block_nonce_max = -1;
                                for (let oy_clone_select in window.OY_CLONES) {
                                    if (Date.now()/1000>window.OY_CLONES[oy_clone_select][0]||window.OY_CLONES[oy_clone_select][1]!==1) continue;
                                    if (oy_block_split===null) {
                                        oy_block_split = [];
                                        for (let i = 0; i < oy_block_flat.length; i += window.OY_CLONE_CHUNK) {
                                            oy_block_split.push(oy_block_flat.slice(i, i+window.OY_CLONE_CHUNK));
                                            oy_block_nonce_max++;
                                        }
                                    }
                                    for (let oy_clone_nonce in oy_block_split) {
                                        oy_data_beam(oy_clone_select, "OY_CLONE_PUSH", [oy_block_nonce_max, oy_clone_nonce, oy_block_split[oy_clone_nonce]]);
                                    }
                                    window.OY_CLONES[oy_clone_select][1] = 2;
                                }
                            }
                        }
                    }, window.OY_BLOCK_CLONETIME);

                    for (let oy_command_hash in window.OY_BLOCK_CONFIRM) {
                        window.OY_BLOCK_CONFIRM[oy_command_hash](typeof(window.OY_BLOCK[1][oy_command_hash])!=="undefined");
                    }
                    window.OY_BLOCK_CONFIRM = {};
                }, window.OY_BLOCK_SECTORS[0][1]);//seconds 16-20 out of 20
            }, window.OY_BLOCK_SECTORS[1][1]);//seconds 4-16 out of 20
        }, window.OY_BLOCK_SECTORS[0][1]);//seconds 0-4 out of 20

        //----------transitory centralized solution
        let oy_xhttp = new XMLHttpRequest();
        oy_xhttp.onreadystatechange = function() {
            if (this.readyState===4&&this.status===200) {
                window.OY_BLOCK_TEMP = JSON.parse(this.responseText);
                window.OY_BLOCK_TEMP_HASH = oy_hash_gen(JSON.stringify(window.OY_BLOCK_TEMP));//this is what this line will look like in the decentralized version
                //document.dispatchEvent(window.OY_BLOCK_TRIGGER);
            }
        };
        oy_xhttp.open("POST", "https://top.oyster.org/oy_block_update.php", true);
        oy_xhttp.send();
        //----------transitory centralized solution
    }
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
        if (oy_time_diff_last>=window.OY_PEER_KEEPTIME||oy_time_diff_latency>=window.OY_PEER_LATENCYTIME) {
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

    for (let oy_node_select in window.OY_NODES) {
        if (oy_time_local-window.OY_NODES[oy_node_select][1]>window.OY_NODE_EXPIRETIME) {
            oy_node_disconnect(oy_node_select);
            oy_log("Cleaned up expired connection object for node: "+oy_short(oy_node_select));
        }
    }

    for (let oy_node_select in window.OY_WARM) {
        if (oy_time_local-window.OY_WARM[oy_node_select]>window.OY_NODE_DELAYTIME) {
            if (oy_peer_check(oy_node_select)) {
                oy_log("Engine found peer "+oy_short(oy_node_select)+" unable to warm up, will remove and punish");
                oy_peer_remove(oy_node_select, "OY_PUNISH_WARM_LAG");
            }
            else oy_node_punish(oy_node_select, "OY_PUNISH_WARM_LAG");
            delete window.OY_WARM[oy_node_select];
            oy_log("Cleaned up expired warming session for node: "+oy_short(oy_node_select));
        }
    }

    let oy_hash_keep = [];
    for (let oy_channel_id in window.OY_CHANNEL_KEEP) {
        let oy_top_count = oy_channel_top_count(oy_channel_id);
        for (let oy_broadcast_hash in window.OY_CHANNEL_KEEP[oy_channel_id]) {
            if (!oy_channel_approved(oy_channel_id, window.OY_CHANNEL_KEEP[oy_channel_id][oy_broadcast_hash][5])||oy_time_local-window.OY_CHANNEL_KEEP[oy_channel_id][oy_broadcast_hash][6]>window.OY_CHANNEL_EXPIRETIME) {
                delete window.OY_CHANNEL_KEEP[oy_channel_id][oy_broadcast_hash];
                delete window.OY_CHANNEL_RENDER[oy_channel_id][oy_broadcast_hash];
                if (typeof(window.OY_CHANNEL_LISTEN[oy_channel_id])!=="undefined") window.OY_CHANNEL_LISTEN[oy_channel_id][2](oy_broadcast_hash, null);
                oy_local_store("oy_channel_keep", window.OY_CHANNEL_KEEP);
                continue;
            }
            if (typeof(window.OY_CHANNEL_LISTEN[oy_channel_id])!=="undefined"&&window.OY_CHANNEL_KEEP[oy_channel_id][oy_broadcast_hash][7].length>=Math.floor(oy_top_count[0]*0.1)) {
                oy_hash_keep.push(oy_broadcast_hash);
                if (typeof(window.OY_CHANNEL_RENDER[oy_channel_id])==="undefined") window.OY_CHANNEL_RENDER[oy_channel_id] = {};
                if (typeof(window.OY_CHANNEL_RENDER[oy_channel_id][oy_broadcast_hash])==="undefined") {
                    window.OY_CHANNEL_RENDER[oy_channel_id][oy_broadcast_hash] = true;
                    let oy_render_payload = window.OY_CHANNEL_KEEP[oy_channel_id][oy_broadcast_hash].slice();
                    oy_render_payload[3] = oy_base_decode(oy_render_payload[3]);
                    window.OY_CHANNEL_LISTEN[oy_channel_id][2](oy_broadcast_hash, oy_render_payload);
                }
            }
        }
    }

    for (let oy_channel_id in window.OY_CHANNEL_TOP) {
        if (typeof(window.OY_CHANNEL_LISTEN[oy_channel_id])==="undefined") continue;
        let oy_recover_beam = function(oy_challenge_crypt, oy_key_public) {
            for (let oy_node_select in window.OY_CHANNEL_TOP[oy_channel_id]) {
                if (oy_time_local-window.OY_CHANNEL_TOP[oy_channel_id][oy_node_select][0]>window.OY_CHANNEL_FORGETIME) delete window.OY_CHANNEL_TOP[oy_channel_id][oy_node_select];
                else if (oy_time_local-window.OY_CHANNEL_TOP[oy_channel_id][oy_node_select][1]>window.OY_CHANNEL_RECOVERTIME) {
                    window.OY_CHANNEL_TOP[oy_channel_id][oy_node_select][1] = oy_time_local;
                    oy_data_route("OY_LOGIC_FOLLOW", "OY_CHANNEL_RECOVER", [[], window.OY_CHANNEL_TOP[oy_channel_id][oy_node_select][2], oy_channel_id, oy_hash_keep, oy_challenge_crypt, oy_key_public, oy_time_local])
                }
            }
        };
        if (window.OY_CHANNEL_LISTEN[oy_channel_id][0]===null) oy_recover_beam(null, null);
        else oy_key_sign(window.OY_CHANNEL_LISTEN[oy_channel_id][0], oy_time_local+oy_channel_id, function(oy_challenge_crypt) {
            oy_recover_beam(oy_challenge_crypt, window.OY_CHANNEL_LISTEN[oy_channel_id][1]);
        });
    }

    for (let oy_channel_id in window.OY_CHANNEL_LISTEN) {
        if (window.OY_CHANNEL_LISTEN[oy_channel_id][0]!==null&&oy_time_local-window.OY_CHANNEL_LISTEN[oy_channel_id][3]>window.OY_CHANNEL_KEEPTIME) oy_channel_broadcast(oy_channel_id, "OY_CHANNEL_PING", window.OY_CHANNEL_LISTEN[oy_channel_id][0], window.OY_CHANNEL_LISTEN[oy_channel_id][1], function(){}, function(){});
    }

    for (let oy_echo_key in window.OY_CHANNEL_ECHO) {
        if (window.OY_CHANNEL_ECHO[oy_echo_key][0]<oy_time_local) {
            delete window.OY_CHANNEL_ECHO[oy_echo_key];
            oy_log("Cleaned up expired echo session with key: "+oy_short(oy_echo_key));
        }
    }

    for (let oy_key_public in window.OY_CHANNEL_DYNAMIC) {
        if (oy_time_local-window.OY_CHANNEL_DYNAMIC[oy_key_public]>window.OY_CHANNEL_ALLOWANCE) {
            delete window.OY_CHANNEL_ALLOWANCE[oy_key_public];
            oy_log("Cleaned up expired channel allowance for public key: "+oy_short(oy_key_public));
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
        if (window.OY_PROPOSED[oy_node_select][0]<oy_time_local) {
            delete window.OY_PROPOSED[oy_node_select];
            oy_log("Cleaned up expired proposal session for node: "+oy_short(oy_node_select));
        }
    }

    for (let oy_node_select in window.OY_BLACKLIST) {
        if (window.OY_BLACKLIST[oy_node_select][1]<oy_time_local) {
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
    //localStorage.clear();
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
                window.OY_MAIN['oy_self_short'] = oy_short(window.OY_MAIN['oy_self_public']);
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

    window.OY_BLOCK_SEEDTIME = 1552836900;

    window.OY_PURGE = oy_local_get("oy_purge");
    //window.OY_PEERS = oy_local_get("oy_peers");
    window.OY_PROPOSED = oy_local_get("oy_proposed");
    window.OY_BLACKLIST = oy_local_get("oy_blacklist");
    window.OY_CHANNEL_KEEP = oy_local_get("oy_channel_keep");

    window.OY_CONN = new Peer(window.OY_MAIN['oy_self_public'], {host: 'top.oyster.org', port: 8200, path: '/', secure:true});

    window.OY_CONN.on('open', function(oy_self_id) {
        window.OY_MAIN['oy_ready'] = true;
        oy_log("P2P connection ready with self ID "+oy_short(oy_self_id));
        setTimeout(function() {
            let oy_time_local = Date.now()/1000;
            let oy_peer_local;
            for (oy_peer_local in window.OY_PEERS) {
                if (oy_peer_local==="oy_aggregate_node") continue;
                if (oy_time_local-window.OY_PEERS[oy_peer_local][1]>=window.OY_PEER_KEEPTIME) {
                    delete window.OY_PEERS[oy_peer_local];
                    continue;
                }
                oy_log("Recovering peer "+oy_short(oy_peer_local));
                window.OY_PEER_COUNT++;
                oy_node_connect(oy_peer_local);
            }
            oy_local_store("oy_main", window.OY_MAIN);
            if (typeof(oy_callback)==="function") oy_callback();
        }, 200);
    }, null);

    window.OY_CONN.on('connection', function(oy_conn) {
        // Receive messages
        oy_conn.on('data', function(oy_data_raw) {
            //oy_log("Data with size "+oy_data_raw.length+" received from node "+oy_short(oy_conn.peer));
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
                if (oy_data_measure(false, oy_conn.peer, (window.OY_LOGIC_ALL_TYPE.indexOf(oy_data[0])!==-1)?oy_data_raw.length*window.OY_LOGIC_ALL_MULTI:oy_data_raw.length)===false) {
                    oy_log("Peer "+oy_short(oy_conn.peer)+" exceeded mesh flow compliance limits, will punish");
                    oy_node_punish(oy_conn.peer, "OY_PUNISH_MESH_FLOW");
                }
                oy_peer_process(oy_conn.peer, oy_data[0], oy_data[1]);
            }
            else if ((oy_data[0]==="OY_BLOCK_SYNC"||oy_data[0]==="OY_BLOCK_DIVE")&&(typeof(window.OY_ORIGINS[oy_conn.peer])!=="undefined"&&Date.now()/1000<window.OY_ORIGINS[oy_conn.peer])) {
                oy_peer_process(oy_conn.peer, oy_data[0], oy_data[1]);
            }
            else if (oy_node_blocked(oy_conn.peer)) {
                oy_log("Node "+oy_short(oy_conn.peer)+" is on blacklist, informed: "+window.OY_BLACKLIST[oy_conn.peer][2]);
                if (window.OY_BLACKLIST[oy_conn.peer][2]===false) {
                    window.OY_BLACKLIST[oy_conn.peer][2] = true;
                    oy_data_beam(oy_conn.peer, "OY_PEER_BLACKLIST", null);
                }
            }
            else {
                oy_log("Node "+oy_short(oy_conn.peer)+" is either unknown or was recently proposed to for peering");
                if (oy_data_measure(false, "oy_aggregate_node", oy_data_raw.length)===false) oy_log("Node "+oy_short(oy_conn.peer)+" pushed aggregate mesh flow compliance beyond limit");
                else oy_node_negotiate(oy_conn.peer, oy_data[0], oy_data[1]);
            }
        });
    }, null);

    window.OY_CONN.on('error', function(oy_error) {
        oy_log("PeerJS Error: "+oy_error.type);
    }, null);

    setTimeout(function() {
        if (window.OY_MAIN['oy_ready']===true) {
            oy_log("Connection is now ready, sparking engine");
            setTimeout("oy_engine()", 200);
            setTimeout("oy_block_loop()", 1);
        }
        else {
            oy_log("Connection was not established before cutoff, re-sparking INIT");
            window.OY_INIT = 0;
            oy_init(oy_callback);
        }
    }, window.OY_READY_RETRY);
}