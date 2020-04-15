// OYSTER MESH
// Bruno Block
// v0.6
// License: GNU GPLv3

// GLOBAL VARS
const OY_MESH_DYNASTY = "BRUNO_GENESIS_V6";//mesh dynasty definition, changing this will cause a hard-fork
const OY_MESH_BUFFER = [0.2, 200];//seconds and ms buffer a block command's timestamp is allowed to be in the future, this variable exists to deal with slight mis-calibrations between node clocks
const OY_MESH_FLOW = 256000;//characters per second allowed per peer, and for all aggregate non-peer nodes
const OY_MESH_HOP_MAX = 1000;//maximum hops allowed on a transmission passport
const OY_MESH_MEASURE = 10;//seconds by which to measure mesh flow, larger means more tracking of nearby node and peer activity
const OY_MESH_BEAM_SAMPLE = 3;//time/data measurements to determine mesh beam flow required to state a result, too low can lead to volatile and inaccurate readings
const OY_MESH_BEAM_COOL = 2.5;//cool factor for beaming, higher is less beam intensity
const OY_MESH_BEAM_MIN = 0.5;//minimum beam ratio to start returning false
const OY_MESH_SOAK_SAMPLE = 5;//time/data measurements to determine mesh soak flow required to state a result, too low can lead to volatile and inaccurate readings
const OY_MESH_SOAK_BUFFER = 1.2;//multiplication factor for mesh inflow/soak buffer, to give some leeway to compliant peers
const OY_MESH_PUSH_CHANCE = 0.9;//probability that self will forward a data_push when the nonce was not previously stored on self
const OY_MESH_DEPOSIT_CHANCE = 0.5;//probability that self will deposit pushed data
const OY_MESH_FULLFILL_CHANCE = 0.2;//probability that data is stored whilst fulfilling a pull request, this makes data intelligently migrate and recommit overtime
const OY_MESH_SOURCE = 3;//node in route passport (from destination) that is assigned with defining the source variable//TODO remove?
const OY_MESH_SEQUENCE = 8;
const OY_BLOCK_LOOP = [20, 140];//a lower value means increased accuracy for detecting the start of the next meshblock
const OY_BLOCK_STABILITY_TRIGGER = 3;//mesh range history minimum to trigger reliance on real stability value
const OY_BLOCK_STABILITY_LIMIT = 12;//mesh range history to keep to calculate meshblock stability, time is effectively value x 20 seconds
const OY_BLOCK_EPOCH_MACRO = 40;//360, cadence in blocks to perform epoch processing - 6 hr interval
const OY_BLOCK_EPOCH_MICRO = 4;//10, cadence in blocks to perform jump retention, higher is less memory burden on full nodes, lower is less time to wait for transaction finality - 10 min interval
const OY_BLOCK_SNAPSHOT_KEEP = 120;//how many hashes of previous blocks to keep in the current meshblock, value is for 1 month's worth (6 hrs x 4 = 24 hrs x 30 = 30 days, 4 x 30 = 120)
const OY_BLOCK_HALT_BUFFER = 5;//seconds between permitted block_reset() calls. Higher means less chance duplicate block_reset() instances will clash
const OY_BLOCK_COMMAND_QUOTA = 20000;
const OY_BLOCK_RANGE_KILL = 0.7;
const OY_BLOCK_RANGE_MIN = 2;//10, minimum syncs/dives required to not locally reset the meshblock, higher means side meshes die easier
const OY_BLOCK_BOOT_BUFFER = 360;//seconds grace period to ignore certain cloning/peering rules to bootstrap the network during a boot-up event
const OY_BLOCK_BOOT_SEED = 1583483400;//timestamp to boot the mesh, node remains offline before this timestamp
const OY_BLOCK_SECTORS = [[30, 30000], [50, 50000], [51, 51000], [52, 52000], [58, 58000], [60, 60000]];//timing definitions for the meshblock
const OY_BLOCK_BUFFER_CLEAR = [0.5, 500];
const OY_BLOCK_BUFFER_SPACE = [12, 12000];//lower value means full node is eventually more profitable (makes it harder for edge nodes to dive), higher means better connection stability/reliability for self
const OY_BLOCK_RECORD_LIMIT = 20;
const OY_BLOCK_RECORD_INTRO_BUFFER = 1.4;
const OY_JUDGE_BUFFER_BASE = 1.8;
const OY_JUDGE_BUFFER_CURVE = 1.2;//allocation for curve
const OY_SYNC_LAST_BUFFER = 2;
const OY_LIGHT_CHUNK = 52000;//chunk size by which the meshblock is split up and sent per light transmission
const OY_LIGHT_COMMIT = 0.4;
const OY_PEER_RESERVETIME = 300;//peers are expected to establish latency timing with each other within this interval in seconds
const OY_PEER_MAX = 6;//maximum mutual peers
const OY_PEER_FULL_MIN = 4;
const OY_PEER_CUT = 0.3;//minimum percentage threshold to be safe from being selected as a potential weakest peer, higher is less peers safe
const OY_INTRO_TRIP = [0.8, 800];
const OY_WORK_MATCH = 4;//lower is more bandwidth/memory bound, higher is more CPU bound, anomaly birds come from CPU bound therefore higher is safer against unemployment absence
const OY_WORK_MAX = 10000;//10000
const OY_WORK_MIN = 2;
const OY_WORK_DELTA = 0.2;
const OY_WORK_DILUTE = 3;
const OY_WORK_TARGET = 55;//1440x7/1 week, value in minutes, lower is harsher work that kicks nodes off the mesh more frequently, higher discourages new node operators and hence less decentralization
const OY_WORK_INTRO = 100;
const OY_AKOYA_DECIMALS = 100000000;//zeros after the decimal point for akoya currency
const OY_AKOYA_LIQUID = 10000000*OY_AKOYA_DECIMALS;//akoya liquidity restrictions to prevent integer overflow
const OY_AKOYA_MAX_SUPPLY = 100000000*OY_AKOYA_DECIMALS;
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
const OY_NODE_MAX = 32;
const OY_WORKER_CORES_FALLBACK = 4;
const OY_ROUTE_DYNAMIC_KEEP = 200;//how many dynamic identifiers for a routed data sequence to remember and block
const OY_LATENCY_SIZE = 80;//size of latency ping payload, larger is more accurate yet more taxing
const OY_LATENCY_LENGTH = 8;//length of rand sequence which is repeated for payload and signed for ID verification
const OY_LATENCY_TRACK = 200;//how many latency measurements to keep at a time per peer
const OY_LATENCY_GEO_SENS = 2.5;//percentage buffer for comparing latency with peers, higher means less likely weakest peer will get dropped and mesh is less geo-sensitive
const OY_DATA_MAX = 250000;//max size of data that can be sent to another node
const OY_DATA_CHUNK = 125000;//chunk size by which data is split up and sent per transmission
const OY_DATA_PURGE = 10;//how many handles to delete if indexedDB limit is reached
const OY_DATA_PUSH_INTERVAL = 200;//ms per chunk per push loop iteration
const OY_DATA_PUSH_NONCE_MAX = 16;//maximum amount of nonces to push per push loop iteration
const OY_DATA_PULL_INTERVAL = 800;//ms per pull loop iteration
const OY_DATA_PULL_NONCE_MAX = 3;//maximum amount of nonces to request per pull beam, if too high fulfill will overrun soak limits and cause time/resource waste
const OY_CHRONO_ACCURACY = 10;//ms accuracy for chrono function, lower means more accurate meshblock timing yet more CPU usage
/*
const OY_CHANNEL_BROADCAST_PACKET_MAX = 3000;//maximum size for a packet that is routed via OY_CHANNEL_BROADCAST (OY_LOGIC_ALL)
const OY_CHANNEL_KEEPTIME = 10;//channel bearing nodes are expected to broadcast a logic_all packet within this interval
const OY_CHANNEL_FORGETIME = 25;//seconds since last signed message from channel bearing node
const OY_CHANNEL_RECOVERTIME = 6;//second interval between channel recovery requests per node, should be at least MESH_EDGE*2
const OY_CHANNEL_EXPIRETIME = 2592000;//seconds until a broadcast expires and is dropped from nodes listening on the channel
const OY_CHANNEL_RESPOND_MAX = 6;//max amount of broadcast payloads to send in response to a channel recover request
const OY_CHANNEL_ALLOWANCE = 58;//broadcast allowance in seconds per public key, an anti-spam mechanism to prevent spamming chat forums with garbage text
const OY_CHANNEL_CONSENSUS = 0.5;//node signature requirement for a broadcast to be retained in channel_keep
const OY_CHANNEL_TOP_TOLERANCE = 2;//node count difference allowed between broadcast claim and perceived claim
 */
const OY_KEY_BRUNO = "JSJqmlzAxwuINY2FCpWPJYvKIK1AjavBgkIwIm139k4M";//prevent impersonation (custom avatar), achieve AKY coin-lock. This is the testnet wallet, will change for mainnet
const OY_SHORT_LENGTH = 6;//various data value such as nonce IDs, data handles, data values are shortened for efficiency

// PRE-CALCULATED VARS
const OY_BLOCK_BOOTTIME = oy_block_boot_calc(OY_BLOCK_BOOT_SEED);
const OY_DNS_AUCTION_MIN = (OY_AKOYA_FEE+OY_DNS_FEE)*(OY_DNS_AUCTION_DURATION/OY_BLOCK_SECTORS[5][0]);
const OY_DNS_OWNER_MIN = (OY_AKOYA_FEE+OY_DNS_FEE)*OY_DNS_AUCTION_MIN+(OY_AKOYA_FEE*(OY_DNS_OWNER_DURATION/OY_BLOCK_SECTORS[5][0]));
//const OY_META_OWNER_MIN

// TEMPLATE VARS
//[[0]:peership block_time, [1]:latch flag, [2]:base sent, [3]:latency avg, [4]:latency history, [5]:data beam, [6]:data beam history, [7]:data soak, [8]:data soak history, [9]:mesh core cut, [10]:signal_object, [11]:[signal_init_beam, signal_init_soak, signal_broker_soak, signal_broker_beam, signal_broker_response, signal_responder_soak]]
const OY_PEER_TEMPLATE = [null, null, false, 0, [], 0, [], 0, [], 0, null, [null, null, null, null, null, null]];//TODO put command counter in meshblock
//the current meshblock - [[0]:[[0]:oy_mesh_dynasty, [1]:oy_block_timestamp, [2]:oy_mesh_range, [3]:oy_work_difficulty, [4]:oy_genesis_timestamp, [5]:oy_epoch_macro_count, [6]:oy_epoch_micro_count, [7]:oy_grade_total, [8]:oy_grade_current, [9]:oy_grade_avg, [10]:oy_grade_keep, [11]:oy_range_roll, [12]:oy_range_keep, [13]:oy_work_roll, [14]:oy_work_keep, [15]:oy_uptime_current],
// [1]:oy_dive_sector, [2]:oy_snapshot_sector, [3]:oy_command_sector, [4]:oy_akoya_sector, [5]:oy_dns_sector, [6]:oy_auction_sector, [7]:oy_meta_sector]
const OY_BLOCK_TEMPLATE = Object.freeze([[null, null, null, null, null, null, null, null, null, null, [], null, [], null, [], null], {}, [[], []], {}, {}, {}, {}, {}, {}, {}]);//TODO figure out channel sector
let OY_BLOCK = oy_clone_object(OY_BLOCK_TEMPLATE);

// SECURITY CHECK FUNCTIONS
const OY_BLOCK_COMMANDS = {
    //["OY_AKOYA_SEND", oy_protocol_assign, oy_key_public, oy_transfer_amount, oy_receive_public]
    "OY_AKOYA_SEND":[function(oy_command_array, oy_jump_flag) {
        let oy_block;
        if (oy_jump_flag===true) oy_block = OY_BLOCK_JUMP;
        else oy_block = OY_BLOCK;
        return (oy_command_array.length===5&&//check the element count in the command
            oy_command_array[3]>0&&//check that the sending amount is greater than zero
            oy_command_array[3]<OY_AKOYA_LIQUID&&//check that the sending amount smaller than the max supply
            typeof(oy_block[4][oy_command_array[2]])!=="undefined"&&//check that the sending wallet exists
            oy_key_check(oy_command_array[4])&&//check that the receiving address is a valid address
            oy_block[4][oy_command_array[2]]>=oy_command_array[3]&&//check that the sending wallet has sufficient akoya
            oy_command_array[2]!==oy_command_array[4]);//check that the sender and the receiver are different
    }],
    //["OY_AKOYA_SINK", oy_protocol_assign, oy_key_public, oy_sink_amount]
    "OY_AKOYA_SINK":[function(oy_command_array, oy_jump_flag) {
        let oy_block;
        if (oy_jump_flag===true) oy_block = OY_BLOCK_JUMP;
        else oy_block = OY_BLOCK;
        return (oy_command_array.length===4);//check the element count in the command
    }],
    //["OY_AKOYA_BURN", oy_protocol_assign, oy_key_public, oy_burn_amount]
    "OY_AKOYA_BURN":[function(oy_command_array, oy_jump_flag) {
        let oy_block;
        if (oy_jump_flag===true) oy_block = OY_BLOCK_JUMP;
        else oy_block = OY_BLOCK;
        return (oy_command_array.length===4);//check the element count in the command
        //TODO
    }],
    //["OY_DNS_MODIFY", oy_protocol_assign, oy_key_public, oy_dns_name, oy_nav_data]
    "OY_DNS_MODIFY":[function(oy_command_array, oy_jump_flag) {
        let oy_block;
        if (oy_jump_flag===true) oy_block = OY_BLOCK_JUMP;
        else oy_block = OY_BLOCK;
        return (oy_command_array.length===5&&//check the element count in the command
            oy_command_array[3].length<=OY_DNS_NAME_LIMIT&&//check that the domain name's length is compliant
            oy_an_check(oy_command_array[3])&&//check that the domain name is fully alphanumeric
            typeof(oy_block[5][oy_command_array[3]])!=="undefined"&&//check that oy_dns_name exists in the dns_sector of the meshblock
            oy_block[5][oy_command_array[3]][0]===oy_command_array[2]&&//check that oy_key_public owns oy_dns_name
            typeof(oy_command_array[4])==="object"&&//check that oy_nav_set is an object
            oy_command_array[4]!==null);//further ensure that oy_nav_data is an object
    }],
    //["OY_DNS_BID", oy_protocol_assign, oy_key_public, oy_dns_name, oy_bid_amount]
    "OY_DNS_BID":[function(oy_command_array, oy_jump_flag) {
        let oy_block;
        if (oy_jump_flag===true) oy_block = OY_BLOCK_JUMP;
        else oy_block = OY_BLOCK;
        return (oy_command_array.length===5&&//check the element count in the command
            oy_command_array[3].length<=OY_DNS_NAME_LIMIT&&//check that the domain name's length is compliant
            oy_an_check(oy_command_array[3])&&//check that the domain name is fully alphanumeric
            oy_command_array[4]>=OY_DNS_AUCTION_MIN&&//check that the bid amount is at least the minimum required amount
            typeof(oy_block[4][oy_command_array[2]])!=="undefined"&&//check that the sending wallet exists
            oy_block[4][oy_command_array[2]]>=oy_command_array[4]+OY_DNS_OWNER_MIN&&//check that the sending wallet has sufficient akoya for the bid
            (typeof(oy_block[5][oy_command_array[3]])==="undefined"||oy_block[5][oy_command_array[3]][0]==="A")&&//check that oy_dns_name doesn't exist as a domain, or is in auction mode
            (typeof(oy_block[5][oy_command_array[3]])==="undefined"||oy_command_array[4]>=oy_block[6][oy_command_array[3]][1]*2));//check that oy_dns_name doesn't exist as a domain, or the bid amount is at least double the previous bid
    }],
    //["OY_DNS_TRANSFER", oy_protocol_assign, oy_key_public, oy_dns_name, oy_receive_public]
    "OY_DNS_TRANSFER":[function(oy_command_array, oy_jump_flag) {
        let oy_block;
        if (oy_jump_flag===true) oy_block = OY_BLOCK_JUMP;
        else oy_block = OY_BLOCK;
        return (oy_command_array.length===5&&//check the element count in the command
            oy_command_array[3].length<=OY_DNS_NAME_LIMIT&&//check that the domain name's length is compliant
            oy_an_check(oy_command_array[3])&&//check that the domain name is fully alphanumeric
            typeof(oy_block[5][oy_command_array[3]])!=="undefined"&&//check that oy_dns_name exists in the dns_sector of the meshblock
            oy_block[5][oy_command_array[3]][0]===oy_command_array[2]&&//check that oy_key_public owns oy_dns_name
            typeof(oy_block[4][oy_command_array[4]])!=="undefined");//check that oy_receive_public has a positive balance in the akoya ledger
    }],
    //["OY_DNS_RELEASE", oy_protocol_assign, oy_key_public, oy_dns_name]
    "OY_DNS_RELEASE":[function(oy_command_array, oy_jump_flag) {
        let oy_block;
        if (oy_jump_flag===true) oy_block = OY_BLOCK_JUMP;
        else oy_block = OY_BLOCK;
        return (oy_command_array.length===4&&//check the element count in the command
            oy_command_array[3].length<=OY_DNS_NAME_LIMIT&&//check that the domain name's length is compliant
            oy_an_check(oy_command_array[3])&&//check that the domain name is fully alphanumeric
            typeof(oy_block[5][oy_command_array[3]])!=="undefined"&&//check that oy_dns_name exists in the dns_sector of the meshblock
            oy_block[5][oy_command_array[3]][0]===oy_command_array[2]);//check that oy_key_public owns oy_dns_name
    }],
    //["OY_DNS_NULLING", oy_protocol_assign, oy_key_public, oy_dns_name, oy_nulling_amount]
    "OY_DNS_NULLING":[function(oy_command_array, oy_jump_flag) {
        let oy_block;
        if (oy_jump_flag===true) oy_block = OY_BLOCK_JUMP;
        else oy_block = OY_BLOCK;
        return (oy_command_array.length===5&&//check the element count in the command
            oy_command_array[3].length<=OY_DNS_NAME_LIMIT&&//check that the domain name's length is compliant
            oy_an_check(oy_command_array[3])&&//check that the domain name is fully alphanumeric
            typeof(oy_block[5][oy_command_array[3]])!=="undefined"&&//check that oy_dns_name exists in the dns_sector of the meshblock
            oy_block[5][oy_command_array[3]][0]===oy_command_array[2]&&//check that oy_key_public owns oy_dns_name
            oy_command_array[4]>=OY_DNS_OWNER_MIN&&//check that the nulling amount complies with DNS_OWNER_MIN funding requirement
            typeof(oy_block[4][oy_command_array[2]])!=="undefined"&&//check that oy_key_public has a positive balance in the akoya ledger
            oy_block[4][oy_command_array[2]]>=oy_command_array[4]+OY_NULLING_BUFFER);//check that oy_key_public has sufficient akoya to execute the nulling event
    }],
    //["OY_META_SET", oy_protocol_assign, oy_key_public, oy_entropy_id, oy_meta_dapp, oy_meta_data]
    "OY_META_SET":[function(oy_command_array, oy_jump_flag) {
        oy_jump_flag = null;//TODO shouldn't there be a check for the signing wallet?
        return (oy_command_array.length===6&&
            (oy_command_array[3]===""||oy_hash_check(oy_command_array[3]))&&//check that the input for oy_entropy_id is valid
            parseInt(oy_command_array[4])===oy_command_array[4]&&
            oy_command_array[4]>=0&&
            oy_command_array[4]<=OY_META_DAPP_RANGE);
    }],
    //["OY_META_REVOKE", oy_protocol_assign, oy_key_public, oy_entropy_id]
    "OY_META_REVOKE":[function(oy_command_array, oy_jump_flag) {
        let oy_block;
        if (oy_jump_flag===true) oy_block = OY_BLOCK_JUMP;
        else oy_block = OY_BLOCK;
        if (oy_command_array.length===4) return true;//check the element count in the command
        return false;
        //TODO
    }],
    //["OY_META_NULLING", oy_protocol_assign, oy_key_public, oy_entropy_id, oy_nulling_amount]
    "OY_META_NULLING":[function(oy_command_array, oy_jump_flag) {
        let oy_block;
        if (oy_jump_flag===true) oy_block = OY_BLOCK_JUMP;
        else oy_block = OY_BLOCK;
        if (oy_command_array.length===5) return true;//check the element count in the command
        return false;
        //TODO
    }]
};
const OY_BLOCK_TRANSACTS = {
    "OY_HIVEMIND_CLUSTER":[function(oy_command_array, oy_jump_flag) {
        let oy_block;
        let oy_block_time;
        if (oy_jump_flag===true) {
            oy_block = OY_BLOCK_JUMP;
            oy_block_time = OY_BLOCK_TIME_JUMP;
        }
        else {
            oy_block = OY_BLOCK;
            oy_block_time = OY_BLOCK_TIME;
        }
        let oy_hold_check = function([oy_hold_hash, oy_hold_expire]) {
            return (oy_hash_check(oy_hold_hash)&&typeof(oy_block[7][oy_hold_hash])!=="undefined"&&Number.isInteger(oy_hold_expire)&&oy_hold_expire<=oy_block_time+(oy_command_array[5][0][4]*3600)+OY_BLOCK_SECTORS[5][0]);
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
    "OY_HIVEMIND_POST":[function(oy_command_array, oy_jump_flag) {
        let oy_block;
        if (oy_jump_flag===true) oy_block = OY_BLOCK_JUMP;
        else oy_block = OY_BLOCK;
        return (oy_command_array[3]===""&&//verify that oy_entropy_id was set as null, further preventing changes to already existing hivemind posts
            oy_command_array[5].length===2&&//verify dual sectors of oy_meta_data
            oy_hash_check(oy_command_array[5][0][1])&&//check that master_entropy_id is a valid hash
            Number.isInteger(oy_command_array[5][0][2])&&//check that author_public is an integer, must be -1 TODO unnecessary?
            Number.isInteger(oy_command_array[5][0][3])&&//check that submission_payment is an integer
            typeof(oy_block[7][oy_command_array[5][0][1]])!=="undefined"&&//check that the master thread exists in the meta section of the meshblock
            oy_block[7][oy_command_array[5][0][1]][3][0][0]===0&&//check that the master thread is structured as a master thread in the meta section of the meshblock
            oy_command_array[5][0][2]===-1&&//check that author_public is set to -1, to be assigned by the meshblock
            oy_command_array[5][0][3]>=oy_block[7][oy_command_array[5][0][1]][3][0][2]+((((oy_block[7][oy_command_array[5][0][1]][3][0][4]*3600)/OY_BLOCK_SECTORS[5][0]))*OY_AKOYA_FEE)&&//check that the submission_payment is large enough to cover the submission fee defined in the master thread, and enough akoya to host the data for the original intended amount of time
            typeof(oy_block[4][oy_command_array[2]])!=="undefined"&&//check that the author of the transaction has a positive akoya balance
            oy_block[4][oy_command_array[2]]>=oy_command_array[5][0][3]&&//check that the author of the transaction has sufficient akoya to fund the submission payment
            typeof(oy_block[7][oy_command_array[5][0][1]])!=="undefined"&&//check that the master thread exists in the meta sector of the meshblock
            ((oy_block[7][oy_command_array[5][0][1]][0]===""&&typeof(oy_block[4][oy_command_array[5][0][1]])!=="undefined")||(oy_block[7][oy_command_array[5][0][1]][0]!==""&&typeof(oy_block[4][oy_block[7][oy_command_array[5][0][1]][0]])!=="undefined"))&&//check that there is a funding wallet with a positive akoya balance for the master thread
            oy_an_check(oy_command_array[5][1][0].replace(/[=]/g, ""))&&//check that the post title is in valid base64
            oy_handle_check(oy_command_array[5][1][1]));//check that the post content is a mesh handle
    }]
};
let OY_NODE_STATE = typeof(window)==="undefined";

// DEPENDENCIES
let perf, NodeEvent, SimplePeer, wrtc;

//OYSTER DEPENDENCY TWEETNACL-JS
//https://github.com/dchest/tweetnacl-js
let nacl={};var u64=function(r,n){this.hi=0|r,this.lo=0|n},gf=function(r){var n,e=new Float64Array(16);if(r)for(n=0;n<r.length;n++)e[n]=r[n];return e},randombytes=function(){throw new Error("no PRNG")},_0=new Uint8Array(16),_9=new Uint8Array(32);_9[0]=9;var gf0=gf(),gf1=gf([1]),_121665=gf([56129,1]),D=gf([30883,4953,19914,30187,55467,16705,2637,112,59544,30585,16505,36039,65139,11119,27886,20995]),D2=gf([61785,9906,39828,60374,45398,33411,5274,224,53552,61171,33010,6542,64743,22239,55772,9222]),X=gf([54554,36645,11616,51542,42930,38181,51040,26924,56412,64982,57905,49316,21502,52590,14035,8553]),Y=gf([26200,26214,26214,26214,26214,26214,26214,26214,26214,26214,26214,26214,26214,26214,26214,26214]),I=gf([41136,18958,6951,50414,58488,44335,6150,12099,55207,15867,153,11085,57099,20417,9344,11139]);function L32(r,n){return r<<n|r>>>32-n}function ld32(r,n){var e=255&r[n+3];return(e=(e=e<<8|255&r[n+2])<<8|255&r[n+1])<<8|255&r[n+0]}function dl64(r,n){var e=r[n]<<24|r[n+1]<<16|r[n+2]<<8|r[n+3],t=r[n+4]<<24|r[n+5]<<16|r[n+6]<<8|r[n+7];return new u64(e,t)}function st32(r,n,e){var t;for(t=0;t<4;t++)r[n+t]=255&e,e>>>=8}function ts64(r,n,e){r[n]=e.hi>>24&255,r[n+1]=e.hi>>16&255,r[n+2]=e.hi>>8&255,r[n+3]=255&e.hi,r[n+4]=e.lo>>24&255,r[n+5]=e.lo>>16&255,r[n+6]=e.lo>>8&255,r[n+7]=255&e.lo}function vn(r,n,e,t,o){var c,a=0;for(c=0;c<o;c++)a|=r[n+c]^e[t+c];return(1&a-1>>>8)-1}function crypto_verify_16(r,n,e,t){return vn(r,n,e,t,16)}function crypto_verify_32(r,n,e,t){return vn(r,n,e,t,32)}function core(r,n,e,t,o){var c,a,_,y=new Uint32Array(16),i=new Uint32Array(16),s=new Uint32Array(16),u=new Uint32Array(4);for(c=0;c<4;c++)i[5*c]=ld32(t,4*c),i[1+c]=ld32(e,4*c),i[6+c]=ld32(n,4*c),i[11+c]=ld32(e,16+4*c);for(c=0;c<16;c++)s[c]=i[c];for(c=0;c<20;c++){for(a=0;a<4;a++){for(_=0;_<4;_++)u[_]=i[(5*a+4*_)%16];for(u[1]^=L32(u[0]+u[3]|0,7),u[2]^=L32(u[1]+u[0]|0,9),u[3]^=L32(u[2]+u[1]|0,13),u[0]^=L32(u[3]+u[2]|0,18),_=0;_<4;_++)y[4*a+(a+_)%4]=u[_]}for(_=0;_<16;_++)i[_]=y[_]}if(o){for(c=0;c<16;c++)i[c]=i[c]+s[c]|0;for(c=0;c<4;c++)i[5*c]=i[5*c]-ld32(t,4*c)|0,i[6+c]=i[6+c]-ld32(n,4*c)|0;for(c=0;c<4;c++)st32(r,4*c,i[5*c]),st32(r,16+4*c,i[6+c])}else for(c=0;c<16;c++)st32(r,4*c,i[c]+s[c]|0)}function crypto_core_salsa20(r,n,e,t){return core(r,n,e,t,!1),0}function crypto_core_hsalsa20(r,n,e,t){return core(r,n,e,t,!0),0}var sigma=new Uint8Array([101,120,112,97,110,100,32,51,50,45,98,121,116,101,32,107]);function crypto_stream_salsa20_xor(r,n,e,t,o,c,a){var _,y,i=new Uint8Array(16),s=new Uint8Array(64);if(!o)return 0;for(y=0;y<16;y++)i[y]=0;for(y=0;y<8;y++)i[y]=c[y];for(;o>=64;){for(crypto_core_salsa20(s,i,a,sigma),y=0;y<64;y++)r[n+y]=(e?e[t+y]:0)^s[y];for(_=1,y=8;y<16;y++)_=_+(255&i[y])|0,i[y]=255&_,_>>>=8;o-=64,n+=64,e&&(t+=64)}if(o>0)for(crypto_core_salsa20(s,i,a,sigma),y=0;y<o;y++)r[n+y]=(e?e[t+y]:0)^s[y];return 0}function crypto_stream_salsa20(r,n,e,t,o){return crypto_stream_salsa20_xor(r,n,null,0,e,t,o)}function crypto_stream(r,n,e,t,o){var c=new Uint8Array(32);return crypto_core_hsalsa20(c,t,o,sigma),crypto_stream_salsa20(r,n,e,t.subarray(16),c)}function crypto_stream_xor(r,n,e,t,o,c,a){var _=new Uint8Array(32);return crypto_core_hsalsa20(_,c,a,sigma),crypto_stream_salsa20_xor(r,n,e,t,o,c.subarray(16),_)}function add1305(r,n){var e,t=0;for(e=0;e<17;e++)t=t+(r[e]+n[e]|0)|0,r[e]=255&t,t>>>=8}var minusp=new Uint32Array([5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,252]);function crypto_onetimeauth(r,n,e,t,o,c){var a,_,y,i,s=new Uint32Array(17),u=new Uint32Array(17),f=new Uint32Array(17),p=new Uint32Array(17),l=new Uint32Array(17);for(y=0;y<17;y++)u[y]=f[y]=0;for(y=0;y<16;y++)u[y]=c[y];for(u[3]&=15,u[4]&=252,u[7]&=15,u[8]&=252,u[11]&=15,u[12]&=252,u[15]&=15;o>0;){for(y=0;y<17;y++)p[y]=0;for(y=0;y<16&&y<o;++y)p[y]=e[t+y];for(p[y]=1,t+=y,o-=y,add1305(f,p),_=0;_<17;_++)for(s[_]=0,y=0;y<17;y++)s[_]=0|s[_]+f[y]*(y<=_?u[_-y]:320*u[_+17-y]|0);for(_=0;_<17;_++)f[_]=s[_];for(i=0,y=0;y<16;y++)i=i+f[y]|0,f[y]=255&i,i>>>=8;for(i=i+f[16]|0,f[16]=3&i,i=5*(i>>>2)|0,y=0;y<16;y++)i=i+f[y]|0,f[y]=255&i,i>>>=8;i=i+f[16]|0,f[16]=i}for(y=0;y<17;y++)l[y]=f[y];for(add1305(f,minusp),a=0|-(f[16]>>>7),y=0;y<17;y++)f[y]^=a&(l[y]^f[y]);for(y=0;y<16;y++)p[y]=c[y+16];for(p[16]=0,add1305(f,p),y=0;y<16;y++)r[n+y]=f[y];return 0}function crypto_onetimeauth_verify(r,n,e,t,o,c){var a=new Uint8Array(16);return crypto_onetimeauth(a,0,e,t,o,c),crypto_verify_16(r,n,a,0)}function crypto_secretbox(r,n,e,t,o){var c;if(e<32)return-1;for(crypto_stream_xor(r,0,n,0,e,t,o),crypto_onetimeauth(r,16,r,32,e-32,r),c=0;c<16;c++)r[c]=0;return 0}function crypto_secretbox_open(r,n,e,t,o){var c,a=new Uint8Array(32);if(e<32)return-1;if(crypto_stream(a,0,32,t,o),0!==crypto_onetimeauth_verify(n,16,n,32,e-32,a))return-1;for(crypto_stream_xor(r,0,n,0,e,t,o),c=0;c<32;c++)r[c]=0;return 0}function set25519(r,n){var e;for(e=0;e<16;e++)r[e]=0|n[e]}function car25519(r){var n,e;for(e=0;e<16;e++)r[e]+=65536,n=Math.floor(r[e]/65536),r[(e+1)*(e<15?1:0)]+=n-1+37*(n-1)*(15===e?1:0),r[e]-=65536*n}function sel25519(r,n,e){for(var t,o=~(e-1),c=0;c<16;c++)t=o&(r[c]^n[c]),r[c]^=t,n[c]^=t}function pack25519(r,n){var e,t,o,c=gf(),a=gf();for(e=0;e<16;e++)a[e]=n[e];for(car25519(a),car25519(a),car25519(a),t=0;t<2;t++){for(c[0]=a[0]-65517,e=1;e<15;e++)c[e]=a[e]-65535-(c[e-1]>>16&1),c[e-1]&=65535;c[15]=a[15]-32767-(c[14]>>16&1),o=c[15]>>16&1,c[14]&=65535,sel25519(a,c,1-o)}for(e=0;e<16;e++)r[2*e]=255&a[e],r[2*e+1]=a[e]>>8}function neq25519(r,n){var e=new Uint8Array(32),t=new Uint8Array(32);return pack25519(e,r),pack25519(t,n),crypto_verify_32(e,0,t,0)}function par25519(r){var n=new Uint8Array(32);return pack25519(n,r),1&n[0]}function unpack25519(r,n){var e;for(e=0;e<16;e++)r[e]=n[2*e]+(n[2*e+1]<<8);r[15]&=32767}function A(r,n,e){var t;for(t=0;t<16;t++)r[t]=n[t]+e[t]|0}function Z(r,n,e){var t;for(t=0;t<16;t++)r[t]=n[t]-e[t]|0}function M(r,n,e){var t,o,c=new Float64Array(31);for(t=0;t<31;t++)c[t]=0;for(t=0;t<16;t++)for(o=0;o<16;o++)c[t+o]+=n[t]*e[o];for(t=0;t<15;t++)c[t]+=38*c[t+16];for(t=0;t<16;t++)r[t]=c[t];car25519(r),car25519(r)}function S(r,n){M(r,n,n)}function inv25519(r,n){var e,t=gf();for(e=0;e<16;e++)t[e]=n[e];for(e=253;e>=0;e--)S(t,t),2!==e&&4!==e&&M(t,t,n);for(e=0;e<16;e++)r[e]=t[e]}function pow2523(r,n){var e,t=gf();for(e=0;e<16;e++)t[e]=n[e];for(e=250;e>=0;e--)S(t,t),1!==e&&M(t,t,n);for(e=0;e<16;e++)r[e]=t[e]}function crypto_scalarmult(r,n,e){var t,o,c=new Uint8Array(32),a=new Float64Array(80),_=gf(),y=gf(),i=gf(),s=gf(),u=gf(),f=gf();for(o=0;o<31;o++)c[o]=n[o];for(c[31]=127&n[31]|64,c[0]&=248,unpack25519(a,e),o=0;o<16;o++)y[o]=a[o],s[o]=_[o]=i[o]=0;for(_[0]=s[0]=1,o=254;o>=0;--o)sel25519(_,y,t=c[o>>>3]>>>(7&o)&1),sel25519(i,s,t),A(u,_,i),Z(_,_,i),A(i,y,s),Z(y,y,s),S(s,u),S(f,_),M(_,i,_),M(i,y,u),A(u,_,i),Z(_,_,i),S(y,_),Z(i,s,f),M(_,i,_121665),A(_,_,s),M(i,i,_),M(_,s,f),M(s,y,a),S(y,u),sel25519(_,y,t),sel25519(i,s,t);for(o=0;o<16;o++)a[o+16]=_[o],a[o+32]=i[o],a[o+48]=y[o],a[o+64]=s[o];var p=a.subarray(32),l=a.subarray(16);return inv25519(p,p),M(l,l,p),pack25519(r,l),0}function crypto_scalarmult_base(r,n){return crypto_scalarmult(r,n,_9)}function crypto_box_keypair(r,n){return randombytes(n,32),crypto_scalarmult_base(r,n)}function crypto_box_beforenm(r,n,e){var t=new Uint8Array(32);return crypto_scalarmult(t,e,n),crypto_core_hsalsa20(r,_0,t,sigma)}var crypto_box_afternm=crypto_secretbox,crypto_box_open_afternm=crypto_secretbox_open;function crypto_box(r,n,e,t,o,c){var a=new Uint8Array(32);return crypto_box_beforenm(a,o,c),crypto_box_afternm(r,n,e,t,a)}function crypto_box_open(r,n,e,t,o,c){var a=new Uint8Array(32);return crypto_box_beforenm(a,o,c),crypto_box_open_afternm(r,n,e,t,a)}function add64(){var r,n,e,t=0,o=0,c=0,a=0;for(e=0;e<arguments.length;e++)t+=65535&(r=arguments[e].lo),o+=r>>>16,c+=65535&(n=arguments[e].hi),a+=n>>>16;return new u64(65535&(c+=(o+=t>>>16)>>>16)|(a+=c>>>16)<<16,65535&t|o<<16)}function shr64(r,n){return new u64(r.hi>>>n,r.lo>>>n|r.hi<<32-n)}function xor64(){var r,n=0,e=0;for(r=0;r<arguments.length;r++)n^=arguments[r].lo,e^=arguments[r].hi;return new u64(e,n)}function R(r,n){var e,t,o=32-n;return n<32?(e=r.hi>>>n|r.lo<<o,t=r.lo>>>n|r.hi<<o):n<64&&(e=r.lo>>>n|r.hi<<o,t=r.hi>>>n|r.lo<<o),new u64(e,t)}function Ch(r,n,e){var t=r.hi&n.hi^~r.hi&e.hi,o=r.lo&n.lo^~r.lo&e.lo;return new u64(t,o)}function Maj(r,n,e){var t=r.hi&n.hi^r.hi&e.hi^n.hi&e.hi,o=r.lo&n.lo^r.lo&e.lo^n.lo&e.lo;return new u64(t,o)}function Sigma0(r){return xor64(R(r,28),R(r,34),R(r,39))}function Sigma1(r){return xor64(R(r,14),R(r,18),R(r,41))}function sigma0(r){return xor64(R(r,1),R(r,8),shr64(r,7))}function sigma1(r){return xor64(R(r,19),R(r,61),shr64(r,6))}var K=[new u64(1116352408,3609767458),new u64(1899447441,602891725),new u64(3049323471,3964484399),new u64(3921009573,2173295548),new u64(961987163,4081628472),new u64(1508970993,3053834265),new u64(2453635748,2937671579),new u64(2870763221,3664609560),new u64(3624381080,2734883394),new u64(310598401,1164996542),new u64(607225278,1323610764),new u64(1426881987,3590304994),new u64(1925078388,4068182383),new u64(2162078206,991336113),new u64(2614888103,633803317),new u64(3248222580,3479774868),new u64(3835390401,2666613458),new u64(4022224774,944711139),new u64(264347078,2341262773),new u64(604807628,2007800933),new u64(770255983,1495990901),new u64(1249150122,1856431235),new u64(1555081692,3175218132),new u64(1996064986,2198950837),new u64(2554220882,3999719339),new u64(2821834349,766784016),new u64(2952996808,2566594879),new u64(3210313671,3203337956),new u64(3336571891,1034457026),new u64(3584528711,2466948901),new u64(113926993,3758326383),new u64(338241895,168717936),new u64(666307205,1188179964),new u64(773529912,1546045734),new u64(1294757372,1522805485),new u64(1396182291,2643833823),new u64(1695183700,2343527390),new u64(1986661051,1014477480),new u64(2177026350,1206759142),new u64(2456956037,344077627),new u64(2730485921,1290863460),new u64(2820302411,3158454273),new u64(3259730800,3505952657),new u64(3345764771,106217008),new u64(3516065817,3606008344),new u64(3600352804,1432725776),new u64(4094571909,1467031594),new u64(275423344,851169720),new u64(430227734,3100823752),new u64(506948616,1363258195),new u64(659060556,3750685593),new u64(883997877,3785050280),new u64(958139571,3318307427),new u64(1322822218,3812723403),new u64(1537002063,2003034995),new u64(1747873779,3602036899),new u64(1955562222,1575990012),new u64(2024104815,1125592928),new u64(2227730452,2716904306),new u64(2361852424,442776044),new u64(2428436474,593698344),new u64(2756734187,3733110249),new u64(3204031479,2999351573),new u64(3329325298,3815920427),new u64(3391569614,3928383900),new u64(3515267271,566280711),new u64(3940187606,3454069534),new u64(4118630271,4000239992),new u64(116418474,1914138554),new u64(174292421,2731055270),new u64(289380356,3203993006),new u64(460393269,320620315),new u64(685471733,587496836),new u64(852142971,1086792851),new u64(1017036298,365543100),new u64(1126000580,2618297676),new u64(1288033470,3409855158),new u64(1501505948,4234509866),new u64(1607167915,987167468),new u64(1816402316,1246189591)];function crypto_hashblocks(r,n,e){var t,o,c,a=[],_=[],y=[],i=[];for(o=0;o<8;o++)a[o]=y[o]=dl64(r,8*o);for(var s=0;e>=128;){for(o=0;o<16;o++)i[o]=dl64(n,8*o+s);for(o=0;o<80;o++){for(c=0;c<8;c++)_[c]=y[c];for(t=add64(y[7],Sigma1(y[4]),Ch(y[4],y[5],y[6]),K[o],i[o%16]),_[7]=add64(t,Sigma0(y[0]),Maj(y[0],y[1],y[2])),_[3]=add64(_[3],t),c=0;c<8;c++)y[(c+1)%8]=_[c];if(o%16==15)for(c=0;c<16;c++)i[c]=add64(i[c],i[(c+9)%16],sigma0(i[(c+1)%16]),sigma1(i[(c+14)%16]))}for(o=0;o<8;o++)y[o]=add64(y[o],a[o]),a[o]=y[o];s+=128,e-=128}for(o=0;o<8;o++)ts64(r,8*o,a[o]);return e}var iv=new Uint8Array([106,9,230,103,243,188,201,8,187,103,174,133,132,202,167,59,60,110,243,114,254,148,248,43,165,79,245,58,95,29,54,241,81,14,82,127,173,230,130,209,155,5,104,140,43,62,108,31,31,131,217,171,251,65,189,107,91,224,205,25,19,126,33,121]);function crypto_hash(r,n,e){var t,o=new Uint8Array(64),c=new Uint8Array(256),a=e;for(t=0;t<64;t++)o[t]=iv[t];for(crypto_hashblocks(o,n,e),e%=128,t=0;t<256;t++)c[t]=0;for(t=0;t<e;t++)c[t]=n[a-e+t];for(c[e]=128,c[(e=256-128*(e<112?1:0))-9]=0,ts64(c,e-8,new u64(a/536870912|0,a<<3)),crypto_hashblocks(o,c,e),t=0;t<64;t++)r[t]=o[t];return 0}function add(r,n){var e=gf(),t=gf(),o=gf(),c=gf(),a=gf(),_=gf(),y=gf(),i=gf(),s=gf();Z(e,r[1],r[0]),Z(s,n[1],n[0]),M(e,e,s),A(t,r[0],r[1]),A(s,n[0],n[1]),M(t,t,s),M(o,r[3],n[3]),M(o,o,D2),M(c,r[2],n[2]),A(c,c,c),Z(a,t,e),Z(_,c,o),A(y,c,o),A(i,t,e),M(r[0],a,_),M(r[1],i,y),M(r[2],y,_),M(r[3],a,i)}function cswap(r,n,e){var t;for(t=0;t<4;t++)sel25519(r[t],n[t],e)}function pack(r,n){var e=gf(),t=gf(),o=gf();inv25519(o,n[2]),M(e,n[0],o),M(t,n[1],o),pack25519(r,t),r[31]^=par25519(e)<<7}function scalarmult(r,n,e){var t,o;for(set25519(r[0],gf0),set25519(r[1],gf1),set25519(r[2],gf1),set25519(r[3],gf0),o=255;o>=0;--o)cswap(r,n,t=e[o/8|0]>>(7&o)&1),add(n,r),add(r,r),cswap(r,n,t)}function scalarbase(r,n){var e=[gf(),gf(),gf(),gf()];set25519(e[0],X),set25519(e[1],Y),set25519(e[2],gf1),M(e[3],X,Y),scalarmult(r,e,n)}function crypto_sign_keypair(r,n,e){var t,o=new Uint8Array(64),c=[gf(),gf(),gf(),gf()];for(e||randombytes(n,32),crypto_hash(o,n,32),o[0]&=248,o[31]&=127,o[31]|=64,scalarbase(c,o),pack(r,c),t=0;t<32;t++)n[t+32]=r[t];return 0}var L=new Float64Array([237,211,245,92,26,99,18,88,214,156,247,162,222,249,222,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,16]);function modL(r,n){var e,t,o,c;for(t=63;t>=32;--t){for(e=0,o=t-32,c=t-12;o<c;++o)n[o]+=e-16*n[t]*L[o-(t-32)],e=Math.floor((n[o]+128)/256),n[o]-=256*e;n[o]+=e,n[t]=0}for(e=0,o=0;o<32;o++)n[o]+=e-(n[31]>>4)*L[o],e=n[o]>>8,n[o]&=255;for(o=0;o<32;o++)n[o]-=e*L[o];for(t=0;t<32;t++)n[t+1]+=n[t]>>8,r[t]=255&n[t]}function reduce(r){var n,e=new Float64Array(64);for(n=0;n<64;n++)e[n]=r[n];for(n=0;n<64;n++)r[n]=0;modL(r,e)}function crypto_sign(r,n,e,t){var o,c,a=new Uint8Array(64),_=new Uint8Array(64),y=new Uint8Array(64),i=new Float64Array(64),s=[gf(),gf(),gf(),gf()];crypto_hash(a,t,32),a[0]&=248,a[31]&=127,a[31]|=64;var u=e+64;for(o=0;o<e;o++)r[64+o]=n[o];for(o=0;o<32;o++)r[32+o]=a[32+o];for(crypto_hash(y,r.subarray(32),e+32),reduce(y),scalarbase(s,y),pack(r,s),o=32;o<64;o++)r[o]=t[o];for(crypto_hash(_,r,e+64),reduce(_),o=0;o<64;o++)i[o]=0;for(o=0;o<32;o++)i[o]=y[o];for(o=0;o<32;o++)for(c=0;c<32;c++)i[o+c]+=_[o]*a[c];return modL(r.subarray(32),i),u}function unpackneg(r,n){var e=gf(),t=gf(),o=gf(),c=gf(),a=gf(),_=gf(),y=gf();return set25519(r[2],gf1),unpack25519(r[1],n),S(o,r[1]),M(c,o,D),Z(o,o,r[2]),A(c,r[2],c),S(a,c),S(_,a),M(y,_,a),M(e,y,o),M(e,e,c),pow2523(e,e),M(e,e,o),M(e,e,c),M(e,e,c),M(r[0],e,c),S(t,r[0]),M(t,t,c),neq25519(t,o)&&M(r[0],r[0],I),S(t,r[0]),M(t,t,c),neq25519(t,o)?-1:(par25519(r[0])===n[31]>>7&&Z(r[0],gf0,r[0]),M(r[3],r[0],r[1]),0)}function crypto_sign_open(r,n,e,t){var o,c=new Uint8Array(32),a=new Uint8Array(64),_=[gf(),gf(),gf(),gf()],y=[gf(),gf(),gf(),gf()];if(e<64)return-1;if(unpackneg(y,t))return-1;for(o=0;o<e;o++)r[o]=n[o];for(o=0;o<32;o++)r[o+32]=t[o];if(crypto_hash(a,r,e),reduce(a),scalarmult(_,y,a),scalarbase(y,n.subarray(32)),add(_,y),pack(c,_),e-=64,crypto_verify_32(n,0,c,0)){for(o=0;o<e;o++)r[o]=0;return-1}for(o=0;o<e;o++)r[o]=n[o+64];return e}var crypto_secretbox_KEYBYTES=32,crypto_secretbox_NONCEBYTES=24,crypto_secretbox_ZEROBYTES=32,crypto_secretbox_BOXZEROBYTES=16,crypto_scalarmult_BYTES=32,crypto_scalarmult_SCALARBYTES=32,crypto_box_PUBLICKEYBYTES=32,crypto_box_SECRETKEYBYTES=32,crypto_box_BEFORENMBYTES=32,crypto_box_NONCEBYTES=crypto_secretbox_NONCEBYTES,crypto_box_ZEROBYTES=crypto_secretbox_ZEROBYTES,crypto_box_BOXZEROBYTES=crypto_secretbox_BOXZEROBYTES,crypto_sign_BYTES=64,crypto_sign_PUBLICKEYBYTES=32,crypto_sign_SECRETKEYBYTES=64,crypto_sign_SEEDBYTES=32,crypto_hash_BYTES=64;function checkLengths(r,n){if(r.length!==crypto_secretbox_KEYBYTES)throw new Error("bad key size");if(n.length!==crypto_secretbox_NONCEBYTES)throw new Error("bad nonce size")}function checkBoxLengths(r,n){if(r.length!==crypto_box_PUBLICKEYBYTES)throw new Error("bad public key size");if(n.length!==crypto_box_SECRETKEYBYTES)throw new Error("bad secret key size")}function checkArrayTypes(){for(var r=0;r<arguments.length;r++)if(!(arguments[r]instanceof Uint8Array))throw new TypeError("unexpected type, use Uint8Array")}function cleanup(r){for(var n=0;n<r.length;n++)r[n]=0}function validateBase64(r){if(!/^(?:[A-Za-z0-9+\/]{2}[A-Za-z0-9+\/]{2})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/.test(r))throw new TypeError("invalid encoding")}nacl.lowlevel={crypto_core_hsalsa20:crypto_core_hsalsa20,crypto_stream_xor:crypto_stream_xor,crypto_stream:crypto_stream,crypto_stream_salsa20_xor:crypto_stream_salsa20_xor,crypto_stream_salsa20:crypto_stream_salsa20,crypto_onetimeauth:crypto_onetimeauth,crypto_onetimeauth_verify:crypto_onetimeauth_verify,crypto_verify_16:crypto_verify_16,crypto_verify_32:crypto_verify_32,crypto_secretbox:crypto_secretbox,crypto_secretbox_open:crypto_secretbox_open,crypto_scalarmult:crypto_scalarmult,crypto_scalarmult_base:crypto_scalarmult_base,crypto_box_beforenm:crypto_box_beforenm,crypto_box_afternm:crypto_box_afternm,crypto_box:crypto_box,crypto_box_open:crypto_box_open,crypto_box_keypair:crypto_box_keypair,crypto_hash:crypto_hash,crypto_sign:crypto_sign,crypto_sign_keypair:crypto_sign_keypair,crypto_sign_open:crypto_sign_open,crypto_secretbox_KEYBYTES:crypto_secretbox_KEYBYTES,crypto_secretbox_NONCEBYTES:crypto_secretbox_NONCEBYTES,crypto_secretbox_ZEROBYTES:crypto_secretbox_ZEROBYTES,crypto_secretbox_BOXZEROBYTES:crypto_secretbox_BOXZEROBYTES,crypto_scalarmult_BYTES:crypto_scalarmult_BYTES,crypto_scalarmult_SCALARBYTES:crypto_scalarmult_SCALARBYTES,crypto_box_PUBLICKEYBYTES:crypto_box_PUBLICKEYBYTES,crypto_box_SECRETKEYBYTES:crypto_box_SECRETKEYBYTES,crypto_box_BEFORENMBYTES:crypto_box_BEFORENMBYTES,crypto_box_NONCEBYTES:crypto_box_NONCEBYTES,crypto_box_ZEROBYTES:crypto_box_ZEROBYTES,crypto_box_BOXZEROBYTES:crypto_box_BOXZEROBYTES,crypto_sign_BYTES:crypto_sign_BYTES,crypto_sign_PUBLICKEYBYTES:crypto_sign_PUBLICKEYBYTES,crypto_sign_SECRETKEYBYTES:crypto_sign_SECRETKEYBYTES,crypto_sign_SEEDBYTES:crypto_sign_SEEDBYTES,crypto_hash_BYTES:crypto_hash_BYTES,gf:gf,D:D,L:L,pack25519:pack25519,unpack25519:unpack25519,M:M,A:A,S:S,Z:Z,pow2523:pow2523,add:add,set25519:set25519,modL:modL,scalarmult:scalarmult,scalarbase:scalarbase},nacl.randomBytes=function(r){var n=new Uint8Array(r);return randombytes(n,r),n},nacl.secretbox=function(r,n,e){checkArrayTypes(r,n,e),checkLengths(e,n);for(var t=new Uint8Array(crypto_secretbox_ZEROBYTES+r.length),o=new Uint8Array(t.length),c=0;c<r.length;c++)t[c+crypto_secretbox_ZEROBYTES]=r[c];return crypto_secretbox(o,t,t.length,n,e),o.subarray(crypto_secretbox_BOXZEROBYTES)},nacl.secretbox.open=function(r,n,e){checkArrayTypes(r,n,e),checkLengths(e,n);for(var t=new Uint8Array(crypto_secretbox_BOXZEROBYTES+r.length),o=new Uint8Array(t.length),c=0;c<r.length;c++)t[c+crypto_secretbox_BOXZEROBYTES]=r[c];return t.length<32?null:0!==crypto_secretbox_open(o,t,t.length,n,e)?null:o.subarray(crypto_secretbox_ZEROBYTES)},nacl.secretbox.keyLength=crypto_secretbox_KEYBYTES,nacl.secretbox.nonceLength=crypto_secretbox_NONCEBYTES,nacl.secretbox.overheadLength=crypto_secretbox_BOXZEROBYTES,nacl.scalarMult=function(r,n){if(checkArrayTypes(r,n),r.length!==crypto_scalarmult_SCALARBYTES)throw new Error("bad n size");if(n.length!==crypto_scalarmult_BYTES)throw new Error("bad p size");var e=new Uint8Array(crypto_scalarmult_BYTES);return crypto_scalarmult(e,r,n),e},nacl.scalarMult.base=function(r){if(checkArrayTypes(r),r.length!==crypto_scalarmult_SCALARBYTES)throw new Error("bad n size");var n=new Uint8Array(crypto_scalarmult_BYTES);return crypto_scalarmult_base(n,r),n},nacl.scalarMult.scalarLength=crypto_scalarmult_SCALARBYTES,nacl.scalarMult.groupElementLength=crypto_scalarmult_BYTES,nacl.box=function(r,n,e,t){var o=nacl.box.before(e,t);return nacl.secretbox(r,n,o)},nacl.box.before=function(r,n){checkArrayTypes(r,n),checkBoxLengths(r,n);var e=new Uint8Array(crypto_box_BEFORENMBYTES);return crypto_box_beforenm(e,r,n),e},nacl.box.after=nacl.secretbox,nacl.box.open=function(r,n,e,t){var o=nacl.box.before(e,t);return nacl.secretbox.open(r,n,o)},nacl.box.open.after=nacl.secretbox.open,nacl.box.keyPair=function(){var r=new Uint8Array(crypto_box_PUBLICKEYBYTES),n=new Uint8Array(crypto_box_SECRETKEYBYTES);return crypto_box_keypair(r,n),{publicKey:r,secretKey:n}},nacl.box.keyPair.fromSecretKey=function(r){if(checkArrayTypes(r),r.length!==crypto_box_SECRETKEYBYTES)throw new Error("bad secret key size");var n=new Uint8Array(crypto_box_PUBLICKEYBYTES);return crypto_scalarmult_base(n,r),{publicKey:n,secretKey:new Uint8Array(r)}},nacl.box.publicKeyLength=crypto_box_PUBLICKEYBYTES,nacl.box.secretKeyLength=crypto_box_SECRETKEYBYTES,nacl.box.sharedKeyLength=crypto_box_BEFORENMBYTES,nacl.box.nonceLength=crypto_box_NONCEBYTES,nacl.box.overheadLength=nacl.secretbox.overheadLength,nacl.sign=function(r,n){if(checkArrayTypes(r,n),n.length!==crypto_sign_SECRETKEYBYTES)throw new Error("bad secret key size");var e=new Uint8Array(crypto_sign_BYTES+r.length);return crypto_sign(e,r,r.length,n),e},nacl.sign.open=function(r,n){if(checkArrayTypes(r,n),n.length!==crypto_sign_PUBLICKEYBYTES)throw new Error("bad public key size");var e=new Uint8Array(r.length),t=crypto_sign_open(e,r,r.length,n);if(t<0)return null;for(var o=new Uint8Array(t),c=0;c<o.length;c++)o[c]=e[c];return o},nacl.sign.detached=function(r,n){for(var e=nacl.sign(r,n),t=new Uint8Array(crypto_sign_BYTES),o=0;o<t.length;o++)t[o]=e[o];return t},nacl.sign.detached.verify=function(r,n,e){if(checkArrayTypes(r,n,e),n.length!==crypto_sign_BYTES)throw new Error("bad signature size");if(e.length!==crypto_sign_PUBLICKEYBYTES)throw new Error("bad public key size");var t,o=new Uint8Array(crypto_sign_BYTES+r.length),c=new Uint8Array(crypto_sign_BYTES+r.length);for(t=0;t<crypto_sign_BYTES;t++)o[t]=n[t];for(t=0;t<r.length;t++)o[t+crypto_sign_BYTES]=r[t];return crypto_sign_open(c,o,o.length,e)>=0},nacl.sign.keyPair=function(){var r=new Uint8Array(crypto_sign_PUBLICKEYBYTES),n=new Uint8Array(crypto_sign_SECRETKEYBYTES);return crypto_sign_keypair(r,n),{publicKey:r,secretKey:n}},nacl.sign.keyPair.fromSecretKey=function(r){if(checkArrayTypes(r),r.length!==crypto_sign_SECRETKEYBYTES)throw new Error("bad secret key size");for(var n=new Uint8Array(crypto_sign_PUBLICKEYBYTES),e=0;e<n.length;e++)n[e]=r[32+e];return{publicKey:n,secretKey:new Uint8Array(r)}},nacl.sign.keyPair.fromSeed=function(r){if(checkArrayTypes(r),r.length!==crypto_sign_SEEDBYTES)throw new Error("bad seed size");for(var n=new Uint8Array(crypto_sign_PUBLICKEYBYTES),e=new Uint8Array(crypto_sign_SECRETKEYBYTES),t=0;t<32;t++)e[t]=r[t];return crypto_sign_keypair(n,e,!0),{publicKey:n,secretKey:e}},nacl.sign.publicKeyLength=crypto_sign_PUBLICKEYBYTES,nacl.sign.secretKeyLength=crypto_sign_SECRETKEYBYTES,nacl.sign.seedLength=crypto_sign_SEEDBYTES,nacl.sign.signatureLength=crypto_sign_BYTES,nacl.hash=function(r){checkArrayTypes(r);var n=new Uint8Array(crypto_hash_BYTES);return crypto_hash(n,r,r.length),n},nacl.hash.hashLength=crypto_hash_BYTES,nacl.verify=function(r,n){return checkArrayTypes(r,n),0!==r.length&&0!==n.length&&(r.length===n.length&&0===vn(r,0,n,0,r.length))},nacl.setPRNG=function(r){randombytes=r},function(){var r="undefined"!=typeof self?self.crypto||self.msCrypto:null;if(r&&r.getRandomValues){nacl.setPRNG(function(n,e){var t,o=new Uint8Array(e);for(t=0;t<e;t+=65536)r.getRandomValues(o.subarray(t,t+Math.min(e-t,65536)));for(t=0;t<e;t++)n[t]=o[t];cleanup(o)})}else"undefined"!=typeof require&&(r=require("crypto"))&&r.randomBytes&&nacl.setPRNG(function(n,e){var t,o=r.randomBytes(e);for(t=0;t<e;t++)n[t]=o[t];cleanup(o)})}(),nacl.util={},nacl.util.decodeUTF8=function(r){if("string"!=typeof r)throw new TypeError("expected string");var n,e=unescape(encodeURIComponent(r)),t=new Uint8Array(e.length);for(n=0;n<e.length;n++)t[n]=e.charCodeAt(n);return t},nacl.util.encodeUTF8=function(r){var n,e=[];for(n=0;n<r.length;n++)e.push(String.fromCharCode(r[n]));return decodeURIComponent(escape(e.join("")))},"undefined"==typeof atob?void 0!==Buffer.from?(nacl.util.encodeBase64=function(r){return Buffer.from(r).toString("base64")},nacl.util.decodeBase64=function(r){return validateBase64(r),new Uint8Array(Array.prototype.slice.call(Buffer.from(r,"base64"),0))}):(nacl.util.encodeBase64=function(r){return new Buffer(r).toString("base64")},nacl.util.decodeBase64=function(r){return validateBase64(r),new Uint8Array(Array.prototype.slice.call(new Buffer(r,"base64"),0))}):(nacl.util.encodeBase64=function(r){var n,e=[],t=r.length;for(n=0;n<t;n++)e.push(String.fromCharCode(r[n]));return btoa(e.join(""))},nacl.util.decodeBase64=function(r){validateBase64(r);var n,e=atob(r),t=new Uint8Array(e.length);for(n=0;n<e.length;n++)t[n]=e.charCodeAt(n);return t});

//OYSTER DEPENDENCY LZ-STRING
//https://github.com/pieroxy/lz-string
let LZString=function(){var o=String.fromCharCode,r="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$",e={};function t(o,r){if(!e[o]){e[o]={};for(var n=0;n<o.length;n++)e[o][o.charAt(n)]=n}return e[o][r]}var s={compressToBase64:function(o){if(null==o)return"";var n=s._compress(o,6,function(o){return r.charAt(o)});switch(n.length%4){default:case 0:return n;case 1:return n+"===";case 2:return n+"==";case 3:return n+"="}},decompressFromBase64:function(o){return null==o?"":""==o?null:s._decompress(o.length,32,function(n){return t(r,o.charAt(n))})},compressToUTF16:function(r){return null==r?"":s._compress(r,15,function(r){return o(r+32)})+" "},decompressFromUTF16:function(o){return null==o?"":""==o?null:s._decompress(o.length,16384,function(r){return o.charCodeAt(r)-32})},compressToUint8Array:function(o){for(var r=s.compress(o),n=new Uint8Array(2*r.length),e=0,t=r.length;e<t;e++){var i=r.charCodeAt(e);n[2*e]=i>>>8,n[2*e+1]=i%256}return n},decompressFromUint8Array:function(r){if(null==r)return s.decompress(r);for(var n=new Array(r.length/2),e=0,t=n.length;e<t;e++)n[e]=256*r[2*e]+r[2*e+1];var i=[];return n.forEach(function(r){i.push(o(r))}),s.decompress(i.join(""))},compressToEncodedURIComponent:function(o){return null==o?"":s._compress(o,6,function(o){return n.charAt(o)})},decompressFromEncodedURIComponent:function(o){return null==o?"":""==o?null:(o=o.replace(/ /g,"+"),s._decompress(o.length,32,function(r){return t(n,o.charAt(r))}))},compress:function(r){return s._compress(r,16,function(r){return o(r)})},_compress:function(o,r,n){if(null==o)return"";var e,t,s,i={},p={},c="",a="",u="",l=2,f=3,h=2,d=[],m=0,v=0;for(s=0;s<o.length;s+=1)if(c=o.charAt(s),Object.prototype.hasOwnProperty.call(i,c)||(i[c]=f++,p[c]=!0),a=u+c,Object.prototype.hasOwnProperty.call(i,a))u=a;else{if(Object.prototype.hasOwnProperty.call(p,u)){if(u.charCodeAt(0)<256){for(e=0;e<h;e++)m<<=1,v==r-1?(v=0,d.push(n(m)),m=0):v++;for(t=u.charCodeAt(0),e=0;e<8;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}else{for(t=1,e=0;e<h;e++)m=m<<1|t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t=0;for(t=u.charCodeAt(0),e=0;e<16;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}0==--l&&(l=Math.pow(2,h),h++),delete p[u]}else for(t=i[u],e=0;e<h;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;0==--l&&(l=Math.pow(2,h),h++),i[a]=f++,u=String(c)}if(""!==u){if(Object.prototype.hasOwnProperty.call(p,u)){if(u.charCodeAt(0)<256){for(e=0;e<h;e++)m<<=1,v==r-1?(v=0,d.push(n(m)),m=0):v++;for(t=u.charCodeAt(0),e=0;e<8;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}else{for(t=1,e=0;e<h;e++)m=m<<1|t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t=0;for(t=u.charCodeAt(0),e=0;e<16;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}0==--l&&(l=Math.pow(2,h),h++),delete p[u]}else for(t=i[u],e=0;e<h;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;0==--l&&(l=Math.pow(2,h),h++)}for(t=2,e=0;e<h;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;for(;;){if(m<<=1,v==r-1){d.push(n(m));break}v++}return d.join("")},decompress:function(o){return null==o?"":""==o?null:s._decompress(o.length,32768,function(r){return o.charCodeAt(r)})},_decompress:function(r,n,e){var t,s,i,p,c,a,u,l=[],f=4,h=4,d=3,m="",v=[],w={val:e(0),position:n,index:1};for(t=0;t<3;t+=1)l[t]=t;for(i=0,c=Math.pow(2,2),a=1;a!=c;)p=w.val&w.position,w.position>>=1,0==w.position&&(w.position=n,w.val=e(w.index++)),i|=(p>0?1:0)*a,a<<=1;switch(i){case 0:for(i=0,c=Math.pow(2,8),a=1;a!=c;)p=w.val&w.position,w.position>>=1,0==w.position&&(w.position=n,w.val=e(w.index++)),i|=(p>0?1:0)*a,a<<=1;u=o(i);break;case 1:for(i=0,c=Math.pow(2,16),a=1;a!=c;)p=w.val&w.position,w.position>>=1,0==w.position&&(w.position=n,w.val=e(w.index++)),i|=(p>0?1:0)*a,a<<=1;u=o(i);break;case 2:return""}for(l[3]=u,s=u,v.push(u);;){if(w.index>r)return"";for(i=0,c=Math.pow(2,d),a=1;a!=c;)p=w.val&w.position,w.position>>=1,0==w.position&&(w.position=n,w.val=e(w.index++)),i|=(p>0?1:0)*a,a<<=1;switch(u=i){case 0:for(i=0,c=Math.pow(2,8),a=1;a!=c;)p=w.val&w.position,w.position>>=1,0==w.position&&(w.position=n,w.val=e(w.index++)),i|=(p>0?1:0)*a,a<<=1;l[h++]=o(i),u=h-1,f--;break;case 1:for(i=0,c=Math.pow(2,16),a=1;a!=c;)p=w.val&w.position,w.position>>=1,0==w.position&&(w.position=n,w.val=e(w.index++)),i|=(p>0?1:0)*a,a<<=1;l[h++]=o(i),u=h-1,f--;break;case 2:return v.join("")}if(0==f&&(f=Math.pow(2,d),d++),l[u])m=l[u];else{if(u!==h)return null;m=s+s.charAt(0)}v.push(m),l[h++]=s+m.charAt(0),s=m,0==--f&&(f=Math.pow(2,d),d++)}}};return s}();

//OYSTER DEPENDENCY SIMPLE-PEER
//https://github.com/feross/simple-peer
(function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{window?"undefined"==typeof global?"undefined"==typeof self?this:self:global:window,SimplePeer=e()}})(function(){var t=Math.floor,n=Math.abs,r=Math.pow;return function(){function d(s,e,n){function t(o,i){if(!e[o]){if(!s[o]){var l="function"==typeof require&&require;if(!i&&l)return l(o,!0);if(r)return r(o,!0);var c=new Error("Cannot find module '"+o+"'");throw c.code="MODULE_NOT_FOUND",c}var a=e[o]={exports:{}};s[o][0].call(a.exports,function(e){var r=s[o][1][e];return t(r||e)},a,a.exports,d,s,e,n)}return e[o].exports}for(var r="function"==typeof require&&require,a=0;a<n.length;a++)t(n[a]);return t}return d}()({1:[function(e,t,n){'use strict';function r(e){var t=e.length;if(0<t%4)throw new Error("Invalid string. Length must be a multiple of 4");var n=e.indexOf("=");-1===n&&(n=t);var r=n===t?0:4-n%4;return[n,r]}function a(e,t,n){return 3*(t+n)/4-n}function o(e){var t,n,o=r(e),d=o[0],s=o[1],l=new p(a(e,d,s)),c=0,f=0<s?d-4:d;for(n=0;n<f;n+=4)t=u[e.charCodeAt(n)]<<18|u[e.charCodeAt(n+1)]<<12|u[e.charCodeAt(n+2)]<<6|u[e.charCodeAt(n+3)],l[c++]=255&t>>16,l[c++]=255&t>>8,l[c++]=255&t;return 2===s&&(t=u[e.charCodeAt(n)]<<2|u[e.charCodeAt(n+1)]>>4,l[c++]=255&t),1===s&&(t=u[e.charCodeAt(n)]<<10|u[e.charCodeAt(n+1)]<<4|u[e.charCodeAt(n+2)]>>2,l[c++]=255&t>>8,l[c++]=255&t),l}function d(e){return c[63&e>>18]+c[63&e>>12]+c[63&e>>6]+c[63&e]}function s(e,t,n){for(var r,a=[],o=t;o<n;o+=3)r=(16711680&e[o]<<16)+(65280&e[o+1]<<8)+(255&e[o+2]),a.push(d(r));return a.join("")}function l(e){for(var t,n=e.length,r=n%3,a=[],o=16383,d=0,l=n-r;d<l;d+=o)a.push(s(e,d,d+o>l?l:d+o));return 1===r?(t=e[n-1],a.push(c[t>>2]+c[63&t<<4]+"==")):2===r&&(t=(e[n-2]<<8)+e[n-1],a.push(c[t>>10]+c[63&t>>4]+c[63&t<<2]+"=")),a.join("")}n.byteLength=function(e){var t=r(e),n=t[0],a=t[1];return 3*(n+a)/4-a},n.toByteArray=o,n.fromByteArray=l;for(var c=[],u=[],p="undefined"==typeof Uint8Array?Array:Uint8Array,f="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",g=0,h=f.length;g<h;++g)c[g]=f[g],u[f.charCodeAt(g)]=g;u[45]=62,u[95]=63},{}],2:[function(){},{}],3:[function(e,t,n){(function(){'use strict';var Y=String.fromCharCode,z=Math.min;function a(e){if(2147483647<e)throw new RangeError("The value \""+e+"\" is invalid for option \"size\"");var n=new Uint8Array(e);return Object.setPrototypeOf(n,t.prototype),n}function t(e,n,r){if("number"==typeof e){if("string"==typeof n)throw new TypeError("The \"string\" argument must be of type string. Received type number");return s(e)}return o(e,n,r)}function o(e,n,r){if("string"==typeof e)return l(e,n);if(ArrayBuffer.isView(e))return c(e);if(null==e)throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof e);if(V(e,ArrayBuffer)||e&&V(e.buffer,ArrayBuffer))return u(e,n,r);if("number"==typeof e)throw new TypeError("The \"value\" argument must not be of type number. Received type number");var a=e.valueOf&&e.valueOf();if(null!=a&&a!==e)return t.from(a,n,r);var o=p(e);if(o)return o;if("undefined"!=typeof Symbol&&null!=Symbol.toPrimitive&&"function"==typeof e[Symbol.toPrimitive])return t.from(e[Symbol.toPrimitive]("string"),n,r);throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof e)}function i(e){if("number"!=typeof e)throw new TypeError("\"size\" argument must be of type number");else if(0>e)throw new RangeError("The value \""+e+"\" is invalid for option \"size\"")}function d(e,t,n){return i(e),0>=e?a(e):void 0===t?a(e):"string"==typeof n?a(e).fill(t,n):a(e).fill(t)}function s(e){return i(e),a(0>e?0:0|f(e))}function l(e,n){if(("string"!=typeof n||""===n)&&(n="utf8"),!t.isEncoding(n))throw new TypeError("Unknown encoding: "+n);var r=0|h(e,n),o=a(r),i=o.write(e,n);return i!==r&&(o=o.slice(0,i)),o}function c(e){for(var t=0>e.length?0:0|f(e.length),n=a(t),r=0;r<t;r+=1)n[r]=255&e[r];return n}function u(e,n,r){if(0>n||e.byteLength<n)throw new RangeError("\"offset\" is outside of buffer bounds");if(e.byteLength<n+(r||0))throw new RangeError("\"length\" is outside of buffer bounds");var a;return a=void 0===n&&void 0===r?new Uint8Array(e):void 0===r?new Uint8Array(e,n):new Uint8Array(e,n,r),Object.setPrototypeOf(a,t.prototype),a}function p(e){if(t.isBuffer(e)){var n=0|f(e.length),r=a(n);return 0===r.length?r:(e.copy(r,0,0,n),r)}return void 0===e.length?"Buffer"===e.type&&Array.isArray(e.data)?c(e.data):void 0:"number"!=typeof e.length||G(e.length)?a(0):c(e)}function f(e){if(e>=2147483647)throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+2147483647 .toString(16)+" bytes");return 0|e}function g(e){return+e!=e&&(e=0),t.alloc(+e)}function h(e,n){if(t.isBuffer(e))return e.length;if(ArrayBuffer.isView(e)||V(e,ArrayBuffer))return e.byteLength;if("string"!=typeof e)throw new TypeError("The \"string\" argument must be one of type string, Buffer, or ArrayBuffer. Received type "+typeof e);var r=e.length,a=2<arguments.length&&!0===arguments[2];if(!a&&0===r)return 0;for(var o=!1;;)switch(n){case"ascii":case"latin1":case"binary":return r;case"utf8":case"utf-8":return U(e).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return 2*r;case"hex":return r>>>1;case"base64":return q(e).length;default:if(o)return a?-1:U(e).length;n=(""+n).toLowerCase(),o=!0;}}function _(e,t,n){var r=!1;if((void 0===t||0>t)&&(t=0),t>this.length)return"";if((void 0===n||n>this.length)&&(n=this.length),0>=n)return"";if(n>>>=0,t>>>=0,n<=t)return"";for(e||(e="utf8");;)switch(e){case"hex":return N(this,t,n);case"utf8":case"utf-8":return v(this,t,n);case"ascii":return A(this,t,n);case"latin1":case"binary":return x(this,t,n);case"base64":return k(this,t,n);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return I(this,t,n);default:if(r)throw new TypeError("Unknown encoding: "+e);e=(e+"").toLowerCase(),r=!0;}}function m(e,t,n){var r=e[t];e[t]=e[n],e[n]=r}function b(e,n,r,a,o){if(0===e.length)return-1;if("string"==typeof r?(a=r,r=0):2147483647<r?r=2147483647:-2147483648>r&&(r=-2147483648),r=+r,G(r)&&(r=o?0:e.length-1),0>r&&(r=e.length+r),r>=e.length){if(o)return-1;r=e.length-1}else if(0>r)if(o)r=0;else return-1;if("string"==typeof n&&(n=t.from(n,a)),t.isBuffer(n))return 0===n.length?-1:y(e,n,r,a,o);if("number"==typeof n)return n&=255,"function"==typeof Uint8Array.prototype.indexOf?o?Uint8Array.prototype.indexOf.call(e,n,r):Uint8Array.prototype.lastIndexOf.call(e,n,r):y(e,[n],r,a,o);throw new TypeError("val must be string, number or Buffer")}function y(e,t,n,r,a){function o(e,t){return 1===d?e[t]:e.readUInt16BE(t*d)}var d=1,s=e.length,l=t.length;if(void 0!==r&&(r=(r+"").toLowerCase(),"ucs2"===r||"ucs-2"===r||"utf16le"===r||"utf-16le"===r)){if(2>e.length||2>t.length)return-1;d=2,s/=2,l/=2,n/=2}var c;if(a){var u=-1;for(c=n;c<s;c++)if(o(e,c)!==o(t,-1===u?0:c-u))-1!==u&&(c-=c-u),u=-1;else if(-1===u&&(u=c),c-u+1===l)return u*d}else for(n+l>s&&(n=s-l),c=n;0<=c;c--){for(var p=!0,f=0;f<l;f++)if(o(e,c+f)!==o(t,f)){p=!1;break}if(p)return c}return-1}function C(e,t,n,r){n=+n||0;var a=e.length-n;r?(r=+r,r>a&&(r=a)):r=a;var o=t.length;r>o/2&&(r=o/2);for(var d,s=0;s<r;++s){if(d=parseInt(t.substr(2*s,2),16),G(d))return s;e[n+s]=d}return s}function w(e,t,n,r){return H(U(t,e.length-n),e,n,r)}function R(e,t,n,r){return H(j(t),e,n,r)}function E(e,t,n,r){return R(e,t,n,r)}function S(e,t,n,r){return H(q(t),e,n,r)}function T(e,t,n,r){return H(W(t,e.length-n),e,n,r)}function k(e,t,n){return 0===t&&n===e.length?K.fromByteArray(e):K.fromByteArray(e.slice(t,n))}function v(e,t,n){n=z(e.length,n);for(var r=[],a=t;a<n;){var o=e[a],d=null,s=239<o?4:223<o?3:191<o?2:1;if(a+s<=n){var l,c,u,p;1===s?128>o&&(d=o):2===s?(l=e[a+1],128==(192&l)&&(p=(31&o)<<6|63&l,127<p&&(d=p))):3===s?(l=e[a+1],c=e[a+2],128==(192&l)&&128==(192&c)&&(p=(15&o)<<12|(63&l)<<6|63&c,2047<p&&(55296>p||57343<p)&&(d=p))):4===s?(l=e[a+1],c=e[a+2],u=e[a+3],128==(192&l)&&128==(192&c)&&128==(192&u)&&(p=(15&o)<<18|(63&l)<<12|(63&c)<<6|63&u,65535<p&&1114112>p&&(d=p))):void 0}null===d?(d=65533,s=1):65535<d&&(d-=65536,r.push(55296|1023&d>>>10),d=56320|1023&d),r.push(d),a+=s}return L(r)}function L(e){var t=e.length;if(t<=4096)return Y.apply(String,e);for(var n="",r=0;r<t;)n+=Y.apply(String,e.slice(r,r+=4096));return n}function A(e,t,n){var r="";n=z(e.length,n);for(var a=t;a<n;++a)r+=Y(127&e[a]);return r}function x(e,t,n){var r="";n=z(e.length,n);for(var a=t;a<n;++a)r+=Y(e[a]);return r}function N(e,t,n){var r=e.length;(!t||0>t)&&(t=0),(!n||0>n||n>r)&&(n=r);for(var a="",o=t;o<n;++o)a+=Z[e[o]];return a}function I(e,t,n){for(var r=e.slice(t,n),a="",o=0;o<r.length;o+=2)a+=Y(r[o]+256*r[o+1]);return a}function P(e,t,n){if(0!=e%1||0>e)throw new RangeError("offset is not uint");if(e+t>n)throw new RangeError("Trying to access beyond buffer length")}function M(e,n,r,a,o,i){if(!t.isBuffer(e))throw new TypeError("\"buffer\" argument must be a Buffer instance");if(n>o||n<i)throw new RangeError("\"value\" argument is out of bounds");if(r+a>e.length)throw new RangeError("Index out of range")}function F(e,t,n,r){if(n+r>e.length)throw new RangeError("Index out of range");if(0>n)throw new RangeError("Index out of range")}function B(e,t,n,r,a){return t=+t,n>>>=0,a||F(e,t,n,4,34028234663852886e22,-34028234663852886e22),X.write(e,t,n,r,23,4),n+4}function O(e,t,n,r,a){return t=+t,n>>>=0,a||F(e,t,n,8,17976931348623157e292,-17976931348623157e292),X.write(e,t,n,r,52,8),n+8}function D(e){if(e=e.split("=")[0],e=e.trim().replace(J,""),2>e.length)return"";for(;0!=e.length%4;)e+="=";return e}function U(e,t){t=t||1/0;for(var n,r=e.length,a=null,o=[],d=0;d<r;++d){if(n=e.charCodeAt(d),55295<n&&57344>n){if(!a){if(56319<n){-1<(t-=3)&&o.push(239,191,189);continue}else if(d+1===r){-1<(t-=3)&&o.push(239,191,189);continue}a=n;continue}if(56320>n){-1<(t-=3)&&o.push(239,191,189),a=n;continue}n=(a-55296<<10|n-56320)+65536}else a&&-1<(t-=3)&&o.push(239,191,189);if(a=null,128>n){if(0>(t-=1))break;o.push(n)}else if(2048>n){if(0>(t-=2))break;o.push(192|n>>6,128|63&n)}else if(65536>n){if(0>(t-=3))break;o.push(224|n>>12,128|63&n>>6,128|63&n)}else if(1114112>n){if(0>(t-=4))break;o.push(240|n>>18,128|63&n>>12,128|63&n>>6,128|63&n)}else throw new Error("Invalid code point")}return o}function j(e){for(var t=[],n=0;n<e.length;++n)t.push(255&e.charCodeAt(n));return t}function W(e,t){for(var n,r,a,o=[],d=0;d<e.length&&!(0>(t-=2));++d)n=e.charCodeAt(d),r=n>>8,a=n%256,o.push(a),o.push(r);return o}function q(e){return K.toByteArray(D(e))}function H(e,t,n,r){for(var a=0;a<r&&!(a+n>=t.length||a>=e.length);++a)t[a+n]=e[a];return a}function V(e,t){return e instanceof t||null!=e&&null!=e.constructor&&null!=e.constructor.name&&e.constructor.name===t.name}function G(e){return e!==e}var K=e("base64-js"),X=e("ieee754"),$="function"==typeof Symbol&&"function"==typeof Symbol.for?Symbol.for("nodejs.util.inspect.custom"):null;n.Buffer=t,n.SlowBuffer=g,n.INSPECT_MAX_BYTES=50;n.kMaxLength=2147483647,t.TYPED_ARRAY_SUPPORT=function(){try{var e=new Uint8Array(1),t={foo:function(){return 42}};return Object.setPrototypeOf(t,Uint8Array.prototype),Object.setPrototypeOf(e,t),42===e.foo()}catch(t){return!1}}(),t.TYPED_ARRAY_SUPPORT||"undefined"==typeof console||"function"!=typeof console.error||console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."),Object.defineProperty(t.prototype,"parent",{enumerable:!0,get:function(){return t.isBuffer(this)?this.buffer:void 0}}),Object.defineProperty(t.prototype,"offset",{enumerable:!0,get:function(){return t.isBuffer(this)?this.byteOffset:void 0}}),"undefined"!=typeof Symbol&&null!=Symbol.species&&t[Symbol.species]===t&&Object.defineProperty(t,Symbol.species,{value:null,configurable:!0,enumerable:!1,writable:!1}),t.poolSize=8192,t.from=function(e,t,n){return o(e,t,n)},Object.setPrototypeOf(t.prototype,Uint8Array.prototype),Object.setPrototypeOf(t,Uint8Array),t.alloc=function(e,t,n){return d(e,t,n)},t.allocUnsafe=function(e){return s(e)},t.allocUnsafeSlow=function(e){return s(e)},t.isBuffer=function(e){return null!=e&&!0===e._isBuffer&&e!==t.prototype},t.compare=function(e,n){if(V(e,Uint8Array)&&(e=t.from(e,e.offset,e.byteLength)),V(n,Uint8Array)&&(n=t.from(n,n.offset,n.byteLength)),!t.isBuffer(e)||!t.isBuffer(n))throw new TypeError("The \"buf1\", \"buf2\" arguments must be one of type Buffer or Uint8Array");if(e===n)return 0;for(var r=e.length,o=n.length,d=0,s=z(r,o);d<s;++d)if(e[d]!==n[d]){r=e[d],o=n[d];break}return r<o?-1:o<r?1:0},t.isEncoding=function(e){switch((e+"").toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1;}},t.concat=function(e,n){if(!Array.isArray(e))throw new TypeError("\"list\" argument must be an Array of Buffers");if(0===e.length)return t.alloc(0);var r;if(n===void 0)for(n=0,r=0;r<e.length;++r)n+=e[r].length;var a=t.allocUnsafe(n),o=0;for(r=0;r<e.length;++r){var d=e[r];if(V(d,Uint8Array)&&(d=t.from(d)),!t.isBuffer(d))throw new TypeError("\"list\" argument must be an Array of Buffers");d.copy(a,o),o+=d.length}return a},t.byteLength=h,t.prototype._isBuffer=!0,t.prototype.swap16=function(){var e=this.length;if(0!=e%2)throw new RangeError("Buffer size must be a multiple of 16-bits");for(var t=0;t<e;t+=2)m(this,t,t+1);return this},t.prototype.swap32=function(){var e=this.length;if(0!=e%4)throw new RangeError("Buffer size must be a multiple of 32-bits");for(var t=0;t<e;t+=4)m(this,t,t+3),m(this,t+1,t+2);return this},t.prototype.swap64=function(){var e=this.length;if(0!=e%8)throw new RangeError("Buffer size must be a multiple of 64-bits");for(var t=0;t<e;t+=8)m(this,t,t+7),m(this,t+1,t+6),m(this,t+2,t+5),m(this,t+3,t+4);return this},t.prototype.toString=function(){var e=this.length;return 0===e?"":0===arguments.length?v(this,0,e):_.apply(this,arguments)},t.prototype.toLocaleString=t.prototype.toString,t.prototype.equals=function(e){if(!t.isBuffer(e))throw new TypeError("Argument must be a Buffer");return this===e||0===t.compare(this,e)},t.prototype.inspect=function(){var e="",t=n.INSPECT_MAX_BYTES;return e=this.toString("hex",0,t).replace(/(.{2})/g,"$1 ").trim(),this.length>t&&(e+=" ... "),"<Buffer "+e+">"},$&&(t.prototype[$]=t.prototype.inspect),t.prototype.compare=function(e,n,r,a,o){if(V(e,Uint8Array)&&(e=t.from(e,e.offset,e.byteLength)),!t.isBuffer(e))throw new TypeError("The \"target\" argument must be one of type Buffer or Uint8Array. Received type "+typeof e);if(void 0===n&&(n=0),void 0===r&&(r=e?e.length:0),void 0===a&&(a=0),void 0===o&&(o=this.length),0>n||r>e.length||0>a||o>this.length)throw new RangeError("out of range index");if(a>=o&&n>=r)return 0;if(a>=o)return-1;if(n>=r)return 1;if(n>>>=0,r>>>=0,a>>>=0,o>>>=0,this===e)return 0;for(var d=o-a,s=r-n,l=z(d,s),c=this.slice(a,o),u=e.slice(n,r),p=0;p<l;++p)if(c[p]!==u[p]){d=c[p],s=u[p];break}return d<s?-1:s<d?1:0},t.prototype.includes=function(e,t,n){return-1!==this.indexOf(e,t,n)},t.prototype.indexOf=function(e,t,n){return b(this,e,t,n,!0)},t.prototype.lastIndexOf=function(e,t,n){return b(this,e,t,n,!1)},t.prototype.write=function(e,t,n,r){if(void 0===t)r="utf8",n=this.length,t=0;else if(void 0===n&&"string"==typeof t)r=t,n=this.length,t=0;else if(isFinite(t))t>>>=0,isFinite(n)?(n>>>=0,void 0===r&&(r="utf8")):(r=n,n=void 0);else throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");var a=this.length-t;if((void 0===n||n>a)&&(n=a),0<e.length&&(0>n||0>t)||t>this.length)throw new RangeError("Attempt to write outside buffer bounds");r||(r="utf8");for(var o=!1;;)switch(r){case"hex":return C(this,e,t,n);case"utf8":case"utf-8":return w(this,e,t,n);case"ascii":return R(this,e,t,n);case"latin1":case"binary":return E(this,e,t,n);case"base64":return S(this,e,t,n);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return T(this,e,t,n);default:if(o)throw new TypeError("Unknown encoding: "+r);r=(""+r).toLowerCase(),o=!0;}},t.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};t.prototype.slice=function(e,n){var r=this.length;e=~~e,n=void 0===n?r:~~n,0>e?(e+=r,0>e&&(e=0)):e>r&&(e=r),0>n?(n+=r,0>n&&(n=0)):n>r&&(n=r),n<e&&(n=e);var a=this.subarray(e,n);return Object.setPrototypeOf(a,t.prototype),a},t.prototype.readUIntLE=function(e,t,n){e>>>=0,t>>>=0,n||P(e,t,this.length);for(var r=this[e],a=1,o=0;++o<t&&(a*=256);)r+=this[e+o]*a;return r},t.prototype.readUIntBE=function(e,t,n){e>>>=0,t>>>=0,n||P(e,t,this.length);for(var r=this[e+--t],a=1;0<t&&(a*=256);)r+=this[e+--t]*a;return r},t.prototype.readUInt8=function(e,t){return e>>>=0,t||P(e,1,this.length),this[e]},t.prototype.readUInt16LE=function(e,t){return e>>>=0,t||P(e,2,this.length),this[e]|this[e+1]<<8},t.prototype.readUInt16BE=function(e,t){return e>>>=0,t||P(e,2,this.length),this[e]<<8|this[e+1]},t.prototype.readUInt32LE=function(e,t){return e>>>=0,t||P(e,4,this.length),(this[e]|this[e+1]<<8|this[e+2]<<16)+16777216*this[e+3]},t.prototype.readUInt32BE=function(e,t){return e>>>=0,t||P(e,4,this.length),16777216*this[e]+(this[e+1]<<16|this[e+2]<<8|this[e+3])},t.prototype.readIntLE=function(e,t,n){e>>>=0,t>>>=0,n||P(e,t,this.length);for(var a=this[e],o=1,d=0;++d<t&&(o*=256);)a+=this[e+d]*o;return o*=128,a>=o&&(a-=r(2,8*t)),a},t.prototype.readIntBE=function(e,t,n){e>>>=0,t>>>=0,n||P(e,t,this.length);for(var a=t,o=1,d=this[e+--a];0<a&&(o*=256);)d+=this[e+--a]*o;return o*=128,d>=o&&(d-=r(2,8*t)),d},t.prototype.readInt8=function(e,t){return e>>>=0,t||P(e,1,this.length),128&this[e]?-1*(255-this[e]+1):this[e]},t.prototype.readInt16LE=function(e,t){e>>>=0,t||P(e,2,this.length);var n=this[e]|this[e+1]<<8;return 32768&n?4294901760|n:n},t.prototype.readInt16BE=function(e,t){e>>>=0,t||P(e,2,this.length);var n=this[e+1]|this[e]<<8;return 32768&n?4294901760|n:n},t.prototype.readInt32LE=function(e,t){return e>>>=0,t||P(e,4,this.length),this[e]|this[e+1]<<8|this[e+2]<<16|this[e+3]<<24},t.prototype.readInt32BE=function(e,t){return e>>>=0,t||P(e,4,this.length),this[e]<<24|this[e+1]<<16|this[e+2]<<8|this[e+3]},t.prototype.readFloatLE=function(e,t){return e>>>=0,t||P(e,4,this.length),X.read(this,e,!0,23,4)},t.prototype.readFloatBE=function(e,t){return e>>>=0,t||P(e,4,this.length),X.read(this,e,!1,23,4)},t.prototype.readDoubleLE=function(e,t){return e>>>=0,t||P(e,8,this.length),X.read(this,e,!0,52,8)},t.prototype.readDoubleBE=function(e,t){return e>>>=0,t||P(e,8,this.length),X.read(this,e,!1,52,8)},t.prototype.writeUIntLE=function(e,t,n,a){if(e=+e,t>>>=0,n>>>=0,!a){var o=r(2,8*n)-1;M(this,e,t,n,o,0)}var d=1,s=0;for(this[t]=255&e;++s<n&&(d*=256);)this[t+s]=255&e/d;return t+n},t.prototype.writeUIntBE=function(e,t,n,a){if(e=+e,t>>>=0,n>>>=0,!a){var o=r(2,8*n)-1;M(this,e,t,n,o,0)}var d=n-1,s=1;for(this[t+d]=255&e;0<=--d&&(s*=256);)this[t+d]=255&e/s;return t+n},t.prototype.writeUInt8=function(e,t,n){return e=+e,t>>>=0,n||M(this,e,t,1,255,0),this[t]=255&e,t+1},t.prototype.writeUInt16LE=function(e,t,n){return e=+e,t>>>=0,n||M(this,e,t,2,65535,0),this[t]=255&e,this[t+1]=e>>>8,t+2},t.prototype.writeUInt16BE=function(e,t,n){return e=+e,t>>>=0,n||M(this,e,t,2,65535,0),this[t]=e>>>8,this[t+1]=255&e,t+2},t.prototype.writeUInt32LE=function(e,t,n){return e=+e,t>>>=0,n||M(this,e,t,4,4294967295,0),this[t+3]=e>>>24,this[t+2]=e>>>16,this[t+1]=e>>>8,this[t]=255&e,t+4},t.prototype.writeUInt32BE=function(e,t,n){return e=+e,t>>>=0,n||M(this,e,t,4,4294967295,0),this[t]=e>>>24,this[t+1]=e>>>16,this[t+2]=e>>>8,this[t+3]=255&e,t+4},t.prototype.writeIntLE=function(e,t,n,a){if(e=+e,t>>>=0,!a){var o=r(2,8*n-1);M(this,e,t,n,o-1,-o)}var d=0,s=1,l=0;for(this[t]=255&e;++d<n&&(s*=256);)0>e&&0===l&&0!==this[t+d-1]&&(l=1),this[t+d]=255&(e/s>>0)-l;return t+n},t.prototype.writeIntBE=function(e,t,n,a){if(e=+e,t>>>=0,!a){var o=r(2,8*n-1);M(this,e,t,n,o-1,-o)}var d=n-1,s=1,l=0;for(this[t+d]=255&e;0<=--d&&(s*=256);)0>e&&0===l&&0!==this[t+d+1]&&(l=1),this[t+d]=255&(e/s>>0)-l;return t+n},t.prototype.writeInt8=function(e,t,n){return e=+e,t>>>=0,n||M(this,e,t,1,127,-128),0>e&&(e=255+e+1),this[t]=255&e,t+1},t.prototype.writeInt16LE=function(e,t,n){return e=+e,t>>>=0,n||M(this,e,t,2,32767,-32768),this[t]=255&e,this[t+1]=e>>>8,t+2},t.prototype.writeInt16BE=function(e,t,n){return e=+e,t>>>=0,n||M(this,e,t,2,32767,-32768),this[t]=e>>>8,this[t+1]=255&e,t+2},t.prototype.writeInt32LE=function(e,t,n){return e=+e,t>>>=0,n||M(this,e,t,4,2147483647,-2147483648),this[t]=255&e,this[t+1]=e>>>8,this[t+2]=e>>>16,this[t+3]=e>>>24,t+4},t.prototype.writeInt32BE=function(e,t,n){return e=+e,t>>>=0,n||M(this,e,t,4,2147483647,-2147483648),0>e&&(e=4294967295+e+1),this[t]=e>>>24,this[t+1]=e>>>16,this[t+2]=e>>>8,this[t+3]=255&e,t+4},t.prototype.writeFloatLE=function(e,t,n){return B(this,e,t,!0,n)},t.prototype.writeFloatBE=function(e,t,n){return B(this,e,t,!1,n)},t.prototype.writeDoubleLE=function(e,t,n){return O(this,e,t,!0,n)},t.prototype.writeDoubleBE=function(e,t,n){return O(this,e,t,!1,n)},t.prototype.copy=function(e,n,r,a){if(!t.isBuffer(e))throw new TypeError("argument should be a Buffer");if(r||(r=0),a||0===a||(a=this.length),n>=e.length&&(n=e.length),n||(n=0),0<a&&a<r&&(a=r),a===r)return 0;if(0===e.length||0===this.length)return 0;if(0>n)throw new RangeError("targetStart out of bounds");if(0>r||r>=this.length)throw new RangeError("Index out of range");if(0>a)throw new RangeError("sourceEnd out of bounds");a>this.length&&(a=this.length),e.length-n<a-r&&(a=e.length-n+r);var o=a-r;if(this===e&&"function"==typeof Uint8Array.prototype.copyWithin)this.copyWithin(n,r,a);else if(this===e&&r<n&&n<a)for(var d=o-1;0<=d;--d)e[d+n]=this[d+r];else Uint8Array.prototype.set.call(e,this.subarray(r,a),n);return o},t.prototype.fill=function(e,n,r,a){if("string"==typeof e){if("string"==typeof n?(a=n,n=0,r=this.length):"string"==typeof r&&(a=r,r=this.length),void 0!==a&&"string"!=typeof a)throw new TypeError("encoding must be a string");if("string"==typeof a&&!t.isEncoding(a))throw new TypeError("Unknown encoding: "+a);if(1===e.length){var o=e.charCodeAt(0);("utf8"===a&&128>o||"latin1"===a)&&(e=o)}}else"number"==typeof e?e&=255:"boolean"==typeof e&&(e=+e);if(0>n||this.length<n||this.length<r)throw new RangeError("Out of range index");if(r<=n)return this;n>>>=0,r=r===void 0?this.length:r>>>0,e||(e=0);var d;if("number"==typeof e)for(d=n;d<r;++d)this[d]=e;else{var s=t.isBuffer(e)?e:t.from(e,a),l=s.length;if(0===l)throw new TypeError("The value \""+e+"\" is invalid for argument \"value\"");for(d=0;d<r-n;++d)this[d+n]=s[d%l]}return this};var J=/[^+/0-9A-Za-z-_]/g,Z=function(){for(var e,t="0123456789abcdef",n=Array(256),r=0;16>r;++r){e=16*r;for(var a=0;16>a;++a)n[e+a]=t[r]+t[a]}return n}()}).call(this,e("buffer").Buffer)},{"base64-js":1,buffer:3,ieee754:8}],4:[function(e,t,n){(function(a){function o(){let e;try{e=n.storage.getItem("debug")}catch(e){}return!e&&"undefined"!=typeof a&&"env"in a&&(e=a.env.DEBUG),e}n.log=function(...e){return"object"==typeof console&&console.log&&console.log(...e)},n.formatArgs=function(e){if(e[0]=(this.useColors?"%c":"")+this.namespace+(this.useColors?" %c":" ")+e[0]+(this.useColors?"%c ":" ")+"+"+t.exports.humanize(this.diff),!this.useColors)return;const n="color: "+this.color;e.splice(1,0,n,"color: inherit");let r=0,a=0;e[0].replace(/%[a-zA-Z%]/g,e=>{"%%"===e||(r++,"%c"===e&&(a=r))}),e.splice(a,0,n)},n.save=function(e){try{e?n.storage.setItem("debug",e):n.storage.removeItem("debug")}catch(e){}},n.load=o,n.useColors=function(){return!!("undefined"!=typeof window&&window.process&&("renderer"===window.process.type||window.process.__nwjs))||!("undefined"!=typeof navigator&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))&&("undefined"!=typeof document&&document.documentElement&&document.documentElement.style&&document.documentElement.style.WebkitAppearance||"undefined"!=typeof window&&window.console&&(window.console.firebug||window.console.exception&&window.console.table)||"undefined"!=typeof navigator&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)&&31<=parseInt(RegExp.$1,10)||"undefined"!=typeof navigator&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/))},n.storage=function(){try{return localStorage}catch(e){}}(),n.colors=["#0000CC","#0000FF","#0033CC","#0033FF","#0066CC","#0066FF","#0099CC","#0099FF","#00CC00","#00CC33","#00CC66","#00CC99","#00CCCC","#00CCFF","#3300CC","#3300FF","#3333CC","#3333FF","#3366CC","#3366FF","#3399CC","#3399FF","#33CC00","#33CC33","#33CC66","#33CC99","#33CCCC","#33CCFF","#6600CC","#6600FF","#6633CC","#6633FF","#66CC00","#66CC33","#9900CC","#9900FF","#9933CC","#9933FF","#99CC00","#99CC33","#CC0000","#CC0033","#CC0066","#CC0099","#CC00CC","#CC00FF","#CC3300","#CC3333","#CC3366","#CC3399","#CC33CC","#CC33FF","#CC6600","#CC6633","#CC9900","#CC9933","#CCCC00","#CCCC33","#FF0000","#FF0033","#FF0066","#FF0099","#FF00CC","#FF00FF","#FF3300","#FF3333","#FF3366","#FF3399","#FF33CC","#FF33FF","#FF6600","#FF6633","#FF9900","#FF9933","#FFCC00","#FFCC33"],t.exports=e("./common")(n);const{formatters:i}=t.exports;i.j=function(e){try{return JSON.stringify(e)}catch(e){return"[UnexpectedJSONParseError]: "+e.message}}}).call(this,e("_process"))},{"./common":5,_process:11}],5:[function(e,t){t.exports=function(t){function r(e){let t=0;for(let n=0;n<e.length;n++)t=(t<<5)-t+e.charCodeAt(n),t|=0;return a.colors[n(t)%a.colors.length]}function a(e){function t(...e){if(!t.enabled)return;const r=t,o=+new Date,i=o-(n||o);r.diff=i,r.prev=n,r.curr=o,n=o,e[0]=a.coerce(e[0]),"string"!=typeof e[0]&&e.unshift("%O");let d=0;e[0]=e[0].replace(/%([a-zA-Z%])/g,(t,n)=>{if("%%"===t)return t;d++;const o=a.formatters[n];if("function"==typeof o){const n=e[d];t=o.call(r,n),e.splice(d,1),d--}return t}),a.formatArgs.call(r,e);const s=r.log||a.log;s.apply(r,e)}let n;return t.namespace=e,t.enabled=a.enabled(e),t.useColors=a.useColors(),t.color=r(e),t.destroy=o,t.extend=i,"function"==typeof a.init&&a.init(t),a.instances.push(t),t}function o(){const e=a.instances.indexOf(this);return-1!==e&&(a.instances.splice(e,1),!0)}function i(e,t){const n=a(this.namespace+("undefined"==typeof t?":":t)+e);return n.log=this.log,n}function d(e){return e.toString().substring(2,e.toString().length-2).replace(/\.\*\?$/,"*")}return a.debug=a,a.default=a,a.coerce=function(e){return e instanceof Error?e.stack||e.message:e},a.disable=function(){const e=[...a.names.map(d),...a.skips.map(d).map(e=>"-"+e)].join(",");return a.enable(""),e},a.enable=function(e){a.save(e),a.names=[],a.skips=[];let t;const n=("string"==typeof e?e:"").split(/[\s,]+/),r=n.length;for(t=0;t<r;t++)n[t]&&(e=n[t].replace(/\*/g,".*?"),"-"===e[0]?a.skips.push(new RegExp("^"+e.substr(1)+"$")):a.names.push(new RegExp("^"+e+"$")));for(t=0;t<a.instances.length;t++){const e=a.instances[t];e.enabled=a.enabled(e.namespace)}},a.enabled=function(e){if("*"===e[e.length-1])return!0;let t,n;for(t=0,n=a.skips.length;t<n;t++)if(a.skips[t].test(e))return!1;for(t=0,n=a.names.length;t<n;t++)if(a.names[t].test(e))return!0;return!1},a.humanize=e("ms"),Object.keys(t).forEach(e=>{a[e]=t[e]}),a.instances=[],a.names=[],a.skips=[],a.formatters={},a.selectColor=r,a.enable(a.load()),a}},{ms:10}],6:[function(e,t){function n(){this._events&&Object.prototype.hasOwnProperty.call(this,"_events")||(this._events=y(null),this._eventsCount=0),this._maxListeners=this._maxListeners||void 0}function r(e){return void 0===e._maxListeners?n.defaultMaxListeners:e._maxListeners}function a(e,t,n){if(t)e.call(n);else for(var r=e.length,a=m(e,r),o=0;o<r;++o)a[o].call(n)}function d(e,t,n,r){if(t)e.call(n,r);else for(var a=e.length,o=m(e,a),d=0;d<a;++d)o[d].call(n,r)}function s(e,t,n,r,a){if(t)e.call(n,r,a);else for(var o=e.length,d=m(e,o),s=0;s<o;++s)d[s].call(n,r,a)}function l(e,t,n,r,a,o){if(t)e.call(n,r,a,o);else for(var d=e.length,s=m(e,d),l=0;l<d;++l)s[l].call(n,r,a,o)}function c(e,t,n,r){if(t)e.apply(n,r);else for(var a=e.length,o=m(e,a),d=0;d<a;++d)o[d].apply(n,r)}function u(e,t,n,a){var o,i,d;if("function"!=typeof n)throw new TypeError("\"listener\" argument must be a function");if(i=e._events,i?(i.newListener&&(e.emit("newListener",t,n.listener?n.listener:n),i=e._events),d=i[t]):(i=e._events=y(null),e._eventsCount=0),!d)d=i[t]=n,++e._eventsCount;else if("function"==typeof d?d=i[t]=a?[n,d]:[d,n]:a?d.unshift(n):d.push(n),!d.warned&&(o=r(e),o&&0<o&&d.length>o)){d.warned=!0;var s=new Error("Possible EventEmitter memory leak detected. "+d.length+" \""+(t+"\" listeners added. Use emitter.setMaxListeners() to increase limit."));s.name="MaxListenersExceededWarning",s.emitter=e,s.type=t,s.count=d.length,"object"==typeof console&&console.warn&&console.warn("%s: %s",s.name,s.message)}return e}function p(){if(!this.fired)switch(this.target.removeListener(this.type,this.wrapFn),this.fired=!0,arguments.length){case 0:return this.listener.call(this.target);case 1:return this.listener.call(this.target,arguments[0]);case 2:return this.listener.call(this.target,arguments[0],arguments[1]);case 3:return this.listener.call(this.target,arguments[0],arguments[1],arguments[2]);default:for(var e=Array(arguments.length),t=0;t<e.length;++t)e[t]=arguments[t];this.listener.apply(this.target,e);}}function f(e,t,n){var r={fired:!1,wrapFn:void 0,target:e,type:t,listener:n},a=w.call(p,r);return a.listener=n,r.wrapFn=a,a}function g(e,t,n){var r=e._events;if(!r)return[];var a=r[t];return a?"function"==typeof a?n?[a.listener||a]:[a]:n?b(a):m(a,a.length):[]}function h(e){var t=this._events;if(t){var n=t[e];if("function"==typeof n)return 1;if(n)return n.length}return 0}function _(e,t){for(var r=t,a=r+1,o=e.length;a<o;r+=1,a+=1)e[r]=e[a];e.pop()}function m(e,t){for(var n=Array(t),r=0;r<t;++r)n[r]=e[r];return n}function b(e){for(var t=Array(e.length),n=0;n<t.length;++n)t[n]=e[n].listener||e[n];return t}var y=Object.create||function(e){var t=function(){};return t.prototype=e,new t},C=Object.keys||function(e){var t=[];for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.push(n);return n},w=Function.prototype.bind||function(e){var t=this;return function(){return t.apply(e,arguments)}};t.exports=n,n.EventEmitter=n,n.prototype._events=void 0,n.prototype._maxListeners=void 0;var R,E=10;try{var S={};Object.defineProperty&&Object.defineProperty(S,"x",{value:0}),R=0===S.x}catch(e){R=!1}R?Object.defineProperty(n,"defaultMaxListeners",{enumerable:!0,get:function(){return E},set:function(e){if("number"!=typeof e||0>e||e!==e)throw new TypeError("\"defaultMaxListeners\" must be a positive number");E=e}}):n.defaultMaxListeners=E,n.prototype.setMaxListeners=function(e){if("number"!=typeof e||0>e||isNaN(e))throw new TypeError("\"n\" argument must be a positive number");return this._maxListeners=e,this},n.prototype.getMaxListeners=function(){return r(this)},n.prototype.emit=function(e){var t,n,r,o,u,p,f="error"===e;if(p=this._events,p)f=f&&null==p.error;else if(!f)return!1;if(f){if(1<arguments.length&&(t=arguments[1]),t instanceof Error)throw t;else{var g=new Error("Unhandled \"error\" event. ("+t+")");throw g.context=t,g}return!1}if(n=p[e],!n)return!1;var h="function"==typeof n;switch(r=arguments.length,r){case 1:a(n,h,this);break;case 2:d(n,h,this,arguments[1]);break;case 3:s(n,h,this,arguments[1],arguments[2]);break;case 4:l(n,h,this,arguments[1],arguments[2],arguments[3]);break;default:for(o=Array(r-1),u=1;u<r;u++)o[u-1]=arguments[u];c(n,h,this,o);}return!0},n.prototype.addListener=function(e,t){return u(this,e,t,!1)},n.prototype.on=n.prototype.addListener,n.prototype.prependListener=function(e,t){return u(this,e,t,!0)},n.prototype.once=function(e,t){if("function"!=typeof t)throw new TypeError("\"listener\" argument must be a function");return this.on(e,f(this,e,t)),this},n.prototype.prependOnceListener=function(e,t){if("function"!=typeof t)throw new TypeError("\"listener\" argument must be a function");return this.prependListener(e,f(this,e,t)),this},n.prototype.removeListener=function(e,t){var n,r,a,o,d;if("function"!=typeof t)throw new TypeError("\"listener\" argument must be a function");if(r=this._events,!r)return this;if(n=r[e],!n)return this;if(n===t||n.listener===t)0==--this._eventsCount?this._events=y(null):(delete r[e],r.removeListener&&this.emit("removeListener",e,n.listener||t));else if("function"!=typeof n){for(a=-1,o=n.length-1;0<=o;o--)if(n[o]===t||n[o].listener===t){d=n[o].listener,a=o;break}if(0>a)return this;0===a?n.shift():_(n,a),1===n.length&&(r[e]=n[0]),r.removeListener&&this.emit("removeListener",e,d||t)}return this},n.prototype.removeAllListeners=function(e){var t,n,r;if(n=this._events,!n)return this;if(!n.removeListener)return 0===arguments.length?(this._events=y(null),this._eventsCount=0):n[e]&&(0==--this._eventsCount?this._events=y(null):delete n[e]),this;if(0===arguments.length){var a,o=C(n);for(r=0;r<o.length;++r)a=o[r],"removeListener"===a||this.removeAllListeners(a);return this.removeAllListeners("removeListener"),this._events=y(null),this._eventsCount=0,this}if(t=n[e],"function"==typeof t)this.removeListener(e,t);else if(t)for(r=t.length-1;0<=r;r--)this.removeListener(e,t[r]);return this},n.prototype.listeners=function(e){return g(this,e,!0)},n.prototype.rawListeners=function(e){return g(this,e,!1)},n.listenerCount=function(e,t){return"function"==typeof e.listenerCount?e.listenerCount(t):h.call(e,t)},n.prototype.listenerCount=h,n.prototype.eventNames=function(){return 0<this._eventsCount?Reflect.ownKeys(this._events):[]}},{}],7:[function(e,t){t.exports=function(){if("undefined"==typeof window)return null;var e={RTCPeerConnection:window.RTCPeerConnection||window.mozRTCPeerConnection||window.webkitRTCPeerConnection,RTCSessionDescription:window.RTCSessionDescription||window.mozRTCSessionDescription||window.webkitRTCSessionDescription,RTCIceCandidate:window.RTCIceCandidate||window.mozRTCIceCandidate||window.webkitRTCIceCandidate};return e.RTCPeerConnection?e:null}},{}],8:[function(e,a,o){o.read=function(t,n,a,o,l){var c,u,p=8*l-o-1,f=(1<<p)-1,g=f>>1,h=-7,_=a?l-1:0,b=a?-1:1,d=t[n+_];for(_+=b,c=d&(1<<-h)-1,d>>=-h,h+=p;0<h;c=256*c+t[n+_],_+=b,h-=8);for(u=c&(1<<-h)-1,c>>=-h,h+=o;0<h;u=256*u+t[n+_],_+=b,h-=8);if(0===c)c=1-g;else{if(c===f)return u?NaN:(d?-1:1)*(1/0);u+=r(2,o),c-=g}return(d?-1:1)*u*r(2,c-o)},o.write=function(a,o,l,u,p,f){var _,b,y,g=Math.LN2,h=Math.log,C=8*f-p-1,w=(1<<C)-1,R=w>>1,E=23===p?r(2,-24)-r(2,-77):0,S=u?0:f-1,T=u?1:-1,d=0>o||0===o&&0>1/o?1:0;for(o=n(o),isNaN(o)||o===1/0?(b=isNaN(o)?1:0,_=w):(_=t(h(o)/g),1>o*(y=r(2,-_))&&(_--,y*=2),o+=1<=_+R?E/y:E*r(2,1-R),2<=o*y&&(_++,y/=2),_+R>=w?(b=0,_=w):1<=_+R?(b=(o*y-1)*r(2,p),_+=R):(b=o*r(2,R-1)*r(2,p),_=0));8<=p;a[l+S]=255&b,S+=T,b/=256,p-=8);for(_=_<<p|b,C+=p;0<C;a[l+S]=255&_,S+=T,_/=256,C-=8);a[l+S-T]|=128*d}},{}],9:[function(e,t){t.exports="function"==typeof Object.create?function(e,t){t&&(e.super_=t,e.prototype=Object.create(t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}))}:function(e,t){if(t){e.super_=t;var n=function(){};n.prototype=t.prototype,e.prototype=new n,e.prototype.constructor=e}}},{}],10:[function(e,t){var s=Math.round;function r(e){if(e+="",!(100<e.length)){var t=/^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(e);if(t){var r=parseFloat(t[1]),n=(t[2]||"ms").toLowerCase();return"years"===n||"year"===n||"yrs"===n||"yr"===n||"y"===n?31557600000*r:"weeks"===n||"week"===n||"w"===n?604800000*r:"days"===n||"day"===n||"d"===n?86400000*r:"hours"===n||"hour"===n||"hrs"===n||"hr"===n||"h"===n?3600000*r:"minutes"===n||"minute"===n||"mins"===n||"min"===n||"m"===n?60000*r:"seconds"===n||"second"===n||"secs"===n||"sec"===n||"s"===n?1000*r:"milliseconds"===n||"millisecond"===n||"msecs"===n||"msec"===n||"ms"===n?r:void 0}}}function a(e){var t=n(e);return 86400000<=t?s(e/86400000)+"d":3600000<=t?s(e/3600000)+"h":60000<=t?s(e/60000)+"m":1000<=t?s(e/1000)+"s":e+"ms"}function o(e){var t=n(e);return 86400000<=t?i(e,t,86400000,"day"):3600000<=t?i(e,t,3600000,"hour"):60000<=t?i(e,t,60000,"minute"):1000<=t?i(e,t,1000,"second"):e+" ms"}function i(e,t,r,n){return s(e/r)+" "+n+(t>=1.5*r?"s":"")}var l=24*(60*60000);t.exports=function(e,t){t=t||{};var n=typeof e;if("string"==n&&0<e.length)return r(e);if("number"===n&&isFinite(e))return t.long?o(e):a(e);throw new Error("val is not a non-empty string or a valid number. val="+JSON.stringify(e))}},{}],11:[function(e,t){function n(){throw new Error("setTimeout has not been defined")}function r(){throw new Error("clearTimeout has not been defined")}function a(t){if(c===setTimeout)return setTimeout(t,0);if((c===n||!c)&&setTimeout)return c=setTimeout,setTimeout(t,0);try{return c(t,0)}catch(n){try{return c.call(null,t,0)}catch(n){return c.call(this,t,0)}}}function o(t){if(u===clearTimeout)return clearTimeout(t);if((u===r||!u)&&clearTimeout)return u=clearTimeout,clearTimeout(t);try{return u(t)}catch(n){try{return u.call(null,t)}catch(n){return u.call(this,t)}}}function i(){h&&f&&(h=!1,f.length?g=f.concat(g):_=-1,g.length&&d())}function d(){if(!h){var e=a(i);h=!0;for(var t=g.length;t;){for(f=g,g=[];++_<t;)f&&f[_].run();_=-1,t=g.length}f=null,h=!1,o(e)}}function s(e,t){this.fun=e,this.array=t}function l(){}var c,u,p=t.exports={};(function(){try{c="function"==typeof setTimeout?setTimeout:n}catch(t){c=n}try{u="function"==typeof clearTimeout?clearTimeout:r}catch(t){u=r}})();var f,g=[],h=!1,_=-1;p.nextTick=function(e){var t=Array(arguments.length-1);if(1<arguments.length)for(var n=1;n<arguments.length;n++)t[n-1]=arguments[n];g.push(new s(e,t)),1!==g.length||h||a(d)},s.prototype.run=function(){this.fun.apply(null,this.array)},p.title="browser",p.browser=!0,p.env={},p.argv=[],p.version="",p.versions={},p.on=l,p.addListener=l,p.once=l,p.off=l,p.removeListener=l,p.removeAllListeners=l,p.emit=l,p.prependListener=l,p.prependOnceListener=l,p.listeners=function(){return[]},p.binding=function(){throw new Error("process.binding is not supported")},p.cwd=function(){return"/"},p.chdir=function(){throw new Error("process.chdir is not supported")},p.umask=function(){return 0}},{}],12:[function(e,t){let n;t.exports="function"==typeof queueMicrotask?queueMicrotask:e=>(n||(n=Promise.resolve())).then(e).catch(e=>setTimeout(()=>{throw e},0))},{}],13:[function(e,t){(function(n,r){'use strict';var a=e("safe-buffer").Buffer,o=r.crypto||r.msCrypto;t.exports=o&&o.getRandomValues?function(e,t){if(e>4294967295)throw new RangeError("requested too many random bytes");var r=a.allocUnsafe(e);if(0<e)if(65536<e)for(var i=0;i<e;i+=65536)o.getRandomValues(r.slice(i,i+65536));else o.getRandomValues(r);return"function"==typeof t?n.nextTick(function(){t(null,r)}):r}:function(){throw new Error("Secure random number generation is not supported by this browser.\nUse Chrome, Firefox or Internet Explorer 11")}}).call(this,e("_process"),"undefined"==typeof global?"undefined"==typeof self?"undefined"==typeof window?{}:window:self:global)},{_process:11,"safe-buffer":29}],14:[function(e,t){'use strict';function n(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e,e.__proto__=t}function r(e,t,r){function a(e,n,r){return"string"==typeof t?t:t(e,n,r)}r||(r=Error);var o=function(e){function t(t,n,r){return e.call(this,a(t,n,r))||this}return n(t,e),t}(r);o.prototype.name=r.name,o.prototype.code=e,s[e]=o}function a(e,t){if(Array.isArray(e)){var n=e.length;return e=e.map(function(e){return e+""}),2<n?"one of ".concat(t," ").concat(e.slice(0,n-1).join(", "),", or ")+e[n-1]:2===n?"one of ".concat(t," ").concat(e[0]," or ").concat(e[1]):"of ".concat(t," ").concat(e[0])}return"of ".concat(t," ").concat(e+"")}function o(e,t,n){return e.substr(!n||0>n?0:+n,t.length)===t}function i(e,t,n){return(void 0===n||n>e.length)&&(n=e.length),e.substring(n-t.length,n)===t}function d(e,t,n){return"number"!=typeof n&&(n=0),!(n+t.length>e.length)&&-1!==e.indexOf(t,n)}var s={};r("ERR_INVALID_OPT_VALUE",function(e,t){return"The value \""+t+"\" is invalid for option \""+e+"\""},TypeError),r("ERR_INVALID_ARG_TYPE",function(e,t,n){var r;"string"==typeof t&&o(t,"not ")?(r="must not be",t=t.replace(/^not /,"")):r="must be";var s;if(i(e," argument"))s="The ".concat(e," ").concat(r," ").concat(a(t,"type"));else{var l=d(e,".")?"property":"argument";s="The \"".concat(e,"\" ").concat(l," ").concat(r," ").concat(a(t,"type"))}return s+=". Received type ".concat(typeof n),s},TypeError),r("ERR_STREAM_PUSH_AFTER_EOF","stream.push() after EOF"),r("ERR_METHOD_NOT_IMPLEMENTED",function(e){return"The "+e+" method is not implemented"}),r("ERR_STREAM_PREMATURE_CLOSE","Premature close"),r("ERR_STREAM_DESTROYED",function(e){return"Cannot call "+e+" after a stream was destroyed"}),r("ERR_MULTIPLE_CALLBACK","Callback called multiple times"),r("ERR_STREAM_CANNOT_PIPE","Cannot pipe, not readable"),r("ERR_STREAM_WRITE_AFTER_END","write after end"),r("ERR_STREAM_NULL_VALUES","May not write null values to stream",TypeError),r("ERR_UNKNOWN_ENCODING",function(e){return"Unknown encoding: "+e},TypeError),r("ERR_STREAM_UNSHIFT_AFTER_END_EVENT","stream.unshift() after end event"),t.exports.codes=s},{}],15:[function(e,t){(function(e){'use strict';var n=new Set;t.exports.emitExperimentalWarning=e.emitWarning?function(t){if(!n.has(t)){n.add(t),e.emitWarning(t+" is an experimental feature. This feature could change at any time","ExperimentalWarning")}}:function(){}}).call(this,e("_process"))},{_process:11}],16:[function(e,t){(function(n){'use strict';function r(e){return this instanceof r?void(d.call(this,e),s.call(this,e),this.allowHalfOpen=!0,e&&(!1===e.readable&&(this.readable=!1),!1===e.writable&&(this.writable=!1),!1===e.allowHalfOpen&&(this.allowHalfOpen=!1,this.once("end",a)))):new r(e)}function a(){this._writableState.ended||n.nextTick(o,this)}function o(e){e.end()}var i=Object.keys||function(e){var t=[];for(var n in e)t.push(n);return t};t.exports=r;var d=e("./_stream_readable"),s=e("./_stream_writable");e("inherits")(r,d);for(var l,c=i(s.prototype),u=0;u<c.length;u++)l=c[u],r.prototype[l]||(r.prototype[l]=s.prototype[l]);Object.defineProperty(r.prototype,"writableHighWaterMark",{enumerable:!1,get:function(){return this._writableState.highWaterMark}}),Object.defineProperty(r.prototype,"writableBuffer",{enumerable:!1,get:function(){return this._writableState&&this._writableState.getBuffer()}}),Object.defineProperty(r.prototype,"writableLength",{enumerable:!1,get:function(){return this._writableState.length}}),Object.defineProperty(r.prototype,"destroyed",{enumerable:!1,get:function(){return void 0!==this._readableState&&void 0!==this._writableState&&this._readableState.destroyed&&this._writableState.destroyed},set:function(e){void 0===this._readableState||void 0===this._writableState||(this._readableState.destroyed=e,this._writableState.destroyed=e)}})}).call(this,e("_process"))},{"./_stream_readable":18,"./_stream_writable":20,_process:11,inherits:9}],17:[function(e,t){'use strict';function n(e){return this instanceof n?void r.call(this,e):new n(e)}t.exports=n;var r=e("./_stream_transform");e("inherits")(n,r),n.prototype._transform=function(e,t,n){n(null,e)}},{"./_stream_transform":19,inherits:9}],18:[function(e,t){(function(n,r){'use strict';function a(e){return M.from(e)}function o(e){return M.isBuffer(e)||e instanceof F}function i(e,t,n){return"function"==typeof e.prependListener?e.prependListener(t,n):void(e._events&&e._events[t]?Array.isArray(e._events[t])?e._events[t].unshift(n):e._events[t]=[n,e._events[t]]:e.on(t,n))}function d(t,n,r){A=A||e("./_stream_duplex"),t=t||{},"boolean"!=typeof r&&(r=n instanceof A),this.objectMode=!!t.objectMode,r&&(this.objectMode=this.objectMode||!!t.readableObjectMode),this.highWaterMark=q(this,t,"readableHighWaterMark",r),this.buffer=new U,this.length=0,this.pipes=null,this.pipesCount=0,this.flowing=null,this.ended=!1,this.endEmitted=!1,this.reading=!1,this.sync=!0,this.needReadable=!1,this.emittedReadable=!1,this.readableListening=!1,this.resumeScheduled=!1,this.paused=!0,this.emitClose=!1!==t.emitClose,this.destroyed=!1,this.defaultEncoding=t.defaultEncoding||"utf8",this.awaitDrain=0,this.readingMore=!1,this.decoder=null,this.encoding=null,t.encoding&&(!O&&(O=e("string_decoder/").StringDecoder),this.decoder=new O(t.encoding),this.encoding=t.encoding)}function s(t){if(A=A||e("./_stream_duplex"),!(this instanceof s))return new s(t);var n=this instanceof A;this._readableState=new d(t,this,n),this.readable=!0,t&&("function"==typeof t.read&&(this._read=t.read),"function"==typeof t.destroy&&(this._destroy=t.destroy)),P.call(this)}function l(e,t,n,r,o){x("readableAddChunk",t);var i=e._readableState;if(null===t)i.reading=!1,g(e,i);else{var d;if(o||(d=u(i,t)),d)e.emit("error",d);else if(!(i.objectMode||t&&0<t.length))r||(i.reading=!1,m(e,i));else if("string"==typeof t||i.objectMode||Object.getPrototypeOf(t)===M.prototype||(t=a(t)),r)i.endEmitted?e.emit("error",new z):c(e,i,t,!0);else if(i.ended)e.emit("error",new G);else{if(i.destroyed)return!1;i.reading=!1,i.decoder&&!n?(t=i.decoder.write(t),i.objectMode||0!==t.length?c(e,i,t,!1):m(e,i)):c(e,i,t,!1)}}return!i.ended&&(i.length<i.highWaterMark||0===i.length)}function c(e,t,n,r){t.flowing&&0===t.length&&!t.sync?(t.awaitDrain=0,e.emit("data",n)):(t.length+=t.objectMode?1:n.length,r?t.buffer.unshift(n):t.buffer.push(n),t.needReadable&&h(e)),m(e,t)}function u(e,t){var n;return o(t)||"string"==typeof t||void 0===t||e.objectMode||(n=new V("chunk",["string","Buffer","Uint8Array"],t)),n}function p(e){return 8388608<=e?e=8388608:(e--,e|=e>>>1,e|=e>>>2,e|=e>>>4,e|=e>>>8,e|=e>>>16,e++),e}function f(e,t){return 0>=e||0===t.length&&t.ended?0:t.objectMode?1:e===e?(e>t.highWaterMark&&(t.highWaterMark=p(e)),e<=t.length?e:t.ended?t.length:(t.needReadable=!0,0)):t.flowing&&t.length?t.buffer.head.data.length:t.length}function g(e,t){if(!t.ended){if(t.decoder){var n=t.decoder.end();n&&n.length&&(t.buffer.push(n),t.length+=t.objectMode?1:n.length)}t.ended=!0,t.sync?h(e):(t.needReadable=!1,!t.emittedReadable&&(t.emittedReadable=!0,_(e)))}}function h(e){var t=e._readableState;t.needReadable=!1,t.emittedReadable||(x("emitReadable",t.flowing),t.emittedReadable=!0,n.nextTick(_,e))}function _(e){var t=e._readableState;x("emitReadable_",t.destroyed,t.length,t.ended),!t.destroyed&&(t.length||t.ended)&&e.emit("readable"),t.needReadable=!t.flowing&&!t.ended&&t.length<=t.highWaterMark,S(e)}function m(e,t){t.readingMore||(t.readingMore=!0,n.nextTick(b,e,t))}function b(e,t){for(;!t.reading&&!t.ended&&(t.length<t.highWaterMark||t.flowing&&0===t.length);){var n=t.length;if(x("maybeReadMore read 0"),e.read(0),n===t.length)break}t.readingMore=!1}function y(e){return function(){var t=e._readableState;x("pipeOnDrain",t.awaitDrain),t.awaitDrain&&t.awaitDrain--,0===t.awaitDrain&&I(e,"data")&&(t.flowing=!0,S(e))}}function C(e){var t=e._readableState;t.readableListening=0<e.listenerCount("readable"),t.resumeScheduled&&!t.paused?t.flowing=!0:0<e.listenerCount("data")&&e.resume()}function w(e){x("readable nexttick read 0"),e.read(0)}function R(e,t){t.resumeScheduled||(t.resumeScheduled=!0,n.nextTick(E,e,t))}function E(e,t){x("resume",t.reading),t.reading||e.read(0),t.resumeScheduled=!1,e.emit("resume"),S(e),t.flowing&&!t.reading&&e.read(0)}function S(e){var t=e._readableState;for(x("flow",t.flowing);t.flowing&&null!==e.read(););}function T(e,t){if(0===t.length)return null;var n;return t.objectMode?n=t.buffer.shift():!e||e>=t.length?(n=t.decoder?t.buffer.join(""):1===t.buffer.length?t.buffer.first():t.buffer.concat(t.length),t.buffer.clear()):n=t.buffer.consume(e,t.decoder),n}function k(e){var t=e._readableState;x("endReadable",t.endEmitted),t.endEmitted||(t.ended=!0,n.nextTick(v,t,e))}function v(e,t){x("endReadableNT",e.endEmitted,e.length),e.endEmitted||0!==e.length||(e.endEmitted=!0,t.readable=!1,t.emit("end"))}function L(e,t){for(var n=0,r=e.length;n<r;n++)if(e[n]===t)return n;return-1}t.exports=s;var A;s.ReadableState=d;var x,N=e("events").EventEmitter,I=function(e,t){return e.listeners(t).length},P=e("./internal/streams/stream"),M=e("buffer").Buffer,F=r.Uint8Array||function(){},B=e("util");x=B&&B.debuglog?B.debuglog("stream"):function(){};var O,D,U=e("./internal/streams/buffer_list"),j=e("./internal/streams/destroy"),W=e("./internal/streams/state"),q=W.getHighWaterMark,H=e("../errors").codes,V=H.ERR_INVALID_ARG_TYPE,G=H.ERR_STREAM_PUSH_AFTER_EOF,Y=H.ERR_METHOD_NOT_IMPLEMENTED,z=H.ERR_STREAM_UNSHIFT_AFTER_END_EVENT,K=e("../experimentalWarning"),X=K.emitExperimentalWarning;e("inherits")(s,P);var $=["error","close","destroy","pause","resume"];Object.defineProperty(s.prototype,"destroyed",{enumerable:!1,get:function(){return void 0!==this._readableState&&this._readableState.destroyed},set:function(e){this._readableState&&(this._readableState.destroyed=e)}}),s.prototype.destroy=j.destroy,s.prototype._undestroy=j.undestroy,s.prototype._destroy=function(e,t){t(e)},s.prototype.push=function(e,t){var n,r=this._readableState;return r.objectMode?n=!0:"string"==typeof e&&(t=t||r.defaultEncoding,t!==r.encoding&&(e=M.from(e,t),t=""),n=!0),l(this,e,t,!1,n)},s.prototype.unshift=function(e){return l(this,e,null,!0,!1)},s.prototype.isPaused=function(){return!1===this._readableState.flowing},s.prototype.setEncoding=function(t){return O||(O=e("string_decoder/").StringDecoder),this._readableState.decoder=new O(t),this._readableState.encoding=this._readableState.decoder.encoding,this};s.prototype.read=function(e){x("read",e),e=parseInt(e,10);var t=this._readableState,r=e;if(0!==e&&(t.emittedReadable=!1),0===e&&t.needReadable&&((0===t.highWaterMark?0<t.length:t.length>=t.highWaterMark)||t.ended))return x("read: emitReadable",t.length,t.ended),0===t.length&&t.ended?k(this):h(this),null;if(e=f(e,t),0===e&&t.ended)return 0===t.length&&k(this),null;var a=t.needReadable;x("need readable",a),(0===t.length||t.length-e<t.highWaterMark)&&(a=!0,x("length less than watermark",a)),t.ended||t.reading?(a=!1,x("reading or ended",a)):a&&(x("do read"),t.reading=!0,t.sync=!0,0===t.length&&(t.needReadable=!0),this._read(t.highWaterMark),t.sync=!1,!t.reading&&(e=f(r,t)));var o;return o=0<e?T(e,t):null,null===o?(t.needReadable=!0,e=0):(t.length-=e,t.awaitDrain=0),0===t.length&&(!t.ended&&(t.needReadable=!0),r!==e&&t.ended&&k(this)),null!==o&&this.emit("data",o),o},s.prototype._read=function(){this.emit("error",new Y("_read()"))},s.prototype.pipe=function(e,t){function r(e,t){x("onunpipe"),e===p&&t&&!1===t.hasUnpiped&&(t.hasUnpiped=!0,o())}function a(){x("onend"),e.end()}function o(){x("cleanup"),e.removeListener("close",l),e.removeListener("finish",c),e.removeListener("drain",_),e.removeListener("error",s),e.removeListener("unpipe",r),p.removeListener("end",a),p.removeListener("end",u),p.removeListener("data",d),m=!0,f.awaitDrain&&(!e._writableState||e._writableState.needDrain)&&_()}function d(t){x("ondata");var n=e.write(t);x("dest.write",n),!1===n&&((1===f.pipesCount&&f.pipes===e||1<f.pipesCount&&-1!==L(f.pipes,e))&&!m&&(x("false write response, pause",f.awaitDrain),f.awaitDrain++),p.pause())}function s(t){x("onerror",t),u(),e.removeListener("error",s),0===I(e,"error")&&e.emit("error",t)}function l(){e.removeListener("finish",c),u()}function c(){x("onfinish"),e.removeListener("close",l),u()}function u(){x("unpipe"),p.unpipe(e)}var p=this,f=this._readableState;switch(f.pipesCount){case 0:f.pipes=e;break;case 1:f.pipes=[f.pipes,e];break;default:f.pipes.push(e);}f.pipesCount+=1,x("pipe count=%d opts=%j",f.pipesCount,t);var g=(!t||!1!==t.end)&&e!==n.stdout&&e!==n.stderr,h=g?a:u;f.endEmitted?n.nextTick(h):p.once("end",h),e.on("unpipe",r);var _=y(p);e.on("drain",_);var m=!1;return p.on("data",d),i(e,"error",s),e.once("close",l),e.once("finish",c),e.emit("pipe",p),f.flowing||(x("pipe resume"),p.resume()),e},s.prototype.unpipe=function(e){var t=this._readableState,n={hasUnpiped:!1};if(0===t.pipesCount)return this;if(1===t.pipesCount)return e&&e!==t.pipes?this:(e||(e=t.pipes),t.pipes=null,t.pipesCount=0,t.flowing=!1,e&&e.emit("unpipe",this,n),this);if(!e){var r=t.pipes,a=t.pipesCount;t.pipes=null,t.pipesCount=0,t.flowing=!1;for(var o=0;o<a;o++)r[o].emit("unpipe",this,{hasUnpiped:!1});return this}var d=L(t.pipes,e);return-1===d?this:(t.pipes.splice(d,1),t.pipesCount-=1,1===t.pipesCount&&(t.pipes=t.pipes[0]),e.emit("unpipe",this,n),this)},s.prototype.on=function(e,t){var r=P.prototype.on.call(this,e,t),a=this._readableState;return"data"===e?(a.readableListening=0<this.listenerCount("readable"),!1!==a.flowing&&this.resume()):"readable"==e&&!a.endEmitted&&!a.readableListening&&(a.readableListening=a.needReadable=!0,a.flowing=!1,a.emittedReadable=!1,x("on readable",a.length,a.reading),a.length?h(this):!a.reading&&n.nextTick(w,this)),r},s.prototype.addListener=s.prototype.on,s.prototype.removeListener=function(e,t){var r=P.prototype.removeListener.call(this,e,t);return"readable"===e&&n.nextTick(C,this),r},s.prototype.removeAllListeners=function(e){var t=P.prototype.removeAllListeners.apply(this,arguments);return("readable"===e||void 0===e)&&n.nextTick(C,this),t},s.prototype.resume=function(){var e=this._readableState;return e.flowing||(x("resume"),e.flowing=!e.readableListening,R(this,e)),e.paused=!1,this},s.prototype.pause=function(){return x("call pause flowing=%j",this._readableState.flowing),!1!==this._readableState.flowing&&(x("pause"),this._readableState.flowing=!1,this.emit("pause")),this._readableState.paused=!0,this},s.prototype.wrap=function(e){var t=this,r=this._readableState,a=!1;for(var o in e.on("end",function(){if(x("wrapped end"),r.decoder&&!r.ended){var e=r.decoder.end();e&&e.length&&t.push(e)}t.push(null)}),e.on("data",function(n){if((x("wrapped data"),r.decoder&&(n=r.decoder.write(n)),!(r.objectMode&&(null===n||void 0===n)))&&(r.objectMode||n&&n.length)){var o=t.push(n);o||(a=!0,e.pause())}}),e)void 0===this[o]&&"function"==typeof e[o]&&(this[o]=function(t){return function(){return e[t].apply(e,arguments)}}(o));for(var i=0;i<$.length;i++)e.on($[i],this.emit.bind(this,$[i]));return this._read=function(t){x("wrapped _read",t),a&&(a=!1,e.resume())},this},"function"==typeof Symbol&&(s.prototype[Symbol.asyncIterator]=function(){return X("Readable[Symbol.asyncIterator]"),void 0===D&&(D=e("./internal/streams/async_iterator")),D(this)}),Object.defineProperty(s.prototype,"readableHighWaterMark",{enumerable:!1,get:function(){return this._readableState.highWaterMark}}),Object.defineProperty(s.prototype,"readableBuffer",{enumerable:!1,get:function(){return this._readableState&&this._readableState.buffer}}),Object.defineProperty(s.prototype,"readableFlowing",{enumerable:!1,get:function(){return this._readableState.flowing},set:function(e){this._readableState&&(this._readableState.flowing=e)}}),s._fromList=T,Object.defineProperty(s.prototype,"readableLength",{enumerable:!1,get:function(){return this._readableState.length}})}).call(this,e("_process"),"undefined"==typeof global?"undefined"==typeof self?"undefined"==typeof window?{}:window:self:global)},{"../errors":14,"../experimentalWarning":15,"./_stream_duplex":16,"./internal/streams/async_iterator":21,"./internal/streams/buffer_list":22,"./internal/streams/destroy":23,"./internal/streams/state":26,"./internal/streams/stream":27,_process:11,buffer:3,events:6,inherits:9,"string_decoder/":30,util:2}],19:[function(e,t){'use strict';function n(e,t){var n=this._transformState;n.transforming=!1;var r=n.writecb;if(null===r)return this.emit("error",new s);n.writechunk=null,n.writecb=null,null!=t&&this.push(t),r(e);var a=this._readableState;a.reading=!1,(a.needReadable||a.length<a.highWaterMark)&&this._read(a.highWaterMark)}function r(e){return this instanceof r?void(u.call(this,e),this._transformState={afterTransform:n.bind(this),needTransform:!1,transforming:!1,writecb:null,writechunk:null,writeencoding:null},this._readableState.needReadable=!0,this._readableState.sync=!1,e&&("function"==typeof e.transform&&(this._transform=e.transform),"function"==typeof e.flush&&(this._flush=e.flush)),this.on("prefinish",a)):new r(e)}function a(){var e=this;"function"!=typeof this._flush||this._readableState.destroyed?o(this,null,null):this._flush(function(t,n){o(e,t,n)})}function o(e,t,n){if(t)return e.emit("error",t);if(null!=n&&e.push(n),e._writableState.length)throw new c;if(e._transformState.transforming)throw new l;return e.push(null)}t.exports=r;var i=e("../errors").codes,d=i.ERR_METHOD_NOT_IMPLEMENTED,s=i.ERR_MULTIPLE_CALLBACK,l=i.ERR_TRANSFORM_ALREADY_TRANSFORMING,c=i.ERR_TRANSFORM_WITH_LENGTH_0,u=e("./_stream_duplex");e("inherits")(r,u),r.prototype.push=function(e,t){return this._transformState.needTransform=!1,u.prototype.push.call(this,e,t)},r.prototype._transform=function(e,t,n){n(new d("_transform()"))},r.prototype._write=function(e,t,n){var r=this._transformState;if(r.writecb=n,r.writechunk=e,r.writeencoding=t,!r.transforming){var a=this._readableState;(r.needTransform||a.needReadable||a.length<a.highWaterMark)&&this._read(a.highWaterMark)}},r.prototype._read=function(){var e=this._transformState;null===e.writechunk||e.transforming?e.needTransform=!0:(e.transforming=!0,this._transform(e.writechunk,e.writeencoding,e.afterTransform))},r.prototype._destroy=function(e,t){u.prototype._destroy.call(this,e,function(e){t(e)})}},{"../errors":14,"./_stream_duplex":16,inherits:9}],20:[function(e,t){(function(n,r){'use strict';function a(e){var t=this;this.next=null,this.entry=null,this.finish=function(){k(t,e)}}function o(e){return x.from(e)}function i(e){return x.isBuffer(e)||e instanceof N}function d(){}function s(t,n,r){v=v||e("./_stream_duplex"),t=t||{},"boolean"!=typeof r&&(r=n instanceof v),this.objectMode=!!t.objectMode,r&&(this.objectMode=this.objectMode||!!t.writableObjectMode),this.highWaterMark=M(this,t,"writableHighWaterMark",r),this.finalCalled=!1,this.needDrain=!1,this.ending=!1,this.ended=!1,this.finished=!1,this.destroyed=!1;var o=!1===t.decodeStrings;this.decodeStrings=!o,this.defaultEncoding=t.defaultEncoding||"utf8",this.length=0,this.writing=!1,this.corked=0,this.sync=!0,this.bufferProcessing=!1,this.onwrite=function(e){m(n,e)},this.writecb=null,this.writelen=0,this.bufferedRequest=null,this.lastBufferedRequest=null,this.pendingcb=0,this.prefinished=!1,this.errorEmitted=!1,this.emitClose=!1!==t.emitClose,this.bufferedRequestCount=0,this.corkedRequestsFree=new a(this)}function l(t){v=v||e("./_stream_duplex");var n=this instanceof v;return n||V.call(l,this)?void(this._writableState=new s(t,this,n),this.writable=!0,t&&("function"==typeof t.write&&(this._write=t.write),"function"==typeof t.writev&&(this._writev=t.writev),"function"==typeof t.destroy&&(this._destroy=t.destroy),"function"==typeof t.final&&(this._final=t.final)),A.call(this)):new l(t)}function c(e,t){var r=new q;e.emit("error",r),n.nextTick(t,r)}function u(e,t,r,a){var o;return null===r?o=new W:"string"!=typeof r&&!t.objectMode&&(o=new B("chunk",["string","Buffer"],r)),!o||(e.emit("error",o),n.nextTick(a,o),!1)}function p(e,t,n){return e.objectMode||!1===e.decodeStrings||"string"!=typeof t||(t=x.from(t,n)),t}function f(e,t,n,r,a,o){if(!n){var i=p(t,r,a);r!==i&&(n=!0,a="buffer",r=i)}var d=t.objectMode?1:r.length;t.length+=d;var s=t.length<t.highWaterMark;if(s||(t.needDrain=!0),t.writing||t.corked){var l=t.lastBufferedRequest;t.lastBufferedRequest={chunk:r,encoding:a,isBuf:n,callback:o,next:null},l?l.next=t.lastBufferedRequest:t.bufferedRequest=t.lastBufferedRequest,t.bufferedRequestCount+=1}else g(e,t,!1,d,r,a,o);return s}function g(e,t,n,r,a,o,i){t.writelen=r,t.writecb=i,t.writing=!0,t.sync=!0,t.destroyed?t.onwrite(new j("write")):n?e._writev(a,t.onwrite):e._write(a,o,t.onwrite),t.sync=!1}function h(e,t,r,a,o){--t.pendingcb,r?(n.nextTick(o,a),n.nextTick(S,e,t),e._writableState.errorEmitted=!0,e.emit("error",a)):(o(a),e._writableState.errorEmitted=!0,e.emit("error",a),S(e,t))}function _(e){e.writing=!1,e.writecb=null,e.length-=e.writelen,e.writelen=0}function m(e,t){var r=e._writableState,a=r.sync,o=r.writecb;if("function"!=typeof o)throw new D;if(_(r),t)h(e,r,a,t,o);else{var i=w(r)||e.destroyed;i||r.corked||r.bufferProcessing||!r.bufferedRequest||C(e,r),a?n.nextTick(b,e,r,i,o):b(e,r,i,o)}}function b(e,t,n,r){n||y(e,t),t.pendingcb--,r(),S(e,t)}function y(e,t){0===t.length&&t.needDrain&&(t.needDrain=!1,e.emit("drain"))}function C(e,t){t.bufferProcessing=!0;var n=t.bufferedRequest;if(e._writev&&n&&n.next){var r=t.bufferedRequestCount,o=Array(r),i=t.corkedRequestsFree;i.entry=n;for(var d=0,s=!0;n;)o[d]=n,n.isBuf||(s=!1),n=n.next,d+=1;o.allBuffers=s,g(e,t,!0,t.length,o,"",i.finish),t.pendingcb++,t.lastBufferedRequest=null,i.next?(t.corkedRequestsFree=i.next,i.next=null):t.corkedRequestsFree=new a(t),t.bufferedRequestCount=0}else{for(;n;){var l=n.chunk,c=n.encoding,u=n.callback,p=t.objectMode?1:l.length;if(g(e,t,!1,p,l,c,u),n=n.next,t.bufferedRequestCount--,t.writing)break}null===n&&(t.lastBufferedRequest=null)}t.bufferedRequest=n,t.bufferProcessing=!1}function w(e){return e.ending&&0===e.length&&null===e.bufferedRequest&&!e.finished&&!e.writing}function R(e,t){e._final(function(n){t.pendingcb--,n&&e.emit("error",n),t.prefinished=!0,e.emit("prefinish"),S(e,t)})}function E(e,t){t.prefinished||t.finalCalled||("function"!=typeof e._final||t.destroyed?(t.prefinished=!0,e.emit("prefinish")):(t.pendingcb++,t.finalCalled=!0,n.nextTick(R,e,t)))}function S(e,t){var n=w(t);return n&&(E(e,t),0===t.pendingcb&&(t.finished=!0,e.emit("finish"))),n}function T(e,t,r){t.ending=!0,S(e,t),r&&(t.finished?n.nextTick(r):e.once("finish",r)),t.ended=!0,e.writable=!1}function k(e,t,n){var r=e.entry;for(e.entry=null;r;){var a=r.callback;t.pendingcb--,a(n),r=r.next}t.corkedRequestsFree.next=e}t.exports=l;var v;l.WritableState=s;var L={deprecate:e("util-deprecate")},A=e("./internal/streams/stream"),x=e("buffer").Buffer,N=r.Uint8Array||function(){},I=e("./internal/streams/destroy"),P=e("./internal/streams/state"),M=P.getHighWaterMark,F=e("../errors").codes,B=F.ERR_INVALID_ARG_TYPE,O=F.ERR_METHOD_NOT_IMPLEMENTED,D=F.ERR_MULTIPLE_CALLBACK,U=F.ERR_STREAM_CANNOT_PIPE,j=F.ERR_STREAM_DESTROYED,W=F.ERR_STREAM_NULL_VALUES,q=F.ERR_STREAM_WRITE_AFTER_END,H=F.ERR_UNKNOWN_ENCODING;e("inherits")(l,A),s.prototype.getBuffer=function(){for(var e=this.bufferedRequest,t=[];e;)t.push(e),e=e.next;return t},function(){try{Object.defineProperty(s.prototype,"buffer",{get:L.deprecate(function(){return this.getBuffer()},"_writableState.buffer is deprecated. Use _writableState.getBuffer instead.","DEP0003")})}catch(e){}}();var V;"function"==typeof Symbol&&Symbol.hasInstance&&"function"==typeof Function.prototype[Symbol.hasInstance]?(V=Function.prototype[Symbol.hasInstance],Object.defineProperty(l,Symbol.hasInstance,{value:function(e){return!!V.call(this,e)||!(this!==l)&&e&&e._writableState instanceof s}})):V=function(e){return e instanceof this},l.prototype.pipe=function(){this.emit("error",new U)},l.prototype.write=function(e,t,n){var r=this._writableState,a=!1,s=!r.objectMode&&i(e);return s&&!x.isBuffer(e)&&(e=o(e)),"function"==typeof t&&(n=t,t=null),s?t="buffer":!t&&(t=r.defaultEncoding),"function"!=typeof n&&(n=d),r.ending?c(this,n):(s||u(this,r,e,n))&&(r.pendingcb++,a=f(this,r,s,e,t,n)),a},l.prototype.cork=function(){this._writableState.corked++},l.prototype.uncork=function(){var e=this._writableState;e.corked&&(e.corked--,!e.writing&&!e.corked&&!e.bufferProcessing&&e.bufferedRequest&&C(this,e))},l.prototype.setDefaultEncoding=function(e){if("string"==typeof e&&(e=e.toLowerCase()),!(-1<["hex","utf8","utf-8","ascii","binary","base64","ucs2","ucs-2","utf16le","utf-16le","raw"].indexOf((e+"").toLowerCase())))throw new H(e);return this._writableState.defaultEncoding=e,this},Object.defineProperty(l.prototype,"writableBuffer",{enumerable:!1,get:function(){return this._writableState&&this._writableState.getBuffer()}}),Object.defineProperty(l.prototype,"writableHighWaterMark",{enumerable:!1,get:function(){return this._writableState.highWaterMark}}),l.prototype._write=function(e,t,n){n(new O("_write()"))},l.prototype._writev=null,l.prototype.end=function(e,t,n){var r=this._writableState;return"function"==typeof e?(n=e,e=null,t=null):"function"==typeof t&&(n=t,t=null),null!==e&&void 0!==e&&this.write(e,t),r.corked&&(r.corked=1,this.uncork()),r.ending||T(this,r,n),this},Object.defineProperty(l.prototype,"writableLength",{enumerable:!1,get:function(){return this._writableState.length}}),Object.defineProperty(l.prototype,"destroyed",{enumerable:!1,get:function(){return void 0!==this._writableState&&this._writableState.destroyed},set:function(e){this._writableState&&(this._writableState.destroyed=e)}}),l.prototype.destroy=I.destroy,l.prototype._undestroy=I.undestroy,l.prototype._destroy=function(e,t){t(e)}}).call(this,e("_process"),"undefined"==typeof global?"undefined"==typeof self?"undefined"==typeof window?{}:window:self:global)},{"../errors":14,"./_stream_duplex":16,"./internal/streams/destroy":23,"./internal/streams/state":26,"./internal/streams/stream":27,_process:11,buffer:3,inherits:9,"util-deprecate":31}],21:[function(e,t){(function(n){'use strict';function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){return{value:e,done:t}}function o(e){var t=e[c];if(null!==t){var n=e[_].read();null!==n&&(e[g]=null,e[c]=null,e[u]=null,t(a(n,!1)))}}function i(e){n.nextTick(o,e)}function d(e,t){return function(n,r){e.then(function(){return t[f]?void n(a(void 0,!0)):void t[h](n,r)},r)}}var s,l=e("./end-of-stream"),c=Symbol("lastResolve"),u=Symbol("lastReject"),p=Symbol("error"),f=Symbol("ended"),g=Symbol("lastPromise"),h=Symbol("handlePromise"),_=Symbol("stream"),m=Object.getPrototypeOf(function(){}),b=Object.setPrototypeOf((s={get stream(){return this[_]},next:function(){var e=this,t=this[p];if(null!==t)return Promise.reject(t);if(this[f])return Promise.resolve(a(void 0,!0));if(this[_].destroyed)return new Promise(function(t,r){n.nextTick(function(){e[p]?r(e[p]):t(a(void 0,!0))})});var r,o=this[g];if(o)r=new Promise(d(o,this));else{var i=this[_].read();if(null!==i)return Promise.resolve(a(i,!1));r=new Promise(this[h])}return this[g]=r,r}},r(s,Symbol.asyncIterator,function(){return this}),r(s,"return",function(){var e=this;return new Promise(function(t,n){e[_].destroy(null,function(e){return e?void n(e):void t(a(void 0,!0))})})}),s),m);t.exports=function(e){var t,n=Object.create(b,(t={},r(t,_,{value:e,writable:!0}),r(t,c,{value:null,writable:!0}),r(t,u,{value:null,writable:!0}),r(t,p,{value:null,writable:!0}),r(t,f,{value:e._readableState.endEmitted,writable:!0}),r(t,h,{value:function(e,t){var r=n[_].read();r?(n[g]=null,n[c]=null,n[u]=null,e(a(r,!1))):(n[c]=e,n[u]=t)},writable:!0}),t));return n[g]=null,l(e,function(e){if(e&&"ERR_STREAM_PREMATURE_CLOSE"!==e.code){var t=n[u];return null!==t&&(n[g]=null,n[c]=null,n[u]=null,t(e)),void(n[p]=e)}var r=n[c];null!==r&&(n[g]=null,n[c]=null,n[u]=null,r(a(void 0,!0))),n[f]=!0}),e.on("readable",i.bind(null,n)),n}}).call(this,e("_process"))},{"./end-of-stream":24,_process:11}],22:[function(e,t){'use strict';function n(e){for(var t=1;t<arguments.length;t++){var n=null==arguments[t]?{}:arguments[t],a=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(a=a.concat(Object.getOwnPropertySymbols(n).filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),a.forEach(function(t){r(e,t,n[t])})}return e}function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t,n){d.prototype.copy.call(e,t,n)}var o=e("buffer"),d=o.Buffer,s=e("util"),l=s.inspect,c=l&&l.custom||"inspect";t.exports=function(){function e(){this.head=null,this.tail=null,this.length=0}var t=e.prototype;return t.push=function(e){var t={data:e,next:null};0<this.length?this.tail.next=t:this.head=t,this.tail=t,++this.length},t.unshift=function(e){var t={data:e,next:this.head};0===this.length&&(this.tail=t),this.head=t,++this.length},t.shift=function(){if(0!==this.length){var e=this.head.data;return this.head=1===this.length?this.tail=null:this.head.next,--this.length,e}},t.clear=function(){this.head=this.tail=null,this.length=0},t.join=function(e){if(0===this.length)return"";for(var t=this.head,n=""+t.data;t=t.next;)n+=e+t.data;return n},t.concat=function(e){if(0===this.length)return d.alloc(0);for(var t=d.allocUnsafe(e>>>0),n=this.head,r=0;n;)a(n.data,t,r),r+=n.data.length,n=n.next;return t},t.consume=function(e,t){var n;return e<this.head.data.length?(n=this.head.data.slice(0,e),this.head.data=this.head.data.slice(e)):e===this.head.data.length?n=this.shift():n=t?this._getString(e):this._getBuffer(e),n},t.first=function(){return this.head.data},t._getString=function(e){var t=this.head,r=1,a=t.data;for(e-=a.length;t=t.next;){var o=t.data,i=e>o.length?o.length:e;if(a+=i===o.length?o:o.slice(0,e),e-=i,0===e){i===o.length?(++r,this.head=t.next?t.next:this.tail=null):(this.head=t,t.data=o.slice(i));break}++r}return this.length-=r,a},t._getBuffer=function(e){var t=d.allocUnsafe(e),r=this.head,a=1;for(r.data.copy(t),e-=r.data.length;r=r.next;){var o=r.data,i=e>o.length?o.length:e;if(o.copy(t,t.length-e,0,i),e-=i,0===e){i===o.length?(++a,this.head=r.next?r.next:this.tail=null):(this.head=r,r.data=o.slice(i));break}++a}return this.length-=a,t},t[c]=function(e,t){return l(this,n({},t,{depth:0,customInspect:!1}))},e}()},{buffer:3,util:2}],23:[function(e,t){(function(e){'use strict';function n(e,t){a(e,t),r(e)}function r(e){e._writableState&&!e._writableState.emitClose||e._readableState&&!e._readableState.emitClose||e.emit("close")}function a(e,t){e.emit("error",t)}t.exports={destroy:function(t,o){var i=this,d=this._readableState&&this._readableState.destroyed,s=this._writableState&&this._writableState.destroyed;return d||s?(o?o(t):t&&(!this._writableState||!this._writableState.errorEmitted)&&e.nextTick(a,this,t),this):(this._readableState&&(this._readableState.destroyed=!0),this._writableState&&(this._writableState.destroyed=!0),this._destroy(t||null,function(t){!o&&t?(e.nextTick(n,i,t),i._writableState&&(i._writableState.errorEmitted=!0)):o?(e.nextTick(r,i),o(t)):e.nextTick(r,i)}),this)},undestroy:function(){this._readableState&&(this._readableState.destroyed=!1,this._readableState.reading=!1,this._readableState.ended=!1,this._readableState.endEmitted=!1),this._writableState&&(this._writableState.destroyed=!1,this._writableState.ended=!1,this._writableState.ending=!1,this._writableState.finalCalled=!1,this._writableState.prefinished=!1,this._writableState.finished=!1,this._writableState.errorEmitted=!1)}}}).call(this,e("_process"))},{_process:11}],24:[function(e,t){'use strict';function n(e){var t=!1;return function(){if(!t){t=!0;for(var n=arguments.length,r=Array(n),a=0;a<n;a++)r[a]=arguments[a];e.apply(this,r)}}}function r(){}function a(e){return e.setHeader&&"function"==typeof e.abort}function o(e,t,d){if("function"==typeof t)return o(e,null,t);t||(t={}),d=n(d||r);var s=t.readable||!1!==t.readable&&e.readable,l=t.writable||!1!==t.writable&&e.writable,c=function(){e.writable||p()},u=e._writableState&&e._writableState.finished,p=function(){l=!1,u=!0,s||d.call(e)},f=e._readableState&&e._readableState.endEmitted,g=function(){s=!1,f=!0,l||d.call(e)},h=function(t){d.call(e,t)},_=function(){var t;return s&&!f?(e._readableState&&e._readableState.ended||(t=new i),d.call(e,t)):l&&!u?(e._writableState&&e._writableState.ended||(t=new i),d.call(e,t)):void 0},m=function(){e.req.on("finish",p)};return a(e)?(e.on("complete",p),e.on("abort",_),e.req?m():e.on("request",m)):l&&!e._writableState&&(e.on("end",c),e.on("close",c)),e.on("end",g),e.on("finish",p),!1!==t.error&&e.on("error",h),e.on("close",_),function(){e.removeListener("complete",p),e.removeListener("abort",_),e.removeListener("request",m),e.req&&e.req.removeListener("finish",p),e.removeListener("end",c),e.removeListener("close",c),e.removeListener("finish",p),e.removeListener("end",g),e.removeListener("error",h),e.removeListener("close",_)}}var i=e("../../../errors").codes.ERR_STREAM_PREMATURE_CLOSE;t.exports=o},{"../../../errors":14}],25:[function(e,t){'use strict';function n(e){var t=!1;return function(){t||(t=!0,e.apply(void 0,arguments))}}function r(e){if(e)throw e}function a(e){return e.setHeader&&"function"==typeof e.abort}function o(t,r,o,i){i=n(i);var d=!1;t.on("close",function(){d=!0}),l===void 0&&(l=e("./end-of-stream")),l(t,{readable:r,writable:o},function(e){return e?i(e):void(d=!0,i())});var s=!1;return function(e){if(!d)return s?void 0:(s=!0,a(t)?t.abort():"function"==typeof t.destroy?t.destroy():void i(e||new p("pipe")))}}function i(e){e()}function d(e,t){return e.pipe(t)}function s(e){return e.length?"function"==typeof e[e.length-1]?e.pop():r:r}var l,c=e("../../../errors").codes,u=c.ERR_MISSING_ARGS,p=c.ERR_STREAM_DESTROYED;t.exports=function(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];var r=s(t);if(Array.isArray(t[0])&&(t=t[0]),2>t.length)throw new u("streams");var a,l=t.map(function(e,n){var d=n<t.length-1;return o(e,d,0<n,function(e){a||(a=e),e&&l.forEach(i),d||(l.forEach(i),r(a))})});return t.reduce(d)}},{"../../../errors":14,"./end-of-stream":24}],26:[function(e,n){'use strict';function r(e,t,n){return null==e.highWaterMark?t?e[n]:null:e.highWaterMark}var a=e("../../../errors").codes.ERR_INVALID_OPT_VALUE;n.exports={getHighWaterMark:function(e,n,o,i){var d=r(n,i,o);if(null!=d){if(!(isFinite(d)&&t(d)===d)||0>d){var s=i?o:"highWaterMark";throw new a(s,d)}return t(d)}return e.objectMode?16:16384}}},{"../../../errors":14}],27:[function(e,t){t.exports=e("events").EventEmitter},{events:6}],28:[function(e,t,n){n=t.exports=e("./lib/_stream_readable.js"),n.Stream=n,n.Readable=n,n.Writable=e("./lib/_stream_writable.js"),n.Duplex=e("./lib/_stream_duplex.js"),n.Transform=e("./lib/_stream_transform.js"),n.PassThrough=e("./lib/_stream_passthrough.js"),n.finished=e("./lib/internal/streams/end-of-stream.js"),n.pipeline=e("./lib/internal/streams/pipeline.js")},{"./lib/_stream_duplex.js":16,"./lib/_stream_passthrough.js":17,"./lib/_stream_readable.js":18,"./lib/_stream_transform.js":19,"./lib/_stream_writable.js":20,"./lib/internal/streams/end-of-stream.js":24,"./lib/internal/streams/pipeline.js":25}],29:[function(e,t,n){function r(e,t){for(var n in e)t[n]=e[n]}function a(e,t,n){return i(e,t,n)}var o=e("buffer"),i=o.Buffer;i.from&&i.alloc&&i.allocUnsafe&&i.allocUnsafeSlow?t.exports=o:(r(o,n),n.Buffer=a),a.prototype=Object.create(i.prototype),r(i,a),a.from=function(e,t,n){if("number"==typeof e)throw new TypeError("Argument must not be a number");return i(e,t,n)},a.alloc=function(e,t,n){if("number"!=typeof e)throw new TypeError("Argument must be a number");var r=i(e);return void 0===t?r.fill(0):"string"==typeof n?r.fill(t,n):r.fill(t),r},a.allocUnsafe=function(e){if("number"!=typeof e)throw new TypeError("Argument must be a number");return i(e)},a.allocUnsafeSlow=function(e){if("number"!=typeof e)throw new TypeError("Argument must be a number");return o.SlowBuffer(e)}},{buffer:3}],30:[function(e,t,n){'use strict';function r(e){if(!e)return"utf8";for(var t;;)switch(e){case"utf8":case"utf-8":return"utf8";case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return"utf16le";case"latin1":case"binary":return"latin1";case"base64":case"ascii":case"hex":return e;default:if(t)return;e=(""+e).toLowerCase(),t=!0;}}function a(e){var t=r(e);if("string"!=typeof t&&(m.isEncoding===b||!b(e)))throw new Error("Unknown encoding: "+e);return t||e}function o(e){this.encoding=a(e);var t;switch(this.encoding){case"utf16le":this.text=u,this.end=p,t=4;break;case"utf8":this.fillLast=c,t=4;break;case"base64":this.text=f,this.end=g,t=3;break;default:return this.write=h,void(this.end=_);}this.lastNeed=0,this.lastTotal=0,this.lastChar=m.allocUnsafe(t)}function d(e){if(127>=e)return 0;return 6==e>>5?2:14==e>>4?3:30==e>>3?4:2==e>>6?-1:-2}function s(e,t,n){var r=t.length-1;if(r<n)return 0;var a=d(t[r]);return 0<=a?(0<a&&(e.lastNeed=a-1),a):--r<n||-2===a?0:(a=d(t[r]),0<=a)?(0<a&&(e.lastNeed=a-2),a):--r<n||-2===a?0:(a=d(t[r]),0<=a?(0<a&&(2===a?a=0:e.lastNeed=a-3),a):0)}function l(e,t){if(128!=(192&t[0]))return e.lastNeed=0,"\uFFFD";if(1<e.lastNeed&&1<t.length){if(128!=(192&t[1]))return e.lastNeed=1,"\uFFFD";if(2<e.lastNeed&&2<t.length&&128!=(192&t[2]))return e.lastNeed=2,"\uFFFD"}}function c(e){var t=this.lastTotal-this.lastNeed,n=l(this,e,t);return void 0===n?this.lastNeed<=e.length?(e.copy(this.lastChar,t,0,this.lastNeed),this.lastChar.toString(this.encoding,0,this.lastTotal)):void(e.copy(this.lastChar,t,0,e.length),this.lastNeed-=e.length):n}function u(e,t){if(0==(e.length-t)%2){var n=e.toString("utf16le",t);if(n){var r=n.charCodeAt(n.length-1);if(55296<=r&&56319>=r)return this.lastNeed=2,this.lastTotal=4,this.lastChar[0]=e[e.length-2],this.lastChar[1]=e[e.length-1],n.slice(0,-1)}return n}return this.lastNeed=1,this.lastTotal=2,this.lastChar[0]=e[e.length-1],e.toString("utf16le",t,e.length-1)}function p(e){var t=e&&e.length?this.write(e):"";if(this.lastNeed){var n=this.lastTotal-this.lastNeed;return t+this.lastChar.toString("utf16le",0,n)}return t}function f(e,t){var r=(e.length-t)%3;return 0==r?e.toString("base64",t):(this.lastNeed=3-r,this.lastTotal=3,1==r?this.lastChar[0]=e[e.length-1]:(this.lastChar[0]=e[e.length-2],this.lastChar[1]=e[e.length-1]),e.toString("base64",t,e.length-r))}function g(e){var t=e&&e.length?this.write(e):"";return this.lastNeed?t+this.lastChar.toString("base64",0,3-this.lastNeed):t}function h(e){return e.toString(this.encoding)}function _(e){return e&&e.length?this.write(e):""}var m=e("safe-buffer").Buffer,b=m.isEncoding||function(e){switch(e=""+e,e&&e.toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":case"raw":return!0;default:return!1;}};n.StringDecoder=o,o.prototype.write=function(e){if(0===e.length)return"";var t,n;if(this.lastNeed){if(t=this.fillLast(e),void 0===t)return"";n=this.lastNeed,this.lastNeed=0}else n=0;return n<e.length?t?t+this.text(e,n):this.text(e,n):t||""},o.prototype.end=function(e){var t=e&&e.length?this.write(e):"";return this.lastNeed?t+"\uFFFD":t},o.prototype.text=function(e,t){var n=s(this,e,t);if(!this.lastNeed)return e.toString("utf8",t);this.lastTotal=n;var r=e.length-(n-this.lastNeed);return e.copy(this.lastChar,0,r),e.toString("utf8",t,r)},o.prototype.fillLast=function(e){return this.lastNeed<=e.length?(e.copy(this.lastChar,this.lastTotal-this.lastNeed,0,this.lastNeed),this.lastChar.toString(this.encoding,0,this.lastTotal)):void(e.copy(this.lastChar,this.lastTotal-this.lastNeed,0,e.length),this.lastNeed-=e.length)}},{"safe-buffer":29}],31:[function(e,t){(function(e){function n(t){try{if(!e.localStorage)return!1}catch(e){return!1}var n=e.localStorage[t];return null!=n&&"true"===(n+"").toLowerCase()}t.exports=function(e,t){function r(){if(!a){if(n("throwDeprecation"))throw new Error(t);else n("traceDeprecation")?console.trace(t):console.warn(t);a=!0}return e.apply(this,arguments)}if(n("noDeprecation"))return e;var a=!1;return r}}).call(this,"undefined"==typeof global?"undefined"==typeof self?"undefined"==typeof window?{}:window:self:global)},{}],"/":[function(e,t){(function(n){function r(e){return e.replace(/a=ice-options:trickle\s\n/g,"")}function a(e,t){var n=new Error(e);return n.code=t,n}function o(e){console.warn(e)}var i=e("debug")("simple-peer"),d=e("get-browser-rtc"),s=e("randombytes"),l=e("readable-stream"),c=e("queue-microtask"),u=65536;class p extends l.Duplex{constructor(e){if(e=Object.assign({allowHalfOpen:!1},e),super(e),this._id=s(4).toString("hex").slice(0,7),this._debug("new peer %o",e),this.channelName=e.initiator?e.channelName||s(20).toString("hex"):null,this.initiator=e.initiator||!1,this.channelConfig=e.channelConfig||p.channelConfig,this.config=Object.assign({},p.config,e.config),this.offerOptions=e.offerOptions||{},this.answerOptions=e.answerOptions||{},this.sdpTransform=e.sdpTransform||(e=>e),this.streams=e.streams||(e.stream?[e.stream]:[]),this.trickle=void 0===e.trickle||e.trickle,this.allowHalfTrickle=void 0!==e.allowHalfTrickle&&e.allowHalfTrickle,this.iceCompleteTimeout=e.iceCompleteTimeout||5000,this.destroyed=!1,this._connected=!1,this.remoteAddress=void 0,this.remoteFamily=void 0,this.remotePort=void 0,this.localAddress=void 0,this.localFamily=void 0,this.localPort=void 0,this._wrtc=e.wrtc&&"object"==typeof e.wrtc?e.wrtc:d(),!this._wrtc)if("undefined"==typeof window)throw a("No WebRTC support: Specify `opts.wrtc` option in this environment","ERR_WEBRTC_SUPPORT");else throw a("No WebRTC support: Not a supported browser","ERR_WEBRTC_SUPPORT");this._pcReady=!1,this._channelReady=!1,this._iceComplete=!1,this._iceCompleteTimer=null,this._channel=null,this._pendingCandidates=[],this._isNegotiating=!this.initiator,this._batchedNegotiation=!1,this._queuedNegotiation=!1,this._sendersAwaitingStable=[],this._senderMap=new Map,this._firstStable=!0,this._closingInterval=null,this._remoteTracks=[],this._remoteStreams=[],this._chunk=null,this._cb=null,this._interval=null;try{this._pc=new this._wrtc.RTCPeerConnection(this.config)}catch(e){return void c(()=>this.destroy(a(e,"ERR_PC_CONSTRUCTOR")))}this._isReactNativeWebrtc="number"==typeof this._pc._peerConnectionId,this._pc.oniceconnectionstatechange=()=>{this._onIceStateChange()},this._pc.onicegatheringstatechange=()=>{this._onIceStateChange()},this._pc.onconnectionstatechange=()=>{this._onConnectionStateChange()},this._pc.onsignalingstatechange=()=>{this._onSignalingStateChange()},this._pc.onicecandidate=e=>{this._onIceCandidate(e)},this.initiator?this._setupData({channel:this._pc.createDataChannel(this.channelName,this.channelConfig)}):this._pc.ondatachannel=e=>{this._setupData(e)},this.streams&&this.streams.forEach(e=>{this.addStream(e)}),this._pc.ontrack=e=>{this._onTrack(e)},this.initiator&&this._needsNegotiation(),this._onFinishBound=()=>{this._onFinish()},this.once("finish",this._onFinishBound)}get bufferSize(){return this._channel&&this._channel.bufferedAmount||0}get connected(){return this._connected&&"open"===this._channel.readyState}address(){return{port:this.localPort,family:this.localFamily,address:this.localAddress}}signal(e){if(this.destroyed)throw a("cannot signal after peer is destroyed","ERR_SIGNALING");if("string"==typeof e)try{e=JSON.parse(e)}catch(t){e={}}this._debug("signal()"),e.renegotiate&&this.initiator&&(this._debug("got request to renegotiate"),this._needsNegotiation()),e.transceiverRequest&&this.initiator&&(this._debug("got request for transceiver"),this.addTransceiver(e.transceiverRequest.kind,e.transceiverRequest.init)),e.candidate&&(this._pc.remoteDescription&&this._pc.remoteDescription.type?this._addIceCandidate(e.candidate):this._pendingCandidates.push(e.candidate)),e.sdp&&this._pc.setRemoteDescription(new this._wrtc.RTCSessionDescription(e)).then(()=>{this.destroyed||(this._pendingCandidates.forEach(e=>{this._addIceCandidate(e)}),this._pendingCandidates=[],"offer"===this._pc.remoteDescription.type&&this._createAnswer())}).catch(e=>{this.destroy(a(e,"ERR_SET_REMOTE_DESCRIPTION"))}),e.sdp||e.candidate||e.renegotiate||e.transceiverRequest||this.destroy(a("signal() called with invalid signal data","ERR_SIGNALING"))}_addIceCandidate(e){var t=new this._wrtc.RTCIceCandidate(e);this._pc.addIceCandidate(t).catch(e=>{!t.address||t.address.endsWith(".local")?o("Ignoring unsupported ICE candidate."):this.destroy(a(e,"ERR_ADD_ICE_CANDIDATE"))})}send(e){this._channel.send(e)}addTransceiver(e,t){if(this._debug("addTransceiver()"),this.initiator)try{this._pc.addTransceiver(e,t),this._needsNegotiation()}catch(e){this.destroy(a(e,"ERR_ADD_TRANSCEIVER"))}else this.emit("signal",{transceiverRequest:{kind:e,init:t}})}addStream(e){this._debug("addStream()"),e.getTracks().forEach(t=>{this.addTrack(t,e)})}addTrack(e,t){this._debug("addTrack()");var n=this._senderMap.get(e)||new Map,r=n.get(t);if(!r)r=this._pc.addTrack(e,t),n.set(t,r),this._senderMap.set(e,n),this._needsNegotiation();else if(r.removed)throw a("Track has been removed. You should enable/disable tracks that you want to re-add.","ERR_SENDER_REMOVED");else throw a("Track has already been added to that stream.","ERR_SENDER_ALREADY_ADDED")}replaceTrack(e,t,n){this._debug("replaceTrack()");var r=this._senderMap.get(e),o=r?r.get(n):null;if(!o)throw a("Cannot replace track that was never added.","ERR_TRACK_NOT_ADDED");t&&this._senderMap.set(t,r),null==o.replaceTrack?this.destroy(a("replaceTrack is not supported in this browser","ERR_UNSUPPORTED_REPLACETRACK")):o.replaceTrack(t)}removeTrack(e,t){this._debug("removeSender()");var n=this._senderMap.get(e),r=n?n.get(t):null;if(!r)throw a("Cannot remove track that was never added.","ERR_TRACK_NOT_ADDED");try{r.removed=!0,this._pc.removeTrack(r)}catch(e){"NS_ERROR_UNEXPECTED"===e.name?this._sendersAwaitingStable.push(r):this.destroy(a(e,"ERR_REMOVE_TRACK"))}this._needsNegotiation()}removeStream(e){this._debug("removeSenders()"),e.getTracks().forEach(t=>{this.removeTrack(t,e)})}_needsNegotiation(){this._debug("_needsNegotiation"),this._batchedNegotiation||(this._batchedNegotiation=!0,c(()=>{this._batchedNegotiation=!1,this._debug("starting batched negotiation"),this.negotiate()}))}negotiate(){this.initiator?this._isNegotiating?(this._queuedNegotiation=!0,this._debug("already negotiating, queueing")):(this._debug("start negotiation"),setTimeout(()=>{this._createOffer()},0)):!this._isNegotiating&&(this._debug("requesting negotiation from initiator"),this.emit("signal",{renegotiate:!0})),this._isNegotiating=!0}destroy(e){this._destroy(e,()=>{})}_destroy(e,t){if(!this.destroyed){if(this._debug("destroy (error: %s)",e&&(e.message||e)),this.readable=this.writable=!1,this._readableState.ended||this.push(null),this._writableState.finished||this.end(),this.destroyed=!0,this._connected=!1,this._pcReady=!1,this._channelReady=!1,this._remoteTracks=null,this._remoteStreams=null,this._senderMap=null,clearInterval(this._closingInterval),this._closingInterval=null,clearInterval(this._interval),this._interval=null,this._chunk=null,this._cb=null,this._onFinishBound&&this.removeListener("finish",this._onFinishBound),this._onFinishBound=null,this._channel){try{this._channel.close()}catch(e){}this._channel.onmessage=null,this._channel.onopen=null,this._channel.onclose=null,this._channel.onerror=null}if(this._pc){try{this._pc.close()}catch(e){}this._pc.oniceconnectionstatechange=null,this._pc.onicegatheringstatechange=null,this._pc.onsignalingstatechange=null,this._pc.onicecandidate=null,this._pc.ontrack=null,this._pc.ondatachannel=null}this._pc=null,this._channel=null,e&&this.emit("error",e),this.emit("close"),t()}}_setupData(e){if(!e.channel)return this.destroy(a("Data channel event is missing `channel` property","ERR_DATA_CHANNEL"));this._channel=e.channel,this._channel.binaryType="arraybuffer","number"==typeof this._channel.bufferedAmountLowThreshold&&(this._channel.bufferedAmountLowThreshold=u),this.channelName=this._channel.label,this._channel.onmessage=e=>{this._onChannelMessage(e)},this._channel.onbufferedamountlow=()=>{this._onChannelBufferedAmountLow()},this._channel.onopen=()=>{this._onChannelOpen()},this._channel.onclose=()=>{this._onChannelClose()},this._channel.onerror=e=>{this.destroy(a(e,"ERR_DATA_CHANNEL"))};var t=!1;this._closingInterval=setInterval(()=>{this._channel&&"closing"===this._channel.readyState?(t&&this._onChannelClose(),t=!0):t=!1},5000)}_read(){}_write(e,t,n){if(this.destroyed)return n(a("cannot write after peer is destroyed","ERR_DATA_CHANNEL"));if(this._connected){try{this.send(e)}catch(e){return this.destroy(a(e,"ERR_DATA_CHANNEL"))}this._channel.bufferedAmount>u?(this._debug("start backpressure: bufferedAmount %d",this._channel.bufferedAmount),this._cb=n):n(null)}else this._debug("write before connect"),this._chunk=e,this._cb=n}_onFinish(){if(!this.destroyed){const e=()=>{setTimeout(()=>this.destroy(),1e3)};this._connected?e():this.once("connect",e)}}_startIceCompleteTimeout(){this.destroyed||this._iceCompleteTimer||(this._debug("started iceComplete timeout"),this._iceCompleteTimer=setTimeout(()=>{this._iceComplete||(this._iceComplete=!0,this._debug("iceComplete timeout completed"),this.emit("iceTimeout"),this.emit("_iceComplete"))},this.iceCompleteTimeout))}_createOffer(){this.destroyed||this._pc.createOffer(this.offerOptions).then(e=>{if(this.destroyed)return;this.trickle||this.allowHalfTrickle||(e.sdp=r(e.sdp)),e.sdp=this.sdpTransform(e.sdp);const t=()=>{if(!this.destroyed){var t=this._pc.localDescription||e;this._debug("signal"),this.emit("signal",{type:t.type,sdp:t.sdp})}};this._pc.setLocalDescription(e).then(()=>{this._debug("createOffer success"),this.destroyed||(this.trickle||this._iceComplete?t():this.once("_iceComplete",t))}).catch(e=>{this.destroy(a(e,"ERR_SET_LOCAL_DESCRIPTION"))})}).catch(e=>{this.destroy(a(e,"ERR_CREATE_OFFER"))})}_requestMissingTransceivers(){this._pc.getTransceivers&&this._pc.getTransceivers().forEach(e=>{e.mid||!e.sender.track||e.requested||(e.requested=!0,this.addTransceiver(e.sender.track.kind))})}_createAnswer(){this.destroyed||this._pc.createAnswer(this.answerOptions).then(e=>{if(this.destroyed)return;this.trickle||this.allowHalfTrickle||(e.sdp=r(e.sdp)),e.sdp=this.sdpTransform(e.sdp);const t=()=>{if(!this.destroyed){var t=this._pc.localDescription||e;this._debug("signal"),this.emit("signal",{type:t.type,sdp:t.sdp}),this.initiator||this._requestMissingTransceivers()}};this._pc.setLocalDescription(e).then(()=>{this.destroyed||(this.trickle||this._iceComplete?t():this.once("_iceComplete",t))}).catch(e=>{this.destroy(a(e,"ERR_SET_LOCAL_DESCRIPTION"))})}).catch(e=>{this.destroy(a(e,"ERR_CREATE_ANSWER"))})}_onConnectionStateChange(){this.destroyed||"failed"===this._pc.connectionState&&this.destroy(a("Connection failed.","ERR_CONNECTION_FAILURE"))}_onIceStateChange(){if(!this.destroyed){var e=this._pc.iceConnectionState,t=this._pc.iceGatheringState;this._debug("iceStateChange (connection: %s) (gathering: %s)",e,t),this.emit("iceStateChange",e,t),("connected"===e||"completed"===e)&&(this._pcReady=!0,this._maybeReady()),"failed"===e&&this.destroy(a("Ice connection failed.","ERR_ICE_CONNECTION_FAILURE")),"closed"===e&&this.destroy(a("Ice connection closed.","ERR_ICE_CONNECTION_CLOSED"))}}getStats(e){const t=e=>("[object Array]"===Object.prototype.toString.call(e.values)&&e.values.forEach(t=>{Object.assign(e,t)}),e);0===this._pc.getStats.length||this._isReactNativeWebrtc?this._pc.getStats().then(n=>{var r=[];n.forEach(e=>{r.push(t(e))}),e(null,r)},t=>e(t)):0<this._pc.getStats.length?this._pc.getStats(n=>{if(!this.destroyed){var r=[];n.result().forEach(e=>{var n={};e.names().forEach(t=>{n[t]=e.stat(t)}),n.id=e.id,n.type=e.type,n.timestamp=e.timestamp,r.push(t(n))}),e(null,r)}},t=>e(t)):e(null,[])}_maybeReady(){if(this._debug("maybeReady pc %s channel %s",this._pcReady,this._channelReady),this._connected||this._connecting||!this._pcReady||!this._channelReady)return;this._connecting=!0;const e=()=>{this.destroyed||this.getStats((t,n)=>{if(this.destroyed)return;t&&(n=[]);var r={},o={},i={},d=!1;n.forEach(e=>{("remotecandidate"===e.type||"remote-candidate"===e.type)&&(r[e.id]=e),("localcandidate"===e.type||"local-candidate"===e.type)&&(o[e.id]=e),("candidatepair"===e.type||"candidate-pair"===e.type)&&(i[e.id]=e)});const s=e=>{d=!0;var t=o[e.localCandidateId];t&&(t.ip||t.address)?(this.localAddress=t.ip||t.address,this.localPort=+t.port):t&&t.ipAddress?(this.localAddress=t.ipAddress,this.localPort=+t.portNumber):"string"==typeof e.googLocalAddress&&(t=e.googLocalAddress.split(":"),this.localAddress=t[0],this.localPort=+t[1]),this.localAddress&&(this.localFamily=this.localAddress.includes(":")?"IPv6":"IPv4");var n=r[e.remoteCandidateId];n&&(n.ip||n.address)?(this.remoteAddress=n.ip||n.address,this.remotePort=+n.port):n&&n.ipAddress?(this.remoteAddress=n.ipAddress,this.remotePort=+n.portNumber):"string"==typeof e.googRemoteAddress&&(n=e.googRemoteAddress.split(":"),this.remoteAddress=n[0],this.remotePort=+n[1]),this.remoteAddress&&(this.remoteFamily=this.remoteAddress.includes(":")?"IPv6":"IPv4"),this._debug("connect local: %s:%s remote: %s:%s",this.localAddress,this.localPort,this.remoteAddress,this.remotePort)};if(n.forEach(e=>{"transport"===e.type&&e.selectedCandidatePairId&&s(i[e.selectedCandidatePairId]),("googCandidatePair"===e.type&&"true"===e.googActiveConnection||("candidatepair"===e.type||"candidate-pair"===e.type)&&e.selected)&&s(e)}),!d&&(!Object.keys(i).length||Object.keys(o).length))return void setTimeout(e,100);if(this._connecting=!1,this._connected=!0,this._chunk){try{this.send(this._chunk)}catch(e){return this.destroy(a(e,"ERR_DATA_CHANNEL"))}this._chunk=null,this._debug("sent chunk from \"write before connect\"");var l=this._cb;this._cb=null,l(null)}"number"!=typeof this._channel.bufferedAmountLowThreshold&&(this._interval=setInterval(()=>this._onInterval(),150),this._interval.unref&&this._interval.unref()),this._debug("connect"),this.emit("connect")})};e()}_onInterval(){this._cb&&this._channel&&!(this._channel.bufferedAmount>u)&&this._onChannelBufferedAmountLow()}_onSignalingStateChange(){this.destroyed||("stable"===this._pc.signalingState&&!this._firstStable&&(this._isNegotiating=!1,this._debug("flushing sender queue",this._sendersAwaitingStable),this._sendersAwaitingStable.forEach(e=>{this._pc.removeTrack(e),this._queuedNegotiation=!0}),this._sendersAwaitingStable=[],this._queuedNegotiation&&(this._debug("flushing negotiation queue"),this._queuedNegotiation=!1,this._needsNegotiation()),this._debug("negotiate"),this.emit("negotiate")),this._firstStable=!1,this._debug("signalingStateChange %s",this._pc.signalingState),this.emit("signalingStateChange",this._pc.signalingState))}_onIceCandidate(e){this.destroyed||(e.candidate&&this.trickle?this.emit("signal",{candidate:{candidate:e.candidate.candidate,sdpMLineIndex:e.candidate.sdpMLineIndex,sdpMid:e.candidate.sdpMid}}):!e.candidate&&!this._iceComplete&&(this._iceComplete=!0,this.emit("_iceComplete")),e.candidate&&this._startIceCompleteTimeout())}_onChannelMessage(e){if(!this.destroyed){var t=e.data;t instanceof ArrayBuffer&&(t=n.from(t)),this.push(t)}}_onChannelBufferedAmountLow(){if(!this.destroyed&&this._cb){this._debug("ending backpressure: bufferedAmount %d",this._channel.bufferedAmount);var e=this._cb;this._cb=null,e(null)}}_onChannelOpen(){this._connected||this.destroyed||(this._debug("on channel open"),this._channelReady=!0,this._maybeReady())}_onChannelClose(){this.destroyed||(this._debug("on channel close"),this.destroy())}_onTrack(e){this.destroyed||e.streams.forEach(t=>{this._debug("on track"),this.emit("track",e.track,t),this._remoteTracks.push({track:e.track,stream:t}),this._remoteStreams.some(e=>e.id===t.id)||(this._remoteStreams.push(t),c(()=>{this.emit("stream",t)}))})}_debug(){var e=[].slice.call(arguments);e[0]="["+this._id+"] "+e[0],i.apply(null,e)}}p.WEBRTC_SUPPORT=!!d(),p.config={iceServers:[{urls:"stun:stun.l.google.com:19302"},{urls:"stun:global.stun.twilio.com:3478?transport=udp"}],sdpSemantics:"unified-plan"},p.channelConfig={},t.exports=p}).call(this,e("buffer").Buffer)},{buffer:3,debug:4,"get-browser-rtc":7,"queue-microtask":12,randombytes:13,"readable-stream":28}]},{},[])("/")});

if (OY_NODE_STATE===true) {
    console.log("NODE_MODE");
    perf = {now: function(start) {if ( !start ) return process.hrtime();let end = process.hrtime(start);return Math.round((end[0]*1000) + (end[1]/1000000));}}
    NodeEvent = require('events');
    SimplePeer = require('simple-peer');
    wrtc = require('wrtc');
}
else perf = performance;

// INIT
let OY_LIGHT_MODE = true;//seek to stay permanently connected to the mesh as a light node/latch, manipulable by the user
let OY_LIGHT_LEAN = false;
let OY_LIGHT_STATE = true;//immediate status of being a light node/latch, not manipulable by the user
let OY_DIVE_GRADE = false;
let OY_DIVE_PAYOUT = false;
let OY_DIVE_TEAM = false;
let OY_DIVE_STATE = false;
let OY_FULL_INTRO = "nodea1.oyster.org:8443";//default is false, TODO force set to false if not in nodejs mode
let OY_INTRO_DEFAULT = {
    "nodea1.oyster.org:8443":true,
    "nodea2.oyster.org:8443":true,
    "nodea3.oyster.org:8443":true,
    "nodea4.oyster.org:8443":true
};
let OY_INTRO_PUNISH = {};
let OY_INTRO_BAN = {};
let OY_INTRO_SELECT = null;
let OY_INTRO_SOLUTIONS = {};
let OY_INTRO_MARKER = null;
let OY_INTRO_PICKUP_COUNT = null;
let OY_INTRO_ALLOCATE = {};
let OY_INTRO_TAG = {};
let OY_PASSIVE_MODE = false;//console output is silenced, and no explicit inputs are expected
let OY_SIMULATOR_MODE = false;//run in node.js simulator, requires oystersimulate.js
let OY_EVENTS = {};
let OY_SELF_PRIVATE;//private key of node identity
let OY_SELF_PUBLIC;//public key of node identity
let OY_SELF_SHORT;//short representation of public key of node identity
let OY_CONSOLE;//custom function for handling console
let OY_MESH_MAP;//custom function for tracking mesh map
let OY_BLOCK_MAP;//custom function for tracking meshblock map
let OY_INIT = false;//prevents multiple instances of oy_init() from running simultaneously
let OY_COLLECT = {};//object for tracking pull fulfillments
let OY_CONSTRUCT = {};//data considered valid from OY_COLLECT is stored here, awaiting for final data reconstruction
let OY_DATA_PUSH = {};//object for tracking data push threads
let OY_DATA_PULL = {};//object for tracking data pull threads
let OY_PEERS = {};
let OY_PEERS_PRE = {};//tracks nodes that are almost peers, will become peers once PEER_AFFIRM is received from other node
let OY_PEER_OFFER = [null, null];
let OY_NODES = {};//P2P connection handling for individual nodes
let OY_COLD = {};//tracking connection shutdowns to specific nodes
let OY_OFFER_COUNTER = 0;
let OY_OFFER_COLLECT = {};
let OY_OFFER_PICKUP = [];
let OY_ROUTE_DYNAMIC = [];//tracks dynamic identifier for a routed data sequence
let OY_LATENCY = {};//handle latency sessions
let OY_PROPOSED = {};//nodes that have been recently proposed to for mutual peering
let OY_PUSH_HOLD = {};//holds data contents ready for pushing to mesh
let OY_PUSH_TALLY = {};//tracks data push nonces that were deposited on the mesh
let OY_BASE_BUILD = [];
let OY_JUMP_BUILD = [];
let OY_LIGHT_BUILD = {};
let OY_LIGHT_PROCESS = false;
let OY_WORKER_THREADS = [null, null];
let OY_WORKER_POINTER = [null, null];
let OY_LOGIC_ALL_TYPE = ["OY_DATA_PULL", "OY_CHANNEL_BROADCAST"];//OY_LOGIC_ALL definitions
let OY_WORK_SOLUTIONS = [null];
let OY_WORK_GRADES = [null];
let OY_WORK_BITS = [null];
let OY_BLOCK_JUDGE = [null];
let OY_BLOCK_LEARN = [null];
let OY_BLOCK_HASH = null;//hash of the most current block
let OY_BLOCK_FLAT = null;
let OY_BLOCK_COMPRESS = null;
let OY_BLOCK_DIFF = false;
let OY_BLOCK_SIGN = null;
let OY_BLOCK_TIME = oy_block_time_first();//the most recent block timestamp
let OY_BLOCK_NEXT = OY_BLOCK_TIME+OY_BLOCK_SECTORS[5][0];
let OY_BLOCK_BOOT = false;
let OY_BLOCK_UPTIME = null;
let OY_BLOCK_WEIGHT = null;
let OY_BLOCK_STABILITY = 0;
let OY_BLOCK_STABILITY_KEEP = [OY_BLOCK_RANGE_MIN];
let OY_BLOCK_COMMAND_NONCE = 0;
let OY_BLOCK_COMMAND = {};
let OY_BLOCK_COMMAND_SELF = {};
let OY_BLOCK_COMMAND_ROLLBACK = {};
let OY_BLOCK_SYNC = {};
let OY_BLOCK_SYNC_PASS = {};
let OY_BLOCK_WORK_GRADE = {};
let OY_BLOCK_RECORD = null;
let OY_BLOCK_RECORD_KEEP = [];
let OY_BLOCK_FINISH = false;
let OY_BLOCK_JUMP_MAP = {};
let OY_JUMP_ASSIGN = [null, null];//handle jump sessions
let OY_JUMP_PRE = {};
let OY_BLOCK_JUMP = null;
let OY_BLOCK_FLAT_JUMP = null;
let OY_BLOCK_HASH_JUMP = null;
let OY_BLOCK_TIME_JUMP = null;
let OY_BLOCK_NEXT_JUMP = null;
let OY_SYNC_LAST = [0, 0];
let OY_SYNC_MAP = [{}, {}];
let OY_SYNC_TALLY = {};
let OY_BLOCK_CHALLENGE = {};
let OY_BLOCK_NEW = {};
let OY_BLOCK_CONFIRM = {};
let OY_BLOCK_HALT = null;
let OY_DIFF_TRACK = [{}, []];
let OY_REPORT_HASH = null;
let OY_CHANNEL_DYNAMIC = {};//track channel broadcasts to ensure allowance compliance
let OY_CHANNEL_LISTEN = {};//track channels to listen for
let OY_CHANNEL_KEEP = {};//stored broadcasts that are re-shared
let OY_CHANNEL_ECHO = {};//track channels to listen for
let OY_CHANNEL_TOP = {};//track current channel topology
let OY_CHANNEL_RENDER = {};//track channel broadcasts that have been rendered
let OY_DB = null;
let OY_ERROR_BROWSER;

//EVENTS
oy_event_create("oy_peers_null", oy_block_reset);//trigger-able event for when peer_count == 0
oy_event_create("oy_peers_recover");//trigger-able event for when peer_count > 0
oy_event_create("oy_block_init");//trigger-able event for when a new block is issued
oy_event_create("oy_block_trigger");//trigger-able event for when a new block is issued
oy_event_create("oy_block_reset");//trigger-able event for when a new block is issued
oy_event_create("oy_state_blank");//trigger-able event for when self becomes blank
oy_event_create("oy_state_light");//trigger-able event for when self becomes a light node
oy_event_create("oy_state_full");//trigger-able event for when self becomes a full node

//WEB WORKER BLOCK
function oy_worker_cores() {
    if (window.navigator.hardwareConcurrency) return Math.max(OY_WORKER_CORES_FALLBACK, Math.floor(window.navigator.hardwareConcurrency));
    else return OY_WORKER_CORES_FALLBACK;
}

function oy_worker_point(oy_worker_type) {
    OY_WORKER_POINTER[oy_worker_type]++;
    if (OY_WORKER_POINTER[oy_worker_type]>=OY_WORKER_THREADS[oy_worker_type].length) OY_WORKER_POINTER[oy_worker_type] = 0;
    return OY_WORKER_POINTER[oy_worker_type];
}

function oy_worker_halt(oy_worker_type) {
    if (OY_WORKER_THREADS[oy_worker_type]===null) return false;

    for (let i in OY_WORKER_THREADS[oy_worker_type]) {
        OY_WORKER_THREADS[oy_worker_type][i].terminate();
    }
    OY_WORKER_THREADS[oy_worker_type] = null;
    OY_WORKER_POINTER[oy_worker_type] = null;
}

function oy_worker_spawn(oy_worker_type) {
    if (OY_WORKER_THREADS[oy_worker_type]!==null) return false;

    function oy_worker_internal(oy_static_data) {
        let oy_static_thru = JSON.parse(decodeURI(oy_static_data));
        let OY_WORK_MATCH = oy_static_thru[0];
        oy_static_thru[0] = undefined;

        //OYSTER DEPENDENCY TWEETNACL-JS
        //https://github.com/dchest/tweetnacl-js
        let nacl={};var u64=function(r,n){this.hi=0|r,this.lo=0|n},gf=function(r){var n,e=new Float64Array(16);if(r)for(n=0;n<r.length;n++)e[n]=r[n];return e},randombytes=function(){throw new Error("no PRNG")},_0=new Uint8Array(16),_9=new Uint8Array(32);_9[0]=9;var gf0=gf(),gf1=gf([1]),_121665=gf([56129,1]),D=gf([30883,4953,19914,30187,55467,16705,2637,112,59544,30585,16505,36039,65139,11119,27886,20995]),D2=gf([61785,9906,39828,60374,45398,33411,5274,224,53552,61171,33010,6542,64743,22239,55772,9222]),X=gf([54554,36645,11616,51542,42930,38181,51040,26924,56412,64982,57905,49316,21502,52590,14035,8553]),Y=gf([26200,26214,26214,26214,26214,26214,26214,26214,26214,26214,26214,26214,26214,26214,26214,26214]),I=gf([41136,18958,6951,50414,58488,44335,6150,12099,55207,15867,153,11085,57099,20417,9344,11139]);function L32(r,n){return r<<n|r>>>32-n}function ld32(r,n){var e=255&r[n+3];return(e=(e=e<<8|255&r[n+2])<<8|255&r[n+1])<<8|255&r[n+0]}function dl64(r,n){var e=r[n]<<24|r[n+1]<<16|r[n+2]<<8|r[n+3],t=r[n+4]<<24|r[n+5]<<16|r[n+6]<<8|r[n+7];return new u64(e,t)}function st32(r,n,e){var t;for(t=0;t<4;t++)r[n+t]=255&e,e>>>=8}function ts64(r,n,e){r[n]=e.hi>>24&255,r[n+1]=e.hi>>16&255,r[n+2]=e.hi>>8&255,r[n+3]=255&e.hi,r[n+4]=e.lo>>24&255,r[n+5]=e.lo>>16&255,r[n+6]=e.lo>>8&255,r[n+7]=255&e.lo}function vn(r,n,e,t,o){var c,a=0;for(c=0;c<o;c++)a|=r[n+c]^e[t+c];return(1&a-1>>>8)-1}function crypto_verify_16(r,n,e,t){return vn(r,n,e,t,16)}function crypto_verify_32(r,n,e,t){return vn(r,n,e,t,32)}function core(r,n,e,t,o){var c,a,_,y=new Uint32Array(16),i=new Uint32Array(16),s=new Uint32Array(16),u=new Uint32Array(4);for(c=0;c<4;c++)i[5*c]=ld32(t,4*c),i[1+c]=ld32(e,4*c),i[6+c]=ld32(n,4*c),i[11+c]=ld32(e,16+4*c);for(c=0;c<16;c++)s[c]=i[c];for(c=0;c<20;c++){for(a=0;a<4;a++){for(_=0;_<4;_++)u[_]=i[(5*a+4*_)%16];for(u[1]^=L32(u[0]+u[3]|0,7),u[2]^=L32(u[1]+u[0]|0,9),u[3]^=L32(u[2]+u[1]|0,13),u[0]^=L32(u[3]+u[2]|0,18),_=0;_<4;_++)y[4*a+(a+_)%4]=u[_]}for(_=0;_<16;_++)i[_]=y[_]}if(o){for(c=0;c<16;c++)i[c]=i[c]+s[c]|0;for(c=0;c<4;c++)i[5*c]=i[5*c]-ld32(t,4*c)|0,i[6+c]=i[6+c]-ld32(n,4*c)|0;for(c=0;c<4;c++)st32(r,4*c,i[5*c]),st32(r,16+4*c,i[6+c])}else for(c=0;c<16;c++)st32(r,4*c,i[c]+s[c]|0)}function crypto_core_salsa20(r,n,e,t){return core(r,n,e,t,!1),0}function crypto_core_hsalsa20(r,n,e,t){return core(r,n,e,t,!0),0}var sigma=new Uint8Array([101,120,112,97,110,100,32,51,50,45,98,121,116,101,32,107]);function crypto_stream_salsa20_xor(r,n,e,t,o,c,a){var _,y,i=new Uint8Array(16),s=new Uint8Array(64);if(!o)return 0;for(y=0;y<16;y++)i[y]=0;for(y=0;y<8;y++)i[y]=c[y];for(;o>=64;){for(crypto_core_salsa20(s,i,a,sigma),y=0;y<64;y++)r[n+y]=(e?e[t+y]:0)^s[y];for(_=1,y=8;y<16;y++)_=_+(255&i[y])|0,i[y]=255&_,_>>>=8;o-=64,n+=64,e&&(t+=64)}if(o>0)for(crypto_core_salsa20(s,i,a,sigma),y=0;y<o;y++)r[n+y]=(e?e[t+y]:0)^s[y];return 0}function crypto_stream_salsa20(r,n,e,t,o){return crypto_stream_salsa20_xor(r,n,null,0,e,t,o)}function crypto_stream(r,n,e,t,o){var c=new Uint8Array(32);return crypto_core_hsalsa20(c,t,o,sigma),crypto_stream_salsa20(r,n,e,t.subarray(16),c)}function crypto_stream_xor(r,n,e,t,o,c,a){var _=new Uint8Array(32);return crypto_core_hsalsa20(_,c,a,sigma),crypto_stream_salsa20_xor(r,n,e,t,o,c.subarray(16),_)}function add1305(r,n){var e,t=0;for(e=0;e<17;e++)t=t+(r[e]+n[e]|0)|0,r[e]=255&t,t>>>=8}var minusp=new Uint32Array([5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,252]);function crypto_onetimeauth(r,n,e,t,o,c){var a,_,y,i,s=new Uint32Array(17),u=new Uint32Array(17),f=new Uint32Array(17),p=new Uint32Array(17),l=new Uint32Array(17);for(y=0;y<17;y++)u[y]=f[y]=0;for(y=0;y<16;y++)u[y]=c[y];for(u[3]&=15,u[4]&=252,u[7]&=15,u[8]&=252,u[11]&=15,u[12]&=252,u[15]&=15;o>0;){for(y=0;y<17;y++)p[y]=0;for(y=0;y<16&&y<o;++y)p[y]=e[t+y];for(p[y]=1,t+=y,o-=y,add1305(f,p),_=0;_<17;_++)for(s[_]=0,y=0;y<17;y++)s[_]=0|s[_]+f[y]*(y<=_?u[_-y]:320*u[_+17-y]|0);for(_=0;_<17;_++)f[_]=s[_];for(i=0,y=0;y<16;y++)i=i+f[y]|0,f[y]=255&i,i>>>=8;for(i=i+f[16]|0,f[16]=3&i,i=5*(i>>>2)|0,y=0;y<16;y++)i=i+f[y]|0,f[y]=255&i,i>>>=8;i=i+f[16]|0,f[16]=i}for(y=0;y<17;y++)l[y]=f[y];for(add1305(f,minusp),a=0|-(f[16]>>>7),y=0;y<17;y++)f[y]^=a&(l[y]^f[y]);for(y=0;y<16;y++)p[y]=c[y+16];for(p[16]=0,add1305(f,p),y=0;y<16;y++)r[n+y]=f[y];return 0}function crypto_onetimeauth_verify(r,n,e,t,o,c){var a=new Uint8Array(16);return crypto_onetimeauth(a,0,e,t,o,c),crypto_verify_16(r,n,a,0)}function crypto_secretbox(r,n,e,t,o){var c;if(e<32)return-1;for(crypto_stream_xor(r,0,n,0,e,t,o),crypto_onetimeauth(r,16,r,32,e-32,r),c=0;c<16;c++)r[c]=0;return 0}function crypto_secretbox_open(r,n,e,t,o){var c,a=new Uint8Array(32);if(e<32)return-1;if(crypto_stream(a,0,32,t,o),0!==crypto_onetimeauth_verify(n,16,n,32,e-32,a))return-1;for(crypto_stream_xor(r,0,n,0,e,t,o),c=0;c<32;c++)r[c]=0;return 0}function set25519(r,n){var e;for(e=0;e<16;e++)r[e]=0|n[e]}function car25519(r){var n,e;for(e=0;e<16;e++)r[e]+=65536,n=Math.floor(r[e]/65536),r[(e+1)*(e<15?1:0)]+=n-1+37*(n-1)*(15===e?1:0),r[e]-=65536*n}function sel25519(r,n,e){for(var t,o=~(e-1),c=0;c<16;c++)t=o&(r[c]^n[c]),r[c]^=t,n[c]^=t}function pack25519(r,n){var e,t,o,c=gf(),a=gf();for(e=0;e<16;e++)a[e]=n[e];for(car25519(a),car25519(a),car25519(a),t=0;t<2;t++){for(c[0]=a[0]-65517,e=1;e<15;e++)c[e]=a[e]-65535-(c[e-1]>>16&1),c[e-1]&=65535;c[15]=a[15]-32767-(c[14]>>16&1),o=c[15]>>16&1,c[14]&=65535,sel25519(a,c,1-o)}for(e=0;e<16;e++)r[2*e]=255&a[e],r[2*e+1]=a[e]>>8}function neq25519(r,n){var e=new Uint8Array(32),t=new Uint8Array(32);return pack25519(e,r),pack25519(t,n),crypto_verify_32(e,0,t,0)}function par25519(r){var n=new Uint8Array(32);return pack25519(n,r),1&n[0]}function unpack25519(r,n){var e;for(e=0;e<16;e++)r[e]=n[2*e]+(n[2*e+1]<<8);r[15]&=32767}function A(r,n,e){var t;for(t=0;t<16;t++)r[t]=n[t]+e[t]|0}function Z(r,n,e){var t;for(t=0;t<16;t++)r[t]=n[t]-e[t]|0}function M(r,n,e){var t,o,c=new Float64Array(31);for(t=0;t<31;t++)c[t]=0;for(t=0;t<16;t++)for(o=0;o<16;o++)c[t+o]+=n[t]*e[o];for(t=0;t<15;t++)c[t]+=38*c[t+16];for(t=0;t<16;t++)r[t]=c[t];car25519(r),car25519(r)}function S(r,n){M(r,n,n)}function inv25519(r,n){var e,t=gf();for(e=0;e<16;e++)t[e]=n[e];for(e=253;e>=0;e--)S(t,t),2!==e&&4!==e&&M(t,t,n);for(e=0;e<16;e++)r[e]=t[e]}function pow2523(r,n){var e,t=gf();for(e=0;e<16;e++)t[e]=n[e];for(e=250;e>=0;e--)S(t,t),1!==e&&M(t,t,n);for(e=0;e<16;e++)r[e]=t[e]}function crypto_scalarmult(r,n,e){var t,o,c=new Uint8Array(32),a=new Float64Array(80),_=gf(),y=gf(),i=gf(),s=gf(),u=gf(),f=gf();for(o=0;o<31;o++)c[o]=n[o];for(c[31]=127&n[31]|64,c[0]&=248,unpack25519(a,e),o=0;o<16;o++)y[o]=a[o],s[o]=_[o]=i[o]=0;for(_[0]=s[0]=1,o=254;o>=0;--o)sel25519(_,y,t=c[o>>>3]>>>(7&o)&1),sel25519(i,s,t),A(u,_,i),Z(_,_,i),A(i,y,s),Z(y,y,s),S(s,u),S(f,_),M(_,i,_),M(i,y,u),A(u,_,i),Z(_,_,i),S(y,_),Z(i,s,f),M(_,i,_121665),A(_,_,s),M(i,i,_),M(_,s,f),M(s,y,a),S(y,u),sel25519(_,y,t),sel25519(i,s,t);for(o=0;o<16;o++)a[o+16]=_[o],a[o+32]=i[o],a[o+48]=y[o],a[o+64]=s[o];var p=a.subarray(32),l=a.subarray(16);return inv25519(p,p),M(l,l,p),pack25519(r,l),0}function crypto_scalarmult_base(r,n){return crypto_scalarmult(r,n,_9)}function crypto_box_keypair(r,n){return randombytes(n,32),crypto_scalarmult_base(r,n)}function crypto_box_beforenm(r,n,e){var t=new Uint8Array(32);return crypto_scalarmult(t,e,n),crypto_core_hsalsa20(r,_0,t,sigma)}var crypto_box_afternm=crypto_secretbox,crypto_box_open_afternm=crypto_secretbox_open;function crypto_box(r,n,e,t,o,c){var a=new Uint8Array(32);return crypto_box_beforenm(a,o,c),crypto_box_afternm(r,n,e,t,a)}function crypto_box_open(r,n,e,t,o,c){var a=new Uint8Array(32);return crypto_box_beforenm(a,o,c),crypto_box_open_afternm(r,n,e,t,a)}function add64(){var r,n,e,t=0,o=0,c=0,a=0;for(e=0;e<arguments.length;e++)t+=65535&(r=arguments[e].lo),o+=r>>>16,c+=65535&(n=arguments[e].hi),a+=n>>>16;return new u64(65535&(c+=(o+=t>>>16)>>>16)|(a+=c>>>16)<<16,65535&t|o<<16)}function shr64(r,n){return new u64(r.hi>>>n,r.lo>>>n|r.hi<<32-n)}function xor64(){var r,n=0,e=0;for(r=0;r<arguments.length;r++)n^=arguments[r].lo,e^=arguments[r].hi;return new u64(e,n)}function R(r,n){var e,t,o=32-n;return n<32?(e=r.hi>>>n|r.lo<<o,t=r.lo>>>n|r.hi<<o):n<64&&(e=r.lo>>>n|r.hi<<o,t=r.hi>>>n|r.lo<<o),new u64(e,t)}function Ch(r,n,e){var t=r.hi&n.hi^~r.hi&e.hi,o=r.lo&n.lo^~r.lo&e.lo;return new u64(t,o)}function Maj(r,n,e){var t=r.hi&n.hi^r.hi&e.hi^n.hi&e.hi,o=r.lo&n.lo^r.lo&e.lo^n.lo&e.lo;return new u64(t,o)}function Sigma0(r){return xor64(R(r,28),R(r,34),R(r,39))}function Sigma1(r){return xor64(R(r,14),R(r,18),R(r,41))}function sigma0(r){return xor64(R(r,1),R(r,8),shr64(r,7))}function sigma1(r){return xor64(R(r,19),R(r,61),shr64(r,6))}var K=[new u64(1116352408,3609767458),new u64(1899447441,602891725),new u64(3049323471,3964484399),new u64(3921009573,2173295548),new u64(961987163,4081628472),new u64(1508970993,3053834265),new u64(2453635748,2937671579),new u64(2870763221,3664609560),new u64(3624381080,2734883394),new u64(310598401,1164996542),new u64(607225278,1323610764),new u64(1426881987,3590304994),new u64(1925078388,4068182383),new u64(2162078206,991336113),new u64(2614888103,633803317),new u64(3248222580,3479774868),new u64(3835390401,2666613458),new u64(4022224774,944711139),new u64(264347078,2341262773),new u64(604807628,2007800933),new u64(770255983,1495990901),new u64(1249150122,1856431235),new u64(1555081692,3175218132),new u64(1996064986,2198950837),new u64(2554220882,3999719339),new u64(2821834349,766784016),new u64(2952996808,2566594879),new u64(3210313671,3203337956),new u64(3336571891,1034457026),new u64(3584528711,2466948901),new u64(113926993,3758326383),new u64(338241895,168717936),new u64(666307205,1188179964),new u64(773529912,1546045734),new u64(1294757372,1522805485),new u64(1396182291,2643833823),new u64(1695183700,2343527390),new u64(1986661051,1014477480),new u64(2177026350,1206759142),new u64(2456956037,344077627),new u64(2730485921,1290863460),new u64(2820302411,3158454273),new u64(3259730800,3505952657),new u64(3345764771,106217008),new u64(3516065817,3606008344),new u64(3600352804,1432725776),new u64(4094571909,1467031594),new u64(275423344,851169720),new u64(430227734,3100823752),new u64(506948616,1363258195),new u64(659060556,3750685593),new u64(883997877,3785050280),new u64(958139571,3318307427),new u64(1322822218,3812723403),new u64(1537002063,2003034995),new u64(1747873779,3602036899),new u64(1955562222,1575990012),new u64(2024104815,1125592928),new u64(2227730452,2716904306),new u64(2361852424,442776044),new u64(2428436474,593698344),new u64(2756734187,3733110249),new u64(3204031479,2999351573),new u64(3329325298,3815920427),new u64(3391569614,3928383900),new u64(3515267271,566280711),new u64(3940187606,3454069534),new u64(4118630271,4000239992),new u64(116418474,1914138554),new u64(174292421,2731055270),new u64(289380356,3203993006),new u64(460393269,320620315),new u64(685471733,587496836),new u64(852142971,1086792851),new u64(1017036298,365543100),new u64(1126000580,2618297676),new u64(1288033470,3409855158),new u64(1501505948,4234509866),new u64(1607167915,987167468),new u64(1816402316,1246189591)];function crypto_hashblocks(r,n,e){var t,o,c,a=[],_=[],y=[],i=[];for(o=0;o<8;o++)a[o]=y[o]=dl64(r,8*o);for(var s=0;e>=128;){for(o=0;o<16;o++)i[o]=dl64(n,8*o+s);for(o=0;o<80;o++){for(c=0;c<8;c++)_[c]=y[c];for(t=add64(y[7],Sigma1(y[4]),Ch(y[4],y[5],y[6]),K[o],i[o%16]),_[7]=add64(t,Sigma0(y[0]),Maj(y[0],y[1],y[2])),_[3]=add64(_[3],t),c=0;c<8;c++)y[(c+1)%8]=_[c];if(o%16==15)for(c=0;c<16;c++)i[c]=add64(i[c],i[(c+9)%16],sigma0(i[(c+1)%16]),sigma1(i[(c+14)%16]))}for(o=0;o<8;o++)y[o]=add64(y[o],a[o]),a[o]=y[o];s+=128,e-=128}for(o=0;o<8;o++)ts64(r,8*o,a[o]);return e}var iv=new Uint8Array([106,9,230,103,243,188,201,8,187,103,174,133,132,202,167,59,60,110,243,114,254,148,248,43,165,79,245,58,95,29,54,241,81,14,82,127,173,230,130,209,155,5,104,140,43,62,108,31,31,131,217,171,251,65,189,107,91,224,205,25,19,126,33,121]);function crypto_hash(r,n,e){var t,o=new Uint8Array(64),c=new Uint8Array(256),a=e;for(t=0;t<64;t++)o[t]=iv[t];for(crypto_hashblocks(o,n,e),e%=128,t=0;t<256;t++)c[t]=0;for(t=0;t<e;t++)c[t]=n[a-e+t];for(c[e]=128,c[(e=256-128*(e<112?1:0))-9]=0,ts64(c,e-8,new u64(a/536870912|0,a<<3)),crypto_hashblocks(o,c,e),t=0;t<64;t++)r[t]=o[t];return 0}function add(r,n){var e=gf(),t=gf(),o=gf(),c=gf(),a=gf(),_=gf(),y=gf(),i=gf(),s=gf();Z(e,r[1],r[0]),Z(s,n[1],n[0]),M(e,e,s),A(t,r[0],r[1]),A(s,n[0],n[1]),M(t,t,s),M(o,r[3],n[3]),M(o,o,D2),M(c,r[2],n[2]),A(c,c,c),Z(a,t,e),Z(_,c,o),A(y,c,o),A(i,t,e),M(r[0],a,_),M(r[1],i,y),M(r[2],y,_),M(r[3],a,i)}function cswap(r,n,e){var t;for(t=0;t<4;t++)sel25519(r[t],n[t],e)}function pack(r,n){var e=gf(),t=gf(),o=gf();inv25519(o,n[2]),M(e,n[0],o),M(t,n[1],o),pack25519(r,t),r[31]^=par25519(e)<<7}function scalarmult(r,n,e){var t,o;for(set25519(r[0],gf0),set25519(r[1],gf1),set25519(r[2],gf1),set25519(r[3],gf0),o=255;o>=0;--o)cswap(r,n,t=e[o/8|0]>>(7&o)&1),add(n,r),add(r,r),cswap(r,n,t)}function scalarbase(r,n){var e=[gf(),gf(),gf(),gf()];set25519(e[0],X),set25519(e[1],Y),set25519(e[2],gf1),M(e[3],X,Y),scalarmult(r,e,n)}function crypto_sign_keypair(r,n,e){var t,o=new Uint8Array(64),c=[gf(),gf(),gf(),gf()];for(e||randombytes(n,32),crypto_hash(o,n,32),o[0]&=248,o[31]&=127,o[31]|=64,scalarbase(c,o),pack(r,c),t=0;t<32;t++)n[t+32]=r[t];return 0}var L=new Float64Array([237,211,245,92,26,99,18,88,214,156,247,162,222,249,222,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,16]);function modL(r,n){var e,t,o,c;for(t=63;t>=32;--t){for(e=0,o=t-32,c=t-12;o<c;++o)n[o]+=e-16*n[t]*L[o-(t-32)],e=Math.floor((n[o]+128)/256),n[o]-=256*e;n[o]+=e,n[t]=0}for(e=0,o=0;o<32;o++)n[o]+=e-(n[31]>>4)*L[o],e=n[o]>>8,n[o]&=255;for(o=0;o<32;o++)n[o]-=e*L[o];for(t=0;t<32;t++)n[t+1]+=n[t]>>8,r[t]=255&n[t]}function reduce(r){var n,e=new Float64Array(64);for(n=0;n<64;n++)e[n]=r[n];for(n=0;n<64;n++)r[n]=0;modL(r,e)}function crypto_sign(r,n,e,t){var o,c,a=new Uint8Array(64),_=new Uint8Array(64),y=new Uint8Array(64),i=new Float64Array(64),s=[gf(),gf(),gf(),gf()];crypto_hash(a,t,32),a[0]&=248,a[31]&=127,a[31]|=64;var u=e+64;for(o=0;o<e;o++)r[64+o]=n[o];for(o=0;o<32;o++)r[32+o]=a[32+o];for(crypto_hash(y,r.subarray(32),e+32),reduce(y),scalarbase(s,y),pack(r,s),o=32;o<64;o++)r[o]=t[o];for(crypto_hash(_,r,e+64),reduce(_),o=0;o<64;o++)i[o]=0;for(o=0;o<32;o++)i[o]=y[o];for(o=0;o<32;o++)for(c=0;c<32;c++)i[o+c]+=_[o]*a[c];return modL(r.subarray(32),i),u}function unpackneg(r,n){var e=gf(),t=gf(),o=gf(),c=gf(),a=gf(),_=gf(),y=gf();return set25519(r[2],gf1),unpack25519(r[1],n),S(o,r[1]),M(c,o,D),Z(o,o,r[2]),A(c,r[2],c),S(a,c),S(_,a),M(y,_,a),M(e,y,o),M(e,e,c),pow2523(e,e),M(e,e,o),M(e,e,c),M(e,e,c),M(r[0],e,c),S(t,r[0]),M(t,t,c),neq25519(t,o)&&M(r[0],r[0],I),S(t,r[0]),M(t,t,c),neq25519(t,o)?-1:(par25519(r[0])===n[31]>>7&&Z(r[0],gf0,r[0]),M(r[3],r[0],r[1]),0)}function crypto_sign_open(r,n,e,t){var o,c=new Uint8Array(32),a=new Uint8Array(64),_=[gf(),gf(),gf(),gf()],y=[gf(),gf(),gf(),gf()];if(e<64)return-1;if(unpackneg(y,t))return-1;for(o=0;o<e;o++)r[o]=n[o];for(o=0;o<32;o++)r[o+32]=t[o];if(crypto_hash(a,r,e),reduce(a),scalarmult(_,y,a),scalarbase(y,n.subarray(32)),add(_,y),pack(c,_),e-=64,crypto_verify_32(n,0,c,0)){for(o=0;o<e;o++)r[o]=0;return-1}for(o=0;o<e;o++)r[o]=n[o+64];return e}var crypto_secretbox_KEYBYTES=32,crypto_secretbox_NONCEBYTES=24,crypto_secretbox_ZEROBYTES=32,crypto_secretbox_BOXZEROBYTES=16,crypto_scalarmult_BYTES=32,crypto_scalarmult_SCALARBYTES=32,crypto_box_PUBLICKEYBYTES=32,crypto_box_SECRETKEYBYTES=32,crypto_box_BEFORENMBYTES=32,crypto_box_NONCEBYTES=crypto_secretbox_NONCEBYTES,crypto_box_ZEROBYTES=crypto_secretbox_ZEROBYTES,crypto_box_BOXZEROBYTES=crypto_secretbox_BOXZEROBYTES,crypto_sign_BYTES=64,crypto_sign_PUBLICKEYBYTES=32,crypto_sign_SECRETKEYBYTES=64,crypto_sign_SEEDBYTES=32,crypto_hash_BYTES=64;function checkLengths(r,n){if(r.length!==crypto_secretbox_KEYBYTES)throw new Error("bad key size");if(n.length!==crypto_secretbox_NONCEBYTES)throw new Error("bad nonce size")}function checkBoxLengths(r,n){if(r.length!==crypto_box_PUBLICKEYBYTES)throw new Error("bad public key size");if(n.length!==crypto_box_SECRETKEYBYTES)throw new Error("bad secret key size")}function checkArrayTypes(){for(var r=0;r<arguments.length;r++)if(!(arguments[r]instanceof Uint8Array))throw new TypeError("unexpected type, use Uint8Array")}function cleanup(r){for(var n=0;n<r.length;n++)r[n]=0}function validateBase64(r){if(!/^(?:[A-Za-z0-9+\/]{2}[A-Za-z0-9+\/]{2})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/.test(r))throw new TypeError("invalid encoding")}nacl.lowlevel={crypto_core_hsalsa20:crypto_core_hsalsa20,crypto_stream_xor:crypto_stream_xor,crypto_stream:crypto_stream,crypto_stream_salsa20_xor:crypto_stream_salsa20_xor,crypto_stream_salsa20:crypto_stream_salsa20,crypto_onetimeauth:crypto_onetimeauth,crypto_onetimeauth_verify:crypto_onetimeauth_verify,crypto_verify_16:crypto_verify_16,crypto_verify_32:crypto_verify_32,crypto_secretbox:crypto_secretbox,crypto_secretbox_open:crypto_secretbox_open,crypto_scalarmult:crypto_scalarmult,crypto_scalarmult_base:crypto_scalarmult_base,crypto_box_beforenm:crypto_box_beforenm,crypto_box_afternm:crypto_box_afternm,crypto_box:crypto_box,crypto_box_open:crypto_box_open,crypto_box_keypair:crypto_box_keypair,crypto_hash:crypto_hash,crypto_sign:crypto_sign,crypto_sign_keypair:crypto_sign_keypair,crypto_sign_open:crypto_sign_open,crypto_secretbox_KEYBYTES:crypto_secretbox_KEYBYTES,crypto_secretbox_NONCEBYTES:crypto_secretbox_NONCEBYTES,crypto_secretbox_ZEROBYTES:crypto_secretbox_ZEROBYTES,crypto_secretbox_BOXZEROBYTES:crypto_secretbox_BOXZEROBYTES,crypto_scalarmult_BYTES:crypto_scalarmult_BYTES,crypto_scalarmult_SCALARBYTES:crypto_scalarmult_SCALARBYTES,crypto_box_PUBLICKEYBYTES:crypto_box_PUBLICKEYBYTES,crypto_box_SECRETKEYBYTES:crypto_box_SECRETKEYBYTES,crypto_box_BEFORENMBYTES:crypto_box_BEFORENMBYTES,crypto_box_NONCEBYTES:crypto_box_NONCEBYTES,crypto_box_ZEROBYTES:crypto_box_ZEROBYTES,crypto_box_BOXZEROBYTES:crypto_box_BOXZEROBYTES,crypto_sign_BYTES:crypto_sign_BYTES,crypto_sign_PUBLICKEYBYTES:crypto_sign_PUBLICKEYBYTES,crypto_sign_SECRETKEYBYTES:crypto_sign_SECRETKEYBYTES,crypto_sign_SEEDBYTES:crypto_sign_SEEDBYTES,crypto_hash_BYTES:crypto_hash_BYTES,gf:gf,D:D,L:L,pack25519:pack25519,unpack25519:unpack25519,M:M,A:A,S:S,Z:Z,pow2523:pow2523,add:add,set25519:set25519,modL:modL,scalarmult:scalarmult,scalarbase:scalarbase},nacl.randomBytes=function(r){var n=new Uint8Array(r);return randombytes(n,r),n},nacl.secretbox=function(r,n,e){checkArrayTypes(r,n,e),checkLengths(e,n);for(var t=new Uint8Array(crypto_secretbox_ZEROBYTES+r.length),o=new Uint8Array(t.length),c=0;c<r.length;c++)t[c+crypto_secretbox_ZEROBYTES]=r[c];return crypto_secretbox(o,t,t.length,n,e),o.subarray(crypto_secretbox_BOXZEROBYTES)},nacl.secretbox.open=function(r,n,e){checkArrayTypes(r,n,e),checkLengths(e,n);for(var t=new Uint8Array(crypto_secretbox_BOXZEROBYTES+r.length),o=new Uint8Array(t.length),c=0;c<r.length;c++)t[c+crypto_secretbox_BOXZEROBYTES]=r[c];return t.length<32?null:0!==crypto_secretbox_open(o,t,t.length,n,e)?null:o.subarray(crypto_secretbox_ZEROBYTES)},nacl.secretbox.keyLength=crypto_secretbox_KEYBYTES,nacl.secretbox.nonceLength=crypto_secretbox_NONCEBYTES,nacl.secretbox.overheadLength=crypto_secretbox_BOXZEROBYTES,nacl.scalarMult=function(r,n){if(checkArrayTypes(r,n),r.length!==crypto_scalarmult_SCALARBYTES)throw new Error("bad n size");if(n.length!==crypto_scalarmult_BYTES)throw new Error("bad p size");var e=new Uint8Array(crypto_scalarmult_BYTES);return crypto_scalarmult(e,r,n),e},nacl.scalarMult.base=function(r){if(checkArrayTypes(r),r.length!==crypto_scalarmult_SCALARBYTES)throw new Error("bad n size");var n=new Uint8Array(crypto_scalarmult_BYTES);return crypto_scalarmult_base(n,r),n},nacl.scalarMult.scalarLength=crypto_scalarmult_SCALARBYTES,nacl.scalarMult.groupElementLength=crypto_scalarmult_BYTES,nacl.box=function(r,n,e,t){var o=nacl.box.before(e,t);return nacl.secretbox(r,n,o)},nacl.box.before=function(r,n){checkArrayTypes(r,n),checkBoxLengths(r,n);var e=new Uint8Array(crypto_box_BEFORENMBYTES);return crypto_box_beforenm(e,r,n),e},nacl.box.after=nacl.secretbox,nacl.box.open=function(r,n,e,t){var o=nacl.box.before(e,t);return nacl.secretbox.open(r,n,o)},nacl.box.open.after=nacl.secretbox.open,nacl.box.keyPair=function(){var r=new Uint8Array(crypto_box_PUBLICKEYBYTES),n=new Uint8Array(crypto_box_SECRETKEYBYTES);return crypto_box_keypair(r,n),{publicKey:r,secretKey:n}},nacl.box.keyPair.fromSecretKey=function(r){if(checkArrayTypes(r),r.length!==crypto_box_SECRETKEYBYTES)throw new Error("bad secret key size");var n=new Uint8Array(crypto_box_PUBLICKEYBYTES);return crypto_scalarmult_base(n,r),{publicKey:n,secretKey:new Uint8Array(r)}},nacl.box.publicKeyLength=crypto_box_PUBLICKEYBYTES,nacl.box.secretKeyLength=crypto_box_SECRETKEYBYTES,nacl.box.sharedKeyLength=crypto_box_BEFORENMBYTES,nacl.box.nonceLength=crypto_box_NONCEBYTES,nacl.box.overheadLength=nacl.secretbox.overheadLength,nacl.sign=function(r,n){if(checkArrayTypes(r,n),n.length!==crypto_sign_SECRETKEYBYTES)throw new Error("bad secret key size");var e=new Uint8Array(crypto_sign_BYTES+r.length);return crypto_sign(e,r,r.length,n),e},nacl.sign.open=function(r,n){if(checkArrayTypes(r,n),n.length!==crypto_sign_PUBLICKEYBYTES)throw new Error("bad public key size");var e=new Uint8Array(r.length),t=crypto_sign_open(e,r,r.length,n);if(t<0)return null;for(var o=new Uint8Array(t),c=0;c<o.length;c++)o[c]=e[c];return o},nacl.sign.detached=function(r,n){for(var e=nacl.sign(r,n),t=new Uint8Array(crypto_sign_BYTES),o=0;o<t.length;o++)t[o]=e[o];return t},nacl.sign.detached.verify=function(r,n,e){if(checkArrayTypes(r,n,e),n.length!==crypto_sign_BYTES)throw new Error("bad signature size");if(e.length!==crypto_sign_PUBLICKEYBYTES)throw new Error("bad public key size");var t,o=new Uint8Array(crypto_sign_BYTES+r.length),c=new Uint8Array(crypto_sign_BYTES+r.length);for(t=0;t<crypto_sign_BYTES;t++)o[t]=n[t];for(t=0;t<r.length;t++)o[t+crypto_sign_BYTES]=r[t];return crypto_sign_open(c,o,o.length,e)>=0},nacl.sign.keyPair=function(){var r=new Uint8Array(crypto_sign_PUBLICKEYBYTES),n=new Uint8Array(crypto_sign_SECRETKEYBYTES);return crypto_sign_keypair(r,n),{publicKey:r,secretKey:n}},nacl.sign.keyPair.fromSecretKey=function(r){if(checkArrayTypes(r),r.length!==crypto_sign_SECRETKEYBYTES)throw new Error("bad secret key size");for(var n=new Uint8Array(crypto_sign_PUBLICKEYBYTES),e=0;e<n.length;e++)n[e]=r[32+e];return{publicKey:n,secretKey:new Uint8Array(r)}},nacl.sign.keyPair.fromSeed=function(r){if(checkArrayTypes(r),r.length!==crypto_sign_SEEDBYTES)throw new Error("bad seed size");for(var n=new Uint8Array(crypto_sign_PUBLICKEYBYTES),e=new Uint8Array(crypto_sign_SECRETKEYBYTES),t=0;t<32;t++)e[t]=r[t];return crypto_sign_keypair(n,e,!0),{publicKey:n,secretKey:e}},nacl.sign.publicKeyLength=crypto_sign_PUBLICKEYBYTES,nacl.sign.secretKeyLength=crypto_sign_SECRETKEYBYTES,nacl.sign.seedLength=crypto_sign_SEEDBYTES,nacl.sign.signatureLength=crypto_sign_BYTES,nacl.hash=function(r){checkArrayTypes(r);var n=new Uint8Array(crypto_hash_BYTES);return crypto_hash(n,r,r.length),n},nacl.hash.hashLength=crypto_hash_BYTES,nacl.verify=function(r,n){return checkArrayTypes(r,n),0!==r.length&&0!==n.length&&(r.length===n.length&&0===vn(r,0,n,0,r.length))},nacl.setPRNG=function(r){randombytes=r},function(){var r="undefined"!=typeof self?self.crypto||self.msCrypto:null;if(r&&r.getRandomValues){nacl.setPRNG(function(n,e){var t,o=new Uint8Array(e);for(t=0;t<e;t+=65536)r.getRandomValues(o.subarray(t,t+Math.min(e-t,65536)));for(t=0;t<e;t++)n[t]=o[t];cleanup(o)})}else"undefined"!=typeof require&&(r=require("crypto"))&&r.randomBytes&&nacl.setPRNG(function(n,e){var t,o=r.randomBytes(e);for(t=0;t<e;t++)n[t]=o[t];cleanup(o)})}(),nacl.util={},nacl.util.decodeUTF8=function(r){if("string"!=typeof r)throw new TypeError("expected string");var n,e=unescape(encodeURIComponent(r)),t=new Uint8Array(e.length);for(n=0;n<e.length;n++)t[n]=e.charCodeAt(n);return t},nacl.util.encodeUTF8=function(r){var n,e=[];for(n=0;n<r.length;n++)e.push(String.fromCharCode(r[n]));return decodeURIComponent(escape(e.join("")))},"undefined"==typeof atob?void 0!==Buffer.from?(nacl.util.encodeBase64=function(r){return Buffer.from(r).toString("base64")},nacl.util.decodeBase64=function(r){return validateBase64(r),new Uint8Array(Array.prototype.slice.call(Buffer.from(r,"base64"),0))}):(nacl.util.encodeBase64=function(r){return new Buffer(r).toString("base64")},nacl.util.decodeBase64=function(r){return validateBase64(r),new Uint8Array(Array.prototype.slice.call(new Buffer(r,"base64"),0))}):(nacl.util.encodeBase64=function(r){var n,e=[],t=r.length;for(n=0;n<t;n++)e.push(String.fromCharCode(r[n]));return btoa(e.join(""))},nacl.util.decodeBase64=function(r){validateBase64(r);var n,e=atob(r),t=new Uint8Array(e.length);for(n=0;n<e.length;n++)t[n]=e.charCodeAt(n);return t});

        function oy_uint8_hex(oy_input) {//DUPLICATED IN MAIN BLOCK
            let oy_return = "";
            for (let i in oy_input) oy_return += oy_input[i].toString(16).padStart(2, '0');
            return oy_return;
        }

        function oy_hash_gen(oy_input) {//DUPLICATED IN MAIN BLOCK
            return oy_uint8_hex(nacl.hash(nacl.util.decodeUTF8(oy_input))).substr(0, 40);
        }

        function oy_rand_gen(oy_length) {//DUPLICATED IN MAIN BLOCK
            return Math.round((Math.pow(36, oy_length+1)-Math.random()*Math.pow(36, oy_length))).toString(36).slice(1);
        }

        function oy_calc_avg(oy_array) {//DUPLICATED IN MAIN BLOCK
            if (typeof(oy_array)!=="object") return false;
            let oy_sum = 0;
            for (let i in oy_array) {
                if (!isNaN(oy_array[i])) oy_sum += oy_array[i];
            }
            return oy_sum/oy_array.length;
        }

        function oy_calc_grade(oy_input) {//DUPLICATED IN MAIN BLOCK
            if (typeof(oy_input)!=="string") return false;

            let oy_grade_points = {
                "1":1, "2":2, "3":3, "4":4, "5":5, "6":6, "7":7, "8":8, "9":9,
                "a":1, "b":2, "c":3, "d":4, "e":5, "f":6, "g":7, "h":8, "i":9, "j":10, "k":11, "l":12, "m":13, "n":14, "o":15, "p":16, "q":17, "r":18, "s":19, "t":20, "u":21, "v":22, "w":23, "x":24, "y":25, "z":26
            };

            let oy_grade_score = 0;
            for (let i = 0; i<oy_input.length; i++) {
                if (typeof(oy_grade_points[oy_input[i]])!=="undefined") oy_grade_score += oy_grade_points[oy_input[i]];
            }
            return oy_grade_score;
        }

        function oy_work_mine(oy_work_bit) {
            let oy_work_solution;
            console.log("WORK BIT: "+oy_work_bit);
            while (oy_hash_gen(oy_work_bit+(oy_work_solution = oy_rand_gen(OY_WORK_MATCH))).substr(0, OY_WORK_MATCH)!==oy_work_bit.substring(0, OY_WORK_MATCH)) {}
            return oy_work_solution;
        }

        function oy_work_verify(oy_block_time, oy_key_public, oy_block_hash, oy_work_difficulty, oy_work_solutions) {//DUPLICATED IN MAIN BLOCK
            if (oy_work_solutions.length!==oy_work_difficulty) return false;

            for (let oy_work_nonce in oy_work_solutions) {
                if (!oy_work_verify_single(oy_block_time, oy_key_public, oy_block_hash, oy_work_nonce, oy_work_solutions[oy_work_nonce])) return false;
            }
            return true;
        }

        function oy_work_verify_single(oy_block_time, oy_key_public, oy_block_hash, oy_work_nonce, oy_work_solution) {//DUPLICATED IN MAIN BLOCK
            if (typeof(oy_work_solution)!=="string"||oy_work_solution.length!==OY_WORK_MATCH) return false;
            let oy_work_bit = oy_hash_gen(oy_block_time+oy_key_public+oy_block_hash+oy_work_nonce).substr(0, OY_WORK_MATCH);
            return oy_work_bit===oy_hash_gen(oy_work_bit+oy_work_solution).substr(0, OY_WORK_MATCH);
        }

        function oy_block_sync_hop(oy_dive_ledger, oy_passport_passive, oy_passport_crypt, oy_crypt_short, oy_first) {
            if (oy_passport_passive.length===0) return oy_first!==true;
            let oy_node_select = oy_passport_passive.shift();
            let oy_crypt_select = oy_passport_crypt.shift();
            if (oy_key_verify(oy_node_select, oy_crypt_select, oy_crypt_short)) {
                if (oy_first===false&&typeof(oy_dive_ledger[oy_node_select])==="undefined") return false;
                return oy_block_sync_hop(oy_dive_ledger, oy_passport_passive, oy_passport_crypt, oy_crypt_short, false);
            }
            return false;
        }

        function oy_block_command_hash(oy_command_array) {//DUPLICATED IN MAIN BLOCK
            let oy_command_pool = {};
            for (let i in oy_command_array) {
                if (oy_command_array[i].length!==2) return false;

                let oy_command_hash = oy_hash_gen(JSON.stringify(oy_command_array[i][0]));
                if (typeof(oy_command_pool[oy_command_hash])!=="undefined") return false;
                oy_command_pool[oy_command_hash] = true;
                oy_command_array[i][2] = oy_command_hash;
            }
            return oy_command_array;
        }

        function oy_key_verify(oy_key_public, oy_key_signature, oy_key_data) {//DUPLICATED IN MAIN BLOCK
            return nacl.sign.detached.verify(nacl.util.decodeUTF8(oy_key_data), nacl.util.decodeBase64(oy_key_signature), nacl.util.decodeBase64(oy_key_public.substr(1)+"="));
        }

        self.onmessage = function(oy_event) {
            let [oy_work_type, oy_work_data] = oy_event.data;

            if (oy_work_type===0) {
                let [oy_work_self, oy_work_nonce, oy_work_bit] = oy_work_data;
                if (oy_work_nonce!==-1&&oy_work_bit.length!==OY_WORK_MATCH) return false;

                if (oy_work_nonce===-1) postMessage([oy_work_type, [oy_work_nonce, null]]);
                else postMessage([oy_work_type, [oy_work_self, oy_work_nonce, oy_work_mine(oy_work_bit)]]);
            }
            else if (oy_work_type===1) {
                let [oy_data_payload, oy_dive_ledger, oy_block_boot, oy_block_time, oy_block_hash, oy_work_difficulty] = oy_work_data;

                if (oy_block_sync_hop(oy_dive_ledger, oy_data_payload[0].slice(), oy_data_payload[1].slice(), oy_data_payload[2], true)||oy_block_boot===true) {
                    let oy_work_solutions = JSON.parse(oy_data_payload[6]);
                    if (oy_key_verify(oy_data_payload[0][0], oy_data_payload[2], oy_data_payload[3]+oy_data_payload[4]+oy_data_payload[5]+oy_data_payload[6])&&oy_work_verify(oy_block_time, oy_data_payload[0][0], oy_block_hash, oy_work_difficulty, oy_work_solutions)) {
                        let oy_sync_command = oy_block_command_hash(JSON.parse(oy_data_payload[4]));
                        if (oy_sync_command!==false) {
                            let oy_grade_array = [];
                            for (let i in oy_work_solutions) {
                                oy_grade_array.push(oy_calc_grade(oy_work_solutions[i]));
                            }
                            postMessage([oy_work_type, [oy_data_payload, oy_sync_command, Math.floor(oy_calc_avg(oy_grade_array))]]);
                        }
                    }
                }
            }
        }
    }
    let oy_worker_define = URL.createObjectURL(new Blob(["("+oy_worker_internal.toString()+")(\""+encodeURI(JSON.stringify([OY_WORK_MATCH]))+"\")"], {type: 'text/javascript'}));
    OY_WORKER_THREADS[oy_worker_type] = new Array(oy_worker_cores());
    OY_WORKER_THREADS[oy_worker_type].fill(null);
    OY_WORKER_POINTER[oy_worker_type] = 0;
    for (let i in OY_WORKER_THREADS[oy_worker_type]) {
        OY_WORKER_THREADS[oy_worker_type][i] = new Worker(oy_worker_define);
        OY_WORKER_THREADS[oy_worker_type][i].onmessage = function(oy_event) {
            let [oy_work_type, oy_work_data] = oy_event.data;

            let oy_time_local = Date.now()/1000;
            let oy_time_offset = oy_time_local-OY_BLOCK_TIME;
            if (oy_work_type===0) {
                let [oy_work_self, oy_work_nonce, oy_work_solution] = oy_work_data;

                if (oy_time_offset<OY_BLOCK_SECTORS[0][0]) return false;

                if (oy_work_self===true) {
                    if (oy_work_nonce!==-1&&(OY_WORK_SOLUTIONS[oy_work_nonce]===null||oy_calc_grade(oy_work_solution)>OY_WORK_GRADES[oy_work_nonce])) {
                        OY_WORK_SOLUTIONS[oy_work_nonce] = oy_work_solution;
                        OY_WORK_GRADES[oy_work_nonce] = oy_calc_grade(oy_work_solution);
                    }

                    let oy_nonce_select;
                    if (oy_work_nonce===-1) {
                        oy_nonce_select = parseInt(i);
                        if (oy_nonce_select>=OY_WORK_BITS.length) oy_nonce_select = Math.floor(Math.random()*OY_WORK_BITS.length);
                    }
                    else {
                        oy_nonce_select = OY_WORK_GRADES.indexOf(null);
                        if (oy_nonce_select===-1) {
                            oy_nonce_select = OY_WORK_GRADES.indexOf(true);
                            if (oy_nonce_select===-1&&OY_DIVE_GRADE===true) oy_nonce_select = OY_WORK_GRADES.indexOf(Math.min(...OY_WORK_GRADES));
                        }
                        else OY_WORK_GRADES[oy_nonce_select] = true;
                    }
                    if (oy_nonce_select!==-1) OY_WORKER_THREADS[0][i].postMessage([0, [oy_work_self, oy_nonce_select, OY_WORK_BITS[oy_nonce_select]]]);
                }
                else {
                    if (typeof(OY_INTRO_SOLUTIONS[oy_work_nonce])!=="undefined") {
                        if (OY_INTRO_SOLUTIONS[oy_work_nonce]===null||oy_calc_grade(oy_work_solution)>oy_calc_grade(OY_INTRO_SOLUTIONS[oy_work_nonce])) OY_INTRO_SOLUTIONS[oy_work_nonce] = oy_work_solution;
                        if (Object.keys(OY_INTRO_SOLUTIONS).length>0&&Object.values(OY_INTRO_SOLUTIONS).indexOf(null)===-1) {
                            oy_intro_beam(OY_INTRO_SELECT, "OY_INTRO_DONE", [true, OY_INTRO_SOLUTIONS], function(oy_data_flag, oy_data_payload) {
                                if (oy_data_flag!=="OY_INTRO_SIGNAL_A"||typeof(oy_data_payload)!=="object"||oy_data_payload.length<1) {
                                    oy_intro_punish(OY_INTRO_SELECT);
                                    return false;
                                }
                                for (let i in oy_data_payload) {
                                    let oy_signal_carry = oy_signal_soak(oy_data_payload[i]);
                                    if (!oy_signal_carry||typeof(OY_NODES[oy_signal_carry[0]])!=="undefined") {
                                        oy_intro_punish(OY_INTRO_SELECT);
                                        return false;
                                    }
                                    OY_INTRO_TAG[oy_signal_carry[0]] = false;
                                    OY_NODES[oy_signal_carry[0]] = oy_node_boot(false);
                                    OY_NODES[oy_signal_carry[0]].on("signal", function(oy_signal_data) {
                                        oy_intro_beam(OY_INTRO_SELECT, "OY_INTRO_SIGNAL_B", oy_signal_beam(oy_signal_data));
                                    });
                                    oy_node_connect(oy_signal_carry[0]);
                                    OY_NODES[oy_signal_carry[0]].signal(oy_signal_carry[1]);
                                }
                            });
                            OY_INTRO_SOLUTIONS = {};
                        }
                    }
                }
            }
            else if (oy_work_type===1) {
                let [oy_data_payload, oy_sync_command, oy_work_grade] = oy_work_data;

                if (oy_state_current()===2&&OY_BLOCK_SYNC[oy_data_payload[0][0]]!==false&&OY_BLOCK_SYNC[oy_data_payload[0][0]][1]===false&&oy_time_offset<OY_BLOCK_SECTORS[1][0]&&oy_block_command_scan(oy_sync_command, false)) {
                    OY_BLOCK_SYNC[oy_data_payload[0][0]] = [oy_data_payload[2], oy_sync_command];
                    OY_BLOCK_SYNC_PASS[OY_BLOCK_TIME][oy_data_payload[0][0]] = [JSON.parse(oy_data_payload[5]), JSON.parse(oy_data_payload[6]), 0];
                    OY_BLOCK_WORK_GRADE[oy_data_payload[0][0]] = oy_work_grade;

                    if (typeof(OY_SYNC_TALLY[oy_data_payload[0][0]])==="undefined") OY_SYNC_TALLY[oy_data_payload[0][0]] = oy_data_payload[0][oy_data_payload[0].length-1];
                    if (oy_time_offset>OY_SYNC_LAST[1]) OY_SYNC_LAST[1] = oy_time_offset;
                    if (typeof(OY_SYNC_MAP[1][oy_data_payload[0][0]])==="undefined") OY_SYNC_MAP[1][oy_data_payload[0][0]] = [oy_data_payload[0][0].length, oy_data_payload[0]];

                    if (typeof(OY_BLOCK_LEARN[oy_data_payload[0].length])!=="undefined"&&typeof(OY_BLOCK[1][oy_data_payload[0][0]])!=="undefined"&&OY_BLOCK[1][oy_data_payload[0][0]][1]===1) OY_BLOCK_LEARN[oy_data_payload[0].length].push(oy_time_offset);

                    if (typeof(OY_BLOCK[1][OY_SELF_PUBLIC])!=="undefined"||OY_BLOCK_BOOT===true) {
                        oy_data_payload[1].push(oy_key_sign(OY_SELF_PRIVATE, oy_short(oy_data_payload[2])));
                        oy_data_route("OY_LOGIC_SYNC", "OY_BLOCK_SYNC", oy_data_payload);
                    }

                    if (typeof(OY_BLOCK_MAP)==="function") OY_BLOCK_MAP(1);
                }
            }
        };
    }
}
//WEB WORKER BLOCK

function oy_work_verify(oy_block_time, oy_key_public, oy_block_hash, oy_work_difficulty, oy_work_solutions) {//DUPLICATED IN WEB WORKER BLOCK
    if (oy_work_solutions.length!==oy_work_difficulty) return false;

    for (let oy_work_nonce in oy_work_solutions) {
        if (!oy_work_verify_single(oy_block_time, oy_key_public, oy_block_hash, oy_work_nonce, oy_work_solutions[oy_work_nonce])) return false;
    }
    return true;
}

function oy_work_verify_single(oy_block_time, oy_key_public, oy_block_hash, oy_work_nonce, oy_work_solution) {//DUPLICATED IN WEB WORKER BLOCK
    if (typeof(oy_work_solution)!=="string"||oy_work_solution.length!==OY_WORK_MATCH) return false;
    let oy_work_bit = oy_hash_gen(oy_block_time+oy_key_public+oy_block_hash+oy_work_nonce).substr(0, OY_WORK_MATCH);
    return oy_work_bit===oy_hash_gen(oy_work_bit+oy_work_solution).substr(0, OY_WORK_MATCH);
}

function oy_log(oy_log_msg, oy_log_attn) {
    if (OY_PASSIVE_MODE===true) return false;

    if (typeof(oy_log_attn)!=="undefined"&&oy_log_attn===true) oy_log_msg = "<b>"+oy_log_msg+"</b>";
    if (OY_CONSOLE===undefined) console.log(oy_log_msg);
    else OY_CONSOLE(oy_log_msg);
}

// noinspection JSUnusedGlobalSymbols
function oy_log_debug(oy_log_msg) {
    if (OY_SELF_SHORT===null) return false;

    oy_log_msg = "["+(Date.now()/1000).toFixed(2)+"] "+oy_log_msg;
    let oy_xhttp = new XMLHttpRequest();
    oy_xhttp.open("POST", "https://top.oyster.org/oy_log_catch.php", true);
    oy_xhttp.send("oy_log_catch="+JSON.stringify([OY_SELF_SHORT, oy_log_msg]));
}

function oy_short(oy_message) {
    return oy_message.substr(0, OY_SHORT_LENGTH);
}

function oy_chrono(oy_chrono_callback, oy_chrono_duration) {
    let oy_chrono_elapsed = 0;
    let oy_chrono_last = perf.now();

    let oy_chrono_instance = function() {
        oy_chrono_elapsed += perf.now()-oy_chrono_last;
        if (oy_chrono_elapsed>=oy_chrono_duration) return oy_chrono_callback();
        setTimeout(oy_chrono_instance, OY_CHRONO_ACCURACY);
        oy_chrono_last = perf.now();
    };
    oy_chrono_instance();
}

function oy_event_create(oy_event_name, oy_event_callback) {
    if (typeof(OY_EVENTS[oy_event_name])!=="undefined") return false;
    if (typeof(oy_event_callback)==="undefined") oy_event_callback = function() {};

    if (OY_NODE_STATE===true) {
        OY_EVENTS[oy_event_name] = new NodeEvent();
        OY_EVENTS[oy_event_name].on(oy_event_name, oy_event_callback);
    }
    else {
        OY_EVENTS[oy_event_name] = new Event(oy_event_name);
        document.addEventListener(oy_event_name, oy_event_callback, false);
    }
}

function oy_event_dispatch(oy_event_name) {
    if (typeof(OY_EVENTS[oy_event_name])==="undefined") return false;
    if (OY_NODE_STATE===true) OY_EVENTS[oy_event_name].emit(oy_event_name);
    else document.dispatchEvent(OY_EVENTS[oy_event_name]);
}

function oy_event_hook(oy_event_name, oy_event_callback) {
    if (typeof(OY_EVENTS[oy_event_name])==="undefined"||typeof(oy_event_callback)==="undefined") return false;

    document.addEventListener(oy_event_name, oy_event_callback, false);
}

function oy_calc_shuffle(a) {
    let j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function oy_calc_avg(oy_array) {//DUPLICATED IN WEB WORKER BLOCK
    if (typeof(oy_array)!=="object") return false;
    let oy_sum = 0;
    for (let i in oy_array) {
        if (!isNaN(oy_array[i])) oy_sum += oy_array[i];
    }
    return oy_sum/oy_array.length;
}

function oy_calc_grade(oy_input) {//DUPLICATED IN WEB WORKER BLOCK
    if (typeof(oy_input)!=="string") return false;

    let oy_grade_points = {
        "1":1, "2":2, "3":3, "4":4, "5":5, "6":6, "7":7, "8":8, "9":9,
        "a":1, "b":2, "c":3, "d":4, "e":5, "f":6, "g":7, "h":8, "i":9, "j":10, "k":11, "l":12, "m":13, "n":14, "o":15, "p":16, "q":17, "r":18, "s":19, "t":20, "u":21, "v":22, "w":23, "x":24, "y":25, "z":26
    };

    let oy_grade_score = 0;
    for (let i = 0; i<oy_input.length; i++) {
        if (typeof(oy_grade_points[oy_input[i]])!=="undefined") oy_grade_score += oy_grade_points[oy_input[i]];
    }
    return oy_grade_score;
}

function oy_rand_gen(oy_length) {//DUPLICATED IN WEB WORKER BLOCK
    return Math.round((Math.pow(36, oy_length+1)-Math.random()*Math.pow(36, oy_length))).toString(36).slice(1);
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
    else oy_log("[DB][ERROR]["+oy_error.name+"]["+oy_error.message+"]", true);
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
            oy_log("LOCAL[UPDATE]["+oy_local_name+"]");
        })
        .catch(oy_db_error);
    return true;
}

function oy_signal_beam(oy_signal_data) {
    oy_signal_data = JSON.stringify(oy_signal_data);
    return LZString.compressToUTF16(JSON.stringify([OY_SELF_PUBLIC, oy_key_sign(OY_SELF_PRIVATE, oy_signal_data), oy_signal_data]));
}

function oy_signal_soak(oy_signal_beam) {
    let [oy_key_public, oy_signal_crypt, oy_signal_data] = JSON.parse(LZString.decompressFromUTF16(oy_signal_beam));//compression discourages snooping IP addresses
    if (!oy_key_verify(oy_key_public, oy_signal_crypt, oy_signal_data)) return false;
    return [oy_key_public, JSON.parse(oy_signal_data)];
}

function oy_peer_add(oy_peer_id, oy_state_flag) {
    if (oy_state_flag===null||typeof(OY_PEERS[oy_peer_id])!=="undefined"||oy_peer_id===OY_SELF_PUBLIC) return false;

    if (Object.keys(OY_PEERS).length>=OY_PEER_MAX&&OY_JUMP_ASSIGN[0]!==oy_peer_id) {//prevent overflow on peer_count
        oy_node_deny(oy_peer_id, "OY_DENY_PEER_OVERFLOW");
        return false;
    }
    OY_PEERS[oy_peer_id] = oy_clone_object(OY_PEER_TEMPLATE);
    if (OY_JUMP_ASSIGN[0]===oy_peer_id) OY_PEERS[oy_peer_id][0] = OY_BLOCK_NEXT;
    else OY_PEERS[oy_peer_id][0] = OY_BLOCK_TIME;
    OY_PEERS[oy_peer_id][1] = oy_state_flag;
    if (typeof(OY_INTRO_TAG[oy_peer_id])!=="undefined") OY_INTRO_TAG[oy_peer_id] = true;
    if (Object.keys(OY_PEERS).length===1) oy_event_dispatch("oy_peers_recover");
    oy_log_debug("PEER_ADD: "+OY_SELF_SHORT+" - "+oy_short(oy_peer_id)+" - "+OY_PEERS[oy_peer_id][0]+" - "+OY_PEERS[oy_peer_id][1]);
    return true;
}

//updates latency tracking of peer
function oy_peer_latency(oy_peer_id, oy_latency_new) {
    if (typeof(OY_PEERS[oy_peer_id])==="undefined") return false;

    OY_PEERS[oy_peer_id][4].unshift(oy_latency_new);
    if (OY_PEERS[oy_peer_id][4].length>OY_LATENCY_TRACK) OY_PEERS[oy_peer_id][4].pop();
    OY_PEERS[oy_peer_id][3] = (OY_PEERS[oy_peer_id][4].reduce(oy_reduce_sum))/OY_PEERS[oy_peer_id][4].length;
}

//checks if short id of node correlates with a mutual peer or a latch
function oy_peer_find(oy_peer_short) {//TODO remove
    if (oy_peer_short===OY_SELF_SHORT) return false;

    for (let oy_peer_select in OY_PEERS) {
        if (OY_PEERS[oy_peer_select][1]!==0&&oy_peer_short===oy_short(oy_peer_select)) return oy_peer_select;
    }
    return false;
}

function oy_peer_full() {
    for (let oy_peer_select in OY_PEERS) {
        if (OY_PEERS[oy_peer_select][1]===2&&typeof(OY_BLOCK[1][oy_peer_select])!=="undefined") {
            OY_PEERS[oy_peer_select][2] = false;
            return true;
        }
    }
    return false;
}

//process data sequence received from mutual peer oy_peer_id
function oy_peer_process(oy_peer_id, oy_data_flag, oy_data_payload) {
    if (typeof(OY_PEERS[oy_peer_id])==="undefined"||(OY_PEERS[oy_peer_id][1]===0&&oy_data_flag!=="OY_PEER_LATENCY"&&oy_data_flag!=="OY_PEER_LIGHT")) return false;//TODO add deny

    let oy_time_local = Date.now()/1000;
    if (oy_data_flag==="OY_BLOCK_COMMAND") {//OY_LOGIC_UPSTREAM
        //oy_data_payload = [oy_route_passport_passive, oy_command_array, oy_command_crypt]
        if (oy_data_payload.length!==4||typeof(oy_data_payload[0])!=="object") {
            oy_node_deny(oy_peer_id, "OY_DENY_COMMAND_INVALID");
            return false;
        }

        if (OY_BLOCK_HASH!==null&&//check that there is a known meshblock hash
            (oy_data_payload[1][1][0]===OY_BLOCK_TIME||oy_data_payload[1][1][0]===OY_BLOCK_NEXT)&&//check that the broadcast timestamp for either the current or next block
            Number.isInteger(oy_data_payload[1][1][1])&&
            Number.isInteger(oy_data_payload[1][1][2])&&
            oy_data_payload[1][1][2]>=0) {//check that transact fee is positive

            if (OY_LIGHT_STATE===false&&typeof(OY_BLOCK[1][OY_SELF_PUBLIC])!=="undefined") oy_block_absorb(oy_data_payload[1], oy_data_payload[2]);
            else oy_data_route("OY_LOGIC_UPSTREAM", "OY_BLOCK_COMMAND", oy_data_payload);
        }
        return true;
    }
    else if (oy_data_flag==="OY_BLOCK_ABSORB") {//OY_LOGIC_ABSORB
        //oy_data_payload = [oy_command_array, oy_command_crypt, oy_absorb_crypt]
        //TODO payload validation
        if (OY_BLOCK_HASH===null||typeof(OY_BLOCK[1][OY_SELF_PUBLIC])==="undefined"||typeof(OY_BLOCK[1][oy_peer_id])==="undefined") {
            oy_node_deny(oy_peer_id, "OY_DENY_ABSORB_INVALID");
            return false;
        }
        if (oy_key_verify(oy_peer_id, oy_data_payload[2], oy_short(oy_data_payload[1]))) oy_block_absorb(oy_data_payload[0], oy_data_payload[1]);
    }
    else if (oy_data_flag==="OY_BLOCK_SYNC") {//OY_LOGIC_SYNC
        //oy_data_payload = [oy_passport_passive, oy_passport_crypt, oy_sync_crypt, oy_block_time, oy_command_flat, oy_identity_flat, oy_solutions_flat]
        if (oy_state_current()!==2||oy_data_payload.length!==7||typeof(oy_data_payload[0])!=="object"||typeof(oy_data_payload[1])!=="object"||oy_data_payload[0].length===0||oy_data_payload[0].length!==oy_data_payload[1].length||!oy_key_check(oy_data_payload[0][0])||oy_data_payload[3]!==OY_BLOCK_TIME) {
            oy_node_deny(oy_peer_id, "OY_DENY_SYNC_INVALID");
            return false;
        }

        let oy_sync_pass = 0;

        if (oy_data_payload[0][0]===OY_SELF_PUBLIC) return true;

        if (typeof(OY_BLOCK_SYNC[oy_data_payload[0][0]])!=="undefined") {
            if (OY_BLOCK_SYNC[oy_data_payload[0][0]]!==false&&OY_BLOCK_SYNC[oy_data_payload[0][0]][0]!==oy_data_payload[2]) oy_sync_pass = 1;
            else oy_sync_pass = 2;
        }
        if (oy_sync_pass!==2&&//TODO validate intro address, must be alphanumeric safe
            OY_LIGHT_STATE===false&&//check that self is running block_sync as a full node
            OY_BLOCK_HASH!==null&&//check that there is a known meshblock hash
            oy_time_local-OY_BLOCK_TIME<OY_BLOCK_SECTORS[1][0]&&//check that the current timestamp is in the sync processing zone
            (OY_BLOCK_JUDGE===true||(typeof(OY_BLOCK_JUDGE[oy_data_payload[0].length])!=="undefined"&&(OY_BLOCK_JUDGE[oy_data_payload[0].length]===true||oy_time_local-OY_BLOCK_TIME<OY_BLOCK_JUDGE[oy_data_payload[0].length]))||OY_BLOCK_BOOT===true)) {
            if (oy_sync_pass===1) {
                OY_BLOCK_SYNC[oy_data_payload[0][0]] = false;

                if (typeof(OY_BLOCK[1][OY_SELF_PUBLIC])!=="undefined"||OY_BLOCK_BOOT===true) {
                    oy_data_payload[1].push(oy_key_sign(OY_SELF_PRIVATE, oy_short(oy_data_payload[2])));
                    oy_data_route("OY_LOGIC_SYNC", "OY_BLOCK_SYNC", oy_data_payload);
                }
            }
            else {
                OY_BLOCK_SYNC[oy_data_payload[0][0]] = [oy_data_payload[2], false];
                OY_WORKER_THREADS[1][oy_worker_point(1)].postMessage([1, [oy_data_payload, OY_BLOCK[1], oy_data_payload[4], oy_data_payload[5], OY_BLOCK_BOOT, OY_BLOCK_TIME, OY_BLOCK_HASH, OY_BLOCK[0][3]]]);
            }
        }
        return true;
    }
    else if (oy_data_flag==="OY_PEER_OFFER_A") {//OY_LOGIC_UPSTREAM+OY_LOGIC_FOLLOW
        if (oy_data_payload.length!==5||oy_data_payload[4].length!==OY_MESH_SEQUENCE) {
            oy_node_deny(oy_peer_id, "OY_DENY_OFFER_A_INVALID");
            return false;
        }
        if (OY_PEERS[oy_peer_id][1]===0) {
            oy_node_deny(oy_peer_id, "OY_DENY_OFFER_A_BLANK");
            return false;
        }

        let oy_time_offset = (Date.now()/1000)-OY_BLOCK_TIME;
        if (OY_BLOCK_HASH===null||oy_time_offset>OY_BLOCK_SECTORS[0][0]) return false;

        if (OY_LIGHT_STATE===false&&typeof(OY_BLOCK[1][OY_SELF_PUBLIC])!=="undefined") {
            if (OY_FULL_INTRO!==false&&OY_BLOCK[1][OY_SELF_PUBLIC][1]===1) {
                let oy_signal_carry = oy_signal_soak(oy_data_payload[4]);
                if (!oy_signal_carry||oy_signal_carry[0]!==oy_data_payload[0][0]||typeof(OY_OFFER_COLLECT[oy_signal_carry[0]])!=="undefined"||!oy_key_verify(oy_data_payload[0][0], oy_data_payload[2], OY_BLOCK_HASH+oy_data_payload[3]+oy_data_payload[4])) return false;
                OY_OFFER_COLLECT[oy_data_payload[0][0]] = [OY_OFFER_COUNTER, oy_data_payload[3], oy_data_payload[0], oy_data_payload[4]];//[[0]:priority_counter, [1]:oy_offer_rand, [2]:passport, [3]:signal_data]
                OY_OFFER_COUNTER++;
            }
            else {
                if (oy_data_payload[1].length===0) {
                    let oy_intro_select = [null, -1];
                    for (let oy_key_public in OY_BLOCK[1]) {
                        if (OY_BLOCK[1][oy_key_public][1]===1&&OY_BLOCK[1][oy_key_public][6]!==0&&typeof(OY_SYNC_MAP[oy_key_public])!=="undefined"&&(OY_SYNC_MAP[oy_key_public][0]<oy_intro_select[1]||oy_intro_select[1]===-1)) oy_intro_select = [OY_SYNC_MAP[oy_key_public][1], OY_SYNC_MAP[oy_key_public][0]];
                    }
                    if (oy_intro_select[0]!==null) {
                        oy_data_payload[1] = oy_intro_select[0];
                        oy_data_route("OY_LOGIC_FOLLOW", "OY_PEER_OFFER_A", oy_data_payload);
                    }
                }
                else oy_data_route("OY_LOGIC_FOLLOW", "OY_PEER_OFFER_A", oy_data_payload);
            }
        }
        else oy_data_route("OY_LOGIC_UPSTREAM", "OY_PEER_OFFER_A", oy_data_payload);
    }
    else if (oy_data_flag==="OY_PEER_OFFER_B") {
        if (oy_data_payload.length!==5) {
            oy_node_deny(oy_peer_id, "OY_DENY_OFFER_B_INVALID");
            return false;
        }

        if (OY_BLOCK_HASH===null||typeof(OY_BLOCK[1][oy_data_payload[0][0]])==="undefined"||OY_BLOCK[1][oy_data_payload[0][0]][1]===0||OY_BLOCK[1][oy_data_payload[0][0]][2]<OY_BLOCK[0][15]) return false;

        if (OY_PEERS[oy_peer_id][1]===0) {
            oy_node_deny(oy_peer_id, "OY_DENY_OFFER_B_BLANK");
            return false;
        }

        if (oy_data_payload[1][0]===OY_SELF_PUBLIC) {
            let oy_signal_carry = oy_signal_soak(oy_data_payload[3]);
            if (OY_PEER_OFFER[0]===null||!oy_signal_carry||typeof(OY_NODES[oy_signal_carry[0]])!=="undefined"||!oy_key_verify(oy_data_payload[0][0], oy_data_payload[2], OY_PEER_OFFER[0]+OY_PEER_OFFER[1]+oy_data_payload[3])) return false;
            OY_NODES[oy_signal_carry[0]] = OY_PEER_OFFER[1];
            OY_PEER_OFFER = [null, null];
            oy_node_connect(oy_signal_carry[0]);
            OY_NODES[oy_signal_carry[0]].on("connect", function() {
                oy_node_initiate(oy_signal_carry[0]);
            });
            OY_NODES[oy_signal_carry[0]].signal(oy_signal_carry[1]);
        }
        else oy_data_route("OY_LOGIC_FOLLOW", "OY_PEER_OFFER_B", oy_data_payload);
    }
    else if (oy_data_flag==="OY_PEER_EXCHANGE_A") {//OY_LOGIC_DIRECT
        if (oy_data_payload.length!==2||typeof(oy_data_payload[0])!=="object"||typeof(oy_data_payload[1])!=="string"||!oy_signal_soak(oy_data_payload[1])) {
            oy_node_deny(oy_peer_id, "OY_DENY_EXCHANGE_A_INVALID");
            return false;
        }

        if (OY_BLOCK_HASH===null) return false;

        if (OY_PEERS[oy_peer_id][1]===0) {
            oy_node_deny(oy_peer_id, "OY_DENY_EXCHANGE_A_BLANK");
            return false;
        }
        if (OY_PEERS[oy_peer_id][11][2]===true) {
            oy_node_deny(oy_peer_id, "OY_DENY_EXCHANGE_A_ABUSE");
            return false;
        }
        OY_PEERS[oy_peer_id][11][2] = true;
        for (let oy_peer_select in OY_PEERS) {
            if (OY_PEERS[oy_peer_select][11][3]!==null&&oy_data_payload[0].indexOf(oy_hash_gen(oy_peer_select))===-1) {
                OY_PEERS[oy_peer_select][11][3] = oy_peer_id;
                oy_data_beam(oy_peer_select, "OY_PEER_EXCHANGE_B", oy_data_payload[1]);
                break;
            }
        }
    }
    else if (oy_data_flag==="OY_PEER_EXCHANGE_B") {//OY_LOGIC_DIRECT
        if (OY_BLOCK_HASH===null) return false;

        if (OY_PEERS[oy_peer_id][1]===0) {
            oy_node_deny(oy_peer_id, "OY_DENY_EXCHANGE_B_BLANK");
            return false;
        }
        let oy_signal_carry = oy_signal_soak(oy_data_payload);
        if (!oy_signal_carry) {
            oy_node_deny(oy_peer_id, "OY_DENY_EXCHANGE_B_INVALID");
            return false;
        }
        if (OY_PEERS[oy_peer_id][11][5]===true) {
            oy_node_deny(oy_peer_id, "OY_DENY_EXCHANGE_B_ABUSE");
            return false;
        }
        OY_PEERS[oy_peer_id][11][5] = true;
        if (typeof(OY_NODES[oy_signal_carry[0]])==="undefined") {
            OY_NODES[oy_signal_carry[0]] = oy_node_boot(false);
            OY_NODES[oy_signal_carry[0]].on("signal", function(oy_signal_data) {
                oy_data_beam(oy_peer_id, "OY_PEER_EXCHANGE_C", oy_signal_beam(oy_signal_data));
            });
            oy_node_connect(oy_signal_carry[0]);
            OY_NODES[oy_signal_carry[0]].signal(oy_signal_carry[1]);
        }
    }
    else if (oy_data_flag==="OY_PEER_EXCHANGE_C") {//OY_LOGIC_DIRECT
        if (OY_BLOCK_HASH===null) return false;

        if (OY_PEERS[oy_peer_id][1]===0) {
            oy_node_deny(oy_peer_id, "OY_DENY_EXCHANGE_C_BLANK");
            return false;
        }
        if (!oy_signal_soak(oy_data_payload)) {
            oy_node_deny(oy_peer_id, "OY_DENY_EXCHANGE_C_INVALID");
            return false;
        }
        if (OY_PEERS[oy_peer_id][11][4]===true) {
            oy_node_deny(oy_peer_id, "OY_DENY_EXCHANGE_C_ABUSE");
            return false;
        }
        OY_PEERS[oy_peer_id][11][4] = true;
        if (OY_PEERS[oy_peer_id][11][3]!==null&&typeof(OY_PEERS[OY_PEERS[oy_peer_id][11][3]])!=="undefined") oy_data_beam(oy_peer_id, "OY_PEER_EXCHANGE_D", oy_data_payload);
    }
    else if (oy_data_flag==="OY_PEER_EXCHANGE_D") {//OY_LOGIC_DIRECT
        if (OY_BLOCK_HASH===null) return false;

        if (OY_PEERS[oy_peer_id][1]===0) {
            oy_node_deny(oy_peer_id, "OY_DENY_EXCHANGE_D_BLANK");
            return false;
        }
        let oy_signal_carry = oy_signal_soak(oy_data_payload);
        if (!oy_signal_carry) {
            oy_node_deny(oy_peer_id, "OY_DENY_EXCHANGE_D_INVALID");
            return false;
        }
        if (OY_PEERS[oy_peer_id][10]===null) {
            oy_node_deny(oy_peer_id, "OY_DENY_EXCHANGE_D_MISALIGN");
            return false;
        }
        if (OY_PEERS[oy_peer_id][11][1]===true) {
            oy_node_deny(oy_peer_id, "OY_DENY_EXCHANGE_D_ABUSE");
            return false;
        }
        OY_PEERS[oy_peer_id][11][1] = true;
        if (typeof(OY_PEERS[oy_signal_carry[0]])!=="undefined") {
            oy_node_deny(oy_peer_id, "OY_DENY_EXCHANGE_D_MAP");
            return false;
        }
        if (typeof(OY_NODES[oy_signal_carry[0]])==="undefined") {
            OY_NODES[oy_signal_carry[0]] = OY_PEERS[oy_peer_id][10];
            OY_PEERS[oy_peer_id][10] = null;//TODO verify
            oy_node_connect(oy_signal_carry[0]);
            OY_NODES[oy_signal_carry[0]].on("connect", function() {
                oy_node_initiate(oy_signal_carry[0]);
            });
            OY_NODES[oy_signal_carry[0]].signal(oy_signal_carry[1]);
        }
    }
    else if (oy_data_flag==="OY_PEER_BASE") {//OY_LOGIC_DIRECT
        //source is sending entire block, in chunks, to self as latch
        /*
        if ((oy_time_local-OY_BLOCK_TIME>OY_BLOCK_SECTORS[0][0]&&oy_time_local-OY_BLOCK_TIME<OY_BLOCK_SECTORS[1][0])) {//TODO payload validation
            oy_node_deny(oy_peer_id, "OY_DENY_BASE_INVALID");
            return false;
        }
         */

        if (OY_BLOCK_DIFF===true||OY_BLOCK_HASH!==null) return false;//TODO consider timing validation

        OY_BASE_BUILD[oy_data_payload[1]] = oy_data_payload[2];//key is block_nonce and value is block_split
        let oy_base_pass = true;
        let oy_nonce_count = -1;
        for (let oy_block_nonce in OY_BASE_BUILD) {
            if (typeof(OY_BASE_BUILD[oy_block_nonce])!=="undefined") oy_nonce_count++;
            else {
                oy_base_pass = false;
                break;
            }
        }
        //TODO prevent clashes with bases from other mesh splits
        if (oy_nonce_count===oy_data_payload[0]&&oy_base_pass===true) {//check if block_nonce equals block_nonce_max
            OY_BLOCK_DIFF = true;
            oy_data_payload = null;

            OY_BLOCK_FLAT = LZString.decompressFromUTF16(OY_BASE_BUILD.join(""));
            OY_BASE_BUILD = [];
            OY_BLOCK = JSON.parse(OY_BLOCK_FLAT);
            OY_BLOCK_HASH = oy_hash_gen(OY_BLOCK_FLAT);
            OY_BLOCK_WEIGHT = new Blob([OY_BLOCK_FLAT]).size;

            if (!oy_block_verify(OY_BLOCK[2][1][OY_BLOCK[2][1].length-1], OY_BLOCK[1])) {
                oy_node_deny(oy_peer_id, "OY_DENY_WORK_INVALID");
                oy_block_reset("OY_RESET_BASE_INVALID");
                return false;
            }

            oy_log("BASE MESHBLOCK HASH "+OY_BLOCK_HASH, true);
            oy_log_debug("BASE MESHBLOCK HASH "+OY_BLOCK_HASH);//TODO temp
            console.log("BASE MESHBLOCK HASH "+OY_BLOCK_HASH);//TODO temp

            OY_LIGHT_STATE = true;
            OY_DIVE_STATE = false;

            if (typeof(OY_BLOCK_MAP)==="function") OY_BLOCK_MAP(0);
            oy_event_dispatch("oy_block_trigger");
            oy_event_dispatch("oy_state_light");

            let oy_time_offset = (Date.now()/1000)-OY_BLOCK_TIME;
            oy_chrono(function() {
                for (let oy_peer_select in OY_PEERS) {
                    oy_data_beam(oy_peer_select, "OY_PEER_LIGHT", oy_key_sign(OY_SELF_PRIVATE, OY_MESH_DYNASTY+OY_BLOCK_HASH));
                }
            }, (oy_time_offset>OY_BLOCK_SECTORS[0][0])?(OY_BLOCK_SECTORS[4][0]-oy_time_offset)*1000:0);
        }
        return true;
    }
    else if (oy_data_flag==="OY_PEER_DIFF") {//self as latch receives diff from source
        //oy_data_payload = [oy_dive_public, oy_diff_crypt, oy_diff_hash, oy_diff_nonce_max, oy_diff_nonce, oy_diff_split]
        //TODO payload validation

        let oy_diff_count = 0;
        for (let oy_peer_select in OY_PEERS) {
            if (OY_PEERS[oy_peer_select][1]!==0) oy_diff_count++;
        }

        let oy_diff_reference = oy_data_payload[2]+oy_data_payload[3];
        if (OY_BLOCK_DIFF===true||
            OY_LIGHT_STATE===false||
            OY_BLOCK_HASH===null||
            oy_time_local-OY_BLOCK_TIME<OY_BLOCK_SECTORS[0][0]||
            oy_time_local-OY_BLOCK_TIME>OY_BLOCK_SECTORS[2][0]||
            (oy_diff_count>1&&typeof(OY_BLOCK[1][oy_data_payload[0]])==="undefined")||
            (typeof(OY_LIGHT_BUILD[oy_diff_reference])!=="undefined"&&typeof(OY_LIGHT_BUILD[oy_diff_reference][3][oy_data_payload[4]])!=="undefined"&&typeof(OY_LIGHT_BUILD[oy_diff_reference][3][oy_data_payload[4]][0][oy_data_payload[0]])!=="undefined")) return false;//verify meshblock zone

        if (oy_data_payload[4]>oy_data_payload[3]||!oy_key_verify(oy_data_payload[0], oy_data_payload[1], oy_data_payload[2]+oy_data_payload[3]+oy_data_payload[4]+oy_data_payload[5])) {
            oy_node_deny(oy_peer_id, "OY_DENY_DIFF_INVALID");
            return false;
        }

        if (typeof(OY_LIGHT_BUILD[oy_diff_reference])==="undefined") {
            OY_LIGHT_BUILD[oy_diff_reference] = [oy_data_payload[2], oy_data_payload[3], {}, new Array(oy_data_payload[3]+1), oy_peer_id];
            OY_LIGHT_BUILD[oy_diff_reference][3].fill([{}, {}]);
        }

        if (typeof(OY_LIGHT_BUILD[oy_diff_reference][2][oy_data_payload[0]])==="undefined") OY_LIGHT_BUILD[oy_diff_reference][2][oy_data_payload[0]] = 1;
        else OY_LIGHT_BUILD[oy_diff_reference][2][oy_data_payload[0]]++;

        let oy_dive_count = 0;
        for (let oy_diff_reference_sub in OY_LIGHT_BUILD) {
            if (oy_diff_reference!==oy_diff_reference_sub&&typeof(OY_LIGHT_BUILD[oy_diff_reference_sub][2][oy_data_payload[0]])!=="undefined") {//prevents a node from claiming more than one diff_hash
                oy_node_deny(oy_peer_id, "OY_DENY_DIFF_ABUSE");
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
            if (OY_PEERS[oy_peer_select][1]===1&&oy_peer_select!==oy_peer_id) oy_data_beam(oy_peer_select, "OY_PEER_DIFF", oy_data_payload);
        }

        //if (OY_LIGHT_MODE===true&&OY_BOOST_BUILD.length<OY_BOOST_KEEP&&OY_BOOST_BUILD.indexOf(oy_data_payload[0])===-1&&typeof(OY_PEERS[oy_data_payload[0]])==="undefined"&&typeof(OY_NODES[oy_data_payload[0]])==="undefined") OY_BOOST_BUILD.push(oy_data_payload[0]);

        if (oy_dive_count>=OY_BLOCK[0][2]*OY_LIGHT_COMMIT) oy_block_light();
    }
    else if (oy_data_flag==="OY_PEER_LIGHT") {//peer as a blank or full node is converting into a light node
        if (OY_PEERS[oy_peer_id][1]===1) {
            oy_node_deny(oy_peer_id, "OY_DENY_LIGHT_MISALIGN");
            return false;
        }

        if (OY_BLOCK_HASH!==null&&!oy_key_verify(oy_peer_id, oy_data_payload, OY_MESH_DYNASTY+OY_BLOCK_HASH)) {
            oy_node_deny(oy_peer_id, "OY_DENY_LIGHT_FAIL");
            return false;
        }

        delete OY_BLOCK_CHALLENGE[oy_peer_id];
        OY_PEERS[oy_peer_id][1] = 1;
        return true;
    }
    else if (oy_data_flag==="OY_PEER_FULL") {//peer as a light node is converting into a full node
        if (OY_PEERS[oy_peer_id][0]<OY_BLOCK_TIME&&OY_PEERS[oy_peer_id][1]===2) {
            oy_node_deny(oy_peer_id, "OY_DENY_FULL_MISALIGN");
            return false;
        }

        if (OY_BLOCK_HASH!==null&&!oy_key_verify(oy_peer_id, oy_data_payload, OY_MESH_DYNASTY+OY_BLOCK_HASH)) {
            oy_node_deny(oy_peer_id, "OY_DENY_FULL_FAIL");
            return false;
        }

        delete OY_BLOCK_CHALLENGE[oy_peer_id];
        OY_PEERS[oy_peer_id][1] = 2;
        return true;
    }
    else if (oy_data_flag==="OY_PEER_LATENCY") {
        if (oy_data_payload[0]!==0&&OY_BLOCK_HASH===null) {
            oy_node_deny(oy_peer_id, "OY_DENY_BLOCK_NULL_A");
            return false;
        }
        oy_data_payload[1] = oy_key_sign(OY_SELF_PRIVATE, OY_MESH_DYNASTY+((oy_data_payload[0]===0)?"0000000000000000000000000000000000000000":OY_BLOCK_HASH)+oy_data_payload[1]);
        oy_data_beam(oy_peer_id, "OY_LATENCY_RESPONSE", oy_data_payload);
        return true;
    }
    else if (oy_data_flag==="OY_PEER_TERMINATE") {
        if (oy_peer_id===OY_JUMP_ASSIGN[0]) oy_block_jump_reset();
        oy_log_debug("TERMINATED: "+JSON.stringify(oy_data_payload)+" - "+oy_peer_id+" - "+((Date.now()/1000)-OY_BLOCK_TIME));
        console.log("TERMINATED: "+JSON.stringify(oy_data_payload)+" - "+oy_peer_id+" - "+((Date.now()/1000)-OY_BLOCK_TIME));
        oy_log("END["+oy_short(oy_peer_id)+"]["+oy_data_payload+"]", true);
        oy_node_deny(oy_peer_id, "OY_DENY_TERMINATE_RETURN");//return the favour
        return true;
    }
    else if (oy_data_flag==="OY_LATENCY_DECLINE") {
        oy_node_deny(oy_peer_id, "OY_DENY_LATENCY_DECLINE");
        return false;
    }
    else if (oy_data_flag==="OY_DATA_PUSH") {//store received data and potentially forward the push request to peers
        //oy_data_payload = [oy_route_passport_passive, oy_data_handle, oy_data_nonce, oy_data_value]
        //data received here will be committed to data_deposit with only randomness restrictions, mesh flow restrictions from oy_init() are sufficient
        if (oy_data_payload.length!==4||typeof(oy_data_payload[0])!=="object"||!oy_handle_check(oy_data_payload[1])||oy_data_payload[3].length>OY_DATA_CHUNK) {
            oy_node_deny(oy_peer_id, "OY_DENY_PUSH_INVALID");
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
            oy_node_deny(oy_peer_id, "OY_DENY_PULL_INVALID");
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
            oy_node_deny(oy_peer_id, "OY_DENY_DEPOSIT_INVALID");
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
            oy_node_deny(oy_peer_id, "OY_DENY_FULFILL_INVALID");
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
            oy_node_deny(oy_peer_id, "OY_DENY_CHANNEL_INVALID");
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
            oy_node_deny(oy_peer_id, "OY_DENY_CHANNEL_VERIFY");
            return false;
        }
    }
    else if (oy_data_flag==="OY_CHANNEL_ECHO") {
        //oy_data_payload = [oy_route_passport_passive, oy_route_passport_active, oy_route_dynamic_prev, oy_channel_id, oy_echo_crypt, oy_key_public]
        if (oy_data_payload.length!==6||typeof(oy_data_payload[0])!=="object"||typeof(oy_data_payload[1])!=="object"||oy_data_payload[1].length===0||!oy_channel_check(oy_data_payload[3])) {
            oy_node_deny(oy_peer_id, "OY_DENY_ECHO_INVALID");
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
            oy_node_deny(oy_peer_id, "OY_DENY_JUMP_INVALID");
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
            oy_node_deny(oy_peer_id, "OY_DENY_RESPOND_INVALID");
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
    else return false;

    return true;
}

//reports peership data to top, leads to seeing mesh big picture, mesh stability development, not required for mesh operation
function oy_peer_report() {
    console.log("REPORT: "+OY_REPORT_HASH+" "+((Date.now()/1000)-OY_BLOCK_TIME));
    let oy_xhttp = new XMLHttpRequest();
    oy_xhttp.onreadystatechange = function() {
        if (this.readyState===4&&this.status===200) {
            if (this.responseText.substr(0, 5)==="ERROR"||this.responseText.length===0) {
                oy_log("TOP[REPORT][ERROR]["+this.responseText+"]");
                return false;
            }
            if (this.responseText==="OY_REPORT_SUCCESS") oy_log("TOP[REPORT][PASS]");
            else oy_log("TOP[REPORT][FAIL]");
        }
    };
    let oy_peers_thin = {};
    for (let oy_peer_select in OY_PEERS) {
        oy_peers_thin[oy_peer_select] = OY_PEERS[oy_peer_select].slice();
        oy_peers_thin[oy_peer_select][4] = null;
        oy_peers_thin[oy_peer_select][6] = null;
        oy_peers_thin[oy_peer_select][8] = null;
    }

    let oy_report_payload = JSON.stringify([OY_SELF_PUBLIC, oy_state_current(), oy_peers_thin, {}]);
    let oy_report_hash = oy_hash_gen(oy_report_payload);
    if (OY_REPORT_HASH!==oy_report_hash) {
        OY_REPORT_HASH = oy_report_hash;
        oy_xhttp.open("POST", "https://top.oyster.org/oy_peer_report.php", true);
        oy_xhttp.send("oy_peer_report="+oy_report_payload);
    }
}

function oy_node_deny(oy_node_id, oy_deny_reason) {
    if (typeof(OY_PEERS[oy_node_id])!=="undefined") {
        console.log("%cREMOVE: "+(Date.now()/1000)+" "+oy_deny_reason+" - "+oy_node_id+" - "+OY_PEERS[oy_node_id][1]+" - "+((Date.now()/1000)-OY_BLOCK_TIME), "color: red");
        delete OY_PEERS[oy_node_id];
        if (Object.keys(OY_PEERS).length===0) oy_event_dispatch("oy_peers_null");
    }
    if (OY_JUMP_ASSIGN[0]===oy_node_id) {
        oy_log_debug("BLUE["+oy_deny_reason+"]["+JSON.stringify(OY_JUMP_ASSIGN)+"]");
        oy_block_jump_reset();
    }
    if (oy_deny_reason!=="OY_DENY_TERMINATE_RETURN"&&oy_deny_reason.indexOf("OY_DENY_CONN")===-1) oy_data_beam(oy_node_id, "OY_PEER_TERMINATE", oy_deny_reason);
    oy_node_reset(oy_node_id);
    oy_log("DENY["+oy_short(oy_node_id)+"]["+oy_deny_reason+"]", true);
    if (oy_deny_reason!=="OY_DENY_LATENCY_WEAK") oy_log_debug("DENY["+oy_deny_reason+"]["+oy_short(oy_node_id)+"]");
    return true;
}

function oy_node_reset(oy_node_id) {
    delete OY_LATENCY[oy_node_id];
    delete OY_PROPOSED[oy_node_id];
    delete OY_PEERS_PRE[oy_node_id];
    delete OY_JUMP_PRE[oy_node_id];
}

function oy_node_connect(oy_node_id) {
    if (typeof(OY_NODES[oy_node_id])==="undefined") return false;

    OY_NODES[oy_node_id].on("data", function(oy_data_raw) {
        oy_data_soak(oy_node_id, oy_data_raw);
    });
    OY_NODES[oy_node_id].on("error", function(oy_node_error) {
        oy_node_deny(oy_node_id, "OY_DENY_CONNECT_FAIL");
        oy_log("ERROR["+oy_short(oy_node_id)+"][OY_ERROR_CONNECT_FAIL]["+oy_node_error+"]", true);
    });
    OY_NODES[oy_node_id].on("close", function() {
        delete OY_NODES[oy_node_id];
        delete OY_COLD[oy_node_id];
    });
}

function oy_node_disconnect(oy_node_id) {
    if (typeof(OY_NODES[oy_node_id])!=="undefined") {
        oy_node_reset(oy_node_id);
        OY_COLD[oy_node_id] = true;
        OY_NODES[oy_node_id].destroy();
        return true;
    }
    return false;
}

//where the aggregate connectivity of the entire mesh begins
function oy_node_initiate(oy_node_id) {
    let oy_time_local = Date.now()/1000;

    if (typeof(OY_PEERS[oy_node_id])!=="undefined"||typeof(OY_PROPOSED[oy_node_id])!=="undefined"||typeof(OY_PEERS_PRE[oy_node_id])!=="undefined"||typeof(OY_LATENCY[oy_node_id])!=="undefined"||(Object.keys(OY_NODES).length>=OY_NODE_MAX&&OY_JUMP_ASSIGN[0]!==oy_node_id)||Object.keys(OY_PEERS).length>OY_PEER_MAX||oy_node_id===OY_SELF_PUBLIC||OY_BLOCK_BOOT===null||(OY_LIGHT_MODE===true&&OY_BLOCK_BOOT===true)||(oy_state_current()!==0&&OY_JUMP_ASSIGN[0]!==oy_node_id&&oy_time_local-OY_BLOCK_TIME>OY_BLOCK_SECTORS[0][0])) return false;
    OY_PROPOSED[oy_node_id] = true;
    oy_data_beam(oy_node_id, "OY_PEER_REQUEST", oy_state_current(true));
    return true;
}

function oy_node_assign() {
    if (OY_BLOCK_BOOT===null) return false;
}

function oy_node_boot(oy_boot_init) {
    let oy_boot_obj = {initiator:oy_boot_init, trickle:false};
    if (OY_NODE_STATE===true) oy_boot_obj.wrtc = wrtc;
    return new SimplePeer(oy_boot_obj);
}

/*
function oy_node_boost() {
    if (OY_BOOST_RESERVE.length===0) return true;

    while (OY_BOOST_RESERVE.length>0&&typeof(OY_PEERS[OY_BOOST_RESERVE[0]])!=="undefined") OY_BOOST_RESERVE.shift();
    //console.log("BOOST: "+OY_BOOST_RESERVE[0]);
    oy_node_initiate(OY_BOOST_RESERVE.shift());
    oy_chrono(oy_node_boost, OY_NODE_ASSIGN_DELAY);
}
*/

//respond to a node that is not mutually peered with self
function oy_node_negotiate(oy_node_id, oy_data_flag, oy_data_payload) {
    let oy_time_local = Date.now()/1000;

    if (oy_data_flag==="OY_PEER_ACCEPT") {
        oy_log_debug("BERRY: "+JSON.stringify([typeof(OY_PROPOSED[oy_node_id])!=="undefined", OY_JUMP_ASSIGN[0]===oy_node_id, oy_node_id, OY_JUMP_ASSIGN]));
        if (typeof(OY_PROPOSED[oy_node_id])!=="undefined"&&(OY_JUMP_ASSIGN[0]!==oy_node_id||(OY_JUMP_ASSIGN[0]===oy_node_id&&oy_data_payload===2))) oy_latency_test(oy_node_id, "OY_PEER_ACCEPT", oy_data_payload);
        else oy_node_deny(oy_node_id, "OY_DENY_FALSE_ACCEPT");
    }
    else if (oy_data_flag==="OY_PEER_AFFIRM") {
        if (typeof(OY_PEERS_PRE[oy_node_id])!=="undefined") oy_peer_add(oy_node_id, OY_PEERS_PRE[oy_node_id]);
        else oy_node_deny(oy_node_id, "OY_DENY_FALSE_AFFIRM");
    }
    else if (oy_data_flag==="OY_PEER_LATENCY") {//respond to latency ping from node with peer proposal arrangement
        if (typeof(OY_PROPOSED[oy_node_id])!=="undefined"||typeof(OY_PEERS_PRE[oy_node_id])!=="undefined") {
            if (oy_data_payload[0]!==0&&OY_BLOCK_HASH===null) oy_node_deny(oy_node_id, "OY_DENY_BLOCK_NULL_B");
            else {
                oy_data_payload[1] = oy_key_sign(OY_SELF_PRIVATE, OY_MESH_DYNASTY+((oy_data_payload[0]===0)?"0000000000000000000000000000000000000000":OY_BLOCK_HASH)+oy_data_payload[1]);
                oy_data_beam(oy_node_id, "OY_LATENCY_RESPONSE", oy_data_payload);
            }
        }
        else oy_data_beam(oy_node_id, "OY_LATENCY_DECLINE", null);
    }
    else if (oy_data_flag==="OY_PEER_REQUEST") {
        //TODO timing validation
        if (oy_node_id===OY_JUMP_ASSIGN[0]) oy_log_debug("JUMP_DEBUG_REQUEST: "+JSON.stringify([Object.keys(OY_PEERS).length>OY_PEER_MAX, (oy_state_current()===0&&oy_data_payload===0), OY_BLOCK_BOOT===null, (OY_BLOCK_BOOT===true&&oy_data_payload!==2), oy_data_payload]));
        if (Object.keys(OY_PEERS).length>OY_PEER_MAX||
            (oy_state_current()===0&&oy_data_payload===0)||
            (OY_JUMP_ASSIGN[0]!==oy_node_id&&oy_time_local-OY_BLOCK_TIME>OY_BLOCK_SECTORS[0][0])||
            OY_BLOCK_BOOT===null||
            (OY_BLOCK_BOOT===true&&oy_data_payload!==2)) oy_data_beam(oy_node_id, "OY_PEER_UNREADY", null);
        else oy_latency_test(oy_node_id, "OY_PEER_REQUEST", oy_data_payload);
    }
    else if (oy_data_flag==="OY_LATENCY_DECLINE") oy_node_deny(oy_node_id, "OY_DENY_LATENCY_DECLINE");
    else if (oy_data_flag==="OY_JUMP_REQUEST") {
        oy_log_debug("JUMP_DEBUG_A: "+oy_node_id+" "+JSON.stringify([OY_JUMP_ASSIGN[0], typeof(OY_JUMP_PRE[oy_node_id]), oy_state_current(), Object.keys(OY_BLOCK_JUMP_MAP).length, oy_time_local-OY_BLOCK_TIME>OY_BLOCK_SECTORS[3][0]-OY_MESH_BUFFER[0], oy_time_local-OY_BLOCK_TIME<OY_BLOCK_SECTORS[4][0]+OY_MESH_BUFFER[0]]));
        if (OY_JUMP_ASSIGN[0]===null&&typeof(OY_JUMP_PRE[oy_node_id])==="undefined"&&oy_state_current()===2&&Object.keys(OY_BLOCK_JUMP_MAP).length>1&&oy_time_local-OY_BLOCK_TIME>OY_BLOCK_SECTORS[3][0]-OY_MESH_BUFFER[0]&&oy_time_local-OY_BLOCK_TIME<OY_BLOCK_SECTORS[4][0]+OY_MESH_BUFFER[0]) {
            oy_log_debug("JUMP_DEBUG_B: "+oy_node_id);
            OY_JUMP_PRE[oy_node_id] = true;
            let oy_jump_response = [OY_BLOCK[0][10], Object.keys(OY_BLOCK[3]).length, OY_BLOCK[2][1], {}];
            for (let oy_block_time in OY_BLOCK_JUMP_MAP) {
                if (typeof(OY_BLOCK_SYNC_PASS[oy_block_time])!=="undefined"&&typeof(OY_BLOCK_COMMAND_ROLLBACK[oy_block_time])!=="undefined") oy_jump_response[3][oy_block_time] = OY_BLOCK_JUMP_MAP[oy_block_time][0];//TODO consider a check to prevent sending expired jump entries
            }
            oy_data_beam(oy_node_id, "OY_JUMP_RESPONSE", oy_jump_response);
            oy_log_debug("ALPHA: "+oy_short(oy_node_id)+" "+JSON.stringify([OY_BLOCK[0], OY_BLOCK[1], OY_BLOCK[2]]));
        }
        else {
            oy_log_debug("JUMP_DEBUG_D: "+oy_node_id);
            oy_data_beam(oy_node_id, "OY_JUMP_UNREADY", null);
        }
    }
    else if (oy_data_flag==="OY_JUMP_RESPONSE") {
        oy_log_debug("JUMP_DEBUG_E: "+oy_node_id+" "+JSON.stringify([OY_JUMP_ASSIGN[0]===null, typeof(OY_JUMP_PRE[oy_node_id])!=="undefined", OY_JUMP_PRE[oy_node_id]===false, oy_state_current(), Object.keys(OY_BLOCK_JUMP_MAP).length, oy_time_local-OY_BLOCK_TIME>OY_BLOCK_SECTORS[3][0]-OY_MESH_BUFFER[0], oy_time_local-OY_BLOCK_TIME<OY_BLOCK_SECTORS[4][0]+OY_MESH_BUFFER[0]]));
        if (OY_JUMP_ASSIGN[0]===null&&typeof(OY_JUMP_PRE[oy_node_id])!=="undefined"&&OY_JUMP_PRE[oy_node_id]===false&&oy_state_current()===2&&Object.keys(OY_BLOCK_JUMP_MAP).length>1&&oy_time_local-OY_BLOCK_TIME>OY_BLOCK_SECTORS[3][0]-OY_MESH_BUFFER[0]&&oy_time_local-OY_BLOCK_TIME<OY_BLOCK_SECTORS[4][0]+OY_MESH_BUFFER[0]) {
            oy_log_debug("JUMP_DEBUG_F: "+oy_node_id);
            OY_JUMP_PRE[oy_node_id] = true;
            if (JSON.stringify(OY_BLOCK[2][1])===JSON.stringify(oy_data_payload[2])) {
                oy_data_beam(oy_node_id, "OY_JUMP_REJECT", null);
                oy_log_debug("JUMP_DEBUG_Z: "+oy_node_id);
                return false;
            }
            if (oy_data_payload[0]<=OY_BLOCK[0][10]) {
                oy_log_debug("JUMP_DEBUG_H: "+oy_node_id);
                if (oy_data_payload[0]===OY_BLOCK[0][10]&&oy_data_payload[1]===Object.keys(OY_BLOCK[3]).length) oy_data_beam(oy_node_id, "OY_JUMP_REJECT", null);
                else if (oy_data_payload[1]<Object.keys(OY_BLOCK[3]).length) {
                    let oy_jump_response = [OY_BLOCK[0][10], Object.keys(OY_BLOCK[3]).length, OY_BLOCK[2][1], {}];
                    for (let oy_block_time in OY_BLOCK_JUMP_MAP) {
                        if (typeof(OY_BLOCK_SYNC_PASS[oy_block_time])!=="undefined"&&typeof(OY_BLOCK_COMMAND_ROLLBACK[oy_block_time])!=="undefined") oy_jump_response[3][oy_block_time] = OY_BLOCK_JUMP_MAP[oy_block_time][0];//TODO consider a check to prevent sending expired jump entries
                    }
                    oy_data_beam(oy_node_id, "OY_JUMP_RESPONSE", oy_jump_response);
                }
                return true;
            }
            oy_log_debug("JUMP_DEBUG_I: "+oy_node_id);
            let oy_jump_sort = [];
            for (let oy_block_time in OY_BLOCK_JUMP_MAP) {
                oy_jump_sort.push([parseInt(oy_block_time), OY_BLOCK_JUMP_MAP[oy_block_time][0]]);
            }
            oy_jump_sort.sort(function(a, b) {
                return b[0] - a[0];
            });
            let oy_jump_match = null;
            for (let i in oy_jump_sort) {
                if (typeof(oy_data_payload[3][oy_jump_sort[i][0]])!=="undefined"&&oy_jump_sort[i][1]===oy_data_payload[3][oy_jump_sort[i][0]]) {
                    oy_jump_match = oy_jump_sort[i][0];
                    break;
                }
            }
            oy_log_debug("JUMP_DEBUG_J: "+oy_node_id);
            if (oy_jump_match===null) {
                oy_log_debug("JUMP_DEBUG_K: "+oy_node_id);
                oy_data_beam(oy_node_id, "OY_JUMP_REJECT", null);
            }
            else {
                OY_JUMP_ASSIGN[0] = oy_node_id;
                OY_JUMP_ASSIGN[1] = oy_jump_match;
                oy_data_beam(oy_node_id, "OY_JUMP_CONTINUE", oy_jump_match);
                delete OY_PROPOSED[oy_node_id];//TODO remove, replaced by terminate node_reset
            }
        }
        else {
            oy_log_debug("JUMP_DEBUG_G: "+oy_node_id);
            oy_data_beam(oy_node_id, "OY_JUMP_UNREADY", null);
        }
    }
    else if (oy_data_flag==="OY_JUMP_CONTINUE") {
        oy_log_debug("JUMP_DEBUG_M: "+oy_node_id);
        if (typeof(OY_JUMP_PRE[oy_node_id])!=="undefined"&&OY_JUMP_PRE[oy_node_id]===true&&oy_state_current()===2&&Object.keys(OY_BLOCK_JUMP_MAP).length>1&&typeof(OY_BLOCK_JUMP_MAP[oy_data_payload])!=="undefined"&&typeof(OY_BLOCK_SYNC_PASS[oy_data_payload])!=="undefined"&&typeof(OY_BLOCK_COMMAND_ROLLBACK[oy_data_payload])!=="undefined"&&oy_time_local-OY_BLOCK_TIME>OY_BLOCK_SECTORS[3][0]&&oy_time_local-OY_BLOCK_TIME<OY_BLOCK_SECTORS[4][0]) {
            oy_log_debug("JUMP_DEBUG_M1: "+oy_node_id);
            OY_JUMP_ASSIGN[0] = oy_node_id;
            OY_JUMP_ASSIGN[1] = oy_data_payload;
            let oy_block_sync_pass = {};
            for (let oy_block_time in OY_BLOCK_SYNC_PASS) {
                if (parseInt(oy_block_time)>=OY_JUMP_ASSIGN[1]) oy_block_sync_pass[oy_block_time] = OY_BLOCK_SYNC_PASS[oy_block_time];
            }
            let oy_block_command_rollback = {};
            for (let oy_block_time in OY_BLOCK_COMMAND_ROLLBACK) {
                if (parseInt(oy_block_time)>=OY_JUMP_ASSIGN[1]) oy_block_command_rollback[oy_block_time] = OY_BLOCK_COMMAND_ROLLBACK[oy_block_time];
            }
            oy_log_debug("JUMP_DEBUG_M2: "+oy_node_id);
            let oy_jump_payload = JSON.stringify([oy_hash_gen(OY_BLOCK_HASH), oy_block_sync_pass, oy_block_command_rollback]);
            let oy_block_nonce_max = -1;
            let oy_block_split = [];
            for (let i = 0; i < oy_jump_payload.length; i+=OY_LIGHT_CHUNK) {
                oy_block_split.push(oy_jump_payload.slice(i, i+OY_LIGHT_CHUNK));//split the current block into chunks
                oy_block_nonce_max++;
            }
            oy_jump_payload = null;oy_log_debug("JUMP_DEBUG_M3: "+oy_node_id);
            let oy_block_juggle = [];
            for (let oy_block_nonce in oy_block_split) {
                oy_block_juggle.push(oy_block_nonce);
            }
            oy_calc_shuffle(oy_block_juggle);oy_log_debug("JUMP_DEBUG_M4: "+oy_node_id);

            for (let i in oy_block_juggle) {
                oy_data_beam(oy_node_id, "OY_JUMP_FULFILL", [oy_block_nonce_max, oy_block_juggle[i], oy_block_split[oy_block_juggle[i]]]);
            }
            oy_log_debug("JUMP_DEBUG_N: "+oy_node_id);
        }
        else {
            oy_log_debug("JUMP_DEBUG_O: "+oy_node_id);
            oy_data_beam(oy_node_id, "OY_JUMP_UNREADY", null);
        }
    }
    else if (oy_data_flag==="OY_JUMP_FULFILL") {
        if (OY_JUMP_ASSIGN[0]!==oy_node_id||OY_JUMP_ASSIGN[1]===null||oy_state_current()!==2) {
            oy_node_deny(oy_node_id, "OY_DENY_JUMP_MISALIGN");
            return false;
        }

        oy_log_debug("JUMP_DEBUG_U");

        OY_JUMP_BUILD[oy_data_payload[1]] = oy_data_payload[2];//key is block_nonce and value is block_split
        let oy_jump_pass = true;
        let oy_nonce_count = -1;
        for (let oy_block_nonce in OY_JUMP_BUILD) {
            if (typeof(OY_JUMP_BUILD[oy_block_nonce])!=="undefined") oy_nonce_count++;
            else {
                oy_jump_pass = false;
                break;
            }
        }

        if (oy_nonce_count===oy_data_payload[0]&&oy_jump_pass===true) {//check if block_nonce equals block_nonce_max
            oy_data_payload = null;
            let [oy_hash_hash, oy_block_sync_pass, oy_block_command_rollback] = JSON.parse(OY_JUMP_BUILD.join(""));
            OY_JUMP_BUILD = [];

            let oy_block_keep = [];
            let oy_jump_map = {};

            OY_BLOCK_FLAT_JUMP = null;
            OY_BLOCK_JUMP = JSON.parse(LZString.decompressFromUTF16(OY_BLOCK_JUMP_MAP[OY_JUMP_ASSIGN[1]][2]));
            OY_BLOCK_HASH_JUMP = OY_BLOCK_JUMP_MAP[OY_JUMP_ASSIGN[1]][0];
            for (OY_BLOCK_TIME_JUMP = OY_BLOCK_JUMP[0][1]+OY_BLOCK_SECTORS[5][0]; OY_BLOCK_TIME_JUMP<=OY_BLOCK_TIME; OY_BLOCK_TIME_JUMP+=OY_BLOCK_SECTORS[5][0]) {
                OY_BLOCK_NEXT_JUMP = OY_BLOCK_TIME_JUMP+OY_BLOCK_SECTORS[5][0];
                oy_log_debug("JUMP_DEBUG_U3");

                let oy_time_offset = (Date.now()/1000)-OY_BLOCK_TIME;
                if (oy_time_offset<OY_BLOCK_SECTORS[3][0]||oy_time_offset>OY_BLOCK_SECTORS[4][0]) {
                    oy_node_deny(oy_node_id, "OY_DENY_JUMP_TIMEOUT");
                    return false;
                }
                if (typeof(oy_block_sync_pass[OY_BLOCK_TIME_JUMP])==="undefined") {
                    oy_log_debug("RED1: "+JSON.stringify([OY_JUMP_ASSIGN[1], OY_BLOCK_TIME_JUMP, OY_BLOCK_TIME, oy_block_sync_pass]));
                    oy_node_deny(oy_node_id, "OY_DENY_JUMP_FAIL_E");
                    return false;
                }
                if (typeof(oy_block_command_rollback[OY_BLOCK_TIME_JUMP])==="undefined") {
                    oy_log_debug("RED2: "+JSON.stringify([OY_JUMP_ASSIGN[1], OY_BLOCK_TIME_JUMP, OY_BLOCK_TIME, oy_block_command_rollback]));
                    oy_node_deny(oy_node_id, "OY_DENY_JUMP_FAIL_F");
                    return false;
                }

                let oy_command_execute = oy_block_command_hash(JSON.parse(LZString.decompressFromUTF16(oy_block_command_rollback[OY_BLOCK_TIME_JUMP])));

                if (!oy_block_command_scan(oy_command_execute, true)) {
                    oy_node_deny(oy_node_id, "OY_DENY_JUMP_FAIL_G");
                    return false;
                }

                OY_BLOCK_JUMP[0][7] = 0;oy_log_debug("JUMP_DEBUG_U4");
                let oy_dive_ledger = {};
                for (let oy_key_public in oy_block_sync_pass[OY_BLOCK_TIME_JUMP]) {
                    if (!oy_work_verify(OY_BLOCK_TIME_JUMP, oy_key_public, OY_BLOCK_HASH_JUMP, OY_BLOCK_JUMP[0][3], oy_block_sync_pass[OY_BLOCK_TIME_JUMP][oy_key_public][1])) {
                        oy_log_debug("SILVER2: "+JSON.stringify([LZString.decompressFromUTF16(OY_BLOCK_JUMP_MAP[OY_JUMP_ASSIGN[1]][2]), [oy_hash_hash, oy_block_sync_pass, oy_block_command_rollback]]));
                        oy_node_deny(oy_node_id, "OY_DENY_JUMP_FAIL_H");
                        return false;
                    }
                    let oy_grade_array = [];
                    for (let i in oy_block_sync_pass[OY_BLOCK_TIME_JUMP][oy_key_public][1]) {
                        oy_grade_array.push(oy_calc_grade(oy_block_sync_pass[OY_BLOCK_TIME_JUMP][oy_key_public][1][i]));
                    }
                    //[[0]:work_grade, [1]:grade_top, [2]:uptime_count, [3]:transact_fee_payout, [4]:oy_dive_payout, [5]:oy_dive_team, [6]:oy_full_intro, [7]:work_solutions]
                    let [oy_dive_payout, oy_dive_team, oy_full_intro] = oy_block_sync_pass[OY_BLOCK_TIME_JUMP][oy_key_public][0];
                    oy_dive_ledger[oy_key_public] = [Math.floor(oy_calc_avg(oy_grade_array)), 0, (typeof(OY_BLOCK_JUMP[1][oy_key_public])!=="undefined")?OY_BLOCK_JUMP[1][oy_key_public][2]+1:1, oy_block_sync_pass[OY_BLOCK_TIME_JUMP][oy_key_public][2], (oy_dive_payout===false)?0:oy_dive_payout, (oy_dive_team===false)?0:oy_dive_team, (oy_full_intro===false)?0:oy_full_intro, oy_block_sync_pass[OY_BLOCK_TIME_JUMP][oy_key_public][1]];
                    OY_BLOCK_JUMP[0][7] += oy_dive_ledger[oy_key_public][0];
                }

                OY_BLOCK_JUMP[1] = oy_block_dive_sort(oy_dive_ledger);
                oy_dive_ledger = null;

                OY_BLOCK_JUMP[0][2] = Object.keys(OY_BLOCK_JUMP[1]).length;

                if (OY_BLOCK_FLAT_JUMP!==null&&OY_BLOCK_JUMP[0][6]===OY_BLOCK_EPOCH_MICRO) {
                    oy_jump_map[oy_clone_object(OY_BLOCK_TIME_JUMP)] = [oy_clone_object(OY_BLOCK_HASH_JUMP), oy_clone_object(OY_BLOCK_JUMP[2][1]), LZString.compressToUTF16(OY_BLOCK_FLAT_JUMP)];//TODO clone?
                }

                if (!oy_block_process(oy_command_execute, true, true)) {
                    oy_node_deny(oy_node_id, "OY_DENY_JUMP_FAIL_I");
                    return false;
                }

                OY_BLOCK_FLAT_JUMP = JSON.stringify(OY_BLOCK_JUMP);
                OY_BLOCK_HASH_JUMP = oy_hash_gen(OY_BLOCK_FLAT_JUMP);
                oy_block_keep.push(OY_BLOCK_TIME_JUMP);
            }

            oy_log_debug("JUMP_DEBUG_U5");

            let oy_time_offset = (Date.now()/1000)-OY_BLOCK_TIME;
            if (oy_hash_gen(OY_BLOCK_HASH_JUMP)===oy_hash_hash&&JSON.stringify(OY_BLOCK[2][1])!==JSON.stringify(OY_BLOCK_JUMP[2][1])&&oy_time_offset>OY_BLOCK_SECTORS[3][0]-OY_MESH_BUFFER[0]&&oy_time_offset<OY_BLOCK_SECTORS[4][0]+OY_MESH_BUFFER[0]) {
                oy_worker_halt(0);

                OY_BLOCK_FLAT = OY_BLOCK_FLAT_JUMP;
                OY_BLOCK = JSON.parse(OY_BLOCK_FLAT);
                OY_BLOCK_HASH = oy_clone_object(OY_BLOCK_HASH_JUMP);
                OY_BLOCK_WEIGHT = new Blob([OY_BLOCK_FLAT]).size;
                OY_BLOCK_FLAT = null;
                OY_DIVE_STATE = false;

                OY_BLOCK_JUMP = null;
                OY_BLOCK_FLAT_JUMP = null;
                OY_BLOCK_HASH_JUMP = null;
                OY_BLOCK_TIME_JUMP = null;
                OY_BLOCK_NEXT_JUMP = null;

                for (let oy_block_time in oy_jump_map) {
                    oy_log_debug("PURPLE: "+OY_SELF_SHORT+" "+oy_block_time+" - "+JSON.stringify(OY_BLOCK_JUMP_MAP[oy_block_time])+" - "+JSON.stringify(oy_clone_object(oy_jump_map[oy_block_time])));
                    OY_BLOCK_JUMP_MAP[oy_block_time] = oy_clone_object(oy_jump_map[oy_block_time]);
                }
                for (let i in oy_block_keep) {
                    oy_log_debug("WHITE: "+OY_SELF_SHORT+" "+oy_block_keep[i]+" - "+JSON.stringify(OY_BLOCK_SYNC_PASS[oy_block_keep[i]])+" - "+JSON.stringify(oy_clone_object(oy_block_sync_pass[oy_block_keep[i]])));
                    OY_BLOCK_SYNC_PASS[oy_block_keep[i]] = oy_clone_object(oy_block_sync_pass[oy_block_keep[i]]);
                    OY_BLOCK_COMMAND_ROLLBACK[oy_block_keep[i]] = oy_clone_object(oy_block_command_rollback[oy_block_keep[i]]);
                }

                oy_log_debug("JUMP_PASS: "+OY_SELF_SHORT+" - "+OY_BLOCK_HASH);

                for (let oy_peer_select in OY_PEERS) {
                    if (OY_PEERS[oy_peer_select][1]===0) OY_PEERS[oy_peer_select][2] = false;
                }

                oy_block_finish();

                oy_node_initiate(oy_node_id);

                oy_chrono(function() {
                    oy_block_challenge(0);
                }, (OY_BLOCK_SECTORS[4][0]-oy_time_offset)*1000);

                oy_chrono(function() {
                    oy_block_challenge(1);
                }, (OY_BLOCK_SECTORS[5][0]-oy_time_offset)*1000);
            }
            else {
                oy_log_debug("JUMP_DEBUG_U6");
                oy_node_deny(oy_node_id, "OY_DENY_JUMP_FAIL_I");
                return false;
            }
        }
    }
    else if (oy_data_flag==="OY_PEER_TERMINATE"||oy_data_flag==="OY_PEER_UNREADY"||oy_data_flag==="OY_JUMP_UNREADY"||oy_data_flag==="OY_JUMP_REJECT") {
        if (oy_node_id===OY_JUMP_ASSIGN[0]) {
            oy_block_jump_reset();
            oy_node_deny(oy_node_id, "OY_DENY_JUMP_REJECT");
            oy_log_debug("TREE: "+JSON.stringify([OY_JUMP_ASSIGN, oy_data_payload]));
        }
        else oy_node_reset(oy_node_id);
        oy_log("END["+oy_short(oy_node_id)+"]["+oy_data_payload+"]", true);
    }
    else {
        oy_node_deny(oy_node_id, "OY_DENY_DATA_INCOHERENT");
        oy_log_debug("INCOHERENT: "+oy_data_flag);
        console.log("INCOHERENT: "+oy_data_flag);
    }
}

//test latency performance between self and node
function oy_latency_test(oy_node_id, oy_latency_followup, oy_status_flag) {
    if (typeof(OY_LATENCY[oy_node_id])==="undefined") {
        //[0] is pending payload unique string
        //[1] is start time for latency test timer
        //[2] is followup flag i.e. what logic should follow after the latency test concludes
        //[3] is lowest common denominator between states of both nodes
        //[4] is the state flag of the opposite node
        OY_LATENCY[oy_node_id] = [null, 0, oy_latency_followup, Math.min(oy_status_flag, oy_state_current()), oy_status_flag];
    }
    if (oy_latency_followup!==OY_LATENCY[oy_node_id][2]) return false;
    //ping a unique payload string that is repeated OY_LATENCY_SIZE amount of times
    OY_LATENCY[oy_node_id][0] = oy_rand_gen(OY_LATENCY_LENGTH);
    if (oy_data_beam(oy_node_id, "OY_PEER_LATENCY", [OY_LATENCY[oy_node_id][3], OY_LATENCY[oy_node_id][0], OY_LATENCY[oy_node_id][0].repeat(OY_LATENCY_SIZE)])) OY_LATENCY[oy_node_id][1] = Date.now()/1000;
    else {
        oy_node_deny(oy_node_id, "OY_DENY_LATENCY_FAIL");
        return false;
    }
    return true;
}

//process the latency response from another node
function oy_latency_response(oy_node_id, oy_data_payload) {
    if (typeof(OY_LATENCY[oy_node_id])==="undefined") {
        oy_node_deny(oy_node_id, "OY_DENY_LATENCY_NONE");
        return false;
    }
    else if (OY_LATENCY[oy_node_id][2]==="OY_PEER_ROUTINE"&&typeof(OY_PEERS[oy_node_id])==="undefined") {
        oy_node_deny(oy_node_id, "OY_DENY_LATENCY_PEER");
        return false;
    }
    let oy_time_local = Date.now()/1000;
    if (!oy_key_verify(oy_node_id, oy_data_payload[1], OY_MESH_DYNASTY+((OY_LATENCY[oy_node_id][3]===0)?"0000000000000000000000000000000000000000":OY_BLOCK_HASH)+OY_LATENCY[oy_node_id][0])) {
        let oy_latency_hold = oy_clone_object(OY_LATENCY[oy_node_id]);
        oy_node_deny(oy_node_id, "OY_DENY_SIGN_FAIL");
        if (OY_JUMP_ASSIGN[0]===null&&typeof(OY_JUMP_PRE[oy_node_id])==="undefined"&&oy_latency_hold[3]===2&&Object.keys(OY_BLOCK_JUMP_MAP).length>1&&oy_latency_hold[2]==="OY_PEER_REQUEST") {
            OY_JUMP_PRE[oy_node_id] = false;
            oy_log_debug("JUMP_DEBUG: "+Object.keys(OY_BLOCK_JUMP_MAP).length);
            oy_chrono(function() {
                oy_data_beam(oy_node_id, "OY_JUMP_REQUEST", null);
                oy_log_debug("JUMP_DEBUG2: "+Object.keys(OY_BLOCK_JUMP_MAP).length);
            }, ((OY_BLOCK_SECTORS[3][0]-(oy_time_local-OY_BLOCK_TIME))*1000)+OY_BLOCK_BUFFER_CLEAR[1]);
        }
        return false;
    }
    if (OY_LATENCY[oy_node_id][0].repeat(OY_LATENCY_SIZE)===oy_data_payload[2]) {//check if payload data matches latency session definition
        delete OY_BLOCK_CHALLENGE[oy_node_id];

        let oy_latency_result = oy_time_local-OY_LATENCY[oy_node_id][1];
        if (oy_latency_result>=OY_BLOCK_SECTORS[4][0]-OY_BLOCK_SECTORS[3][0]) oy_node_deny(oy_node_id, "OY_DENY_LATENCY_BREACH");
        else if (OY_LATENCY[oy_node_id][2]==="OY_PEER_REQUEST"||OY_LATENCY[oy_node_id][2]==="OY_PEER_ACCEPT") {
            let oy_accept_response = function() {
                if (OY_LATENCY[oy_node_id][2]==="OY_PEER_REQUEST") {
                    OY_PEERS_PRE[oy_node_id] = oy_clone_object(OY_LATENCY[oy_node_id][4]);
                    oy_data_beam(oy_node_id, "OY_PEER_ACCEPT", oy_state_current());
                }
                else if (OY_LATENCY[oy_node_id][2]==="OY_PEER_ACCEPT") {
                    oy_peer_add(oy_node_id, OY_LATENCY[oy_node_id][4]);
                    oy_data_beam(oy_node_id, "OY_PEER_AFFIRM", null);
                }
                oy_peer_latency(oy_node_id, oy_latency_result);
            };
            let oy_full_count = 0;
            if (oy_state_current()===2) {
                for (let oy_peer_select in OY_PEERS) {
                    if (OY_PEERS[oy_peer_select][1]===2&&typeof(OY_BLOCK[1][oy_peer_select])!=="undefined") oy_full_count++;
                }
            }
            if (OY_JUMP_ASSIGN[0]===oy_node_id) oy_log_debug("JUMP_DEBUG_LATENCY_A: "+OY_LATENCY[oy_node_id][2]+" - "+oy_node_id);
            if (((((OY_LIGHT_MODE===OY_LIGHT_STATE||(OY_LIGHT_MODE===true&&OY_LIGHT_STATE===false))&&Object.keys(OY_PEERS).length<OY_PEER_MAX)||(OY_LIGHT_MODE===false&&OY_LIGHT_STATE===true&&Object.keys(OY_PEERS).length<OY_PEER_MAX-1))&&(oy_state_current()!==2||OY_LATENCY[oy_node_id][4]===2||Object.keys(OY_PEERS).length-oy_full_count<OY_PEER_MAX-OY_PEER_FULL_MIN))||(OY_JUMP_ASSIGN[0]===oy_node_id&&Object.keys(OY_PEERS).length<=OY_PEER_MAX)) {//TODO test system without jump bypass once jumping works
                if (OY_JUMP_ASSIGN[0]===oy_node_id) oy_log_debug("JUMP_DEBUG_LATENCY_B: "+OY_LATENCY[oy_node_id][2]+" - "+oy_node_id);//TODO update jumpy map upon JUMP_DROP to lock out old peers - might need delay for 2+ splits
                oy_accept_response();
            }
            else {
                if (OY_JUMP_ASSIGN[0]===oy_node_id) oy_log_debug("JUMP_DEBUG_LATENCY_C: "+OY_LATENCY[oy_node_id][2]+" "+oy_node_id);
                let oy_peer_weak = [null, -1];
                for (let oy_peer_select in OY_PEERS) {
                    if (OY_PEERS[oy_peer_select][3]>oy_peer_weak[1]&&
                        oy_time_local-OY_PEERS[oy_peer_select][0]>=OY_PEER_RESERVETIME&&
                        OY_PEERS[oy_peer_select][9]<OY_PEER_CUT&&
                        (oy_state_current()!==2||OY_LATENCY[oy_node_id][4]===2||OY_PEERS[oy_peer_select][1]!==2||typeof(OY_BLOCK[1][oy_peer_select])==="undefined")||OY_JUMP_ASSIGN[0]===oy_node_id) oy_peer_weak = [oy_peer_select, OY_PEERS[oy_peer_select][3]];
                }
                if (oy_peer_weak[0]!==null&&oy_latency_result*OY_LATENCY_GEO_SENS<oy_peer_weak[1]&&OY_BLOCK_BOOT===false) {
                    if (OY_JUMP_ASSIGN[0]===oy_node_id) oy_log_debug("JUMP_DEBUG_LATENCY_D: "+oy_node_id);
                    oy_node_deny(oy_peer_weak[0], "OY_DENY_LATENCY_DROP");
                    oy_accept_response();
                }
                else {
                    if (OY_JUMP_ASSIGN[0]===oy_node_id) oy_log_debug("JUMP_DEBUG_LATENCY_E: "+oy_node_id);
                    oy_node_deny(oy_node_id, "OY_DENY_LATENCY_WEAK");
                }
            }
        }
        else if (typeof(OY_PEERS[oy_node_id])!=="undefined"&&OY_LATENCY[oy_node_id][2]==="OY_PEER_ROUTINE") oy_peer_latency(oy_node_id, oy_latency_result);

        delete OY_LATENCY[oy_node_id];
    }
    else oy_node_deny(oy_node_id, "OY_DENY_LATENCY_INVALID");
}

function oy_state_current(oy_seek_mode) {
    if (OY_BLOCK_HASH!==null) {
        if (OY_LIGHT_STATE===false||(typeof(oy_seek_mode)!=="undefined"&&oy_seek_mode===true&&OY_LIGHT_MODE===false)) return 2;//full node
        return 1;//light node
    }
    return 0;//blank node
}

//measures data flow on the mesh in either beam or soak direction
//returns false on mesh flow violation/cooling state and true on compliance
function oy_data_measure(oy_data_beam, oy_node_id, oy_data_length) {
    if (typeof(OY_PEERS[oy_node_id])==="undefined") return false;

    let oy_time_local = Date.now()/1000;
    let oy_array_select;
    if (oy_data_beam===false) oy_array_select = 8;
    else oy_array_select = 6;

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
    if (oy_data_payload[0].indexOf(OY_SELF_SHORT)!==-1) return false;
    if (typeof(oy_push_define)!=="undefined") {//TODO verify
        if (typeof(OY_DATA_PUSH[oy_data_payload[1]])==="undefined"||OY_DATA_PUSH[oy_data_payload[1]]===false||typeof(OY_PUSH_HOLD[oy_data_payload[1]])==="undefined") return true;
        oy_data_payload[3] = LZString.compressToUTF16(OY_PUSH_HOLD[oy_data_payload[1]].slice(oy_push_define[0], oy_push_define[1]));
    }
    let oy_peer_select = false;
    if (oy_data_logic==="OY_LOGIC_ALL") {//TODO remove
        //oy_data_payload[0] is oy_passport_passive
        //oy_data_payload[1] is oy_route_dynamic
        oy_data_payload[0].push(OY_SELF_SHORT);
        for (let oy_peer_select in OY_PEERS) {
            if (OY_PEERS[oy_peer_select][1]!==0&&oy_data_payload[0].indexOf(oy_short(oy_peer_select))===-1) oy_data_beam(oy_peer_select, oy_data_flag, oy_data_payload);
        }
    }
    else if (oy_data_logic==="OY_LOGIC_SYNC") {
        //oy_data_payload[0] is oy_passport_passive
        //oy_data_payload[1] is oy_passport_crypt
        if (OY_BLOCK_HASH===null) return false;

        oy_data_payload[0].push(OY_SELF_PUBLIC);
        for (let oy_peer_select in OY_PEERS) {
            if (OY_PEERS[oy_peer_select][1]===2&&oy_data_payload[0].indexOf(oy_peer_select)===-1) oy_data_beam(oy_peer_select, oy_data_flag, oy_data_payload);
        }
    }
    else if (oy_data_logic==="OY_LOGIC_ABSORB") {
        if (oy_state_current()!==2||typeof(OY_BLOCK[1][OY_SELF_PUBLIC])==="undefined") return false;

        for (let oy_peer_select in OY_PEERS) {
            if (OY_PEERS[oy_peer_select][1]===2&&typeof(OY_BLOCK[1][oy_peer_select])!=="undefined") oy_data_beam(oy_peer_select, oy_data_flag, oy_data_payload);
        }
    }
    else if (oy_data_logic==="OY_LOGIC_FOLLOW") {
        //oy_data_payload[0] is oy_passport_passive
        //oy_data_payload[0] is oy_passport_active
        if (oy_data_payload[1].length===0) return false;

        let oy_peer_final = false;
        let oy_active_build = [];
        for (let i in oy_data_payload[1]) {
            oy_active_build.push(oy_data_payload[1][i]);
            if (typeof(OY_PEERS[oy_peer_final])!=="undefined") {
                oy_peer_final = oy_data_payload[1][i];
                break;
            }
        }

        if (oy_peer_final===false) return false;

        oy_data_payload[1] = oy_active_build.slice();
        oy_data_payload[0].push(OY_SELF_PUBLIC);
        oy_data_beam(oy_peer_final, oy_data_flag, oy_data_payload);
    }
    else if (oy_data_logic==="OY_LOGIC_UPSTREAM") {//TODO soak needs to check that passive_passport is not empty
        //oy_data_payload[0] is oy_passport_passive
        if (OY_LIGHT_STATE===false&&typeof(OY_BLOCK[1][OY_SELF_PUBLIC])!=="undefined") return false;

        oy_data_payload[0].push(OY_SELF_PUBLIC);
        if (oy_data_payload[0].length===1) {
            for (let oy_peer_select in OY_PEERS) {
                if (OY_PEERS[oy_peer_select][1]!==0) oy_data_beam(oy_peer_select, oy_data_flag, oy_data_payload);
            }
        }
        else {
            let oy_peer_upstream = [null, -1];
            for (let oy_peer_select in OY_PEERS) {
                if (OY_PEERS[oy_peer_select][9]>oy_peer_upstream[1]&&OY_PEERS[oy_peer_select][1]!==0) oy_peer_upstream[0] = oy_peer_select;
            }
            if (oy_peer_upstream[0]===null) return false;
            oy_data_beam(oy_peer_upstream[0], oy_data_flag, oy_data_payload);
        }
    }
    else return false;

    return true;
}

function oy_data_direct(oy_data_flag) {
    return !(oy_data_flag.indexOf("OY_PEER")===-1&&oy_data_flag.indexOf("OY_LATENCY")===-1&&oy_data_flag.indexOf("OY_JUMP")===-1);
}

//send data
function oy_data_beam(oy_node_id, oy_data_flag, oy_data_payload) {
    if (typeof(OY_NODES[oy_node_id])==="undefined") return false;

    let oy_data_raw = JSON.stringify([oy_data_flag, oy_data_payload]);//convert data array to JSON
    let oy_data_direct_bool = oy_data_direct(oy_data_flag);
    if (oy_data_direct_bool===false&&oy_data_payload[0].length>OY_MESH_HOP_MAX) {
        oy_log("ERROR["+oy_data_flag+"][OY_ERROR_HOP_MAX_BREACH]", true);
        return false;
    }
    oy_data_payload = null;
    if (oy_data_raw.length>OY_DATA_MAX) {
        oy_log("ERROR["+oy_data_flag+"][OY_ERROR_DATA_MAX_BREACH]", true);
        return false;
    }
    if (oy_data_flag!=="OY_BLOCK_SYNC"&&oy_data_direct_bool===false&&typeof(OY_PEERS[oy_node_id])!=="undefined"&&!oy_data_measure(true, oy_node_id, oy_data_raw.length)) {
        oy_log("COOL["+oy_short(oy_node_id)+"]["+oy_data_flag+"]");
        return true;
    }
    OY_NODES[oy_node_id].send(oy_data_raw);//send the JSON-converted data array to the destination node
    if (oy_data_flag!=="OY_BLOCK_SYNC") oy_log("BEAM["+oy_short(oy_node_id)+"]["+oy_data_flag+"]");
    return true;
}

//incoming data validation
function oy_data_soak(oy_node_id, oy_data_raw) {
   try {
       if (oy_data_raw.length>OY_DATA_MAX) {
           oy_node_deny(oy_node_id, "OY_DENY_DATA_LARGE");
           return false;
       }
       let oy_data = JSON.parse(oy_data_raw);
       if (oy_data&&typeof(oy_data)==="object") {
           let oy_peer_flag = false;
           if (typeof(OY_PEERS[oy_node_id])!=="undefined") {
               oy_peer_flag = true;
               if (false&&oy_data[0]!=="OY_BLOCK_SYNC"&&!oy_data_measure(false, oy_node_id, oy_data_raw.length)) {
                   oy_node_deny(oy_node_id, "OY_DENY_MESH_FLOW");
                   return false;
               }
           }
           oy_data_raw = null;
           if (oy_data[0]!=="OY_BLOCK_SYNC") oy_log("SOAK["+oy_short(oy_node_id)+"]["+oy_data[0]+"]");
           if (!oy_data_direct(oy_data[0])) {
               if (typeof(oy_data[1][0])!=="object") {
                   oy_node_deny(oy_node_id, "OY_DENY_PASSPORT_INVALID");
                   return false;
               }

               if (oy_data[1][0].length>OY_MESH_HOP_MAX) {
                   oy_node_deny(oy_node_id, "OY_DENY_PASSPORT_HOP");
                   return false;
               }

               if (oy_data[0]==="OY_BLOCK_SYNC") {
                   if (oy_peer_flag===false) {
                       oy_node_deny(oy_node_id, "OY_DENY_SYNC_PEER");
                       return false;
                   }
                   else if (oy_state_current(true)!==2) {
                       oy_node_deny(oy_node_id, "OY_DENY_SYNC_MISALIGN");
                       return false;
                   }
                   else if (oy_state_current()!==2) return true;

                   let oy_peer_last = oy_data[1][0][oy_data[1][0].length-1];
                   if (oy_peer_last!==oy_node_id) {
                       oy_node_deny(oy_peer_last, "OY_DENY_PASSPORT_MISMATCH_A");
                       return false;
                   }
                   if (oy_data[1][0].indexOf(OY_SELF_PUBLIC)!==-1) {
                       oy_node_deny(oy_node_id, "OY_DENY_PASSPORT_ALREADY_A");
                       return false;
                   }
               }
               else {
                   let oy_peer_last = oy_data[1][0][oy_data[1][0].length-1];
                   if (oy_peer_last!==oy_short(oy_node_id)) {
                       oy_node_deny(oy_peer_last, "OY_DENY_PASSPORT_MISMATCH_B");
                       return false;
                   }
                   if (oy_data[1][0].indexOf(OY_SELF_SHORT)!==-1) {
                       oy_node_deny(oy_node_id, "OY_DENY_PASSPORT_ALREADY_B");
                       return false;
                   }
                   if (oy_data[1][0].length>1&&!!oy_peer_find(oy_data[1][0][0])) return true;//TODO check if necessary
               }

               if (OY_LOGIC_ALL_TYPE.indexOf(oy_data[0])!==-1) {
                   if (oy_peer_flag===false) return false;

                   if (OY_ROUTE_DYNAMIC.indexOf(oy_data[1][1])!==-1) return true;
                   OY_ROUTE_DYNAMIC.push(oy_data[1][1]);
                   while (OY_ROUTE_DYNAMIC.length>OY_ROUTE_DYNAMIC_KEEP) OY_ROUTE_DYNAMIC.shift();
               }
           }
           if (oy_data[0]==="OY_LATENCY_RESPONSE") oy_latency_response(oy_node_id, oy_data[1]);
           else if (typeof(OY_PEERS[oy_node_id])!=="undefined") oy_peer_process(oy_node_id, oy_data[0], oy_data[1]);
           else oy_node_negotiate(oy_node_id, oy_data[0], oy_data[1]);
           return true;
       }
   }
   catch {}
   oy_node_deny(oy_node_id, "OY_DENY_DATA_ERROR");
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

function oy_intro_beam(oy_intro_select, oy_data_flag, oy_data_payload, oy_callback) {
    let ws = new WebSocket("wss://"+oy_intro_select);
    let oy_response = false;
    ws.onopen = function() {
        ws.send(JSON.stringify([oy_data_flag, oy_data_payload]));
    };
    ws.onmessage = function (oy_event) {
        oy_response = true;
        ws.close();
        console.log("INTRO_SOAK: "+oy_event.data);
        if (typeof(oy_callback)==="function") {
            try {
                let [oy_data_flag, oy_data_payload] = JSON.parse(oy_event.data);
                if (oy_data_flag==="OY_INTRO_UNREADY") oy_intro_punish(oy_intro_select);
                else oy_callback(oy_data_flag, oy_data_payload);
            }
            catch {}
        }
    };
    oy_chrono(function() {
        if (oy_response===false) {
            ws.close();
            oy_intro_punish(oy_intro_select);
        }
    }, OY_INTRO_TRIP[1]);
}

function oy_intro_punish(oy_intro_select) {
    if (typeof(OY_INTRO_PUNISH[oy_intro_select])==="undefined") OY_INTRO_PUNISH[oy_intro_select] = 1;
    else OY_INTRO_PUNISH[oy_intro_select]++;
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

    let oy_command_array = ["OY_AKOYA_SEND", [-1, -1, oy_transact_fee], oy_key_public, Math.floor(oy_transfer_amount*OY_AKOYA_DECIMALS), oy_receive_public];
    if (!OY_BLOCK_COMMANDS[oy_command_array[0]][0](oy_command_array, false)) return false;

    return oy_block_command(oy_key_private, oy_command_array, oy_callback_confirm);
}

function oy_dns_transfer(oy_key_private, oy_key_public, oy_transact_fee, oy_dns_name, oy_receive_public, oy_callback_confirm) {
    if (OY_BLOCK_HASH===null||oy_key_private===null||oy_key_public===null) return false;

    let oy_command_array = ["OY_DNS_TRANSFER", [-1, -1, oy_transact_fee], oy_key_public, oy_dns_name, oy_receive_public];
    if (!OY_BLOCK_COMMANDS[oy_command_array[0]][0](oy_command_array, false)) return false;

    return oy_block_command(oy_key_private, oy_command_array, oy_callback_confirm);
}

function oy_hivemind_cluster(oy_key_private, oy_key_public, oy_transact_fee, oy_entropy_id, oy_author_revoke, oy_submission_price, oy_vote_limit, oy_expire_quota, oy_capacity_active, oy_capacity_inactive, oy_post_holder, oy_callback_confirm) {
    if (OY_BLOCK_HASH===null||oy_key_private===null||oy_key_public===null) return false;

    let oy_command_array = ["OY_META_SET", [-1, -1, oy_transact_fee], oy_key_public, oy_entropy_id, 1, [[0, oy_author_revoke, Math.floor(oy_submission_price*OY_AKOYA_DECIMALS), oy_vote_limit, oy_expire_quota, oy_capacity_active, oy_capacity_inactive], oy_post_holder]];
    if (!OY_BLOCK_COMMANDS[oy_command_array[0]][0](oy_command_array, false)||!OY_BLOCK_TRANSACTS["OY_HIVEMIND_CLUSTER"][0](oy_command_array, false)) return false;

    return oy_block_command(oy_key_private, oy_command_array, oy_callback_confirm);
}

function oy_hivemind_post(oy_key_private, oy_key_public, oy_transact_fee, oy_cluster_id, oy_submission_payment, oy_post_title, oy_post_handle, oy_callback_confirm) {
    if (OY_BLOCK_HASH===null||oy_key_private===null||oy_key_public===null) return false;

    let oy_command_array = ["OY_META_SET", [-1, -1, oy_transact_fee], oy_key_public, "", 1, [[1, oy_cluster_id, -1, Math.floor(oy_submission_payment*OY_AKOYA_DECIMALS)], [LZString.compressToBase64(oy_post_title), oy_post_handle]]];
    if (!OY_BLOCK_COMMANDS[oy_command_array[0]][0](oy_command_array, false)||!OY_BLOCK_TRANSACTS["OY_HIVEMIND_POST"][0](oy_command_array, false)) return false;

    return oy_block_command(oy_key_private, oy_command_array, oy_callback_confirm);
}

function oy_block_absorb(oy_command_array, oy_command_crypt) {
    if (oy_state_current()!==2||typeof(OY_BLOCK[1][OY_SELF_PUBLIC])==="undefined") return false;

    let oy_command_hash = oy_hash_gen(JSON.stringify(oy_command_array));
    if (typeof(OY_BLOCK_COMMAND[oy_command_hash])!=="undefined") return true;
    if (oy_block_command_verify(oy_command_array, oy_command_crypt, oy_command_hash, false)) {
        let oy_command_size = JSON.stringify([oy_command_hash, oy_command_array, oy_command_crypt]).length;
        if (oy_command_size>OY_BLOCK_COMMAND_QUOTA) return false;
        OY_BLOCK_COMMAND[oy_command_hash] = [oy_command_array, oy_command_crypt, oy_command_array[1][2]/oy_command_size];
        if (JSON.stringify(OY_BLOCK_COMMAND).length>OY_BLOCK_COMMAND_QUOTA) {
            let oy_command_sort = [];
            for (let oy_command_hash in OY_BLOCK_COMMAND) {
                if (OY_BLOCK_COMMAND[oy_command_hash][0][1][2]!==0||typeof(OY_BLOCK_COMMAND_SELF[oy_command_hash])==="undefined") oy_command_sort.push(oy_command_hash, OY_BLOCK_COMMAND[oy_command_hash][2]);
            }
            oy_command_sort.sort(function(a, b) {
                if (a[0][1][1]===b[0][1][1]) return 0.5 - Math.random();
                return b[1] - a[1];
            });
            let oy_pass_first = true;
            while (oy_pass_first===true||JSON.stringify(OY_BLOCK_COMMAND).length>OY_BLOCK_COMMAND_QUOTA) {
                oy_pass_first = false;
                if (oy_command_sort.length===0) {
                    delete OY_BLOCK_COMMAND[oy_command_hash];
                    return false;
                }
                else {
                    let oy_hash_select = oy_command_sort.pop()[0];
                    oy_data_route("OY_LOGIC_ABSORB", "OY_BLOCK_ABSORB", [OY_BLOCK_COMMAND[oy_hash_select][0], OY_BLOCK_COMMAND[oy_hash_select][1], oy_key_sign(OY_SELF_PRIVATE, oy_short(OY_BLOCK_COMMAND[oy_hash_select][1]))]);
                    if (typeof(OY_BLOCK_COMMAND_SELF[oy_command_hash])==="undefined") delete OY_BLOCK_COMMAND[oy_hash_select];
                }
            }
        }
        //if (typeof(OY_BLOCK_MAP)==="function") OY_BLOCK_MAP(2);
    }
}

function oy_block_command(oy_key_private, oy_command_array, oy_callback_confirm) {
    if (OY_BLOCK_HASH===null) return false;

    let oy_time_offset = (Date.now()/1000)-OY_BLOCK_TIME;
    if (oy_time_offset>(OY_BLOCK_SECTORS[0][0]-OY_BLOCK_BUFFER_CLEAR[0])) oy_command_array[1][0] = OY_BLOCK_NEXT;//TODO verify timing
    else oy_command_array[1][0] = OY_BLOCK_TIME;
    oy_command_array[1][1] = parseInt(OY_BLOCK_COMMAND_NONCE);//TODO no referencing to prevent race condition
    let oy_command_flat = JSON.stringify(oy_command_array);
    let oy_command_hash = oy_hash_gen(oy_command_flat);
    let oy_command_crypt = oy_key_sign(oy_key_private, oy_command_hash);

    if (!oy_block_command_verify(oy_command_array, oy_command_crypt, oy_command_hash, false)) return false;

    OY_BLOCK_COMMAND_NONCE++;
    if (typeof(oy_callback_confirm)!=="undefined") OY_BLOCK_CONFIRM[oy_command_hash] = oy_callback_confirm;

    if (OY_LIGHT_STATE===false&&typeof(OY_BLOCK[1][OY_SELF_PUBLIC])!=="undefined"&&oy_peer_full()) {
        OY_BLOCK_COMMAND_SELF[oy_command_hash] = true;
        oy_block_absorb(oy_command_array, oy_command_crypt);
    }
    else oy_data_route("OY_LOGIC_UPSTREAM", "OY_BLOCK_COMMAND", [[], oy_command_array, oy_command_crypt]);
    return true;
}

function oy_block_command_hash(oy_command_array) {//DUPLICATED IN WEB WORKER BLOCK
    let oy_command_pool = {};
    for (let i in oy_command_array) {
        if (oy_command_array[i].length!==2) return false;

        let oy_command_hash = oy_hash_gen(JSON.stringify(oy_command_array[i][0]));
        if (typeof(oy_command_pool[oy_command_hash])!=="undefined") return false;
        oy_command_pool[oy_command_hash] = true;
        oy_command_array[i][2] = oy_command_hash;
    }
    return oy_command_array;
}

function oy_block_command_verify(oy_command_array, oy_command_crypt, oy_command_hash, oy_jump_flag) {
    if (typeof(oy_command_array[0])!=="undefined"&&//check that a command was given
        typeof(OY_BLOCK_COMMANDS[oy_command_array[0]])!=="undefined"&&//check that the signed command is a recognizable command
        (oy_command_array[1][0]===((oy_jump_flag===false)?OY_BLOCK_TIME:OY_BLOCK_TIME_JUMP)||oy_command_array[1][0]===((oy_jump_flag===false)?OY_BLOCK_NEXT:OY_BLOCK_NEXT_JUMP))&&
        Number.isInteger(oy_command_array[1][1])&&//check that the assigned transact nonce is a valid integer
        Number.isInteger(oy_command_array[1][2])&&//check that the assigned fee is a valid integer
        oy_command_array[1][2]>=0&&//check that the assigned fee is a positive number
        oy_command_array[1][2]<OY_AKOYA_LIQUID&&//prevent integer overflow for the assigned fee
        oy_key_verify(oy_command_array[2], oy_command_crypt, oy_command_hash)) return OY_BLOCK_COMMANDS[oy_command_array[0]][0](oy_command_array, oy_jump_flag);

    return false;
}

function oy_block_command_scan(oy_command_verify, oy_jump_flag, oy_command_pointer) {
    if (typeof(oy_command_pointer)==="undefined") oy_command_pointer = 0;
    if (typeof(oy_command_verify[oy_command_pointer])==="undefined") return true;
    if (oy_block_command_verify(oy_command_verify[oy_command_pointer][0], oy_command_verify[oy_command_pointer][1], oy_command_verify[oy_command_pointer][2], oy_jump_flag)) return oy_block_command_scan(oy_command_verify, oy_jump_flag, oy_command_pointer+1);
    else return false;
}

function oy_block_jump_reset() {
    OY_JUMP_ASSIGN = [null, null];
    OY_JUMP_BUILD = [];
    OY_BLOCK_JUMP = null;
    OY_BLOCK_FLAT_JUMP = null;
    OY_BLOCK_HASH_JUMP = null;
    OY_BLOCK_TIME_JUMP = null;
    OY_BLOCK_NEXT_JUMP = null;
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

function oy_block_dive_sort(oy_dive_ledger) {
    let oy_dive_sort = [];
    for (let oy_key_public in oy_dive_ledger) {
        oy_dive_sort.push([oy_key_public, oy_dive_ledger[oy_key_public]]);
    }
    oy_dive_ledger = {};
    oy_dive_sort.sort(function(a, b) {
        if (a[1][0]===b[1][0]) {
            if (a[1][1]===b[1][1]) {
                let x = a[0].toLowerCase();
                let y = b[0].toLowerCase();

                return x < y ? -1 : x > y ? 1 : 0;
            }
            return b[1][1] - a[1][1];
        }
        return b[1][0] - a[1][0];
    });
    for (let i in oy_dive_sort) {
        oy_dive_ledger[oy_dive_sort[i][0]] = oy_dive_sort[i][1];
    }
    return oy_dive_ledger;
}

function oy_block_time() {
    return Math.floor(Date.now()/10000)*10;
}

function oy_block_time_first(oy_time) {
    if (typeof(oy_time)==="undefined") oy_time = oy_block_time();
    if ((oy_time/10)%6===0) return oy_time;
    return oy_block_time_first(oy_time-10);
}

function oy_block_boot_calc(oy_time) {
    if (Math.floor(oy_time/10)%6===0) return oy_time;
    return oy_block_boot_calc(oy_time+10);
}

function oy_block_reset(oy_reset_flag) {
    let oy_time_local = Date.now()/1000;

    if (OY_BLOCK_HALT!==null&&oy_time_local-OY_BLOCK_HALT<OY_BLOCK_HALT_BUFFER) return false;//prevents duplicate calls of block_reset()

    if (typeof(oy_reset_flag)==="undefined") oy_reset_flag = "OY_RESET_UNKNOWN";
    else if (oy_reset_flag.toString()==="[object Event]"&&typeof(oy_reset_flag.type)==="string") oy_reset_flag = "OY_RESET_"+(oy_reset_flag.type.toUpperCase().substr(3));

    OY_BLOCK_HALT = oy_time_local;
    OY_BLOCK_HASH = null;
    OY_BLOCK_FLAT = null;
    OY_BLOCK_COMPRESS = null;
    OY_BLOCK_DIFF = false;
    OY_BLOCK_SIGN = null;
    OY_BLOCK_UPTIME = null;
    OY_BLOCK_WEIGHT = null;
    OY_BLOCK_STABILITY = 0;
    OY_BLOCK_STABILITY_KEEP = [OY_BLOCK_RANGE_MIN];
    OY_BLOCK_COMMAND_NONCE = 0;
    OY_BLOCK_COMMAND = {};
    OY_BLOCK_SYNC = {};
    OY_BLOCK_RECORD = null;
    OY_BLOCK_RECORD_KEEP = [];
    OY_BLOCK_FINISH = false;
    OY_PEER_OFFER = [null, null];
    OY_INTRO_MARKER = null;
    OY_INTRO_PICKUP_COUNT = null;
    OY_INTRO_ALLOCATE = {};
    OY_INTRO_BAN = {};
    OY_BLOCK_CHALLENGE = {};
    OY_BLOCK_JUDGE = [null];
    OY_BLOCK_LEARN = [null];
    OY_BLOCK = oy_clone_object(OY_BLOCK_TEMPLATE);
    OY_DIFF_TRACK = [{}, []];
    OY_BASE_BUILD = [];
    OY_LIGHT_BUILD = {};
    OY_LIGHT_STATE = true;
    OY_LIGHT_PROCESS = false;
    OY_DIVE_STATE = false;
    OY_SYNC_TALLY = {};
    OY_SYNC_LAST = [0, 0];
    OY_SYNC_MAP = [{}, {}];
    OY_OFFER_COUNTER = 0;
    OY_OFFER_COLLECT = {};
    OY_OFFER_PICKUP = [];
    OY_REPORT_HASH = null;

    oy_worker_halt(0);
    oy_worker_halt(1);

    for (let oy_peer_select in OY_PEERS) {
        oy_node_deny(oy_peer_select, "OY_DENY_SELF_"+oy_reset_flag.substr(3));
    }

    oy_log("BLOCK[RESET]["+oy_reset_flag+"]", true);

    oy_log_debug("MESHBLOCK RESET["+OY_SELF_PUBLIC+"]["+oy_reset_flag+"]");//TODO temp
    console.log("MESHBLOCK RESET ["+oy_reset_flag+"]");//TODO temp

    oy_event_dispatch("oy_block_reset");
    oy_event_dispatch("oy_state_blank");

    oy_node_assign();
}

function oy_block_engine() {
    let oy_block_time_local = oy_block_time();
    oy_chrono(oy_block_engine, (OY_LIGHT_MODE===false)?OY_BLOCK_LOOP[0]:OY_BLOCK_LOOP[1]);
    if (oy_block_time_local!==OY_BLOCK_TIME&&(oy_block_time_local/10)%6===0) {
        OY_BLOCK_TIME = oy_block_time_local;
        OY_BLOCK_NEXT = OY_BLOCK_TIME+OY_BLOCK_SECTORS[5][0];
        if (OY_BLOCK_TIME<OY_BLOCK_BOOTTIME) OY_BLOCK_BOOT = null;
        else OY_BLOCK_BOOT = OY_BLOCK_TIME-OY_BLOCK_BOOTTIME<OY_BLOCK_BOOT_BUFFER;

        oy_worker_halt(0);

        OY_BLOCK_COMMAND_NONCE = 0;
        OY_BLOCK_SYNC = {};
        OY_BLOCK_SYNC_PASS[OY_BLOCK_TIME] = {};
        OY_BLOCK_WORK_GRADE = {};
        OY_BLOCK_RECORD = null;
        OY_BLOCK_FINISH = false;
        OY_SYNC_TALLY = {};
        OY_OFFER_COUNTER = 0;
        OY_OFFER_COLLECT = {};
        OY_OFFER_PICKUP = [];
        OY_PEER_OFFER = [null, null];
        OY_LIGHT_PROCESS = false;
        OY_BASE_BUILD = [];
        OY_JUMP_PRE = {};
        oy_block_jump_reset();
        let oy_block_continue = true;

        if (OY_INTRO_SELECT!==null&&Object.values(OY_INTRO_TAG).indexOf(true)===-1) oy_intro_punish(OY_INTRO_SELECT);
        OY_INTRO_SELECT = null;
        OY_INTRO_SOLUTIONS = {};
        OY_INTRO_PICKUP_COUNT = null;
        OY_INTRO_ALLOCATE = {};
        OY_INTRO_TAG = {};
        OY_INTRO_BAN = {};

        if (OY_FULL_INTRO!==false&&OY_FULL_INTRO.indexOf(":")!==-1&&OY_NODE_STATE===true&&OY_BLOCK_RECORD_KEEP.length>1) OY_INTRO_MARKER = ((OY_SYNC_LAST[0]>0)?Math.max(OY_BLOCK_SECTORS[0][1], Math.min(OY_BLOCK_SECTORS[1][1], OY_SYNC_LAST[0]+OY_BLOCK_BUFFER_SPACE[1])):OY_BLOCK_SECTORS[1][1])+(Math.max(...OY_BLOCK_RECORD_KEEP)*1000*OY_BLOCK_RECORD_INTRO_BUFFER);
        else OY_INTRO_MARKER = null;

        if (OY_BLOCK_BOOT===true) {
            if (OY_LIGHT_MODE===true) return false;//if self elects to be a light node they cannot participate in the initial boot-up sequence of the mesh
            OY_LIGHT_STATE = false;//since node has elected to being a full node, set light state flag to false
        }

        for (let oy_node_select in OY_COLD) {
            delete OY_NODES[oy_node_select];
            delete OY_COLD[oy_node_select];
        }
        for (let oy_node_select in OY_NODES) {
            if (typeof(OY_PEERS[oy_node_select])==="undefined") oy_node_disconnect(oy_node_select);
        }
        OY_PROPOSED = {};
        OY_PEERS_PRE = {};
        OY_LATENCY = {};

        let oy_peer_map = {};
        for (let oy_peer_select in OY_PEERS) {
            OY_PEERS[oy_peer_select][11] = [null, null, null, null, null, null];
            oy_peer_map[oy_hash_gen(oy_peer_select)] = true;
        }

        oy_event_dispatch("oy_block_init");

        oy_chrono(function() {
            if (OY_BLOCK_HASH===null) return false;

            if (Object.keys(OY_NODES).length<OY_NODE_MAX) {
                let oy_offer_rand = oy_rand_gen(OY_MESH_SEQUENCE);//TODO track offer_rand
                OY_PEER_OFFER = [oy_offer_rand, oy_node_boot(true)];
                OY_PEER_OFFER[1].on("signal", function(oy_signal_data) {
                    let oy_signal_crypt = oy_signal_beam(oy_signal_data);
                    oy_data_route("OY_LOGIC_UPSTREAM", "OY_PEER_OFFER_A", [[], [], oy_key_sign(OY_SELF_PRIVATE, OY_BLOCK_HASH+oy_offer_rand+oy_signal_crypt), oy_offer_rand, oy_signal_crypt]);
                });
            }

            for (let oy_peer_select in OY_PEERS) {
                if (OY_PEERS[oy_peer_select][1]===0||OY_PEERS[oy_peer_select][0]>=OY_BLOCK_TIME-OY_BLOCK_SECTORS[5][0]||Object.keys(OY_NODES).length>=OY_NODE_MAX) continue;
                OY_PEERS[oy_peer_select][10] = oy_node_boot(true);
                OY_PEERS[oy_peer_select][10].on("signal", function(oy_signal_data) {
                    OY_PEERS[oy_peer_select][11][0] = true;
                    oy_data_beam(oy_peer_select, "OY_PEER_EXCHANGE_A", [oy_peer_map, oy_signal_beam(oy_signal_data)]);
                });
            }
        }, OY_MESH_BUFFER[1]);

        for (let oy_report_count = 10000; oy_report_count<=OY_BLOCK_SECTORS[5][1]; oy_report_count += 10000) {
            oy_chrono(oy_peer_report, oy_report_count);
        }

        //BLOCK SEED--------------------------------------------------
        if (OY_LIGHT_MODE===false&&OY_BLOCK_TIME===OY_BLOCK_BOOTTIME) {
            OY_BLOCK = oy_clone_object(OY_BLOCK_TEMPLATE);
            OY_BLOCK[0][0] = OY_MESH_DYNASTY;//dynasty
            OY_BLOCK[0][1] = OY_BLOCK_TIME-OY_BLOCK_SECTORS[5][0];
            OY_BLOCK[0][2] = OY_BLOCK_RANGE_MIN;//mesh range
            OY_BLOCK[0][3] = OY_WORK_MIN;//work difficulty
            OY_BLOCK[0][4] = OY_BLOCK_BOOTTIME;//genesis timestamp
            OY_BLOCK[0][5] = 0;//epoch macro counter
            OY_BLOCK[0][6] = 0;//epoch counter
            OY_BLOCK[0][7] = OY_WORK_TARGET*OY_BLOCK_RANGE_MIN;//oy_grade_total
            OY_BLOCK[0][8] = OY_WORK_TARGET;//oy_grade_current
            OY_BLOCK[0][9] = OY_WORK_TARGET;//oy_grade_avg
            OY_BLOCK[0][10].push(OY_WORK_TARGET);//oy_grade_keep
            OY_BLOCK[0][11] = OY_BLOCK_RANGE_MIN;//range rolling avg, micro cadence
            OY_BLOCK[0][12].push(OY_BLOCK_RANGE_MIN);//range rolling keep, micro cadence
            OY_BLOCK[0][13] = OY_WORK_MIN;//work difficulty rolling avg, macro cadence
            OY_BLOCK[0][14].push(OY_WORK_MIN);//work difficulty rolling keep, macro cadence
            OY_BLOCK[0][15] = 1;//uptime current avg
            OY_BLOCK[4]["oy_escrow_dns"] = 0;

            //SEED DEFINITION------------------------------------
            OY_BLOCK[4][OY_KEY_BRUNO] = 1000000*OY_AKOYA_DECIMALS;
            OY_BLOCK[4]["cJo3PZm9o5fwx0g2QlNKNTD9eOlOygpe9ShKetEfg0Qw"] = 1000000*OY_AKOYA_DECIMALS;
            OY_BLOCK[4]["yvU1vKfFZHygqi5oQl22phfTFTbo5qwQBHZuesCOtdgA"] = 1000000*OY_AKOYA_DECIMALS;
            //SEED DEFINITION------------------------------------

            OY_BLOCK_HASH = oy_hash_gen(JSON.stringify(OY_BLOCK));
            oy_event_dispatch("oy_state_full");
            oy_worker_spawn(1);
        }
        //BLOCK SEED--------------------------------------------------

        if (OY_LIGHT_STATE===false) {
            let oy_array_length = (OY_BLOCK_BOOT===true||OY_BLOCK[0][2]===null)?OY_MESH_HOP_MAX:OY_BLOCK[0][2];
            OY_BLOCK_LEARN = [null];
            for (let i = 0;i<oy_array_length;i++) {
                OY_BLOCK_LEARN.push([]);
            }
            oy_log_debug("HASH: "+OY_BLOCK_HASH+" FULL PASS: "+oy_peer_full()+" WORK SOLUTION: "+JSON.stringify(OY_WORK_SOLUTIONS));
        }
        if (OY_LIGHT_STATE===false&&OY_BLOCK_HASH!==null&&OY_WORK_SOLUTIONS.indexOf(null)!==-1&&oy_peer_full()&&typeof(OY_BLOCK[1][OY_SELF_PUBLIC])!=="undefined") oy_log_debug("WORK NULL: "+OY_SELF_SHORT);
        if (OY_LIGHT_STATE===false&&OY_BLOCK_HASH!==null&&OY_WORK_SOLUTIONS.indexOf(null)!==-1&&(oy_peer_full()||OY_BLOCK_BOOT===true)) {
            //oy_log_debug("COMMAND: "+JSON.stringify(OY_BLOCK_COMMAND));
            let oy_command_sort = [];
            for (let oy_command_hash in OY_BLOCK_COMMAND) {
                if (OY_BLOCK_COMMAND[oy_command_hash][0][1][0]===OY_BLOCK_TIME) {
                    oy_command_sort.push([OY_BLOCK_COMMAND[oy_command_hash][0], OY_BLOCK_COMMAND[oy_command_hash][1], oy_command_hash]);//oy_command_hash is third because it is removed for efficiency
                    delete OY_BLOCK_COMMAND[oy_command_hash];
                    delete OY_BLOCK_COMMAND_SELF[oy_command_hash];
                }
            }

            oy_command_sort.sort(function(a, b) {
                if (a[0][1][0]===b[0][1][0]) {
                    let x = a[2].toLowerCase();
                    let y = b[2].toLowerCase();

                    return x < y ? -1 : x > y ? 1 : 0;
                }
                return a[0][1][0] - b[0][1][0];
            });

            let oy_grade_array = [];
            for (let i in OY_WORK_SOLUTIONS) {
                oy_grade_array.push(oy_calc_grade(OY_WORK_SOLUTIONS[i]));
            }
            OY_BLOCK_WORK_GRADE[OY_SELF_PUBLIC] = Math.floor(oy_calc_avg(oy_grade_array));
            OY_BLOCK_SYNC[OY_SELF_PUBLIC] = [true, oy_command_sort];
            OY_BLOCK_SYNC_PASS[OY_BLOCK_TIME][OY_SELF_PUBLIC] = [[OY_DIVE_PAYOUT, OY_DIVE_TEAM, OY_FULL_INTRO], OY_WORK_SOLUTIONS, 0];

            for (let i in oy_command_sort) {
                oy_command_sort[i].pop();
            }

            let oy_command_flat = JSON.stringify(oy_command_sort);
            let oy_identity_flat = JSON.stringify([OY_DIVE_PAYOUT, OY_DIVE_TEAM, OY_FULL_INTRO]);
            let oy_solutions_flat = JSON.stringify(OY_WORK_SOLUTIONS);
            OY_WORK_SOLUTIONS = [null];
            OY_WORK_GRADES = [null];
            OY_WORK_BITS = [null];

            let oy_sync_crypt = oy_key_sign(OY_SELF_PRIVATE, OY_BLOCK_TIME+oy_command_flat+oy_identity_flat+oy_solutions_flat);
            oy_chrono(function() {
                oy_data_route("OY_LOGIC_SYNC", "OY_BLOCK_SYNC", [[], [oy_key_sign(OY_SELF_PRIVATE, oy_sync_crypt)], oy_sync_crypt, OY_BLOCK_TIME, oy_command_flat, oy_identity_flat, oy_solutions_flat]);
            }, OY_MESH_BUFFER[1]);//TODO clock skew for peer_request
        }

        for (let oy_command_hash in OY_BLOCK_COMMAND) {
            if (OY_BLOCK_COMMAND[oy_command_hash][0][1][0]!==OY_BLOCK_NEXT) {
                delete OY_BLOCK_COMMAND[oy_command_hash];
                delete OY_BLOCK_COMMAND_SELF[oy_command_hash];
            }
        }

        oy_chrono(function() {
            OY_BLOCK_DIFF = false;console.log("CONNS: "+Object.keys(OY_NODES).length);

            let oy_time_local = Date.now()/1000;
            if (OY_BLOCK_HASH===null) {
                OY_BLOCK_CHALLENGE = {};
                oy_log("MESHBLOCK SKIP: "+OY_BLOCK_TIME, true);
                oy_block_continue = false;
                return false;
            }
            if (OY_BLOCK[0][1]!==null&&OY_BLOCK[0][1]!==OY_BLOCK_TIME-OY_BLOCK_SECTORS[5][0]) {
                oy_block_reset("OY_RESET_MISSTEP");
                oy_block_continue = false;
                return false;
            }
            if (OY_BLOCK[0][4]!==OY_BLOCK_BOOTTIME) {
                oy_block_reset("OY_RESET_BOOT_INVALID");
                oy_block_continue = false;
                return false;
            }
            if (Object.keys(OY_PEERS).length===0&&OY_BLOCK_BOOT===false) {
                oy_block_reset("OY_RESET_DROP_PEER");
                oy_block_continue = false;
                return false;
            }

            if (OY_BLOCK_UPTIME===null&&Object.keys(OY_PEERS).length>0) OY_BLOCK_UPTIME = oy_time_local;

            if (OY_BLOCK_HASH===null||Object.keys(OY_PEERS).length<=OY_PEER_MAX/2) {
                let oy_intro_keep = oy_clone_object(OY_INTRO_DEFAULT);
                if (OY_BLOCK_HASH!==null) {
                    for (let oy_key_public in OY_BLOCK[1]) {
                        if (OY_BLOCK[1][oy_key_public][6]!==0&&OY_BLOCK[1][oy_key_public][1]===1&&OY_BLOCK[1][oy_key_public][2]>=OY_BLOCK[0][15]&&typeof(oy_intro_keep[OY_BLOCK[1][oy_key_public][6]])==="undefined") oy_intro_keep[OY_BLOCK[1][oy_key_public][6]] = true;
                    }
                }
                for (let oy_full_intro in oy_intro_keep) {
                    if (typeof(OY_INTRO_PUNISH[oy_full_intro])!=="undefined") delete oy_intro_keep[oy_full_intro];
                }
                let oy_intro_array = Object.keys(oy_intro_keep);
                if (oy_intro_array.length===0) {
                    let oy_punish_low = -1;
                    for (let oy_full_intro in OY_INTRO_PUNISH) {
                        if (OY_INTRO_PUNISH[oy_full_intro]<oy_punish_low||oy_punish_low===-1) oy_punish_low = OY_INTRO_PUNISH[oy_full_intro];
                    }
                    let oy_punish_diff = oy_punish_low-1;
                    if (oy_punish_diff>0) {
                        oy_punish_low -= oy_punish_diff;
                        for (let oy_full_intro in OY_INTRO_PUNISH) {
                            OY_INTRO_PUNISH[oy_full_intro] -= oy_punish_diff;
                        }
                    }
                    for (let oy_full_intro in OY_INTRO_PUNISH) {
                        if (OY_INTRO_PUNISH[oy_full_intro]===oy_punish_low) oy_intro_array.push(oy_full_intro);
                    }
                }
                let oy_intro_select = oy_intro_array[Math.floor(Math.random()*oy_intro_array)];
                oy_intro_beam(oy_intro_select, "OY_INTRO_PRE", null, function(oy_data_flag, oy_data_payload) {
                    if (oy_data_flag!=="OY_INTRO_TIME"||!Number.isInteger(oy_data_payload)||oy_data_payload<OY_BLOCK_SECTORS[0][1]||oy_data_payload>OY_BLOCK_SECTORS[1][1]) {
                        oy_intro_punish(oy_intro_select);
                        return false;
                    }
                    let oy_time_offset = ((Date.now()/1000)-OY_BLOCK_TIME)*1000;
                    if (oy_data_payload<=oy_time_offset) return false;
                    oy_chrono(function() {
                        oy_intro_beam(oy_intro_select, "OY_INTRO_GET", true, function(oy_data_flag, oy_data_payload) {
                            if (oy_data_flag!=="OY_INTRO_WORK"||typeof(oy_data_payload)!=="object"||oy_data_payload.length>OY_WORK_MAX/OY_WORK_INTRO) {
                                oy_intro_punish(oy_intro_select);
                                return false;
                            }
                            oy_worker_spawn(0);
                            OY_INTRO_SELECT = oy_intro_select;
                            OY_INTRO_SOLUTIONS = {};
                            for (let i in oy_data_payload) {
                                OY_INTRO_SOLUTIONS[oy_data_payload[i][0]] = null;
                            }
                            for (let i in oy_data_payload) {
                                for (let oy_counter = 0;oy_counter<OY_WORKER_THREADS[0].length/oy_data_payload.length;oy_counter++) {
                                    OY_WORKER_THREADS[0][oy_worker_point(0)].postMessage([0, [false, oy_data_payload[i][0], oy_data_payload[i][1]]]);
                                }
                            }
                        });
                    }, oy_data_payload-oy_time_offset);
                });
            }
        }, OY_BLOCK_SECTORS[0][1]-OY_BLOCK_BUFFER_CLEAR[1]);

        oy_chrono(function() {
            if (oy_block_continue===false||OY_LIGHT_STATE===true||OY_LIGHT_PROCESS===true) return false;

            if (OY_BLOCK_HASH===null) {
                oy_block_reset("OY_RESET_NULL_HASH_A");
                return false;
            }

            OY_BLOCK_RECORD = Date.now()/1000;

            let oy_command_execute = [];
            if (OY_BLOCK_TIME-OY_BLOCK_BOOTTIME>OY_BLOCK_BOOT_BUFFER/2) {
                for (let oy_key_public in OY_BLOCK_SYNC) {
                    if (OY_BLOCK_SYNC[oy_key_public]===false||OY_BLOCK_SYNC[oy_key_public][1]===false) {
                        delete OY_BLOCK_SYNC[oy_key_public];
                        delete OY_BLOCK_SYNC_PASS[OY_BLOCK_TIME][oy_key_public];
                        delete OY_SYNC_MAP[oy_key_public];
                    }
                }

                /*
                if (((OY_BLOCK_TIME-OY_BLOCK_BOOTTIME)/60)%240===0&&Math.floor(Math.random()*2)===0) {//artificial mesh splitter
                    let oy_split_sort = [];
                    for (let oy_key_public in OY_BLOCK_SYNC) {
                        oy_split_sort.push(oy_key_public);
                    }
                    oy_split_sort.sort();
                    delete OY_BLOCK_SYNC[oy_split_sort[0]];
                    delete OY_BLOCK_SYNC_PASS[OY_BLOCK_TIME][oy_split_sort[0]];//TODO remove from command crypt when testing commands
                    oy_log_debug("MESH_SPLIT: "+oy_split_sort[0]);
                }
                */

                OY_BLOCK[0][7] = 0;
                let oy_dive_ledger = {};
                for (let oy_key_public in OY_BLOCK_SYNC) {
                    //[[0]:work_grade, [1]:grade_top, [2]:uptime_count, [3]:transact_fee_payout, [4]:oy_dive_payout, [5]:oy_dive_team, [6]:oy_full_intro, [7]:work_solutions]
                    let [oy_dive_payout, oy_dive_team, oy_full_intro] = OY_BLOCK_SYNC_PASS[OY_BLOCK_TIME][oy_key_public][0];
                    oy_dive_ledger[oy_key_public] = [OY_BLOCK_WORK_GRADE[oy_key_public], 0, (typeof(OY_BLOCK[1][oy_key_public])!=="undefined"&&OY_BLOCK[1][oy_key_public][6]===oy_full_intro)?OY_BLOCK[1][oy_key_public][2]+1:1, 0, (oy_dive_payout===false)?0:oy_dive_payout, (oy_dive_team===false)?0:oy_dive_team, (oy_full_intro===false)?0:oy_full_intro, OY_BLOCK_SYNC_PASS[OY_BLOCK_TIME][oy_key_public][1]];
                    OY_BLOCK[0][7] += oy_dive_ledger[oy_key_public][0];
                }
                OY_BLOCK_WORK_GRADE = {};

                let oy_command_check = {};
                for (let oy_key_public in OY_BLOCK_SYNC) {
                    for (let i in OY_BLOCK_SYNC[oy_key_public][1]) {
                        if (typeof(oy_command_check[OY_BLOCK_SYNC[oy_key_public][1][i][2]])==="undefined"||
                            oy_dive_ledger[oy_key_public][0]>oy_dive_ledger[oy_command_check[OY_BLOCK_SYNC[oy_key_public][1][i][2]][0]][0]||
                            oy_key_public.toLowerCase()<oy_command_check[OY_BLOCK_SYNC[oy_key_public][1][i][2]][0].toLowerCase()) oy_command_check[OY_BLOCK_SYNC[oy_key_public][1][i][2]] = [oy_key_public, OY_BLOCK_SYNC[oy_key_public][1][i]];//[[0]:oy_key_public, [1]:[oy_command_array, oy_command_crypt]
                    }
                }
                OY_BLOCK_SYNC = {};

                let oy_tally_total = 0;
                let oy_tally_track = {};
                for (let oy_node_id in OY_SYNC_TALLY) {
                    if (typeof(oy_tally_track[OY_SYNC_TALLY[oy_node_id]])==="undefined") oy_tally_track[OY_SYNC_TALLY[oy_node_id]] = 0;
                    oy_tally_track[OY_SYNC_TALLY[oy_node_id]]++;
                    oy_tally_total++;
                }
                OY_SYNC_TALLY = {};
                for (let oy_node_id in oy_tally_track) {
                    oy_tally_track[oy_node_id] = oy_tally_track[oy_node_id]/oy_tally_total;
                }
                for (let oy_peer_select in OY_PEERS) {
                    if (typeof(oy_tally_track[oy_peer_select])!=="undefined") OY_PEERS[oy_peer_select][9] = oy_tally_track[oy_peer_select];
                    else OY_PEERS[oy_peer_select][9] = 0;
                }

                for (let oy_command_hash in oy_command_check) {
                    if (typeof(OY_BLOCK[4][oy_command_check[oy_command_hash][1][0][2]])==="undefined"||OY_BLOCK[4][oy_command_check[oy_command_hash][1][0][2]]<oy_command_check[oy_command_hash][1][0][1][2]+OY_AKOYA_FEE) continue;//TODO check if fee buffer needs to be strict or not
                    OY_BLOCK[4][oy_command_check[oy_command_hash][1][0][2]] -= oy_command_check[oy_command_hash][1][0][1][2];
                    oy_dive_ledger[oy_command_check[oy_command_hash][0]][2] += oy_command_check[oy_command_hash][1][0][1][2];
                    OY_BLOCK_SYNC_PASS[OY_BLOCK_TIME][oy_command_check[oy_command_hash][0]][2] += oy_command_check[oy_command_hash][1][0][1][2];
                    oy_command_execute.push([oy_command_check[oy_command_hash][1][0], oy_command_check[oy_command_hash][1][1], oy_command_hash]);//[[0]:oy_command_array, [1]:oy_command_crypt, [2]:oy_command_hash]
                }

                let oy_dive_state_prev = typeof(OY_BLOCK[1][OY_SELF_PUBLIC])!=="undefined";
                OY_BLOCK[1] = oy_block_dive_sort(oy_dive_ledger);
                oy_dive_ledger = null;
                OY_DIVE_STATE = typeof(OY_BLOCK[1][OY_SELF_PUBLIC])!=="undefined";

                oy_command_execute.sort(function(a, b) {
                    if (a[0][2]===b[0][2]) return a[0][1][1] - b[0][1][1];//if signer is same, sort by transact nonce
                    if (a[0][1][2]===b[0][1][2]) {//if fee is the same, sort by command_hash alphabetically
                        let x = a[2].toLowerCase();
                        let y = b[2].toLowerCase();

                        return x < y ? -1 : x > y ? 1 : 0;
                    }
                    return b[0][1][2] - a[0][1][2];//sort by fee
                });

                if (!oy_block_range(Object.keys(OY_BLOCK[1]).length)) return false;//block_range will invoke block_reset if necessary

                if (oy_dive_state_prev===true) {
                    for (let oy_peer_select in OY_PEERS) {
                        if (OY_PEERS[oy_peer_select][1]===2&&OY_PEERS[oy_peer_select][0]<OY_BLOCK_TIME&&typeof(OY_BLOCK[1][oy_peer_select])==="undefined") oy_node_deny(oy_peer_select, "OY_DENY_FULL_DIVE");
                    }
                }
            }
            else {
                OY_BLOCK_SYNC = {};
                OY_SYNC_TALLY = {};
            }

            if (!oy_block_process(oy_command_execute, true, false)) return false;//block_process will invoke block_reset if necessary

            OY_BLOCK_FLAT = JSON.stringify(OY_BLOCK);
            OY_BLOCK_HASH = oy_hash_gen(OY_BLOCK_FLAT);
            OY_BLOCK_WEIGHT = new Blob([OY_BLOCK_FLAT]).size;

            oy_log("FULL MESHBLOCK HASH "+OY_BLOCK_HASH, true);
            console.log("FULL MESHBLOCK HASH "+OY_BLOCK_HASH);
            //oy_log_debug("FULL MESHBLOCK HASH "+OY_BLOCK_HASH);
            oy_log_debug("HASH: "+OY_BLOCK_HASH+"\nBLOCK: "+OY_BLOCK_FLAT);

            if (typeof(OY_BLOCK_MAP)==="function") OY_BLOCK_MAP(0);
            oy_event_dispatch("oy_block_trigger");

            let oy_light_pass = false;
            for (let oy_peer_select in OY_PEERS) {
                if (OY_PEERS[oy_peer_select][1]===1) {
                    oy_light_pass = true;
                    break;
                }
            }
            if (OY_BLOCK_UPTIME!==null&&oy_light_pass===true) {
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
                        if (OY_PEERS[oy_peer_select][1]===1) oy_data_beam(oy_peer_select, "OY_PEER_DIFF", [OY_SELF_PUBLIC, oy_diff_crypt, oy_diff_hash, oy_diff_nonce_max, parseInt(oy_diff_nonce), oy_diff_split[oy_diff_nonce]]);
                    }
                }
            }

            OY_BLOCK_JUDGE = [null];
            let oy_hop_active = 0;
            for (let i in OY_BLOCK_LEARN) {
                if (i!==0&&OY_BLOCK_LEARN[i]!==null&&OY_BLOCK_LEARN[i].length!==0) oy_hop_active++;
            }
            for (let i in OY_BLOCK_LEARN) {
                if (i===0||OY_BLOCK_LEARN[i]===null) continue;
                if (OY_BLOCK_LEARN[i].length===0) OY_BLOCK_JUDGE.push(true);
                else OY_BLOCK_JUDGE.push(oy_calc_avg(OY_BLOCK_LEARN[i])*OY_JUDGE_BUFFER_BASE*Math.pow(1+(OY_JUDGE_BUFFER_CURVE/oy_hop_active), parseInt(i)));
            }
            OY_BLOCK_LEARN = [null];

            let oy_judge_last = null;
            for (let oy_pointer = OY_BLOCK_JUDGE.length-1; oy_pointer>0; oy_pointer--) {
                if (OY_BLOCK_JUDGE[oy_pointer]===true) {
                    if (oy_judge_last!==null) OY_BLOCK_JUDGE[oy_pointer] = oy_judge_last;
                }
                else oy_judge_last = OY_BLOCK_JUDGE[oy_pointer];
            }
            console.log("JUDGE: "+JSON.stringify(OY_BLOCK_JUDGE));

            if (OY_BLOCK_BOOT===true) {
                OY_SYNC_LAST = [1, 1];
                OY_SYNC_MAP = [{}, {}];
            }
            else {
                OY_SYNC_LAST.shift();
                OY_SYNC_LAST.push(0);
                OY_SYNC_MAP.shift();
                OY_SYNC_MAP.push({});
            }

            if (OY_FULL_INTRO!==false&&OY_BLOCK[1][OY_SELF_PUBLIC][1]===1) {
                OY_OFFER_PICKUP = [];
                for (let oy_key_public in OY_OFFER_COLLECT) {
                    if (typeof(OY_BLOCK[1][oy_key_public])!=="undefined") OY_OFFER_PICKUP.push([oy_key_public, OY_OFFER_COLLECT[oy_key_public][3], OY_BLOCK[1][oy_key_public][0], OY_BLOCK[1][oy_key_public][2]]);
                }
                OY_OFFER_PICKUP.sort(function(a, b) {
                    if (a[2]===b[2]) {
                        if (a[3]===b[3]) {
                            let x = a[0].toLowerCase();
                            let y = b[0].toLowerCase();

                            return x < y ? -1 : x > y ? 1 : 0;
                        }
                        return b[3] - a[3];
                    }
                    return b[2] - a[2];
                });
                let oy_pickup_sort = [];
                for (let oy_key_public in OY_OFFER_COLLECT) {
                    if (typeof(OY_BLOCK[1][oy_key_public])==="undefined") oy_pickup_sort.push([oy_key_public, OY_OFFER_COLLECT[oy_key_public]][3], OY_OFFER_COLLECT[oy_key_public][0]);
                }
                oy_pickup_sort.sort(function(a, b) {
                    if (a[2]===b[2]) {
                        let x = a[0].toLowerCase();
                        let y = b[0].toLowerCase();

                        return x < y ? -1 : x > y ? 1 : 0;
                    }
                    return a[2] - b[2];
                });
                for (let i in oy_pickup_sort) {
                    OY_OFFER_PICKUP.push(oy_pickup_sort[i]);
                }
                OY_OFFER_COUNTER = -1;
            }

            oy_block_finish();

            oy_chrono(function() {
                //FULL NODE -> LIGHT NODE
                if (OY_LIGHT_STATE===false&&(OY_LIGHT_MODE===true||!oy_peer_full()||Object.keys(OY_BLOCK[1]).length<OY_BLOCK_RANGE_MIN)&&OY_BLOCK_BOOT===false) {//TODO range_kill
                    OY_LIGHT_STATE = true;
                    OY_DIVE_STATE = false;
                    OY_SYNC_LAST = [0, 0];
                    OY_SYNC_MAP = [{}, {}];

                    oy_event_dispatch("oy_state_light");
                    oy_worker_halt(1);

                    for (let oy_peer_select in OY_PEERS) {//TODO terminate any jump session
                        if (oy_peer_select!==OY_JUMP_ASSIGN[0]) oy_data_beam(oy_peer_select, "OY_PEER_LIGHT", oy_key_sign(OY_SELF_PRIVATE, OY_MESH_DYNASTY+OY_BLOCK_HASH));
                    }
                }
            }, (OY_BLOCK_SECTORS[4][0]-((Date.now()/1000)-OY_BLOCK_TIME))*1000);
        }, (OY_SYNC_LAST[0]>0)?Math.max(OY_BLOCK_SECTORS[0][1], Math.min(OY_BLOCK_SECTORS[1][1], OY_SYNC_LAST[0]+OY_BLOCK_BUFFER_SPACE[1])):OY_BLOCK_SECTORS[1][1]);

        oy_chrono(function() {
            if (oy_block_continue===true&&OY_LIGHT_STATE===true&&Object.keys(OY_LIGHT_BUILD).length>0) oy_block_light();
        }, OY_BLOCK_SECTORS[2][1]);

        oy_chrono(function() {
            oy_block_challenge(0);
        }, OY_BLOCK_SECTORS[3][1]);

        oy_chrono(function() {
            oy_block_challenge(1);
        }, OY_BLOCK_SECTORS[4][1]);
    }
}

function oy_block_challenge(oy_challenge_stage) {
    if (oy_challenge_stage===0) {
        OY_BLOCK_CHALLENGE = {};
        for (let oy_peer_select in OY_PEERS) {
            if (OY_PEERS[oy_peer_select][1]!==0&&oy_peer_select!==OY_JUMP_ASSIGN[0]) OY_BLOCK_CHALLENGE[oy_peer_select] = true;
        }
        for (let oy_peer_select in OY_PEERS) {
            oy_latency_test(oy_peer_select, "OY_PEER_ROUTINE", OY_PEERS[oy_peer_select][1]);
        }
    }
    else if (oy_challenge_stage===1) {
        for (let oy_peer_select in OY_BLOCK_CHALLENGE) {
            if (typeof(OY_PEERS[oy_peer_select])!=="undefined"&&OY_PEERS[oy_peer_select][1]!==0&&oy_peer_select!==OY_JUMP_ASSIGN[0]) oy_node_deny(oy_peer_select, "OY_DENY_BLOCK_CHALLENGE");
        }
        OY_BLOCK_CHALLENGE = {};
    }
}

function oy_block_verify(oy_block_hash, oy_dive_ledger) {
    for (let oy_key_public in oy_dive_ledger) {
        let oy_grade_array = [];
        for (let i in oy_dive_ledger[oy_key_public][7]) {
            oy_grade_array.push(oy_calc_grade(oy_dive_ledger[oy_key_public][7][i]));
        }
        if (Math.floor(oy_calc_avg(oy_grade_array))!==oy_dive_ledger[oy_key_public][0]||!oy_work_verify(OY_BLOCK_TIME-(((Date.now()/1000)-OY_BLOCK_TIME<OY_BLOCK_SECTORS[0][0])?60:0), oy_key_public, oy_block_hash, (OY_BLOCK[0][5]===0)?OY_BLOCK[0][14][OY_BLOCK[0][14].length-1]:OY_BLOCK[0][3], oy_dive_ledger[oy_key_public][7])) return false;
    }
    return true;
}

function oy_block_light() {
    if (OY_LIGHT_STATE===false) return false;

    if (OY_BLOCK_HASH===null) {
        oy_block_reset("OY_RESET_NULL_HASH_B");
        return false;
    }
    if (Object.keys(OY_LIGHT_BUILD).length===0) {
        oy_block_reset("OY_RESET_NULL_LIGHT_A");
        return false;
    }
    OY_BLOCK_DIFF = true;
    OY_LIGHT_PROCESS = true;
    OY_BLOCK_RECORD = Date.now()/1000;

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
            oy_block_reset("OY_RESET_NULL_LIGHT_B");
            return false;
        }
        oy_diff_build += OY_LIGHT_BUILD[oy_reference_select[0]][3][oy_nonce_select][1][oy_split_select[0]][0];
    }

    for (let oy_peer_select in OY_PEERS) {
        if (oy_peer_select===OY_LIGHT_BUILD[oy_reference_select[0]][4]) OY_PEERS[oy_peer_select][9] = 1;
        else OY_PEERS[oy_peer_select][9] = 0;
    }

    let oy_diff_track = JSON.parse(LZString.decompressFromUTF16(oy_diff_build));//TODO might wrap in a try/catch
    oy_diff_build = null;

    if (!oy_block_range(Object.keys(oy_diff_track[0]).length)) return false;

    if (OY_LIGHT_LEAN===false&&!oy_block_verify(OY_BLOCK_HASH, oy_diff_track[0])) {
        oy_node_deny(OY_LIGHT_BUILD[oy_reference_select[0]][4], "OY_DENY_WORK_INVALID");
        oy_block_reset("OY_RESET_DIFF_INVALID");
        return false;
    }

    OY_LIGHT_BUILD = {};
    oy_diff_track[1] = oy_block_command_hash(oy_diff_track[1]);
    if (oy_diff_track[1]===false) {
        oy_block_reset("OY_RESET_COMMAND_HASH_LIGHT");
        return false;
    }

    OY_BLOCK[0][7] = 0;
    for (let oy_key_public in oy_diff_track[0]) {
        OY_BLOCK[0][7] += oy_diff_track[0][oy_key_public][0];
    }

    OY_BLOCK[1] = oy_diff_track[0];

    if (!oy_block_process(oy_diff_track[1], false, false)) return false;//block_process will invoke block_reset if necessary

    /*
    for (let oy_key_public in OY_BLOCK[1]) {
        if (OY_BOOST_BUILD.length<OY_BOOST_KEEP*OY_BOOST_BIAS&&typeof(oy_diff_track[0][oy_key_public])==="undefined"&&OY_BOOST_BUILD.indexOf(oy_key_public)===-1&&typeof(OY_PEERS[oy_key_public])==="undefined"&&typeof(OY_NODES[oy_key_public])==="undefined") OY_BOOST_BUILD.push(oy_key_public);
    }
    */

    OY_BLOCK_FLAT = JSON.stringify(OY_BLOCK);
    OY_BLOCK_HASH = oy_hash_gen(OY_BLOCK_FLAT);
    OY_BLOCK_WEIGHT = new Blob([OY_BLOCK_FLAT]).size;

    oy_log("LIGHT MESHBLOCK HASH "+OY_BLOCK_HASH, true);
    oy_log_debug("LIGHT MESHBLOCK HASH "+OY_BLOCK_HASH+"\n"+OY_BLOCK_FLAT);
    console.log("LIGHT MESHBLOCK HASH "+OY_BLOCK_HASH);
    console.log(OY_BLOCK_FLAT);

    if (typeof(OY_BLOCK_MAP)==="function") OY_BLOCK_MAP(0);
    oy_event_dispatch("oy_block_trigger");

    /*
    let oy_dive_array = [];
    for (let oy_key_public in OY_BLOCK[1]) {
        if (typeof(OY_PEERS[oy_key_public])==="undefined"&&typeof(OY_NODES[oy_key_public])==="undefined"&&oy_key_public!==OY_SELF_PUBLIC) oy_dive_array.push(oy_key_public);
    }
    oy_calc_shuffle(oy_dive_array);
    for (let i in oy_dive_array) {
        if (OY_BOOST_BUILD.length>=OY_BOOST_KEEP*OY_BOOST_BIAS) break;
        OY_BOOST_BUILD.push(oy_dive_array[i]);
    }
    */

    //LIGHT NODE -> FULL NODE
    if (OY_LIGHT_MODE===false) {
        let oy_time_local = Date.now()/1000;
        let oy_light_weak = [null, -1];
        for (let oy_peer_select in OY_PEERS) {
            if (OY_PEERS[oy_peer_select][3]>oy_light_weak[1]&&
                OY_PEERS[oy_peer_select][1]===1&&
                oy_time_local-OY_PEERS[oy_peer_select][0]>=OY_PEER_RESERVETIME&&
                OY_PEERS[oy_peer_select][9]<OY_PEER_CUT) oy_light_weak = [oy_peer_select, OY_PEERS[oy_peer_select][3]];
        }

        if (oy_peer_full()) {
            OY_LIGHT_STATE = false;
            OY_BLOCK_JUDGE = true;

            let oy_last_calc = ((Date.now()/1000)-OY_BLOCK_TIME)+OY_SYNC_LAST_BUFFER;
            if (oy_last_calc>OY_BLOCK_SECTORS[0][0]&&oy_last_calc<OY_BLOCK_SECTORS[1][0]) OY_SYNC_LAST = [oy_last_calc, oy_last_calc];
            else OY_SYNC_LAST = [0, 0];

            oy_event_dispatch("oy_state_full");
            oy_worker_spawn(1);

            let oy_nonfull_sort = [];
            for (let oy_peer_select in OY_PEERS) {
                if (oy_time_local-OY_PEERS[oy_peer_select][0]>=OY_PEER_RESERVETIME&&
                    OY_PEERS[oy_peer_select][9]<OY_PEER_CUT&&
                    (OY_PEERS[oy_peer_select][1]!==2||typeof(OY_BLOCK[1][oy_peer_select])==="undefined")) oy_nonfull_sort.push([oy_peer_select, OY_PEERS[oy_peer_select][3]]);
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
                if (oy_remove_count>=(OY_PEER_MAX-OY_PEER_FULL_MIN)+(Object.keys(OY_PEERS).length-OY_PEER_MAX)) break;
                oy_node_deny(oy_nonfull_sort[i][0], "OY_DENY_FULL_DROP");
                oy_remove_count++;
            }

            let oy_time_offset = (Date.now()/1000)-OY_BLOCK_TIME;
            oy_chrono(function() {
                for (let oy_peer_select in OY_PEERS) {
                    oy_data_beam(oy_peer_select, "OY_PEER_FULL", oy_key_sign(OY_SELF_PRIVATE, OY_MESH_DYNASTY+OY_BLOCK_HASH));
                }
            }, (OY_BLOCK_SECTORS[4][0]-oy_time_offset)*1000);
        }
        else if (Object.keys(OY_PEERS).length===OY_PEER_MAX&&oy_light_weak[0]!==null) oy_node_deny(oy_light_weak[0], "OY_DENY_UNLATCH_DROP");
    }

    oy_block_finish();
}

function oy_block_range(oy_mesh_range_new) {
    if (OY_BLOCK[0][2]-oy_mesh_range_new>=OY_BLOCK[0][2]*OY_BLOCK_RANGE_KILL) {
        //oy_block_reset("OY_RESET_RANGE_KILL");
        //return false;
    }
    OY_BLOCK[0][2] = oy_mesh_range_new;

    OY_BLOCK_STABILITY_KEEP.push(OY_BLOCK[0][2]);
    while (OY_BLOCK_STABILITY_KEEP.length>OY_BLOCK_STABILITY_LIMIT) OY_BLOCK_STABILITY_KEEP.shift();
    OY_BLOCK_STABILITY = (OY_BLOCK_STABILITY_KEEP.length<OY_BLOCK_STABILITY_TRIGGER)?0:oy_block_stability(OY_BLOCK_STABILITY_KEEP);

    if (OY_BLOCK[0][2]<OY_BLOCK_RANGE_MIN&&OY_BLOCK_BOOT===false) {
        oy_block_reset("OY_RESET_RANGE_DROP");
        console.log("RANGE_DROP: "+OY_BLOCK[0][2]);
        console.log(JSON.stringify(OY_BLOCK));
        return false;
    }
    return true;
}

function oy_block_process(oy_command_execute, oy_full_flag, oy_jump_flag) {
    let oy_block;
    let oy_block_hash;
    let oy_block_time;
    if (oy_jump_flag===true) {
        oy_block = OY_BLOCK_JUMP;
        oy_block_hash = OY_BLOCK_HASH_JUMP;
        oy_block_time = OY_BLOCK_TIME_JUMP;
    }
    else {
        oy_block = OY_BLOCK;
        oy_block_hash = OY_BLOCK_HASH;
        oy_block_time = OY_BLOCK_TIME;
    }
    //MAINTAIN--------------------------------
    oy_block[0][0] = OY_MESH_DYNASTY;
    oy_block[0][1] = oy_block_time;
    oy_block[0][4] = OY_BLOCK_BOOTTIME;
    oy_block[0][5]++;
    oy_block[0][6]++;
    oy_block[0][8] = Math.floor(oy_block[0][7]/oy_block[0][2]);
    oy_block[0][10].push(oy_block[0][8]);
    oy_block[0][12].push(oy_block[0][2]);
    let oy_uptime_total = 0;
    for (let oy_key_public in oy_block[1]) {
        oy_uptime_total += oy_block[1][oy_key_public][2];
    }
    oy_block[0][15] = Math.floor(oy_uptime_total/oy_block[0][2]);

    //epoch macro processing - 6 hr interval - 360 blocks
    let oy_command_expire = oy_block_time - (OY_BLOCK_EPOCH_MACRO*OY_BLOCK_SECTORS[5][1]);//TODO calibrate purge timing for snapshot precision
    for (let oy_command_hash in oy_block[3]) {
        if (oy_block[3][oy_command_hash][1][0]===oy_command_expire) delete oy_block[3][oy_command_hash];
    }
    if (oy_block[0][5]===OY_BLOCK_EPOCH_MACRO) {
        oy_block[0][5] = 0;

        oy_block[0][9] = Math.floor(oy_calc_avg(oy_block[0][10]));
        oy_block[0][10] = [];

        oy_block[0][14].push(oy_block[0][3]);
        while (oy_block[0][14].length>OY_BLOCK_EPOCH_MACRO) oy_block[0][14].shift();
        oy_block[0][13] = Math.floor(oy_calc_avg(oy_block[0][14])*1000);

        let oy_delta_array = new Array(OY_WORK_DILUTE);
        oy_delta_array.fill(1);
        oy_delta_array.push(oy_block[0][9]/OY_WORK_TARGET);
        let oy_work_old = oy_block[0][3];
        oy_block[0][3] = Math.round(oy_block[0][3]*Math.max(1-OY_WORK_DELTA, Math.min(1+OY_WORK_DELTA, oy_calc_avg(oy_delta_array))));
        if (oy_block[0][3]<OY_WORK_MIN) oy_block[0][3] = OY_WORK_MIN;
        if (oy_work_old===oy_block[0][3]) oy_block[0][3]++;
        if (oy_block[0][3]>OY_WORK_MAX) oy_block[0][3] = OY_WORK_MAX;

        oy_block[2][0].push(oy_block_hash);
        while (oy_block[2][0].length>OY_BLOCK_SNAPSHOT_KEEP) oy_block[2][0].shift();
    }

    //epoch micro processing - 10 min interval - 10 blocks
    while (oy_block[0][12].length>OY_BLOCK_EPOCH_MICRO) oy_block[0][12].shift();
    oy_block[0][11] = Math.floor(oy_calc_avg(oy_block[0][12])*1000);

    oy_block[2][1].push(oy_block_hash);
    while (oy_block[2][1].length>OY_BLOCK_EPOCH_MICRO) oy_block[2][1].shift();
    if (oy_block[0][6]===OY_BLOCK_EPOCH_MICRO) {
        oy_block[0][6] = 0;

        if (oy_jump_flag===false) {
            if (oy_full_flag===true) {
                let oy_block_reference = OY_BLOCK_TIME-(OY_BLOCK_EPOCH_MACRO*OY_BLOCK_SECTORS[5][0]);
                for (let oy_block_time in OY_BLOCK_JUMP_MAP) {
                    if (parseInt(oy_block_time)<oy_block_reference) delete OY_BLOCK_JUMP_MAP[oy_block_time];//TODO calibrate purge timing for snapshot precision
                }
                if (OY_BLOCK_COMPRESS!==null) OY_BLOCK_JUMP_MAP[OY_BLOCK_TIME] = [OY_BLOCK_HASH, oy_block[2][1], OY_BLOCK_COMPRESS];
            }
            else OY_BLOCK_JUMP_MAP = {};
        }
    }
    //MAINTAIN--------------------------------

    if (OY_BLOCK_BOOT!==false) return true;//transactions and fees are paused whilst the mesh calibrates its initial topology

    let oy_supply_pre = 0;
    let oy_dive_bounty = 0;
    if (oy_jump_flag===false) {
        OY_BLOCK_NEW = {};
        if (oy_full_flag===true) OY_DIFF_TRACK = [{}, []];//[0] is dive ledger, [1] is command transactions
    }

    //AMEND-----------------------------------
    for (let oy_key_public in oy_block[4]) {
        oy_supply_pre += oy_block[4][oy_key_public];
        if (oy_key_public==="oy_escrow_dns") continue;
        let oy_balance_prev = oy_block[4][oy_key_public];
        oy_block[4][oy_key_public] -= OY_AKOYA_FEE;
        oy_block[4][oy_key_public] = Math.max(oy_block[4][oy_key_public], 0);
        oy_dive_bounty += oy_balance_prev - oy_block[4][oy_key_public];
        if (oy_block[4][oy_key_public]===0) delete oy_block[4][oy_key_public];
    }

    for (let oy_dns_name in oy_block[5]) {
        if (oy_block[5][oy_dns_name][0]==="A") continue;
        let oy_akoya_wallet;
        if (oy_block[5][oy_dns_name][0]==="") oy_akoya_wallet = oy_dns_name;
        else oy_akoya_wallet = oy_block[5][oy_dns_name][0];
        if (typeof(oy_block[4][oy_akoya_wallet])==="undefined") delete oy_block[5][oy_dns_name];
        else {
            let oy_balance_prev = oy_block[4][oy_akoya_wallet];
            oy_block[4][oy_akoya_wallet] -= Math.ceil(OY_DNS_FEE*(oy_block[5][oy_dns_name][1]/99));
            oy_block[4][oy_akoya_wallet] = Math.max(oy_block[4][oy_akoya_wallet], 0);
            oy_dive_bounty += oy_balance_prev - oy_block[4][oy_akoya_wallet];
            if (oy_block[4][oy_akoya_wallet]===0) delete oy_block[4][oy_akoya_wallet];
        }
    }

    for (let oy_dns_name in oy_block[6]) {
        if (oy_block[6][oy_dns_name][2]<=oy_block_time) {
            oy_block[4]["oy_escrow_dns"] -= oy_block[6][oy_dns_name][1];
            oy_dive_bounty += oy_block[6][oy_dns_name][1];
            oy_block[5][oy_dns_name][0] = oy_block[6][oy_dns_name][0];
            delete oy_block[6][oy_dns_name];
        }
    }

    for (let oy_entropy_id in oy_block[7]) {
        //META FEE PROCESSING
        let oy_akoya_wallet;
        if (oy_block[7][oy_entropy_id][0]==="") oy_akoya_wallet = oy_entropy_id;
        else oy_akoya_wallet = oy_block[7][oy_entropy_id][0];
        if (typeof(oy_block[4][oy_akoya_wallet])==="undefined") delete oy_block[7][oy_entropy_id];
        else {
            let oy_balance_prev = oy_block[4][oy_akoya_wallet];
            oy_block[4][oy_akoya_wallet] -= Math.ceil(OY_META_FEE*(oy_block[7][oy_entropy_id][1]/99));
            oy_block[4][oy_akoya_wallet] = Math.max(oy_block[4][oy_akoya_wallet], 0);
            oy_dive_bounty += oy_balance_prev - oy_block[4][oy_akoya_wallet];
            if (oy_block[4][oy_akoya_wallet]===0) delete oy_block[4][oy_akoya_wallet];
        }
        //META FEE PROCESSING

        //DAPP 0 - WEB 3 HOSTING
        if (oy_block[7][oy_entropy_id][1]===0) {
            //TODO
        }
        //DAPP 0 - WEB 3 HOSTING

        //DAPP 1 - HIVEMIND
        else if (oy_block[7][oy_entropy_id][1]===1) {
            if (oy_block[7][oy_entropy_id][3][0][0]===0) {
                for (let oy_entropy_id_sub in oy_block[7][oy_entropy_id][3][1]) {
                    if (oy_block_time>=oy_block[7][oy_entropy_id][3][1][oy_entropy_id_sub]||typeof(oy_block[7][oy_entropy_id_sub])==="undefined") delete oy_block[7][oy_entropy_id][3][1][oy_entropy_id_sub];
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
        if ((oy_full_flag===true||(oy_full_flag===false&&OY_LIGHT_LEAN===false))&&!oy_block_command_verify(oy_command_execute[i][0], oy_command_execute[i][1], oy_command_execute[i][2], oy_jump_flag)) continue;//additional check is required because balances change

        //["OY_AKOYA_SEND", oy_protocol_assign, oy_key_public, oy_transfer_amount, oy_receive_public]
        if (oy_command_execute[i][0][0]==="OY_AKOYA_SEND") {//TODO command verification is not applied efficiently
            let oy_wallet_create = false;
            if (typeof(oy_block[4][oy_command_execute[i][0][4]])==="undefined") {
                oy_block[4][oy_command_execute[i][0][4]] = 0;
                oy_wallet_create = true;
            }
            let oy_balance_send = oy_block[4][oy_command_execute[i][0][2]];
            let oy_balance_receive = oy_block[4][oy_command_execute[i][0][4]];
            oy_block[4][oy_command_execute[i][0][2]] -= oy_command_execute[i][0][3];
            oy_block[4][oy_command_execute[i][0][4]] += oy_command_execute[i][0][3];
            if (oy_block[4][oy_command_execute[i][0][2]]+oy_block[4][oy_command_execute[i][0][4]]!==oy_balance_send+oy_balance_receive) {//verify balances, revert transaction if necessary
                oy_block[4][oy_command_execute[i][0][2]] = oy_balance_send;
                oy_block[4][oy_command_execute[i][0][4]] = oy_balance_receive;
                continue;
            }
            else {
                if (oy_wallet_create===true) oy_block[4][oy_command_execute[i][0][4]] -= OY_AKOYA_FEE;
                if (oy_block[4][oy_command_execute[i][0][2]]===0) delete oy_block[4][oy_command_execute[i][0][2]];
                if (oy_block[4][oy_command_execute[i][0][4]]===0) delete oy_block[4][oy_command_execute[i][0][4]];
            }
        }
        //["OY_DNS_MODIFY", oy_protocol_assign, oy_key_public, oy_dns_name, oy_nav_data]
        else if (oy_command_execute[i][0][0]==="OY_DNS_MODIFY") {
            let oy_nav_flat = JSON.stringify(oy_command_execute[i][0]);
            if (oy_nav_flat.length<=OY_DNS_NAV_LIMIT&&oy_an_check(oy_nav_flat.replace(/[\[\]{}'":,@=-]/g, ""))) {//check that the contents of oy_nav_data are compliant in size and fully alphanumeric
                oy_block[5][oy_command_execute[i][0][3]][1] = Math.max(99, oy_nav_flat.length);
                oy_block[5][oy_command_execute[i][0][3]][2] = oy_command_execute[i][0][4];
            }
        }
        //["OY_DNS_BID", oy_protocol_assign, oy_key_public, oy_dns_name, oy_bid_amount]
        else if (oy_command_execute[i][0][0]==="OY_DNS_BID") {
            let oy_balance_send = oy_block[4][oy_command_execute[i][0][2]];
            let oy_balance_receive = oy_block[4]["oy_escrow_dns"];
            oy_block[4][oy_command_execute[i][0][2]] -= oy_command_execute[i][0][4];
            oy_block[4]["oy_escrow_dns"] += oy_command_execute[i][0][4];
            if (oy_block[4][oy_command_execute[i][0][2]]+oy_block[4]["oy_escrow_dns"]!==oy_balance_send+oy_balance_receive) {//verify balances, revert transaction if necessary
                oy_block[4][oy_command_execute[i][0][2]] = oy_balance_send;
                oy_block[4]["oy_escrow_dns"] = oy_balance_receive;
                continue;
            }
            else {
                let oy_bid_pass = false;
                if (typeof(oy_block[6][oy_command_execute[i][0][3]])!=="undefined") {
                    if (typeof(oy_block[4][oy_block[6][oy_command_execute[i][0][3]][0]])==="undefined") oy_block[4][oy_block[6][oy_command_execute[i][0][3]][0]] = 0;
                    let oy_balance_send = oy_block[4]["oy_escrow_dns"];
                    let oy_balance_receive = oy_block[4][oy_block[6][oy_command_execute[i][0][3]][0]];
                    oy_block[4]["oy_escrow_dns"] -= oy_block[4][oy_block[6][oy_command_execute[i][0][3]][1]];
                    oy_block[4][oy_block[6][oy_command_execute[i][0][3]][0]] += oy_block[4][oy_block[6][oy_command_execute[i][0][3]][1]];
                    if (oy_block[4]["oy_escrow_dns"]+oy_block[4][oy_block[6][oy_command_execute[i][0][3]][0]]!==oy_balance_send+oy_balance_receive) {//verify balances, revert transaction if necessary
                        oy_block[4]["oy_escrow_dns"] = oy_balance_send;
                        if (oy_balance_receive===0) delete oy_block[4][oy_block[6][oy_command_execute[i][0][3]][0]];
                        else oy_block[4][oy_block[6][oy_command_execute[i][0][3]][0]] = oy_balance_receive;
                    }
                    else oy_bid_pass = true;
                }
                else oy_bid_pass = true;

                if (oy_bid_pass===true) {
                    if (typeof(oy_block[5][oy_command_execute[i][0][3]])==="undefined") oy_block[5][oy_command_execute[i][0][3]] = ["A", 99, ""];//[owner, nav_size, nav_data]
                    oy_block[6][oy_command_execute[i][0][3]] = [oy_command_execute[i][0][2], oy_command_execute[i][0][4], oy_block_time+OY_DNS_AUCTION_DURATION];//[bid holder, bid amount, auction expire]
                }
            }
        }
        //["OY_DNS_TRANSFER", oy_protocol_assign, oy_key_public, oy_dns_name, oy_receive_public]
        else if (oy_command_execute[i][0][0]==="OY_DNS_TRANSFER") {
            oy_block[5][oy_command_execute[i][0][3]][0] = oy_command_execute[i][0][4];
        }
        //["OY_DNS_RELEASE", oy_protocol_assign, oy_key_public, oy_dns_name]
        else if (oy_command_execute[i][0][0]==="OY_DNS_RELEASE") {
            delete oy_block[5][oy_command_execute[i][0][3]];
        }
        //["OY_DNS_NULLING", oy_protocol_assign, oy_key_public, oy_dns_name, oy_nulling_amount]
        else if (oy_command_execute[i][0][0]==="OY_DNS_NULLING") {
            let oy_balance_send = oy_block[4][oy_command_execute[i][0][2]];
            oy_block[4][oy_command_execute[i][0][2]] -= oy_command_execute[i][0][4];
            oy_block[4][oy_command_execute[i][0][3]] = oy_command_execute[i][0][4];
            if (oy_block[4][oy_command_execute[i][0][2]]+oy_block[4][oy_command_execute[i][0][3]]!==oy_balance_send) {//verify balances, revert transaction if necessary
                oy_block[4][oy_command_execute[i][0][2]] = oy_balance_send;
                delete oy_block[4][oy_command_execute[i][0][3]];
                continue;
            }
            else oy_block[5][oy_command_execute[i][0][3]][0] = "";
        }
        //["OY_META_SET", oy_protocol_assign, oy_key_public, oy_entropy_id, oy_meta_dapp, oy_meta_data]
        else if (oy_command_execute[i][0][0]==="OY_META_SET") {
            let oy_meta_flat = JSON.stringify(oy_command_execute[i][0][5]);
            if (oy_meta_flat.length<=OY_META_DATA_LIMIT&&oy_an_check(oy_meta_flat.replace(/[\[\]{}'":,@=-]/g, ""))) {//TODO confirm if these conditions should be checked every hop
                let oy_meta_owner = oy_command_execute[i][0][2];
                let oy_meta_data = oy_clone_object(oy_command_execute[i][0][5]);

                let oy_entropy_id;
                if (oy_command_execute[i][0][3]==="") {//recycle meshblock entropy to ensure random meta handles are assigned in a decentralized manner
                    oy_entropy_id = oy_hash_gen(oy_block_hash+oy_command_execute[i][0]);
                    if (typeof(oy_block[7][oy_entropy_id])!=="undefined") continue;//there is a nonzero chance that a legitimate META_SET transaction would get rejected and need to be tried again
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
                        if (!OY_BLOCK_TRANSACTS["OY_HIVEMIND_CLUSTER"][0](oy_command_execute[i][0], oy_jump_flag)) continue;
                    }
                    //POST[0] = [1, master_entropy_id, author_public, submission_payment]
                    //POST[1] = [] - rendering object for post content
                    else if (oy_command_execute[i][0][5][0][0]===1) {
                        if (!OY_BLOCK_TRANSACTS["OY_HIVEMIND_POST"][0](oy_command_execute[i][0], oy_jump_flag)) continue;

                        oy_meta_owner = "";
                        oy_meta_data[0][2] = oy_command_execute[i][0][2];

                        let oy_cluster_owner;
                        if (oy_block[7][oy_command_execute[i][0][5][0][1]][0]==="") oy_cluster_owner = oy_command_execute[i][0][5][0][1];
                        else oy_cluster_owner = oy_block[7][oy_command_execute[i][0][5][0][1]][0];
                        let oy_balance_send = oy_block[4][oy_command_execute[i][0][2]];
                        let oy_balance_receive = oy_block[4][oy_cluster_owner];
                        oy_block[4][oy_command_execute[i][0][2]] -= oy_command_execute[i][0][5][0][3];
                        oy_block[4][oy_cluster_owner] += oy_block[7][oy_command_execute[i][0][5][0][1]][3][0][2];
                        oy_block[4][oy_entropy_id] = oy_command_execute[i][0][5][0][3] - oy_block[7][oy_command_execute[i][0][5][0][1]][3][0][2];

                        if ((oy_cluster_owner===oy_command_execute[i][0][2]&&oy_block[4][oy_cluster_owner]+oy_block[4][oy_entropy_id]!==oy_balance_send)||(oy_cluster_owner!==oy_command_execute[i][0][2]&&oy_block[4][oy_command_execute[i][0][2]]+oy_block[4][oy_cluster_owner]+oy_block[4][oy_entropy_id]!==oy_balance_send+oy_balance_receive)) {//TODO verify security
                            oy_block[4][oy_command_execute[i][0][2]] = oy_balance_send;
                            oy_block[4][oy_cluster_owner] = oy_balance_receive;
                            delete oy_block[4][oy_entropy_id];
                            continue;
                        }
                        else {
                            if (Object.keys(oy_block[7][oy_command_execute[i][0][5][0][1]][1]).length<oy_block[7][oy_command_execute[i][0][5][0][1]][3][0][5]+oy_block[7][oy_command_execute[i][0][5][0][1]][3][0][6]&&
                                typeof(oy_block[7][oy_command_execute[i][0][5][0][1]][3][1][oy_entropy_id])==="undefined") {
                                oy_block[7][oy_command_execute[i][0][5][0][1]][3][1][oy_entropy_id] = oy_block_time+(oy_block[7][oy_command_execute[i][0][5][0][1]][3][0][4]*3600);
                            }
                            else continue;
                        }
                    }
                    else continue;
                }
                //DAPP 1 - HIVEMIND

                //[meta_owner, meta_dapp, meta_size, meta_data]
                oy_block[7][oy_entropy_id] = [oy_meta_owner, oy_command_execute[i][0][4], Math.max(99, oy_meta_flat.length), oy_meta_data];
            }
            else continue;
        }
        else continue;

        oy_block[3][oy_command_execute[i][2]] = oy_command_execute[i][0];
        if (oy_jump_flag===false) {
            OY_BLOCK_NEW[oy_command_execute[i][2]] = oy_command_execute[i][0];
            if (oy_full_flag===true) OY_DIFF_TRACK[1].push([oy_command_execute[i][0], oy_command_execute[i][1]]);
        }
    }

    if (oy_jump_flag===false) {//TODO only successful transactions should be included in command_rollback
        if (oy_full_flag===true) {
            let oy_block_reference = OY_BLOCK_TIME-(OY_BLOCK_EPOCH_MICRO*OY_BLOCK_SECTORS[5][1]);
            for (let oy_block_time in OY_BLOCK_SYNC_PASS) {
                if (parseInt(oy_block_time)<oy_block_reference) delete OY_BLOCK_SYNC_PASS[oy_block_time];
            }
            for (let oy_block_time in OY_BLOCK_COMMAND_ROLLBACK) {
                if (parseInt(oy_block_time)<oy_block_reference) delete OY_BLOCK_COMMAND_ROLLBACK[oy_block_time];
            }
            OY_BLOCK_COMMAND_ROLLBACK[OY_BLOCK_TIME] = LZString.compressToUTF16(JSON.stringify(OY_DIFF_TRACK[1]));
        }
        else {
            OY_BLOCK_SYNC_PASS = {};
            OY_BLOCK_COMMAND_ROLLBACK = {};
        }
        //oy_log_debug("SYNC_PASS: "+OY_SELF_SHORT+" - "+JSON.stringify(OY_BLOCK_SYNC_PASS));
        //console.log("COMMAND: "+JSON.stringify(OY_BLOCK_COMMAND_ROLLBACK));
    }
    //TRANSACT--------------------------------

    oy_dive_bounty += OY_AKOYA_ISSUANCE;
    for (let oy_key_public in oy_block[1]) {
        if (typeof(oy_block[4][oy_key_public])==="undefined") oy_block[4][oy_key_public] = 0;
        //if (oy_jump_flag===false&&oy_dive_reward===oy_dive_reward_pool[i]) OY_BLOCK_DIVE_TRACK += oy_dive_share;TODO track self dive earnings
        oy_block[4][oy_key_public] += Math.floor(oy_dive_bounty*(oy_block[1][oy_key_public][0]/oy_block[0][7]));//payout from meshblock maintenance fees and issuance
        oy_block[4][oy_key_public] += oy_block[1][oy_key_public][3];//payout from command transact fees
        if (oy_block[1][oy_key_public][0]>=oy_block[0][8]) oy_block[1][oy_key_public][1] = 1;//TODO disable on full flag?
    }

    let oy_supply_post = 0;
    for (let oy_key_public in oy_block[4]) {
        oy_supply_post += oy_block[4][oy_key_public];
    }
    if (oy_supply_post>oy_supply_pre+OY_AKOYA_ISSUANCE) {//confirms that the supply has not increased more than AKOYA_ISSUANCE
        if (oy_jump_flag===false) oy_block_reset("OY_RESET_AKOYA_OVERFLOW");
        return false;
    }
    if (oy_jump_flag===false&&oy_full_flag===true) OY_DIFF_TRACK[0] = oy_clone_object(oy_block[1]);
    return true;
}

function oy_block_finish() {
    if (OY_LIGHT_STATE===false) {
        OY_WORK_SOLUTIONS = new Array(OY_BLOCK[0][3]);
        OY_WORK_GRADES = new Array(OY_BLOCK[0][3]);
        OY_WORK_BITS = new Array(OY_BLOCK[0][3]);
        OY_WORK_SOLUTIONS.fill(null);
        OY_WORK_GRADES.fill(null);
        OY_WORK_BITS.fill(null);
        for (let i in OY_WORK_BITS) {
            OY_WORK_BITS[i] = oy_hash_gen(OY_SELF_PUBLIC+OY_BLOCK_NEXT+OY_BLOCK_HASH+i).substr(0, OY_WORK_MATCH);
        }
        oy_worker_spawn(0);
        for (let i in OY_WORKER_THREADS[0]) {
            OY_WORKER_THREADS[0][i].postMessage([0, [true, -1, null]]);
        }
    }
    else {
        OY_WORK_SOLUTIONS = [null];
        OY_WORK_BITS = [null];
    }

    for (let oy_command_hash in OY_BLOCK_CONFIRM) {
        OY_BLOCK_CONFIRM[oy_command_hash](typeof(OY_BLOCK[3][oy_command_hash])!=="undefined");
    }
    OY_BLOCK_CONFIRM = {};//TODO reset according to timestamp

    let oy_base_process = false;
    for (let oy_peer_select in OY_PEERS) {
        if (OY_PEERS[oy_peer_select][1]===0) {
            if (OY_PEERS[oy_peer_select][2]===true) oy_node_deny(oy_peer_select, "OY_DENY_BASE_ABUSE");
            else {
                oy_base_process = true;
                break;
            }
        }
    }

    if (OY_JUMP_ASSIGN[0]!==null) {
        if (typeof(OY_PEERS[OY_JUMP_ASSIGN[0]])!=="undefined") oy_log_debug("LEMON: "+JSON.stringify([OY_PEERS[OY_JUMP_ASSIGN[0]][1], OY_PEERS[OY_JUMP_ASSIGN[0]][2]]));
        else oy_log_debug("ORANGE");
    }

    if (oy_base_process===true||OY_LIGHT_STATE===false||(OY_LIGHT_STATE===true&&OY_LIGHT_LEAN===false)) OY_BLOCK_COMPRESS = LZString.compressToUTF16(OY_BLOCK_FLAT);
    else OY_BLOCK_COMPRESS = null;
    OY_BLOCK_FLAT = null;

    if (oy_base_process===true&&OY_BLOCK_COMPRESS!==null) {
        let oy_base_payload = OY_BLOCK_COMPRESS;
        let oy_block_nonce_max = -1;
        let oy_block_split = [];
        for (let i = 0; i < oy_base_payload.length; i+=OY_LIGHT_CHUNK) {
            oy_block_split.push(oy_base_payload.slice(i, i+OY_LIGHT_CHUNK));//split the current block into chunks
            oy_block_nonce_max++;
        }
        oy_base_payload = null;
        let oy_block_juggle = [];
        for (let oy_block_nonce in oy_block_split) {
            oy_block_juggle.push(oy_block_nonce);
        }
        oy_calc_shuffle(oy_block_juggle);

        for (let oy_peer_select in OY_PEERS) {
            if (OY_PEERS[oy_peer_select][1]!==0||OY_PEERS[oy_peer_select][2]===true||oy_peer_select===OY_JUMP_ASSIGN[0]) continue;

            for (let i in oy_block_juggle) {
                oy_data_beam(oy_peer_select, "OY_PEER_BASE", [oy_block_nonce_max, oy_block_juggle[i], oy_block_split[oy_block_juggle[i]]]);
            }
            OY_PEERS[oy_peer_select][2] = true;
        }
    }
    if (OY_BLOCK_RECORD!==null) {
        OY_BLOCK_RECORD_KEEP.push((Date.now()/1000)-OY_BLOCK_RECORD);
        while (OY_BLOCK_RECORD_KEEP.length>OY_BLOCK_RECORD_LIMIT) OY_BLOCK_RECORD_KEEP.shift();
    }
    OY_BLOCK_FINISH = true;
}

/*
    let oy_time_local = Date.now()/1000;
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
     */

//initialize oyster mesh boot up sequence
function oy_init(oy_console) {
    if (typeof(oy_console)==="function") {
        console.log("Oyster console redirected to custom function");
        OY_CONSOLE = oy_console;
    }
    if (OY_INIT===true) {
        oy_log("[ERROR][INIT_DUPLICATE]", true);
        return false;
    }
    OY_INIT = true;
    oy_log("[OYSTER]["+OY_MESH_DYNASTY+"]", true);

    let oy_key_pair = oy_key_gen();
    OY_SELF_PRIVATE = oy_key_pair[0];
    OY_SELF_PUBLIC = oy_key_pair[1];
    OY_SELF_SHORT = oy_short(OY_SELF_PUBLIC);
    OY_PROPOSED = {};
    oy_log("[SELF_ID_"+OY_SELF_SHORT+"]", true);

    /*TODO nodejs DB integration
    //Dexie.delete("oy_db");
    OY_DB = new Dexie("oy_db");
    OY_DB.version(1).stores({
        oy_local:"oy_local_key",
        oy_data:"oy_data_key,oy_data_time",
        oy_channel:"oy_broadcast_hash,oy_channel_id"
    });
    */

    let oy_time_local = Date.now()/1000;
    if (oy_time_local<OY_BLOCK_BOOTTIME) OY_BLOCK_BOOT = null;
    else OY_BLOCK_BOOT = oy_time_local-OY_BLOCK_BOOTTIME<OY_BLOCK_BOOT_BUFFER;

    oy_node_assign();
    oy_block_engine();

    oy_event_dispatch("oy_state_blank");

    if (OY_FULL_INTRO!==false&&OY_FULL_INTRO.indexOf(":")!==-1&&OY_NODE_STATE===true) {
        const fs = require('fs');
        const https = require('https');
        const WebSocketServer = require('ws').Server;

        let privateKey = fs.readFileSync('/etc/letsencrypt/live/domain/privkey.pem', 'utf8');
        let certificate = fs.readFileSync('/etc/letsencrypt/live/domain/fullchain.pem', 'utf8');

        let credentials = {key:privateKey, cert:certificate};

        let httpsServer = https.createServer(credentials);
        httpsServer.listen(parseInt(OY_FULL_INTRO.split(":")[1]));

        let wss = new WebSocketServer({
            server: httpsServer
        });

        wss.on('connection', function(ws) {
            ws.on('message', function(oy_data_raw) {
                console.log('received: %s', oy_data_raw);
                try {
                    if (typeof(OY_INTRO_BAN[ws._socket.remoteAddress])!=="undefined") return false;
                    if (oy_state_current()!==2||OY_INTRO_MARKER===null||OY_BLOCK_RECORD_KEEP.length<=1||typeof(OY_BLOCK[1][OY_SELF_PUBLIC])==="undefined"||OY_BLOCK[1][OY_SELF_PUBLIC][1]===0||OY_BLOCK[1][OY_SELF_PUBLIC][2]<OY_BLOCK[0][15]) {
                        ws.send(JSON.stringify(["OY_INTRO_UNREADY", null]));
                        return false;
                    }
                    let oy_time_offset = (Date.now()/1000)-OY_BLOCK_TIME;
                    let [oy_data_flag, oy_data_payload] = JSON.parse(oy_data_raw);
                    if (oy_data_flag==="OY_INTRO_PRE") {
                        if (oy_time_offset<(OY_BLOCK_SECTORS[0][0]-OY_BLOCK_BUFFER_CLEAR[0])-OY_MESH_BUFFER[0]||oy_time_offset>OY_BLOCK_SECTORS[0][0]+OY_MESH_BUFFER[0]) return false;
                        ws.send(JSON.stringify(["OY_INTRO_TIME", OY_INTRO_MARKER]));
                    }
                    else if (oy_data_flag==="OY_INTRO_GET") {
                        if (OY_BLOCK_FINISH===false) {
                            ws.send(JSON.stringify(["OY_INTRO_UNREADY", null]));
                            return false;
                        }
                        if (oy_data_payload===true&&(oy_time_offset<(OY_INTRO_MARKER/1000)-OY_MESH_BUFFER[0]||oy_time_offset>(OY_INTRO_MARKER/1000)+OY_MESH_BUFFER[0])) return false;
                        if (typeof(OY_INTRO_ALLOCATE[ws._socket.remoteAddress])!=="undefined"||(oy_data_payload!==false&&oy_data_payload!==true)) {
                            OY_INTRO_BAN[ws._socket.remoteAddress] = true;
                            delete OY_INTRO_ALLOCATE[ws._socket.remoteAddress];
                            return false;
                        }
                        if (oy_data_payload===true) OY_INTRO_ALLOCATE[ws._socket.remoteAddress] = 0;
                        let oy_work_queue = new Array(Math.ceil(OY_BLOCK[0][3]/OY_WORK_INTRO));
                        oy_work_queue.fill([null, null]);
                        for (let i in oy_work_queue) {
                            oy_work_queue[i][0] = Math.floor(Math.random()*OY_WORK_BITS.length);
                            oy_work_queue[i][1] = OY_WORK_BITS[oy_work_queue[i][0]];
                        }
                        ws.send(JSON.stringify(["OY_INTRO_WORK", oy_work_queue]));
                    }
                    else if (oy_data_flag==="OY_INTRO_DONE") {
                        if (OY_BLOCK_FINISH===false||oy_data_payload.length!==2||(oy_data_payload[0]!==false&&oy_data_payload[0]!==true)||typeof(oy_data_payload[1])!=="object"||Object.keys(oy_data_payload[1]).length!==Math.ceil(OY_BLOCK[0][3]/OY_WORK_INTRO)) {
                            OY_INTRO_BAN[ws._socket.remoteAddress] = true;
                            return false;
                        }
                        for (let oy_work_nonce in oy_data_payload[1]) {
                            if (typeof(OY_WORK_SOLUTIONS[oy_work_nonce])!=="undefined"&&oy_work_verify_single(OY_BLOCK_TIME, OY_SELF_PUBLIC, OY_BLOCK_HASH, oy_work_nonce, oy_data_payload[1][oy_work_nonce])) {
                                if (OY_WORK_SOLUTIONS[oy_work_nonce]===null||oy_calc_grade(oy_data_payload[1][oy_work_nonce])>OY_WORK_GRADES[oy_work_nonce]) {
                                    OY_WORK_SOLUTIONS[oy_work_nonce] = oy_data_payload[1][oy_work_nonce];
                                    OY_WORK_GRADES[oy_work_nonce] = oy_calc_grade(oy_data_payload[1][oy_work_nonce]);
                                }
                            }
                            else {
                                OY_INTRO_BAN[ws._socket.remoteAddress] = true;
                                return false;
                            }
                        }
                        if (oy_data_payload[0]===true) {
                            if (typeof(OY_INTRO_ALLOCATE[ws._socket.remoteAddress])==="undefined") {
                                OY_INTRO_BAN[ws._socket.remoteAddress] = true;
                                return false;
                            }
                            if (OY_INTRO_PICKUP_COUNT===null) OY_INTRO_PICKUP_COUNT = Math.ceil(OY_OFFER_PICKUP.length/Object.keys(OY_INTRO_ALLOCATE).length);
                            let oy_signal_array = [];
                            for (let oy_counter = 0;oy_counter<OY_INTRO_PICKUP_COUNT&&OY_OFFER_PICKUP.length>0;oy_counter++) {
                                oy_signal_array.push(OY_OFFER_PICKUP.shift()[1]);
                            }
                            if (oy_signal_array.length===0) ws.send(JSON.stringify(["OY_INTRO_UNREADY", null]));
                            else ws.send(JSON.stringify(["OY_INTRO_SIGNAL_A", oy_signal_array]));
                        }
                    }
                    else if (oy_data_flag==="OY_INTRO_SIGNAL_B") {
                        let oy_signal_carry = oy_signal_soak(oy_data_payload);
                        if (OY_BLOCK_FINISH===false||typeof(oy_data_payload)!=="string"||!oy_signal_carry||typeof(OY_OFFER_COLLECT[oy_signal_carry[0]])==="undefined"||typeof(OY_INTRO_ALLOCATE[ws._socket.remoteAddress])==="undefined"||OY_INTRO_ALLOCATE[ws._socket.remoteAddress]>=OY_INTRO_PICKUP_COUNT) {
                            OY_INTRO_BAN[ws._socket.remoteAddress] = true;
                            return false;
                        }
                        OY_INTRO_ALLOCATE[ws._socket.remoteAddress]++;
                        oy_data_route("OY_LOGIC_FOLLOW", "OY_PEER_OFFER_B", [[], OY_OFFER_COLLECT[oy_signal_carry[0]][2], oy_key_sign(OY_SELF_PRIVATE, OY_OFFER_COLLECT[oy_signal_carry[0]][1]+OY_OFFER_COLLECT[oy_signal_carry[0]][3]+oy_data_payload), oy_data_payload]);
                        //TODO do not cool packets from top grade dive ledger
                    }
                }
                catch {}
            });
        });
    }

    /* SIMULATOR BLOCK
    parentPort.once('message', (message) => {
        parentPort.postMessage(message);
    });
    */
}
if (OY_NODE_STATE===true) oy_init();

/*TODO offset to oysterdive.js
let oy_call_detect = document.getElementById("oy.js");
if (!!oy_call_detect) {
    let oy_dive_detect = oy_call_detect.getAttribute("payout");
    if (oy_key_check(oy_dive_detect)) {
        OY_PASSIVE_MODE = true;
        OY_DIVE_PAYOUT = oy_dive_detect;
        oy_init();
        console.log("Oyster is diving for address "+OY_DIVE_PAYOUT);
    }
}
*/