// OYSTER MESH
// Bruno Block
// v0.6
// License: GNU GPLv3

// GLOBAL VARS
const OY_MESH_DYNASTY = "BRUNO_GENESIS_V6";//mesh dynasty definition, changing this will cause a hard-fork
const OY_MESH_EDGE = 2;//maximum seconds that it should take for a transaction to reach the furthest edge-to-edge distance of the mesh, do not change this unless you know what you are doing
const OY_MESH_BUFFER = [0.4, 400];//seconds and ms buffer a block command's timestamp is allowed to be in the future, this variable exists to deal with slight mis-calibrations between node clocks
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
const OY_BLOCK_CONSENSUS = 0.5;//mesh topology corroboration to agree on confirming a meshblock transaction
const OY_BLOCK_LAUNCHTIME = 200;//ms delay from block_trigger to launch a command broadcast
const OY_BLOCK_PROTECTTIME = 500;//ms delay until meshblock challenge protection is enacted
const OY_BLOCK_CHALLENGETIME = 2500;//ms delay until meshblock challenge to peers is enforced
const OY_BLOCK_MISS_MULTI = 0.3;//multiplication factor for passport length, lower means more sybil-attack secure yet more honest block_syncs dropped
const OY_BLOCK_MISS_MULTI_MIN = 1;//minimum miss_limit value for roster calculations
const OY_BLOCK_STABILITY_START = 50;//starting stability value for making roster calculations
const OY_BLOCK_STABILITY_TRIGGER = 3;//mesh range history minimum to trigger reliance on real stability value for roster calculations
const OY_BLOCK_STABILITY_LIMIT = 12;//mesh range history to keep to calculate meshblock stability, time is effectively value x 20 seconds
const OY_BLOCK_STABILITY_MIN = 20;//lower means more sybil-attack secure yet more honest block_syncs dropped, lower value forces a more even mesh, relates to GEO_SENS
const OY_BLOCK_ROSTER_PERSIST = 0.8;//node roster persistence against getting deleted due to an absent sync, higher means more stable connection but weaker security implications
const OY_BLOCK_HOP_CALCTIME = 60;//ms time limit for verifying passports on a block_sync transmission, lower is more scalable yet less secure
const OY_BLOCK_KEY_LIMIT = 5;//permitted transactions per wallet per block (20 seconds)
const OY_BLOCK_SNAPSHOT_KEEP = 240;//how many hashes of previous blocks to keep in the current meshblock, value is for 1 month's worth (3 hrs x 8 = 24 hrs x 30 = 30 days, 8 x 30 = 240)
const OY_BLOCK_DENSITY = 0.5;//higher means block syncs [0] and dives [1] are more spread out within their respective meshblock sectors
const OY_BLOCK_PEERS_MIN = 3;//minimum peer count to be become a source for latches and broadcast SYNC/DIVE
const OY_BLOCK_PACKET_MAX = 8000;//maximum size for a packet that is routed via OY_BLOCK_SYNC and OY_BLOCK_DIVE (OY_LOGIC_ALL)
const OY_BLOCK_HALT_BUFFER = 5;//seconds between permitted block_reset() calls. Higher means less chance duplicate block_reset() instances will clash
const OY_BLOCK_BOOT_BUFFER = 120;//seconds grace period to ignore certain cloning/peering rules to bootstrap the network during a boot-up event
const OY_BLOCK_DIVE_BUFFER = 40;//seconds of uptime required until self claims dive rewards
const OY_BLOCK_RANGE_MIN = 5;//minimum syncs/dives required to not locally reset the meshblock, higher means side meshes die easier
const OY_BLOCK_BOOTTIME = 1579396600;//timestamp to boot the mesh, node remains offline before this timestamp
const OY_CHALLENGE_SAFETY = 0.5;//safety margin for rogue packets reaching block_consensus. 1 means no changes, lower means further from block_consensus, higher means closer.
const OY_CHALLENGE_BUFFER = 1.8;//amount of node hop buffer for challenge broadcasts, higher means more chance the challenge will be received yet more bandwidth taxing (min of 1)
const OY_AKOYA_DECIMALS = 100000000;//zeros after the decimal point for akoya currency
const OY_AKOYA_MAX_SUPPY = 10000000*OY_AKOYA_DECIMALS;//akoya max supply
const OY_AKOYA_FEE_BLOCK = 0.000001*OY_AKOYA_DECIMALS;//akoya fee per block
const OY_AKOYA_FEE_WALLET = 0.001*OY_AKOYA_DECIMALS;//akoya fee per wallet creation, not applied to nulling events
const OY_DNS_AUCTION_DURATION = 259200;//seconds of auction duration since latest valid bid - 3 days worth
const OY_DNS_OWNER_DURATION = 2592000;//seconds worth of ownership solvency required to bid - 30 days worth
const OY_DNS_NAME_LIMIT = 32;//max length of a mesh domain name - must be shorter than akoya public_key length for security reasons
const OY_DNS_NAV_LIMIT = 1024;//max size of nav_limit
const OY_DNS_FEE = 0.00001*OY_AKOYA_DECIMALS;//dns fee per block per 99 characters - 99 used instead of 100 for space savings on the meshblock
const OY_META_DATA_LIMIT = 131072;//max size of meta_data
const OY_META_DAPP_RANGE = 9;//max amount of meshblock amendable dapps including 0
const OY_META_FEE = 0.0001*OY_AKOYA_DECIMALS;//meta fee per block per 99 characters - 99 used instead of 100 for space savings on the meshblock
const OY_NULLING_BUFFER = 0.001*OY_AKOYA_DECIMALS;
const OY_NODE_TOLERANCE = 3;//max amount of protocol communication violations until node is blacklisted
const OY_NODE_BLACKTIME = 300;//seconds to blacklist a punished node for
const OY_NODE_PROPOSETIME = 12;//seconds for peer proposal session duration
const OY_NODE_ASSIGNTTIME = 4;//minimum interval between node_assign instances to/from top
const OY_NODE_ASSIGN_DELAY = 500;//ms delay per node_initiate from node_assign
const OY_NODE_DELAYTIME = 6;//minimum expected time to connect or transmit data to a node
const OY_NODE_EXPIRETIME = 600;//seconds of non-interaction until a node's connection session is deleted
const OY_BOOST_KEEP = 12;//node IDs to retain in boost memory, higher means more nodes retained but less average node quality
const OY_BOOST_DELAY = 250;//ms delay per boost node initiation
const OY_BOOST_EXPIRETIME = 600;//seconds until boost indexedDB retention is discarded
const OY_LIGHT_UNLATCH_MIN = 1;//minimum amount of peers that are full nodes to allow self to unlatch and become a full node
const OY_LIGHT_CHUNK = 52000;//chunk size by which the meshblock is split up and sent per light transmission
const OY_PEER_LATENCYTIME = 60;//peers are expected to establish latency timing with each other within this interval in seconds
const OY_PEER_KEEPTIME = 20;//peers are expected to communicate with each other within this interval in seconds
const OY_PEER_REPORTTIME = 10;//interval to report peer list to top
const OY_PEER_PRETIME = 20;//seconds which a node is waiting as a 'pre-peer'
const OY_PEER_MAX = 5;//maximum mutual peers
const OY_PEER_SYNC_CHANCE = 0.1;//chance of initiation with a peer from their block_sync packet whilst peer_count is greater than block_peers_min
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
const OY_LOGIC_ALL_MAX = 1500;//maximum size for a packet that is routed via OY_LOGIC_ALL, except OY_CHANNEL_BROADCAST
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
const OY_DNS_AUCTION_MIN = (OY_AKOYA_FEE_BLOCK+OY_DNS_FEE)*(OY_DNS_AUCTION_DURATION/20);
const OY_DNS_OWNER_MIN = (OY_AKOYA_FEE_BLOCK+OY_DNS_FEE)*OY_DNS_AUCTION_MIN+(OY_AKOYA_FEE_BLOCK*(OY_DNS_OWNER_DURATION/20));
//const OY_META_OWNER_MIN

// SECURITY CHECK FUNCTIONS
const OY_BLOCK_COMMANDS = {
    //["OY_AKOYA_SEND", -1, oy_key_public, oy_transfer_amount, oy_receive_public]
    "OY_AKOYA_SEND":[function(oy_command_array) {
        return (oy_command_array.length===5&&//check the element count in the command
            oy_command_array[3]>0&&//check that the sending amount is greater than zero
            oy_command_array[3]<OY_AKOYA_MAX_SUPPY&&//check that the sending amount smaller than the max supply
            typeof(OY_BLOCK[3][oy_command_array[2]])!=="undefined"&&//check that the sending wallet exists
            oy_key_check(oy_command_array[4])&&//check that the receiving address is a valid address
            (typeof(OY_BLOCK[3][oy_command_array[4]])!=="undefined"||oy_command_array[3]>OY_AKOYA_FEE_WALLET+OY_AKOYA_FEE_BLOCK)&&//enforce akoya wallet creation fees
            OY_BLOCK[3][oy_command_array[2]]>=oy_command_array[3]&&//check that the sending wallet has sufficient akoya
            oy_command_array[2]!==oy_command_array[4]);//check that the sender and the receiver are different
        //TODO - either one wallet transaction per block or need additional checks
    }],
    //["OY_AKOYA_SINK", -1, oy_key_public, oy_sink_amount]
    "OY_AKOYA_SINK":[function(oy_command_array) {
        return (oy_command_array.length===4);//check the element count in the command
    }],
    //["OY_AKOYA_SINK", -1, oy_key_public, oy_burn_amount]
    "OY_AKOYA_BURN":[function(oy_command_array) {
        return (oy_command_array.length===4);//check the element count in the command
        //TODO
    }],
    //["OY_DNS_MODIFY", -1, oy_key_public, oy_dns_name, oy_nav_data]
    "OY_DNS_MODIFY":[function(oy_command_array) {
        return (oy_command_array.length===5&&//check the element count in the command
            oy_command_array[3].length<=OY_DNS_NAME_LIMIT&&//check that the domain name's length is compliant
            oy_an_check(oy_command_array[3])&&//check that the domain name is fully alphanumeric
            typeof(OY_BLOCK[4][oy_command_array[3]])!=="undefined"&&//check that oy_dns_name exists in the dns_sector of the meshblock
            OY_BLOCK[4][oy_command_array[3]][0]===oy_command_array[2]&&//check that oy_key_public owns oy_dns_name
            typeof(oy_command_array[4])==="object"&&//check that oy_nav_set is an object
            oy_command_array[4]!==null);//further ensure that oy_nav_data is an object
    }],
    //["OY_DNS_BID", -1, oy_key_public, oy_dns_name, oy_bid_amount]
    "OY_DNS_BID":[function(oy_command_array) {
        return (oy_command_array.length===5&&//check the element count in the command
            oy_command_array[3].length<=OY_DNS_NAME_LIMIT&&//check that the domain name's length is compliant
            oy_an_check(oy_command_array[3])&&//check that the domain name is fully alphanumeric
            oy_command_array[4]>=OY_DNS_AUCTION_MIN&&//check that the bid amount is at least the minimum required amount
            typeof(OY_BLOCK[3][oy_command_array[2]])!=="undefined"&&//check that the sending wallet exists
            OY_BLOCK[3][oy_command_array[2]]>=oy_command_array[4]+OY_DNS_OWNER_MIN&&//check that the sending wallet has sufficient akoya for the bid
            (typeof(OY_BLOCK[4][oy_command_array[3]])==="undefined"||OY_BLOCK[4][oy_command_array[3]][0]==="A")&&//check that oy_dns_name doesn't exist as a domain, or is in auction mode
            (typeof(OY_BLOCK[4][oy_command_array[3]])==="undefined"||oy_command_array[4]>=OY_BLOCK[5][oy_command_array[3]][1]*2));//check that oy_dns_name doesn't exist as a domain, or the bid amount is at least double the previous bid
    }],
    //["OY_DNS_TRANSFER", -1, oy_key_public, oy_dns_name, oy_receive_public]
    "OY_DNS_TRANSFER":[function(oy_command_array) {
        return (oy_command_array.length===5&&//check the element count in the command
            oy_command_array[3].length<=OY_DNS_NAME_LIMIT&&//check that the domain name's length is compliant
            oy_an_check(oy_command_array[3])&&//check that the domain name is fully alphanumeric
            typeof(OY_BLOCK[4][oy_command_array[3]])!=="undefined"&&//check that oy_dns_name exists in the dns_sector of the meshblock
            OY_BLOCK[4][oy_command_array[3]][0]===oy_command_array[2]&&//check that oy_key_public owns oy_dns_name
            typeof(OY_BLOCK[3][oy_command_array[4]])!=="undefined");//check that oy_receive_public has a positive balance in the akoya ledger
    }],
    //["OY_DNS_RELEASE", -1, oy_key_public, oy_dns_name]
    "OY_DNS_RELEASE":[function(oy_command_array) {
        return (oy_command_array.length===4&&//check the element count in the command
            oy_command_array[3].length<=OY_DNS_NAME_LIMIT&&//check that the domain name's length is compliant
            oy_an_check(oy_command_array[3])&&//check that the domain name is fully alphanumeric
            typeof(OY_BLOCK[4][oy_command_array[3]])!=="undefined"&&//check that oy_dns_name exists in the dns_sector of the meshblock
            OY_BLOCK[4][oy_command_array[3]][0]===oy_command_array[2]);//check that oy_key_public owns oy_dns_name
    }],
    //["OY_DNS_NULLING", -1, oy_key_public, oy_dns_name, oy_nulling_amount]
    "OY_DNS_NULLING":[function(oy_command_array) {
        return (oy_command_array.length===5&&//check the element count in the command
            oy_command_array[3].length<=OY_DNS_NAME_LIMIT&&//check that the domain name's length is compliant
            oy_an_check(oy_command_array[3])&&//check that the domain name is fully alphanumeric
            typeof(OY_BLOCK[4][oy_command_array[3]])!=="undefined"&&//check that oy_dns_name exists in the dns_sector of the meshblock
            OY_BLOCK[4][oy_command_array[3]][0]===oy_command_array[2]&&//check that oy_key_public owns oy_dns_name
            oy_command_array[4]>=OY_DNS_OWNER_MIN&&//check that the nulling amount complies with DNS_OWNER_MIN funding requirement
            typeof(OY_BLOCK[3][oy_command_array[2]])!=="undefined"&&//check that oy_key_public has a positive balance in the akoya ledger
            OY_BLOCK[3][oy_command_array[2]]>=oy_command_array[4]+OY_NULLING_BUFFER);//check that oy_key_public has sufficient akoya to execute the nulling event
    }],
    //["OY_META_SET", -1, oy_key_public, oy_entropy_id, oy_meta_dapp, oy_meta_data]
    "OY_META_SET":[function(oy_command_array) {
        return (oy_command_array.length===6&&
            (oy_command_array[3]===""||oy_hash_check(oy_command_array[3]))&&//check that the input for oy_entropy_id is valid
            parseInt(oy_command_array[4])===oy_command_array[4]&&
            oy_command_array[4]>=0&&
            oy_command_array[4]<=OY_META_DAPP_RANGE);
    }],
    "OY_META_REVOKE":[function(oy_command_array) {
        if (oy_command_array.length===4) return true;//check the element count in the command
        return false;
        //TODO
    }],
    "OY_META_NULLING":[function(oy_command_array) {
        if (oy_command_array.length===4) return true;//check the element count in the command
        return false;
        //TODO
    }]
};
const OY_BLOCK_TRANSACTS = {
    "OY_HIVEMIND_CLUSTER":[function(oy_command_array) {
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
            typeof(oy_command_array[5][1])==="object");//check that the holding object for posts is a valid object
    }],
    "OY_HIVEMIND_POST":[function(oy_command_array) {
        return (oy_command_array[3]===""&&//verify that oy_entropy_id was set as null, further preventing changes to already existing hivemind posts
            oy_command_array[5].length===2&&//verify dual sectors of oy_meta_data
            oy_hash_check(oy_command_array[5][0][1])&&//check that master_entropy_id is a valid hash
            Number.isInteger(oy_command_array[5][0][2])&&//check that author_public is an integer, must be -1 TODO unnecessary?
            Number.isInteger(oy_command_array[5][0][3])&&//check that submission_payment is an integer
            typeof(OY_BLOCK[6][oy_command_array[5][0][1]])!=="undefined"&&//check that the master thread exists in the meta section of the meshblock
            OY_BLOCK[6][oy_command_array[5][0][1]][3][0][0]===0&&//check that the master thread is structured as a master thread in the meta section of the meshblock
            oy_command_array[5][0][2]===-1&&//check that author_public is set to -1, to be assigned by the meshblock
            oy_command_array[5][0][3]>=OY_BLOCK[6][oy_command_array[5][0][1]][3][0][2]+((((OY_BLOCK[6][oy_command_array[5][0][1]][3][0][4]*3600)/20))*OY_AKOYA_FEE_BLOCK)&&//check that the submission_payment is large enough to cover the submission fee defined in the master thread, and enough akoya to host the data for the original intended amount of time
            typeof(OY_BLOCK[3][oy_command_array[2]])!=="undefined"&&//check that the author of the transaction has a positive akoya balance
            OY_BLOCK[3][oy_command_array[2]]>=oy_command_array[5][0][3]&&//check that the author of the transaction has sufficient akoya to fund the submission payment
            (OY_BLOCK[6][oy_command_array[5][0][1]][0]===""&&typeof(OY_BLOCK[3][oy_command_array[5][0][1]])!=="undefined")||(OY_BLOCK[6][oy_command_array[5][0][1]][0]!==""&&typeof(OY_BLOCK[3][OY_BLOCK[6][oy_command_array[5][0][1]][0]])!=="undefined"));//check that there is a funding wallet with a positive akoya balance for the master thread
        //TODO validation for POST[1]
    }]
};

// INIT
let OY_LIGHT_MODE = true;//seek to stay permanently connected to the mesh as a light node/latch, manipulable by the user
let OY_LIGHT_STATE = true;//immediate status of being a light node/latch, not manipulable by the user
let OY_LIGHT_PENDING = false;//defines if node is transitioning into a light node from blank or full status
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
let OY_PEERS = {"oy_aggregate_node":[-1, -1, -1, 0, [], 0, [], 0, [], null, false]};//peer tracking
let OY_PEERS_PRE = {};//tracks nodes that are almost peers, will become peers once PEER_AFFIRM is received from other node
let OY_PEERS_NULL = new Event('oy_peers_null');//trigger-able event for when peer_count == 0
let OY_PEERS_RECOVER = new Event('oy_peers_recover');//trigger-able event for when peer_count > 0
let OY_NODES = {};//P2P connection handling for individual nodes
let OY_BOOST = [];//store all node IDs from the most recent meshblock and use to find new peers in-case of peers_null/meshblock reset event
let OY_BOOST_MODE = false;
let OY_WARM = {};//tracking connections to nodes that are warming up
let OY_COLD = {};//tracking connection shutdowns to specific nodes
let OY_ROUTE_DYNAMIC = [];//tracks dynamic identifier for a routed data sequence
let OY_LATENCY = {};//handle latency sessions
let OY_PROPOSED = {};//nodes that have been recently proposed to for mutual peering
let OY_BLACKLIST = {};//nodes to block for x amount of time
let OY_PUSH_HOLD = {};//holds data contents ready for pushing to mesh
let OY_PUSH_TALLY = {};//tracks data push nonces that were deposited on the mesh
let OY_BASE_BUILD = [];
let OY_LOGIC_ALL_TYPE = ["OY_BLOCK_COMMAND", "OY_BLOCK_SYNC", "OY_BLOCK_SYNC_CHALLENGE", "OY_BLOCK_DIVE", "OY_DATA_PULL", "OY_CHANNEL_BROADCAST"];//OY_LOGIC_ALL definitions
let OY_LOGIC_EXCEPT_TYPE = ["OY_BLOCK_SYNC", "OY_BLOCK_SYNC_CHALLENGE_RESPONSE", "OY_BLOCK_DIVE", "OY_CHANNEL_BROADCAST"];
let OY_MESH_RANGE = 0;
let OY_BLOCK_SECTORS = [[4, 4000], [12, 12000], [20, 20000]];//timing definitions for the meshblock
let OY_BLOCK_DYNAMIC = [null, null, null, null];
let OY_BLOCK_ROSTER = {};
let OY_BLOCK_ROSTER_AVG = null;
let OY_BLOCK = [null, [], {}, {}, {}, {}, {}, {}];//the current meshblock - [[0]:oy_block_timestamp, [1]:oy_snapshot_sector, [2]:oy_command_sector, [3]:oy_akoya_sector, [4]:oy_dns_sector, [5]:oy_auction_sector, [6]:oy_meta_sector, [7]:oy_channel_sector]
let OY_BLOCK_HASH = null;//hash of the most current block
let OY_BLOCK_FLAT = null;
let OY_BLOCK_DIFF = false;
let OY_BLOCK_SIGN = null;
let OY_BLOCK_TIME = oy_block_time_first(false);//the most recent block timestamp
let OY_BLOCK_NEXT = oy_block_time_first(true);//the next block timestamp
let OY_BLOCK_UPTIME = null;
let OY_BLOCK_WEIGHT = null;
let OY_BLOCK_STABILITY = 0;
let OY_BLOCK_STABILITY_KEEP = [OY_BLOCK_RANGE_MIN];
let OY_BLOCK_STABILITY_ROSTER = parseInt(OY_BLOCK_STABILITY_START+"");
let OY_BLOCK_COMMAND = {};
let OY_BLOCK_COMMAND_KEY = {};
let OY_BLOCK_SYNC_HASH = null;
let OY_BLOCK_SYNC = {};
let OY_BLOCK_DIVE = {};
let OY_BLOCK_CHALLENGE = {};
let OY_BLOCK_DIVE_SET = [];
let OY_BLOCK_DIVE_TRACK = 0;
let OY_BLOCK_DIVE_REWARD = "OY_NULL";
let OY_BLOCK_NEW = {};
let OY_BLOCK_CONFIRM = {};
let OY_BLOCK_INIT = new Event('oy_block_init');//trigger-able event for when a new block is issued
let OY_BLOCK_TRIGGER = new Event('oy_block_trigger');//trigger-able event for when a new block is issued
let OY_BLOCK_RESET = new Event('oy_block_reset');//trigger-able event for when a new block is issued
let OY_STATE_BLANK = new Event('oy_state_blank');//trigger-able event for when self becomes blank
let OY_STATE_LIGHT = new Event('oy_state_light');//trigger-able event for when self becomes a light node
let OY_STATE_FULL = new Event('oy_state_full');//trigger-able event for when self becomes a full node
let OY_BLOCK_HALT = null;
let OY_DIFF_TRACK = [[], [], [], [], []];
let OY_DIFF_CONSTRUCT = {};
let OY_CHALLENGE_TRIGGER = null;//passive_passport length to trigger challenge
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

function oy_shuffle_double(oy_obj_alpha, oy_obj_beta) {
    let index = oy_obj_alpha.length;
    let rnd, tmp1, tmp2;

    while (index) {
        rnd = Math.floor(Math.random()*index);
        index -= 1;
        tmp1 = oy_obj_alpha[index];
        tmp2 = oy_obj_beta[index];
        oy_obj_alpha[index] = oy_obj_alpha[rnd];
        oy_obj_beta[index] = oy_obj_beta[rnd];
        oy_obj_alpha[rnd] = tmp1;
        oy_obj_beta[rnd] = tmp2;
    }
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

function oy_uint8_hex(oy_input) {
    let oy_return = "";
    for (let i in oy_input) oy_return += oy_input[i].toString(16).padStart(2, '0');
    return oy_return;
}

function oy_hash_gen(oy_input) {
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

function oy_key_verify(oy_key_public, oy_key_signature, oy_key_data) {
    return nacl.sign.detached.verify(nacl.util.decodeUTF8(oy_key_data), nacl.util.decodeBase64(oy_key_signature), nacl.util.decodeBase64(oy_key_public.substr(1)+"="));
}

function oy_key_hash(oy_key_public_raw) {
    let oy_hash_reference = "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let oy_hash_index = 0;
    for (let oy_char of oy_key_public_raw) oy_hash_index ^= oy_char.charCodeAt(0);
    while (oy_hash_index>61) oy_hash_index -= 61;
    return oy_hash_reference[oy_hash_index];
}

function oy_key_check(oy_key_public) {
    return oy_key_public.substr(0, 1)===oy_key_hash(oy_key_public.substr(1));
}

function oy_key_gen(oy_key_private) {
    let oy_key_pair;
    if (typeof(oy_key_private)==="undefined") oy_key_pair = nacl.sign.keyPair();
    else oy_key_pair = nacl.sign.keyPair.fromSecretKey(nacl.util.decodeBase64(oy_key_private));

    let oy_key_public_raw = nacl.util.encodeBase64(oy_key_pair.publicKey).substr(0, 43);
    if (!oy_an_check(oy_key_public_raw)) return oy_key_gen();
    return [nacl.util.encodeBase64(oy_key_pair.secretKey), oy_key_hash(oy_key_public_raw)+oy_key_public_raw];
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

function oy_reduce_sum(oy_reduce_total, oy_reduce_num) {
    return oy_reduce_total + oy_reduce_num;
}

function oy_handle_check(oy_data_handle) {
    return typeof(oy_data_handle)==="string"&&oy_data_handle.substr(0, 2)==="OY"&&oy_data_handle.length>20;
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

function oy_peer_remove(oy_peer_id, oy_punish_reason) {
    if (!oy_peer_check(oy_peer_id)) return false;
    OY_PEER_COUNT--;
    if (OY_PEERS[oy_peer_id][9]===1) OY_LATCH_COUNT--;
    if (OY_PEER_COUNT===0) document.dispatchEvent(OY_PEERS_NULL);
    delete OY_PEERS[oy_peer_id];
    oy_node_reset(oy_peer_id);
    if (OY_PEER_COUNT<0||OY_LATCH_COUNT<0) {
        oy_log("Peer management system failed", 1);
        return false;
    }
    oy_data_beam(oy_peer_id, "OY_PEER_TERMINATE", (typeof(oy_punish_reason)==="undefined")?"OY_REASON_PEER_REMOVE":oy_punish_reason);
    oy_log("Removed peer "+oy_short(oy_peer_id)+" with reason "+oy_punish_reason);
    if (typeof(oy_punish_reason)!=="undefined") oy_node_punish(oy_peer_id, oy_punish_reason);
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
        //oy_data_payload = [oy_route_passport_passive, oy_route_dynamic, oy_command_array, oy_command_crypt]
        if (oy_data_payload.length!==4||typeof(oy_data_payload[0])!=="object") {
            oy_log("Peer "+oy_short(oy_peer_id)+" sent invalid block command, will punish");
            oy_node_punish(oy_peer_id, "OY_PUNISH_COMMAND_INVALID");
            return false;
        }

        if (oy_data_payload[2][1]<oy_time_local+OY_MESH_BUFFER[0]&&//check that the broadcast timestamp is not in the future, with buffer leniency
            oy_time_local-oy_data_payload[2][1]<OY_MESH_EDGE+OY_MESH_BUFFER[0]&&//check that the broadcast timestamp complies with MESH_EDGE restrictions
            oy_data_payload[2][1]-OY_BLOCK_TIME>=0&&//check that the broadcast timestamp is in the first sector of the current block
            oy_data_payload[2][1]-OY_BLOCK_TIME<OY_BLOCK_SECTORS[0][0]) {//check that the broadcast timestamp is in the first sector of the current block

            let oy_command_hash = oy_hash_gen(JSON.stringify(oy_data_payload[2]));
            if (typeof(OY_BLOCK_COMMAND_KEY[oy_data_payload[2][2]])==="undefined") OY_BLOCK_COMMAND_KEY[oy_data_payload[2][2]] = [];
            if (OY_BLOCK_COMMAND_KEY[oy_data_payload[2][2]].length>=OY_BLOCK_KEY_LIMIT||OY_BLOCK_COMMAND_KEY[oy_data_payload[2][2]].indexOf(oy_command_hash)!==-1) return false;
            OY_BLOCK_COMMAND_KEY[oy_data_payload[2][2]].push(oy_command_hash);

            if (oy_block_command_verify([oy_data_payload[2], oy_data_payload[3]])) {
                OY_BLOCK_COMMAND[oy_command_hash] = oy_data_payload;
                oy_data_route("OY_LOGIC_ALL", "OY_BLOCK_COMMAND", oy_data_payload);
                if (typeof(OY_BLOCK_MAP)==="function") OY_BLOCK_MAP(0, false);
            }
        }
        return true;
    }
    else if (oy_data_flag==="OY_BLOCK_SYNC") {
        //oy_data_payload = [oy_route_passport_passive, oy_route_dynamic, oy_route_passport_crypt, oy_sync_time, oy_sync_crypt, oy_sync_command, oy_key_public, oy_dive_reward]
        if (oy_data_payload.length!==8||typeof(oy_data_payload[0])!=="object"||typeof(oy_data_payload[2])!=="object"||oy_data_payload[0].length!==oy_data_payload[2].length||oy_data_payload[0][0]!==oy_short(oy_data_payload[6])) {
            oy_log("Peer "+oy_short(oy_peer_id)+" sent invalid block sync, will punish");
            oy_node_punish(oy_peer_id, "OY_PUNISH_SYNC_INVALID");
            return false;
        }

        if (typeof(OY_BLOCK_SYNC[oy_data_payload[6]])==="undefined"&&//check that this is the only sync processed from this node for this block
            oy_data_payload[3]<oy_time_local+OY_MESH_BUFFER[0]&&//check that the broadcast timestamp is not in the future, with buffer leniency
            oy_data_payload[3]-OY_BLOCK_TIME>=OY_BLOCK_SECTORS[0][0]&&//check that the broadcast timestamp is in the sync processing zone
            oy_data_payload[3]-OY_BLOCK_TIME<OY_BLOCK_SECTORS[0][0]+OY_MESH_BUFFER[0]+((OY_BLOCK_SECTORS[1][0]*OY_BLOCK_DENSITY)-OY_MESH_BUFFER[0])+(OY_MESH_BUFFER[0]*2)&&//check that the broadcast timestamp is in the sync processing zone
            oy_time_local-OY_BLOCK_TIME>=OY_BLOCK_SECTORS[0][0]&&//check that the current timestamp is in the sync processing zone
            oy_time_local-OY_BLOCK_TIME<OY_BLOCK_SECTORS[0][0]+OY_BLOCK_SECTORS[1][0]) {//check that the current timestamp is in the sync processing zone

            let oy_miss_limit = Math.max(OY_BLOCK_MISS_MULTI_MIN, oy_data_payload[0].length*OY_BLOCK_MISS_MULTI);
            let oy_crypt_short = oy_short(oy_data_payload[4]);
            if (oy_block_sync_hop(oy_data_payload[0].slice(), oy_data_payload[2].slice(), oy_crypt_short, oy_miss_limit, 0, performance.now(), true)) {
                let oy_sync_hash = oy_hash_gen(oy_data_payload[5]);
                if (oy_key_verify(oy_data_payload[6], oy_data_payload[4], oy_data_payload[3]+oy_sync_hash+oy_data_payload[7])) {
                    let oy_command_pool = {};
                    let oy_command_inherit = [];
                    let oy_sync_command = JSON.parse(LZString.decompressFromUTF16(oy_data_payload[5]));
                    for (let i in oy_sync_command) {
                        let oy_command_hash = oy_hash_gen(JSON.stringify(oy_sync_command[i][0]));
                        if (typeof(oy_command_pool[oy_command_hash])!=="undefined") return false;//node sent same command twice, so discard their entire sync broadcast
                        oy_command_pool[oy_command_hash] = oy_sync_command[i][0];
                        if (typeof(OY_BLOCK_COMMAND[oy_command_hash])==="undefined") oy_command_inherit.push(oy_sync_command[i]);
                    }
                    if (oy_block_sync_verify(oy_command_inherit)) {
                        if (typeof(OY_BLOCK_SYNC[oy_data_payload[6]])==="undefined") {//prevent concurrent thread overlap
                            if (OY_CHALLENGE_TRIGGER!==null&&oy_data_payload[0].length===OY_CHALLENGE_TRIGGER) {
                                let oy_sync_challenge = oy_rand_gen();
                                OY_BLOCK_SYNC[oy_data_payload[6]] = [false, oy_sync_challenge+oy_sync_hash, oy_data_payload, oy_command_pool];
                                let oy_route_skip = oy_data_payload[0].slice();
                                let oy_route_target = oy_route_skip.shift();
                                oy_data_route("OY_LOGIC_CHALLENGE", "OY_BLOCK_SYNC_CHALLENGE", [[], oy_rand_gen(), oy_route_skip, oy_route_target, oy_sync_challenge]);
                            }
                            else {
                                OY_BLOCK_SYNC[oy_data_payload[6]] = [true, null, oy_data_payload, oy_command_pool];
                                oy_data_payload[2].push(oy_key_sign(OY_SELF_PRIVATE, oy_crypt_short));
                                oy_data_route("OY_LOGIC_ALL", "OY_BLOCK_SYNC", oy_data_payload);
                                if (typeof(OY_BLOCK_MAP)==="function") OY_BLOCK_MAP(1, false);
                            }
                        }
                    }
                }
            }
        }
        return true;
    }
    else if (oy_data_flag==="OY_BLOCK_SYNC_CHALLENGE") {
        //oy_data_payload = [oy_route_passport_passive, oy_route_dynamic, oy_route_skip, oy_route_target, oy_sync_challenge]
        if (oy_data_payload.length!==5||typeof(oy_data_payload[0])!=="object") {
            oy_log("Peer "+oy_short(oy_peer_id)+" sent invalid block sync challenge will punish");
            oy_node_punish(oy_peer_id, "OY_PUNISH_SYNC_INVALID");
            return false;
        }

        if (oy_data_payload[3]===OY_SELF_SHORT) oy_data_route("OY_LOGIC_FOLLOW", "OY_BLOCK_SYNC_CHALLENGE_RESPONSE", [[], oy_data_payload[0], OY_SELF_PUBLIC, oy_key_sign(OY_SELF_PRIVATE, oy_data_payload[4]+OY_BLOCK_SYNC_HASH)]);
        else oy_data_route("OY_LOGIC_CHALLENGE", "OY_BLOCK_SYNC_CHALLENGE", oy_data_payload);
        if (typeof(OY_MESH_MAP)==="function") OY_MESH_MAP(oy_data_payload[0]);
        return true;
    }
    else if (oy_data_flag==="OY_BLOCK_SYNC_CHALLENGE_RESPONSE") {
        //oy_data_payload = [oy_route_passport_passive, oy_route_passport_active, oy_key_public, oy_challenge_crypt]
        if (oy_data_payload.length!==4||typeof(oy_data_payload[0])!=="object"||typeof(oy_data_payload[1])!=="object"||oy_data_payload[1].length===0||oy_data_payload[0][0]!==oy_short(oy_data_payload[2])) {
            oy_log("Peer "+oy_short(oy_peer_id)+" sent invalid block sync challenge response, will punish");
            oy_node_punish(oy_peer_id, "OY_PUNISH_SYNC_INVALID");
            return false;
        }

        if (oy_data_payload[1][0]===OY_SELF_SHORT) {
            if (typeof(OY_BLOCK_SYNC[oy_data_payload[2]])!=="undefined"&&OY_BLOCK_SYNC[oy_data_payload[2]][0]===false&&oy_key_verify(oy_data_payload[2], oy_data_payload[3], OY_BLOCK_SYNC[oy_data_payload[2]][1])) {
                OY_BLOCK_SYNC[oy_data_payload[2]][0] = true;
                OY_BLOCK_SYNC[oy_data_payload[2]][2][2].push(oy_key_sign(OY_SELF_PRIVATE, oy_short(OY_BLOCK_SYNC[oy_data_payload[2]][2][4])));
                oy_data_route("OY_LOGIC_ALL", "OY_BLOCK_SYNC", OY_BLOCK_SYNC[oy_data_payload[2]][2]);
                if (typeof(OY_BLOCK_MAP)==="function") OY_BLOCK_MAP(1, false);
                if (OY_PEER_COUNT<OY_BLOCK_PEERS_MIN||Math.random()<OY_PEER_SYNC_CHANCE) oy_node_initiate(oy_data_payload[2]);
                if (typeof(OY_BLOCK_MAP)==="function") OY_BLOCK_MAP(1, false);
            }
        }
        else oy_data_route("OY_LOGIC_FOLLOW", "OY_BLOCK_SYNC_CHALLENGE_RESPONSE", oy_data_payload);
        return true;
    }
    else if (oy_data_flag==="OY_BLOCK_DIVE") {
        //oy_data_payload = [oy_route_passport_passive, oy_route_dynamic, oy_dive_time, oy_dive_crypt, oy_dive_pool, oy_key_public]
        if (oy_data_payload.length!==6||typeof(oy_data_payload[0])!=="object"||oy_data_payload[0][0]!==oy_short(oy_data_payload[5])) {
            oy_log("Peer "+oy_short(oy_peer_id)+" sent invalid block dive, will punish");
            oy_node_punish(oy_peer_id, "OY_PUNISH_DIVE_INVALID");
            return false;
        }

        if (OY_BLOCK_DIVE_SET.indexOf(oy_data_payload[5])===-1&&//check that dive_set did not already process this dive broadcast
            typeof(OY_BLOCK_SYNC[oy_data_payload[5]])!=="undefined"&&//check that the public key of the node was validated during block_sync
            OY_BLOCK_SYNC[oy_data_payload[5]][0]===true&&//check that the public key of the node was validated during block_sync
            oy_data_payload[2]-OY_BLOCK_TIME>=OY_BLOCK_SECTORS[0][0]+OY_BLOCK_SECTORS[1][0]&&//check that the broadcast timestamp is in the dive processing zone
            oy_data_payload[2]-OY_BLOCK_TIME<OY_BLOCK_SECTORS[0][0]+OY_BLOCK_SECTORS[1][0]+OY_MESH_BUFFER[0]+((OY_BLOCK_SECTORS[0][0]*OY_BLOCK_DENSITY)-OY_MESH_BUFFER[0])+(OY_MESH_BUFFER[0]*2)&&//check that the broadcast timestamp is in the dive processing zone
            oy_time_local-OY_BLOCK_TIME>=OY_BLOCK_SECTORS[0][0]+OY_BLOCK_SECTORS[1][0]&&//check that the current timestamp is in the dive processing zone
            oy_time_local-OY_BLOCK_TIME<OY_BLOCK_SECTORS[2][0]&&//check that the current timestamp is in the dive processing zone
            oy_key_verify(oy_data_payload[5], oy_data_payload[3], oy_data_payload[2]+oy_hash_gen(oy_data_payload[4]))) {//verify oy_dive_crypt

            OY_BLOCK_DIVE_SET.push(oy_data_payload[5]);
            oy_data_route("OY_LOGIC_ALL", "OY_BLOCK_DIVE", oy_data_payload);
            oy_data_payload[4] = JSON.parse(LZString.decompressFromUTF16(oy_data_payload[4]));
            for (let i in oy_data_payload[4]) {
                if (typeof(OY_BLOCK_DIVE[oy_data_payload[4][i][0]])==="undefined") OY_BLOCK_DIVE[oy_data_payload[4][i][0]] = {};
                if (typeof(OY_BLOCK_DIVE[oy_data_payload[4][i][0]][oy_data_payload[4][i][1]])==="undefined") OY_BLOCK_DIVE[oy_data_payload[4][i][0]][oy_data_payload[4][i][1]] = 0;
                OY_BLOCK_DIVE[oy_data_payload[4][i][0]][oy_data_payload[4][i][1]]++;
            }
            if (typeof(OY_MESH_MAP)==="function") OY_MESH_MAP(oy_data_payload[0]);
            if (typeof(OY_BLOCK_MAP)==="function") OY_BLOCK_MAP(2, false);
            if (OY_BOOST_MODE===false&&OY_BOOST.indexOf(oy_data_payload[5])===-1) OY_BOOST.push(oy_data_payload[5]);
        }
        return true;
    }
    else if (oy_data_flag==="OY_DATA_PUSH") {//store received data and potentially forward the push request to peers
        //oy_data_payload = [oy_route_passport_passive, oy_data_handle, oy_data_nonce, oy_data_value]
        //data received here will be committed to data_deposit with only randomness restrictions, mesh flow restrictions from oy_init() are sufficient
        if (oy_data_payload.length!==4||typeof(oy_data_payload[0])!=="object"||!oy_handle_check(oy_data_payload[1])||oy_data_payload[3].length>OY_DATA_CHUNK) {
            oy_log("Peer "+oy_short(oy_peer_id)+" sent invalid push data sequence, will punish");
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
            oy_log("Peer "+oy_short(oy_peer_id)+" sent invalid pull data sequence, will punish");
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
            oy_log("Peer "+oy_short(oy_peer_id)+" sent invalid deposit data sequence, will punish");
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
            oy_log("Peer "+oy_short(oy_peer_id)+" sent invalid fulfill data sequence, will punish");
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
            oy_log("Peer "+oy_short(oy_peer_id)+" sent invalid channel broadcast, will punish");
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
            oy_log("Peer "+oy_short(oy_peer_id)+" sent an unverifiable channel broadcast, will punish");
            oy_node_punish(oy_peer_id, "OY_PUNISH_CHANNEL_VERIFY");
            return false;
        }
    }
    else if (oy_data_flag==="OY_CHANNEL_ECHO") {
        //oy_data_payload = [oy_route_passport_passive, oy_route_passport_active, oy_route_dynamic_prev, oy_channel_id, oy_echo_crypt, oy_key_public]
        if (oy_data_payload.length!==6||typeof(oy_data_payload[0])!=="object"||typeof(oy_data_payload[1])!=="object"||oy_data_payload[1].length===0||!oy_channel_check(oy_data_payload[3])) {
            oy_log("Peer "+oy_short(oy_peer_id)+" sent invalid channel echo, will punish");
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
            oy_log("Peer "+oy_short(oy_peer_id)+" sent invalid channel recover request, will punish");
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
                if (oy_data_payload[4]===null||oy_data_payload[5]===null||oy_time_local-oy_data_payload[6]>OY_MESH_EDGE+OY_MESH_BUFFER[0]) oy_channel_top(oy_data_payload[2], oy_data_payload[0], false);
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
            oy_log("Peer "+oy_short(oy_peer_id)+" sent invalid channel respond sequence, will punish");
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
        if (OY_BLOCK_HASH!==null||oy_time_local-OY_BLOCK_TIME>=OY_BLOCK_SECTORS[0][0]) return false;
        OY_BLOCK_DIFF = true;
        OY_BASE_BUILD[oy_data_payload[1]] = oy_data_payload[2];//key is block_nonce and value is block_split
        let oy_nonce_count = -1;
        for (let oy_block_nonce in OY_BASE_BUILD) {
            oy_nonce_count++;
        }
        if (oy_nonce_count===oy_data_payload[0]) {//check if block_nonce equals block_nonce_max
            OY_LIGHT_PENDING = true;

            OY_BLOCK_FLAT = OY_BASE_BUILD.join("");

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
            }, OY_MESH_BUFFER[1]+OY_BLOCK_CHALLENGETIME);
        }
        return true;
    }
    else if (oy_data_flag==="OY_PEER_DIFF") {//self as latch receives diff from source
        //TODO ensure meshblock transaction limit respects packet size limit for peer_diff packet
        if (OY_BLOCK_DIFF===true||OY_LIGHT_STATE===false||OY_BLOCK_HASH===null||oy_time_local-OY_BLOCK_TIME>=OY_BLOCK_SECTORS[0][0]) return false;//verify meshblock zone
        OY_BLOCK_DIFF = true;

        for (let oy_peer_select in OY_PEERS) {
            if (oy_peer_select==="oy_aggregate_node"||OY_PEERS[oy_peer_select][9]!==1||oy_peer_select===oy_peer_id) continue;
            oy_data_beam(oy_peer_select, "OY_PEER_DIFF", oy_data_payload);
        }

        let oy_diff_track = JSON.parse(oy_data_payload);//join the diff instructions together into the diff construct
        oy_data_payload = null;

        OY_MESH_RANGE = oy_diff_track[0][0];

        if (OY_MESH_RANGE<OY_BLOCK_RANGE_MIN) {
            oy_block_reset("OY_FLAG_DROP_RANGE_LIGHT");
            oy_log("MESHBLOCK DROP [RANGE_MIN_LIGHT]");
            return false;
        }

        OY_BLOCK_NEW = {};

        oy_block_process(oy_diff_track[2], false);

        if (oy_diff_track[1].length>0) {
            let oy_dive_share = oy_diff_track[1].shift();
            for (let i in oy_diff_track[1]) {
                if (typeof(OY_BLOCK[3][oy_diff_track[1][i]])==="undefined") OY_BLOCK[3][oy_diff_track[1][i]] = oy_dive_share;
                else OY_BLOCK[3][oy_diff_track[1][i]] += oy_dive_share;
            }
        }

        OY_BLOCK_FLAT = JSON.stringify(OY_BLOCK);
        console.log(OY_BLOCK_FLAT);

        OY_BLOCK_HASH = oy_hash_gen(OY_BLOCK_FLAT);

        OY_BLOCK_WEIGHT = new Blob([OY_BLOCK_FLAT]).size;

        oy_log("DIFF MESHBLOCK HASH "+OY_BLOCK_HASH);

        document.dispatchEvent(OY_BLOCK_TRIGGER);

        oy_block_finish();
    }
    else if (oy_data_flag==="OY_PEER_BLANK") {//peer as a full or light node is resetting to a blank node
        if (OY_PEERS[oy_peer_id][9]===1||OY_PEERS[oy_peer_id][9]===2) {
            if (OY_PEERS[oy_peer_id][9]===1) OY_LATCH_COUNT--;
            OY_PEERS[oy_peer_id][9] = 0;
        }
    }
    else if (oy_data_flag==="OY_PEER_LIGHT") {//peer as a blank or full node is converting into a light node
        if (!oy_key_verify(oy_peer_id, oy_data_payload, OY_MESH_DYNASTY+OY_BLOCK_HASH)) {
            oy_peer_remove(oy_peer_id, "OY_PUNISH_LIGHT_FAIL");
            oy_log("Removed and punished peer "+oy_short(oy_peer_id)+" who failed to upgrade to a light node");
            return false;
        }
        if (OY_PEERS[oy_peer_id][9]===0||OY_PEERS[oy_peer_id][9]===2) {
            OY_PEERS[oy_peer_id][9] = 1;
            OY_LATCH_COUNT++;
        }
    }
    else if (oy_data_flag==="OY_PEER_FULL") {//peer as a light node is converting into a full node
        if (!oy_key_verify(oy_peer_id, oy_data_payload, OY_MESH_DYNASTY+OY_BLOCK_HASH)) {
            oy_peer_remove(oy_peer_id, "OY_PUNISH_FULL_FAIL");
            oy_log("Removed and punished peer "+oy_short(oy_peer_id)+" who failed to upgrade to a full node");
            return false;
        }
        if (OY_PEERS[oy_peer_id][9]===1) {
            OY_PEERS[oy_peer_id][9] = 2;
            OY_LATCH_COUNT--;
        }
    }
    else if (oy_data_flag==="OY_PEER_CHALLENGE") {
        if (OY_BLOCK_HASH===null) return false;
        if (typeof(OY_BLOCK_CHALLENGE[oy_peer_id])!=="undefined"&&oy_key_verify(oy_peer_id, oy_data_payload, OY_MESH_DYNASTY+OY_BLOCK_HASH)) delete OY_BLOCK_CHALLENGE[oy_peer_id];
        //else oy_log_debug("MISMATCH HASH: "+OY_BLOCK_HASH);
        return true;
    }
    else if (oy_data_flag==="OY_PEER_LATENCY") {
        oy_data_payload[0] = oy_key_sign(OY_SELF_PRIVATE, OY_MESH_DYNASTY+oy_data_payload[0]);
        oy_data_beam(oy_peer_id, "OY_LATENCY_RESPONSE", oy_data_payload);
        oy_log("Signed peer latency sequence from "+oy_short(oy_peer_id));
        return true;
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
    oy_xhttp.send("oy_peer_report="+JSON.stringify([OY_SELF_PUBLIC, oy_state_convert(oy_state_current()), oy_peers_thin, OY_BLACKLIST]));
}

function oy_boost() {
    if (OY_BOOST.length===0) {
        OY_BOOST_MODE = false;
        return true;
    }
    OY_BOOST_MODE = true;
    oy_node_initiate(OY_BOOST.pop());
    oy_chrono(function() {
        oy_boost();
    }, OY_BOOST_DELAY);
}

function oy_node_reset(oy_node_id) {
    delete OY_BLOCK_CHALLENGE[oy_node_id];
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
            oy_log("Connection status: "+OY_NODES[oy_node_id][0].open+" with node "+oy_short(oy_node_id));
            if (typeof(oy_callback)==="function") oy_callback();
        });

        oy_local_conn.on('error', function() {
            delete OY_WARM[oy_node_id];
            delete OY_NODES[oy_node_id];
            oy_log("Connection to node "+oy_short(oy_node_id)+" failed, will punish");
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
    if (typeof(OY_BLACKLIST[oy_node_id])!=="undefined"&&OY_BLACKLIST[oy_node_id][0]>=OY_NODE_TOLERANCE) {
        if (OY_BLACKLIST[oy_node_id][1]<(Date.now()/1000)) {
            delete OY_BLACKLIST[oy_node_id];//remove node from blacklist if block expiration was reached
            return false;
        }
        if (oy_peer_check(oy_node_id)) oy_peer_remove(oy_node_id);
        return true;
    }
    return false;
}

//increments a node's status in the blacklist subsystem
function oy_node_punish(oy_node_id, oy_punish_reason) {
    if (typeof(oy_punish_reason)==="undefined") oy_punish_reason = null;
    if (typeof(OY_BLACKLIST[oy_node_id])==="undefined") {
        //[0] is inform count, [1] is blacklist expiration time, [2] is inform boolean (if node was informed of blacklist), [3] is punish reason tracking (for diagnostics, reported to top)
        OY_BLACKLIST[oy_node_id] = [(oy_punish_reason==="OY_PUNISH_BLACKLIST_RETURN")?OY_NODE_TOLERANCE:1, (Date.now()/1000)+OY_NODE_BLACKTIME, false, [oy_punish_reason]];//ban expiration time is defined here since we do not know if OY_NODE_TOLERANCE will change in the future
    }
    else {
        if (OY_BLACKLIST[oy_node_id][0]>=OY_NODE_TOLERANCE) return false;
        OY_BLACKLIST[oy_node_id][0]++;
        OY_BLACKLIST[oy_node_id][1] = (Date.now()/1000)+OY_NODE_BLACKTIME;
        OY_BLACKLIST[oy_node_id][3].push(oy_punish_reason);
    }
    oy_node_reset(oy_node_id);
    if (OY_BLACKLIST[oy_node_id][0]>=OY_NODE_TOLERANCE) {
        if (OY_BLACKLIST[oy_node_id][2]===false) {
            OY_BLACKLIST[oy_node_id][2] = true;
            oy_data_beam(oy_node_id, "OY_PEER_BLACKLIST", oy_punish_reason);
        }
        if (oy_peer_check(oy_node_id)) oy_peer_remove(oy_node_id, oy_punish_reason);
    }
    oy_log("Punished node "+oy_short(oy_node_id)+" with reason "+oy_punish_reason);
    return true;
}

//where the aggregate connectivity of the entire mesh begins
function oy_node_initiate(oy_node_id) {
    let oy_time_local = Date.now()/1000;

    oy_log("Initiating peership with "+oy_short(oy_node_id));
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
    else if (OY_PEER_COUNT>=OY_PEER_MAX) {
        oy_log("Halted initiation whilst peer list is saturated");
        return false;
    }
    else if (oy_time_local<=OY_BLOCK_BOOTTIME||(OY_LIGHT_MODE===true&&oy_time_local-OY_BLOCK_BOOTTIME<OY_BLOCK_BOOT_BUFFER)) {
        oy_log("Halted initiation for pending meshblock boot-up sequence");
        return false;
    }
    let oy_callback_peer = function() {
        oy_data_beam(oy_node_id, "OY_PEER_REQUEST", oy_state_current());
        OY_PROPOSED[oy_node_id] = (Date.now()/1000)+OY_NODE_PROPOSETIME;//set proposal session with expiration timestamp and type flag
    };
    oy_node_connect(oy_node_id, oy_callback_peer);
    return true;
}

//retrieves nodes from and submit self id to top.oyster.org
function oy_node_assign() {
    if (Date.now()/1000<=OY_BLOCK_BOOTTIME) return false;
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
        oy_log("Received termination notice: "+oy_data_payload+" from non-peer");
        return false;
    }
    else if (oy_data_flag==="OY_PEER_BLACKLIST") {
        oy_node_punish(oy_node_id, "OY_PUNISH_BLACKLIST_RETURN");
        oy_log("Node "+oy_short(oy_node_id)+" blacklisted us, will return the favour");
        return false;
    }
    else if (oy_data_flag==="OY_PEER_AFFIRM") {
        if (oy_peer_pre_check(oy_node_id)) {
            oy_peer_add(oy_node_id, oy_state_convert(oy_data_payload));
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
        oy_data_payload[0] = oy_key_sign(OY_SELF_PRIVATE, OY_MESH_DYNASTY+oy_data_payload[0]);
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
        if (OY_BLOCK_HASH===null||oy_time_local<=OY_BLOCK_BOOTTIME) {
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
        oy_log("Node "+oy_short(oy_node_id)+" declined our latency request, will cease and punish");
        oy_node_punish(oy_node_id, "OY_PUNISH_LATENCY_DECLINE");
        return false;
    }
    else if (oy_node_proposed(oy_node_id)) {//check if this node had previously proposed to peer with self
        if (oy_data_flag==="OY_PEER_ACCEPT") oy_latency_test(oy_node_id, "OY_PEER_ACCEPT", true, oy_data_payload);
        else {
            oy_log("Node "+oy_short(oy_node_id)+" rejected peer request ["+oy_data_flag+"]: "+oy_data_payload);
            if (oy_data_flag!=="OY_PEER_UNREADY") oy_node_punish(oy_node_id, "OY_PUNISH_PEER_REJECT");//we need to prevent nodes with far distances/long latencies from repeatedly communicating
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
    if (typeof(OY_LATENCY[oy_node_id])==="undefined") {
        oy_log("Node "+oy_short(oy_node_id)+" sent a latency response whilst no latency session exists");
        oy_node_punish(oy_node_id, "OY_PUNISH_LATENCY_NONE");
        return false;
    }
    let oy_time_local = Date.now()/1000;
    if (!oy_key_verify(oy_node_id, oy_data_payload[0], OY_MESH_DYNASTY+OY_LATENCY[oy_node_id][0])) {
        oy_log("Node "+oy_short(oy_node_id)+" failed to sign latency sequence, will punish");
        oy_node_punish(oy_node_id, "OY_PUNISH_SIGN_FAIL");
        delete OY_LATENCY[oy_node_id];
        return false;
    }
    if (OY_LATENCY[oy_node_id][0].repeat(OY_LATENCY_SIZE)===oy_data_payload[1]) {//check if payload data matches latency session definition
        if (oy_peer_check(oy_node_id)) OY_PEERS[oy_node_id][1] = oy_time_local;//update last msg timestamp for peer

        OY_LATENCY[oy_node_id][2]++;
        OY_LATENCY[oy_node_id][4] += oy_time_local-OY_LATENCY[oy_node_id][3];//calculate how long the round trip took, and add it to aggregate time
        if (OY_LATENCY[oy_node_id][1]!==OY_LATENCY[oy_node_id][2]) {
            oy_log("There was a problem with the latency test with node "+oy_short(oy_node_id)+", perhaps simultaneous instances");
            return false;
        }
        if (OY_LATENCY[oy_node_id][2]>=OY_LATENCY_REPEAT) {
            let oy_latency_result = OY_LATENCY[oy_node_id][4]/OY_LATENCY[oy_node_id][2];
            oy_log("Finished latency test ["+OY_LATENCY[oy_node_id][5]+"] with node "+oy_short(oy_node_id)+": "+oy_latency_result.toFixed(2)+" seconds");
            if (oy_latency_result>OY_LATENCY_MAX) {
                oy_log("Node "+oy_short(oy_node_id)+" has latency that breaches max, will punish");
                if (OY_LATENCY[oy_node_id][5]==="OY_PEER_ACCEPT") oy_data_beam(oy_node_id, "OY_PEER_TERMINATE", "OY_PUNISH_LATENCY_BREACH");
                else oy_data_beam(oy_node_id, "OY_PEER_REJECT", "OY_PUNISH_LATENCY_BREACH");
                oy_node_punish(oy_node_id, "OY_PUNISH_LATENCY_BREACH");
            }
            else if (OY_LATENCY[oy_node_id][5]==="OY_PEER_REQUEST"||OY_LATENCY[oy_node_id][5]==="OY_PEER_ACCEPT") {
                if (OY_PEER_COUNT<OY_PEER_MAX) {
                    if (OY_LATENCY[oy_node_id][5]==="OY_PEER_ACCEPT") {
                        oy_peer_add(oy_node_id, oy_state_convert(OY_LATENCY[oy_node_id][6]));
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
                else if (OY_PEER_COUNT===OY_PEER_MAX) {
                    let oy_peer_weak = [false, -1];
                    let oy_peer_local;
                    for (oy_peer_local in OY_PEERS) {
                        if (oy_peer_local==="oy_aggregate_node") continue;
                        if (OY_PEERS[oy_peer_local][3]>oy_peer_weak[1]) oy_peer_weak = [oy_peer_local, OY_PEERS[oy_peer_local][3]];
                    }
                    oy_log("Current weakest peer is "+oy_short(oy_peer_weak[0])+" with latency of "+oy_peer_weak[1].toFixed(4));
                    if ((oy_latency_result*(1+OY_LATENCY_GEO_SENS))<oy_peer_weak[1]) {
                        oy_log("New peer request has better latency than current weakest peer");
                        oy_peer_remove(oy_peer_weak[0], "OY_PUNISH_LATENCY_DROP");
                        if (OY_LATENCY[oy_node_id][5]==="OY_PEER_ACCEPT") {
                            oy_peer_add(oy_node_id, oy_state_convert(OY_LATENCY[oy_node_id][6]));
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
                        oy_log("New peer request has insufficient latency");
                        if (OY_LATENCY[oy_node_id][5]==="OY_PEER_ACCEPT") oy_data_beam(oy_node_id, "OY_PEER_TERMINATE", "OY_PUNISH_LATENCY_WEAK");
                        else oy_data_beam(oy_node_id, "OY_PEER_REJECT", "OY_PUNISH_LATENCY_WEAK");
                        oy_node_punish(oy_node_id, "OY_PUNISH_LATENCY_WEAK");
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
    else {
        oy_log("Node "+oy_short(oy_node_id)+" sent an invalid latency ping, will punish");
        oy_node_punish(oy_node_id, "OY_PUNISH_LATENCY_INVALID");
    }
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
        OY_LATENCY[oy_node_id] = [null, 0, 0, 0, 0, oy_latency_followup, oy_status_flag];
    }
    else if (oy_latency_new===true) {
        oy_log("New duplicate latency instance with "+oy_short(oy_node_id)+" was blocked");
        return false;
    }
    if (oy_latency_followup!==OY_LATENCY[oy_node_id][5]) {
        oy_log("Two simultaneous latency test instances crashed into each other", 1);
        return false;
    }
    //ping a unique payload string that is repeated OY_LATENCY_SIZE amount of times
    OY_LATENCY[oy_node_id][0] = oy_rand_gen(OY_LATENCY_LENGTH);
    if (oy_data_beam(oy_node_id, "OY_PEER_LATENCY", [OY_LATENCY[oy_node_id][0], OY_LATENCY[oy_node_id][0].repeat(OY_LATENCY_SIZE)])) {
        OY_LATENCY[oy_node_id][1]++;
        OY_LATENCY[oy_node_id][3] = Date.now()/1000;
        oy_log("Latency ping sent to node "+oy_short(oy_node_id));
        return true;
    }
    delete OY_LATENCY[oy_node_id];
    oy_log("Latency ping to node "+oy_short(oy_node_id)+" failed", 1);
    return false;
}

function oy_latency_check(oy_node_id) {
    return typeof(OY_LATENCY[oy_node_id])!=="undefined";
}

function oy_state_current() {//TODO consider adding more conditions to this function, such as peering stability
    if (OY_BLOCK_HASH!==null) {
        if (OY_LIGHT_STATE===false) return "OY_STATE_FULL";
        return "OY_STATE_LIGHT";
    }
    return "OY_STATE_BLANK";
}

function oy_state_convert(oy_state_flag) {
    if (oy_state_flag==="OY_STATE_FULL") return 2;
    if (oy_state_flag==="OY_STATE_LIGHT") return 1;
    if (oy_state_flag==="OY_STATE_BLANK") return 0;
    return null;
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
        let oy_data_block_bool = (oy_data_flag==="OY_BLOCK_SYNC"||oy_data_flag==="OY_BLOCK_DIVE");
        oy_data_payload[0].push(OY_SELF_SHORT);
        for (let oy_peer_select in OY_PEERS) {
            if (OY_PEERS[oy_peer_select][9]===0||(oy_data_block_bool===true&&OY_PEERS[oy_peer_select][9]!==2)||oy_peer_select==="oy_aggregate_node"||oy_data_payload[0].indexOf(oy_short(oy_peer_select))!==-1) continue;
            //oy_log("Routing data via peer "+oy_short(oy_peer_select)+" with flag "+oy_data_flag);
            oy_data_beam(oy_peer_select, oy_data_flag, oy_data_payload);
        }
    }
    else if (oy_data_logic==="OY_LOGIC_CHALLENGE") {
        //oy_data_payload[0] is oy_route_passport_passive
        //oy_data_payload[1] is oy_route_dynamic
        //oy_data_payload[2] is oy_route_skip
        //oy_data_payload[3] is oy_route_target
        if (oy_data_payload[0].length>Math.ceil(oy_data_payload[2].length*OY_CHALLENGE_BUFFER)) return false;
        oy_data_payload[0].push(OY_SELF_SHORT);
        let oy_peer_final = oy_peer_find(oy_data_payload[3]);
        if (!!oy_peer_final) oy_data_beam(oy_peer_final, oy_data_flag, oy_data_payload);
        else {
            for (let oy_peer_select in OY_PEERS) {
                if (oy_peer_select==="oy_aggregate_node"||OY_PEERS[oy_peer_select][9]!==2||oy_data_payload[0].indexOf(oy_short(oy_peer_select))!==-1||oy_data_payload[2].indexOf(oy_short(oy_peer_select))!==-1) continue;
                //oy_log("Routing data via peer "+oy_short(oy_peer_select)+" with flag "+oy_data_flag);
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
        oy_data_payload[0].push(OY_SELF_SHORT);
        //oy_log("Routing data via peer "+oy_short(oy_peer_final)+" with flag "+oy_data_flag);
        oy_data_beam(oy_peer_final, oy_data_flag, oy_data_payload);
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

function oy_data_block(oy_data_flag) {
    return (oy_data_flag==="OY_BLOCK_SYNC"||oy_data_flag==="OY_BLOCK_SYNC_CHALLENGE"||oy_data_flag==="OY_BLOCK_SYNC_CHALLENGE_RESPONSE"||oy_data_flag==="OY_BLOCK_DIVE");
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
        oy_data_payload = null;
        let oy_logic_all_bool = OY_LOGIC_ALL_TYPE.indexOf(oy_data_flag)!==-1;
        if (oy_data_raw.length>OY_DATA_MAX||
            (oy_logic_all_bool===true&&(
                (oy_data_flag==="OY_CHANNEL_BROADCAST"&&oy_data_raw.length>OY_CHANNEL_BROADCAST_PACKET_MAX)||
                ((oy_data_flag==="OY_BLOCK_SYNC"||oy_data_flag==="OY_BLOCK_DIVE")&&oy_data_raw.length>OY_BLOCK_PACKET_MAX)||
                (oy_data_flag!=="OY_CHANNEL_BROADCAST"&&oy_data_flag!=="OY_BLOCK_SYNC"&&oy_data_flag!=="OY_BLOCK_DIVE"&&oy_data_raw.length>OY_LOGIC_ALL_MAX)))) {
            oy_log("Almost sent an excessively sized data sequence for flag "+oy_data_flag+", go tell Bruno", 1);
            return false;
        }
        let oy_data_cool = false;
        if (oy_peer_check(oy_node_id)) oy_data_cool = !oy_data_measure(true, oy_node_id, oy_data_raw.length);//TODO verify latch compatibility
        if (oy_data_cool===true&&oy_data_direct_bool===false&&OY_LOGIC_EXCEPT_TYPE.indexOf(oy_data_flag)===-1) {
            oy_log("Cooling off, skipping "+oy_data_flag+" to "+oy_short(oy_node_id));
            return true;
        }
        OY_NODES[oy_node_id][0].send(oy_data_raw);//send the JSON-converted data array to the destination node
        if (!oy_data_block(oy_data_flag)) oy_log("BEAM["+oy_data_flag+"]["+oy_short(oy_node_id)+"]");
    };
    oy_node_connect(oy_node_id, oy_callback_local);
    return true;
}

//incoming data validation
function oy_data_soak(oy_node_id, oy_data_raw) {
   try {
       if (oy_data_raw.length>OY_DATA_MAX) {
           oy_log("Node "+oy_short(oy_node_id)+" sent an excessively sized data sequence, will punish and cease session");
           oy_node_punish(oy_node_id, "OY_PUNISH_DATA_LARGE");
           return false;
       }
       let oy_data = JSON.parse(oy_data_raw);
       if (oy_data&&typeof(oy_data)==="object") {
           if (oy_data[0]!=="OY_BLOCK_SYNC"&&oy_data[0]!=="OY_BLOCK_SYNC_CHALLENGE"&&oy_data[0]!=="OY_BLOCK_SYNC_CHALLENGE_RESPONSE"&&oy_data[0]!=="OY_BLOCK_DIVE") oy_log("SOAK["+oy_data[0]+"]["+oy_short(oy_node_id)+"]");
           if (!oy_data_direct(oy_data[0])) {
               if (oy_data[1][0].length>OY_MESH_HOP_MAX) {
                   oy_log("Peer "+oy_short(oy_node_id)+" sent a data sequence with too many hops, will remove and punish");
                   oy_peer_remove(oy_node_id, "OY_PUNISH_PASSPORT_HOP");
                   return false;
               }
               let oy_peer_last = oy_data[1][0][oy_data[1][0].length-1];
               if (oy_peer_last!==oy_short(oy_node_id)) {
                   oy_log("Peer "+oy_short(oy_node_id)+" lied on the passport, will remove and punish");
                   oy_peer_remove(oy_peer_last, "OY_PUNISH_PASSPORT_MISMATCH");
                   return false;
               }
               if (oy_data[1][0].indexOf(OY_SELF_SHORT)!==-1) {
                   oy_log("Peer "+oy_short(oy_node_id)+" sent a data sequence we already processed, will remove and punish");
                   oy_peer_remove(oy_node_id, "OY_PUNISH_PASSPORT_ALREADY");
                   return false;
               }
               if (typeof(oy_data[1][0])==="object"&&oy_data[1][0].length>1&&!!oy_peer_find(oy_data[1][0][0])) return true;
               if (OY_LOGIC_ALL_TYPE.indexOf(oy_data[0])!==-1) {
                   let oy_time_local = Date.now()/1000;
                   if (!oy_peer_check(oy_node_id)) {
                       oy_log("Node "+oy_short(oy_node_id)+" sent a logic all packet whilst not a peer "+oy_data[0]);
                       return false;
                   }

                   if ((oy_data[0]==="OY_CHANNEL_BROADCAST"&&oy_data_raw.length>OY_CHANNEL_BROADCAST_PACKET_MAX)||
                       ((oy_data[0]==="OY_BLOCK_SYNC"||oy_data[0]==="OY_BLOCK_DIVE")&&oy_data_raw.length>OY_BLOCK_PACKET_MAX)||
                       (oy_data[0]!=="OY_CHANNEL_BROADCAST"&&oy_data[0]!=="OY_BLOCK_SYNC"&&oy_data[0]!=="OY_BLOCK_DIVE"&&oy_data_raw.length>OY_LOGIC_ALL_MAX)) {
                       oy_log("Peer "+oy_short(oy_node_id)+" sent a data sequence that is too large for "+oy_data[0]+", will remove and punish");
                       oy_peer_remove(oy_node_id, "OY_PUNISH_LOGIC_LARGE");
                       return false;
                   }

                   if (oy_data[1][1].length!==4) {
                       oy_log("Peer "+oy_short(oy_node_id)+" sent OY_LOGIC_ALL with an invalid route_dynamic, will remove and punish");
                       oy_peer_remove(oy_node_id, "OY_PUNISH_LOGIC_LARGE");
                       return false;
                   }

                   if (oy_data[0]==="OY_BLOCK_COMMAND") {
                       if (OY_BLOCK_DYNAMIC[0]===null) return true;
                       if (OY_BLOCK_DYNAMIC[0].indexOf(oy_data[1][1])!==-1) return true;
                       OY_BLOCK_DYNAMIC[0].push(oy_data[1][1]);
                   }
                   else if (oy_data[0]==="OY_BLOCK_SYNC") {
                       if (OY_BLOCK_DYNAMIC[1]===null) return true;
                       if (OY_BLOCK_DYNAMIC[1].indexOf(oy_data[1][1])!==-1) return true;
                       OY_BLOCK_DYNAMIC[1].push(oy_data[1][1]);
                   }
                   else if (oy_data[0]==="OY_BLOCK_SYNC_CHALLENGE") {
                       if (OY_BLOCK_DYNAMIC[2]===null) return true;
                       if (OY_BLOCK_DYNAMIC[2].indexOf(oy_data[1][1])!==-1) return true;
                       OY_BLOCK_DYNAMIC[2].push(oy_data[1][1]);
                   }
                   else if (oy_data[0]==="OY_BLOCK_DIVE") {
                       if (OY_BLOCK_DYNAMIC[3]===null) return true;
                       if (OY_BLOCK_DYNAMIC[3].indexOf(oy_data[1][1])!==-1) return true;
                       OY_BLOCK_DYNAMIC[3].push(oy_data[1][1]);
                   }
                   else {
                       if (OY_ROUTE_DYNAMIC.indexOf(oy_data[1][1])!==-1) return true;
                       OY_ROUTE_DYNAMIC.push(oy_data[1][1]);
                       while (OY_ROUTE_DYNAMIC.length>OY_ROUTE_DYNAMIC_KEEP) OY_ROUTE_DYNAMIC.shift();
                   }

                   if (oy_data[0]==="OY_CHANNEL_BROADCAST"&&oy_data[1][3]!=="OY_CHANNEL_PING"&&oy_data[1][5]!==OY_KEY_BRUNO) {
                       if (typeof(OY_CHANNEL_DYNAMIC[oy_data[1][5]])!=="undefined"&&oy_time_local-OY_CHANNEL_DYNAMIC[oy_data[1][5]]<OY_CHANNEL_ALLOWANCE) {
                           oy_log("Peer "+oy_short(oy_node_id)+" sent a channel broadcast that breached allowance, will punish");
                           oy_node_punish(oy_node_id, "OY_PUNISH_BROADCAST_BREACH");
                           return false;
                       }
                       OY_CHANNEL_DYNAMIC[oy_data[1][5]] = oy_time_local;
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
    return (typeof(OY_BLOCK[7][oy_channel_id])!=="undefined"&&(OY_BLOCK[7][oy_channel_id][2].indexOf(oy_key_public)!==-1||OY_BLOCK[7][oy_channel_id][3].indexOf(oy_key_public)!==-1));
}

function oy_channel_verify(oy_data_payload) {
    let oy_time_local = Date.now()/1000;
    if (OY_BLOCK_HASH===null) return null;
    else if (oy_channel_approved(oy_data_payload[2], oy_data_payload[5])&&oy_data_payload[6]<=oy_time_local+OY_MESH_BUFFER[0]&&oy_data_payload[6]>oy_time_local-OY_MESH_EDGE) return oy_key_verify(oy_data_payload[5], oy_data_payload[4], oy_data_payload[6]+oy_data_payload[7]+oy_data_payload[3]);
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
        if (typeof(oy_callback_echo)==="function") OY_CHANNEL_ECHO[oy_channel_id+oy_data_payload[1]] = [oy_time_local+OY_MESH_EDGE, oy_broadcast_hash, oy_callback_echo, []];
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

function oy_akoya_transfer(oy_key_private, oy_key_public, oy_transfer_amount, oy_receive_public, oy_callback_confirm) {
    if (OY_BLOCK_HASH===null||oy_key_private===null||oy_key_public===null) return false;

    let oy_command_array = ["OY_AKOYA_SEND", -1, oy_key_public, Math.floor(oy_transfer_amount*OY_AKOYA_DECIMALS), oy_receive_public];
    if (!OY_BLOCK_COMMANDS[oy_command_array[0]][0](oy_command_array)) return false;

    oy_block_command(oy_key_private, oy_command_array, oy_callback_confirm);

    return true;
}

function oy_dns_transfer(oy_key_private, oy_key_public, oy_dns_name, oy_receive_public, oy_callback_confirm) {
    if (OY_BLOCK_HASH===null||oy_key_private===null||oy_key_public===null) return false;

    let oy_command_array = ["OY_DNS_TRANSFER", -1, oy_key_public, oy_dns_name, oy_receive_public];
    if (!OY_BLOCK_COMMANDS[oy_command_array[0]][0](oy_command_array)) return false;

    oy_block_command(oy_key_private, oy_command_array, oy_callback_confirm);

    return true;
}

function oy_hivemind_cluster(oy_key_private, oy_key_public, oy_entropy_id, oy_author_revoke, oy_submission_price, oy_vote_limit, oy_expire_quota, oy_capacity_active, oy_capacity_inactive, oy_post_holder, oy_callback_confirm) {
    if (OY_BLOCK_HASH===null||oy_key_private===null||oy_key_public===null) return false;

    let oy_command_array = ["OY_META_SET", -1, oy_key_public, oy_entropy_id, 1, [[0, oy_author_revoke, Math.floor(oy_submission_price*OY_AKOYA_DECIMALS), oy_vote_limit, oy_expire_quota, oy_capacity_active, oy_capacity_inactive], oy_post_holder]];
    if (!OY_BLOCK_COMMANDS[oy_command_array[0]][0](oy_command_array)||!OY_BLOCK_TRANSACTS["OY_HIVEMIND_CLUSTER"][0](oy_command_array)) return false;

    oy_block_command(oy_key_private, oy_command_array, oy_callback_confirm);

    return true;
}

function oy_hivemind_post(oy_key_private, oy_key_public, oy_cluster_id, oy_submission_payment, oy_post_title, oy_post_handle, oy_callback_confirm) {
    if (OY_BLOCK_HASH===null||oy_key_private===null||oy_key_public===null) return false;

    let oy_command_array = ["OY_META_SET", -1, oy_key_public, "", 1, [[1, oy_cluster_id, -1, Math.floor(oy_submission_payment*OY_AKOYA_DECIMALS)], [oy_post_title, oy_post_handle]]];
    if (!OY_BLOCK_COMMANDS[oy_command_array[0]][0](oy_command_array)||!OY_BLOCK_TRANSACTS["OY_HIVEMIND_POST"][0](oy_command_array)) return false;

    oy_block_command(oy_key_private, oy_command_array, oy_callback_confirm);

    return true;
}

function oy_block_command(oy_key_private, oy_command_array, oy_callback_confirm) {
    let oy_block_command_execute = function() {
        document.removeEventListener("oy_block_trigger", oy_block_command_execute, false);
        oy_chrono(function() {
            oy_command_array[1] = Date.now()/1000;
            let oy_command_flat = JSON.stringify(oy_command_array);
            if (typeof(oy_callback_confirm)!=="undefined") OY_BLOCK_CONFIRM[oy_hash_gen(oy_command_flat)] = oy_callback_confirm;
            let oy_command_crypt = oy_key_sign(oy_key_private, oy_command_flat);
            if (oy_block_command_verify([oy_command_array, oy_command_crypt])) {
                let oy_command_hash = oy_hash_gen(oy_command_flat);
                let oy_data_payload = [[], null, oy_command_array, oy_command_crypt];
                OY_BLOCK_COMMAND[oy_command_hash] = oy_data_payload;
                if (typeof(OY_BLOCK_MAP)==="function") OY_BLOCK_MAP(0, true);
                for (let oy_delay = 0;oy_delay <= 300;oy_delay += 50) {
                    oy_chrono(function() {
                        let oy_broadcast_payload = oy_data_payload.slice();
                        oy_broadcast_payload[1] = oy_rand_gen();
                        oy_data_route("OY_LOGIC_ALL", "OY_BLOCK_COMMAND", oy_broadcast_payload);
                    }, oy_delay);
                }
            }
        }, OY_BLOCK_LAUNCHTIME);
    };
    document.addEventListener("oy_block_trigger", oy_block_command_execute, false);
}

function oy_block_command_verify(oy_command_select) {
    if (typeof(oy_command_select[0][0])==="undefined"||//check that a command was given
        typeof(OY_BLOCK_COMMANDS[oy_command_select[0][0]])==="undefined") {//check that the signed command is a recognizable command
        return false;
    }

    if (oy_key_verify(oy_command_select[0][2], oy_command_select[1], JSON.stringify(oy_command_select[0]))) return OY_BLOCK_COMMANDS[oy_command_select[0][0]][0](oy_command_select[0]);
    else return false;
}

function oy_block_sync_verify(oy_command_inherit) {
    if (oy_command_inherit.length===0) return true;
    if (oy_block_command_verify(oy_command_inherit.pop())) return oy_block_sync_verify(oy_command_inherit);
    else return false;
}

function oy_block_sync_hop(oy_passport_passive, oy_passport_crypt, oy_crypt_short, oy_miss_limit, oy_roster_miss, oy_clock_start, oy_first) {
    if (oy_passport_passive.length===0||OY_BLOCK_ROSTER_AVG===null) return true;
    if (performance.now()-oy_clock_start>OY_BLOCK_HOP_CALCTIME) {
        for (let i in oy_passport_passive) {
            if (typeof(OY_BLOCK_ROSTER[oy_passport_passive[i]])!=="undefined") OY_BLOCK_ROSTER[oy_passport_passive[i]][1]++;
        }
        return true;
    }
    if (typeof(oy_first)!=="undefined") oy_shuffle_double(oy_passport_passive, oy_passport_crypt);
    let oy_node_select = oy_passport_passive.pop();
    let oy_crypt_select = oy_passport_crypt.pop();
    if (typeof(OY_BLOCK_ROSTER[oy_node_select])==="undefined"||OY_BLOCK_ROSTER[oy_node_select][1]>OY_BLOCK_ROSTER_AVG*OY_BLOCK_STABILITY_ROSTER) oy_roster_miss++;
    if (oy_roster_miss>oy_miss_limit&&OY_BLOCK_STABILITY_KEEP.length>=OY_BLOCK_STABILITY_TRIGGER) return false;
    if (typeof(OY_BLOCK_ROSTER[oy_node_select])==="undefined") {
        return oy_block_sync_hop(oy_passport_passive, oy_passport_crypt, oy_crypt_short, oy_miss_limit, oy_roster_miss, oy_clock_start);
    }
    if (oy_key_verify(OY_BLOCK_ROSTER[oy_node_select][0], oy_crypt_select, oy_crypt_short)) {
        OY_BLOCK_ROSTER[oy_node_select][1]++;
        return oy_block_sync_hop(oy_passport_passive, oy_passport_crypt, oy_crypt_short, oy_miss_limit, oy_roster_miss, oy_clock_start);
    }
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
    OY_BLOCK_STABILITY_ROSTER = parseInt(OY_BLOCK_STABILITY_START+"");
    OY_BLOCK_STABILITY_KEEP = [OY_BLOCK_RANGE_MIN];
    OY_BLOCK_DYNAMIC = [null, null, null, null];
    OY_BLOCK_COMMAND = {};
    OY_BLOCK_COMMAND_KEY = {};
    OY_BLOCK_SYNC = {};
    OY_BLOCK_DIVE = {};
    OY_BLOCK_CHALLENGE = {};
    OY_BLOCK_DIVE_SET = [];
    OY_BLOCK_DIVE_TRACK = 0;
    OY_BLOCK_ROSTER = {};
    OY_BLOCK_ROSTER_AVG = null;
    OY_BLOCK = [null, [], {}, {}, {}, {}, {}, {}];//the current meshblock - [[0]:oy_block_timestamp, [1]:oy_snapshot_sector, [2]:oy_command_sector, [3]:oy_akoya_sector, [4]:oy_dns_sector, [5]:oy_auction_sector, [6]:oy_meta_sector, [7]:oy_channel_sector]
    OY_DIFF_TRACK = [[], [], []];
    OY_BASE_BUILD = [];
    OY_MESH_RANGE = 0;
    OY_CHALLENGE_TRIGGER = null;
    OY_BLACKLIST = {};

    for (let oy_peer_select in OY_PEERS) {
        if (oy_peer_select==="oy_aggregate_node") continue;
        oy_data_beam(oy_peer_select, "OY_PEER_BLANK", null);
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
        OY_BLOCK_DYNAMIC = [[], null, null, null];
        OY_BLOCK_COMMAND = {};
        OY_DIFF_CONSTRUCT = {};

        document.dispatchEvent(OY_BLOCK_INIT);

        OY_BLOCK_DIFF = false;
        OY_LIGHT_PENDING = false;
        let oy_dive_reward = "OY_NULL";
        let oy_sync_command = [];
        let oy_sync_keep = {};
        let oy_command_execute = [];
        let oy_dive_pool = [];
        let oy_block_continue = true;

        //BLOCK SEED--------------------------------------------------
        if (OY_LIGHT_MODE===false&&OY_BLOCK_TIME===OY_BLOCK_BOOTTIME) {
            OY_BLOCK = [null, [], {}, {}, {}, {}, {}, {}];//the current meshblock
            OY_BLOCK[3]["oy_escrow_dns"] = 0;

            //SEED DEFINITION------------------------------------
            OY_BLOCK[3][OY_KEY_BRUNO] = 1000000*OY_AKOYA_DECIMALS;
            OY_BLOCK[3]["cJo3PZm9o5fwx0g2QlNKNTD9eOlOygpe9ShKetEfg0Qw"] = 1000000*OY_AKOYA_DECIMALS;
            OY_BLOCK[3]["yvU1vKfFZHygqi5oQl22phfTFTbo5qwQBHZuesCOtdgA"] = 1000000*OY_AKOYA_DECIMALS;
            //SEED DEFINITION------------------------------------

            OY_BLOCK_HASH = oy_hash_gen(JSON.stringify(OY_BLOCK));
            document.dispatchEvent(OY_STATE_FULL);
        }
        //BLOCK SEED--------------------------------------------------

        if (OY_BLOCK_UPTIME!==null&&OY_BLOCK_TIME-OY_BLOCK_UPTIME>=OY_BLOCK_DIVE_BUFFER) oy_dive_reward = (" "+OY_BLOCK_DIVE_REWARD).slice(1);

        if (OY_BLOCK_HASH!==null) {
            oy_chrono(function() {
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
                        if (OY_PEERS[oy_peer_select][10]===true) {
                            oy_peer_remove(oy_peer_select, "OY_PUNISH_BASE_ABUSE");
                            oy_log("Removed and punished peer "+oy_short(oy_peer_select)+" for base abuse");
                        }
                        else {
                            for (let i in oy_block_juggle) {
                                oy_data_beam(oy_peer_select, "OY_PEER_BASE", [oy_block_nonce_max, oy_block_juggle[i], oy_block_split[oy_block_juggle[i]]]);
                            }
                            OY_PEERS[oy_peer_select][10] = true;
                        }
                    }
                }
            }, OY_MESH_BUFFER[1]);

            oy_chrono(function() {
                let oy_block_hash_crypt = oy_key_sign(OY_SELF_PRIVATE, OY_MESH_DYNASTY+OY_BLOCK_HASH);
                for (let oy_peer_select in OY_PEERS) {
                    if (oy_peer_select==="oy_aggregate_node"||OY_PEERS[oy_peer_select][9]===0) continue;
                    oy_data_beam(oy_peer_select, "OY_PEER_CHALLENGE", oy_block_hash_crypt);
                }
            }, OY_BLOCK_PROTECTTIME);

            oy_chrono(function() {
                for (let oy_peer_select in OY_BLOCK_CHALLENGE) {
                    if (OY_PEERS[oy_peer_select][9]===0) continue;
                    oy_peer_remove(oy_peer_select, "OY_PUNISH_BLOCK_HASH");
                    delete OY_BLOCK_CHALLENGE[oy_peer_select];
                    oy_log("Removed and punished peer "+oy_short(oy_peer_select)+" who failed meshblock challenge");
                    //oy_log_debug("PUNISH HASH["+OY_SELF_SHORT+"]["+oy_short(oy_peer_select)+"]: "+OY_BLOCK_HASH);
                }
            }, OY_BLOCK_CHALLENGETIME);
        }

        oy_chrono(function() {
            let oy_time_local = Date.now()/1000;

            OY_BLOCK_DYNAMIC[0] = null;
            OY_BLOCK_DYNAMIC[1] = [];
            OY_BLOCK_DYNAMIC[2] = [];
            OY_BASE_BUILD = [];
            if (OY_BLOCK_DIVE_REWARD==="OY_NULL") OY_BLOCK_DIVE_TRACK = 0;

            if (oy_time_local-OY_BLOCK_BOOTTIME<OY_BLOCK_BOOT_BUFFER) {
                if (OY_LIGHT_MODE===true) {//if self elects to be a light node they cannot participate in the initial boot-up sequence of the mesh
                    oy_block_continue = false;
                    return false;
                }
                if (OY_LIGHT_STATE===true) OY_LIGHT_STATE = false;//since node has elected to being a full node, switch light state flag to false
            }

            //latency routine test
            for (let oy_peer_local in OY_PEERS) {
                if (oy_peer_local==="oy_aggregate_node") continue;
                let oy_time_diff_last = oy_time_local-OY_PEERS[oy_peer_local][1];
                let oy_time_diff_latency = oy_time_local-OY_PEERS[oy_peer_local][2];
                if (oy_time_diff_last>=OY_PEER_KEEPTIME||oy_time_diff_latency>=OY_PEER_LATENCYTIME) {
                    if (typeof(OY_ENGINE[0][oy_peer_local])==="undefined") {
                        oy_log("Initiating latency test with peer "+oy_short(oy_peer_local)+", time_diff_last: "+oy_time_diff_last.toFixed(2)+"/"+OY_PEER_KEEPTIME+", time_diff_latency: "+oy_time_diff_latency.toFixed(2)+"/"+OY_PEER_LATENCYTIME);
                        if (oy_latency_test(oy_peer_local, "OY_PEER_ROUTINE", true)) OY_ENGINE[0][oy_peer_local] = oy_time_local;
                        else oy_log("Latency test with peer "+oy_short(oy_peer_local)+" was unable to launch");
                    }
                    else if (oy_time_local-OY_ENGINE[0][oy_peer_local]>OY_LATENCY_MAX) {
                        oy_log("Found non-responsive peer "+oy_short(oy_peer_local)+" with latency lag: "+(oy_time_local-OY_ENGINE[0][oy_peer_local]).toFixed(4)+", will punish");
                        oy_node_punish(oy_peer_local, "OY_PUNISH_LATENCY_LAG");
                    }
                }
                else delete OY_ENGINE[0][oy_peer_local];
            }
            //latency routine test

            if (OY_BLOCK_HASH===null) {
                OY_MESH_RANGE = 0;
                OY_CHALLENGE_TRIGGER = null;
                OY_BLOCK_CHALLENGE = {};
                oy_log("MESHBLOCK SKIP: "+oy_block_time_local);
                oy_block_continue = false;
                return false;
            }

            if (OY_BLOCK_UPTIME===null&&OY_PEER_COUNT>0) OY_BLOCK_UPTIME = oy_time_local;

            if (OY_BLOCK[0]!==null&&OY_BLOCK[0]!==oy_block_time_local-20) {
                oy_block_reset("OY_FLAG_MISSTEP");
                oy_log("MESHBLOCK MISSTEP");
                oy_block_continue = false;
                return false;
            }

            if (OY_PEER_COUNT===0&&oy_time_local-OY_BLOCK_BOOTTIME>OY_BLOCK_BOOT_BUFFER) {
                oy_block_reset("OY_FLAG_DROP_PEER");
                oy_log("MESHBLOCK DROP");
                oy_block_continue = false;
                return false;
            }

            //unlatch process
            if (OY_LIGHT_MODE===false&&OY_LIGHT_STATE===true) {//condition means node is unlatching to transition from light to full node
                let oy_light_count = 0;
                let oy_light_weakest = [null, 0];
                for (let oy_peer_select in OY_PEERS) {
                    if (oy_peer_select==="oy_aggregate_node") continue;
                    if (OY_PEERS[oy_peer_select][9]===1) {
                        oy_light_count++;
                        if (oy_light_weakest[1]<OY_PEERS[oy_peer_select][3]) oy_light_weakest = [oy_peer_select, OY_PEERS[oy_peer_select][3]];
                    }
                }
                if (OY_PEER_COUNT-oy_light_count<OY_LIGHT_UNLATCH_MIN&&oy_light_weakest[0]!==null) {//self is not ready to unlatch, find more full node peers first
                    if (OY_PEER_COUNT===OY_PEER_MAX) oy_peer_remove(oy_light_weakest[0]);
                    oy_node_assign();
                }
                else if (OY_LIGHT_PENDING===false) {//unlatch sequence
                    OY_LIGHT_STATE = false;
                    document.dispatchEvent(OY_STATE_FULL);
                    for (let oy_peer_select in OY_PEERS) {
                        if (oy_peer_select==="oy_aggregate_node") continue;
                        oy_data_beam(oy_peer_select, "OY_PEER_FULL", oy_key_sign(OY_SELF_PRIVATE, OY_MESH_DYNASTY+OY_BLOCK_HASH));
                    }
                }
            }
            //unlatch process

            if (Math.floor((Date.now()-30000)/10800000)!==Math.floor((Date.now()-10000)/10800000)) {//10800000 - 3 hrs
                //oy_log_debug("SNAPSHOT: "+OY_BLOCK_HASH+"/"+JSON.stringify(OY_BLOCK));
                OY_BLOCK[2] = {};
                OY_BLOCK[1].push(OY_BLOCK_HASH);

                while (OY_BLOCK[1].length>OY_BLOCK_SNAPSHOT_KEEP) OY_BLOCK[1].shift();
            }

            OY_BLOCK[0] = oy_block_time_local;

            if (OY_LIGHT_MODE===true&&OY_LIGHT_STATE===false) {//convert from full node to light node
                OY_BLOCK_DIFF = true;
                OY_LIGHT_STATE = true;
                document.dispatchEvent(OY_STATE_LIGHT);
                for (let oy_peer_select in OY_PEERS) {
                    if (oy_peer_select==="oy_aggregate_node") continue;
                    oy_data_beam(oy_peer_select, "OY_PEER_LIGHT", oy_key_sign(OY_SELF_PRIVATE, OY_MESH_DYNASTY+OY_BLOCK_HASH));
                }
            }

            if (OY_LIGHT_STATE===true) {//do not process the meshblock anymore if in light state
                if (OY_BLOCK_DIFF===false) oy_block_reset("OY_FLAG_DIFF");
                oy_block_continue = false;
                return false;
            }

            OY_BLOCK_COMMAND_KEY = {};
            for (let oy_command_hash in OY_BLOCK_COMMAND) {
                oy_sync_command.push([OY_BLOCK_COMMAND[oy_command_hash][2], OY_BLOCK_COMMAND[oy_command_hash][3]]);//[oy_command_array, oy_command_crypt]
                oy_sync_keep[oy_command_hash] = OY_BLOCK_COMMAND[oy_command_hash][2];
            }

            oy_sync_command.sort(function(a, b) {//TODO this might need to be random instead to increase hash diversity/security
                return a[0] - b[0];
            });

            //oy_log_debug("COMMAND: "+JSON.stringify(OY_BLOCK_COMMAND)+"\nSYNC COMMAND: "+JSON.stringify(oy_sync_command));
            oy_sync_command = LZString.compressToUTF16(JSON.stringify(oy_sync_command));
            OY_BLOCK_SYNC = {};
            OY_BLOCK_SYNC_HASH = oy_hash_gen(oy_sync_command);
            oy_chrono(function() {
                let oy_sync_time = Date.now()/1000;
                if (OY_PEER_COUNT<OY_BLOCK_PEERS_MIN||oy_sync_time-OY_BLOCK_TIME<OY_BLOCK_SECTORS[0][0]||oy_sync_time-OY_BLOCK_TIME>=OY_BLOCK_SECTORS[0][0]+OY_MESH_BUFFER[0]+((OY_BLOCK_SECTORS[1][0]*OY_BLOCK_DENSITY)-OY_MESH_BUFFER[0])+(OY_MESH_BUFFER[0]*2)) return false;
                let oy_sync_crypt = oy_key_sign(OY_SELF_PRIVATE, oy_sync_time+OY_BLOCK_SYNC_HASH+oy_dive_reward);
                oy_data_route("OY_LOGIC_ALL", "OY_BLOCK_SYNC", [[], oy_rand_gen(), [oy_key_sign(OY_SELF_PRIVATE, oy_short(oy_sync_crypt))], oy_sync_time, oy_sync_crypt, oy_sync_command, OY_SELF_PUBLIC, oy_dive_reward]);
                oy_sync_command = null;
                if (typeof(OY_BLOCK_MAP)==="function") OY_BLOCK_MAP(1, true);
            }, OY_MESH_BUFFER[1]+Math.floor(Math.random()*((OY_BLOCK_SECTORS[1][1]*OY_BLOCK_DENSITY)-OY_MESH_BUFFER[1])));
        }, OY_BLOCK_SECTORS[0][1]);//seconds 0-4 out of 20

        oy_chrono(function() {
            if (oy_block_continue===false) return false;
            OY_BLOCK_DYNAMIC[1] = null;
            OY_BLOCK_DYNAMIC[2] = null;
            OY_BLOCK_DYNAMIC[3] = [];
            if (OY_BLOCK_HASH===null) {
                oy_block_reset("OY_FLAG_NULL_HASH_A");
                oy_log("MESHBLOCK CANCEL: "+oy_block_time_local);
                oy_block_continue = false;
                return false;
            }

            for (let oy_key_public_short in OY_BLOCK_ROSTER) {
                if ((typeof(OY_BLOCK_SYNC[OY_BLOCK_ROSTER[oy_key_public_short][0]])==="undefined"||OY_BLOCK_SYNC[OY_BLOCK_ROSTER[oy_key_public_short][0]][0]!==true)&&Math.random()>OY_BLOCK_ROSTER_PERSIST) delete OY_BLOCK_ROSTER[oy_key_public_short];
            }

            let oy_command_pool = {};
            let oy_node_consensus = 0;
            let oy_roster_sum = 0;
            let oy_roster_count = 0;
            for (let oy_key_public in OY_BLOCK_SYNC) {
                if (OY_BLOCK_SYNC[oy_key_public][0]===true) {
                    let oy_key_public_short = oy_short(oy_key_public);
                    if (typeof(OY_BLOCK_ROSTER[oy_key_public_short])==="undefined") {
                        oy_roster_sum++;
                        oy_roster_count++;
                        OY_BLOCK_ROSTER[oy_key_public_short] = [oy_key_public, 0];
                    }
                    else {
                        oy_roster_sum += OY_BLOCK_ROSTER[oy_key_public_short][1];
                        oy_roster_count++;
                        OY_BLOCK_ROSTER[oy_key_public_short][1] = 0;
                    }
                    oy_node_consensus++;
                    for (let oy_command_hash in OY_BLOCK_SYNC[oy_key_public][3]) {
                        if (typeof(oy_command_pool[oy_command_hash])==="undefined") oy_command_pool[oy_command_hash] = [1, OY_BLOCK_SYNC[oy_key_public][3][oy_command_hash]];
                        else oy_command_pool[oy_command_hash][0]++;
                    }
                }
            }
            if (oy_roster_count===0) OY_BLOCK_ROSTER_AVG = null;
            else OY_BLOCK_ROSTER_AVG = oy_roster_sum/oy_roster_count;

            for (let oy_command_hash in oy_sync_keep) {
                if (typeof(oy_command_pool[oy_command_hash])==="undefined") oy_command_pool[oy_command_hash] = [1, oy_sync_keep[oy_command_hash]];
                else oy_command_pool[oy_command_hash][0]++;
            }
            oy_node_consensus = Math.ceil(oy_node_consensus*OY_BLOCK_CONSENSUS);
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
            if (oy_dive_reward!=="OY_NULL"&&typeof(OY_BLOCK[3][oy_dive_reward])!=="undefined") oy_dive_pool.push([oy_dive_reward, OY_SELF_PUBLIC]);
            for (let oy_key_public in OY_BLOCK_SYNC) {
                if (OY_BLOCK_SYNC[oy_key_public][0]===true&&OY_BLOCK_SYNC[oy_key_public][2][7]!=="OY_NULL"&&typeof(OY_BLOCK[3][OY_BLOCK_SYNC[oy_key_public][2][7]])!=="undefined") oy_dive_pool.push([OY_BLOCK_SYNC[oy_key_public][2][7], oy_key_public]);//TODO review security
            }

            OY_BLOCK_DIVE = {};
            OY_BLOCK_DIVE_SET = [];
            oy_chrono(function() {
                let oy_dive_time = Date.now()/1000;
                if (OY_PEER_COUNT<OY_BLOCK_PEERS_MIN||OY_BLOCK_TIME-OY_BLOCK_UPTIME<OY_BLOCK_DIVE_BUFFER||oy_dive_time-OY_BLOCK_TIME<OY_BLOCK_SECTORS[0][0]+OY_BLOCK_SECTORS[1][0]||oy_dive_time-OY_BLOCK_TIME>=OY_BLOCK_SECTORS[0][0]+OY_BLOCK_SECTORS[1][0]+OY_MESH_BUFFER[0]+((OY_BLOCK_SECTORS[0][0]*OY_BLOCK_DENSITY)-OY_MESH_BUFFER[0])+(OY_MESH_BUFFER[0]*2)) return false;
                oy_dive_pool = LZString.compressToUTF16(JSON.stringify(oy_dive_pool));
                oy_data_route("OY_LOGIC_ALL", "OY_BLOCK_DIVE", [[], oy_rand_gen(), oy_dive_time, oy_key_sign(OY_SELF_PRIVATE, oy_dive_time+oy_hash_gen(oy_dive_pool)), oy_dive_pool, OY_SELF_PUBLIC]);
                oy_dive_pool = null;
                if (typeof(OY_BLOCK_MAP)==="function") OY_BLOCK_MAP(2, true);
            }, OY_MESH_BUFFER[1]+Math.floor(Math.random()*((OY_BLOCK_SECTORS[0][1]*OY_BLOCK_DENSITY)-OY_MESH_BUFFER[1])))
        }, OY_BLOCK_SECTORS[0][1]+OY_BLOCK_SECTORS[1][1]);//seconds 4-16 out of 20

        oy_chrono(function() {
            if (oy_block_continue===false) return false;
            OY_BLOCK_DYNAMIC[3] = null;
            if (OY_BLOCK_HASH===null) {
                oy_block_reset("OY_FLAG_NULL_HASH_B");
                oy_log("MESHBLOCK CANCEL: "+oy_block_time_local);
                oy_block_continue = false;
                return false;
            }

            let oy_time_local = Date.now()/1000;

            OY_MESH_RANGE = OY_BLOCK_DIVE_SET.length;
            OY_BLOCK_STABILITY_KEEP.push(OY_MESH_RANGE);
            while (OY_BLOCK_STABILITY_KEEP.length>OY_BLOCK_STABILITY_LIMIT) OY_BLOCK_STABILITY_KEEP.shift();
            OY_BLOCK_STABILITY = (OY_BLOCK_STABILITY_KEEP.length<OY_BLOCK_STABILITY_TRIGGER)?0:oy_block_stability(OY_BLOCK_STABILITY_KEEP);
            OY_BLOCK_STABILITY_ROSTER = (OY_BLOCK_STABILITY_KEEP.length<OY_BLOCK_STABILITY_TRIGGER)?OY_BLOCK_STABILITY_START:Math.max(OY_BLOCK_STABILITY_MIN, OY_BLOCK_STABILITY);

            if (OY_MESH_RANGE<OY_BLOCK_RANGE_MIN&&oy_time_local-OY_BLOCK_BOOTTIME>OY_BLOCK_BOOT_BUFFER) {
                oy_block_reset("OY_FLAG_DROP_RANGE");
                oy_log("MESHBLOCK DROP [RANGE_MIN]");
                oy_block_continue = false;
                return false;
            }

            if (true||oy_time_local-OY_BLOCK_BOOTTIME<=OY_BLOCK_BOOT_BUFFER) OY_CHALLENGE_TRIGGER = null;
            else OY_CHALLENGE_TRIGGER = Math.max(2, Math.floor(Math.sqrt(OY_MESH_RANGE*(1-OY_BLOCK_CONSENSUS))*OY_CHALLENGE_SAFETY));

            let oy_node_consensus = Math.ceil(OY_MESH_RANGE*OY_BLOCK_CONSENSUS);
            let oy_dive_reward_pool = [];
            for (let oy_key_dive in OY_BLOCK_DIVE) {
                for (let oy_key_public in OY_BLOCK_DIVE[oy_key_dive]) {
                    if (OY_BLOCK_DIVE[oy_key_dive][oy_key_public]>=oy_node_consensus&&typeof(OY_BLOCK[3][oy_key_dive])!=="undefined") oy_dive_reward_pool.push(oy_key_dive);
                }
            }

            OY_BLOCK_NEW = {};
            OY_BLOCK_DIVE = {};
            OY_BLOCK_DIVE_SET = [];
            OY_DIFF_TRACK = [[], [], []];
            //OY_DIFF_TRACK breakdown:
            //[0] is metadata like mesh range
            //[1] is dive reward
            //[2] is command transactions

            OY_DIFF_TRACK[0][0] = OY_MESH_RANGE;

            let [oy_supply_fail, oy_dive_bounty] = oy_block_process(oy_command_execute, true);

            if (oy_supply_fail===true) return false;

            if (oy_dive_bounty>0&&oy_dive_reward_pool.length>0) {
                let oy_dive_share = Math.floor(oy_dive_bounty/oy_dive_reward_pool.length);//TODO verify math to make sure odd balances don't cause a gradual decrease of the entire supply
                if (oy_dive_share>0) {
                    OY_DIFF_TRACK[1].push(oy_dive_share);
                    for (let i in oy_dive_reward_pool) {
                        if (oy_dive_reward===oy_dive_reward_pool[i]) OY_BLOCK_DIVE_TRACK += oy_dive_share;
                        OY_BLOCK[3][oy_dive_reward_pool[i]] += oy_dive_share;
                        OY_DIFF_TRACK[1].push(oy_dive_reward_pool[i]);
                    }
                }
            }

            //oy_log_debug("EXECUTE: "+JSON.stringify(oy_command_execute));

            OY_BLOCK_CHALLENGE = {};

            for (let oy_peer_select in OY_PEERS) {
                if (oy_peer_select==="oy_aggregate_node") continue;
                OY_BLOCK_CHALLENGE[oy_peer_select] = true;
            }

            OY_BLOCK_FLAT = JSON.stringify(OY_BLOCK);

            OY_BLOCK_HASH = oy_hash_gen(OY_BLOCK_FLAT);

            OY_BLOCK_WEIGHT = new Blob([OY_BLOCK_FLAT]).size;

            oy_log("NEW MESHBLOCK HASH "+OY_BLOCK_HASH);

            //oy_log_debug("HASH: "+OY_BLOCK_HASH+"\nBLOCK: "+OY_BLOCK_FLAT);

            document.dispatchEvent(OY_BLOCK_TRIGGER);

            if (OY_BLOCK_UPTIME!==null&&OY_LATCH_COUNT>0) {
                let oy_diff_flat = JSON.stringify(OY_DIFF_TRACK);
                for (let oy_peer_select in OY_PEERS) {
                    if (oy_peer_select!=="oy_aggregate_node"&&OY_PEERS[oy_peer_select][9]===1) oy_data_beam(oy_peer_select, "OY_PEER_DIFF", oy_diff_flat);
                }
            }

            oy_block_finish();
        }, OY_BLOCK_SECTORS[2][1]);
    }
}

function oy_block_process(oy_command_execute, oy_full_flag) {
    let oy_supply_pre = 0;
    let oy_dive_bounty = 0;

    if (OY_BLOCK_TIME-OY_BLOCK_BOOTTIME<=OY_BLOCK_BOOT_BUFFER) return [false, oy_dive_bounty];//transactions and fees are paused whilst the mesh calibrates its initial topology

    //AMEND-----------------------------------
    for (let oy_key_public in OY_BLOCK[3]) {
        if (oy_full_flag===true) oy_supply_pre += OY_BLOCK[3][oy_key_public];
        if (oy_key_public==="oy_escrow_dns") continue;
        let oy_balance_prev = OY_BLOCK[3][oy_key_public];
        OY_BLOCK[3][oy_key_public] -= OY_AKOYA_FEE_BLOCK;
        OY_BLOCK[3][oy_key_public] = Math.max(OY_BLOCK[3][oy_key_public], 0);
        if (oy_full_flag===true) oy_dive_bounty += oy_balance_prev - OY_BLOCK[3][oy_key_public];
        if (OY_BLOCK[3][oy_key_public]<=0) delete OY_BLOCK[3][oy_key_public];
    }

    for (let oy_dns_name in OY_BLOCK[4]) {
        if (OY_BLOCK[4][oy_dns_name][0]==="A") continue;
        let oy_akoya_wallet;
        if (OY_BLOCK[4][oy_dns_name][0]==="") oy_akoya_wallet = oy_dns_name;
        else oy_akoya_wallet = OY_BLOCK[4][oy_dns_name][0];
        if (typeof(OY_BLOCK[3][oy_akoya_wallet])==="undefined") delete OY_BLOCK[4][oy_dns_name];
        else {
            let oy_balance_prev = OY_BLOCK[3][oy_akoya_wallet];
            OY_BLOCK[3][oy_akoya_wallet] -= Math.ceil(OY_DNS_FEE*(OY_BLOCK[4][oy_dns_name][1]/99));
            OY_BLOCK[3][oy_akoya_wallet] = Math.max(OY_BLOCK[3][oy_akoya_wallet], 0);
            if (oy_full_flag===true) oy_dive_bounty += oy_balance_prev - OY_BLOCK[3][oy_akoya_wallet];
            if (OY_BLOCK[3][oy_akoya_wallet]<=0) delete OY_BLOCK[3][oy_akoya_wallet];
        }
    }

    for (let oy_dns_name in OY_BLOCK[5]) {
        if (OY_BLOCK[5][oy_dns_name][2]<=OY_BLOCK_TIME) {
            OY_BLOCK[3]["oy_escrow_dns"] -= OY_BLOCK[5][oy_dns_name][1];
            if (oy_full_flag===true) oy_dive_bounty += OY_BLOCK[5][oy_dns_name][1];
            OY_BLOCK[4][oy_dns_name][0] = OY_BLOCK[5][oy_dns_name][0];
            delete OY_BLOCK[5][oy_dns_name];
        }
    }

    for (let oy_entropy_id in OY_BLOCK[6]) {
        //META FEE PROCESSING
        let oy_akoya_wallet;
        if (OY_BLOCK[6][oy_entropy_id][0]==="") oy_akoya_wallet = oy_entropy_id;
        else oy_akoya_wallet = OY_BLOCK[6][oy_entropy_id][0];
        if (typeof(OY_BLOCK[3][oy_akoya_wallet])==="undefined") delete OY_BLOCK[6][oy_entropy_id];
        else {
            let oy_balance_prev = OY_BLOCK[3][oy_akoya_wallet];
            OY_BLOCK[3][oy_akoya_wallet] -= Math.ceil(OY_META_FEE*(OY_BLOCK[6][oy_entropy_id][1]/99));
            OY_BLOCK[3][oy_akoya_wallet] = Math.max(OY_BLOCK[3][oy_akoya_wallet], 0);
            if (oy_full_flag===true) oy_dive_bounty += oy_balance_prev - OY_BLOCK[3][oy_akoya_wallet];
            if (OY_BLOCK[3][oy_akoya_wallet]<=0) delete OY_BLOCK[3][oy_akoya_wallet];
        }
        //META FEE PROCESSING

        //DAPP 0 - WEB 3 HOSTING
        if (OY_BLOCK[6][oy_entropy_id][1]===0) {
            //TODO
        }
        //DAPP 0 - WEB 3 HOSTING

        //DAPP 1 - HIVEMIND
        else if (OY_BLOCK[6][oy_entropy_id][1]===1) {
            if (OY_BLOCK[6][oy_entropy_id][3][0][0]===0) {
                for (let oy_entropy_id_sub in OY_BLOCK[6][oy_entropy_id][3][1]) {
                    if (OY_BLOCK_TIME>=OY_BLOCK[6][oy_entropy_id][3][1][oy_entropy_id_sub]||typeof(OY_BLOCK[6][oy_entropy_id_sub])==="undefined") delete OY_BLOCK[6][oy_entropy_id][3][1][oy_entropy_id_sub];
                }
            }
        }
        //DAPP 1 - HIVEMIND
    }

    //TODO channel sector, made redundant by META?
    //AMEND-----------------------------------

    //TRANSACT--------------------------------
    for (let i in oy_command_execute) {
        //["OY_AKOYA_SEND", -1, oy_key_public, oy_transfer_amount, oy_receive_public]
        if (oy_command_execute[i][1][0]==="OY_AKOYA_SEND"&&OY_BLOCK_COMMANDS[oy_command_execute[i][1][0]][0](oy_command_execute[i][1])) {
            let oy_wallet_create = false;
            if (typeof(OY_BLOCK[3][oy_command_execute[i][1][4]])==="undefined") {
                OY_BLOCK[3][oy_command_execute[i][1][4]] = 0;
                oy_wallet_create = true;
            }
            let oy_balance_send = OY_BLOCK[3][oy_command_execute[i][1][2]];
            let oy_balance_receive = OY_BLOCK[3][oy_command_execute[i][1][4]];
            OY_BLOCK[3][oy_command_execute[i][1][2]] -= oy_command_execute[i][1][3];
            OY_BLOCK[3][oy_command_execute[i][1][4]] += oy_command_execute[i][1][3];
            if (OY_BLOCK[3][oy_command_execute[i][1][2]]+OY_BLOCK[3][oy_command_execute[i][1][4]]!==oy_balance_send+oy_balance_receive) {//verify balances, revert transaction if necessary
                OY_BLOCK[3][oy_command_execute[i][1][2]] = oy_balance_send;
                OY_BLOCK[3][oy_command_execute[i][1][4]] = oy_balance_receive;
                continue;
            }
            else {
                if (oy_wallet_create===true) OY_BLOCK[3][oy_command_execute[i][1][4]] -= OY_AKOYA_FEE_WALLET;
                if (OY_BLOCK[3][oy_command_execute[i][1][2]]<=0) delete OY_BLOCK[3][oy_command_execute[i][1][2]];
                if (OY_BLOCK[3][oy_command_execute[i][1][4]]<=0) delete OY_BLOCK[3][oy_command_execute[i][1][4]];
            }
        }
        //["OY_DNS_MODIFY", -1, oy_key_public, oy_dns_name, oy_nav_data]
        else if (oy_command_execute[i][1][0]==="OY_DNS_MODIFY"&&OY_BLOCK_COMMANDS[oy_command_execute[i][1][0]][0](oy_command_execute[i][1])) {
            let oy_nav_flat = JSON.stringify(oy_command_execute[i][1]);
            if (oy_nav_flat.length<=OY_DNS_NAV_LIMIT&&oy_an_check(oy_nav_flat.replace(/[\[\]{}'":,@=-]/g, "").replace(/ /g, ""))) {//check that the contents of oy_nav_data are compliant in size and fully alphanumeric
                OY_BLOCK[4][oy_command_execute[i][1][3]][1] = Math.max(99, oy_nav_flat.length);
                OY_BLOCK[4][oy_command_execute[i][1][3]][2] = oy_command_execute[i][1][4];
            }
        }
        //["OY_DNS_BID", -1, oy_key_public, oy_dns_name, oy_bid_amount]
        else if (oy_command_execute[i][1][0]==="OY_DNS_BID"&&OY_BLOCK_COMMANDS[oy_command_execute[i][1][0]][0](oy_command_execute[i][1])) {
            let oy_balance_send = OY_BLOCK[3][oy_command_execute[i][1][2]];
            let oy_balance_receive = OY_BLOCK[3]["oy_escrow_dns"];
            OY_BLOCK[3][oy_command_execute[i][1][2]] -= oy_command_execute[i][1][4];
            OY_BLOCK[3]["oy_escrow_dns"] += oy_command_execute[i][1][4];
            if (OY_BLOCK[3][oy_command_execute[i][1][2]]+OY_BLOCK[3]["oy_escrow_dns"]!==oy_balance_send+oy_balance_receive) {//verify balances, revert transaction if necessary
                OY_BLOCK[3][oy_command_execute[i][1][2]] = oy_balance_send;
                OY_BLOCK[3]["oy_escrow_dns"] = oy_balance_receive;
                continue;
            }
            else {
                let oy_bid_pass = false;
                if (typeof(OY_BLOCK[5][oy_command_execute[i][1][3]])!=="undefined") {
                    if (typeof(OY_BLOCK[3][OY_BLOCK[5][oy_command_execute[i][1][3]][0]])==="undefined") OY_BLOCK[3][OY_BLOCK[5][oy_command_execute[i][1][3]][0]] = 0;
                    let oy_balance_send = OY_BLOCK[3]["oy_escrow_dns"];
                    let oy_balance_receive = OY_BLOCK[3][OY_BLOCK[5][oy_command_execute[i][1][3]][0]];
                    OY_BLOCK[3]["oy_escrow_dns"] -= OY_BLOCK[3][OY_BLOCK[5][oy_command_execute[i][1][3]][1]];
                    OY_BLOCK[3][OY_BLOCK[5][oy_command_execute[i][1][3]][0]] += OY_BLOCK[3][OY_BLOCK[5][oy_command_execute[i][1][3]][1]];
                    if (OY_BLOCK[3]["oy_escrow_dns"]+OY_BLOCK[3][OY_BLOCK[5][oy_command_execute[i][1][3]][0]]!==oy_balance_send+oy_balance_receive) {//verify balances, revert transaction if necessary
                        OY_BLOCK[3]["oy_escrow_dns"] = oy_balance_send;
                        if (oy_balance_receive===0) delete OY_BLOCK[3][OY_BLOCK[5][oy_command_execute[i][1][3]][0]];
                        else OY_BLOCK[3][OY_BLOCK[5][oy_command_execute[i][1][3]][0]] = oy_balance_receive;
                    }
                    else oy_bid_pass = true;
                }
                else oy_bid_pass = true;

                if (oy_bid_pass===true) {
                    if (typeof(OY_BLOCK[4][oy_command_execute[i][1][3]])==="undefined") OY_BLOCK[4][oy_command_execute[i][1][3]] = ["A", 99, ""];//[owner, nav_size, nav_data]
                    OY_BLOCK[5][oy_command_execute[i][1][3]] = [oy_command_execute[i][1][2], oy_command_execute[i][1][4], OY_BLOCK_TIME+OY_DNS_AUCTION_DURATION];//[bid holder, bid amount, auction expire]
                }
            }
        }
        //["OY_DNS_TRANSFER", -1, oy_key_public, oy_dns_name, oy_receive_public]
        else if (oy_command_execute[i][1][0]==="OY_DNS_TRANSFER"&&OY_BLOCK_COMMANDS[oy_command_execute[i][1][0]][0](oy_command_execute[i][1])) {
            OY_BLOCK[4][oy_command_execute[i][1][3]][0] = oy_command_execute[i][1][4];
        }
        //["OY_DNS_RELEASE", -1, oy_key_public, oy_dns_name]
        else if (oy_command_execute[i][1][0]==="OY_DNS_RELEASE"&&OY_BLOCK_COMMANDS[oy_command_execute[i][1][0]][0](oy_command_execute[i][1])) {
            delete OY_BLOCK[4][oy_command_execute[i][1][3]];
        }
        //["OY_DNS_NULLING", -1, oy_key_public, oy_dns_name, oy_nulling_amount]
        else if (oy_command_execute[i][1][0]==="OY_DNS_NULLING"&&OY_BLOCK_COMMANDS[oy_command_execute[i][1][0]][0](oy_command_execute[i][1])) {
            let oy_balance_send = OY_BLOCK[3][oy_command_execute[i][1][2]];
            OY_BLOCK[3][oy_command_execute[i][1][2]] -= oy_command_execute[i][1][4];
            OY_BLOCK[3][oy_command_execute[i][1][3]] = oy_command_execute[i][1][4];
            if (OY_BLOCK[3][oy_command_execute[i][1][2]]+OY_BLOCK[3][oy_command_execute[i][1][3]]!==oy_balance_send) {//verify balances, revert transaction if necessary
                OY_BLOCK[3][oy_command_execute[i][1][2]] = oy_balance_send;
                delete OY_BLOCK[3][oy_command_execute[i][1][3]];
                continue;
            }
            else OY_BLOCK[4][oy_command_execute[i][1][3]][0] = "";
        }
        //["OY_META_SET", -1, oy_key_public, oy_entropy_id, oy_meta_dapp, oy_meta_data]
        else if (oy_command_execute[i][1][0]==="OY_META_SET"&&OY_BLOCK_COMMANDS[oy_command_execute[i][1][0]][0](oy_command_execute[i][1])) {
            console.log(1);
            let oy_meta_flat = JSON.stringify(oy_command_execute[i][1][5]);
            console.log(oy_meta_flat.length);
            console.log(OY_META_DATA_LIMIT);
            console.log(oy_meta_flat);
            console.log(oy_meta_flat.replace(/[\[\]{}'":,@=-]/g, "").replace(/ /g, ""));
            if (oy_meta_flat.length<=OY_META_DATA_LIMIT&&oy_an_check(oy_meta_flat.replace(/[\[\]{}'":,@=-]/g, "").replace(/ /g, ""))) {//TODO confirm if these conditions should be checked every hop
                console.log(2);
                let oy_meta_owner = oy_command_execute[i][1][2];

                let oy_entropy_id;
                if (oy_command_execute[i][1][3]==="") {//recycle meshblock entropy to ensure random meta handles are assigned in a decentralized manner
                    oy_entropy_id = oy_hash_gen(OY_BLOCK_HASH+oy_command_execute[i][0]);
                    if (typeof(OY_BLOCK[6][oy_entropy_id])!=="undefined") continue;//there is a nonzero chance that a legitimate META_SET transaction would get rejected and need to be tried again
                }
                else oy_entropy_id = oy_command_execute[i][1][3];

                //DAPP 0 - WEB 3 HOSTING
                if (oy_command_execute[i][1][4]===0) {
                    //TODO
                }
                //DAPP 0 - WEB 3 HOSTING

                //DAPP 1 - HIVEMIND
                if (oy_command_execute[i][1][4]===1) {//TODO approved_authors + render_mode (works like a blog)
                    console.log(3);
                    if (!Array.isArray(oy_command_execute[i][1][5])||!Array.isArray(oy_command_execute[i][1][5][0])||!Number.isInteger(oy_command_execute[i][1][5][0][0])) continue;
                    console.log(4);
                    //MASTER[0] = [0, author_revoke, submission_price, vote_limit, expire_quota, capacity_active, capacity_inactive]
                    //MASTER[1] = {} - holding object for posts
                    if (oy_command_execute[i][1][5][0][0]===0) {
                        console.log(5);
                        if (!OY_BLOCK_TRANSACTS["OY_HIVEMIND_CLUSTER"][0](oy_command_execute[i][1])) continue;
                    }
                    //POST[0] = [1, master_entropy_id, author_public, submission_payment]
                    //POST[1] = [] - rendering object for post content
                    else if (oy_command_execute[i][1][5][0][0]===1) {
                        console.log(6);
                        if (!OY_BLOCK_TRANSACTS["OY_HIVEMIND_POST"][0](oy_command_execute[i][1])) continue;

                        oy_meta_owner = "";
                        oy_command_execute[i][1][5][0][2] = oy_command_execute[i][1][2];

                        let oy_cluster_owner;
                        if (OY_BLOCK[6][oy_command_execute[i][1][5][0][1]][0]==="") oy_cluster_owner = oy_command_execute[i][1][5][0][1];
                        else oy_cluster_owner = OY_BLOCK[6][oy_command_execute[i][1][5][0][1]][0];
                        let oy_balance_send = OY_BLOCK[3][oy_command_execute[i][1][2]];
                        let oy_balance_receive = OY_BLOCK[3][oy_cluster_owner];
                        OY_BLOCK[3][oy_command_execute[i][1][2]] -= oy_command_execute[i][1][5][0][3];
                        OY_BLOCK[3][oy_cluster_owner] += OY_BLOCK[6][oy_command_execute[i][1][5][0][1]][3][0][2];
                        OY_BLOCK[3][oy_entropy_id] = oy_command_execute[i][1][5][0][3] - OY_BLOCK[6][oy_command_execute[i][1][5][0][1]][3][0][2];
                        console.log(oy_command_execute[i][1][5][0][3]);
                        console.log(OY_BLOCK[6][oy_command_execute[i][1][5][0][1]][3][0][2]);
                        console.log(oy_command_execute[i][1][5][0][3] - OY_BLOCK[6][oy_command_execute[i][1][5][0][1]][3][0][2]);
                        console.log(oy_cluster_owner);
                        console.log(oy_command_execute[i][1][2]);
                        console.log(OY_BLOCK[3][oy_command_execute[i][1][2]]);
                        console.log(OY_BLOCK[3][oy_cluster_owner]);
                        console.log(OY_BLOCK[3][oy_entropy_id]);
                        console.log(oy_balance_send);
                        console.log(oy_balance_receive);
                        if (OY_BLOCK[3][oy_command_execute[i][1][2]]+OY_BLOCK[3][oy_cluster_owner]+OY_BLOCK[3][oy_entropy_id]!==oy_balance_send+oy_balance_receive) {//TODO verify security
                            console.log(7);
                            OY_BLOCK[3][oy_command_execute[i][1][2]] = oy_balance_send;
                            OY_BLOCK[3][oy_command_execute[i][1][5][0][1]] = oy_balance_receive;
                            delete OY_BLOCK[3][oy_entropy_id];
                            continue;
                        }
                        else {
                            console.log(8);
                            if (Object.keys(OY_BLOCK[6][oy_command_execute[i][1][5][0][1]][1]).length<OY_BLOCK[6][oy_command_execute[i][1][5][0][1]][0][5]+OY_BLOCK[6][oy_command_execute[i][1][5][0][1]][0][6]&&typeof(OY_BLOCK[6][oy_command_execute[i][1][5][0][1]][1][oy_entropy_id])==="undefined") {
                                OY_BLOCK[6][oy_command_execute[i][1][5][0][1]][1][oy_entropy_id] = OY_BLOCK_TIME+(OY_BLOCK[6][oy_command_execute[i][1][5][0][1]][0][4]*3600);
                            }
                            else continue;
                        }
                    }
                    else continue;
                }
                //DAPP 1 - HIVEMIND

                //[owner, meta_dapp, meta_size, meta_data]
                OY_BLOCK[6][oy_entropy_id] = [oy_meta_owner, oy_command_execute[i][1][4], Math.max(99, oy_meta_flat.length), oy_command_execute[i][1][5]];
            }
            else continue;
        }
        else continue;

        OY_BLOCK[2][oy_command_execute[i][0]] = oy_command_execute[i][1];
        OY_BLOCK_NEW[oy_command_execute[i][0]] = oy_command_execute[i][1];
        if (oy_full_flag===true) OY_DIFF_TRACK[2].push(oy_command_execute[i]);
    }
    //TRANSACT--------------------------------
console.log(0);
    if (oy_full_flag===true) {
        let oy_supply_post = 0;
        for (let oy_key_public in OY_BLOCK[3]) {
            oy_supply_post += OY_BLOCK[3][oy_key_public];
        }
        if (oy_supply_post>oy_supply_pre||oy_supply_post>OY_AKOYA_MAX_SUPPY) {//confirms that the supply has not increased nor breached AKOYA_MAX_SUPPLY
            oy_block_reset("OY_FLAG_AKOYA_SUPPLY_OVERFLOW");
            return [true, 0];
        }
        return [false, oy_dive_bounty];
    }
}

function oy_block_finish() {
    for (let oy_command_hash in OY_BLOCK_CONFIRM) {
        OY_BLOCK_CONFIRM[oy_command_hash](typeof(OY_BLOCK[2][oy_command_hash])!=="undefined");
    }
    OY_BLOCK_CONFIRM = {};

    while (OY_BOOST.length>OY_BOOST_KEEP) OY_BOOST.shift();
    oy_local_set("oy_boost", OY_BOOST);
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
        oy_log("Engine initiating node_assign, peer count is "+OY_PEER_COUNT+"/"+OY_PEER_MAX);
        oy_node_assign();
    }

    if (OY_PEER_COUNT>0&&(oy_time_local-oy_thread_track[1])>OY_PEER_REPORTTIME) {
        oy_thread_track[1] = oy_time_local;
        oy_log("Engine initiating peer_report, peer count is "+OY_PEER_COUNT+"/"+OY_PEER_MAX);
        oy_peer_report();
    }

    for (let oy_node_select in OY_NODES) {
        if (oy_time_local-OY_NODES[oy_node_select][1]>OY_NODE_EXPIRETIME) {
            oy_node_disconnect(oy_node_select);
            oy_log("Cleaned up expired connection object for node: "+oy_short(oy_node_select));
        }
    }

    for (let oy_node_select in OY_WARM) {
        if (oy_time_local-OY_WARM[oy_node_select]>OY_NODE_DELAYTIME) {
            if (oy_peer_check(oy_node_select)) {
                oy_log("Engine found peer "+oy_short(oy_node_select)+" unable to warm up, will remove and punish");
                oy_peer_remove(oy_node_select, "OY_PUNISH_WARM_LAG");
            }
            else oy_node_punish(oy_node_select, "OY_PUNISH_WARM_LAG");
            delete OY_WARM[oy_node_select];
            oy_log("Cleaned up expired warming session for node: "+oy_short(oy_node_select));
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
        if (OY_CHANNEL_ECHO[oy_echo_key][0]<oy_time_local) {
            delete OY_CHANNEL_ECHO[oy_echo_key];
            oy_log("Cleaned up expired echo session with key: "+oy_short(oy_echo_key));
        }
    }

    for (let oy_key_public in OY_CHANNEL_DYNAMIC) {
        if (oy_time_local-OY_CHANNEL_DYNAMIC[oy_key_public]>OY_CHANNEL_ALLOWANCE) {
            delete OY_CHANNEL_DYNAMIC[oy_key_public];
            oy_log("Cleaned up expired channel allowance for public key: "+oy_short(oy_key_public));
        }
    }

    for (let oy_node_select in OY_LATENCY) {
        if (oy_time_local-OY_LATENCY[oy_node_select][3]>OY_LATENCY_MAX) {
            delete OY_LATENCY[oy_node_select];
            oy_log("Cleaned up expired latency session for node: "+oy_short(oy_node_select));
        }
    }

    for (let oy_node_select in OY_PEERS_PRE) {
        if (OY_PEERS_PRE[oy_node_select]<oy_time_local) {
            delete OY_PEERS_PRE[oy_node_select];
            oy_log("Cleaned up expired pre peer session for node: "+oy_short(oy_node_select));
        }
    }

    for (let oy_node_select in OY_PROPOSED) {
        if (OY_PROPOSED[oy_node_select]<oy_time_local) {
            delete OY_PROPOSED[oy_node_select];
            oy_log("Cleaned up expired proposal session for node: "+oy_short(oy_node_select));
        }
    }

    for (let oy_node_select in OY_BLACKLIST) {
        if (OY_BLACKLIST[oy_node_select][1]<oy_time_local) {
            delete OY_BLACKLIST[oy_node_select];
            oy_log("Cleaned up expired blacklist flag for node: "+oy_short(oy_node_select));
        }
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
            if (oy_boost_expire!==null&&Date.now()/1000<oy_boost_expire) oy_local_get("oy_boost", [], function(oy_boost) {
                OY_BOOST = oy_boost;
                oy_boost();
            });
            else oy_local_set("oy_boost", []);
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
            if (oy_data_measure(false, oy_conn.peer, oy_data_raw.length)===false) {
                oy_log("Peer "+oy_short(oy_conn.peer)+" exceeded mesh flow compliance limits, will punish");
                oy_node_punish(oy_conn.peer, "OY_PUNISH_MESH_FLOW");
            }
            oy_peer_process(oy_conn.peer, oy_data[0], oy_data[1]);
        }
        else if ((oy_data[0]==="OY_BLOCK_SYNC"||oy_data[0]==="OY_BLOCK_DIVE")&&OY_LIGHT_STATE===false) oy_peer_process(oy_conn.peer, oy_data[0], oy_data[1]);//TODO verify light state inclusion
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
        OY_BLOCK_DIVE_REWARD = oy_dive_detect;
        oy_init(function() {
            console.log("Oyster is diving for address "+OY_BLOCK_DIVE_REWARD)
        });
    }
}