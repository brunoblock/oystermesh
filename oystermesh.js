// OYSTER MESH
// Bruno Block
// v0.6
// License: GNU GPLv3

// GLOBAL VARS
const OY_MESH_DYNASTY = "BRUNO_GENESIS_V6";//mesh dynasty definition, changing this will cause a hard-fork
const OY_MESH_EXPAND = 2;
const OY_MESH_BUFFER = [0.2, 200];//seconds and ms buffer a block command's timestamp is allowed to be in the future, this variable exists to deal with slight mis-calibrations between node clocks
const OY_MESH_FLOW = 256000;//characters per second allowed per peer, and for all aggregate non-peer nodes
const OY_MESH_HOP_MAX = 200;//maximum hops allowed on a transmission passport
const OY_MESH_MEASURE = 10;//seconds by which to measure mesh flow, larger means more tracking of nearby node and peer activity
const OY_MESH_BEAM_SAMPLE = 3;//time/data measurements to determine mesh beam flow required to state a result, too low can lead to volatile and inaccurate readings
const OY_MESH_BEAM_COOL = 2.5;//cool factor for beaming, higher is less beam intensity
const OY_MESH_BEAM_MIN = 0.5;//minimum beam ratio to start returning false
const OY_MESH_SOAK_SAMPLE = 5;//time/data measurements to determine mesh soak flow required to state a result, too low can lead to volatile and inaccurate readings
const OY_MESH_SOAK_BUFFER = 1.2;//multiplication factor for mesh inflow/soak buffer, to give some leeway to compliant peers
const OY_MESH_PUSH_CHANCE = 0.9;//probability that self will forward a data_push when the nonce was not previously stored on self
const OY_MESH_DEPOSIT_CHANCE = 0.5;//probability that self will deposit pushed data
const OY_MESH_FULLFILL_CHANCE = 0.2;//probability that data is stored whilst fulfilling a pull request, this makes data intelligently migrate and recommit overtime
const OY_MESH_SOURCE = 3;//node in route passport (from destination) that is assigned with defining the source variable
const OY_BLOCK_LOOP = 100;//a lower value means increased accuracy for detecting the start of the next meshblock
const OY_BLOCK_STABILITY_TRIGGER = 3;//mesh range history minimum to trigger reliance on real stability value
const OY_BLOCK_STABILITY_LIMIT = 12;//mesh range history to keep to calculate meshblock stability, time is effectively value x 20 seconds
const OY_BLOCK_SNAPSHOT_KEEP = 240;//how many hashes of previous blocks to keep in the current meshblock, value is for 1 month's worth (3 hrs x 8 = 24 hrs x 30 = 30 days, 8 x 30 = 240)
const OY_BLOCK_SYNC_PEERS = 2;//minimum full peer count to submit your own SYNC broadcast, value should only be 2
const OY_BLOCK_JUDGE_BUFFER = 3;
const OY_BLOCK_HALT_BUFFER = 5;//seconds between permitted block_reset() calls. Higher means less chance duplicate block_reset() instances will clash
const OY_BLOCK_RANGE_MIN = 3;//minimum syncs/dives required to not locally reset the meshblock, higher means side meshes die easier
const OY_BLOCK_BOOT_BUFFER = 240;//120seconds grace period to ignore certain cloning/peering rules to bootstrap the network during a boot-up event
const OY_BLOCK_BOOTTIME = 1581299300;//timestamp to boot the mesh, node remains offline before this timestamp
const OY_BLOCK_SECTORS = [[10, 10000], [18, 18000], [19, 19000]];//timing definitions for the meshblock
const OY_BLOCK_BUFFER_SPACE = 3000;//lower value means full node is eventually more profitable (makes it harder for edge nodes to dive), higher means better connection stability/reliability for self
const OY_BLOCK_BUFFER_MIN = 800;
const OY_WORK_MAX = 10000000;
const OY_WORK_MIN = 200;
const OY_WORK_INCREMENT = 10;
const OY_WORK_DECREMENT = 1;
const OY_AKOYA_DECIMALS = 100000000;//zeros after the decimal point for akoya currency
const OY_AKOYA_LIQUID = 10000000*OY_AKOYA_DECIMALS;//akoya liquidity restrictions to prevent integer overflow
const OY_AKOYA_FEE = 0.000001*OY_AKOYA_DECIMALS;//akoya fee per block
const OY_AKOYA_ISSUANCE = OY_AKOYA_DECIMALS;//akoya issuance to divers per block in aggregate
const OY_DNS_AUCTION_DURATION = 259200;//seconds of auction duration since latest valid bid - 3 days worth
const OY_DNS_OWNER_DURATION = 2592000;//seconds worth of ownership solvency required to bid - 30 days worth
const OY_DNS_NAME_LIMIT = 32;//max length of a mesh domain name - must be shorter than akoya public_key length for security reasons
const OY_DNS_NAV_LIMIT = 1024;//max size of nav_limit
const OY_DNS_FEE = 0.00001*OY_AKOYA_DECIMALS;//dns fee per block per 99 characters - 99 used instead of 100 for space savings on the meshblock
const OY_META_DATA_LIMIT = 131072;//max size of meta_data
const OY_META_DAPP_RANGE = 9;//max amount of meshblock amendable dapps including 0
const OY_META_FEE = 0.0001*OY_AKOYA_DECIMALS;//meta fee per block per 99 characters - 99 used instead of 100 for space savings on the meshblock
const OY_NULLING_BUFFER = 0.001*OY_AKOYA_DECIMALS;
const OY_NODE_BLACKTIME = 40;//seconds to blacklist a punished node for
const OY_NODE_PROPOSETIME = 12;//seconds for peer proposal session duration
const OY_NODE_ASSIGNTTIME = 4;//minimum interval between node_assign instances to/from top
const OY_NODE_ASSIGN_DELAY = 500;//ms delay per node_initiate from node_assign
const OY_NODE_DELAYTIME = 6;//minimum expected time to connect or transmit data to a node
const OY_NODE_EXPIRETIME = 600;//seconds of non-interaction until a node's connection session is deleted
const OY_BOOST_KEEP = 12;//node IDs to retain in boost memory, higher means more nodes retained but less average node quality
const OY_BOOST_DELAY = 250;//ms delay per boost node initiation
const OY_BOOST_EXPIRETIME = 600;//seconds until boost indexedDB retention is discarded
const OY_LIGHT_CHUNK = 52000;//chunk size by which the meshblock is split up and sent per light transmission
const OY_LIGHT_COMMIT = 0.25;
const OY_PEER_LATENCYTIME = 60;//peers are expected to establish latency timing with each other within this interval in seconds
const OY_PEER_KEEPTIME = 20;//peers are expected to communicate with each other within this interval in seconds
const OY_PEER_REPORTTIME = 10;//interval to report peer list to top
const OY_PEER_PRETIME = 20;//seconds which a node is waiting as a 'pre-peer'
const OY_PEER_MAX = 5;//maximum mutual peers
const OY_PEER_FULL_MIN = 3;
const OY_WORKER_CORES_FALLBACK = 4;
const OY_ROUTE_DYNAMIC_KEEP = 200;//how many dynamic identifiers for a routed data sequence to remember and block
const OY_LATENCY_SIZE = 80;//size of latency ping payload, larger is more accurate yet more taxing, vice-versa applies
const OY_LATENCY_LENGTH = 8;//length of rand sequence which is repeated for payload and signed for ID verification
const OY_LATENCY_REPEAT = 2;//how many ping round trips should be performed to conclude the latency test
const OY_LATENCY_MAX = 20;//max amount of seconds for latency test before peership is refused or starts breaking down
const OY_LATENCY_TRACK = 200;//how many latency measurements to keep at a time per peer
const OY_LATENCY_GEO_SENS = 32;//percentage buffer for comparing latency with peers, higher means less likely weakest peer will get dropped and mesh is less geo-sensitive
const OY_DATA_MAX = 64000;//max size of data that can be sent to another node
const OY_DATA_CHUNK = 48000;//chunk size by which data is split up and sent per transmission
const OY_DATA_PURGE = 10;//how many handles to delete if indexedDB limit is reached
const OY_DATA_PUSH_INTERVAL = 200;//ms per chunk per push loop iteration
const OY_DATA_PUSH_NONCE_MAX = 16;//maximum amount of nonces to push per push loop iteration
const OY_DATA_PULL_INTERVAL = 800;//ms per pull loop iteration
const OY_DATA_PULL_NONCE_MAX = 3;//maximum amount of nonces to request per pull beam, if too high fulfill will overrun soak limits and cause time/resource waste
const OY_ENGINE_INTERVAL = 2000;//ms interval for core mesh engine to run, the time must clear a reasonable latency round-about
const OY_CHRONO_ACCURACY = 10;//ms accuracy for chrono function, lower means more accurate meshblock timing yet more CPU usage
const OY_READY_RETRY = 2000;//ms interval to retry connection if READY is still false
const OY_CHANNEL_BROADCAST_PACKET_MAX = 3000;//maximum size for a packet that is routed via OY_CHANNEL_BROADCAST (OY_LOGIC_ALL)
const OY_CHANNEL_KEEPTIME = 10;//channel bearing nodes are expected to broadcast a logic_all packet within this interval
const OY_CHANNEL_FORGETIME = 25;//seconds since last signed message from channel bearing node
const OY_CHANNEL_RECOVERTIME = 6;//second interval between channel recovery requests per node, should be at least MESH_EDGE*2
const OY_CHANNEL_EXPIRETIME = 2592000;//seconds until a broadcast expires and is dropped from nodes listening on the channel
const OY_CHANNEL_RESPOND_MAX = 6;//max amount of broadcast payloads to send in response to a channel recover request
const OY_CHANNEL_ALLOWANCE = 58;//broadcast allowance in seconds per public key, an anti-spam mechanism to prevent spamming chat forums with garbage text
const OY_CHANNEL_CONSENSUS = 0.5;//node signature requirement for a broadcast to be retained in channel_keep
const OY_CHANNEL_TOP_TOLERANCE = 2;//node count difference allowed between broadcast claim and perceived claim
const OY_KEY_BRUNO = "JSJqmlzAxwuINY2FCpWPJYvKIK1AjavBgkIwIm139k4M";//prevent impersonation (custom avatar), achieve AKY coin-lock. This is the testnet wallet, will change for mainnet
const OY_SHORT_LENGTH = 6;//various data value such as nonce IDs, data handles, data values are shortened for efficiency

// PRE-CALCULATED VARS
const OY_DNS_AUCTION_MIN = (OY_AKOYA_FEE+OY_DNS_FEE)*(OY_DNS_AUCTION_DURATION/20);
const OY_DNS_OWNER_MIN = (OY_AKOYA_FEE+OY_DNS_FEE)*OY_DNS_AUCTION_MIN+(OY_AKOYA_FEE*(OY_DNS_OWNER_DURATION/20));
//const OY_META_OWNER_MIN

// TEMPLATE VARS
//peer tracking
const OY_PEERS_TEMPLATE = Object.freeze({"oy_aggregate_node":[-1, -1, -1, 0, [], 0, [], 0, [], null, false]});
let OY_PEERS = oy_clone_object(OY_PEERS_TEMPLATE);
//the current meshblock - [[0]:[oy_mesh_dynasty, oy_block_timestamp, oy_mesh_range, oy_work_difficulty], [1]:oy_dive_sector, [2]:oy_snapshot_sector, [3]:oy_command_sector, [4]:oy_akoya_sector, [5]:oy_dns_sector, [6]:oy_auction_sector, [7]:oy_meta_sector]
const OY_BLOCK_TEMPLATE = Object.freeze([[null, null, null, null, null], {}, [], {}, {}, {}, {}, {}, {}, {}]);//TODO figure out channel sector
let OY_BLOCK = oy_clone_object(OY_BLOCK_TEMPLATE);

// SECURITY CHECK FUNCTIONS
const OY_BLOCK_COMMANDS = {
    //["OY_AKOYA_SEND", oy_protocol_assign, oy_key_public, oy_transfer_amount, oy_receive_public]
    "OY_AKOYA_SEND":[function(oy_command_array) {
        return (oy_command_array.length===5&&//check the element count in the command
            oy_command_array[3]>0&&//check that the sending amount is greater than zero
            oy_command_array[3]<OY_AKOYA_LIQUID&&//check that the sending amount smaller than the max supply
            typeof(OY_BLOCK[4][oy_command_array[2]])!=="undefined"&&//check that the sending wallet exists
            oy_key_check(oy_command_array[4])&&//check that the receiving address is a valid address
            OY_BLOCK[4][oy_command_array[2]]>=oy_command_array[3]&&//check that the sending wallet has sufficient akoya
            oy_command_array[2]!==oy_command_array[4]);//check that the sender and the receiver are different
    }],
    //["OY_AKOYA_SINK", oy_protocol_assign, oy_key_public, oy_sink_amount]
    "OY_AKOYA_SINK":[function(oy_command_array) {
        return (oy_command_array.length===4);//check the element count in the command
    }],
    //["OY_AKOYA_BURN", oy_protocol_assign, oy_key_public, oy_burn_amount]
    "OY_AKOYA_BURN":[function(oy_command_array) {
        return (oy_command_array.length===4);//check the element count in the command
        //TODO
    }],
    //["OY_DNS_MODIFY", oy_protocol_assign, oy_key_public, oy_dns_name, oy_nav_data]
    "OY_DNS_MODIFY":[function(oy_command_array) {
        return (oy_command_array.length===5&&//check the element count in the command
            oy_command_array[3].length<=OY_DNS_NAME_LIMIT&&//check that the domain name's length is compliant
            oy_an_check(oy_command_array[3])&&//check that the domain name is fully alphanumeric
            typeof(OY_BLOCK[5][oy_command_array[3]])!=="undefined"&&//check that oy_dns_name exists in the dns_sector of the meshblock
            OY_BLOCK[5][oy_command_array[3]][0]===oy_command_array[2]&&//check that oy_key_public owns oy_dns_name
            typeof(oy_command_array[4])==="object"&&//check that oy_nav_set is an object
            oy_command_array[4]!==null);//further ensure that oy_nav_data is an object
    }],
    //["OY_DNS_BID", oy_protocol_assign, oy_key_public, oy_dns_name, oy_bid_amount]
    "OY_DNS_BID":[function(oy_command_array) {
        return (oy_command_array.length===5&&//check the element count in the command
            oy_command_array[3].length<=OY_DNS_NAME_LIMIT&&//check that the domain name's length is compliant
            oy_an_check(oy_command_array[3])&&//check that the domain name is fully alphanumeric
            oy_command_array[4]>=OY_DNS_AUCTION_MIN&&//check that the bid amount is at least the minimum required amount
            typeof(OY_BLOCK[4][oy_command_array[2]])!=="undefined"&&//check that the sending wallet exists
            OY_BLOCK[4][oy_command_array[2]]>=oy_command_array[4]+OY_DNS_OWNER_MIN&&//check that the sending wallet has sufficient akoya for the bid
            (typeof(OY_BLOCK[5][oy_command_array[3]])==="undefined"||OY_BLOCK[5][oy_command_array[3]][0]==="A")&&//check that oy_dns_name doesn't exist as a domain, or is in auction mode
            (typeof(OY_BLOCK[5][oy_command_array[3]])==="undefined"||oy_command_array[4]>=OY_BLOCK[6][oy_command_array[3]][1]*2));//check that oy_dns_name doesn't exist as a domain, or the bid amount is at least double the previous bid
    }],
    //["OY_DNS_TRANSFER", oy_protocol_assign, oy_key_public, oy_dns_name, oy_receive_public]
    "OY_DNS_TRANSFER":[function(oy_command_array) {
        return (oy_command_array.length===5&&//check the element count in the command
            oy_command_array[3].length<=OY_DNS_NAME_LIMIT&&//check that the domain name's length is compliant
            oy_an_check(oy_command_array[3])&&//check that the domain name is fully alphanumeric
            typeof(OY_BLOCK[5][oy_command_array[3]])!=="undefined"&&//check that oy_dns_name exists in the dns_sector of the meshblock
            OY_BLOCK[5][oy_command_array[3]][0]===oy_command_array[2]&&//check that oy_key_public owns oy_dns_name
            typeof(OY_BLOCK[4][oy_command_array[4]])!=="undefined");//check that oy_receive_public has a positive balance in the akoya ledger
    }],
    //["OY_DNS_RELEASE", oy_protocol_assign, oy_key_public, oy_dns_name]
    "OY_DNS_RELEASE":[function(oy_command_array) {
        return (oy_command_array.length===4&&//check the element count in the command
            oy_command_array[3].length<=OY_DNS_NAME_LIMIT&&//check that the domain name's length is compliant
            oy_an_check(oy_command_array[3])&&//check that the domain name is fully alphanumeric
            typeof(OY_BLOCK[5][oy_command_array[3]])!=="undefined"&&//check that oy_dns_name exists in the dns_sector of the meshblock
            OY_BLOCK[5][oy_command_array[3]][0]===oy_command_array[2]);//check that oy_key_public owns oy_dns_name
    }],
    //["OY_DNS_NULLING", oy_protocol_assign, oy_key_public, oy_dns_name, oy_nulling_amount]
    "OY_DNS_NULLING":[function(oy_command_array) {
        return (oy_command_array.length===5&&//check the element count in the command
            oy_command_array[3].length<=OY_DNS_NAME_LIMIT&&//check that the domain name's length is compliant
            oy_an_check(oy_command_array[3])&&//check that the domain name is fully alphanumeric
            typeof(OY_BLOCK[5][oy_command_array[3]])!=="undefined"&&//check that oy_dns_name exists in the dns_sector of the meshblock
            OY_BLOCK[5][oy_command_array[3]][0]===oy_command_array[2]&&//check that oy_key_public owns oy_dns_name
            oy_command_array[4]>=OY_DNS_OWNER_MIN&&//check that the nulling amount complies with DNS_OWNER_MIN funding requirement
            typeof(OY_BLOCK[4][oy_command_array[2]])!=="undefined"&&//check that oy_key_public has a positive balance in the akoya ledger
            OY_BLOCK[4][oy_command_array[2]]>=oy_command_array[4]+OY_NULLING_BUFFER);//check that oy_key_public has sufficient akoya to execute the nulling event
    }],
    //["OY_META_SET", oy_protocol_assign, oy_key_public, oy_entropy_id, oy_meta_dapp, oy_meta_data]
    "OY_META_SET":[function(oy_command_array) {
        return (oy_command_array.length===6&&
            (oy_command_array[3]===""||oy_hash_check(oy_command_array[3]))&&//check that the input for oy_entropy_id is valid
            parseInt(oy_command_array[4])===oy_command_array[4]&&
            oy_command_array[4]>=0&&
            oy_command_array[4]<=OY_META_DAPP_RANGE);
    }],
    //["OY_META_REVOKE", oy_protocol_assign, oy_key_public, oy_entropy_id]
    "OY_META_REVOKE":[function(oy_command_array) {
        if (oy_command_array.length===4) return true;//check the element count in the command
        return false;
        //TODO
    }],
    //["OY_META_NULLING", oy_protocol_assign, oy_key_public, oy_entropy_id, oy_nulling_amount]
    "OY_META_NULLING":[function(oy_command_array) {
        if (oy_command_array.length===5) return true;//check the element count in the command
        return false;
        //TODO
    }]
};
const OY_BLOCK_TRANSACTS = {
    "OY_HIVEMIND_CLUSTER":[function(oy_command_array) {
        let oy_hold_check = function([oy_hold_hash, oy_hold_expire]) {
            return (oy_hash_check(oy_hold_hash)&&typeof(OY_BLOCK[7][oy_hold_hash])!=="undefined"&&Number.isInteger(oy_hold_expire)&&oy_hold_expire<=OY_BLOCK_TIME+(oy_command_array[5][0][4]*3600)+20);
        };
        return (oy_command_array[5].length===2&&//verify dual sectors of oy_meta_data
            Number.isInteger(oy_command_array[5][0][1])&&//check author_rights is an integer
            Number.isInteger(oy_command_array[5][0][2])&&//check submission_price is an integer
            Number.isInteger(oy_command_array[5][0][3])&&//check vote_limit is an integer
            Number.isInteger(oy_command_array[5][0][4])&&//check post_expiration_quota is an integer, represents hours
            Number.isInteger(oy_command_array[5][0][5])&&//check post_capacity_active is an integer
            Number.isInteger(oy_command_array[5][0][6])&&//check post_capacity_inactive is an integer
            (oy_command_array[5][0][1]===0||oy_command_array[5][0][1]===1)&&//check that author rights has a valid value of 0 or 1
            oy_command_array[5][0][2]>=0&&//check that submission price is a non negative value
            oy_command_array[5][0][3]>=0&&//check that vote_limit has a non negative value
            oy_command_array[5][0][4]>0&&//check that post expiration_quota has a positive value, represents hours
            oy_command_array[5][0][5]>=2&&//check that post_capacity_active has a plural value
            oy_command_array[5][0][6]>=2&&//check that post_capacity_inactive has a plural value
            typeof(oy_command_array[5][1])==="object"&&//check that the holding object for posts is a valid object
            Object.entries(oy_command_array[5][1]).every(oy_hold_check));//check
        //TODO timestamps in holding object must be adjusted to respect post_expiration_quota
    }],
    "OY_HIVEMIND_POST":[function(oy_command_array) {
        return (oy_command_array[3]===""&&//verify that oy_entropy_id was set as null, further preventing changes to already existing hivemind posts
            oy_command_array[5].length===2&&//verify dual sectors of oy_meta_data
            oy_hash_check(oy_command_array[5][0][1])&&//check that master_entropy_id is a valid hash
            Number.isInteger(oy_command_array[5][0][2])&&//check that author_public is an integer, must be -1 TODO unnecessary?
            Number.isInteger(oy_command_array[5][0][3])&&//check that submission_payment is an integer
            typeof(OY_BLOCK[7][oy_command_array[5][0][1]])!=="undefined"&&//check that the master thread exists in the meta section of the meshblock
            OY_BLOCK[7][oy_command_array[5][0][1]][3][0][0]===0&&//check that the master thread is structured as a master thread in the meta section of the meshblock
            oy_command_array[5][0][2]===-1&&//check that author_public is set to -1, to be assigned by the meshblock
            oy_command_array[5][0][3]>=OY_BLOCK[7][oy_command_array[5][0][1]][3][0][2]+((((OY_BLOCK[7][oy_command_array[5][0][1]][3][0][4]*3600)/20))*OY_AKOYA_FEE_BLOCK)&&//check that the submission_payment is large enough to cover the submission fee defined in the master thread, and enough akoya to host the data for the original intended amount of time
            typeof(OY_BLOCK[4][oy_command_array[2]])!=="undefined"&&//check that the author of the transaction has a positive akoya balance
            OY_BLOCK[4][oy_command_array[2]]>=oy_command_array[5][0][3]&&//check that the author of the transaction has sufficient akoya to fund the submission payment
            typeof(OY_BLOCK[7][oy_command_array[5][0][1]])!=="undefined"&&//check that the master thread exists in the meta sector of the meshblock
            ((OY_BLOCK[7][oy_command_array[5][0][1]][0]===""&&typeof(OY_BLOCK[4][oy_command_array[5][0][1]])!=="undefined")||(OY_BLOCK[7][oy_command_array[5][0][1]][0]!==""&&typeof(OY_BLOCK[4][OY_BLOCK[7][oy_command_array[5][0][1]][0]])!=="undefined"))&&//check that there is a funding wallet with a positive akoya balance for the master thread
            oy_an_check(oy_command_array[5][1][0].replace(/[=]/g, ""))&&//check that the post title is in valid base64
            oy_handle_check(oy_command_array[5][1][1]));//check that the post content is a mesh handle
    }]
};

// INIT
let OY_LIGHT_MODE = true;//seek to stay permanently connected to the mesh as a light node/latch, manipulable by the user
let OY_LIGHT_STATE = true;//immediate status of being a light node/latch, not manipulable by the user
let OY_LIGHT_LEAN = false;
let OY_LIGHT_UPSTREAM = null;
let OY_PASSIVE_MODE = false;//console output is silenced, and no explicit inputs are expected
let OY_SIMULATOR_MODE = false;//run in node.js simulator, requires oystersimulate.js
let OY_SELF_PRIVATE;//private key of node identity
let OY_SELF_PUBLIC;//public key of node identity
let OY_SELF_SHORT;//short representation of public key of node identity
let OY_READY = false;//connection status
let OY_CONN;//global P2P connection handle
let OY_ENGINE_KILL = false;//forces engine to stop its loop
let OY_CONSOLE;//custom function for handling console
let OY_MESH_MAP;//custom function for tracking mesh map
let OY_BLOCK_MAP;//custom function for tracking meshblock map
let OY_INIT = 0;//prevents multiple instances of oy_init() from running simultaneously
let OY_ENGINE = [{}, {}];//tracking object for core engine variables, [0] is latency tracking
let OY_COLLECT = {};//object for tracking pull fulfillments
let OY_CONSTRUCT = {};//data considered valid from OY_COLLECT is stored here, awaiting for final data reconstruction
let OY_DATA_PUSH = {};//object for tracking data push threads
let OY_DATA_PULL = {};//object for tracking data pull threads
let OY_LATCH_COUNT = 0;
let OY_PEER_COUNT = 0;//how many active connections with mutual peers
let OY_PEERS_PRE = {};//tracks nodes that are almost peers, will become peers once PEER_AFFIRM is received from other node
let OY_PEERS_NULL = new Event('oy_peers_null');//trigger-able event for when peer_count == 0
let OY_PEERS_RECOVER = new Event('oy_peers_recover');//trigger-able event for when peer_count > 0
let OY_NODES = {};//P2P connection handling for individual nodes
let OY_BOOST_BUILD = [];//store all node IDs from the most recent meshblock and use to find new peers in-case of peers_null/meshblock reset event
let OY_BOOST_RESERVE = [];
let OY_WARM = {};//tracking connections to nodes that are warming up
let OY_COLD = {};//tracking connection shutdowns to specific nodes
let OY_ROUTE_DYNAMIC = [];//tracks dynamic identifier for a routed data sequence
let OY_LATENCY = {};//handle latency sessions
let OY_PROPOSED = {};//nodes that have been recently proposed to for mutual peering
let OY_BLACKLIST = {};//nodes to block for x amount of time
let OY_PUSH_HOLD = {};//holds data contents ready for pushing to mesh
let OY_PUSH_TALLY = {};//tracks data push nonces that were deposited on the mesh
let OY_BASE_BUILD = [];
let OY_LIGHT_BUILD = {};
let OY_LIGHT_PROCESS = false;
let OY_WORKER_THREADS = null;
let OY_WORKER_POINTER = null;
let OY_LOGIC_ALL_TYPE = ["OY_DATA_PULL", "OY_CHANNEL_BROADCAST"];//OY_LOGIC_ALL definitions
let OY_WORK_HASH = null;
let OY_SYNC_LAST = [0, 0];
let OY_BLOCK_JUDGE = [null];
let OY_BLOCK_LEARN = [null];
let OY_BLOCK_HASH = null;//hash of the most current block
let OY_BLOCK_FLAT = null;
let OY_BLOCK_DIFF = false;
let OY_BLOCK_SIGN = null;
let OY_BLOCK_TIME = oy_block_time_first(false);//the most recent block timestamp
let OY_BLOCK_NEXT = oy_block_time_first(true);//the next block timestamp
let OY_BLOCK_BOOT = false;
let OY_BLOCK_UPTIME = null;
let OY_BLOCK_WEIGHT = null;
let OY_BLOCK_STABILITY = 0;
let OY_BLOCK_STABILITY_KEEP = [OY_BLOCK_RANGE_MIN];
let OY_BLOCK_COMMAND = {};
let OY_BLOCK_SYNC = {};
let OY_BLOCK_CHALLENGE = {};
let OY_DIVE_PAYOUT = null;
let OY_BLOCK_NEW = {};
let OY_BLOCK_CONFIRM = {};
let OY_BLOCK_HALT = null;
let OY_BLOCK_INIT = new Event('oy_block_init');//trigger-able event for when a new block is issued
let OY_BLOCK_TRIGGER = new Event('oy_block_trigger');//trigger-able event for when a new block is issued
let OY_BLOCK_RESET = new Event('oy_block_reset');//trigger-able event for when a new block is issued
let OY_STATE_BLANK = new Event('oy_state_blank');//trigger-able event for when self becomes blank
let OY_STATE_LIGHT = new Event('oy_state_light');//trigger-able event for when self becomes a light node
let OY_STATE_FULL = new Event('oy_state_full');//trigger-able event for when self becomes a full node
let OY_DIFF_TRACK = [{}, []];
let OY_CHANNEL_DYNAMIC = {};//track channel broadcasts to ensure allowance compliance
let OY_CHANNEL_LISTEN = {};//track channels to listen for
let OY_CHANNEL_KEEP = {};//stored broadcasts that are re-shared
let OY_CHANNEL_ECHO = {};//track channels to listen for
let OY_CHANNEL_TOP = {};//track current channel topology
let OY_CHANNEL_RENDER = {};//track channel broadcasts that have been rendered
let OY_DB = null;
let OY_ERROR_BROWSER;

/* SIMULATOR BLOCK
const LZString = require('lz-string');
const nacl = require('tweetnacl');
nacl.util = require('tweetnacl-util');
const parentPort  = require('worker_threads');
*/

//WEB WORKER BLOCK
function oy_worker_cores() {
    if (window.navigator.hardwareConcurrency) return Math.max(1, Math.floor(window.navigator.hardwareConcurrency/2)-1);
    else return OY_WORKER_CORES_FALLBACK;
}

function oy_worker_point() {
    OY_WORKER_POINTER++;
    if (OY_WORKER_POINTER>=OY_WORKER_THREADS.length) OY_WORKER_POINTER = 0;
    return OY_WORKER_POINTER;
}

function oy_worker(oy_worker_status) {
    function oy_worker_internal() {
        //OYSTER DEPENDENCY TWEETNACL-JS
        //https://github.com/dchest/tweetnacl-js
        !function(i){"use strict";var v=function(r){var t,n=new Float64Array(16);if(r)for(t=0;t<r.length;t++)n[t]=r[t];return n},h=function(){throw new Error("no PRNG")},o=new Uint8Array(16),n=new Uint8Array(32);n[0]=9;var s=v(),u=v([1]),p=v([56129,1]),c=v([30883,4953,19914,30187,55467,16705,2637,112,59544,30585,16505,36039,65139,11119,27886,20995]),y=v([61785,9906,39828,60374,45398,33411,5274,224,53552,61171,33010,6542,64743,22239,55772,9222]),e=v([54554,36645,11616,51542,42930,38181,51040,26924,56412,64982,57905,49316,21502,52590,14035,8553]),a=v([26200,26214,26214,26214,26214,26214,26214,26214,26214,26214,26214,26214,26214,26214,26214,26214]),l=v([41136,18958,6951,50414,58488,44335,6150,12099,55207,15867,153,11085,57099,20417,9344,11139]);function f(r,t,n,e){r[t]=n>>24&255,r[t+1]=n>>16&255,r[t+2]=n>>8&255,r[t+3]=255&n,r[t+4]=e>>24&255,r[t+5]=e>>16&255,r[t+6]=e>>8&255,r[t+7]=255&e}function w(r,t,n,e,o){var i,h=0;for(i=0;i<o;i++)h|=r[t+i]^n[e+i];return(1&h-1>>>8)-1}function b(r,t,n,e){return w(r,t,n,e,16)}function g(r,t,n,e){return w(r,t,n,e,32)}function _(r,t,n,e){!function(r,t,n,e){for(var o,i=255&e[0]|(255&e[1])<<8|(255&e[2])<<16|(255&e[3])<<24,h=255&n[0]|(255&n[1])<<8|(255&n[2])<<16|(255&n[3])<<24,a=255&n[4]|(255&n[5])<<8|(255&n[6])<<16|(255&n[7])<<24,f=255&n[8]|(255&n[9])<<8|(255&n[10])<<16|(255&n[11])<<24,s=255&n[12]|(255&n[13])<<8|(255&n[14])<<16|(255&n[15])<<24,u=255&e[4]|(255&e[5])<<8|(255&e[6])<<16|(255&e[7])<<24,c=255&t[0]|(255&t[1])<<8|(255&t[2])<<16|(255&t[3])<<24,y=255&t[4]|(255&t[5])<<8|(255&t[6])<<16|(255&t[7])<<24,l=255&t[8]|(255&t[9])<<8|(255&t[10])<<16|(255&t[11])<<24,w=255&t[12]|(255&t[13])<<8|(255&t[14])<<16|(255&t[15])<<24,v=255&e[8]|(255&e[9])<<8|(255&e[10])<<16|(255&e[11])<<24,p=255&n[16]|(255&n[17])<<8|(255&n[18])<<16|(255&n[19])<<24,b=255&n[20]|(255&n[21])<<8|(255&n[22])<<16|(255&n[23])<<24,g=255&n[24]|(255&n[25])<<8|(255&n[26])<<16|(255&n[27])<<24,_=255&n[28]|(255&n[29])<<8|(255&n[30])<<16|(255&n[31])<<24,A=255&e[12]|(255&e[13])<<8|(255&e[14])<<16|(255&e[15])<<24,U=i,d=h,E=a,x=f,M=s,m=u,B=c,S=y,K=l,Y=w,k=v,T=p,L=b,z=g,R=_,P=A,N=0;N<20;N+=2)U^=(o=(L^=(o=(K^=(o=(M^=(o=U+L|0)<<7|o>>>25)+U|0)<<9|o>>>23)+M|0)<<13|o>>>19)+K|0)<<18|o>>>14,m^=(o=(d^=(o=(z^=(o=(Y^=(o=m+d|0)<<7|o>>>25)+m|0)<<9|o>>>23)+Y|0)<<13|o>>>19)+z|0)<<18|o>>>14,k^=(o=(B^=(o=(E^=(o=(R^=(o=k+B|0)<<7|o>>>25)+k|0)<<9|o>>>23)+R|0)<<13|o>>>19)+E|0)<<18|o>>>14,P^=(o=(T^=(o=(S^=(o=(x^=(o=P+T|0)<<7|o>>>25)+P|0)<<9|o>>>23)+x|0)<<13|o>>>19)+S|0)<<18|o>>>14,U^=(o=(x^=(o=(E^=(o=(d^=(o=U+x|0)<<7|o>>>25)+U|0)<<9|o>>>23)+d|0)<<13|o>>>19)+E|0)<<18|o>>>14,m^=(o=(M^=(o=(S^=(o=(B^=(o=m+M|0)<<7|o>>>25)+m|0)<<9|o>>>23)+B|0)<<13|o>>>19)+S|0)<<18|o>>>14,k^=(o=(Y^=(o=(K^=(o=(T^=(o=k+Y|0)<<7|o>>>25)+k|0)<<9|o>>>23)+T|0)<<13|o>>>19)+K|0)<<18|o>>>14,P^=(o=(R^=(o=(z^=(o=(L^=(o=P+R|0)<<7|o>>>25)+P|0)<<9|o>>>23)+L|0)<<13|o>>>19)+z|0)<<18|o>>>14;U=U+i|0,d=d+h|0,E=E+a|0,x=x+f|0,M=M+s|0,m=m+u|0,B=B+c|0,S=S+y|0,K=K+l|0,Y=Y+w|0,k=k+v|0,T=T+p|0,L=L+b|0,z=z+g|0,R=R+_|0,P=P+A|0,r[0]=U>>>0&255,r[1]=U>>>8&255,r[2]=U>>>16&255,r[3]=U>>>24&255,r[4]=d>>>0&255,r[5]=d>>>8&255,r[6]=d>>>16&255,r[7]=d>>>24&255,r[8]=E>>>0&255,r[9]=E>>>8&255,r[10]=E>>>16&255,r[11]=E>>>24&255,r[12]=x>>>0&255,r[13]=x>>>8&255,r[14]=x>>>16&255,r[15]=x>>>24&255,r[16]=M>>>0&255,r[17]=M>>>8&255,r[18]=M>>>16&255,r[19]=M>>>24&255,r[20]=m>>>0&255,r[21]=m>>>8&255,r[22]=m>>>16&255,r[23]=m>>>24&255,r[24]=B>>>0&255,r[25]=B>>>8&255,r[26]=B>>>16&255,r[27]=B>>>24&255,r[28]=S>>>0&255,r[29]=S>>>8&255,r[30]=S>>>16&255,r[31]=S>>>24&255,r[32]=K>>>0&255,r[33]=K>>>8&255,r[34]=K>>>16&255,r[35]=K>>>24&255,r[36]=Y>>>0&255,r[37]=Y>>>8&255,r[38]=Y>>>16&255,r[39]=Y>>>24&255,r[40]=k>>>0&255,r[41]=k>>>8&255,r[42]=k>>>16&255,r[43]=k>>>24&255,r[44]=T>>>0&255,r[45]=T>>>8&255,r[46]=T>>>16&255,r[47]=T>>>24&255,r[48]=L>>>0&255,r[49]=L>>>8&255,r[50]=L>>>16&255,r[51]=L>>>24&255,r[52]=z>>>0&255,r[53]=z>>>8&255,r[54]=z>>>16&255,r[55]=z>>>24&255,r[56]=R>>>0&255,r[57]=R>>>8&255,r[58]=R>>>16&255,r[59]=R>>>24&255,r[60]=P>>>0&255,r[61]=P>>>8&255,r[62]=P>>>16&255,r[63]=P>>>24&255}(r,t,n,e)}function A(r,t,n,e){!function(r,t,n,e){for(var o,i=255&e[0]|(255&e[1])<<8|(255&e[2])<<16|(255&e[3])<<24,h=255&n[0]|(255&n[1])<<8|(255&n[2])<<16|(255&n[3])<<24,a=255&n[4]|(255&n[5])<<8|(255&n[6])<<16|(255&n[7])<<24,f=255&n[8]|(255&n[9])<<8|(255&n[10])<<16|(255&n[11])<<24,s=255&n[12]|(255&n[13])<<8|(255&n[14])<<16|(255&n[15])<<24,u=255&e[4]|(255&e[5])<<8|(255&e[6])<<16|(255&e[7])<<24,c=255&t[0]|(255&t[1])<<8|(255&t[2])<<16|(255&t[3])<<24,y=255&t[4]|(255&t[5])<<8|(255&t[6])<<16|(255&t[7])<<24,l=255&t[8]|(255&t[9])<<8|(255&t[10])<<16|(255&t[11])<<24,w=255&t[12]|(255&t[13])<<8|(255&t[14])<<16|(255&t[15])<<24,v=255&e[8]|(255&e[9])<<8|(255&e[10])<<16|(255&e[11])<<24,p=255&n[16]|(255&n[17])<<8|(255&n[18])<<16|(255&n[19])<<24,b=255&n[20]|(255&n[21])<<8|(255&n[22])<<16|(255&n[23])<<24,g=255&n[24]|(255&n[25])<<8|(255&n[26])<<16|(255&n[27])<<24,_=255&n[28]|(255&n[29])<<8|(255&n[30])<<16|(255&n[31])<<24,A=255&e[12]|(255&e[13])<<8|(255&e[14])<<16|(255&e[15])<<24,U=0;U<20;U+=2)i^=(o=(b^=(o=(l^=(o=(s^=(o=i+b|0)<<7|o>>>25)+i|0)<<9|o>>>23)+s|0)<<13|o>>>19)+l|0)<<18|o>>>14,u^=(o=(h^=(o=(g^=(o=(w^=(o=u+h|0)<<7|o>>>25)+u|0)<<9|o>>>23)+w|0)<<13|o>>>19)+g|0)<<18|o>>>14,v^=(o=(c^=(o=(a^=(o=(_^=(o=v+c|0)<<7|o>>>25)+v|0)<<9|o>>>23)+_|0)<<13|o>>>19)+a|0)<<18|o>>>14,A^=(o=(p^=(o=(y^=(o=(f^=(o=A+p|0)<<7|o>>>25)+A|0)<<9|o>>>23)+f|0)<<13|o>>>19)+y|0)<<18|o>>>14,i^=(o=(f^=(o=(a^=(o=(h^=(o=i+f|0)<<7|o>>>25)+i|0)<<9|o>>>23)+h|0)<<13|o>>>19)+a|0)<<18|o>>>14,u^=(o=(s^=(o=(y^=(o=(c^=(o=u+s|0)<<7|o>>>25)+u|0)<<9|o>>>23)+c|0)<<13|o>>>19)+y|0)<<18|o>>>14,v^=(o=(w^=(o=(l^=(o=(p^=(o=v+w|0)<<7|o>>>25)+v|0)<<9|o>>>23)+p|0)<<13|o>>>19)+l|0)<<18|o>>>14,A^=(o=(_^=(o=(g^=(o=(b^=(o=A+_|0)<<7|o>>>25)+A|0)<<9|o>>>23)+b|0)<<13|o>>>19)+g|0)<<18|o>>>14;r[0]=i>>>0&255,r[1]=i>>>8&255,r[2]=i>>>16&255,r[3]=i>>>24&255,r[4]=u>>>0&255,r[5]=u>>>8&255,r[6]=u>>>16&255,r[7]=u>>>24&255,r[8]=v>>>0&255,r[9]=v>>>8&255,r[10]=v>>>16&255,r[11]=v>>>24&255,r[12]=A>>>0&255,r[13]=A>>>8&255,r[14]=A>>>16&255,r[15]=A>>>24&255,r[16]=c>>>0&255,r[17]=c>>>8&255,r[18]=c>>>16&255,r[19]=c>>>24&255,r[20]=y>>>0&255,r[21]=y>>>8&255,r[22]=y>>>16&255,r[23]=y>>>24&255,r[24]=l>>>0&255,r[25]=l>>>8&255,r[26]=l>>>16&255,r[27]=l>>>24&255,r[28]=w>>>0&255,r[29]=w>>>8&255,r[30]=w>>>16&255,r[31]=w>>>24&255}(r,t,n,e)}var U=new Uint8Array([101,120,112,97,110,100,32,51,50,45,98,121,116,101,32,107]);function d(r,t,n,e,o,i,h){var a,f,s=new Uint8Array(16),u=new Uint8Array(64);for(f=0;f<16;f++)s[f]=0;for(f=0;f<8;f++)s[f]=i[f];for(;64<=o;){for(_(u,s,h,U),f=0;f<64;f++)r[t+f]=n[e+f]^u[f];for(a=1,f=8;f<16;f++)a=a+(255&s[f])|0,s[f]=255&a,a>>>=8;o-=64,t+=64,e+=64}if(0<o)for(_(u,s,h,U),f=0;f<o;f++)r[t+f]=n[e+f]^u[f];return 0}function E(r,t,n,e,o){var i,h,a=new Uint8Array(16),f=new Uint8Array(64);for(h=0;h<16;h++)a[h]=0;for(h=0;h<8;h++)a[h]=e[h];for(;64<=n;){for(_(f,a,o,U),h=0;h<64;h++)r[t+h]=f[h];for(i=1,h=8;h<16;h++)i=i+(255&a[h])|0,a[h]=255&i,i>>>=8;n-=64,t+=64}if(0<n)for(_(f,a,o,U),h=0;h<n;h++)r[t+h]=f[h];return 0}function x(r,t,n,e,o){var i=new Uint8Array(32);A(i,e,o,U);for(var h=new Uint8Array(8),a=0;a<8;a++)h[a]=e[a+16];return E(r,t,n,h,i)}function M(r,t,n,e,o,i,h){var a=new Uint8Array(32);A(a,i,h,U);for(var f=new Uint8Array(8),s=0;s<8;s++)f[s]=i[s+16];return d(r,t,n,e,o,f,a)}var m=function(r){var t,n,e,o,i,h,a,f;this.buffer=new Uint8Array(16),this.r=new Uint16Array(10),this.h=new Uint16Array(10),this.pad=new Uint16Array(8),this.leftover=0,t=255&r[this.fin=0]|(255&r[1])<<8,this.r[0]=8191&t,n=255&r[2]|(255&r[3])<<8,this.r[1]=8191&(t>>>13|n<<3),e=255&r[4]|(255&r[5])<<8,this.r[2]=7939&(n>>>10|e<<6),o=255&r[6]|(255&r[7])<<8,this.r[3]=8191&(e>>>7|o<<9),i=255&r[8]|(255&r[9])<<8,this.r[4]=255&(o>>>4|i<<12),this.r[5]=i>>>1&8190,h=255&r[10]|(255&r[11])<<8,this.r[6]=8191&(i>>>14|h<<2),a=255&r[12]|(255&r[13])<<8,this.r[7]=8065&(h>>>11|a<<5),f=255&r[14]|(255&r[15])<<8,this.r[8]=8191&(a>>>8|f<<8),this.r[9]=f>>>5&127,this.pad[0]=255&r[16]|(255&r[17])<<8,this.pad[1]=255&r[18]|(255&r[19])<<8,this.pad[2]=255&r[20]|(255&r[21])<<8,this.pad[3]=255&r[22]|(255&r[23])<<8,this.pad[4]=255&r[24]|(255&r[25])<<8,this.pad[5]=255&r[26]|(255&r[27])<<8,this.pad[6]=255&r[28]|(255&r[29])<<8,this.pad[7]=255&r[30]|(255&r[31])<<8};function B(r,t,n,e,o,i){var h=new m(i);return h.update(n,e,o),h.finish(r,t),0}function S(r,t,n,e,o,i){var h=new Uint8Array(16);return B(h,0,n,e,o,i),b(r,t,h,0)}function K(r,t,n,e,o){var i;if(n<32)return-1;for(M(r,0,t,0,n,e,o),B(r,16,r,32,n-32,r),i=0;i<16;i++)r[i]=0;return 0}function Y(r,t,n,e,o){var i,h=new Uint8Array(32);if(n<32)return-1;if(x(h,0,32,e,o),0!==S(t,16,t,32,n-32,h))return-1;for(M(r,0,t,0,n,e,o),i=0;i<32;i++)r[i]=0;return 0}function k(r,t){var n;for(n=0;n<16;n++)r[n]=0|t[n]}function T(r){var t,n,e=1;for(t=0;t<16;t++)n=r[t]+e+65535,e=Math.floor(n/65536),r[t]=n-65536*e;r[0]+=e-1+37*(e-1)}function L(r,t,n){for(var e,o=~(n-1),i=0;i<16;i++)e=o&(r[i]^t[i]),r[i]^=e,t[i]^=e}function z(r,t){var n,e,o,i=v(),h=v();for(n=0;n<16;n++)h[n]=t[n];for(T(h),T(h),T(h),e=0;e<2;e++){for(i[0]=h[0]-65517,n=1;n<15;n++)i[n]=h[n]-65535-(i[n-1]>>16&1),i[n-1]&=65535;i[15]=h[15]-32767-(i[14]>>16&1),o=i[15]>>16&1,i[14]&=65535,L(h,i,1-o)}for(n=0;n<16;n++)r[2*n]=255&h[n],r[2*n+1]=h[n]>>8}function R(r,t){var n=new Uint8Array(32),e=new Uint8Array(32);return z(n,r),z(e,t),g(n,0,e,0)}function P(r){var t=new Uint8Array(32);return z(t,r),1&t[0]}function N(r,t){var n;for(n=0;n<16;n++)r[n]=t[2*n]+(t[2*n+1]<<8);r[15]&=32767}function O(r,t,n){for(var e=0;e<16;e++)r[e]=t[e]+n[e]}function C(r,t,n){for(var e=0;e<16;e++)r[e]=t[e]-n[e]}function F(r,t,n){var e,o,i=0,h=0,a=0,f=0,s=0,u=0,c=0,y=0,l=0,w=0,v=0,p=0,b=0,g=0,_=0,A=0,U=0,d=0,E=0,x=0,M=0,m=0,B=0,S=0,K=0,Y=0,k=0,T=0,L=0,z=0,R=0,P=n[0],N=n[1],O=n[2],C=n[3],F=n[4],I=n[5],G=n[6],Z=n[7],q=n[8],V=n[9],X=n[10],D=n[11],j=n[12],H=n[13],J=n[14],Q=n[15];i+=(e=t[0])*P,h+=e*N,a+=e*O,f+=e*C,s+=e*F,u+=e*I,c+=e*G,y+=e*Z,l+=e*q,w+=e*V,v+=e*X,p+=e*D,b+=e*j,g+=e*H,_+=e*J,A+=e*Q,h+=(e=t[1])*P,a+=e*N,f+=e*O,s+=e*C,u+=e*F,c+=e*I,y+=e*G,l+=e*Z,w+=e*q,v+=e*V,p+=e*X,b+=e*D,g+=e*j,_+=e*H,A+=e*J,U+=e*Q,a+=(e=t[2])*P,f+=e*N,s+=e*O,u+=e*C,c+=e*F,y+=e*I,l+=e*G,w+=e*Z,v+=e*q,p+=e*V,b+=e*X,g+=e*D,_+=e*j,A+=e*H,U+=e*J,d+=e*Q,f+=(e=t[3])*P,s+=e*N,u+=e*O,c+=e*C,y+=e*F,l+=e*I,w+=e*G,v+=e*Z,p+=e*q,b+=e*V,g+=e*X,_+=e*D,A+=e*j,U+=e*H,d+=e*J,E+=e*Q,s+=(e=t[4])*P,u+=e*N,c+=e*O,y+=e*C,l+=e*F,w+=e*I,v+=e*G,p+=e*Z,b+=e*q,g+=e*V,_+=e*X,A+=e*D,U+=e*j,d+=e*H,E+=e*J,x+=e*Q,u+=(e=t[5])*P,c+=e*N,y+=e*O,l+=e*C,w+=e*F,v+=e*I,p+=e*G,b+=e*Z,g+=e*q,_+=e*V,A+=e*X,U+=e*D,d+=e*j,E+=e*H,x+=e*J,M+=e*Q,c+=(e=t[6])*P,y+=e*N,l+=e*O,w+=e*C,v+=e*F,p+=e*I,b+=e*G,g+=e*Z,_+=e*q,A+=e*V,U+=e*X,d+=e*D,E+=e*j,x+=e*H,M+=e*J,m+=e*Q,y+=(e=t[7])*P,l+=e*N,w+=e*O,v+=e*C,p+=e*F,b+=e*I,g+=e*G,_+=e*Z,A+=e*q,U+=e*V,d+=e*X,E+=e*D,x+=e*j,M+=e*H,m+=e*J,B+=e*Q,l+=(e=t[8])*P,w+=e*N,v+=e*O,p+=e*C,b+=e*F,g+=e*I,_+=e*G,A+=e*Z,U+=e*q,d+=e*V,E+=e*X,x+=e*D,M+=e*j,m+=e*H,B+=e*J,S+=e*Q,w+=(e=t[9])*P,v+=e*N,p+=e*O,b+=e*C,g+=e*F,_+=e*I,A+=e*G,U+=e*Z,d+=e*q,E+=e*V,x+=e*X,M+=e*D,m+=e*j,B+=e*H,S+=e*J,K+=e*Q,v+=(e=t[10])*P,p+=e*N,b+=e*O,g+=e*C,_+=e*F,A+=e*I,U+=e*G,d+=e*Z,E+=e*q,x+=e*V,M+=e*X,m+=e*D,B+=e*j,S+=e*H,K+=e*J,Y+=e*Q,p+=(e=t[11])*P,b+=e*N,g+=e*O,_+=e*C,A+=e*F,U+=e*I,d+=e*G,E+=e*Z,x+=e*q,M+=e*V,m+=e*X,B+=e*D,S+=e*j,K+=e*H,Y+=e*J,k+=e*Q,b+=(e=t[12])*P,g+=e*N,_+=e*O,A+=e*C,U+=e*F,d+=e*I,E+=e*G,x+=e*Z,M+=e*q,m+=e*V,B+=e*X,S+=e*D,K+=e*j,Y+=e*H,k+=e*J,T+=e*Q,g+=(e=t[13])*P,_+=e*N,A+=e*O,U+=e*C,d+=e*F,E+=e*I,x+=e*G,M+=e*Z,m+=e*q,B+=e*V,S+=e*X,K+=e*D,Y+=e*j,k+=e*H,T+=e*J,L+=e*Q,_+=(e=t[14])*P,A+=e*N,U+=e*O,d+=e*C,E+=e*F,x+=e*I,M+=e*G,m+=e*Z,B+=e*q,S+=e*V,K+=e*X,Y+=e*D,k+=e*j,T+=e*H,L+=e*J,z+=e*Q,A+=(e=t[15])*P,h+=38*(d+=e*O),a+=38*(E+=e*C),f+=38*(x+=e*F),s+=38*(M+=e*I),u+=38*(m+=e*G),c+=38*(B+=e*Z),y+=38*(S+=e*q),l+=38*(K+=e*V),w+=38*(Y+=e*X),v+=38*(k+=e*D),p+=38*(T+=e*j),b+=38*(L+=e*H),g+=38*(z+=e*J),_+=38*(R+=e*Q),i=(e=(i+=38*(U+=e*N))+(o=1)+65535)-65536*(o=Math.floor(e/65536)),h=(e=h+o+65535)-65536*(o=Math.floor(e/65536)),a=(e=a+o+65535)-65536*(o=Math.floor(e/65536)),f=(e=f+o+65535)-65536*(o=Math.floor(e/65536)),s=(e=s+o+65535)-65536*(o=Math.floor(e/65536)),u=(e=u+o+65535)-65536*(o=Math.floor(e/65536)),c=(e=c+o+65535)-65536*(o=Math.floor(e/65536)),y=(e=y+o+65535)-65536*(o=Math.floor(e/65536)),l=(e=l+o+65535)-65536*(o=Math.floor(e/65536)),w=(e=w+o+65535)-65536*(o=Math.floor(e/65536)),v=(e=v+o+65535)-65536*(o=Math.floor(e/65536)),p=(e=p+o+65535)-65536*(o=Math.floor(e/65536)),b=(e=b+o+65535)-65536*(o=Math.floor(e/65536)),g=(e=g+o+65535)-65536*(o=Math.floor(e/65536)),_=(e=_+o+65535)-65536*(o=Math.floor(e/65536)),A=(e=A+o+65535)-65536*(o=Math.floor(e/65536)),i=(e=(i+=o-1+37*(o-1))+(o=1)+65535)-65536*(o=Math.floor(e/65536)),h=(e=h+o+65535)-65536*(o=Math.floor(e/65536)),a=(e=a+o+65535)-65536*(o=Math.floor(e/65536)),f=(e=f+o+65535)-65536*(o=Math.floor(e/65536)),s=(e=s+o+65535)-65536*(o=Math.floor(e/65536)),u=(e=u+o+65535)-65536*(o=Math.floor(e/65536)),c=(e=c+o+65535)-65536*(o=Math.floor(e/65536)),y=(e=y+o+65535)-65536*(o=Math.floor(e/65536)),l=(e=l+o+65535)-65536*(o=Math.floor(e/65536)),w=(e=w+o+65535)-65536*(o=Math.floor(e/65536)),v=(e=v+o+65535)-65536*(o=Math.floor(e/65536)),p=(e=p+o+65535)-65536*(o=Math.floor(e/65536)),b=(e=b+o+65535)-65536*(o=Math.floor(e/65536)),g=(e=g+o+65535)-65536*(o=Math.floor(e/65536)),_=(e=_+o+65535)-65536*(o=Math.floor(e/65536)),A=(e=A+o+65535)-65536*(o=Math.floor(e/65536)),i+=o-1+37*(o-1),r[0]=i,r[1]=h,r[2]=a,r[3]=f,r[4]=s,r[5]=u,r[6]=c,r[7]=y,r[8]=l,r[9]=w,r[10]=v,r[11]=p,r[12]=b,r[13]=g,r[14]=_,r[15]=A}function I(r,t){F(r,t,t)}function G(r,t){var n,e=v();for(n=0;n<16;n++)e[n]=t[n];for(n=253;0<=n;n--)I(e,e),2!==n&&4!==n&&F(e,e,t);for(n=0;n<16;n++)r[n]=e[n]}function Z(r,t,n){var e,o,i=new Uint8Array(32),h=new Float64Array(80),a=v(),f=v(),s=v(),u=v(),c=v(),y=v();for(o=0;o<31;o++)i[o]=t[o];for(i[31]=127&t[31]|64,i[0]&=248,N(h,n),o=0;o<16;o++)f[o]=h[o],u[o]=a[o]=s[o]=0;for(a[0]=u[0]=1,o=254;0<=o;--o)L(a,f,e=i[o>>>3]>>>(7&o)&1),L(s,u,e),O(c,a,s),C(a,a,s),O(s,f,u),C(f,f,u),I(u,c),I(y,a),F(a,s,a),F(s,f,c),O(c,a,s),C(a,a,s),I(f,a),C(s,u,y),F(a,s,p),O(a,a,u),F(s,s,a),F(a,u,y),F(u,f,h),I(f,c),L(a,f,e),L(s,u,e);for(o=0;o<16;o++)h[o+16]=a[o],h[o+32]=s[o],h[o+48]=f[o],h[o+64]=u[o];var l=h.subarray(32),w=h.subarray(16);return G(l,l),F(w,w,l),z(r,w),0}function q(r,t){return Z(r,t,n)}function V(r,t){return h(t,32),q(r,t)}function X(r,t,n){var e=new Uint8Array(32);return Z(e,n,t),A(r,o,e,U)}m.prototype.blocks=function(r,t,n){for(var e,o,i,h,a,f,s,u,c,y,l,w,v,p,b,g,_,A,U,d=this.fin?0:2048,E=this.h[0],x=this.h[1],M=this.h[2],m=this.h[3],B=this.h[4],S=this.h[5],K=this.h[6],Y=this.h[7],k=this.h[8],T=this.h[9],L=this.r[0],z=this.r[1],R=this.r[2],P=this.r[3],N=this.r[4],O=this.r[5],C=this.r[6],F=this.r[7],I=this.r[8],G=this.r[9];16<=n;)y=c=0,y+=(E+=8191&(e=255&r[t+0]|(255&r[t+1])<<8))*L,y+=(x+=8191&(e>>>13|(o=255&r[t+2]|(255&r[t+3])<<8)<<3))*(5*G),y+=(M+=8191&(o>>>10|(i=255&r[t+4]|(255&r[t+5])<<8)<<6))*(5*I),y+=(m+=8191&(i>>>7|(h=255&r[t+6]|(255&r[t+7])<<8)<<9))*(5*F),c=(y+=(B+=8191&(h>>>4|(a=255&r[t+8]|(255&r[t+9])<<8)<<12))*(5*C))>>>13,y&=8191,y+=(S+=a>>>1&8191)*(5*O),y+=(K+=8191&(a>>>14|(f=255&r[t+10]|(255&r[t+11])<<8)<<2))*(5*N),y+=(Y+=8191&(f>>>11|(s=255&r[t+12]|(255&r[t+13])<<8)<<5))*(5*P),y+=(k+=8191&(s>>>8|(u=255&r[t+14]|(255&r[t+15])<<8)<<8))*(5*R),l=c+=(y+=(T+=u>>>5|d)*(5*z))>>>13,l+=E*z,l+=x*L,l+=M*(5*G),l+=m*(5*I),c=(l+=B*(5*F))>>>13,l&=8191,l+=S*(5*C),l+=K*(5*O),l+=Y*(5*N),l+=k*(5*P),c+=(l+=T*(5*R))>>>13,l&=8191,w=c,w+=E*R,w+=x*z,w+=M*L,w+=m*(5*G),c=(w+=B*(5*I))>>>13,w&=8191,w+=S*(5*F),w+=K*(5*C),w+=Y*(5*O),w+=k*(5*N),v=c+=(w+=T*(5*P))>>>13,v+=E*P,v+=x*R,v+=M*z,v+=m*L,c=(v+=B*(5*G))>>>13,v&=8191,v+=S*(5*I),v+=K*(5*F),v+=Y*(5*C),v+=k*(5*O),p=c+=(v+=T*(5*N))>>>13,p+=E*N,p+=x*P,p+=M*R,p+=m*z,c=(p+=B*L)>>>13,p&=8191,p+=S*(5*G),p+=K*(5*I),p+=Y*(5*F),p+=k*(5*C),b=c+=(p+=T*(5*O))>>>13,b+=E*O,b+=x*N,b+=M*P,b+=m*R,c=(b+=B*z)>>>13,b&=8191,b+=S*L,b+=K*(5*G),b+=Y*(5*I),b+=k*(5*F),g=c+=(b+=T*(5*C))>>>13,g+=E*C,g+=x*O,g+=M*N,g+=m*P,c=(g+=B*R)>>>13,g&=8191,g+=S*z,g+=K*L,g+=Y*(5*G),g+=k*(5*I),_=c+=(g+=T*(5*F))>>>13,_+=E*F,_+=x*C,_+=M*O,_+=m*N,c=(_+=B*P)>>>13,_&=8191,_+=S*R,_+=K*z,_+=Y*L,_+=k*(5*G),A=c+=(_+=T*(5*I))>>>13,A+=E*I,A+=x*F,A+=M*C,A+=m*O,c=(A+=B*N)>>>13,A&=8191,A+=S*P,A+=K*R,A+=Y*z,A+=k*L,U=c+=(A+=T*(5*G))>>>13,U+=E*G,U+=x*I,U+=M*F,U+=m*C,c=(U+=B*O)>>>13,U&=8191,U+=S*N,U+=K*P,U+=Y*R,U+=k*z,E=y=8191&(c=(c=((c+=(U+=T*L)>>>13)<<2)+c|0)+(y&=8191)|0),x=l+=c>>>=13,M=w&=8191,m=v&=8191,B=p&=8191,S=b&=8191,K=g&=8191,Y=_&=8191,k=A&=8191,T=U&=8191,t+=16,n-=16;this.h[0]=E,this.h[1]=x,this.h[2]=M,this.h[3]=m,this.h[4]=B,this.h[5]=S,this.h[6]=K,this.h[7]=Y,this.h[8]=k,this.h[9]=T},m.prototype.finish=function(r,t){var n,e,o,i,h=new Uint16Array(10);if(this.leftover){for(i=this.leftover,this.buffer[i++]=1;i<16;i++)this.buffer[i]=0;this.fin=1,this.blocks(this.buffer,0,16)}for(n=this.h[1]>>>13,this.h[1]&=8191,i=2;i<10;i++)this.h[i]+=n,n=this.h[i]>>>13,this.h[i]&=8191;for(this.h[0]+=5*n,n=this.h[0]>>>13,this.h[0]&=8191,this.h[1]+=n,n=this.h[1]>>>13,this.h[1]&=8191,this.h[2]+=n,h[0]=this.h[0]+5,n=h[0]>>>13,h[0]&=8191,i=1;i<10;i++)h[i]=this.h[i]+n,n=h[i]>>>13,h[i]&=8191;for(h[9]-=8192,e=(1^n)-1,i=0;i<10;i++)h[i]&=e;for(e=~e,i=0;i<10;i++)this.h[i]=this.h[i]&e|h[i];for(this.h[0]=65535&(this.h[0]|this.h[1]<<13),this.h[1]=65535&(this.h[1]>>>3|this.h[2]<<10),this.h[2]=65535&(this.h[2]>>>6|this.h[3]<<7),this.h[3]=65535&(this.h[3]>>>9|this.h[4]<<4),this.h[4]=65535&(this.h[4]>>>12|this.h[5]<<1|this.h[6]<<14),this.h[5]=65535&(this.h[6]>>>2|this.h[7]<<11),this.h[6]=65535&(this.h[7]>>>5|this.h[8]<<8),this.h[7]=65535&(this.h[8]>>>8|this.h[9]<<5),o=this.h[0]+this.pad[0],this.h[0]=65535&o,i=1;i<8;i++)o=(this.h[i]+this.pad[i]|0)+(o>>>16)|0,this.h[i]=65535&o;r[t+0]=this.h[0]>>>0&255,r[t+1]=this.h[0]>>>8&255,r[t+2]=this.h[1]>>>0&255,r[t+3]=this.h[1]>>>8&255,r[t+4]=this.h[2]>>>0&255,r[t+5]=this.h[2]>>>8&255,r[t+6]=this.h[3]>>>0&255,r[t+7]=this.h[3]>>>8&255,r[t+8]=this.h[4]>>>0&255,r[t+9]=this.h[4]>>>8&255,r[t+10]=this.h[5]>>>0&255,r[t+11]=this.h[5]>>>8&255,r[t+12]=this.h[6]>>>0&255,r[t+13]=this.h[6]>>>8&255,r[t+14]=this.h[7]>>>0&255,r[t+15]=this.h[7]>>>8&255},m.prototype.update=function(r,t,n){var e,o;if(this.leftover){for(n<(o=16-this.leftover)&&(o=n),e=0;e<o;e++)this.buffer[this.leftover+e]=r[t+e];if(n-=o,t+=o,this.leftover+=o,this.leftover<16)return;this.blocks(this.buffer,0,16),this.leftover=0}if(16<=n&&(o=n-n%16,this.blocks(r,t,o),t+=o,n-=o),n){for(e=0;e<n;e++)this.buffer[this.leftover+e]=r[t+e];this.leftover+=n}};var D=K,j=Y;var H=[1116352408,3609767458,1899447441,602891725,3049323471,3964484399,3921009573,2173295548,961987163,4081628472,1508970993,3053834265,2453635748,2937671579,2870763221,3664609560,3624381080,2734883394,310598401,1164996542,607225278,1323610764,1426881987,3590304994,1925078388,4068182383,2162078206,991336113,2614888103,633803317,3248222580,3479774868,3835390401,2666613458,4022224774,944711139,264347078,2341262773,604807628,2007800933,770255983,1495990901,1249150122,1856431235,1555081692,3175218132,1996064986,2198950837,2554220882,3999719339,2821834349,766784016,2952996808,2566594879,3210313671,3203337956,3336571891,1034457026,3584528711,2466948901,113926993,3758326383,338241895,168717936,666307205,1188179964,773529912,1546045734,1294757372,1522805485,1396182291,2643833823,1695183700,2343527390,1986661051,1014477480,2177026350,1206759142,2456956037,344077627,2730485921,1290863460,2820302411,3158454273,3259730800,3505952657,3345764771,106217008,3516065817,3606008344,3600352804,1432725776,4094571909,1467031594,275423344,851169720,430227734,3100823752,506948616,1363258195,659060556,3750685593,883997877,3785050280,958139571,3318307427,1322822218,3812723403,1537002063,2003034995,1747873779,3602036899,1955562222,1575990012,2024104815,1125592928,2227730452,2716904306,2361852424,442776044,2428436474,593698344,2756734187,3733110249,3204031479,2999351573,3329325298,3815920427,3391569614,3928383900,3515267271,566280711,3940187606,3454069534,4118630271,4000239992,116418474,1914138554,174292421,2731055270,289380356,3203993006,460393269,320620315,685471733,587496836,852142971,1086792851,1017036298,365543100,1126000580,2618297676,1288033470,3409855158,1501505948,4234509866,1607167915,987167468,1816402316,1246189591];function J(r,t,n,e){for(var o,i,h,a,f,s,u,c,y,l,w,v,p,b,g,_,A,U,d,E,x,M,m,B,S,K,Y=new Int32Array(16),k=new Int32Array(16),T=r[0],L=r[1],z=r[2],R=r[3],P=r[4],N=r[5],O=r[6],C=r[7],F=t[0],I=t[1],G=t[2],Z=t[3],q=t[4],V=t[5],X=t[6],D=t[7],j=0;128<=e;){for(d=0;d<16;d++)E=8*d+j,Y[d]=n[E+0]<<24|n[E+1]<<16|n[E+2]<<8|n[E+3],k[d]=n[E+4]<<24|n[E+5]<<16|n[E+6]<<8|n[E+7];for(d=0;d<80;d++)if(o=T,i=L,h=z,a=R,y=F,l=I,w=G,v=Z,m=65535&(M=D),B=M>>>16,S=65535&(x=C),K=x>>>16,m+=65535&(M=((p=q)>>>14|(f=P)<<18)^(q>>>18|P<<14)^(P>>>9|q<<23)),B+=M>>>16,S+=65535&(x=(P>>>14|q<<18)^(P>>>18|q<<14)^(q>>>9|P<<23)),K+=x>>>16,m+=65535&(M=q&(b=V)^~q&(g=X)),B+=M>>>16,S+=65535&(x=P&(s=N)^~P&(u=O)),K+=x>>>16,x=H[2*d],m+=65535&(M=H[2*d+1]),B+=M>>>16,S+=65535&x,K+=x>>>16,x=Y[d%16],B+=(M=k[d%16])>>>16,S+=65535&x,K+=x>>>16,S+=(B+=(m+=65535&M)>>>16)>>>16,m=65535&(M=U=65535&m|B<<16),B=M>>>16,S=65535&(x=A=65535&S|(K+=S>>>16)<<16),K=x>>>16,m+=65535&(M=(F>>>28|T<<4)^(T>>>2|F<<30)^(T>>>7|F<<25)),B+=M>>>16,S+=65535&(x=(T>>>28|F<<4)^(F>>>2|T<<30)^(F>>>7|T<<25)),K+=x>>>16,B+=(M=F&I^F&G^I&G)>>>16,S+=65535&(x=T&L^T&z^L&z),K+=x>>>16,c=65535&(S+=(B+=(m+=65535&M)>>>16)>>>16)|(K+=S>>>16)<<16,_=65535&m|B<<16,m=65535&(M=v),B=M>>>16,S=65535&(x=a),K=x>>>16,B+=(M=U)>>>16,S+=65535&(x=A),K+=x>>>16,L=o,z=i,R=h,P=a=65535&(S+=(B+=(m+=65535&M)>>>16)>>>16)|(K+=S>>>16)<<16,N=f,O=s,C=u,T=c,I=y,G=l,Z=w,q=v=65535&m|B<<16,V=p,X=b,D=g,F=_,d%16==15)for(E=0;E<16;E++)x=Y[E],m=65535&(M=k[E]),B=M>>>16,S=65535&x,K=x>>>16,x=Y[(E+9)%16],m+=65535&(M=k[(E+9)%16]),B+=M>>>16,S+=65535&x,K+=x>>>16,A=Y[(E+1)%16],m+=65535&(M=((U=k[(E+1)%16])>>>1|A<<31)^(U>>>8|A<<24)^(U>>>7|A<<25)),B+=M>>>16,S+=65535&(x=(A>>>1|U<<31)^(A>>>8|U<<24)^A>>>7),K+=x>>>16,A=Y[(E+14)%16],B+=(M=((U=k[(E+14)%16])>>>19|A<<13)^(A>>>29|U<<3)^(U>>>6|A<<26))>>>16,S+=65535&(x=(A>>>19|U<<13)^(U>>>29|A<<3)^A>>>6),K+=x>>>16,K+=(S+=(B+=(m+=65535&M)>>>16)>>>16)>>>16,Y[E]=65535&S|K<<16,k[E]=65535&m|B<<16;m=65535&(M=F),B=M>>>16,S=65535&(x=T),K=x>>>16,x=r[0],B+=(M=t[0])>>>16,S+=65535&x,K+=x>>>16,K+=(S+=(B+=(m+=65535&M)>>>16)>>>16)>>>16,r[0]=T=65535&S|K<<16,t[0]=F=65535&m|B<<16,m=65535&(M=I),B=M>>>16,S=65535&(x=L),K=x>>>16,x=r[1],B+=(M=t[1])>>>16,S+=65535&x,K+=x>>>16,K+=(S+=(B+=(m+=65535&M)>>>16)>>>16)>>>16,r[1]=L=65535&S|K<<16,t[1]=I=65535&m|B<<16,m=65535&(M=G),B=M>>>16,S=65535&(x=z),K=x>>>16,x=r[2],B+=(M=t[2])>>>16,S+=65535&x,K+=x>>>16,K+=(S+=(B+=(m+=65535&M)>>>16)>>>16)>>>16,r[2]=z=65535&S|K<<16,t[2]=G=65535&m|B<<16,m=65535&(M=Z),B=M>>>16,S=65535&(x=R),K=x>>>16,x=r[3],B+=(M=t[3])>>>16,S+=65535&x,K+=x>>>16,K+=(S+=(B+=(m+=65535&M)>>>16)>>>16)>>>16,r[3]=R=65535&S|K<<16,t[3]=Z=65535&m|B<<16,m=65535&(M=q),B=M>>>16,S=65535&(x=P),K=x>>>16,x=r[4],B+=(M=t[4])>>>16,S+=65535&x,K+=x>>>16,K+=(S+=(B+=(m+=65535&M)>>>16)>>>16)>>>16,r[4]=P=65535&S|K<<16,t[4]=q=65535&m|B<<16,m=65535&(M=V),B=M>>>16,S=65535&(x=N),K=x>>>16,x=r[5],B+=(M=t[5])>>>16,S+=65535&x,K+=x>>>16,K+=(S+=(B+=(m+=65535&M)>>>16)>>>16)>>>16,r[5]=N=65535&S|K<<16,t[5]=V=65535&m|B<<16,m=65535&(M=X),B=M>>>16,S=65535&(x=O),K=x>>>16,x=r[6],B+=(M=t[6])>>>16,S+=65535&x,K+=x>>>16,K+=(S+=(B+=(m+=65535&M)>>>16)>>>16)>>>16,r[6]=O=65535&S|K<<16,t[6]=X=65535&m|B<<16,m=65535&(M=D),B=M>>>16,S=65535&(x=C),K=x>>>16,x=r[7],B+=(M=t[7])>>>16,S+=65535&x,K+=x>>>16,K+=(S+=(B+=(m+=65535&M)>>>16)>>>16)>>>16,r[7]=C=65535&S|K<<16,t[7]=D=65535&m|B<<16,j+=128,e-=128}return e}function Q(r,t,n){var e,o=new Int32Array(8),i=new Int32Array(8),h=new Uint8Array(256),a=n;for(o[0]=1779033703,o[1]=3144134277,o[2]=1013904242,o[3]=2773480762,o[4]=1359893119,o[5]=2600822924,o[6]=528734635,o[7]=1541459225,i[0]=4089235720,i[1]=2227873595,i[2]=4271175723,i[3]=1595750129,i[4]=2917565137,i[5]=725511199,i[6]=4215389547,i[7]=327033209,J(o,i,t,n),n%=128,e=0;e<n;e++)h[e]=t[a-n+e];for(h[n]=128,h[(n=256-128*(n<112?1:0))-9]=0,f(h,n-8,a/536870912|0,a<<3),J(o,i,h,n),e=0;e<8;e++)f(r,8*e,o[e],i[e]);return 0}function W(r,t){var n=v(),e=v(),o=v(),i=v(),h=v(),a=v(),f=v(),s=v(),u=v();C(n,r[1],r[0]),C(u,t[1],t[0]),F(n,n,u),O(e,r[0],r[1]),O(u,t[0],t[1]),F(e,e,u),F(o,r[3],t[3]),F(o,o,y),F(i,r[2],t[2]),O(i,i,i),C(h,e,n),C(a,i,o),O(f,i,o),O(s,e,n),F(r[0],h,a),F(r[1],s,f),F(r[2],f,a),F(r[3],h,s)}function $(r,t,n){var e;for(e=0;e<4;e++)L(r[e],t[e],n)}function rr(r,t){var n=v(),e=v(),o=v();G(o,t[2]),F(n,t[0],o),F(e,t[1],o),z(r,e),r[31]^=P(n)<<7}function tr(r,t,n){var e,o;for(k(r[0],s),k(r[1],u),k(r[2],u),k(r[3],s),o=255;0<=o;--o)$(r,t,e=n[o/8|0]>>(7&o)&1),W(t,r),W(r,r),$(r,t,e)}function nr(r,t){var n=[v(),v(),v(),v()];k(n[0],e),k(n[1],a),k(n[2],u),F(n[3],e,a),tr(r,n,t)}function er(r,t,n){var e,o=new Uint8Array(64),i=[v(),v(),v(),v()];for(n||h(t,32),Q(o,t,32),o[0]&=248,o[31]&=127,o[31]|=64,nr(i,o),rr(r,i),e=0;e<32;e++)t[e+32]=r[e];return 0}var or=new Float64Array([237,211,245,92,26,99,18,88,214,156,247,162,222,249,222,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,16]);function ir(r,t){var n,e,o,i;for(e=63;32<=e;--e){for(n=0,o=e-32,i=e-12;o<i;++o)t[o]+=n-16*t[e]*or[o-(e-32)],n=t[o]+128>>8,t[o]-=256*n;t[o]+=n,t[e]=0}for(o=n=0;o<32;o++)t[o]+=n-(t[31]>>4)*or[o],n=t[o]>>8,t[o]&=255;for(o=0;o<32;o++)t[o]-=n*or[o];for(e=0;e<32;e++)t[e+1]+=t[e]>>8,r[e]=255&t[e]}function hr(r){var t,n=new Float64Array(64);for(t=0;t<64;t++)n[t]=r[t];for(t=0;t<64;t++)r[t]=0;ir(r,n)}function ar(r,t,n,e){var o,i,h=new Uint8Array(64),a=new Uint8Array(64),f=new Uint8Array(64),s=new Float64Array(64),u=[v(),v(),v(),v()];Q(h,e,32),h[0]&=248,h[31]&=127,h[31]|=64;var c=n+64;for(o=0;o<n;o++)r[64+o]=t[o];for(o=0;o<32;o++)r[32+o]=h[32+o];for(Q(f,r.subarray(32),n+32),hr(f),nr(u,f),rr(r,u),o=32;o<64;o++)r[o]=e[o];for(Q(a,r,n+64),hr(a),o=0;o<64;o++)s[o]=0;for(o=0;o<32;o++)s[o]=f[o];for(o=0;o<32;o++)for(i=0;i<32;i++)s[o+i]+=a[o]*h[i];return ir(r.subarray(32),s),c}function fr(r,t){var n=v(),e=v(),o=v(),i=v(),h=v(),a=v(),f=v();return k(r[2],u),N(r[1],t),I(o,r[1]),F(i,o,c),C(o,o,r[2]),O(i,r[2],i),I(h,i),I(a,h),F(f,a,h),F(n,f,o),F(n,n,i),function(r,t){var n,e=v();for(n=0;n<16;n++)e[n]=t[n];for(n=250;0<=n;n--)I(e,e),1!==n&&F(e,e,t);for(n=0;n<16;n++)r[n]=e[n]}(n,n),F(n,n,o),F(n,n,i),F(n,n,i),F(r[0],n,i),I(e,r[0]),F(e,e,i),R(e,o)&&F(r[0],r[0],l),I(e,r[0]),F(e,e,i),R(e,o)?-1:(P(r[0])===t[31]>>7&&C(r[0],s,r[0]),F(r[3],r[0],r[1]),0)}function sr(r,t,n,e){var o,i=new Uint8Array(32),h=new Uint8Array(64),a=[v(),v(),v(),v()],f=[v(),v(),v(),v()];if(-1,n<64)return-1;if(fr(f,e))return-1;for(o=0;o<n;o++)r[o]=t[o];for(o=0;o<32;o++)r[o+32]=e[o];if(Q(h,r,n),hr(h),tr(a,f,h),nr(f,t.subarray(32)),W(a,f),rr(i,a),n-=64,g(t,0,i,0)){for(o=0;o<n;o++)r[o]=0;return-1}for(o=0;o<n;o++)r[o]=t[o+64];return n}function ur(r,t){if(32!==r.length)throw new Error("bad key size");if(24!==t.length)throw new Error("bad nonce size")}function cr(){for(var r=0;r<arguments.length;r++)if(!(arguments[r]instanceof Uint8Array))throw new TypeError("unexpected type, use Uint8Array")}function yr(r){for(var t=0;t<r.length;t++)r[t]=0}i.lowlevel={crypto_core_hsalsa20:A,crypto_stream_xor:M,crypto_stream:x,crypto_stream_salsa20_xor:d,crypto_stream_salsa20:E,crypto_onetimeauth:B,crypto_onetimeauth_verify:S,crypto_verify_16:b,crypto_verify_32:g,crypto_secretbox:K,crypto_secretbox_open:Y,crypto_scalarmult:Z,crypto_scalarmult_base:q,crypto_box_beforenm:X,crypto_box_afternm:D,crypto_box:function(r,t,n,e,o,i){var h=new Uint8Array(32);return X(h,o,i),D(r,t,n,e,h)},crypto_box_open:function(r,t,n,e,o,i){var h=new Uint8Array(32);return X(h,o,i),j(r,t,n,e,h)},crypto_box_keypair:V,crypto_hash:Q,crypto_sign:ar,crypto_sign_keypair:er,crypto_sign_open:sr,crypto_secretbox_KEYBYTES:32,crypto_secretbox_NONCEBYTES:24,crypto_secretbox_ZEROBYTES:32,crypto_secretbox_BOXZEROBYTES:16,crypto_scalarmult_BYTES:32,crypto_scalarmult_SCALARBYTES:32,crypto_box_PUBLICKEYBYTES:32,crypto_box_SECRETKEYBYTES:32,crypto_box_BEFORENMBYTES:32,crypto_box_NONCEBYTES:24,crypto_box_ZEROBYTES:32,crypto_box_BOXZEROBYTES:16,crypto_sign_BYTES:64,crypto_sign_PUBLICKEYBYTES:32,crypto_sign_SECRETKEYBYTES:64,crypto_sign_SEEDBYTES:32,crypto_hash_BYTES:64},i.randomBytes=function(r){var t=new Uint8Array(r);return h(t,r),t},i.secretbox=function(r,t,n){cr(r,t,n),ur(n,t);for(var e=new Uint8Array(32+r.length),o=new Uint8Array(e.length),i=0;i<r.length;i++)e[i+32]=r[i];return K(o,e,e.length,t,n),o.subarray(16)},i.secretbox.open=function(r,t,n){cr(r,t,n),ur(n,t);for(var e=new Uint8Array(16+r.length),o=new Uint8Array(e.length),i=0;i<r.length;i++)e[i+16]=r[i];return e.length<32?null:0!==Y(o,e,e.length,t,n)?null:o.subarray(32)},i.secretbox.keyLength=32,i.secretbox.nonceLength=24,i.secretbox.overheadLength=16,i.scalarMult=function(r,t){if(cr(r,t),32!==r.length)throw new Error("bad n size");if(32!==t.length)throw new Error("bad p size");var n=new Uint8Array(32);return Z(n,r,t),n},i.scalarMult.base=function(r){if(cr(r),32!==r.length)throw new Error("bad n size");var t=new Uint8Array(32);return q(t,r),t},i.scalarMult.scalarLength=32,i.scalarMult.groupElementLength=32,i.box=function(r,t,n,e){var o=i.box.before(n,e);return i.secretbox(r,t,o)},i.box.before=function(r,t){cr(r,t),function(r,t){if(32!==r.length)throw new Error("bad public key size");if(32!==t.length)throw new Error("bad secret key size")}(r,t);var n=new Uint8Array(32);return X(n,r,t),n},i.box.after=i.secretbox,i.box.open=function(r,t,n,e){var o=i.box.before(n,e);return i.secretbox.open(r,t,o)},i.box.open.after=i.secretbox.open,i.box.keyPair=function(){var r=new Uint8Array(32),t=new Uint8Array(32);return V(r,t),{publicKey:r,secretKey:t}},i.box.keyPair.fromSecretKey=function(r){if(cr(r),32!==r.length)throw new Error("bad secret key size");var t=new Uint8Array(32);return q(t,r),{publicKey:t,secretKey:new Uint8Array(r)}},i.box.publicKeyLength=32,i.box.secretKeyLength=32,i.box.sharedKeyLength=32,i.box.nonceLength=24,i.box.overheadLength=i.secretbox.overheadLength,i.sign=function(r,t){if(cr(r,t),64!==t.length)throw new Error("bad secret key size");var n=new Uint8Array(64+r.length);return ar(n,r,r.length,t),n},i.sign.open=function(r,t){if(cr(r,t),32!==t.length)throw new Error("bad public key size");var n=new Uint8Array(r.length),e=sr(n,r,r.length,t);if(e<0)return null;for(var o=new Uint8Array(e),i=0;i<o.length;i++)o[i]=n[i];return o},i.sign.detached=function(r,t){for(var n=i.sign(r,t),e=new Uint8Array(64),o=0;o<e.length;o++)e[o]=n[o];return e},i.sign.detached.verify=function(r,t,n){if(cr(r,t,n),64!==t.length)throw new Error("bad signature size");if(32!==n.length)throw new Error("bad public key size");var e,o=new Uint8Array(64+r.length),i=new Uint8Array(64+r.length);for(e=0;e<64;e++)o[e]=t[e];for(e=0;e<r.length;e++)o[e+64]=r[e];return 0<=sr(i,o,o.length,n)},i.sign.keyPair=function(){var r=new Uint8Array(32),t=new Uint8Array(64);return er(r,t),{publicKey:r,secretKey:t}},i.sign.keyPair.fromSecretKey=function(r){if(cr(r),64!==r.length)throw new Error("bad secret key size");for(var t=new Uint8Array(32),n=0;n<t.length;n++)t[n]=r[32+n];return{publicKey:t,secretKey:new Uint8Array(r)}},i.sign.keyPair.fromSeed=function(r){if(cr(r),32!==r.length)throw new Error("bad seed size");for(var t=new Uint8Array(32),n=new Uint8Array(64),e=0;e<32;e++)n[e]=r[e];return er(t,n,!0),{publicKey:t,secretKey:n}},i.sign.publicKeyLength=32,i.sign.secretKeyLength=64,i.sign.seedLength=32,i.sign.signatureLength=64,i.hash=function(r){cr(r);var t=new Uint8Array(64);return Q(t,r,r.length),t},i.hash.hashLength=64,i.verify=function(r,t){return cr(r,t),0!==r.length&&0!==t.length&&(r.length===t.length&&0===w(r,0,t,0,r.length))},i.setPRNG=function(r){h=r},function(){var o="undefined"!=typeof self?self.crypto||self.msCrypto:null;if(o&&o.getRandomValues){i.setPRNG(function(r,t){var n,e=new Uint8Array(t);for(n=0;n<t;n+=65536)o.getRandomValues(e.subarray(n,n+Math.min(t-n,65536)));for(n=0;n<t;n++)r[n]=e[n];yr(e)})}else"undefined"!=typeof require&&(o=require("crypto"))&&o.randomBytes&&i.setPRNG(function(r,t){var n,e=o.randomBytes(t);for(n=0;n<t;n++)r[n]=e[n];yr(e)})}()}("undefined"!=typeof module&&module.exports?module.exports:self.nacl=self.nacl||{});

        //OYSTER DEPENDENCY TWEETNACL-UTIL-JS
        //https://github.com/dchest/tweetnacl-util-js
        !function(e,n){"use strict";"undefined"!=typeof module&&module.exports?module.exports=n():(e.nacl||(e.nacl={}),e.nacl.util=n())}(this,function(){"use strict";var e={};function o(e){if(!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(e))throw new TypeError("invalid encoding")}return e.decodeUTF8=function(e){if("string"!=typeof e)throw new TypeError("expected string");var n,r=unescape(encodeURIComponent(e)),t=new Uint8Array(r.length);for(n=0;n<r.length;n++)t[n]=r.charCodeAt(n);return t},e.encodeUTF8=function(e){var n,r=[];for(n=0;n<e.length;n++)r.push(String.fromCharCode(e[n]));return decodeURIComponent(escape(r.join("")))},"undefined"==typeof atob?void 0!==Buffer.from?(e.encodeBase64=function(e){return Buffer.from(e).toString("base64")},e.decodeBase64=function(e){return o(e),new Uint8Array(Array.prototype.slice.call(Buffer.from(e,"base64"),0))}):(e.encodeBase64=function(e){return new Buffer(e).toString("base64")},e.decodeBase64=function(e){return o(e),new Uint8Array(Array.prototype.slice.call(new Buffer(e,"base64"),0))}):(e.encodeBase64=function(e){var n,r=[],t=e.length;for(n=0;n<t;n++)r.push(String.fromCharCode(e[n]));return btoa(r.join(""))},e.decodeBase64=function(e){o(e);var n,r=atob(e),t=new Uint8Array(r.length);for(n=0;n<r.length;n++)t[n]=r.charCodeAt(n);return t}),e});

        function oy_uint8_hex(oy_input) {//DUPLICATED IN MAIN BLOCK
            let oy_return = "";
            for (let i in oy_input) oy_return += oy_input[i].toString(16).padStart(2, '0');
            return oy_return;
        }

        function oy_hash_gen(oy_input) {//DUPLICATED IN MAIN BLOCK
            return oy_uint8_hex(nacl.hash(nacl.util.decodeUTF8(oy_input))).substr(0, 40);
        }

        function oy_block_work(oy_key_public, oy_block_hash, oy_work_difficulty) {
            return oy_hash_gen((oy_key_public+oy_block_hash).repeat(oy_work_difficulty));
        }

        function oy_block_sync_hop(oy_dive_ledger, oy_passport_passive, oy_passport_crypt, oy_crypt_short, oy_first) {
            if (oy_passport_passive.length===0) return oy_first!==true;
            let oy_node_select = oy_passport_passive.pop();
            if (oy_first===false&&typeof(oy_dive_ledger[oy_node_select])==="undefined") return false;
            let oy_crypt_select = oy_passport_crypt.pop();
            if (oy_key_verify(oy_node_select, oy_crypt_select, oy_crypt_short)) return oy_block_sync_hop(oy_dive_ledger, oy_passport_passive, oy_passport_crypt, oy_crypt_short, false);
            return false;
        }

        function oy_block_command_hash(oy_sync_command) {//DUPLICATED IN MAIN BLOCK
            let oy_command_pool = {};
            for (let i in oy_sync_command) {
                if (oy_sync_command[i].length!==2) return false;

                let oy_command_hash = oy_hash_gen(JSON.stringify(oy_sync_command[i][0]));
                if (typeof(oy_command_pool[oy_command_hash])!=="undefined") return false;
                oy_command_pool[oy_command_hash] = true;
                oy_sync_command[i][2] = oy_command_hash;
            }
            return oy_sync_command;
        }

        function oy_block_command_verify(oy_command_array, oy_command_crypt, oy_command_hash) {//DUPLICATED IN MAIN BLOCK
            if (typeof(oy_command_array[0])==="undefined"||//check that a command was given
                typeof(OY_BLOCK_COMMANDS[oy_command_array[0]])==="undefined"||//check that the signed command is a recognizable command
                !Number.isInteger(oy_command_array[1][1])||//check that the assigned fee is a valid integer
                oy_command_array[1][1]<0||//check that the assigned fee is a positive number
                oy_command_array[1][1]>OY_AKOYA_LIQUID) {//prevent integer overflow for the assigned fee
                return false;
            }

            if (oy_key_verify(oy_command_array[2], oy_command_crypt, oy_command_hash)) return OY_BLOCK_COMMANDS[oy_command_array[0]][0](oy_command_array);
            else return false;
        }

        function oy_block_command_scan(oy_command_verify) {//DUPLICATED IN MAIN BLOCK
            if (oy_command_verify.length===0) return true;
            let [oy_command_array, oy_command_crypt, oy_command_hash] = oy_command_verify.pop();
            if (oy_block_command_verify(oy_command_array, oy_command_crypt, oy_command_hash)) return oy_block_command_scan(oy_command_verify);
            else return false;
        }

        function oy_key_verify(oy_key_public, oy_key_signature, oy_key_data) {//DUPLICATED IN MAIN BLOCK
            return nacl.sign.detached.verify(nacl.util.decodeUTF8(oy_key_data), nacl.util.decodeBase64(oy_key_signature), nacl.util.decodeBase64(oy_key_public.substr(1)+"="));
        }

        self.onmessage = function(oy_event) {
            let [oy_work_type, oy_work_data] = oy_event.data;

            if (oy_work_type===0) {
                let [oy_self_public, oy_block_hash, oy_work_difficulty] = oy_work_data;

                postMessage([oy_work_type, [oy_block_work(oy_self_public, oy_block_hash, oy_work_difficulty)]]);
            }
            else if (oy_work_type===1) {
                let [oy_data_payload, oy_dive_ledger, oy_crypt_short, oy_sync_expand, oy_block_boot, oy_block_hash, oy_work_difficulty, oy_payload_size] = oy_work_data;

                if (oy_block_sync_hop(oy_dive_ledger, oy_data_payload[0].slice(), oy_data_payload[1].slice(), oy_crypt_short, true)||oy_block_boot===true) {
                    let oy_sync_hash = oy_hash_gen(oy_data_payload[4]);
                    if (oy_key_verify(oy_data_payload[0][0], oy_data_payload[2], oy_data_payload[3]+oy_sync_hash+oy_data_payload[5])) {
                        let oy_sync_command = oy_block_command_hash(JSON.parse(oy_sync_expand));
                        if (oy_sync_command===false) return false;
                        if (oy_block_command_scan(oy_sync_command)&&oy_block_work(oy_data_payload[0][0], oy_block_hash, oy_work_difficulty)===oy_data_payload[5]) postMessage([oy_work_type, [true, oy_data_payload, oy_sync_command, oy_payload_size]]);
                        else postMessage([oy_work_type, [false, oy_data_payload, null, null]]);
                    }
                    else postMessage([oy_work_type, [false, oy_data_payload, null, null]]);
                }
            }
        }
    }
    if (oy_worker_status===false) OY_WORKER_THREADS = null;
    else if (oy_worker_status===true&&OY_WORKER_THREADS===null) {
        let oy_worker_define = URL.createObjectURL(new Blob(["("+oy_worker_internal.toString()+")()"], {type: 'text/javascript'}));
        OY_WORKER_THREADS = new Array(oy_worker_cores());
        OY_WORKER_THREADS.fill(null);
        OY_WORKER_POINTER = 0;
        for (let i in OY_WORKER_THREADS) {
            OY_WORKER_THREADS[i] = new Worker(oy_worker_define);
            OY_WORKER_THREADS[i].onmessage = function(oy_event) {
                let [oy_work_type, oy_work_data] = oy_event.data;

                let oy_time_local = Date.now()/1000;
                if (oy_work_type===0) {
                    let [oy_work_hash] = oy_work_data;

                    if (oy_time_local-OY_BLOCK_TIME<OY_BLOCK_SECTORS[0][0]-OY_MESH_BUFFER[0]) OY_WORK_HASH = null;
                    else OY_WORK_HASH = oy_work_hash;
                }
                else if (oy_work_type===1) {
                    let [oy_response_flag, oy_data_payload, oy_sync_command, oy_payload_size] = oy_work_data;

                    let oy_time_offset = oy_time_local-OY_BLOCK_TIME;
                    if (oy_response_flag===true&&oy_time_offset<OY_BLOCK_SECTORS[1][0]+OY_MESH_BUFFER[0]) {
                        OY_BLOCK_SYNC[oy_data_payload[0][0]] = [oy_data_payload[2], oy_sync_command];

                        if (typeof(OY_BLOCK[1][OY_SELF_PUBLIC])!=="undefined"||OY_BLOCK_BOOT!==false) {
                            oy_data_payload[1].push(oy_key_sign(OY_SELF_PRIVATE, oy_short(oy_data_payload[2])));
                            oy_data_route("OY_LOGIC_SYNC", "OY_BLOCK_SYNC", oy_data_payload);
                        }

                        if (oy_time_offset>OY_SYNC_LAST[1]) OY_SYNC_LAST[1] = oy_time_offset;
                        if (OY_BOOST_BUILD.length<OY_BOOST_KEEP&&OY_BOOST_BUILD.indexOf(oy_data_payload[0])===-1) OY_BOOST_BUILD.push(oy_data_payload[0][0]);

                        if (oy_payload_size===null) oy_payload_size = JSON.stringify(oy_data_payload).length;
                        if (typeof(OY_BLOCK_LEARN[oy_data_payload[0].length])!=="undefined") OY_BLOCK_LEARN[oy_data_payload[0].length][oy_data_payload[0][0]] = oy_time_offset/oy_payload_size;
                        if (typeof(OY_BLOCK_MAP)==="function") OY_BLOCK_MAP(1, false);
                    }
                    else OY_BLOCK_SYNC[oy_data_payload[0][0]] = false;
                }
            };
        }
    }
}
//WEB WORKER BLOCK

function oy_log(oy_log_msg, oy_log_flag) {
    //oy_log_debug(oy_log_msg);
    if (OY_PASSIVE_MODE===true) return false;
    if (typeof(oy_log_flag)==="undefined") oy_log_flag = 0;
    if (oy_log_flag===1) oy_log_msg = "FATAL ERROR: "+oy_log_msg;
    if (OY_CONSOLE===undefined) console.log(oy_log_msg);
    else OY_CONSOLE(oy_log_msg);
}

// noinspection JSUnusedGlobalSymbols
function oy_log_debug(oy_log_msg) {
    if (OY_SELF_SHORT===null) return false;
    oy_log_msg = "["+(Date.now()/1000)+"] "+oy_log_msg;
    let oy_xhttp = new XMLHttpRequest();
    oy_xhttp.open("POST", "https://top.oyster.org/oy_log_catch.php", true);
    oy_xhttp.send("oy_log_catch="+JSON.stringify([OY_SELF_SHORT, oy_log_msg]));
}

function oy_short(oy_message) {
    return oy_message.substr(0, OY_SHORT_LENGTH);
}

function oy_chrono(oy_chrono_callback, oy_chrono_duration) {
    let oy_chrono_elapsed = 0;
    let oy_chrono_last = performance.now();

    let oy_chrono_instance = function() {
        oy_chrono_elapsed += performance.now()-oy_chrono_last;
        if (oy_chrono_elapsed>=oy_chrono_duration) return oy_chrono_callback();
        setTimeout(oy_chrono_instance, OY_CHRONO_ACCURACY);
        oy_chrono_last = performance.now();
    };
    oy_chrono_instance();
}

function oy_shuffle(a) {
    let j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function oy_rand_gen(oy_gen_custom, oy_rand_secure) {
    if (typeof(oy_gen_custom)==="undefined") oy_gen_custom = 1;
    if (typeof(oy_rand_secure)!=="undefined"&&oy_rand_secure===true) return oy_uint8_hex(nacl.randomBytes(oy_gen_custom*2));
    let oy_rand_gen_fast = function() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    };
    if (oy_gen_custom===1) return oy_rand_gen_fast();
    return "x".repeat(oy_gen_custom).replace(/x/g, oy_rand_gen_fast);
}

function oy_uint8_hex(oy_input) {//DUPLICATED IN WEB WORKER BLOCK
    let oy_return = "";
    for (let i in oy_input) oy_return += oy_input[i].toString(16).padStart(2, '0');
    return oy_return;
}

function oy_clone_object(oy_input) {
    return JSON.parse(JSON.stringify(oy_input));
}

function oy_hash_gen(oy_input) {//DUPLICATED IN WEB WORKER BLOCK
    return oy_uint8_hex(nacl.hash(nacl.util.decodeUTF8(oy_input))).substr(0, 40);
}

function oy_hash_check(oy_input) {
    return (oy_an_check(oy_input)&&oy_input.length===40);
}

function oy_buffer_encode(oy_buffer_text, oy_buffer_base64) {
    let binary_string;
    if (oy_buffer_base64===true) binary_string = window.atob(oy_buffer_text);
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

//encrypt data
//WARNING, oy_crypt_pass **MUST** be unique each time this function is invoked (because the nonce is static)
function oy_crypt_encrypt(oy_crypt_data, oy_crypt_pass) {
    return nacl.util.encodeBase64(nacl.secretbox(nacl.util.decodeUTF8(oy_crypt_data), new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 29, 20, 21, 22, 23, 24]), nacl.hash(nacl.util.decodeUTF8(oy_crypt_pass)).slice(0, 32)));
}

//decrypt data
function oy_crypt_decrypt(oy_crypt_cipher, oy_crypt_pass) {
    let oy_return = nacl.secretbox.open(nacl.util.decodeBase64(oy_crypt_cipher), new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 29, 20, 21, 22, 23, 24]), nacl.hash(nacl.util.decodeUTF8(oy_crypt_pass)).slice(0, 32));
    if (oy_return!==null) oy_return = nacl.util.encodeUTF8(oy_return);
    return oy_return;
}

function oy_key_sign(oy_key_private, oy_key_data) {
    return nacl.util.encodeBase64(nacl.sign.detached(nacl.util.decodeUTF8(oy_key_data), nacl.util.decodeBase64(oy_key_private)));
}

function oy_key_verify(oy_key_public, oy_key_signature, oy_key_data) {//DUPLICATED IN WEB WORKER BLOCK
    return nacl.sign.detached.verify(nacl.util.decodeUTF8(oy_key_data), nacl.util.decodeBase64(oy_key_signature), nacl.util.decodeBase64(oy_key_public.substr(1)+"="));
}

function oy_key_hash(oy_key_public_raw) {
    let oy_hash_reference = "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let oy_hash_index = 0;
    for (let oy_char of oy_key_public_raw) oy_hash_index ^= oy_char.charCodeAt(0);
    while (oy_hash_index>61) oy_hash_index -= 61;
    return oy_hash_reference[oy_hash_index];
}

function oy_key_gen(oy_key_private) {
    let oy_key_pair;
    if (typeof(oy_key_private)==="undefined") oy_key_pair = nacl.sign.keyPair();
    else oy_key_pair = nacl.sign.keyPair.fromSecretKey(nacl.util.decodeBase64(oy_key_private));

    let oy_key_public_raw = nacl.util.encodeBase64(oy_key_pair.publicKey).substr(0, 43);
    if (!oy_an_check(oy_key_public_raw)) return oy_key_gen();
    return [nacl.util.encodeBase64(oy_key_pair.secretKey), oy_key_hash(oy_key_public_raw)+oy_key_public_raw];
}

function oy_key_check(oy_key_public) {
    return typeof(oy_key_public)==="string"&&oy_key_public.substr(0, 1)===oy_key_hash(oy_key_public.substr(1));
}

function oy_an_check(oy_input) {
    if (typeof(oy_input)!=="string") return false;

    let code, i, len;
    for (i = 0, len = oy_input.length; i < len; i++) {
        code = oy_input.charCodeAt(i);
        if (!(code > 47 && code < 58) && // numeric (0-9)
            !(code > 64 && code < 91) && // upper alpha (A-Z)
            !(code > 96 && code < 123)) { // lower alpha (a-z)
            return false;
        }
    }
    return true;
}

function oy_handle_check(oy_data_handle) {
    return typeof(oy_data_handle)==="string"&&oy_data_handle.substr(0, 2)==="OY"&&oy_data_handle.length>20;
}

function oy_reduce_sum(oy_reduce_total, oy_reduce_num) {
    return oy_reduce_total + oy_reduce_num;
}

function oy_db_error(oy_error) {
    if ((oy_error.name==="QuotaExceededError")||(oy_error.inner&&oy_error.inner.name==="QuotaExceededError")) oy_data_deposit_purge();
    else oy_log("OY_DB ERROR: "+oy_error.name+" / "+oy_error.message);
}

function oy_local_get(oy_local_name, oy_local_default, oy_callback) {
    OY_DB.oy_local.get(oy_local_name)
        .then(oy_obj => {
            if (oy_obj.oy_local_value===undefined) oy_callback(oy_local_default);
            else oy_callback(oy_obj.oy_local_value);
        })
        .catch(function(){});
}

function oy_local_set(oy_local_name, oy_local_data) {
    OY_DB.oy_local.put({oy_local_key:oy_local_name, oy_local_value:oy_local_data})
        .then(function() {
            oy_log("Updated local retention of "+oy_local_name);
        })
        .catch(oy_db_error);
    return true;
}

//oy_state_flag
function oy_peer_add(oy_peer_id, oy_state_flag) {
    if (oy_state_flag===null) return false;

    if (oy_peer_check(oy_peer_id)) {
        oy_log("Failed to add node "+oy_short(oy_peer_id)+" to peer list that already exists in peer list");
        return false;//cancel if peer already exists in list
    }
    let oy_callback_local = function() {
        //[peership timestamp, last msg timestamp, last latency timestamp, latency avg, latency history, data beam, data beam history, data soak, data soak history, latch flag, base sent]
        if (OY_PEER_COUNT>=OY_PEER_MAX) return false;//prevent overflow on peer_count
        OY_PEER_COUNT++;
        if (oy_state_flag===1) OY_LATCH_COUNT++;
        OY_PEERS[oy_peer_id] = [Date.now()/1000|0, -1, -1, 0, [], 0, [], 0, [], oy_state_flag, false];
        if (OY_PEER_COUNT===1) document.dispatchEvent(OY_PEERS_RECOVER);
        oy_node_reset(oy_peer_id);
    };
    oy_node_connect(oy_peer_id, oy_callback_local);
    return true;
}

function oy_peer_remove(oy_peer_id, oy_remove_reason) {
    if (!oy_peer_check(oy_peer_id)) return false;console.log("REMOVE: "+oy_remove_reason);

    OY_PEER_COUNT--;
    if (OY_PEERS[oy_peer_id][9]===1) OY_LATCH_COUNT--;
    if (OY_PEER_COUNT===0) document.dispatchEvent(OY_PEERS_NULL);
    delete OY_PEERS[oy_peer_id];
    oy_node_reset(oy_peer_id);

    if (OY_PEER_COUNT<0||OY_LATCH_COUNT<0) {
        oy_log("Peer management system failed", 1);
        return false;
    }

    oy_data_beam(oy_peer_id, "OY_PEER_TERMINATE", (typeof(oy_remove_reason)==="undefined")?"OY_REASON_PEER_REMOVE":oy_remove_reason);
    oy_log("Removed peer "+oy_short(oy_peer_id)+" with reason "+oy_remove_reason);
}

//checks if node is in mutually paired list
function oy_peer_check(oy_node_id) {
    return typeof(OY_PEERS[oy_node_id])!=="undefined";
}

function oy_peer_pre_add(oy_node_id) {
    OY_PEERS_PRE[oy_node_id] = (Date.now()/1000|0)+OY_PEER_PRETIME;
    return true;
}

function oy_peer_pre_check(oy_node_id) {
    return typeof OY_PEERS_PRE[oy_node_id]!=="undefined"&&OY_PEERS_PRE[oy_node_id]>=(Date.now()/1000|0);
}

//updates latency tracking of peer
function oy_peer_latency(oy_peer_id, oy_latency_new) {
    if (!oy_peer_check(oy_peer_id)) {
        oy_log("Peer latency tracking was called on a non-existent peer");
        return false;
    }
    OY_PEERS[oy_peer_id][4].unshift(oy_latency_new);
    if (OY_PEERS[oy_peer_id][4].length>OY_LATENCY_TRACK) OY_PEERS[oy_peer_id][4].pop();
    OY_PEERS[oy_peer_id][3] = (OY_PEERS[oy_peer_id][4].reduce(oy_reduce_sum))/OY_PEERS[oy_peer_id][4].length;
    oy_log("Latency data updated for peer "+oy_short(oy_peer_id));
}

//checks if short id of node correlates with a mutual peer or a latch
function oy_peer_find(oy_peer_short) {
    if (oy_peer_short===OY_SELF_SHORT) return false;
    for (let oy_peer_local in OY_PEERS) {
        if (oy_peer_local==="oy_aggregate_node"||OY_PEERS[oy_peer_local][9]===0) continue;
        if (oy_peer_short===oy_short(oy_peer_local)) return oy_peer_local;
    }
    return false;
}

//select a random peer, includes latches
function oy_peer_rand(oy_peers_exception) {
    let oy_peers_local = {};
    for (let oy_peer_local in OY_PEERS) {
        if (oy_peer_local==="oy_aggregate_node"||OY_PEERS[oy_peer_local][9]===0||oy_peers_exception.indexOf(oy_short(oy_peer_local))!==-1) continue;
        oy_peers_local[oy_peer_local] = true;
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
    let oy_time_local = Date.now()/1000;
    OY_PEERS[oy_peer_id][1] = oy_time_local;//update last msg timestamp for peer
    if (oy_data_flag==="OY_BLOCK_COMMAND") {
        //oy_data_payload = [oy_route_passport_passive, oy_command_array, oy_command_crypt]
        if (oy_data_payload.length!==4||typeof(oy_data_payload[0])!=="object") {
            oy_node_punish(oy_peer_id, "OY_PUNISH_COMMAND_INVALID");
            return false;
        }

        if (OY_BLOCK_HASH!==null&&//check that there is a known meshblock hash
            oy_data_payload[1][1][1]!==-1&&//check that transact priority isn't set to full node override
            oy_data_payload[1][1][0]<oy_time_local+OY_MESH_BUFFER[0]&&//check that the broadcast timestamp is not in the future, with buffer leniency
            oy_data_payload[1][1][0]<OY_BLOCK_TIME&&//check that the broadcast timestamp is in the first sector of the current block
            oy_data_payload[1][1][0]>=OY_BLOCK_TIME-20) {//check that the broadcast timestamp is in the first sector of the current block

            if (OY_LIGHT_STATE===true) oy_data_route("OY_LOGIC_UPSTREAM", "OY_BLOCK_COMMAND", oy_data_payload);
            else {
                let oy_command_hash = oy_hash_gen(JSON.stringify(oy_data_payload[1]));
                if (oy_block_command_verify(oy_data_payload[1], oy_data_payload[2], oy_command_hash)) {
                    OY_BLOCK_COMMAND[oy_command_hash] = [oy_data_payload[1], oy_data_payload[2]];
                    if (typeof(OY_BLOCK_MAP)==="function") OY_BLOCK_MAP(0, false);
                }
            }
        }
        return true;
    }
    else if (oy_data_flag==="OY_BLOCK_SYNC") {
        //oy_data_payload = [oy_route_passport_passive, oy_route_passport_crypt, oy_sync_crypt, oy_sync_time, oy_sync_command, oy_work_hash]
        if (oy_data_payload.length!==6||typeof(oy_data_payload[0])!=="object"||typeof(oy_data_payload[1])!=="object"||oy_data_payload[0].length===0||oy_data_payload[0].length!==oy_data_payload[1].length||!oy_key_check(oy_data_payload[0][0])) {
            oy_node_punish(oy_peer_id, "OY_PUNISH_SYNC_INVALID");
            return false;
        }

        let oy_payload_size = null;let debug = [];
        let oy_sync_pass = 0;
debug.push(1);
        if (oy_data_payload[0][0]===OY_SELF_PUBLIC) return true;

        if (typeof(OY_BLOCK_SYNC[oy_data_payload[0][0]])!=="undefined") {
            if (OY_BLOCK_SYNC[oy_data_payload[0][0]]!==false&&OY_BLOCK_SYNC[oy_data_payload[0][0]][0]!==oy_data_payload[2]) oy_sync_pass = 1;
            else oy_sync_pass = 2;
        }
        debug.push(2);
        debug.push([oy_time_local-OY_BLOCK_TIME, OY_BLOCK_SECTORS[1][0]+OY_MESH_BUFFER[0]]);
        if (oy_sync_pass!==2&&
            OY_LIGHT_STATE===false&&//check that self is running block_sync as a full node
            OY_BLOCK_HASH!==null&&//check that there is a known meshblock hash
            oy_data_payload[3]<oy_time_local+OY_MESH_BUFFER[0]&&//check that the broadcast timestamp is not in the future, with buffer leniency
            oy_data_payload[3]>=OY_BLOCK_TIME&&//check that the broadcast timestamp is in the sync processing zone
            oy_time_local+OY_MESH_BUFFER[0]>=OY_BLOCK_TIME&&//check that the current timestamp is in the sync processing zone
            oy_time_local-OY_BLOCK_TIME<OY_BLOCK_SECTORS[1][0]+OY_MESH_BUFFER[0]&&//check that the current timestamp is in the sync processing zone
            (true||OY_BLOCK_BOOT===true||(typeof(OY_BLOCK_JUDGE[oy_data_payload[0].length])!=="undefined"&&(oy_time_local-OY_BLOCK_TIME)/(oy_payload_size = JSON.stringify(oy_data_payload).length)<OY_BLOCK_JUDGE[oy_data_payload[0].length]))) {
            debug.push(3);
            if (oy_sync_pass===1) {
                debug.push(4);
                OY_BLOCK_SYNC[oy_data_payload[0][0]] = false;
                oy_data_route("OY_LOGIC_SYNC", "OY_BLOCK_SYNC", oy_data_payload);
            }
            else {
                /*
                function oy_block_sync_hop2(oy_dive_ledger, oy_passport_passive, oy_passport_crypt, oy_crypt_short, oy_first) {
                    if (oy_passport_passive.length===0) return oy_first!==true;
                    let oy_node_select = oy_passport_passive.pop();
                    console.log("HOP: "+JSON.stringify([oy_crypt_short, oy_short(oy_node_select), typeof(oy_dive_ledger[oy_node_select])]));
                    if (oy_first===false&&typeof(oy_dive_ledger[oy_node_select])==="undefined") {
                        return false;
                    }
                    let oy_crypt_select = oy_passport_crypt.pop();
                    let result = oy_key_verify(oy_node_select, oy_crypt_select, oy_crypt_short);
                    if (result) {
                        return oy_block_sync_hop2(oy_dive_ledger, oy_passport_passive, oy_passport_crypt, oy_crypt_short, false);
                    }
                    return false;
                }
                console.log("HOP FINAL: "+oy_block_sync_hop2(OY_BLOCK[1], oy_data_payload[0].slice(), oy_data_payload[1].slice(), oy_short(oy_data_payload[2]), true));
                */
                OY_WORKER_THREADS[oy_worker_point()].postMessage([1, [oy_data_payload, OY_BLOCK[1], oy_short(oy_data_payload[2]), LZString.decompressFromUTF16(oy_data_payload[4]), OY_BLOCK_BOOT, OY_BLOCK_HASH, OY_BLOCK[0][3], oy_payload_size]]);
            }
            debug.push(5);
        }
        debug.push(6);
        if (oy_data_payload[0].length===1) oy_log_debug("SYNC-DEBUG: ["+oy_peer_id+"]"+JSON.stringify(debug));
        return true;
    }
    else if (oy_data_flag==="OY_DATA_PUSH") {//store received data and potentially forward the push request to peers
        //oy_data_payload = [oy_route_passport_passive, oy_data_handle, oy_data_nonce, oy_data_value]
        //data received here will be committed to data_deposit with only randomness restrictions, mesh flow restrictions from oy_init() are sufficient
        if (oy_data_payload.length!==4||typeof(oy_data_payload[0])!=="object"||!oy_handle_check(oy_data_payload[1])||oy_data_payload[3].length>OY_DATA_CHUNK) {
            oy_node_punish(oy_peer_id, "OY_PUNISH_PUSH_INVALID");
            return false;
        }
        oy_data_deposit(oy_data_payload[1], oy_data_payload[2], oy_data_payload[3], function(oy_stored) {
            if (oy_stored===true) oy_data_route("OY_LOGIC_FOLLOW", "OY_DATA_DEPOSIT", [[], oy_data_payload[0], OY_SELF_SHORT, oy_data_payload[1], oy_data_payload[2]]);
        });
        if (Math.random()<=OY_MESH_PUSH_CHANCE) {
            oy_log("Randomness led to beaming handle "+oy_short(oy_data_payload[1])+" forward along the mesh");
            oy_data_route("OY_LOGIC_CHAOS", "OY_DATA_PUSH", oy_data_payload);
        }
        return true;
    }
    else if (oy_data_flag==="OY_DATA_PULL") {
        //oy_data_payload = [oy_route_passport_passive, oy_route_dynamic, oy_data_handle, oy_data_nonce_set]
        if (oy_data_payload.length!==4||typeof(oy_data_payload[0])!=="object"||!oy_handle_check(oy_data_payload[2])||oy_data_payload[3].length>OY_DATA_PULL_NONCE_MAX) {
            oy_node_punish(oy_peer_id, "OY_PUNISH_PULL_INVALID");
            return false;
        }
        oy_log("Beaming handle "+oy_short(oy_data_payload[2])+" forward along the mesh");
        oy_data_route("OY_LOGIC_ALL", "OY_DATA_PULL", oy_data_payload);
        for (let i in oy_data_payload[3]) {
            oy_data_deposit_get(oy_data_payload[2], oy_data_payload[3][i], function(oy_deposit_get) {
                if (!!oy_deposit_get) {
                    oy_log("Found nonce "+oy_data_payload[3][i]+" for handle "+oy_data_payload[2]);
                    oy_data_route("OY_LOGIC_FOLLOW", "OY_DATA_FULFILL", [[], oy_data_payload[0], "oy_source_void", oy_data_payload[2], oy_data_payload[3][i], oy_deposit_get]);
                }
            });
        }
        return true;
    }
    else if (oy_data_flag==="OY_DATA_DEPOSIT") {
        //oy_data_payload = [oy_route_passport_passive, oy_route_passport_active, oy_data_source, oy_data_handle, oy_data_nonce]
        if (oy_data_payload.length!==5||typeof(oy_data_payload[0])!=="object"||typeof(oy_data_payload[1])!=="object"||oy_data_payload[1].length===0||!oy_handle_check(oy_data_payload[3])) {
            oy_node_punish(oy_peer_id, "OY_PUNISH_DEPOSIT_INVALID");
            return false;
        }
        if (oy_data_payload[1][0]===OY_SELF_SHORT) {
            oy_log("Data deposit sequence with handle "+oy_short(oy_data_payload[3])+" at nonce "+oy_data_payload[4]+" found self");
            oy_data_tally(oy_data_payload[2], oy_data_payload[3], oy_data_payload[4], oy_data_payload[0].length);
        }
        else {//carry on reversing the passport until the data reaches the intended destination
            oy_log("Continuing deposit confirmation of handle "+oy_short(oy_data_payload[3]));
            oy_data_route("OY_LOGIC_FOLLOW", "OY_DATA_DEPOSIT", oy_data_payload);
        }
        return true;
    }
    else if (oy_data_flag==="OY_DATA_FULFILL") {
        //oy_data_payload = [oy_route_passport_passive, oy_route_passport_active, oy_data_source, oy_data_handle, oy_data_nonce, oy_data_value]
        if (oy_data_payload.length!==6||typeof(oy_data_payload[0])!=="object"||typeof(oy_data_payload[1])!=="object"||!oy_handle_check(oy_data_payload[3])) {
            oy_node_punish(oy_peer_id, "OY_PUNISH_FULFILL_INVALID");
            return false;
        }
        if (oy_data_payload[1][0]===OY_SELF_SHORT) {
            oy_log("Data fulfillment sequence with handle "+oy_short(oy_data_payload[3])+" at nonce "+oy_data_payload[4]+" found self");
            oy_data_collect(oy_data_payload[2], oy_data_payload[3], oy_data_payload[4], oy_data_payload[5], oy_data_payload[0].length);
        }
        else {//carry on reversing the passport until the data reaches the intended destination
            oy_log("Continuing fulfillment of handle "+oy_short(oy_data_payload[3]));
            if (oy_data_payload[1].length===OY_MESH_SOURCE) oy_data_payload[2] = oy_data_payload[1].join("!");
            oy_data_route("OY_LOGIC_FOLLOW", "OY_DATA_FULFILL", oy_data_payload);
            if (Math.random()<=OY_MESH_FULLFILL_CHANCE) {
                oy_log("Data deposit upon mesh fulfill invoked for handle "+oy_short(oy_data_payload[3]));
                oy_data_deposit(oy_data_payload[3], oy_data_payload[4], oy_data_payload[5]);
            }
        }
        return true;
    }
    else if (oy_data_flag==="OY_CHANNEL_BROADCAST") {
        //oy_data_payload = [oy_route_passport_passive, oy_route_dynamic, oy_channel_id, oy_channel_payload, oy_payload_crypt, oy_key_public, oy_broadcast_time, oy_top_count]
        if (oy_data_payload.length!==8||typeof(oy_data_payload[0])!=="object"||!oy_channel_check(oy_data_payload[2])) {
            oy_node_punish(oy_peer_id, "OY_PUNISH_CHANNEL_INVALID");
            return false;
        }
        let oy_verify_pass = oy_channel_verify(oy_data_payload);
        if (oy_verify_pass===null) oy_log("Was unable to verify broadcast from channel "+oy_short(oy_data_payload[2])+" at no fault of the sending peer");
        else if (oy_verify_pass===true) {
            oy_log("Beaming channel "+oy_short(oy_data_payload[2])+" forward along the mesh");
            oy_data_route("OY_LOGIC_ALL", "OY_CHANNEL_BROADCAST", oy_data_payload);
            if (typeof(OY_CHANNEL_LISTEN[oy_data_payload[2]])!=="undefined") {
                oy_channel_top(oy_data_payload[2], oy_data_payload[0], oy_data_payload[5]);

                let oy_broadcast_hash = oy_hash_gen(oy_data_payload[4]);

                let oy_echo_beam = function() {
                    if (OY_CHANNEL_LISTEN[oy_data_payload[2]][0]===null) return false;
                    oy_log("Beaming echo for channel "+oy_short(oy_data_payload[2]));
                    oy_data_route("OY_LOGIC_FOLLOW", "OY_CHANNEL_ECHO", [[], oy_data_payload[0], oy_data_payload[1], oy_data_payload[2], oy_key_sign(OY_CHANNEL_LISTEN[oy_data_payload[2]][0], oy_broadcast_hash), OY_CHANNEL_LISTEN[oy_data_payload[2]][1]]);
                };

                if (oy_data_payload[3]==="OY_CHANNEL_PING") {
                    oy_log("Received ping broadcast for channel "+oy_short(oy_data_payload[2]));
                    oy_echo_beam();
                    return true;
                }

                if (Math.abs(oy_data_payload[7]-oy_channel_top_count(oy_data_payload[2]))>OY_CHANNEL_TOP_TOLERANCE) return false;

                if (typeof(OY_CHANNEL_RENDER[oy_data_payload[2]])==="undefined") OY_CHANNEL_RENDER[oy_data_payload[2]] = {};

                if (typeof(OY_CHANNEL_RENDER[oy_data_payload[2]][oy_broadcast_hash])!=="undefined") {
                    oy_log("Already rendered broadcast hash "+oy_short(oy_broadcast_hash)+" from channel "+oy_short(oy_data_payload[2])+", will ignore");
                    return false;
                }

                OY_CHANNEL_RENDER[oy_data_payload[2]][oy_broadcast_hash] = true;
                let oy_render_payload = oy_data_payload.slice();
                oy_render_payload[3] = LZString.decompressFromUTF16(oy_render_payload[3]);
                OY_CHANNEL_LISTEN[oy_data_payload[2]][2](oy_broadcast_hash, oy_render_payload);
                oy_render_payload = null;

                let oy_broadcast_payload = oy_data_payload.slice();
                oy_broadcast_payload[0] = null;
                oy_broadcast_payload[1] = null;
                oy_broadcast_payload[8] = [];

                if (OY_CHANNEL_LISTEN[oy_data_payload[2]][0]!==null) {
                    oy_broadcast_payload[8].push([oy_key_sign(OY_CHANNEL_LISTEN[oy_data_payload[2]][0], oy_broadcast_hash), OY_CHANNEL_LISTEN[oy_data_payload[2]][1]]);
                    if (typeof(OY_CHANNEL_KEEP[oy_data_payload[2]])==="undefined") OY_CHANNEL_KEEP[oy_data_payload[2]] = {};
                    if (typeof(OY_CHANNEL_KEEP[oy_data_payload[2]][oy_broadcast_hash])==="undefined") OY_CHANNEL_KEEP[oy_data_payload[2]][oy_broadcast_hash] = oy_broadcast_payload;
                    oy_channel_commit(oy_data_payload[2], oy_broadcast_hash, oy_broadcast_payload);

                    oy_echo_beam();
                }
                else oy_channel_commit(oy_data_payload[2], oy_broadcast_hash, oy_broadcast_payload);
            }
        }
        else {
            oy_node_punish(oy_peer_id, "OY_PUNISH_CHANNEL_VERIFY");
            return false;
        }
    }
    else if (oy_data_flag==="OY_CHANNEL_ECHO") {
        //oy_data_payload = [oy_route_passport_passive, oy_route_passport_active, oy_route_dynamic_prev, oy_channel_id, oy_echo_crypt, oy_key_public]
        if (oy_data_payload.length!==6||typeof(oy_data_payload[0])!=="object"||typeof(oy_data_payload[1])!=="object"||oy_data_payload[1].length===0||!oy_channel_check(oy_data_payload[3])) {
            oy_node_punish(oy_peer_id, "OY_PUNISH_ECHO_INVALID");
            return false;
        }
        if (oy_data_payload[1][0]===OY_SELF_SHORT) {
            oy_log("Echo for channel "+oy_short(oy_data_payload[3])+" found self");

            let oy_echo_key = oy_data_payload[3]+oy_data_payload[2];
            if (typeof(OY_CHANNEL_ECHO[oy_echo_key])==="undefined") {
                oy_log("Could not find echo session for channel "+oy_short(oy_data_payload[3]));
                return false;
            }
            if (oy_time_local>OY_CHANNEL_ECHO[oy_echo_key][0]) {
                oy_log("Echo session for channel "+oy_short(oy_data_payload[3])+" has expired");
                delete OY_CHANNEL_ECHO[oy_echo_key];
                return false;
            }
            if (!oy_channel_approved(oy_data_payload[3], oy_data_payload[5])) {
                oy_log("Received echo from unapproved public key for channel "+oy_short(oy_data_payload[3]));
                return false;
            }
            if (OY_CHANNEL_ECHO[oy_echo_key][3].indexOf(oy_data_payload[5])!==-1) {
                oy_log("Received duplicate echo for channel "+oy_short(oy_data_payload[3]));
                return false;
            }
            OY_CHANNEL_ECHO[oy_echo_key][3].push(oy_data_payload[5]);

            if (oy_key_verify(oy_data_payload[5], oy_data_payload[4], OY_CHANNEL_ECHO[oy_echo_key][1])) {
                oy_channel_top(oy_data_payload[3], oy_data_payload[0], oy_data_payload[5]);
                OY_CHANNEL_ECHO[oy_echo_key][2](OY_CHANNEL_ECHO[oy_echo_key][1]);
            }
            else oy_log("Invalid echo received for channel "+oy_short(oy_data_payload[3]));
        }
        else {//carry on reversing the passport until the data reaches the intended destination
            oy_log("Continuing echo of channel "+oy_short(oy_data_payload[3]));
            oy_data_route("OY_LOGIC_FOLLOW", "OY_CHANNEL_ECHO", oy_data_payload);
        }
    }
    else if (oy_data_flag==="OY_CHANNEL_RECOVER") {
        //oy_data_payload = [oy_route_passport_passive, oy_route_passport_active, oy_channel_id, oy_hash_keep, oy_challenge_crypt, oy_key_public, oy_sign_time]
        if (oy_data_payload.length!==7||typeof(oy_data_payload[0])!=="object"||typeof(oy_data_payload[1])!=="object"||oy_data_payload[1].length===0||!oy_channel_check(oy_data_payload[2])) {
            oy_node_punish(oy_peer_id, "OY_PUNISH_RECOVER_INVALID");
            return false;
        }
        if (oy_data_payload[1][0]===OY_SELF_SHORT) {
            oy_log("Channel recover request for channel "+oy_short(oy_data_payload[2])+" found self");
            if (typeof(OY_CHANNEL_LISTEN[oy_data_payload[2]])==="undefined"||typeof(OY_CHANNEL_KEEP[oy_data_payload[2]])==="undefined") {
                oy_log("Channel "+oy_short(oy_data_payload[2])+" is not being kept locally");
                return false;
            }
            else {
                if (oy_data_payload[4]===null||oy_data_payload[5]===null||oy_time_local-oy_data_payload[6]>2+OY_MESH_BUFFER[0]) oy_channel_top(oy_data_payload[2], oy_data_payload[0], false);
                else if (oy_key_verify(oy_data_payload[5], oy_data_payload[4], oy_data_payload[6]+oy_data_payload[2])) oy_channel_top(oy_data_payload[2], oy_data_payload[0], oy_data_payload[5]);

                let oy_channel_respond = [];
                for (let oy_broadcast_hash in OY_CHANNEL_KEEP[oy_data_payload[2]]) {
                    if (oy_data_payload[3].indexOf(oy_broadcast_hash)===-1) oy_channel_respond.push(OY_CHANNEL_KEEP[oy_data_payload[2]][oy_broadcast_hash]);
                }
                if (oy_channel_respond.length===0) {
                    oy_log("No unknown broadcast payloads found for channel "+oy_short(oy_data_payload[2]));
                    return false;
                }
                oy_channel_respond.sort(function(a, b) {
                    return b[6] - a[6];
                });

                let oy_respond_multi = Math.max(1, oy_channel_top_count(oy_data_payload[2])[0]);
                while (oy_channel_respond.length>OY_CHANNEL_RESPOND_MAX*oy_respond_multi) oy_channel_respond.pop();
                oy_channel_respond.sort(function(){return 0.5 - Math.random()});
                while (oy_channel_respond.length>OY_CHANNEL_RESPOND_MAX) oy_channel_respond.pop();

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
            oy_node_punish(oy_peer_id, "OY_PUNISH_RESPOND_INVALID");
            return false;
        }
        if (oy_data_payload[1][0]===OY_SELF_SHORT) {
            oy_log("Channel respond sequence for channel "+oy_short(oy_data_payload[2])+" found self");
            let oy_top_pass = null;
            if (typeof(OY_CHANNEL_TOP[oy_data_payload[2]])!=="undefined") {
                for (let oy_top_key in OY_CHANNEL_TOP[oy_data_payload[2]]) {
                    if (OY_CHANNEL_TOP[oy_data_payload[2]][oy_top_key][2][0]===oy_data_payload[0][0]) {
                        oy_top_pass = oy_top_key;
                        break;
                    }
                }
            }
            if (oy_top_pass===null||oy_time_local-OY_CHANNEL_TOP[oy_data_payload[2]][oy_top_pass][1]>OY_CHANNEL_RECOVERTIME) {
                oy_log("A local session was not found for respond sequence for channel "+oy_short(oy_data_payload[2]));
                return false;
            }
            else {
                oy_log("Local session found for respond sequence for channel "+oy_short(oy_data_payload[2]));

                if (typeof(OY_CHANNEL_KEEP[oy_data_payload[2]])==="undefined") OY_CHANNEL_KEEP[oy_data_payload[2]] = {};

                for (let i in oy_data_payload[3]) {
                    if (oy_channel_approved(oy_data_payload[2], oy_data_payload[3][i][5])&&oy_time_local-oy_data_payload[3][i][6]<=OY_CHANNEL_EXPIRETIME) {
                        if (oy_key_verify(oy_data_payload[3][i][5], oy_data_payload[3][i][4], oy_data_payload[3][i][6]+oy_data_payload[3][i][7]+oy_data_payload[3][i][3])) {
                            let oy_broadcast_hash = oy_hash_gen(oy_data_payload[3][i][4]);
                            oy_log("Valid primary signature for broadcast hash "+oy_short(oy_broadcast_hash)+" from channel "+oy_short(oy_data_payload[2]));

                            for (let x in oy_data_payload[3][i][8]) {
                                if (oy_data_payload[3][i][8][x][1]!==oy_data_payload[3][i][5]&&oy_channel_approved(oy_data_payload[2], oy_data_payload[3][i][8][x][1])) {
                                    if (oy_key_verify(oy_data_payload[3][i][8][x][1], oy_data_payload[3][i][8][x][0], oy_broadcast_hash)) {
                                        oy_log("Valid secondary signature for broadcast hash "+oy_short(oy_broadcast_hash)+" from channel "+oy_short(oy_data_payload[2]));
                                        if (typeof(OY_CHANNEL_KEEP[oy_data_payload[2]][oy_broadcast_hash])==="undefined") OY_CHANNEL_KEEP[oy_data_payload[2]][oy_broadcast_hash] = [oy_data_payload[3][i][0], oy_data_payload[3][i][1], oy_data_payload[3][i][2], oy_data_payload[3][i][3], oy_data_payload[3][i][4], oy_data_payload[3][i][5], oy_data_payload[3][i][6], oy_data_payload[3][i][7], [[oy_data_payload[3][i][8][x][0], oy_data_payload[3][i][8][x][1]]]];
                                        else if (typeof(OY_CHANNEL_KEEP[oy_data_payload[2]][oy_broadcast_hash][8])!=="undefined") {
                                            let oy_push = true;
                                            for (let y in OY_CHANNEL_KEEP[oy_data_payload[2]][oy_broadcast_hash][8]) {
                                                if (OY_CHANNEL_KEEP[oy_data_payload[2]][oy_broadcast_hash][8][y][1]===oy_data_payload[3][i][8][x][1]) {
                                                    oy_push = false;
                                                    break;
                                                }
                                            }
                                            if (oy_push===true) {
                                                OY_CHANNEL_KEEP[oy_data_payload[2]][oy_broadcast_hash][8].push([oy_data_payload[3][i][8][x][0], oy_data_payload[3][i][8][x][1]]);
                                                oy_channel_commit(oy_data_payload[2], oy_broadcast_hash, OY_CHANNEL_KEEP[oy_data_payload[2]][oy_broadcast_hash]);
                                            }
                                        }
                                        else oy_log("Could not record channel respond sequence for broadcast hash "+oy_short(oy_broadcast_hash)+" from channel "+oy_short(oy_data_payload[2])+", go tell Bruno", 1);
                                    }
                                    else oy_log("Invalid secondary signature for broadcast hash "+oy_short(oy_broadcast_hash)+" from channel "+oy_short(oy_data_payload[2]));
                                }
                                else oy_log("Unapproved secondary signature for broadcast hash "+oy_short(oy_broadcast_hash)+" from channel "+oy_short(oy_data_payload[2]));
                            }
                        }
                        else oy_log("Invalid primary signature for broadcast hash null from channel "+oy_short(oy_data_payload[2]));
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
    else if (oy_data_flag==="OY_PEER_BASE") {//source is sending entire block, in chunks, to self as latch
        //TODO payload validation
        if (OY_BLOCK_DIFF===true||OY_BLOCK_HASH!==null||oy_time_local-OY_BLOCK_TIME>=OY_BLOCK_SECTORS[0][0]) return false;//TODO consider timing validation

        OY_BASE_BUILD[oy_data_payload[1]] = oy_data_payload[2];//key is block_nonce and value is block_split
        let oy_base_pass = true;
        let oy_nonce_count = -1;
        for (let oy_block_nonce in OY_BASE_BUILD) {
            if (typeof(OY_BASE_BUILD)!=="undefined") oy_nonce_count++;
            else {
                oy_base_pass = false;
                break;
            }
        }

        if (oy_nonce_count===oy_data_payload[0]&&oy_base_pass===true) {//check if block_nonce equals block_nonce_max
            OY_BLOCK_DIFF = true;

            OY_BLOCK_FLAT = OY_BASE_BUILD.join("");
            OY_BASE_BUILD = [];
            console.log(OY_BLOCK_FLAT);//TODO temp

            OY_BLOCK = JSON.parse(OY_BLOCK_FLAT);

            OY_BLOCK_HASH = oy_hash_gen(OY_BLOCK_FLAT);

            OY_BLOCK_WEIGHT = new Blob([OY_BLOCK_FLAT]).size;

            oy_log("BASE MESHBLOCK HASH "+OY_BLOCK_HASH);

            OY_LIGHT_STATE = true;

            document.dispatchEvent(OY_BLOCK_TRIGGER);
            document.dispatchEvent(OY_STATE_LIGHT);

            oy_chrono(function() {
                for (let oy_peer_select in OY_PEERS) {
                    if (oy_peer_select==="oy_aggregate_node") continue;
                    oy_data_beam(oy_peer_select, "OY_PEER_LIGHT", oy_key_sign(OY_SELF_PRIVATE, OY_MESH_DYNASTY+OY_BLOCK_HASH));
                }
            }, OY_BLOCK_SECTORS[0][1]+OY_MESH_BUFFER[1]);
        }
        return true;
    }
    else if (oy_data_flag==="OY_PEER_DIFF") {//self as latch receives diff from source
        //oy_data_payload = [oy_dive_public, oy_diff_crypt, oy_diff_hash, oy_diff_nonce_max, oy_diff_nonce, oy_diff_split]
        //TODO payload validation

        let oy_diff_count = 0;
        for (let oy_peer_select in OY_PEERS) {
            if (oy_peer_select!=="oy_aggregate_node"&&OY_PEERS[oy_peer_select][9]!==0) oy_diff_count++;
        }

        console.log(1);
        console.log(OY_BLOCK_DIFF===true);
        console.log(OY_LIGHT_STATE===false);
        console.log(OY_BLOCK_HASH===null);
        console.log(oy_time_local-OY_BLOCK_TIME<OY_BLOCK_SECTORS[0][0]-OY_MESH_BUFFER[0]);
        console.log(oy_diff_count>1&&typeof(OY_BLOCK[1][oy_data_payload[0]])==="undefined");

        let oy_diff_reference = oy_data_payload[2]+oy_data_payload[3];
        if (OY_BLOCK_DIFF===true||
            OY_LIGHT_STATE===false||
            OY_BLOCK_HASH===null||
            oy_time_local-OY_BLOCK_TIME<OY_BLOCK_SECTORS[0][0]-OY_MESH_BUFFER[0]||
            (oy_diff_count>1&&typeof(OY_BLOCK[1][oy_data_payload[0]])==="undefined")||
            (typeof(OY_LIGHT_BUILD[oy_diff_reference])!=="undefined"&&typeof(OY_LIGHT_BUILD[oy_diff_reference][3][oy_data_payload[4]])!=="undefined"&&typeof(OY_LIGHT_BUILD[oy_diff_reference][3][oy_data_payload[4]][0][oy_data_payload[0]])!=="undefined")) return false;//verify meshblock zone

        console.log(JSON.stringify(oy_data_payload));

        if (oy_data_payload[4]>oy_data_payload[3]||!oy_key_verify(oy_data_payload[0], oy_data_payload[1], oy_data_payload[2]+oy_data_payload[3]+oy_data_payload[4]+oy_data_payload[5])) {
            oy_log_debug("DIFF_INVALID");
            oy_node_punish(oy_peer_id, "OY_PUNISH_DIFF_INVALID");
            return false;
        }

        if (typeof(OY_LIGHT_BUILD[oy_diff_reference])==="undefined") {
            OY_LIGHT_BUILD[oy_diff_reference] = [oy_data_payload[2], oy_data_payload[3], {}, new Array(oy_data_payload[3]+1), oy_data_payload[0]];
            OY_LIGHT_BUILD[oy_diff_reference][3].fill([{}, {}]);
        }

        if (typeof(OY_LIGHT_BUILD[oy_diff_reference][2][oy_data_payload[0]])==="undefined") OY_LIGHT_BUILD[oy_diff_reference][2][oy_data_payload[0]] = 1;
        else OY_LIGHT_BUILD[oy_diff_reference][2][oy_data_payload[0]]++;

        let oy_dive_count = 0;
        for (let oy_diff_reference_sub in OY_LIGHT_BUILD) {
            if (oy_diff_reference!==oy_diff_reference_sub&&typeof(OY_LIGHT_BUILD[oy_diff_reference_sub][2][oy_data_payload[0]])!=="undefined") {//prevents a node from claiming more than one diff_hash
                oy_node_punish(oy_peer_id, "OY_PUNISH_DIFF_ABUSE");
                return false;
            }
            for (let oy_dive_public in OY_LIGHT_BUILD[oy_diff_reference_sub][2]) {
                if (OY_LIGHT_BUILD[oy_diff_reference_sub][2][oy_dive_public]===OY_LIGHT_BUILD[oy_diff_reference_sub][1]+1) oy_dive_count++;
            }
        }

        OY_LIGHT_BUILD[oy_diff_reference][3][oy_data_payload[4]][0][oy_data_payload[0]] = true;

        let oy_split_hash = oy_hash_gen(oy_data_payload[5]);
        if (typeof(OY_LIGHT_BUILD[oy_diff_reference][3][oy_data_payload[4]][1][oy_split_hash])==="undefined") OY_LIGHT_BUILD[oy_diff_reference][3][oy_data_payload[4]][1][oy_split_hash] = [oy_data_payload[5], {}];
        OY_LIGHT_BUILD[oy_diff_reference][3][oy_data_payload[4]][1][oy_split_hash][1][oy_data_payload[0]] = true;

        for (let oy_peer_select in OY_PEERS) {//TODO should be downstream via data_route
            if (oy_peer_select==="oy_aggregate_node"||OY_PEERS[oy_peer_select][9]!==1||oy_peer_select===oy_peer_id) continue;
            oy_data_beam(oy_peer_select, "OY_PEER_DIFF", oy_data_payload);
        }

        if (OY_BOOST_BUILD.length<OY_BOOST_KEEP&&OY_BOOST_BUILD.indexOf(oy_data_payload[0])===-1) OY_BOOST_BUILD.push(oy_data_payload[0]);

        if (oy_dive_count>=OY_BLOCK[0][2]*OY_LIGHT_COMMIT) {
            console.log("EARLY_LIGHT");
            oy_block_light();
        }
    }
    else if (oy_data_flag==="OY_PEER_BLANK") {//peer as a full or light node is resetting to a blank node
        if (OY_PEERS[oy_peer_id][9]===1||OY_PEERS[oy_peer_id][9]===2) {
            if (OY_PEERS[oy_peer_id][9]===1) OY_LATCH_COUNT--;
            OY_PEERS[oy_peer_id][9] = 0;
        }
        else if (OY_PEERS[oy_peer_id][9]===0&&oy_state_current()===0) oy_peer_remove(oy_peer_id, "OY_REASON_DOUBLE_BLANK");//double blank prohibition
        return true;
    }
    else if (oy_data_flag==="OY_PEER_LIGHT") {//peer as a blank or full node is converting into a light node
        if (OY_BLOCK_HASH!==null&&!oy_key_verify(oy_peer_id, oy_data_payload, OY_MESH_DYNASTY+OY_BLOCK_HASH)) {
            oy_node_punish(oy_peer_id, "OY_PUNISH_LIGHT_FAIL");
            return false;
        }
        if (OY_PEERS[oy_peer_id][9]===0||OY_PEERS[oy_peer_id][9]===2) {
            OY_PEERS[oy_peer_id][9] = 1;
            OY_LATCH_COUNT++;
        }
        return true;
    }
    else if (oy_data_flag==="OY_PEER_FULL") {//peer as a light node is converting into a full node
        if (OY_BLOCK_HASH!==null&&!oy_key_verify(oy_peer_id, oy_data_payload, OY_MESH_DYNASTY+OY_BLOCK_HASH)) {
            oy_node_punish(oy_peer_id, "OY_PUNISH_FULL_FAIL");
            return false;
        }
        if (OY_PEERS[oy_peer_id][9]===1) {
            OY_PEERS[oy_peer_id][9] = 2;
            OY_LATCH_COUNT--;
        }
        return true;
    }
    else if (oy_data_flag==="OY_PEER_CHALLENGE") {
        if (OY_BLOCK_HASH===null) return false;
        if (typeof(OY_BLOCK_CHALLENGE[oy_peer_id])!=="undefined"&&oy_key_verify(oy_peer_id, oy_data_payload, OY_MESH_DYNASTY+OY_BLOCK_HASH)) delete OY_BLOCK_CHALLENGE[oy_peer_id];
        return true;
    }
    else if (oy_data_flag==="OY_PEER_LATENCY") {
        oy_data_payload[1] = oy_key_sign(OY_SELF_PRIVATE, OY_MESH_DYNASTY+((oy_data_payload[0]===0)?"0000000000000000000000000000000000000000":OY_BLOCK_HASH)+oy_data_payload[1]);
        oy_data_beam(oy_peer_id, "OY_LATENCY_RESPONSE", oy_data_payload);
        return true;
    }
    else if (oy_data_flag==="OY_PEER_TERMINATE") {
        console.log("TERMINATED: "+JSON.stringify(oy_data_payload));
        oy_node_punish(oy_peer_id, "OY_PUNISH_TERMINATE_RETURN");//return the favour
        return true;
    }
    else if (oy_data_flag==="OY_PEER_BLACKLIST") {
        oy_node_punish(oy_peer_id, "OY_PUNISH_BLACKLIST_RETURN");//return the favour
        return true;
    }
    else if (oy_data_flag==="OY_LATENCY_DECLINE") {
        oy_node_punish(oy_peer_id, "OY_PUNISH_LATENCY_DECLINE");
        return false;
    }
}

//reports peership data to top, leads to seeing mesh big picture, mesh stability development, not required for mesh operation
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
    let oy_peers_thin = {};
    for (let oy_peer_select in OY_PEERS) {
        if (oy_peer_select==="oy_aggregate_node") continue;
        oy_peers_thin[oy_peer_select] = OY_PEERS[oy_peer_select].slice();
        oy_peers_thin[oy_peer_select][4] = null;
        oy_peers_thin[oy_peer_select][6] = null;
        oy_peers_thin[oy_peer_select][8] = null;
    }
    oy_xhttp.open("POST", "https://top.oyster.org/oy_peer_report.php", true);
    oy_xhttp.send("oy_peer_report="+JSON.stringify([OY_SELF_PUBLIC, oy_state_current(), oy_peers_thin, OY_BLACKLIST]));
}

function oy_boost() {
    if (OY_BOOST_RESERVE.length===0) return true;

    console.log("BOOST: "+OY_BOOST_RESERVE[0]);
    oy_node_initiate(OY_BOOST_RESERVE.shift());
    oy_chrono(oy_boost, OY_BOOST_DELAY);
}

function oy_node_reset(oy_node_id) {
    delete OY_LATENCY[oy_node_id];
    delete OY_PROPOSED[oy_node_id];
    delete OY_PEERS_PRE[oy_node_id];
    delete OY_ENGINE[0][oy_node_id];
}

function oy_node_connect(oy_node_id, oy_callback) {
    if (oy_node_id===false||oy_node_id===OY_SELF_PUBLIC) {
        oy_log("Tried to connect to invalid node ID: "+oy_node_id, 1);//functions need to validate node_id before forwarding here
        return false;
    }
    let oy_time_local = Date.now()/1000;
    if (typeof(OY_WARM[oy_node_id])!=="undefined") return false;
    else if (typeof(OY_COLD[oy_node_id])!=="undefined") return false;
    else if (typeof(OY_NODES[oy_node_id])==="undefined"||OY_NODES[oy_node_id][0].open===false) {
        if (typeof(OY_NODES[oy_node_id])!=="undefined") OY_NODES[oy_node_id][0].close();

        let oy_local_conn = OY_CONN.connect(oy_node_id);
        if (oy_local_conn===undefined) return false;
        OY_WARM[oy_node_id] = oy_time_local;

        oy_local_conn.on('open', function() {
            delete OY_WARM[oy_node_id];
            OY_NODES[oy_node_id] = [oy_local_conn, oy_time_local];
            if (typeof(oy_callback)==="function") oy_callback();
        });

        oy_local_conn.on('error', function() {
            delete OY_WARM[oy_node_id];
            delete OY_NODES[oy_node_id];
            oy_node_punish(oy_node_id, "OY_PUNISH_CONNECT_FAIL");
        });
        return false;
    }
    else if (OY_NODES[oy_node_id][0].open===true) {
        OY_NODES[oy_node_id][1] = oy_time_local;
        if (typeof(oy_callback)==="function") oy_callback();
        return true;
    }
    return false;
}

function oy_node_disconnect(oy_node_id) {
    if (typeof(OY_COLD[oy_node_id])==="undefined"&&typeof(OY_NODES[oy_node_id])!=="undefined") {
        if (OY_NODES[oy_node_id][0].open===true) {
            OY_COLD[oy_node_id] = true;
            oy_chrono(function() {
                if (typeof(OY_NODES[oy_node_id])!=="undefined") OY_NODES[oy_node_id][0].close();
                delete OY_COLD[oy_node_id];
                delete OY_NODES[oy_node_id];
                oy_log("Disconnected from node "+oy_short(oy_node_id));
            }, OY_NODE_DELAYTIME*1000);
        }
        else {
            OY_NODES[oy_node_id][0].close();
            delete OY_NODES[oy_node_id];
        }
        return true;
    }
    return false;
}

//checks for peering proposal session
function oy_node_proposed(oy_node_id) {
    if (typeof(OY_PROPOSED[oy_node_id])!=="undefined") {
        if (OY_PROPOSED[oy_node_id]<(Date.now()/1000)) {//check if proposal session expired
            delete OY_PROPOSED[oy_node_id];
            return false;
        }
        return true;
    }
    return false;
}

//checks if node is in blacklist
function oy_node_blocked(oy_node_id) {
    if (typeof(OY_BLACKLIST[oy_node_id])==="undefined"||OY_BLACKLIST[oy_node_id][1]<Date.now()/1000) {
        delete OY_BLACKLIST[oy_node_id];//remove node from blacklist if block expiration was reached
        return false;
    }
    return true;
}

//increments a node's status in the blacklist subsystem
function oy_node_punish(oy_node_id, oy_punish_reason) {
    if (oy_peer_check(oy_node_id)) oy_peer_remove(oy_node_id, oy_punish_reason);
    return true;
    if (typeof(OY_BLACKLIST[oy_node_id])==="undefined") {
        //[0] is inform count, [1] is blacklist expiration time, [2] is inform boolean (if node was informed of blacklist), [3] is punish reason tracking (for diagnostics, reported to top)
        OY_BLACKLIST[oy_node_id] = [1, (Date.now()/1000)+OY_NODE_BLACKTIME, false, [oy_punish_reason]];//ban expiration time is defined here since we do not know if OY_NODE_TOLERANCE will change in the future
    }
    else {
        OY_BLACKLIST[oy_node_id][0]++;
        OY_BLACKLIST[oy_node_id][3].push(oy_punish_reason);

        if (OY_BLACKLIST[oy_node_id][2]===false) {
            OY_BLACKLIST[oy_node_id][2] = true;
            oy_data_beam(oy_node_id, "OY_PEER_BLACKLIST", oy_punish_reason);
        }
        else OY_BLACKLIST[oy_node_id][1] = (Date.now()/1000)+OY_NODE_BLACKTIME;
    }

    oy_node_reset(oy_node_id);

    if (oy_peer_check(oy_node_id)) oy_peer_remove(oy_node_id, oy_punish_reason);
    else oy_log("PUNISH["+oy_punish_reason+"]["+oy_short(oy_node_id)+"]");
    return true;
}

//where the aggregate connectivity of the entire mesh begins
function oy_node_initiate(oy_node_id) {
    let oy_time_local = Date.now()/1000;

    if (oy_peer_check(oy_node_id)||oy_peer_pre_check(oy_node_id)||oy_node_proposed(oy_node_id)||oy_node_blocked(oy_node_id)||oy_latency_check(oy_node_id)||OY_PEER_COUNT>=OY_PEER_MAX||OY_BLOCK_BOOT===null||(OY_LIGHT_MODE===true&&OY_BLOCK_BOOT===true)) return false;
    let oy_callback_peer = function() {
        oy_data_beam(oy_node_id, "OY_PEER_REQUEST", oy_state_current());
        OY_PROPOSED[oy_node_id] = oy_time_local+OY_NODE_PROPOSETIME;//set proposal session with expiration timestamp and type flag
    };
    oy_node_connect(oy_node_id, oy_callback_peer);
    return true;
}

//retrieves nodes from and submit self id to top.oyster.org
function oy_node_assign() {
    if (OY_BLOCK_BOOT===null) return false;
    let oy_xhttp = new XMLHttpRequest();
    oy_xhttp.onreadystatechange = function() {
        if (this.readyState===4&&this.status===200) {
            if (this.responseText.substr(0, 5)==="ERROR"||this.responseText.length===0) {
                oy_log("Received error from node_assign@top: "+this.responseText);
                return false;
            }
            let oy_node_array = JSON.parse(this.responseText);
            let oy_delay = 0;
            for (let i in oy_node_array) {
                oy_chrono(function() {
                    oy_node_initiate(oy_node_array[i]);
                }, oy_delay);
                oy_delay += OY_NODE_ASSIGN_DELAY;
            }
        }
    };
    oy_xhttp.open("POST", "https://top.oyster.org/oy_node_assign_alpha.php", true);
    oy_xhttp.send("oy_node_id="+OY_SELF_PUBLIC);
}

//respond to a node that is not mutually peered with self
function oy_node_negotiate(oy_node_id, oy_data_flag, oy_data_payload) {
    let oy_time_local = Date.now()/1000;
    if (oy_data_flag==="OY_PEER_TERMINATE") {
        oy_node_reset(oy_node_id);
        return false;
    }
    else if (oy_data_flag==="OY_PEER_BLACKLIST") {
        oy_node_punish(oy_node_id, "OY_PUNISH_BLACKLIST_RETURN");
        return false;
    }
    else if (oy_data_flag==="OY_PEER_AFFIRM") {
        if (oy_peer_pre_check(oy_node_id)) {
            oy_peer_add(oy_node_id, oy_data_payload);
            oy_log("Confirmed mutual peer "+oy_short(oy_node_id));
            return true;
        }
        else {
            oy_node_punish(oy_node_id, "OY_PUNISH_FALSE_AFFIRM");
            return false;
        }
    }
    else if (oy_data_flag==="OY_PEER_LATENCY"&&(oy_node_proposed(oy_node_id)||oy_peer_pre_check(oy_node_id))) {//respond to latency ping from node with peer proposal arrangement
        oy_data_payload[1] = oy_key_sign(OY_SELF_PRIVATE, OY_MESH_DYNASTY+((oy_data_payload[0]===0)?"0000000000000000000000000000000000000000":OY_BLOCK_HASH)+oy_data_payload[1]);
        oy_data_beam(oy_node_id, "OY_LATENCY_RESPONSE", oy_data_payload);
        oy_log("Signed peer latency sequence from "+oy_short(oy_node_id));
        return true;
    }
    else if (oy_data_flag==="OY_PEER_LATENCY") {
        oy_log("Node "+oy_short(oy_node_id)+" sent a latency spark request whilst not a peer, will decline");
        oy_data_beam(oy_node_id, "OY_LATENCY_DECLINE", null);
        return false;
    }
    else if (oy_data_flag==="OY_PEER_REQUEST") {
        let oy_callback_local;
        if (OY_BLOCK_HASH===null||OY_PEER_COUNT>=OY_PEER_MAX||OY_BLOCK_BOOT===null||(OY_BLOCK_BOOT===true&&oy_data_payload!==2)||(oy_state_current()===0&&oy_data_payload===0)) {
            oy_callback_local = function() {
                oy_data_beam(oy_node_id, "OY_PEER_UNREADY", null);
            };
        }
        else {
            oy_callback_local = function() {
                oy_latency_test(oy_node_id, "OY_PEER_REQUEST", true, oy_data_payload);
            };
        }
        oy_node_connect(oy_node_id, oy_callback_local);
        return true;
    }
    else if (oy_data_flag==="OY_LATENCY_DECLINE") {
        oy_node_punish(oy_node_id, "OY_PUNISH_LATENCY_DECLINE");
        return false;
    }
    else if (oy_node_proposed(oy_node_id)) {//check if this node had previously proposed to peer with self
        if (oy_data_flag==="OY_PEER_ACCEPT") oy_latency_test(oy_node_id, "OY_PEER_ACCEPT", true, oy_data_payload);
        else if (OY_BLOCK_BOOT===false) oy_node_punish(oy_node_id, "OY_PUNISH_PEER_REJECT");//we need to prevent nodes with far distances/long latencies from repeatedly communicating
        return true;
    }
    else {
        oy_node_punish(oy_node_id, "OY_PUNISH_DATA_INCOHERENT");
        return false;
    }
}

//process the latency response from another node
function oy_latency_response(oy_node_id, oy_data_payload) {
    if (typeof(OY_LATENCY[oy_node_id])==="undefined") {
        oy_node_punish(oy_node_id, "OY_PUNISH_LATENCY_NONE");
        return false;
    }
    let oy_time_local = Date.now()/1000;
    if (!oy_key_verify(oy_node_id, oy_data_payload[1], OY_MESH_DYNASTY+((OY_LATENCY[oy_node_id][6]===0)?"0000000000000000000000000000000000000000":OY_BLOCK_HASH)+OY_LATENCY[oy_node_id][0])) {
        delete OY_LATENCY[oy_node_id];
        oy_node_punish(oy_node_id, "OY_PUNISH_SIGN_FAIL");
        return false;
    }
    if (OY_LATENCY[oy_node_id][0].repeat(OY_LATENCY_SIZE)===oy_data_payload[2]) {//check if payload data matches latency session definition
        if (oy_peer_check(oy_node_id)) OY_PEERS[oy_node_id][1] = oy_time_local;//update last msg timestamp for peer

        OY_LATENCY[oy_node_id][2]++;
        OY_LATENCY[oy_node_id][4] += oy_time_local-OY_LATENCY[oy_node_id][3];//calculate how long the round trip took, and add it to aggregate time
        if (OY_LATENCY[oy_node_id][1]!==OY_LATENCY[oy_node_id][2]) return false;
        if (OY_LATENCY[oy_node_id][2]>=OY_LATENCY_REPEAT) {
            let oy_latency_result = OY_LATENCY[oy_node_id][4]/OY_LATENCY[oy_node_id][2];
            if (oy_latency_result>OY_LATENCY_MAX) {
                if (OY_LATENCY[oy_node_id][5]==="OY_PEER_ACCEPT") oy_data_beam(oy_node_id, "OY_PEER_TERMINATE", "OY_PUNISH_LATENCY_BREACH");
                else oy_data_beam(oy_node_id, "OY_PEER_REJECT", "OY_PUNISH_LATENCY_BREACH");
                oy_node_punish(oy_node_id, "OY_PUNISH_LATENCY_BREACH");
            }
            else if (OY_LATENCY[oy_node_id][5]==="OY_PEER_REQUEST"||OY_LATENCY[oy_node_id][5]==="OY_PEER_ACCEPT") {
                let oy_full_count = 0;
                if (oy_state_current(true)===2) {
                    for (let oy_peer_select in OY_PEERS) {
                        if (oy_peer_select!=="oy_aggregate_node"&&OY_PEERS[oy_peer_select][9]===2&&typeof(OY_BLOCK[1][oy_peer_select])!=="undefined") oy_full_count++;
                    }
                }
                if (OY_PEER_COUNT<OY_PEER_MAX&&(oy_state_current(true)!==2||OY_LATENCY[oy_node_id][7]===2||OY_PEER_COUNT-oy_full_count<OY_PEER_MAX-OY_PEER_FULL_MIN)) {
                    if (OY_LATENCY[oy_node_id][5]==="OY_PEER_ACCEPT") {
                        oy_peer_add(oy_node_id, OY_LATENCY[oy_node_id][7]);
                        oy_data_beam(oy_node_id, "OY_PEER_AFFIRM", oy_state_current());
                        oy_log("Added node "+oy_short(oy_node_id)+" as a peer");
                    }
                    else {
                        oy_peer_pre_add(oy_node_id);
                        oy_data_beam(oy_node_id, "OY_PEER_ACCEPT", oy_state_current());
                        oy_log("Added node "+oy_short(oy_node_id)+" to pre peer list");
                    }
                    oy_peer_latency(oy_node_id, oy_latency_result);
                }
                else {
                    let oy_peer_weak = [false, -1];
                    for (let oy_peer_local in OY_PEERS) {
                        if (oy_peer_local==="oy_aggregate_node"||(oy_state_current()===2&&OY_LATENCY[oy_node_id][7]!==2&&OY_PEERS[oy_peer_local][9]===2&&typeof(OY_BLOCK[1][oy_peer_local])!=="undefined")) continue;
                        if (OY_PEERS[oy_peer_local][3]>oy_peer_weak[1]) oy_peer_weak = [oy_peer_local, OY_PEERS[oy_peer_local][3]];
                    }
                    oy_log("Current weakest peer is "+oy_short(oy_peer_weak[0])+" with latency of "+oy_peer_weak[1].toFixed(4));
                    if ((oy_latency_result*(1+OY_LATENCY_GEO_SENS))<oy_peer_weak[1]) {
                        oy_log("New peer request has better latency than current weakest peer");
                        oy_peer_remove(oy_peer_weak[0], "OY_REASON_LATENCY_DROP");
                        if (OY_LATENCY[oy_node_id][5]==="OY_PEER_ACCEPT") {
                            oy_peer_add(oy_node_id, OY_LATENCY[oy_node_id][7]);
                            oy_data_beam(oy_node_id, "OY_PEER_AFFIRM", oy_state_current());
                            oy_log("Added node "+oy_short(oy_node_id)+" as a peer");
                        }
                        else {
                            oy_peer_pre_add(oy_node_id);
                            oy_data_beam(oy_node_id, "OY_PEER_ACCEPT", oy_state_current());
                            oy_log("Added node "+oy_short(oy_node_id)+" to pre peer list");
                        }
                        oy_peer_latency(oy_node_id, oy_latency_result);
                        oy_log("Removed peer "+oy_short(oy_peer_weak[0])+" and potentially added peer "+oy_short(oy_node_id));
                    }
                    else {
                        if (OY_LATENCY[oy_node_id][5]==="OY_PEER_ACCEPT") oy_data_beam(oy_node_id, "OY_PEER_TERMINATE", "OY_PUNISH_LATENCY_WEAK");
                        else oy_data_beam(oy_node_id, "OY_PEER_REJECT", "OY_PUNISH_LATENCY_WEAK");
                        //oy_node_punish(oy_node_id, "OY_PUNISH_LATENCY_WEAK");
                    }
                }
            }
            else if (oy_peer_check(oy_node_id)&&OY_LATENCY[oy_node_id][5]==="OY_PEER_ROUTINE") {
                oy_data_beam(oy_node_id, "OY_PEER_AFFIRM", oy_state_current());
                oy_peer_latency(oy_node_id, oy_latency_result);
            }
            if (oy_peer_check(oy_node_id)) OY_PEERS[oy_node_id][2] = oy_time_local;
            delete OY_LATENCY[oy_node_id];
            return true
        }
        oy_latency_test(oy_node_id, OY_LATENCY[oy_node_id][5], false, null);
    }
    else oy_node_punish(oy_node_id, "OY_PUNISH_LATENCY_INVALID");
}

//test latency performance between self and node
function oy_latency_test(oy_node_id, oy_latency_followup, oy_latency_new, oy_status_flag) {
    if (typeof(OY_LATENCY[oy_node_id])==="undefined") {
        //[0] is pending payload unique string
        //[1] is ping stage (multiple pings per stage)
        //[2] is valid pings received back
        //[3] is start time for latency test timer
        //[4] is aggregate time taken (between all received pings)
        //[5] is followup flag i.e. what logic should follow after the latency test concludes
        //[6] is lowest common denominator between states of both nodes
        //[7] is the state flag of the opposite node
        OY_LATENCY[oy_node_id] = [null, 0, 0, 0, 0, oy_latency_followup, Math.min(oy_status_flag, oy_state_current()), oy_status_flag];
    }
    else if (oy_latency_new===true) return false;
    if (oy_latency_followup!==OY_LATENCY[oy_node_id][5]) return false;
    //ping a unique payload string that is repeated OY_LATENCY_SIZE amount of times
    OY_LATENCY[oy_node_id][0] = oy_rand_gen(OY_LATENCY_LENGTH);
    if (oy_data_beam(oy_node_id, "OY_PEER_LATENCY", [OY_LATENCY[oy_node_id][6], OY_LATENCY[oy_node_id][0], OY_LATENCY[oy_node_id][0].repeat(OY_LATENCY_SIZE)])) {
        OY_LATENCY[oy_node_id][1]++;
        OY_LATENCY[oy_node_id][3] = Date.now()/1000;
        return true;
    }
    delete OY_LATENCY[oy_node_id];
    return false;
}

function oy_latency_check(oy_node_id) {
    return typeof(OY_LATENCY[oy_node_id])!=="undefined";
}

function oy_state_current(oy_mode_flag) {
    if (OY_BLOCK_HASH!==null) {
        if (OY_LIGHT_STATE===false||(typeof(oy_mode_flag)!=="undefined"&&oy_mode_flag===true&&OY_LIGHT_MODE===false)) return 2;//full node
        return 1;//light node
    }
    return 0;//blank node
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
    if (typeof(OY_PEERS[oy_node_id])==="undefined") return false;
    if (typeof(OY_PEERS[oy_node_id][oy_array_select][0])==="undefined"||typeof(OY_PEERS[oy_node_id][oy_array_select][0][0])==="undefined") {
        OY_PEERS[oy_node_id][oy_array_select-1] = 0;
        OY_PEERS[oy_node_id][oy_array_select].push([oy_time_local, oy_data_length]);
        return true;
    }
    while (typeof(OY_PEERS[oy_node_id][oy_array_select][0])!=="undefined"&&(oy_time_local-OY_PEERS[oy_node_id][oy_array_select][0][0])>OY_MESH_MEASURE) OY_PEERS[oy_node_id][oy_array_select].shift();
    //do not punish node if there is an insufficient survey to determine accurate mesh flow
    if (OY_PEERS[oy_node_id][oy_array_select].length<((oy_data_beam===false)?OY_MESH_SOAK_SAMPLE:OY_MESH_BEAM_SAMPLE)||OY_PEERS[oy_node_id][oy_array_select][0][0]===oy_time_local) {
        OY_PEERS[oy_node_id][oy_array_select-1] = 0;
        OY_PEERS[oy_node_id][oy_array_select].push([oy_time_local, oy_data_length]);
        return true;
    }
    let oy_measure_total = 0;
    for (let i in OY_PEERS[oy_node_id][oy_array_select]) oy_measure_total += OY_PEERS[oy_node_id][oy_array_select][i][1];
    //either mesh overflow has occurred (parent function will respond accordingly), or mesh flow is in compliance
    OY_PEERS[oy_node_id][oy_array_select-1] = Math.round(oy_measure_total/(oy_time_local-OY_PEERS[oy_node_id][oy_array_select][0][0]));
    if (oy_data_beam===false) {
        OY_PEERS[oy_node_id][oy_array_select].push([oy_time_local, oy_data_length]);
        return (OY_PEERS[oy_node_id][oy_array_select-1]<=(OY_MESH_FLOW*OY_MESH_SOAK_BUFFER));
    }
    else {
        let oy_beam_calc = (OY_PEERS[oy_node_id][oy_array_select-1]/(OY_MESH_FLOW))*(oy_data_length/(OY_DATA_CHUNK/OY_MESH_BEAM_COOL));
        let oy_return = true;
        if (oy_beam_calc>OY_MESH_BEAM_MIN) oy_return = (Math.random()>oy_beam_calc);
        if (oy_return===true) OY_PEERS[oy_node_id][oy_array_select].push([oy_time_local, oy_data_length]);
        return oy_return;
    }
}

//pushes data onto the mesh, data_logic indicates strategy for data pushing
function oy_data_push(oy_data_value, oy_callback_tally, oy_data_handle) {
    let oy_data_superhandle = false;
    if (typeof(oy_data_handle)==="undefined"||oy_data_handle===null) {
        let oy_key_pass = oy_rand_gen(8);
        oy_data_value = oy_crypt_encrypt(oy_data_value, oy_key_pass);
        oy_data_handle = "OY"+oy_rand_gen()+oy_hash_gen(oy_data_value);
        oy_data_superhandle = oy_data_handle+Math.ceil(oy_data_value.length/OY_DATA_CHUNK)+"@"+oy_key_pass;
        oy_key_pass = null;
    }
    if (typeof(OY_PUSH_HOLD[oy_data_handle])==="undefined") {
        if (oy_data_value===null) {
            oy_log("Halted data push loop for handle "+oy_short(oy_data_handle));
            return true;
        }
        OY_PUSH_HOLD[oy_data_handle] = oy_data_value;
        oy_data_value = null;
        OY_PUSH_TALLY[oy_data_handle] = [];
        for (let i = 0; i < OY_PUSH_HOLD[oy_data_handle].length; i += OY_DATA_CHUNK) {
            OY_PUSH_TALLY[oy_data_handle].push([i, i+OY_DATA_CHUNK, []]);
        }
    }
    if (typeof(OY_DATA_PUSH[oy_data_handle])==="undefined") {
        if (typeof(oy_callback_tally)==="function") OY_DATA_PUSH[oy_data_handle] = oy_callback_tally;
        else OY_DATA_PUSH[oy_data_handle] = true;
    }
    else if (OY_DATA_PUSH[oy_data_handle]===false) {
        oy_log("Halted data push loop for handle "+oy_short(oy_data_handle));
        return true;
    }
    let oy_push_delay = 0;
    if (OY_PUSH_HOLD[oy_data_handle].length<OY_DATA_CHUNK) {
        oy_log("Pushing handle "+oy_short(oy_data_handle)+" at exclusive nonce: 0");
        oy_data_route("OY_LOGIC_CHAOS", "OY_DATA_PUSH", [[], oy_data_handle, 0, null], [0, OY_PUSH_HOLD[oy_data_handle].length]);
        oy_push_delay += OY_DATA_PUSH_INTERVAL;
    }
    else {
        let oy_source_lowest = -1;
        let oy_data_nonce_set = [];
        for (let oy_data_nonce in OY_PUSH_TALLY[oy_data_handle]) {
            if (OY_PUSH_TALLY[oy_data_handle][oy_data_nonce][2].length<oy_source_lowest||oy_source_lowest===-1) {
                oy_source_lowest = OY_PUSH_TALLY[oy_data_handle][oy_data_nonce][2].length;
                oy_data_nonce_set = [];
            }
            if (OY_PUSH_TALLY[oy_data_handle][oy_data_nonce][2].length>oy_source_lowest) continue;
            oy_data_nonce_set.push(parseInt(oy_data_nonce));
        }
        oy_data_nonce_set.sort(function(){return 0.5 - Math.random()});
        while (oy_data_nonce_set.length>OY_DATA_PUSH_NONCE_MAX) oy_data_nonce_set.pop();
        for (let i in oy_data_nonce_set) {
            oy_chrono(function() {
                if (typeof(OY_PUSH_TALLY[oy_data_handle])==="undefined") return false;
                oy_log("Pushing handle "+oy_short(oy_data_handle)+" at nonce: "+oy_data_nonce_set[i]);
                oy_data_route("OY_LOGIC_CHAOS", "OY_DATA_PUSH", [[], oy_data_handle, oy_data_nonce_set[i], null], [OY_PUSH_TALLY[oy_data_handle][oy_data_nonce_set[i]][0], OY_PUSH_TALLY[oy_data_handle][oy_data_nonce_set[i]][1]]);
            }, oy_push_delay);
            oy_push_delay += OY_DATA_PUSH_INTERVAL;
        }
    }
    oy_chrono(function() {
        oy_data_push(oy_data_value, null, oy_data_handle);
    }, oy_push_delay);
    if (oy_data_superhandle!==false) return oy_data_superhandle;
}

function oy_data_push_reset(oy_data_handle) {
    if (!oy_handle_check(oy_data_handle)) return false;
    delete OY_DATA_PUSH[oy_data_handle];
    delete OY_PUSH_HOLD[oy_data_handle];
    delete OY_PUSH_TALLY[oy_data_handle];
    oy_log("Reset data push loop for handle "+oy_short(oy_data_handle));
}

//receives deposit confirmations
function oy_data_tally(oy_data_source, oy_data_handle, oy_data_nonce, oy_passport_passive_length) {
    if (typeof(OY_PUSH_TALLY[oy_data_handle])==="undefined"||typeof(OY_PUSH_TALLY[oy_data_handle][oy_data_nonce])==="undefined") {
        oy_log("Received invalid deposit tally for unknown handle "+oy_short(oy_data_handle));
        return false;
    }
    oy_log("Received matching deposit tally for handle "+oy_short(oy_data_handle));
    if (OY_PUSH_TALLY[oy_data_handle][oy_data_nonce][2].indexOf(oy_data_source)===-1) OY_PUSH_TALLY[oy_data_handle][oy_data_nonce][2].push(oy_data_source);
    if (typeof(OY_DATA_PUSH[oy_data_handle])==="function") OY_DATA_PUSH[oy_data_handle](oy_data_nonce, OY_PUSH_TALLY[oy_data_handle][oy_data_nonce][2].length, oy_passport_passive_length);
    return true;
}

//pulls data from the mesh
function oy_data_pull(oy_data_handle, oy_callback, oy_callback_collect, oy_data_nonce_max, oy_crypt_pass) {
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
    if (typeof(OY_DATA_PULL[oy_data_handle])==="undefined") OY_DATA_PULL[oy_data_handle] = [oy_callback, oy_callback_collect, oy_data_nonce_max, oy_crypt_pass];
    else if (OY_DATA_PULL[oy_data_handle]===false) {
        oy_log("Halted data pull loop for handle "+oy_short(oy_data_handle));
        return false;
    }
    let oy_nonce_all = {};
    for (let i = 0; i < oy_data_nonce_max; i++) {
        oy_nonce_all[i] = true;
    }
    for (let oy_data_nonce in OY_COLLECT[oy_data_handle]) {
        if (Object.keys(OY_COLLECT[oy_data_handle][oy_data_nonce]).length===1) delete oy_nonce_all[oy_data_nonce];
    }
    let oy_data_nonce_set = [];
    for (let oy_data_nonce in oy_nonce_all) {
        oy_data_nonce_set.push(parseInt(oy_data_nonce));
    }
    oy_data_nonce_set.sort(function(){return 0.5 - Math.random()});
    while (oy_data_nonce_set.length>OY_DATA_PULL_NONCE_MAX) oy_data_nonce_set.pop();
    oy_log("Pulling handle "+oy_short(oy_data_handle)+" with nonce max: "+oy_data_nonce_max+" and nonce set: "+JSON.stringify(oy_data_nonce_set));
    oy_data_route("OY_LOGIC_ALL", "OY_DATA_PULL", [[], oy_rand_gen(), oy_data_handle, oy_data_nonce_set]);
    oy_chrono(function() {
        oy_data_pull(oy_data_handle, oy_callback, oy_callback_collect, oy_data_nonce_max, oy_crypt_pass);
    }, OY_DATA_PULL_INTERVAL);
}

function oy_data_pull_reset(oy_data_handle) {
    if (!oy_handle_check(oy_data_handle)) return false;
    delete OY_DATA_PULL[oy_data_handle];
    delete OY_COLLECT[oy_data_handle];
    delete OY_CONSTRUCT[oy_data_handle];
    oy_log("Reset data push loop for handle "+oy_short(oy_data_handle));
}

//collects data from fulfill
function oy_data_collect(oy_data_source, oy_data_handle, oy_data_nonce, oy_data_value, oy_passport_passive_length) {
    if (!oy_handle_check(oy_data_handle)) {
        oy_log("Collect received an invalid handle: "+oy_data_handle+", will not process");
        return false;
    }
    if (typeof(OY_DATA_PULL[oy_data_handle])==="undefined") {
        oy_log("Collect could not find a pull session for handle: "+oy_data_handle+", will not process");
        return false;
    }
    if (typeof(OY_COLLECT[oy_data_handle])==="undefined") OY_COLLECT[oy_data_handle] = {};
    if (typeof(OY_COLLECT[oy_data_handle][oy_data_nonce])==="undefined") OY_COLLECT[oy_data_handle][oy_data_nonce] = {};
    if (typeof(OY_COLLECT[oy_data_handle][oy_data_nonce][oy_data_value])==="undefined") OY_COLLECT[oy_data_handle][oy_data_nonce][oy_data_value] = [oy_data_source];
    else if (OY_COLLECT[oy_data_handle][oy_data_nonce][oy_data_value].indexOf(oy_data_source)===-1) {
        let oy_source_local;
        for (let oy_data_value_sub in OY_COLLECT[oy_data_handle][oy_data_nonce]) {
            if (oy_data_value===oy_data_value_sub) continue;
            oy_source_local = false;
            OY_COLLECT[oy_data_handle][oy_data_nonce][oy_data_value_sub].shift();
            if (OY_COLLECT[oy_data_handle][oy_data_nonce][oy_data_value_sub].length===0) delete OY_COLLECT[oy_data_handle][oy_data_nonce][oy_data_value_sub];
            break;
        }
        if (oy_source_local!==false) OY_COLLECT[oy_data_handle][oy_data_nonce][oy_data_value].push(oy_data_source);
    }

    if (typeof(OY_DATA_PULL[oy_data_handle][1])==="function") {
        let oy_source_count_highest = -1;
        for (let oy_data_value_sub in OY_COLLECT[oy_data_handle][oy_data_nonce]) {
            if (OY_COLLECT[oy_data_handle][oy_data_nonce][oy_data_value_sub].length>oy_source_count_highest||oy_source_count_highest===-1) oy_source_count_highest = OY_COLLECT[oy_data_handle][oy_data_nonce][oy_data_value_sub].length;
        }
        OY_DATA_PULL[oy_data_handle][1](oy_data_nonce, oy_source_count_highest, Object.keys(OY_COLLECT[oy_data_handle][oy_data_nonce]).length, oy_passport_passive_length);
    }

    if (typeof(OY_DATA_PULL[oy_data_handle])!=="undefined"&&OY_DATA_PULL[oy_data_handle]!==false&&Object.keys(OY_COLLECT[oy_data_handle]).length===OY_DATA_PULL[oy_data_handle][2]) {
        if (typeof(OY_CONSTRUCT[oy_data_handle])==="undefined") OY_CONSTRUCT[oy_data_handle] = [];
        for (let oy_data_nonce in OY_COLLECT[oy_data_handle]) {
            if (oy_data_nonce>=OY_DATA_PULL[oy_data_handle][2]) continue;
            let oy_source_highest = 0;
            let oy_source_data = null;
            for (let oy_data_value in OY_COLLECT[oy_data_handle][oy_data_nonce]) {
                if (OY_COLLECT[oy_data_handle][oy_data_nonce][oy_data_value].length>oy_source_highest) {
                    oy_source_highest = OY_COLLECT[oy_data_handle][oy_data_nonce][oy_data_value].length;
                    oy_source_data = oy_data_value;
                }
            }
            OY_CONSTRUCT[oy_data_handle][oy_data_nonce] = LZString.decompressFromUTF16(oy_source_data);
        }

        if (Object.keys(OY_CONSTRUCT[oy_data_handle]).length===OY_DATA_PULL[oy_data_handle][2]) {
            oy_log("Construct for "+oy_short(oy_data_handle)+" achieved all "+OY_DATA_PULL[oy_data_handle][2]+" nonce(s)");
            let oy_data_construct = OY_CONSTRUCT[oy_data_handle].join("");
            if (oy_data_handle.substr(6, 40)===oy_hash_gen(oy_data_construct)) {
                delete OY_COLLECT[oy_data_handle];
                delete OY_CONSTRUCT[oy_data_handle];
                oy_log("Construct for "+oy_short(oy_data_handle)+" cleared hash check");
                OY_DATA_PULL[oy_data_handle][0]("OY"+oy_data_handle+OY_DATA_PULL[oy_data_handle][2]+((OY_DATA_PULL[oy_data_handle][3]===null)?"":"@"+OY_DATA_PULL[oy_data_handle][3]), (OY_DATA_PULL[oy_data_handle][3]===null)?null:oy_crypt_decrypt(oy_data_construct, OY_DATA_PULL[oy_data_handle][3]), oy_data_construct);
                OY_DATA_PULL[oy_data_handle] = false;
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
    if (oy_data_payload[0].indexOf(OY_SELF_SHORT)!==-1) {
        oy_log("Self already stamped passive passport with flag "+oy_data_flag+", will cease date_route");
        return false;
    }
    if (typeof(oy_push_define)!=="undefined") {
        if (typeof(OY_DATA_PUSH[oy_data_payload[1]])==="undefined"||OY_DATA_PUSH[oy_data_payload[1]]===false||typeof(OY_PUSH_HOLD[oy_data_payload[1]])==="undefined") {
            oy_log("Cancelled data route for handle "+oy_short(oy_data_payload[1])+" due to push session cancellation");
            return true;
        }
        oy_data_payload[3] = LZString.compressToUTF16(OY_PUSH_HOLD[oy_data_payload[1]].slice(oy_push_define[0], oy_push_define[1]));
    }
    let oy_peer_select = false;
    if (oy_data_logic==="OY_LOGIC_CHAOS") {
        //oy_data_payload[0] is oy_route_passport_passive
        oy_peer_select = oy_peer_rand(oy_data_payload[0]);
        if (oy_peer_select===false) {
            oy_log("Data route cannot chaos transmit flag "+oy_data_flag);
            return false;
        }
        oy_data_payload[0].push(OY_SELF_SHORT);
        //oy_log("Routing data via peer "+oy_short(oy_peer_select)+" with flag "+oy_data_flag);
        oy_data_beam(oy_peer_select, oy_data_flag, oy_data_payload);
    }
    else if (oy_data_logic==="OY_LOGIC_ALL") {
        //oy_data_payload[0] is oy_route_passport_passive
        //oy_data_payload[1] is oy_route_dynamic
        oy_data_payload[0].push(OY_SELF_SHORT);
        for (let oy_peer_select in OY_PEERS) {
            if (OY_PEERS[oy_peer_select][9]===0||oy_peer_select==="oy_aggregate_node"||oy_data_payload[0].indexOf(oy_short(oy_peer_select))!==-1) continue;
            //oy_log("Routing data via peer "+oy_short(oy_peer_select)+" with flag "+oy_data_flag);
            oy_data_beam(oy_peer_select, oy_data_flag, oy_data_payload);
        }
    }
    else if (oy_data_logic==="OY_LOGIC_SYNC") {
        //oy_data_payload[0] is oy_route_passport_passive
        //oy_data_payload[0] is oy_route_passport_crypt
        if (OY_BLOCK_HASH===null) return false;

        oy_data_payload[0].push(OY_SELF_PUBLIC);
        for (let oy_peer_select in OY_PEERS) {
            if (OY_PEERS[oy_peer_select][9]!==2||oy_peer_select==="oy_aggregate_node"||oy_data_payload[0].indexOf(oy_peer_select)!==-1) continue;//TODO efficiency for dive ledger check
            //oy_log("Routing data via peer "+oy_short(oy_peer_select)+" with flag "+oy_data_flag);
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
        oy_data_payload[0].push(OY_SELF_SHORT);
        //oy_log("Routing data via peer "+oy_short(oy_peer_final)+" with flag "+oy_data_flag);
        oy_data_beam(oy_peer_final, oy_data_flag, oy_data_payload);
    }
    else if (oy_data_logic==="OY_LOGIC_UPSTREAM") {
        if (OY_LIGHT_STATE===false||OY_LIGHT_UPSTREAM===null) {
            oy_log("Data route cannot upstream transmit flag "+oy_data_flag);
            return false;
        }
        let oy_peer_select = OY_LIGHT_UPSTREAM;
        oy_data_payload[0].push(OY_SELF_SHORT);
        //oy_log("Routing data via peer "+oy_short(oy_peer_select)+" with flag "+oy_data_flag);
        oy_data_beam(oy_peer_select, oy_data_flag, oy_data_payload);
    }
    else {
        oy_log("Invalid data_logic provided: "+oy_data_logic+", will cancel");
        return false;
    }
    return true;
}

function oy_data_direct(oy_data_flag) {
    return !(oy_data_flag.indexOf("OY_PEER")===-1&&oy_data_flag.indexOf("OY_LATENCY")===-1);
}

//send data
function oy_data_beam(oy_node_id, oy_data_flag, oy_data_payload) {
    if (OY_CONN===null) {
        oy_log("Connection handler is null, skipping "+oy_data_flag+" to "+oy_short(oy_node_id));
        return false;
    }
    let oy_callback_local = function() {
        let oy_data_raw = JSON.stringify([oy_data_flag, oy_data_payload]);//convert data array to JSON
        let oy_data_direct_bool = oy_data_direct(oy_data_flag);
        if (oy_data_direct_bool===false&&oy_data_payload[0].length>OY_MESH_HOP_MAX) {
            oy_log("Almost sent a data sequence with too many hops for flag "+oy_data_flag+", go tell Bruno", 1);
            return false;
        }
        //oy_data_payload = null;
        if (oy_data_raw.length>OY_DATA_MAX) {
            oy_log("Almost sent an excessively sized data sequence for flag "+oy_data_flag+", go tell Bruno", 1);
            return false;
        }
        if (oy_data_flag!=="OY_BLOCK_SYNC"&&oy_data_direct_bool===false&&oy_peer_check(oy_node_id)&&!oy_data_measure(true, oy_node_id, oy_data_raw.length)) {
            oy_log("Cooling off, skipping "+oy_data_flag+" to "+oy_short(oy_node_id));
            return true;
        }
        OY_NODES[oy_node_id][0].send(oy_data_raw);//send the JSON-converted data array to the destination node
        if (oy_data_flag!=="OY_BLOCK_SYNC") oy_log("BEAM["+oy_data_flag+"]["+oy_short(oy_node_id)+"]");
        else if (oy_data_payload[0].length===1) console.log("BEAM["+oy_data_flag+"]["+oy_short(oy_node_id)+"]["+JSON.stringify(oy_data_payload)+"]");
    };
    oy_node_connect(oy_node_id, oy_callback_local);
    return true;
}

//incoming data validation
function oy_data_soak(oy_node_id, oy_data_raw) {
   try {
       if (oy_data_raw.length>OY_DATA_MAX) {
           oy_node_punish(oy_node_id, "OY_PUNISH_DATA_LARGE");
           return false;
       }
       let oy_data = JSON.parse(oy_data_raw);
       if (oy_data&&typeof(oy_data)==="object") {
           if (oy_data[0]!=="OY_BLOCK_SYNC") oy_log("SOAK["+oy_data[0]+"]["+oy_short(oy_node_id)+"]");
           if (!oy_data_direct(oy_data[0])) {
               if (typeof(oy_data[1][0])!=="object") {
                   oy_node_punish(oy_node_id, "OY_PUNISH_PASSPORT_INVALID");
                   return false;
               }

               if (oy_data[1][0].length>OY_MESH_HOP_MAX) {
                   oy_node_punish(oy_node_id, "OY_PUNISH_PASSPORT_HOP");
                   return false;
               }

               if (oy_data[0]==="OY_BLOCK_SYNC") {
                   if (!oy_peer_check(oy_node_id)) return false;

                   let oy_peer_last = oy_data[1][0][oy_data[1][0].length-1];
                   if (oy_peer_last!==oy_node_id) {
                       oy_node_punish(oy_peer_last, "OY_PUNISH_PASSPORT_MISMATCH_A");
                       return false;
                   }

                   if (oy_data[1][0].indexOf(OY_SELF_PUBLIC)!==-1) {
                       oy_node_punish(oy_node_id, "OY_PUNISH_PASSPORT_ALREADY_A");
                       return false;
                   }
               }
               else {
                   let oy_peer_last = oy_data[1][0][oy_data[1][0].length-1];
                   if (oy_peer_last!==oy_short(oy_node_id)) {
                       oy_node_punish(oy_peer_last, "OY_PUNISH_PASSPORT_MISMATCH_B");
                       return false;
                   }

                   if (oy_data[1][0].indexOf(OY_SELF_SHORT)!==-1) {
                       oy_node_punish(oy_node_id, "OY_PUNISH_PASSPORT_ALREADY_B");
                       return false;
                   }
                   if (oy_data[1][0].length>1&&!!oy_peer_find(oy_data[1][0][0])) return true;//TODO check if necessary
               }

               if (OY_LOGIC_ALL_TYPE.indexOf(oy_data[0])!==-1) {
                   if (!oy_peer_check(oy_node_id)) return false;

                   if (OY_ROUTE_DYNAMIC.indexOf(oy_data[1][1])!==-1) return true;
                   OY_ROUTE_DYNAMIC.push(oy_data[1][1]);
                   while (OY_ROUTE_DYNAMIC.length>OY_ROUTE_DYNAMIC_KEEP) OY_ROUTE_DYNAMIC.shift();
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

//deposits data for local retention, returns true if stored and false if not stored
function oy_data_deposit(oy_data_handle, oy_data_nonce, oy_data_value, oy_callback) {
    if (typeof(oy_callback)!=="function") oy_callback = function(){};

    OY_DB.oy_data.get(oy_data_handle+oy_data_nonce).then(oy_obj => {
        if (oy_obj!==undefined) oy_callback(true);
        else {
            if (Math.random()>OY_MESH_DEPOSIT_CHANCE) oy_callback(false);
            else {
                OY_DB.oy_data.put({oy_data_key:oy_data_handle+oy_data_nonce, oy_data_time:Date.now/1000|0, oy_data_value:oy_data_value})
                    .then(function() {
                        oy_callback(true);
                        oy_log("Stored handle "+oy_data_handle+" at nonce "+oy_data_nonce);
                    })
                    .catch(function() {
                        oy_callback(false);
                        oy_db_error();
                    });
            }
        }
    });
    return true;
}

function oy_data_deposit_get(oy_data_handle, oy_data_nonce, oy_callback) {
    OY_DB.oy_data.get(oy_data_handle+oy_data_nonce)
        .then(oy_obj => {
            if (oy_obj.oy_data_value===undefined) oy_callback(false);
            else oy_callback(oy_obj.oy_data_value);
        })
        .catch(oy_db_error);
}

function oy_data_deposit_purge() {
    OY_DB.oy_data.orderBy("oy_data_time")
        .limit(OY_DATA_PURGE)
        .toArray()
        .then(oy_result => {
            for (let i in oy_result) {
                OY_DB.oy_data.delete(oy_result[i]["oy_key"]);
            }
        })
        .catch(oy_db_error);
    oy_log("Purged "+OY_DATA_PURGE+" handles from deposit");
}

function oy_channel_check(oy_channel_id) {
    return oy_channel_id.length===40;
}

//updates map of channel node topology
function oy_channel_top(oy_channel_id, oy_passport_passive, oy_channel_approved) {
    let oy_time_local = Date.now()/1000|0;
    let oy_top_key;
    if (oy_channel_approved===false) oy_top_key = oy_passport_passive[0];
    else oy_top_key = oy_channel_approved;

    if (typeof(OY_CHANNEL_TOP[oy_channel_id])==="undefined") OY_CHANNEL_TOP[oy_channel_id] = {};
    if (typeof(OY_CHANNEL_TOP[oy_channel_id][oy_top_key])==="undefined") OY_CHANNEL_TOP[oy_channel_id][oy_top_key] = [oy_time_local, -1, oy_passport_passive, !!oy_channel_approved];
    else {
        OY_CHANNEL_TOP[oy_channel_id][oy_top_key][0] = oy_time_local;
        OY_CHANNEL_TOP[oy_channel_id][oy_top_key][2] = oy_passport_passive;
        OY_CHANNEL_TOP[oy_channel_id][oy_top_key][3] = !!oy_channel_approved;
    }
}

function oy_channel_top_count(oy_channel_id) {
    let oy_online = 0;
    let oy_watching = 0;
    if (typeof(OY_CHANNEL_TOP[oy_channel_id])!=="undefined") {
        for (let oy_top_key in OY_CHANNEL_TOP[oy_channel_id]) {
            if (OY_CHANNEL_TOP[oy_channel_id][oy_top_key][3]===true) oy_online++;
            else oy_watching++;
        }
    }
    return [oy_online, oy_watching];
}

//checks if the public key is on the admin or approve list in the current block
function oy_channel_approved(oy_channel_id, oy_key_public) {
    return (typeof(OY_BLOCK[8][oy_channel_id])!=="undefined"&&(OY_BLOCK[8][oy_channel_id][2].indexOf(oy_key_public)!==-1||OY_BLOCK[8][oy_channel_id][3].indexOf(oy_key_public)!==-1));
}

function oy_channel_verify(oy_data_payload) {
    let oy_time_local = Date.now()/1000;
    if (OY_BLOCK_HASH===null) return null;
    else if (oy_channel_approved(oy_data_payload[2], oy_data_payload[5])&&oy_data_payload[6]<=oy_time_local+OY_MESH_BUFFER[0]&&oy_data_payload[6]>oy_time_local-2) return oy_key_verify(oy_data_payload[5], oy_data_payload[4], oy_data_payload[6]+oy_data_payload[7]+oy_data_payload[3]);
    return false;
}

//broadcasts a signed message for a specified channel
function oy_channel_broadcast(oy_channel_id, oy_channel_payload, oy_key_private, oy_key_public, oy_callback_complete, oy_callback_echo) {
    let oy_time_local = Date.now()/1000;
    let oy_channel_base;
    if (oy_channel_payload==="OY_CHANNEL_PING") oy_channel_base = oy_channel_payload;
    else oy_channel_base = LZString.compressToUTF16(oy_channel_payload);
    let oy_top_count = oy_channel_top_count(oy_channel_id);
    let oy_payload_crypt = oy_key_sign(oy_key_private, oy_time_local+oy_top_count[0]+oy_channel_base);
    let oy_data_payload = [[], oy_rand_gen(), oy_channel_id, oy_channel_base, oy_payload_crypt, oy_key_public, oy_time_local, oy_top_count[0]];
    if (oy_channel_verify(oy_data_payload)===true) {
        let oy_broadcast_hash = oy_hash_gen(oy_payload_crypt);
        if (typeof(oy_callback_echo)==="function") OY_CHANNEL_ECHO[oy_channel_id+oy_data_payload[1]] = [oy_time_local+2, oy_broadcast_hash, oy_callback_echo, []];
        if (typeof(OY_CHANNEL_LISTEN[oy_channel_id])!=="undefined"&&OY_CHANNEL_LISTEN[oy_channel_id][0]===oy_key_private&&OY_CHANNEL_LISTEN[oy_channel_id][1]===oy_key_public) OY_CHANNEL_LISTEN[oy_channel_id][3] = oy_time_local;
        oy_data_route("OY_LOGIC_ALL", "OY_CHANNEL_BROADCAST", oy_data_payload);
        let oy_render_payload = oy_data_payload.slice();
        oy_render_payload[3] = oy_channel_payload;
        if (typeof(oy_callback_complete)==="function") oy_callback_complete(oy_broadcast_hash, oy_render_payload);
    }
}

//listens for signed messages on a specified channel
function oy_channel_listen(oy_channel_id, oy_callback, oy_key_private, oy_key_public) {
    if (typeof(oy_key_private)==="undefined"||typeof(oy_key_public)==="undefined") {
        oy_key_private = null;
        oy_key_public = null;
    }

    OY_CHANNEL_LISTEN[oy_channel_id] = [oy_key_private, oy_key_public, oy_callback, -1];

    if (typeof(OY_CHANNEL_KEEP[oy_channel_id])==="undefined") OY_CHANNEL_KEEP[oy_channel_id] = {};
    OY_DB.oy_channel.where("oy_channel_id").equals(oy_channel_id).each(function(oy_obj) {
        OY_CHANNEL_KEEP[oy_channel_id][oy_obj.oy_broadcast_hash] = oy_obj.oy_broadcast_payload;
    });
}

// noinspection JSUnusedGlobalSymbols
function oy_channel_mute(oy_channel_id) {
    delete OY_CHANNEL_LISTEN[oy_channel_id];
    delete OY_CHANNEL_KEEP[oy_channel_id];
    delete OY_CHANNEL_TOP[oy_channel_id];
    delete OY_CHANNEL_RENDER[oy_channel_id];
}

function oy_channel_commit(oy_channel_id, oy_broadcast_hash, oy_broadcast_payload) {
    OY_DB.oy_channel.put({oy_broadcast_hash:oy_broadcast_hash, oy_channel_id:oy_channel_id, oy_broadcast_payload:oy_broadcast_payload})
        .catch(oy_db_error);
}

function oy_akoya_transfer(oy_key_private, oy_key_public, oy_transact_fee, oy_transfer_amount, oy_receive_public, oy_callback_confirm) {
    if (OY_BLOCK_HASH===null||oy_key_private===null||oy_key_public===null) return false;

    let oy_command_array = ["OY_AKOYA_SEND", [-1, oy_transact_fee], oy_key_public, Math.floor(oy_transfer_amount*OY_AKOYA_DECIMALS), oy_receive_public];
    if (!OY_BLOCK_COMMANDS[oy_command_array[0]][0](oy_command_array)) return false;

    return oy_block_command(oy_key_private, oy_command_array, oy_callback_confirm);
}

function oy_dns_transfer(oy_key_private, oy_key_public, oy_transact_fee, oy_dns_name, oy_receive_public, oy_callback_confirm) {
    if (OY_BLOCK_HASH===null||oy_key_private===null||oy_key_public===null) return false;

    let oy_command_array = ["OY_DNS_TRANSFER", [-1, oy_transact_fee], oy_key_public, oy_dns_name, oy_receive_public];
    if (!OY_BLOCK_COMMANDS[oy_command_array[0]][0](oy_command_array)) return false;

    return oy_block_command(oy_key_private, oy_command_array, oy_callback_confirm);
}

function oy_hivemind_cluster(oy_key_private, oy_key_public, oy_transact_fee, oy_entropy_id, oy_author_revoke, oy_submission_price, oy_vote_limit, oy_expire_quota, oy_capacity_active, oy_capacity_inactive, oy_post_holder, oy_callback_confirm) {
    if (OY_BLOCK_HASH===null||oy_key_private===null||oy_key_public===null) return false;

    let oy_command_array = ["OY_META_SET", [-1, oy_transact_fee], oy_key_public, oy_entropy_id, 1, [[0, oy_author_revoke, Math.floor(oy_submission_price*OY_AKOYA_DECIMALS), oy_vote_limit, oy_expire_quota, oy_capacity_active, oy_capacity_inactive], oy_post_holder]];
    if (!OY_BLOCK_COMMANDS[oy_command_array[0]][0](oy_command_array)||!OY_BLOCK_TRANSACTS["OY_HIVEMIND_CLUSTER"][0](oy_command_array)) return false;

    return oy_block_command(oy_key_private, oy_command_array, oy_callback_confirm);
}

function oy_hivemind_post(oy_key_private, oy_key_public, oy_transact_fee, oy_cluster_id, oy_submission_payment, oy_post_title, oy_post_handle, oy_callback_confirm) {
    if (OY_BLOCK_HASH===null||oy_key_private===null||oy_key_public===null) return false;

    let oy_command_array = ["OY_META_SET", [-1, oy_transact_fee], oy_key_public, "", 1, [[1, oy_cluster_id, -1, Math.floor(oy_submission_payment*OY_AKOYA_DECIMALS)], [LZString.compressToBase64(oy_post_title), oy_post_handle]]];
    if (!OY_BLOCK_COMMANDS[oy_command_array[0]][0](oy_command_array)||!OY_BLOCK_TRANSACTS["OY_HIVEMIND_POST"][0](oy_command_array)) return false;

    return oy_block_command(oy_key_private, oy_command_array, oy_callback_confirm);
}

function oy_block_range(oy_mesh_range_new) {
    let oy_range_diff = oy_mesh_range_new - OY_BLOCK[0][2];
    if (oy_range_diff>0&&OY_BLOCK_BOOT===false) OY_BLOCK[0][3] += oy_range_diff*OY_WORK_INCREMENT;
    else OY_BLOCK[0][3] += (oy_range_diff-1)*OY_WORK_DECREMENT;

    if (OY_BLOCK[0][3]>OY_WORK_MAX) OY_BLOCK[0][3] = OY_WORK_MAX;
    if (OY_BLOCK[0][3]<OY_WORK_MIN) OY_BLOCK[0][3] = OY_WORK_MIN;

    OY_BLOCK[0][2] = oy_mesh_range_new;
    OY_BLOCK_STABILITY_KEEP.push(OY_BLOCK[0][2]);
    while (OY_BLOCK_STABILITY_KEEP.length>OY_BLOCK_STABILITY_LIMIT) OY_BLOCK_STABILITY_KEEP.shift();
    OY_BLOCK_STABILITY = (OY_BLOCK_STABILITY_KEEP.length<OY_BLOCK_STABILITY_TRIGGER)?0:oy_block_stability(OY_BLOCK_STABILITY_KEEP);

    if (OY_BLOCK[0][2]<OY_BLOCK_RANGE_MIN&&OY_BLOCK_BOOT===false) {
        oy_block_reset("OY_FLAG_DROP_RANGE");
        oy_log("MESHBLOCK DROP [RANGE_MIN]");
        return false;
    }
    return true;
}

function oy_block_command(oy_key_private, oy_command_array, oy_callback_confirm) {
    if (OY_BLOCK_HASH===null) return false;

    oy_command_array[1][0] = Date.now()/1000;
    if (OY_LIGHT_STATE===false) oy_command_array[1][1] = -1;
    let oy_command_flat = JSON.stringify(oy_command_array);
    let oy_command_hash = oy_hash_gen(oy_command_flat);
    let oy_command_crypt = oy_key_sign(oy_key_private, oy_command_hash);

    if (!oy_block_command_verify(oy_command_array, oy_command_crypt, oy_command_hash)) return false;

    if (typeof(oy_callback_confirm)!=="undefined") OY_BLOCK_CONFIRM[oy_command_hash] = oy_callback_confirm;

    if (OY_LIGHT_STATE===false) {
        OY_BLOCK_COMMAND[oy_command_hash] = [oy_command_array, oy_command_crypt];
        //if (typeof(OY_BLOCK_MAP)==="function") OY_BLOCK_MAP(0, true);
    }
    else {
        for (let oy_delay = 0;oy_delay <= 300;oy_delay += 50) {
            oy_chrono(function() {
                oy_data_route("OY_LOGIC_UPSTREAM", "OY_BLOCK_COMMAND", [[], oy_command_array, oy_command_crypt]);
            }, oy_delay);
        }
    }

    return true;
}

function oy_block_command_hash(oy_sync_command) {//DUPLICATED IN WEB WORKER BLOCK
    let oy_command_pool = {};
    for (let i in oy_sync_command) {
        if (oy_sync_command[i].length!==2) return false;

        let oy_command_hash = oy_hash_gen(JSON.stringify(oy_sync_command[i][0]));
        if (typeof(oy_command_pool[oy_command_hash])!=="undefined") return false;
        oy_command_pool[oy_command_hash] = true;
        oy_sync_command[i][2] = oy_command_hash;
    }
    return oy_sync_command;
}

function oy_block_command_verify(oy_command_array, oy_command_crypt, oy_command_hash) {//DUPLICATED IN WEB WORKER BLOCK
    if (typeof(oy_command_array[0])==="undefined"||//check that a command was given
        typeof(OY_BLOCK_COMMANDS[oy_command_array[0]])==="undefined"||//check that the signed command is a recognizable command
        !Number.isInteger(oy_command_array[1][1])||//check that the assigned fee is a valid integer
        oy_command_array[1][1]<0||//check that the assigned fee is a positive number
        oy_command_array[1][1]>OY_AKOYA_LIQUID) {//prevent integer overflow for the assigned fee
        return false;
    }

    if (oy_key_verify(oy_command_array[2], oy_command_crypt, oy_command_hash)) return OY_BLOCK_COMMANDS[oy_command_array[0]][0](oy_command_array);
    else return false;
}

function oy_block_command_scan(oy_command_verify) {//DUPLICATED IN WEB WORKER BLOCK
    if (oy_command_verify.length===0) return true;
    let [oy_command_array, oy_command_crypt, oy_command_hash] = oy_command_verify.pop();
    if (oy_block_command_verify(oy_command_array, oy_command_crypt, oy_command_hash)) return oy_block_command_scan(oy_command_verify);
    else return false;
}

function oy_block_stability(oy_list) {
    let oy_stability_avg = function(oy_data){
        let oy_sum = oy_data.reduce(function(oy_sum, oy_value){
            return oy_sum + oy_value;
        }, 0);
        return oy_sum/oy_data.length;
    };
    let oy_avg = oy_stability_avg(oy_list);

    let oy_square_diffs = oy_list.map(function(oy_value){
        let oy_diff = oy_value - oy_avg;
        return oy_diff * oy_diff;
    });

    return Math.sqrt(oy_stability_avg(oy_square_diffs));
}

function oy_block_time() {
    return Math.floor(Date.now()/10000)*10;
}

function oy_block_time_first(oy_next) {
    let oy_block_time_local = oy_block_time();
    let oy_offset = 10;
    if ((oy_block_time_local/10)%2===0) oy_offset = 0;
    if (oy_next===true) return (oy_block_time_local+20)-oy_offset;
    return oy_block_time_local-oy_offset;
}

function oy_block_reset(oy_reset_flag) {
    let oy_time_local = Date.now()/1000;

    if (OY_BLOCK_HALT!==null&&oy_time_local-OY_BLOCK_HALT<OY_BLOCK_HALT_BUFFER) return false;//prevents duplicate calls of block_reset()

    OY_BLOCK_HALT = oy_time_local;
    OY_BLOCK_HASH = null;
    OY_BLOCK_FLAT = null;
    OY_BLOCK_DIFF = false;
    OY_BLOCK_SIGN = null;
    OY_BLOCK_UPTIME = null;
    OY_BLOCK_WEIGHT = null;
    OY_BLOCK_STABILITY = 0;
    OY_BLOCK_STABILITY_KEEP = [OY_BLOCK_RANGE_MIN];
    OY_BLOCK_COMMAND = {};
    OY_BLOCK_SYNC = {};
    OY_BLOCK_CHALLENGE = {};
    OY_BLOCK_JUDGE = [null];
    OY_BLOCK_LEARN = [null];
    OY_BLOCK = oy_clone_object(OY_BLOCK_TEMPLATE);
    OY_DIFF_TRACK = [{}, []];
    OY_BASE_BUILD = [];
    OY_LIGHT_BUILD = {};
    OY_LIGHT_UPSTREAM = null;
    OY_LIGHT_PROCESS = false;
    OY_SYNC_LAST = [0, 0];
    OY_BLACKLIST = {};

    for (let oy_peer_select in OY_PEERS) {
        if (oy_peer_select==="oy_aggregate_node") continue;
        oy_data_beam(oy_peer_select, "OY_PEER_BLANK", null);
        if (OY_PEERS[oy_peer_select][9]===0) oy_peer_remove(oy_peer_select, "OY_REASON_DOUBLE_BLANK");//double blank prohibition
    }

    oy_log("MESHBLOCK RESET ["+oy_reset_flag+"]");
    console.log("MESHBLOCK RESET ["+oy_reset_flag+"]");//TODO temp

    document.dispatchEvent(OY_BLOCK_RESET);
    document.dispatchEvent(OY_STATE_BLANK);

    oy_boost();
}

function oy_block_loop() {
    let oy_block_time_local = oy_block_time();
    oy_chrono(oy_block_loop, OY_BLOCK_LOOP);
    if (oy_block_time_local!==OY_BLOCK_TIME&&(oy_block_time_local/10)%2===0) {
        OY_BLOCK_TIME = oy_block_time_local;
        OY_BLOCK_NEXT = oy_block_time_local+20;
        if (oy_block_time_local<OY_BLOCK_BOOTTIME) OY_BLOCK_BOOT = null;
        else OY_BLOCK_BOOT = oy_block_time_local-OY_BLOCK_BOOTTIME<OY_BLOCK_BOOT_BUFFER;

        OY_LIGHT_PROCESS = false;
        OY_BASE_BUILD = [];
        OY_BOOST_BUILD = [];
        let oy_block_continue = true;

        if (OY_BLOCK_BOOT===true) {
            if (OY_LIGHT_MODE===true) return false;//if self elects to be a light node they cannot participate in the initial boot-up sequence of the mesh
            OY_LIGHT_STATE = false;//since node has elected to being a full node, set light state flag to false
        }

        document.dispatchEvent(OY_BLOCK_INIT);

        //BLOCK SEED--------------------------------------------------
        if (OY_LIGHT_MODE===false&&OY_BLOCK_TIME===OY_BLOCK_BOOTTIME) {
            OY_BLOCK = oy_clone_object(OY_BLOCK_TEMPLATE);
            OY_BLOCK[0][0] = OY_MESH_DYNASTY;//dynasty
            OY_BLOCK[0][2] = 0;//mesh range
            OY_BLOCK[0][3] = OY_WORK_MIN;//memory difficulty
            OY_BLOCK[0][4] = OY_BLOCK_TIME;//genesis timestamp
            OY_BLOCK[4]["oy_escrow_dns"] = 0;

            //SEED DEFINITION------------------------------------
            OY_BLOCK[4][OY_KEY_BRUNO] = 1000000*OY_AKOYA_DECIMALS;
            OY_BLOCK[4]["cJo3PZm9o5fwx0g2QlNKNTD9eOlOygpe9ShKetEfg0Qw"] = 1000000*OY_AKOYA_DECIMALS;
            OY_BLOCK[4]["yvU1vKfFZHygqi5oQl22phfTFTbo5qwQBHZuesCOtdgA"] = 1000000*OY_AKOYA_DECIMALS;
            //SEED DEFINITION------------------------------------

            OY_BLOCK_HASH = oy_hash_gen(JSON.stringify(OY_BLOCK));
            document.dispatchEvent(OY_STATE_FULL);
        }
        //BLOCK SEED--------------------------------------------------

        //FULL NODE -> LIGHT NODE
        if (OY_LIGHT_MODE===true&&OY_LIGHT_STATE===false) {
            OY_BLOCK_DIFF = true;
            OY_LIGHT_STATE = true;
            document.dispatchEvent(OY_STATE_LIGHT);
            for (let oy_peer_select in OY_PEERS) {
                if (oy_peer_select==="oy_aggregate_node") continue;
                oy_data_beam(oy_peer_select, "OY_PEER_LIGHT", oy_key_sign(OY_SELF_PRIVATE, OY_MESH_DYNASTY+OY_BLOCK_HASH));
            }
        }

        let oy_full_count = 0;
        if (OY_BLOCK_HASH!==null) {
            for (let oy_peer_select in OY_PEERS) {
                if (oy_peer_select!=="oy_aggregate_node"&&OY_PEERS[oy_peer_select][9]===2&&typeof(OY_BLOCK[1][oy_peer_select])!=="undefined") oy_full_count++;
            }
        }
        if (OY_LIGHT_STATE===false) oy_log_debug("HASH: "+OY_BLOCK_HASH+" FULL COUNT: "+oy_full_count+" WORK HASH: "+JSON.stringify(OY_WORK_HASH));
        if (OY_LIGHT_STATE===false&&OY_BLOCK_HASH!==null&&OY_WORK_HASH!==null&&(oy_full_count>=OY_BLOCK_SYNC_PEERS||OY_BLOCK_BOOT===true)) {
            //oy_log_debug("COMMAND: "+JSON.stringify(OY_BLOCK_COMMAND));
            let oy_command_sort = [];
            for (let oy_command_hash in OY_BLOCK_COMMAND) {
                if (OY_BLOCK_COMMAND[oy_command_hash][0][1][0]<OY_BLOCK_TIME&&OY_BLOCK_COMMAND[oy_command_hash][0][1][0]>=OY_BLOCK_TIME-20) oy_command_sort.push([OY_BLOCK_COMMAND[oy_command_hash][0], OY_BLOCK_COMMAND[oy_command_hash][1], oy_command_hash]);//oy_command_hash is third because it is removed for efficiency
            }
            OY_BLOCK_COMMAND = {};

            oy_command_sort.sort(function(a, b) {
                if (a[0][1][0]===b[0][1][0]) {
                    let x = a[2].toLowerCase();
                    let y = b[2].toLowerCase();

                    return x < y ? -1 : x > y ? 1 : 0;
                }
                return a[0][1][0] - b[0][1][0];
            });

            OY_BLOCK_SYNC = {};
            OY_BLOCK_SYNC[OY_SELF_PUBLIC] = [null, oy_command_sort];

            for (let i in oy_command_sort) {
                oy_command_sort[i].pop();
            }

            let oy_sync_command = LZString.compressToUTF16(JSON.stringify(oy_command_sort));

            OY_BLOCK_LEARN = new Array((OY_BLOCK_BOOT===true)?OY_MESH_HOP_MAX:(Math.ceil(Math.sqrt(OY_BLOCK[0][2]))+OY_MESH_EXPAND));
            OY_BLOCK_LEARN[0] = null;
            OY_BLOCK_LEARN.fill({}, 1);
            let oy_block_sync_hash = oy_hash_gen(oy_sync_command);
            let oy_sync_time = Date.now()/1000;

            //oy_log_debug("SYNC WORK HASH: "+JSON.stringify(OY_WORK_HASH));
            let oy_sync_crypt = oy_key_sign(OY_SELF_PRIVATE, oy_sync_time+oy_block_sync_hash+OY_WORK_HASH);
            oy_chrono(function() {
                oy_data_route("OY_LOGIC_SYNC", "OY_BLOCK_SYNC", [[], [oy_key_sign(OY_SELF_PRIVATE, oy_short(oy_sync_crypt))], oy_sync_crypt, oy_sync_time, oy_sync_command, OY_WORK_HASH]);
                OY_WORK_HASH = null;
            }, OY_MESH_BUFFER[1]);
        }
        else {
            OY_BLOCK_COMMAND = {};
            OY_BLOCK_SYNC = {};
        }

        oy_chrono(function() {
            OY_BLOCK_DIFF = false;

            let oy_time_local = Date.now()/1000;
            if (OY_BLOCK_HASH===null) {
                OY_BLOCK_CHALLENGE = {};
                oy_log("MESHBLOCK SKIP: "+oy_block_time_local);
                oy_block_continue = false;
                return false;
            }
            if (OY_BLOCK[0][1]!==null&&OY_BLOCK[0][1]!==oy_block_time_local-20) {
                console.log(OY_BLOCK[0][1]);
                console.log(oy_block_time_local);
                oy_block_reset("OY_FLAG_MISSTEP");
                oy_log("MESHBLOCK MISSTEP");
                oy_block_continue = false;
                return false;
            }
            if (OY_PEER_COUNT===0&&OY_BLOCK_BOOT===false) {
                oy_block_reset("OY_FLAG_DROP_PEER");
                oy_log("MESHBLOCK DROP");
                oy_block_continue = false;
                return false;
            }

            if (OY_BLOCK_UPTIME===null&&OY_PEER_COUNT>0) OY_BLOCK_UPTIME = oy_time_local;

            oy_chrono(function() {
                for (let oy_peer_select in OY_BLOCK_CHALLENGE) {
                    if (!oy_peer_check(oy_peer_select)||OY_PEERS[oy_peer_select][9]===0) continue;
                    oy_peer_remove(oy_peer_select, "OY_REASON_BLOCK_HASH");
                    delete OY_BLOCK_CHALLENGE[oy_peer_select];
                }

                for (let oy_peer_local in OY_PEERS) {
                    if (oy_peer_local==="oy_aggregate_node") continue;
                    let oy_time_diff_last = oy_time_local-OY_PEERS[oy_peer_local][1];
                    let oy_time_diff_latency = oy_time_local-OY_PEERS[oy_peer_local][2];
                    if (oy_time_diff_last>=OY_PEER_KEEPTIME||oy_time_diff_latency>=OY_PEER_LATENCYTIME) {
                        if (typeof(OY_ENGINE[0][oy_peer_local])==="undefined") {
                            if (oy_latency_test(oy_peer_local, "OY_PEER_ROUTINE", true, OY_PEERS[oy_peer_local][9])) OY_ENGINE[0][oy_peer_local] = oy_time_local;
                        }
                        else if (oy_time_local-OY_ENGINE[0][oy_peer_local]>OY_LATENCY_MAX) oy_node_punish(oy_peer_local, "OY_PUNISH_LATENCY_LAG");
                    }
                    else delete OY_ENGINE[0][oy_peer_local];
                }
            }, OY_BLOCK_BUFFER_MIN/2);

            oy_boost();
        }, OY_BLOCK_SECTORS[0][1]);//mid meshblock challenges + checks to verify previous meshblock

        oy_chrono(function() {
            if (OY_LIGHT_STATE===true||OY_LIGHT_PROCESS===true) return false;

            if (OY_BLOCK_HASH===null) {
                oy_block_reset("OY_FLAG_NULL_HASH_A");
                oy_log("MESHBLOCK CANCEL: "+oy_block_time_local);
                return false;
            }

            let oy_command_execute = [];
            if (OY_BLOCK_TIME-OY_BLOCK_BOOTTIME>OY_BLOCK_BOOT_BUFFER/2) {
                for (let oy_key_public in OY_BLOCK_SYNC) {
                    if (OY_BLOCK_SYNC[oy_key_public]===false) delete OY_BLOCK_SYNC[oy_key_public];
                }

                let oy_command_check = {};
                let oy_dive_ledger = {};
                for (let oy_key_public in OY_BLOCK_SYNC) {
                    oy_dive_ledger[oy_key_public] = [(typeof(OY_BLOCK[1][oy_key_public])!=="undefined")?OY_BLOCK[1][oy_key_public][0]+1:1, 0, 0];//[continuity_count, transact_fee_payout, dive_final_balance]
                }
                for (let oy_key_public in OY_BLOCK_SYNC) {
                    for (let i in OY_BLOCK_SYNC[oy_key_public][1]) {
                        if (typeof(oy_command_check[OY_BLOCK_SYNC[oy_key_public][1][i][2]])==="undefined"||
                            oy_dive_ledger[oy_key_public][0]>oy_dive_ledger[oy_command_check[OY_BLOCK_SYNC[oy_key_public][1][i][2]][0]][0]||
                            oy_key_public<oy_command_check[OY_BLOCK_SYNC[oy_key_public][1][i][2]][0]) oy_command_check[OY_BLOCK_SYNC[oy_key_public][1][i][2]] = [oy_key_public, OY_BLOCK_SYNC[oy_key_public][1][i][0]];
                    }
                }
                OY_BLOCK_SYNC = {};

                let oy_dive_sort = [];
                for (let oy_key_public in oy_dive_ledger) {
                    oy_dive_sort.push([oy_key_public, oy_dive_ledger[oy_key_public]]);
                }
                oy_dive_ledger = {};
                oy_dive_sort.sort(function(a, b) {
                    let x = a[0].toLowerCase();
                    let y = b[0].toLowerCase();

                    return x < y ? -1 : x > y ? 1 : 0;
                });
                for (let i in oy_dive_sort) {
                    oy_dive_ledger[oy_dive_sort[i][0]] = oy_dive_sort[i][1];
                }

                for (let oy_command_hash in oy_command_check) {
                    if (typeof(OY_BLOCK[4][oy_command_check[oy_command_hash][1][1][2]])==="undefined"||OY_BLOCK[4][oy_command_check[oy_command_hash][1][1][2]]<oy_command_check[oy_command_hash][1][1][1][1]+OY_AKOYA_FEE) continue;//TODO check if fee buffer needs to be strict or not
                    OY_BLOCK[4][oy_command_check[oy_command_hash][1][1][2]] -= oy_command_check[oy_command_hash][1][1][1][1];
                    oy_dive_ledger[oy_command_check[oy_command_hash][0]][1] += oy_command_check[oy_command_hash][1][1][1][1];
                    if (oy_command_check[oy_command_hash][0][1][0]<OY_BLOCK_TIME&&oy_command_check[oy_command_hash][0][1][0]>=OY_BLOCK_TIME-20) oy_command_execute.push([oy_command_check[oy_command_hash][1][0], oy_command_check[oy_command_hash][1][1], oy_command_hash]);
                }

                OY_BLOCK[1] = oy_clone_object(oy_dive_ledger);
                oy_dive_ledger = null;

                oy_command_execute.sort(function(a, b) {
                    if (a[0][1][0]===b[0][1][0]) {
                        let x = a[2].toLowerCase();
                        let y = b[2].toLowerCase();

                        return x < y ? -1 : x > y ? 1 : 0;
                    }
                    return a[0][1][0] - b[0][1][0];
                });

                if (!oy_block_range(Object.keys(OY_BLOCK[1]).length)) return false;
            }
            else OY_BLOCK_SYNC = {};

            OY_BLOCK_NEW = {};
            OY_DIFF_TRACK = [{}, []];
            //OY_DIFF_TRACK breakdown:
            //[0] is dive ledger
            //[1] is command transactions

            let [oy_process_pass, oy_dive_bounty] = oy_block_process(oy_command_execute, true);
            if (oy_process_pass===false) return false;

            if (OY_BLOCK_BOOT===false) {
                oy_dive_bounty += OY_AKOYA_ISSUANCE;

                let oy_dive_share = Math.floor(oy_dive_bounty/OY_BLOCK[0][2]);
                for (let oy_key_public in OY_BLOCK[1]) {
                    //if (oy_dive_reward===oy_dive_reward_pool[i]) OY_BLOCK_DIVE_TRACK += oy_dive_share;TODO track self dive earnings
                    if (typeof(OY_BLOCK[4][oy_key_public])==="undefined") OY_BLOCK[4][oy_key_public] = 0;
                    OY_BLOCK[4][oy_key_public] += oy_dive_share;//payout from meshblock maintenance fees and issuance
                    OY_BLOCK[4][oy_key_public] += OY_BLOCK[1][oy_key_public][1];//payout from command transact fees
                    OY_BLOCK[1][oy_key_public][2] = OY_BLOCK[4][oy_key_public];//record final balance of diver for light node reference
                }

                OY_DIFF_TRACK[0] = oy_clone_object(OY_BLOCK[1]);

                for (let oy_key_public in OY_BLOCK[1]) {
                    OY_BLOCK[1][oy_key_public].pop();
                }

                //oy_log_debug("EXECUTE: "+JSON.stringify(oy_command_execute));
            }

            OY_BLOCK_CHALLENGE = {};
            for (let oy_peer_select in OY_PEERS) {
                if (oy_peer_select==="oy_aggregate_node") continue;
                OY_BLOCK_CHALLENGE[oy_peer_select] = true;
            }

            OY_BLOCK_FLAT = JSON.stringify(OY_BLOCK);
            console.log(OY_BLOCK_FLAT);//TODO temp

            OY_BLOCK_HASH = oy_hash_gen(OY_BLOCK_FLAT);

            OY_BLOCK_WEIGHT = new Blob([OY_BLOCK_FLAT]).size;

            oy_log("FULL MESHBLOCK HASH "+OY_BLOCK_HASH);

            oy_log_debug("HASH: "+OY_BLOCK_HASH+"\nBLOCK: "+OY_BLOCK_FLAT);

            document.dispatchEvent(OY_BLOCK_TRIGGER);

            if (OY_BLOCK_UPTIME!==null&&OY_LATCH_COUNT>0) {
                let oy_diff_flat = LZString.compressToUTF16(JSON.stringify(OY_DIFF_TRACK));
                let oy_diff_hash = oy_hash_gen(oy_diff_flat);
                let oy_diff_nonce_max = -1;
                let oy_diff_split = [];
                for (let i = 0; i < oy_diff_flat.length; i+=OY_LIGHT_CHUNK) {
                    oy_diff_split.push(oy_diff_flat.slice(i, i+OY_LIGHT_CHUNK));//split the current block into chunks
                    oy_diff_nonce_max++;
                }

                for (let oy_diff_nonce in oy_diff_split) {
                    let oy_diff_crypt = oy_key_sign(OY_SELF_PRIVATE, oy_diff_hash+oy_diff_nonce_max+oy_diff_nonce+oy_diff_split[oy_diff_nonce]);
                    for (let oy_peer_select in OY_PEERS) {
                        if (oy_peer_select!=="oy_aggregate_node"&&OY_PEERS[oy_peer_select][9]===1) oy_data_beam(oy_peer_select, "OY_PEER_DIFF", [OY_SELF_PUBLIC, oy_diff_crypt, oy_diff_hash, oy_diff_nonce_max, parseInt(oy_diff_nonce), oy_diff_split[oy_diff_nonce]]);
                    }
                }
            }

            OY_BLOCK_JUDGE = [null];
            for (let i in OY_BLOCK_LEARN) {
                if (i===0||OY_BLOCK_LEARN[i]===null||typeof(OY_BLOCK_LEARN[i])==="undefined") continue;
                let oy_judge_calc = 0;
                for (let oy_key_public in OY_BLOCK_LEARN[i]) {
                    if (typeof(OY_BLOCK[1][oy_key_public])==="undefined") delete OY_BLOCK[1][oy_key_public];
                    else oy_judge_calc += OY_BLOCK[1][oy_key_public];
                }
                OY_BLOCK_JUDGE[i] = (oy_judge_calc/Object.keys(OY_BLOCK_LEARN[i]).length)*OY_BLOCK_JUDGE_BUFFER;
            }
            OY_BLOCK_LEARN = [null];

            if (OY_BLOCK_BOOT===true) OY_SYNC_LAST = [0, 0];
            else {
                OY_SYNC_LAST.shift();
                OY_SYNC_LAST.push(0);
            }

            OY_WORK_HASH = null;
            OY_WORKER_THREADS[oy_worker_point()].postMessage([0, [OY_SELF_PUBLIC, OY_BLOCK_HASH, OY_BLOCK[0][3]]]);

            oy_block_finish();
        }, (OY_SYNC_LAST[0]>0)?Math.max(OY_BLOCK_SECTORS[0][1]+OY_BLOCK_BUFFER_MIN, Math.min(OY_BLOCK_SECTORS[1][1], OY_SYNC_LAST[0]+OY_BLOCK_BUFFER_SPACE)):OY_BLOCK_SECTORS[1][1]);

        oy_chrono(function() {
            if (OY_LIGHT_STATE===true&&Object.keys(OY_LIGHT_BUILD).length>0) {
                console.log("FORCE_LIGHT");
                oy_block_light();
            }
        }, OY_BLOCK_SECTORS[2][1]);
    }
}

function oy_block_light() {
    if (OY_LIGHT_STATE===false) return false;console.log("BLOCK_LIGHT");

    if (OY_BLOCK_HASH===null) {
        oy_block_reset("OY_FLAG_NULL_HASH_B");
        oy_log("MESHBLOCK CANCEL: "+OY_BLOCK_TIME);
        return false;
    }
    if (Object.keys(OY_LIGHT_BUILD).length===0) {
        oy_block_reset("OY_FLAG_NULL_LIGHT_A");
        return false;
    }
    OY_BLOCK_DIFF = true;
    OY_LIGHT_PROCESS = true;

    let oy_reference_select = [null, 0];
    for (let oy_diff_reference in OY_LIGHT_BUILD) {
        if (Object.keys(OY_LIGHT_BUILD[oy_diff_reference][2]).length>oy_reference_select[1]) {
            oy_reference_select[0] = oy_diff_reference;
            oy_reference_select[1] = Object.keys(OY_LIGHT_BUILD[oy_diff_reference][2]).length;
        }
    }

    let oy_diff_build = "";
    for (let oy_nonce_select in OY_LIGHT_BUILD[oy_reference_select[0]][3]) {
        let oy_split_select = [null, 0];
        for (let oy_split_hash in OY_LIGHT_BUILD[oy_reference_select[0]][3][oy_nonce_select][1]) {
            if (Object.keys(OY_LIGHT_BUILD[oy_reference_select[0]][3][oy_nonce_select][1][oy_split_hash][1]).length>oy_split_select[1]) {
                oy_split_select[0] = oy_split_hash;
                oy_split_select[1] = Object.keys(OY_LIGHT_BUILD[oy_reference_select[0]][3][oy_nonce_select][1][oy_split_hash][1]).length;
            }
        }
        if (oy_split_select[0]===null) {
            oy_block_reset("OY_FLAG_NULL_LIGHT_B");
            return false;
        }
        oy_diff_build += OY_LIGHT_BUILD[oy_reference_select[0]][3][oy_nonce_select][1][oy_split_select[0]][0];
    }

    OY_LIGHT_UPSTREAM = OY_LIGHT_BUILD[oy_reference_select[0]][4];console.log("BOB"+LZString.decompressFromUTF16(oy_diff_build));
    OY_LIGHT_BUILD = {};

    let oy_diff_track = JSON.parse(LZString.decompressFromUTF16(oy_diff_build));//TODO might wrap in a try/catch
    //oy_diff_build = null;

    if (!oy_block_range(Object.keys(oy_diff_track[0]).length)) return false;

    oy_diff_track[1] = oy_block_command_hash(oy_diff_track[1]);
    if (oy_diff_track[1]===false) {
        oy_block_reset("OY_FLAG_COMMAND_HASH_LIGHT");
        oy_log("MESHBLOCK DROP [COMMAND_HASH_LIGHT]");
        return false;
    }
    if (OY_LIGHT_LEAN===false&&!oy_block_command_scan(oy_diff_track[1])) {
        oy_block_reset("OY_FLAG_COMMAND_SCAN_LIGHT");
        oy_log("MESHBLOCK DROP [COMMAND_SCAN_LIGHT]");
        return false;
    }

    OY_BLOCK_NEW = {};

    oy_block_process(oy_diff_track[1], false);

    for (let oy_key_public in oy_diff_track[0]) {
        OY_BLOCK[4][oy_key_public] = oy_diff_track[0][oy_key_public][2];
        oy_diff_track[0][oy_key_public].pop();
    }

    OY_BLOCK[1] = oy_diff_track[0];

    OY_BLOCK_CHALLENGE = {};
    for (let oy_peer_select in OY_PEERS) {
        if (oy_peer_select==="oy_aggregate_node") continue;
        OY_BLOCK_CHALLENGE[oy_peer_select] = true;
    }

    OY_BLOCK_FLAT = JSON.stringify(OY_BLOCK);
    console.log(OY_BLOCK_FLAT);//TODO temp

    OY_BLOCK_HASH = oy_hash_gen(OY_BLOCK_FLAT);

    OY_BLOCK_WEIGHT = new Blob([OY_BLOCK_FLAT]).size;

    oy_log("LIGHT MESHBLOCK HASH "+OY_BLOCK_HASH);

    document.dispatchEvent(OY_BLOCK_TRIGGER);

    oy_block_finish();

    //LIGHT NODE -> FULL NODE
    if (OY_LIGHT_MODE===false) {//TODO disable to test full node resilience
        let oy_full_count = 0;
        let oy_light_weakest = [null, 0];
        for (let oy_peer_select in OY_PEERS) {
            if (oy_peer_select==="oy_aggregate_node") continue;
            if (OY_PEERS[oy_peer_select][9]===1&&oy_light_weakest[1]<OY_PEERS[oy_peer_select][3]) oy_light_weakest = [oy_peer_select, OY_PEERS[oy_peer_select][3]];
            else if (OY_PEERS[oy_peer_select][9]===2&&typeof(OY_BLOCK[1][oy_peer_select])!=="undefined") oy_full_count++;
        }
        console.log("FULL COUNT: "+oy_full_count);
        if (oy_full_count===0) {//self is not ready to unlatch, find more full node peers first
            if (OY_PEER_COUNT===OY_PEER_MAX&&oy_light_weakest[0]!==null) oy_peer_remove(oy_light_weakest[0], "OY_REASON_UNLATCH_DROP");
            oy_node_assign();
        }
        else {//unlatch sequence
            OY_LIGHT_STATE = false;
            OY_LIGHT_UPSTREAM = null;

            OY_WORK_HASH = null;
            OY_WORKER_THREADS[oy_worker_point()].postMessage([0, [OY_SELF_PUBLIC, OY_BLOCK_HASH, OY_BLOCK[0][3]]]);

            document.dispatchEvent(OY_STATE_FULL);

            let oy_nonfull_sort = [];
            for (let oy_peer_local in OY_PEERS) {
                if (oy_peer_local!=="oy_aggregate_node"&&(OY_PEERS[oy_peer_local][9]!==2||typeof(OY_BLOCK[1][oy_peer_local])==="undefined")) oy_nonfull_sort.push([oy_peer_local, OY_PEERS[oy_peer_local][3]]);
            }

            oy_nonfull_sort.sort(function(a, b) {
                if (a[1]===b[1]) {
                    let x = a[0].toLowerCase();
                    let y = b[0].toLowerCase();

                    return x < y ? -1 : x > y ? 1 : 0;
                }
                return b[1] - a[1];
            });

            let oy_remove_count = 0;
            for (let i in oy_nonfull_sort) {
                if (oy_remove_count>=(OY_PEER_MAX-OY_PEER_FULL_MIN)+(OY_PEER_COUNT-OY_PEER_MAX)) break;
                oy_peer_remove(oy_nonfull_sort[i][0], "OY_REASON_FULL_DROP");
                oy_remove_count++;
                console.log("FULL DROP: "+oy_remove_count+" "+oy_nonfull_sort[i][0]);
            }

            for (let oy_peer_select in OY_PEERS) {
                if (oy_peer_select!=="oy_aggregate_node") oy_data_beam(oy_peer_select, "OY_PEER_FULL", oy_key_sign(OY_SELF_PRIVATE, OY_MESH_DYNASTY+OY_BLOCK_HASH));
            }
        }
    }
}

function oy_block_process(oy_command_execute, oy_full_flag) {
    //MAINTAIN--------------------------------
    if (Math.floor((Date.now()-30000)/10800000)!==Math.floor((Date.now()-10000)/10800000)) {//10800000 - 3 hrs
        //oy_log_debug("SNAPSHOT: "+OY_BLOCK_HASH+"/"+JSON.stringify(OY_BLOCK));
        OY_BLOCK[3] = {};
        OY_BLOCK[2].push(OY_BLOCK_HASH);

        while (OY_BLOCK[2].length>OY_BLOCK_SNAPSHOT_KEEP) OY_BLOCK[2].shift();
    }

    OY_BLOCK[0][0] = OY_MESH_DYNASTY;console.log((Date.now()/1000)-OY_BLOCK_TIME);
    OY_BLOCK[0][1] = OY_BLOCK_TIME;console.log(OY_BLOCK_TIME);
    //MAINTAIN--------------------------------

    let oy_supply_pre = 0;
    let oy_dive_bounty = 0;

    if (OY_BLOCK_BOOT!==false) return [true, oy_dive_bounty];//transactions and fees are paused whilst the mesh calibrates its initial topology

    //AMEND-----------------------------------
    for (let oy_key_public in OY_BLOCK[4]) {
        if (oy_full_flag===true) oy_supply_pre += OY_BLOCK[4][oy_key_public];
        if (oy_key_public==="oy_escrow_dns") continue;
        let oy_balance_prev = OY_BLOCK[4][oy_key_public];
        OY_BLOCK[4][oy_key_public] -= OY_AKOYA_FEE;
        OY_BLOCK[4][oy_key_public] = Math.max(OY_BLOCK[4][oy_key_public], 0);
        if (oy_full_flag===true) oy_dive_bounty += oy_balance_prev - OY_BLOCK[4][oy_key_public];
        if (OY_BLOCK[4][oy_key_public]<=0) delete OY_BLOCK[4][oy_key_public];
    }

    for (let oy_dns_name in OY_BLOCK[5]) {
        if (OY_BLOCK[5][oy_dns_name][0]==="A") continue;
        let oy_akoya_wallet;
        if (OY_BLOCK[5][oy_dns_name][0]==="") oy_akoya_wallet = oy_dns_name;
        else oy_akoya_wallet = OY_BLOCK[5][oy_dns_name][0];
        if (typeof(OY_BLOCK[4][oy_akoya_wallet])==="undefined") delete OY_BLOCK[5][oy_dns_name];
        else {
            let oy_balance_prev = OY_BLOCK[4][oy_akoya_wallet];
            OY_BLOCK[4][oy_akoya_wallet] -= Math.ceil(OY_DNS_FEE*(OY_BLOCK[5][oy_dns_name][1]/99));
            OY_BLOCK[4][oy_akoya_wallet] = Math.max(OY_BLOCK[4][oy_akoya_wallet], 0);
            if (oy_full_flag===true) oy_dive_bounty += oy_balance_prev - OY_BLOCK[4][oy_akoya_wallet];
            if (OY_BLOCK[4][oy_akoya_wallet]<=0) delete OY_BLOCK[4][oy_akoya_wallet];
        }
    }

    for (let oy_dns_name in OY_BLOCK[6]) {
        if (OY_BLOCK[6][oy_dns_name][2]<=OY_BLOCK_TIME) {
            OY_BLOCK[4]["oy_escrow_dns"] -= OY_BLOCK[6][oy_dns_name][1];
            if (oy_full_flag===true) oy_dive_bounty += OY_BLOCK[6][oy_dns_name][1];
            OY_BLOCK[5][oy_dns_name][0] = OY_BLOCK[6][oy_dns_name][0];
            delete OY_BLOCK[6][oy_dns_name];
        }
    }

    for (let oy_entropy_id in OY_BLOCK[7]) {
        //META FEE PROCESSING
        let oy_akoya_wallet;
        if (OY_BLOCK[7][oy_entropy_id][0]==="") oy_akoya_wallet = oy_entropy_id;
        else oy_akoya_wallet = OY_BLOCK[7][oy_entropy_id][0];
        if (typeof(OY_BLOCK[4][oy_akoya_wallet])==="undefined") delete OY_BLOCK[7][oy_entropy_id];
        else {
            let oy_balance_prev = OY_BLOCK[4][oy_akoya_wallet];
            OY_BLOCK[4][oy_akoya_wallet] -= Math.ceil(OY_META_FEE*(OY_BLOCK[7][oy_entropy_id][1]/99));
            OY_BLOCK[4][oy_akoya_wallet] = Math.max(OY_BLOCK[4][oy_akoya_wallet], 0);
            if (oy_full_flag===true) oy_dive_bounty += oy_balance_prev - OY_BLOCK[4][oy_akoya_wallet];
            if (OY_BLOCK[4][oy_akoya_wallet]<=0) delete OY_BLOCK[4][oy_akoya_wallet];
        }
        //META FEE PROCESSING

        //DAPP 0 - WEB 3 HOSTING
        if (OY_BLOCK[7][oy_entropy_id][1]===0) {
            //TODO
        }
        //DAPP 0 - WEB 3 HOSTING

        //DAPP 1 - HIVEMIND
        else if (OY_BLOCK[7][oy_entropy_id][1]===1) {
            if (OY_BLOCK[7][oy_entropy_id][3][0][0]===0) {
                for (let oy_entropy_id_sub in OY_BLOCK[7][oy_entropy_id][3][1]) {
                    if (OY_BLOCK_TIME>=OY_BLOCK[7][oy_entropy_id][3][1][oy_entropy_id_sub]||typeof(OY_BLOCK[7][oy_entropy_id_sub])==="undefined") delete OY_BLOCK[7][oy_entropy_id][3][1][oy_entropy_id_sub];
                }
            }
        }
        //DAPP 1 - HIVEMIND
    }

    //TODO channel sector, made redundant by META?
    //AMEND-----------------------------------

    //TRANSACT--------------------------------
    //oy_command_execute[i] = [[0]:oy_command_array, [1]:oy_command_crypt, [2]:oy_command_hash]
    for (let i in oy_command_execute) {
        //["OY_AKOYA_SEND", oy_protocol_assign, oy_key_public, oy_transfer_amount, oy_receive_public]
        if (oy_command_execute[i][0][0]==="OY_AKOYA_SEND"&&OY_BLOCK_COMMANDS[oy_command_execute[i][0][0]][0](oy_command_execute[i][0])) {
            let oy_wallet_create = false;
            if (typeof(OY_BLOCK[4][oy_command_execute[i][0][4]])==="undefined") {
                OY_BLOCK[4][oy_command_execute[i][0][4]] = 0;
                oy_wallet_create = true;
            }
            let oy_balance_send = OY_BLOCK[4][oy_command_execute[i][0][2]];
            let oy_balance_receive = OY_BLOCK[4][oy_command_execute[i][0][4]];
            OY_BLOCK[4][oy_command_execute[i][0][2]] -= oy_command_execute[i][0][3];
            OY_BLOCK[4][oy_command_execute[i][0][4]] += oy_command_execute[i][0][3];
            if (OY_BLOCK[4][oy_command_execute[i][0][2]]+OY_BLOCK[4][oy_command_execute[i][0][4]]!==oy_balance_send+oy_balance_receive) {//verify balances, revert transaction if necessary
                OY_BLOCK[4][oy_command_execute[i][0][2]] = oy_balance_send;
                OY_BLOCK[4][oy_command_execute[i][0][4]] = oy_balance_receive;
                continue;
            }
            else {
                if (oy_wallet_create===true) OY_BLOCK[4][oy_command_execute[i][0][4]] -= OY_AKOYA_FEE;
                if (OY_BLOCK[4][oy_command_execute[i][0][2]]<=0) delete OY_BLOCK[4][oy_command_execute[i][0][2]];
                if (OY_BLOCK[4][oy_command_execute[i][0][4]]<=0) delete OY_BLOCK[4][oy_command_execute[i][0][4]];
            }
        }
        //["OY_DNS_MODIFY", oy_protocol_assign, oy_key_public, oy_dns_name, oy_nav_data]
        else if (oy_command_execute[i][0][0]==="OY_DNS_MODIFY"&&OY_BLOCK_COMMANDS[oy_command_execute[i][0][0]][0](oy_command_execute[i][0])) {
            let oy_nav_flat = JSON.stringify(oy_command_execute[i][0]);
            if (oy_nav_flat.length<=OY_DNS_NAV_LIMIT&&oy_an_check(oy_nav_flat.replace(/[\[\]{}'":,@=-]/g, ""))) {//check that the contents of oy_nav_data are compliant in size and fully alphanumeric
                OY_BLOCK[5][oy_command_execute[i][0][3]][1] = Math.max(99, oy_nav_flat.length);
                OY_BLOCK[5][oy_command_execute[i][0][3]][2] = oy_command_execute[i][0][4];
            }
        }
        //["OY_DNS_BID", oy_protocol_assign, oy_key_public, oy_dns_name, oy_bid_amount]
        else if (oy_command_execute[i][0][0]==="OY_DNS_BID"&&OY_BLOCK_COMMANDS[oy_command_execute[i][0][0]][0](oy_command_execute[i][0])) {
            let oy_balance_send = OY_BLOCK[4][oy_command_execute[i][0][2]];
            let oy_balance_receive = OY_BLOCK[4]["oy_escrow_dns"];
            OY_BLOCK[4][oy_command_execute[i][0][2]] -= oy_command_execute[i][0][4];
            OY_BLOCK[4]["oy_escrow_dns"] += oy_command_execute[i][0][4];
            if (OY_BLOCK[4][oy_command_execute[i][0][2]]+OY_BLOCK[4]["oy_escrow_dns"]!==oy_balance_send+oy_balance_receive) {//verify balances, revert transaction if necessary
                OY_BLOCK[4][oy_command_execute[i][0][2]] = oy_balance_send;
                OY_BLOCK[4]["oy_escrow_dns"] = oy_balance_receive;
                continue;
            }
            else {
                let oy_bid_pass = false;
                if (typeof(OY_BLOCK[6][oy_command_execute[i][0][3]])!=="undefined") {
                    if (typeof(OY_BLOCK[4][OY_BLOCK[6][oy_command_execute[i][0][3]][0]])==="undefined") OY_BLOCK[4][OY_BLOCK[6][oy_command_execute[i][0][3]][0]] = 0;
                    let oy_balance_send = OY_BLOCK[4]["oy_escrow_dns"];
                    let oy_balance_receive = OY_BLOCK[4][OY_BLOCK[6][oy_command_execute[i][0][3]][0]];
                    OY_BLOCK[4]["oy_escrow_dns"] -= OY_BLOCK[4][OY_BLOCK[6][oy_command_execute[i][0][3]][1]];
                    OY_BLOCK[4][OY_BLOCK[6][oy_command_execute[i][0][3]][0]] += OY_BLOCK[4][OY_BLOCK[6][oy_command_execute[i][0][3]][1]];
                    if (OY_BLOCK[4]["oy_escrow_dns"]+OY_BLOCK[4][OY_BLOCK[6][oy_command_execute[i][0][3]][0]]!==oy_balance_send+oy_balance_receive) {//verify balances, revert transaction if necessary
                        OY_BLOCK[4]["oy_escrow_dns"] = oy_balance_send;
                        if (oy_balance_receive===0) delete OY_BLOCK[4][OY_BLOCK[6][oy_command_execute[i][0][3]][0]];
                        else OY_BLOCK[4][OY_BLOCK[6][oy_command_execute[i][0][3]][0]] = oy_balance_receive;
                    }
                    else oy_bid_pass = true;
                }
                else oy_bid_pass = true;

                if (oy_bid_pass===true) {
                    if (typeof(OY_BLOCK[5][oy_command_execute[i][0][3]])==="undefined") OY_BLOCK[5][oy_command_execute[i][0][3]] = ["A", 99, ""];//[owner, nav_size, nav_data]
                    OY_BLOCK[6][oy_command_execute[i][0][3]] = [oy_command_execute[i][0][2], oy_command_execute[i][0][4], OY_BLOCK_TIME+OY_DNS_AUCTION_DURATION];//[bid holder, bid amount, auction expire]
                }
            }
        }
        //["OY_DNS_TRANSFER", oy_protocol_assign, oy_key_public, oy_dns_name, oy_receive_public]
        else if (oy_command_execute[i][0][0]==="OY_DNS_TRANSFER"&&OY_BLOCK_COMMANDS[oy_command_execute[i][0][0]][0](oy_command_execute[i][0])) {
            OY_BLOCK[5][oy_command_execute[i][0][3]][0] = oy_command_execute[i][0][4];
        }
        //["OY_DNS_RELEASE", oy_protocol_assign, oy_key_public, oy_dns_name]
        else if (oy_command_execute[i][0][0]==="OY_DNS_RELEASE"&&OY_BLOCK_COMMANDS[oy_command_execute[i][0][0]][0](oy_command_execute[i][0])) {
            delete OY_BLOCK[5][oy_command_execute[i][0][3]];
        }
        //["OY_DNS_NULLING", oy_protocol_assign, oy_key_public, oy_dns_name, oy_nulling_amount]
        else if (oy_command_execute[i][0][0]==="OY_DNS_NULLING"&&OY_BLOCK_COMMANDS[oy_command_execute[i][0][0]][0](oy_command_execute[i][0])) {
            let oy_balance_send = OY_BLOCK[4][oy_command_execute[i][0][2]];
            OY_BLOCK[4][oy_command_execute[i][0][2]] -= oy_command_execute[i][0][4];
            OY_BLOCK[4][oy_command_execute[i][0][3]] = oy_command_execute[i][0][4];
            if (OY_BLOCK[4][oy_command_execute[i][0][2]]+OY_BLOCK[4][oy_command_execute[i][0][3]]!==oy_balance_send) {//verify balances, revert transaction if necessary
                OY_BLOCK[4][oy_command_execute[i][0][2]] = oy_balance_send;
                delete OY_BLOCK[4][oy_command_execute[i][0][3]];
                continue;
            }
            else OY_BLOCK[5][oy_command_execute[i][0][3]][0] = "";
        }
        //["OY_META_SET", oy_protocol_assign, oy_key_public, oy_entropy_id, oy_meta_dapp, oy_meta_data]
        else if (oy_command_execute[i][0][0]==="OY_META_SET"&&OY_BLOCK_COMMANDS[oy_command_execute[i][0][0]][0](oy_command_execute[i][0])) {
            let oy_meta_flat = JSON.stringify(oy_command_execute[i][0][5]);
            if (oy_meta_flat.length<=OY_META_DATA_LIMIT&&oy_an_check(oy_meta_flat.replace(/[\[\]{}'":,@=-]/g, ""))) {//TODO confirm if these conditions should be checked every hop
                let oy_meta_owner = oy_command_execute[i][0][2];
                let oy_meta_data = oy_clone_object(oy_command_execute[i][0][5]);

                let oy_entropy_id;
                if (oy_command_execute[i][0][3]==="") {//recycle meshblock entropy to ensure random meta handles are assigned in a decentralized manner
                    oy_entropy_id = oy_hash_gen(OY_BLOCK_HASH+oy_command_execute[i][0]);
                    if (typeof(OY_BLOCK[7][oy_entropy_id])!=="undefined") continue;//there is a nonzero chance that a legitimate META_SET transaction would get rejected and need to be tried again
                }
                else oy_entropy_id = oy_command_execute[i][0][3];

                //DAPP 0 - WEB 3 HOSTING
                if (oy_command_execute[i][0][4]===0) {
                    //TODO
                }
                //DAPP 0 - WEB 3 HOSTING

                //DAPP 1 - HIVEMIND
                if (oy_command_execute[i][0][4]===1) {//TODO approved_authors + render_mode (works like a blog)
                    if (!Array.isArray(oy_command_execute[i][0][5])||!Array.isArray(oy_command_execute[i][0][5][0])||!Number.isInteger(oy_command_execute[i][0][5][0][0])) continue;

                    //MASTER[0] = [0, author_revoke, submission_price, vote_limit, expire_quota, capacity_active, capacity_inactive]
                    //MASTER[1] = {} - holding object for posts
                    if (oy_command_execute[i][0][5][0][0]===0) {
                        if (!OY_BLOCK_TRANSACTS["OY_HIVEMIND_CLUSTER"][0](oy_command_execute[i][0])) continue;
                    }
                    //POST[0] = [1, master_entropy_id, author_public, submission_payment]
                    //POST[1] = [] - rendering object for post content
                    else if (oy_command_execute[i][0][5][0][0]===1) {
                        if (!OY_BLOCK_TRANSACTS["OY_HIVEMIND_POST"][0](oy_command_execute[i][0])) continue;

                        oy_meta_owner = "";
                        oy_meta_data[0][2] = oy_command_execute[i][0][2];

                        let oy_cluster_owner;
                        if (OY_BLOCK[7][oy_command_execute[i][0][5][0][1]][0]==="") oy_cluster_owner = oy_command_execute[i][0][5][0][1];
                        else oy_cluster_owner = OY_BLOCK[7][oy_command_execute[i][0][5][0][1]][0];
                        let oy_balance_send = OY_BLOCK[4][oy_command_execute[i][0][2]];
                        let oy_balance_receive = OY_BLOCK[4][oy_cluster_owner];
                        OY_BLOCK[4][oy_command_execute[i][0][2]] -= oy_command_execute[i][0][5][0][3];
                        OY_BLOCK[4][oy_cluster_owner] += OY_BLOCK[7][oy_command_execute[i][0][5][0][1]][3][0][2];
                        OY_BLOCK[4][oy_entropy_id] = oy_command_execute[i][0][5][0][3] - OY_BLOCK[7][oy_command_execute[i][0][5][0][1]][3][0][2];

                        if ((oy_cluster_owner===oy_command_execute[i][0][2]&&OY_BLOCK[4][oy_cluster_owner]+OY_BLOCK[4][oy_entropy_id]!==oy_balance_send)||(oy_cluster_owner!==oy_command_execute[i][0][2]&&OY_BLOCK[4][oy_command_execute[i][0][2]]+OY_BLOCK[4][oy_cluster_owner]+OY_BLOCK[4][oy_entropy_id]!==oy_balance_send+oy_balance_receive)) {//TODO verify security
                            OY_BLOCK[4][oy_command_execute[i][0][2]] = oy_balance_send;
                            OY_BLOCK[4][oy_cluster_owner] = oy_balance_receive;
                            delete OY_BLOCK[4][oy_entropy_id];
                            continue;
                        }
                        else {
                            if (Object.keys(OY_BLOCK[7][oy_command_execute[i][0][5][0][1]][1]).length<OY_BLOCK[7][oy_command_execute[i][0][5][0][1]][3][0][5]+OY_BLOCK[7][oy_command_execute[i][0][5][0][1]][3][0][6]&&
                                typeof(OY_BLOCK[7][oy_command_execute[i][0][5][0][1]][3][1][oy_entropy_id])==="undefined") {
                                OY_BLOCK[7][oy_command_execute[i][0][5][0][1]][3][1][oy_entropy_id] = OY_BLOCK_TIME+(OY_BLOCK[7][oy_command_execute[i][0][5][0][1]][3][0][4]*3600);
                            }
                            else continue;
                        }
                    }
                    else continue;
                }
                //DAPP 1 - HIVEMIND

                //[meta_owner, meta_dapp, meta_size, meta_data]
                OY_BLOCK[7][oy_entropy_id] = [oy_meta_owner, oy_command_execute[i][0][4], Math.max(99, oy_meta_flat.length), oy_meta_data];
            }
            else continue;
        }
        else continue;

        OY_BLOCK[3][oy_command_execute[i][2]] = oy_command_execute[i][0];
        OY_BLOCK_NEW[oy_command_execute[i][2]] = oy_command_execute[i][0];
        if (oy_full_flag===true) OY_DIFF_TRACK[1].push([oy_command_execute[i][0], oy_command_execute[i][1]]);
    }
    //TRANSACT--------------------------------

    if (oy_full_flag===true) {
        let oy_supply_post = 0;
        for (let oy_key_public in OY_BLOCK[4]) {
            oy_supply_post += OY_BLOCK[4][oy_key_public];
        }
        if (oy_supply_post>oy_supply_pre+OY_AKOYA_ISSUANCE) {//confirms that the supply has not increased more than AKOYA_ISSUANCE
            oy_block_reset("OY_FLAG_AKOYA_SUPPLY_OVERFLOW");
            return [false, 0];
        }
        return [true, oy_dive_bounty];
    }
}

function oy_block_finish() {
    for (let oy_command_hash in OY_BLOCK_CONFIRM) {
        OY_BLOCK_CONFIRM[oy_command_hash](typeof(OY_BLOCK[3][oy_command_hash])!=="undefined");
    }
    OY_BLOCK_CONFIRM = {};

    let oy_time_offset = (Date.now()/1000)-OY_BLOCK_TIME;
    oy_chrono(function() {
        let oy_block_hash_crypt = oy_key_sign(OY_SELF_PRIVATE, OY_MESH_DYNASTY+OY_BLOCK_HASH);
        for (let oy_peer_select in OY_PEERS) {
            if (oy_peer_select==="oy_aggregate_node"||OY_PEERS[oy_peer_select][9]===0) continue;
            oy_data_beam(oy_peer_select, "OY_PEER_CHALLENGE", oy_block_hash_crypt);
        }

        let oy_base_process = false;
        for (let oy_peer_select in OY_PEERS) {
            if (oy_peer_select!=="oy_aggregate_node"&&OY_PEERS[oy_peer_select][9]===0) {
                oy_base_process = true;
                break;
            }
        }
        if (oy_base_process===true) {
            let oy_block_nonce_max = -1;
            let oy_block_split = [];
            for (let i = 0; i < OY_BLOCK_FLAT.length; i+=OY_LIGHT_CHUNK) {
                oy_block_split.push(OY_BLOCK_FLAT.slice(i, i+OY_LIGHT_CHUNK));//split the current block into chunks
                oy_block_nonce_max++;
            }

            let oy_block_juggle = [];
            for (let oy_block_nonce in oy_block_split) {
                oy_block_juggle.push(oy_block_nonce);
            }

            oy_shuffle(oy_block_juggle);

            for (let oy_peer_select in OY_PEERS) {
                if (oy_peer_select==="oy_aggregate_node"||OY_PEERS[oy_peer_select][9]!==0) continue;
                if (OY_PEERS[oy_peer_select][10]===true) oy_node_punish(oy_peer_select, "OY_PUNISH_BASE_ABUSE");
                else {
                    for (let i in oy_block_juggle) {
                        oy_data_beam(oy_peer_select, "OY_PEER_BASE", [oy_block_nonce_max, oy_block_juggle[i], oy_block_split[oy_block_juggle[i]]]);
                    }
                    OY_PEERS[oy_peer_select][10] = true;
                }
            }
        }
    }, ((oy_time_offset>OY_BLOCK_SECTORS[0][0])?(20-oy_time_offset)*1000:0)+OY_MESH_BUFFER[1]);console.log("BOOST ARRAY: "+JSON.stringify(OY_BOOST_BUILD));

    OY_BOOST_RESERVE = OY_BOOST_BUILD.slice();
    OY_BOOST_BUILD = [];

    oy_local_set("oy_boost_reserve", OY_BOOST_RESERVE);
    oy_local_set("oy_boost_expire", (Date.now()/1000|0)+OY_BOOST_EXPIRETIME);
}

//core loop that runs critical functions and checks
function oy_engine(oy_thread_track) {
    if (OY_ENGINE_KILL===true) {
        OY_ENGINE_KILL = false;
        return true;
    }
    //reboot INIT if the connection was lost
    if (OY_READY===true&&(OY_CONN===null||OY_CONN.disconnected!==false)) {
        oy_log("Engine found connection handler dead, will reboot INIT and kill engine chain");
        OY_INIT = 0;
        OY_READY = false;
        oy_init();
        return true;
    }

    let oy_time_local = Date.now()/1000;
    if (typeof(oy_thread_track)==="undefined") oy_thread_track = [0, oy_time_local];

    if (OY_PEER_COUNT<OY_PEER_MAX&&(oy_time_local-oy_thread_track[0])>OY_NODE_ASSIGNTTIME+Math.round(Math.random())) {
        oy_thread_track[0] = oy_time_local;
        oy_node_assign();
    }

    if (OY_PEER_COUNT>0&&(oy_time_local-oy_thread_track[1])>OY_PEER_REPORTTIME) {
        oy_thread_track[1] = oy_time_local;
        oy_peer_report();
    }

    for (let oy_node_select in OY_NODES) {
        if (oy_time_local-OY_NODES[oy_node_select][1]>OY_NODE_EXPIRETIME) oy_node_disconnect(oy_node_select);
    }

    for (let oy_node_select in OY_WARM) {
        if (oy_time_local-OY_WARM[oy_node_select]>OY_NODE_DELAYTIME) {
            oy_node_punish(oy_node_select, "OY_PUNISH_WARM_LAG");
            delete OY_WARM[oy_node_select];
        }
    }

    let oy_hash_keep = [];
    for (let oy_channel_id in OY_CHANNEL_KEEP) {
        for (let oy_broadcast_hash in OY_CHANNEL_KEEP[oy_channel_id]) {
            if (OY_BLOCK_HASH!==null&&(!oy_channel_approved(oy_channel_id, OY_CHANNEL_KEEP[oy_channel_id][oy_broadcast_hash][5])||oy_time_local-OY_CHANNEL_KEEP[oy_channel_id][oy_broadcast_hash][6]>OY_CHANNEL_EXPIRETIME)) {
                delete OY_CHANNEL_KEEP[oy_channel_id][oy_broadcast_hash];
                OY_DB.oy_channel.delete(oy_broadcast_hash);
                if (typeof(OY_CHANNEL_RENDER[oy_channel_id])!=="undefined") delete OY_CHANNEL_RENDER[oy_channel_id][oy_broadcast_hash];
                if (typeof(OY_CHANNEL_LISTEN[oy_channel_id])!=="undefined") OY_CHANNEL_LISTEN[oy_channel_id][2](oy_broadcast_hash, null);
                continue;
            }
            if (typeof(OY_CHANNEL_LISTEN[oy_channel_id])!=="undefined"&&OY_CHANNEL_KEEP[oy_channel_id][oy_broadcast_hash][8].length>=Math.floor(OY_CHANNEL_KEEP[oy_channel_id][oy_broadcast_hash][7]*OY_CHANNEL_CONSENSUS)) {
                oy_hash_keep.push(oy_broadcast_hash);
                if (typeof(OY_CHANNEL_RENDER[oy_channel_id])==="undefined") OY_CHANNEL_RENDER[oy_channel_id] = {};
                if (typeof(OY_CHANNEL_RENDER[oy_channel_id][oy_broadcast_hash])==="undefined") {
                    OY_CHANNEL_RENDER[oy_channel_id][oy_broadcast_hash] = true;
                    let oy_render_payload = OY_CHANNEL_KEEP[oy_channel_id][oy_broadcast_hash].slice();
                    oy_render_payload[3] = LZString.decompressFromUTF16(oy_render_payload[3]);
                    OY_CHANNEL_LISTEN[oy_channel_id][2](oy_broadcast_hash, oy_render_payload);
                }
            }
        }
    }

    for (let oy_channel_id in OY_CHANNEL_TOP) {
        if (typeof(OY_CHANNEL_LISTEN[oy_channel_id])==="undefined") continue;
        let oy_recover_beam = function(oy_challenge_crypt, oy_key_public) {
            for (let oy_top_key in OY_CHANNEL_TOP[oy_channel_id]) {
                if (oy_time_local-OY_CHANNEL_TOP[oy_channel_id][oy_top_key][0]>OY_CHANNEL_FORGETIME) delete OY_CHANNEL_TOP[oy_channel_id][oy_top_key];
                else if (oy_time_local-OY_CHANNEL_TOP[oy_channel_id][oy_top_key][1]>OY_CHANNEL_RECOVERTIME) {
                    OY_CHANNEL_TOP[oy_channel_id][oy_top_key][1] = oy_time_local;
                    oy_data_route("OY_LOGIC_FOLLOW", "OY_CHANNEL_RECOVER", [[], OY_CHANNEL_TOP[oy_channel_id][oy_top_key][2], oy_channel_id, oy_hash_keep, oy_challenge_crypt, oy_key_public, oy_time_local])
                }
            }
        };
        if (OY_CHANNEL_LISTEN[oy_channel_id][0]===null) oy_recover_beam(null, null);
        else oy_recover_beam(oy_key_sign(OY_CHANNEL_LISTEN[oy_channel_id][0], oy_time_local+oy_channel_id), OY_CHANNEL_LISTEN[oy_channel_id][1]);
    }

    for (let oy_channel_id in OY_CHANNEL_LISTEN) {
        if (OY_CHANNEL_LISTEN[oy_channel_id][0]!==null&&oy_time_local-OY_CHANNEL_LISTEN[oy_channel_id][3]>OY_CHANNEL_KEEPTIME) oy_channel_broadcast(oy_channel_id, "OY_CHANNEL_PING", OY_CHANNEL_LISTEN[oy_channel_id][0], OY_CHANNEL_LISTEN[oy_channel_id][1], function(){}, function(){});
    }

    for (let oy_echo_key in OY_CHANNEL_ECHO) {
        if (OY_CHANNEL_ECHO[oy_echo_key][0]<oy_time_local) delete OY_CHANNEL_ECHO[oy_echo_key];
    }

    for (let oy_key_public in OY_CHANNEL_DYNAMIC) {
        if (oy_time_local-OY_CHANNEL_DYNAMIC[oy_key_public]>OY_CHANNEL_ALLOWANCE) delete OY_CHANNEL_DYNAMIC[oy_key_public];
    }

    for (let oy_node_select in OY_LATENCY) {
        if (oy_time_local-OY_LATENCY[oy_node_select][3]>OY_LATENCY_MAX) delete OY_LATENCY[oy_node_select];
    }

    for (let oy_node_select in OY_PEERS_PRE) {
        if (OY_PEERS_PRE[oy_node_select]<oy_time_local) delete OY_PEERS_PRE[oy_node_select];
    }

    for (let oy_node_select in OY_PROPOSED) {
        if (OY_PROPOSED[oy_node_select]<oy_time_local) delete OY_PROPOSED[oy_node_select];
    }

    for (let oy_node_select in OY_BLACKLIST) {
        if (OY_BLACKLIST[oy_node_select][1]<oy_time_local) delete OY_BLACKLIST[oy_node_select];
    }

    oy_chrono(function() {
        oy_engine(oy_thread_track);
    }, OY_ENGINE_INTERVAL);
}

//initialize oyster mesh boot up sequence
function oy_init(oy_callback, oy_passthru, oy_console) {
    localStorage.clear();
    if (typeof(oy_console)==="function") {
        console.log("Console redirected to custom function");
        OY_CONSOLE = oy_console;
    }
    if (typeof(oy_passthru)==="undefined"||oy_passthru===null) {
        if (OY_INIT===1) {
            oy_log("Clashing instance of INIT prevented from running", 1);
            return false;
        }
        OY_INIT = 1;
        oy_log("Oyster Mesh initializing...");

        document.addEventListener("oy_peers_null", oy_block_reset, false);

        let oy_key_pair = oy_key_gen();
        //reset cryptographic node id for self, and any persisting variables that are related to the old self id (if any)
        OY_SELF_PRIVATE = oy_key_pair[0];
        OY_SELF_PUBLIC = oy_key_pair[1];
        OY_SELF_SHORT = oy_short(OY_SELF_PUBLIC);
        OY_PROPOSED = {};
        oy_log("Initiating new P2P session with new ID "+OY_SELF_SHORT);
        oy_init(oy_callback, true);
        return true;
    }

    /* SIMULATOR BLOCK
    parentPort.once('message', (message) => {
        parentPort.postMessage(message);
    });
    */

    //Dexie.delete("oy_db");
    OY_DB = new Dexie("oy_db");
    OY_DB.version(1).stores({
        oy_local:"oy_local_key",
        oy_data:"oy_data_key,oy_data_time",
        oy_channel:"oy_broadcast_hash,oy_channel_id"
    });

    OY_CONN = new Peer(OY_SELF_PUBLIC, {host: 'top.oyster.org', port: 8200, path: '/', secure:true});

    OY_CONN.on('open', function(oy_self_id) {
        if (oy_self_id===null) return false;
        OY_READY = true;
        oy_log("P2P connection ready with self ID "+oy_short(oy_self_id));
        if (typeof(oy_callback)==="function") oy_callback();
        oy_local_get("oy_boost_expire", null, function(oy_boost_expire) {
            if (oy_boost_expire!==null&&Date.now()/1000<oy_boost_expire) oy_local_get("oy_boost_reserve", [], function(oy_boost) {
                OY_BOOST_RESERVE = oy_boost;
                oy_boost();
            });
            else oy_local_set("oy_boost_reserve", []);
        });
    }, null);

    OY_CONN.on('connection', function(oy_conn) {
        // Receive messages
    oy_conn.on('data', function(oy_data_raw) {
        if (oy_node_blocked(oy_conn.peer)) {
            oy_node_punish(oy_conn.peer, "OY_PUNISH_PEER_BLACKLIST");
            return false;
        }
        let oy_data = oy_data_soak(oy_conn.peer, oy_data_raw);
        if (oy_data===true) return true;
        else if (oy_data===false) {
            oy_node_punish(oy_conn.peer, "OY_PUNISH_DATA_INVALID");
            return false;
        }
        if (oy_data[0]==="OY_LATENCY_RESPONSE") oy_latency_response(oy_conn.peer, oy_data[1]);
        else if (oy_peer_check(oy_conn.peer)) {
            if (oy_data_measure(false, oy_conn.peer, oy_data_raw.length)===false) oy_node_punish(oy_conn.peer, "OY_PUNISH_MESH_FLOW");
            oy_peer_process(oy_conn.peer, oy_data[0], oy_data[1]);
        }
        else if (oy_data[0]==="OY_BLOCK_SYNC"&&OY_LIGHT_STATE===false) oy_peer_process(oy_conn.peer, oy_data[0], oy_data[1]);//TODO verify light state inclusion
        else {
            if (oy_data_measure(false, "oy_aggregate_node", oy_data_raw.length)===false) oy_log("Node "+oy_short(oy_conn.peer)+" pushed aggregate mesh flow compliance beyond limit");
            else oy_node_negotiate(oy_conn.peer, oy_data[0], oy_data[1]);
        }
    });
    }, null);

    OY_CONN.on('error', function(oy_error) {
        oy_log("PeerJS Error: "+oy_error.type);
        if (oy_error.type==="browser-incompatible"&&typeof(OY_ERROR_BROWSER)==="function") OY_ERROR_BROWSER();
    }, null);

    oy_chrono(function() {
        if (OY_READY===true) {
            oy_log("Connection is now ready, sparking engine");

            let oy_time_local = Date.now()/1000;
            if (oy_time_local<OY_BLOCK_BOOTTIME) OY_BLOCK_BOOT = null;
            else OY_BLOCK_BOOT = oy_time_local-OY_BLOCK_BOOTTIME<OY_BLOCK_BOOT_BUFFER;

            oy_worker(true);

            oy_chrono(oy_engine, 50);
            setTimeout(oy_block_loop, 1);
            document.dispatchEvent(OY_STATE_BLANK);
        }
        else {
            oy_log("Connection was not established before cutoff, re-sparking INIT");
            OY_INIT = 0;
            oy_init(oy_callback);
        }
    }, OY_READY_RETRY);
}

let oy_call_detect = document.getElementById("oy.js");
if (!!oy_call_detect) {
    let oy_dive_detect = oy_call_detect.getAttribute("payout");
    if (oy_key_check(oy_dive_detect)) {
        OY_PASSIVE_MODE = true;
        OY_DIVE_PAYOUT = oy_dive_detect;
        oy_init(function() {
            console.log("Oyster is diving for address "+OY_DIVE_PAYOUT);
        });
    }
}