// OYSTER MESH
// Bruno Block
// v0.6
// License: GNU GPLv3

// GLOBAL VARS
const OY_MESH_DYNASTY = "BRUNO_GENESIS_V6";//mesh dynasty definition, changing this will cause a hard-fork
const OY_MESH_BUFFER = [0.2, 200];//seconds and ms buffer a block command's timestamp is allowed to be in the future, this variable exists to deal with slight mis-calibrations between node clocks
let OY_MESH_FLOW = 256000;//characters per second allowed per peer, and for all aggregate non-peer nodes
const OY_MESH_HOP_MAX = 1000;//maximum hops allowed on a transmission passport
const OY_MESH_MEASURE = 10;//seconds by which to measure mesh flow, larger means more tracking of nearby node and peer activity
const OY_MESH_BEAM_SAMPLE = 3;//time/data measurements to determine mesh beam flow required to state a result, too low can lead to volatile and inaccurate readings
let OY_MESH_BEAM_COOL = 2.5;//cool factor for beaming, higher is less beam intensity
let OY_MESH_BEAM_MIN = 0.5;//minimum beam ratio to start returning false
let OY_MESH_SOAK_SAMPLE = 5;//time/data measurements to determine mesh soak flow required to state a result, too low can lead to volatile and inaccurate readings
let OY_MESH_SOAK_BUFFER = 1.2;//multiplication factor for mesh inflow/soak buffer, to give some leeway to compliant peers
const OY_MESH_PUSH_CHANCE = 0.9;//probability that self will forward a data_push when the nonce was not previously stored on self
const OY_MESH_DEPOSIT_CHANCE = 0.5;//probability that self will deposit pushed data
const OY_MESH_FULLFILL_CHANCE = 0.2;//probability that data is stored whilst fulfilling a pull request, this makes data intelligently migrate and recommit overtime
const OY_MESH_SOURCE = 3;//node in route passport (from destination) that is assigned with defining the source variable//TODO remove?
const OY_MESH_SEQUENCE = 8;
let OY_MESH_SCALE = 1000;//core trilemma variable, maximum amount of full nodes. Higher is more scalable and less secure
let OY_MESH_SECURITY = 0.4;//core trilemma variable, amount of rogue full nodes required to successfully attack the mesh, higher is more secure and less scalable
const OY_BLOCK_LOOP = [20, 60];//a lower value means increased accuracy for detecting the start of the next meshblock
const OY_BLOCK_STABILITY_TRIGGER = 3;//mesh range history minimum to trigger reliance on real stability value
const OY_BLOCK_STABILITY_LIMIT = 12;//mesh range history to keep to calculate meshblock stability, time is effectively value x 20 seconds
const OY_BLOCK_EPOCH_MACRO = 40;//360, cadence in blocks to perform epoch processing - 6 hr interval
const OY_BLOCK_EPOCH_MICRO = 4;//10, cadence in blocks to perform jump retention, higher is less memory burden on full nodes, lower is less time to wait for transaction finality - 10 min interval
const OY_BLOCK_SNAPSHOT_KEEP = 120;//how many hashes of previous blocks to keep in the current meshblock, value is for 1 month's worth (6 hrs x 4 = 24 hrs x 30 = 30 days, 4 x 30 = 120)
const OY_BLOCK_HALT_BUFFER = 5;//seconds between permitted block_reset() calls. Higher means less chance duplicate block_reset() instances will clash
const OY_BLOCK_COMMAND_QUOTA = 20000;
const OY_BLOCK_RANGE_KILL = 0.7;
let OY_BLOCK_RANGE_MIN = 100;//100, minimum syncs/dives required to not locally reset the meshblock, higher means side meshes die easier
const OY_BLOCK_BOOT_BUFFER = 600;//seconds grace period to ignore certain cloning/peering rules to bootstrap the network during a boot-up event
const OY_BLOCK_BOOT_SEED = 1597807200;//timestamp to boot the mesh, node remains offline before this timestamp
const OY_BLOCK_SECTORS = [[30, 30000], [50, 50000], [51, 51000], [52, 52000], [58, 58000], [60, 60000]];//timing definitions for the meshblock
let OY_BLOCK_BUFFER_CLEAR = [0.5, 500];
let OY_BLOCK_BUFFER_SPACE = [12, 12000];//lower value means full node is eventually more profitable (makes it harder for edge nodes to dive), higher means better connection stability/reliability for self
const OY_BLOCK_PEER_SPACE = [15, 15000];
let OY_BLOCK_RECORD_LIMIT = 20;
let OY_BLOCK_RECORD_INTRO_BUFFER = 1.4;
let OY_BLOCK_STRICT_CURVE = 5;
//let OY_JUDGE_STRICT = 6;
//let OY_JUDGE_BUFFER_BASE = 1.8;
//let OY_JUDGE_BUFFER_CURVE = 1.2;//allocation for curve
let OY_SYNC_HOP_MAX = 80;
let OY_SYNC_LAST_BUFFER = 2;
let OY_LIGHT_CHUNK = 52000;//chunk size by which the meshblock is split up and sent per light transmission
let OY_LIGHT_COMMIT = 0.4;
let OY_PEER_MAX = [5, 3];//maximum mutual peers - [full node, light node]
let OY_PEER_INFLATE = [7, 5];//cannot be larger than OY_NODE_MAX
let OY_PEER_DEFLATE = [2, 3];
let OY_PEER_INTRO = 3;
let OY_PEER_SELF = 8;
let OY_PEER_BOOT = 50;
let OY_NODE_MAX = 40;
const OY_INTRO_INITIATE = 3;
const OY_INTRO_PRE_MAX = 200;
const OY_INTRO_TRIP = [0.8, 800];
const OY_WORK_MATCH = 4;//lower is more bandwidth/memory bound, higher is more CPU bound
const OY_WORK_MAX = 10000;//10000
const OY_WORK_MIN = 3;
let OY_WORK_DELTA = 0.2;
let OY_WORK_DILUTE = 3;
let OY_WORK_TARGET = 4000;//1440x7/1 week, value in minutes, lower is harsher work that kicks nodes off the mesh more frequently, higher discourages new node operators and hence less decentralization
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
let OY_WORKER_CORES_MIN = 1;
let OY_WORKER_CORES_MAX = 1;
let OY_LATENCY_SIZE = 80;//size of latency ping payload, larger is more accurate yet more taxing
const OY_LATENCY_LENGTH = 8;//length of rand sequence which is repeated for payload and signed for ID verification
const OY_LATENCY_TRACK = 200;//how many latency measurements to keep at a time per peer
let OY_LATENCY_GEO_MIN = 1.2;
let OY_LATENCY_GEO_DIVISOR = 20;//factor for comparing latency with peers, applies to full nodes only, lower means less likely weakest peer will get dropped and mesh is less geo-sensitive
const OY_DATA_MAX = 250000;//max size of data that can be sent to another node
const OY_DATA_CHUNK = 125000;//chunk size by which data is split up and sent per transmission
const OY_DATA_PURGE = 10;//how many handles to delete if indexedDB limit is reached
const OY_DATA_PUSH_INTERVAL = 200;//ms per chunk per push loop iteration
const OY_DATA_PUSH_NONCE_MAX = 16;//maximum amount of nonces to push per push loop iteration
const OY_DATA_PULL_INTERVAL = 800;//ms per pull loop iteration
const OY_DATA_PULL_NONCE_MAX = 3;//maximum amount of nonces to request per pull beam, if too high fulfill will overrun soak limits and cause time/resource waste
const OY_CHRONO_ACCURACY = 10;//ms accuracy for chrono function, lower means more accurate meshblock timing yet more CPU usage
const OY_KEY_BRUNO = "JSJqmlzAxwuINY2FCpWPJYvKIK1AjavBgkIwIm139k4M";//prevent impersonation (custom avatar), achieve AKY coin-lock. This is the testnet wallet, will change for mainnet
const OY_SHORT_LENGTH = 6;//various data value such as nonce IDs, data handles, data values are shortened for efficiency

// PRE-CALCULATED VARS
let OY_BLOCK_BOOT_MARK = oy_block_boot_calc(OY_BLOCK_BOOT_SEED);
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

// INIT
let OY_LIGHT_MODE = false;//seek to stay permanently connected to the mesh as a light node/latch, manipulable by the user
let OY_LIGHT_LEAN = false;
let OY_LIGHT_STATE = true;//immediate status of being a light node/latch, not manipulable by the user
let OY_DIVE_GRADE = false;
let OY_DIVE_PAYOUT = false;
let OY_DIVE_TEAM = false;
let OY_DIVE_STATE = false;
let OY_VERBOSE_MODE = true;
let OY_SIMULATOR_MODE = false;
let OY_SIMULATOR_SKEW = 0;
let OY_SIMULATOR_CALLBACK = {};
let OY_FULL_INTRO = false;//default is false, can be set here or via nodejs argv first parameter
let OY_INTRO_BOOT = "vnode1.oyster.org:8443";
let OY_INTRO_DEFAULT = {
    "vnode1.oyster.org:8443":"dH3QD7c63UcqzFCsLllJT1AXbgq9vBKNknmidKbqA0Ns"
}
let OY_INTRO_PUNISH = {};
let OY_INTRO_BAN = {};
let OY_INTRO_SELECT = null;
let OY_INTRO_SOLUTIONS = {};
let OY_INTRO_MARKER = null;
let OY_INTRO_PRE = {};
let OY_INTRO_ALLOCATE = {};
let OY_INTRO_PASS = {};
let OY_INTRO_SELF = {};
let OY_INTRO_TAG = {};
let OY_PASSIVE_MODE = false;//console output is silenced, and no explicit inputs are expected
let OY_EVENTS = {};
let OY_SELF_PRIVATE = null;//private key of node identity
let OY_SELF_PUBLIC = null;//public key of node identity
let OY_SELF_SHORT = null;//short representation of public key of node identity
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
let OY_PEER_EXCHANGE = {};
let OY_PEER_OFFER = [null, null];
const OY_PEER_BOOT_RESTORE = [OY_PEER_MAX, OY_PEER_INFLATE, OY_PEER_SELF, OY_NODE_MAX];
let OY_NODES = {};//P2P connection handling for individual nodes
let OY_COLD = {};//tracking connection shutdowns to specific nodes
let OY_OFFER_COUNTER = 0;
let OY_OFFER_COLLECT = {};
let OY_OFFER_PICKUP = [];
let OY_OFFER_BROKER = {};
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
let OY_WORK_SOLUTIONS = [null];
let OY_WORK_GRADES = [null];
let OY_WORK_BITS = [null];
let OY_BLOCK_STRICT = [];
let OY_BLOCK_LATENCY = {};
let OY_BLOCK_HASH = null;//hash of the most current block
let OY_BLOCK_METAHASH = null;
let OY_BLOCK_FLAT = null;
let OY_BLOCK_COMPRESS = null;
let OY_BLOCK_DIFF = false;
let OY_BLOCK_SIGN = null;
let OY_BLOCK_TIME = oy_block_time_first();//the most recent block timestamp
let OY_BLOCK_NEXT = OY_BLOCK_TIME+OY_BLOCK_SECTORS[5][0];
let OY_BLOCK_BOOT = false;
let OY_BLOCK_UPTIME = null;
let OY_BLOCK_WEIGHT = null;
let OY_BLOCK_ELAPSED = 0;
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
let OY_DB = null;
let OY_ERROR_BROWSER;

const OY_NODE_STATE = typeof(window)==="undefined";

// DEPENDENCIES
let chalk, os, nacl, keccak256, LZString, NodeEvent, perf, isMainThread, parentPort, websock, SimplePeer, wrtc;

if (OY_NODE_STATE===true) parentPort = require('worker_threads').parentPort;

//OYSTER DEPENDENCY TWEETNACL-JS
//https://github.com/dchest/tweetnacl-js
//VOID

//OYSTER DEPENDENCY JS-SHA3
//https://github.com/emn178/js-sha3
//VOID

//OYSTER DEPENDENCY LZ-STRING
//https://github.com/pieroxy/lz-string
//VOID

//OYSTER DEPENDENCY SIMPLE-PEER
//https://github.com/feross/simple-peer
//VOID

//WEB WORKER BLOCK
function oy_worker_cores() {
    let oy_core_count = -1;
    if (OY_NODE_STATE===true) oy_core_count = os.cpus().length;
    else if (window.navigator.hardwareConcurrency) oy_core_count = window.navigator.hardwareConcurrency;

    return Math.min(OY_WORKER_CORES_MAX, Math.max(OY_WORKER_CORES_MIN, Math.floor(oy_core_count)));
}

function oy_worker_internal(oy_static_data) {
    let oy_static_thru = JSON.parse(decodeURI(oy_static_data));
    const OY_SIMULATOR_MODE = oy_static_thru[0];
    const OY_WORK_MATCH = oy_static_thru[1];
    const OY_NODE_STATE = typeof(window)==="undefined";

    let parentPort, nacl, keccak256;

    if (OY_NODE_STATE===true) {
        parentPort = require('worker_threads').parentPort;
        nacl = require('tweetnacl');
        nacl.util = require('tweetnacl-util');
        keccak256 = require('js-sha3').keccak256;
    }
    else {
        //OYSTER DEPENDENCY TWEETNACL-JS
        //https://github.com/dchest/tweetnacl-js
        //VOID

        //OYSTER DEPENDENCY JS-SHA3
        //https://github.com/emn178/js-sha3
        //VOID
    }

    function oy_hash_gen(oy_input) {//DUPLICATED IN MAIN BLOCK
        return keccak256(oy_input);
    }

    function oy_rand_gen(oy_length) {//DUPLICATED IN MAIN BLOCK
        let oy_rand = Math.round((Math.pow(36, oy_length+1)-Math.random()*Math.pow(36, oy_length))).toString(36).slice(1);
        if (oy_rand.length!==oy_length) return oy_rand_gen(oy_length);
        return oy_rand;
    }

    function oy_calc_avg(oy_array) {//DUPLICATED IN MAIN BLOCK
        if (typeof(oy_array)!=="object") return false;
        let oy_sum = 0;
        for (let i in oy_array) {
            if (!isNaN(oy_array[i])) oy_sum += oy_array[i];
        }
        return oy_sum/oy_array.length;
    }

    function oy_calc_grade(oy_grade_input, oy_grade_entropy) {//DUPLICATED IN MAIN BLOCK
        if (typeof(oy_grade_input)!=="string"||typeof(oy_grade_entropy)!=="string"||oy_grade_entropy.length!==64) return false;

        let oy_grade_null = {"1":1, "2":2, "3":3, "4":4, "5":5, "6":6, "7":7, "8":8, "9":9, "0":10, "a":20, "b":30, "c":40, "d":50, "e":60, "f":70};
        let oy_grade_alpha = ["0", "9", "8", "7", "6", "5", "4", "3", "2", "1"];
        let oy_grade_beta = ["z", "y", "x", "w", "v", "u", "t", "s", "r", "q", "p", "o", "n", "m", "l", "k", "j", "i", "h", "g", "f", "e", "d", "c", "b", "a"];
        let oy_grade_gamma = ["Z", "Y", "X", "W", "V", "U", "T", "S", "R", "Q", "P", "O", "N", "M", "L", "K", "J", "I", "H", "G", "F", "E", "D", "C", "B", "A"];

        let oy_entropy_curve = 0;
        for (let i = 0; i<oy_grade_entropy.length; i++) {
            if (typeof(oy_grade_null[oy_grade_entropy[i]])!=="undefined") oy_entropy_curve += oy_grade_null[oy_grade_entropy[i]];
        }
        oy_entropy_curve /= 1000;
        let oy_entropy_score = [1000, 2000, 3000];
        let oy_grade_points = {};
        let oy_local_points = oy_entropy_score[0];
        for (let i in oy_grade_alpha) {
            oy_grade_points[oy_grade_alpha[i]] = oy_local_points;
            oy_local_points = Math.ceil(oy_local_points/oy_entropy_curve);
        }
        oy_local_points = oy_entropy_score[1];
        for (let i in oy_grade_beta) {
            oy_grade_points[oy_grade_beta[i]] = oy_local_points;
            oy_local_points = Math.ceil(oy_local_points/oy_entropy_curve);
        }
        oy_local_points = oy_entropy_score[2];
        for (let i in oy_grade_gamma) {
            oy_grade_points[oy_grade_gamma[i]] = oy_local_points;
            oy_local_points = Math.ceil(oy_local_points/oy_entropy_curve);
        }
        let oy_grade_score = 0;
        for (let i = 0; i<oy_grade_input.length; i++) {
            if (typeof(oy_grade_points[oy_grade_input[i]])!=="undefined") oy_grade_score += oy_grade_points[oy_grade_input[i]];
        }
        return oy_grade_score;
    }

    function oy_work_dive(oy_work_bit) {
        let oy_work_solution;
        if (OY_SIMULATOR_MODE===true) return oy_rand_gen(OY_WORK_MATCH);

        while (oy_hash_gen(oy_work_bit+(oy_work_solution = oy_rand_gen(OY_WORK_MATCH))).substr(0, OY_WORK_MATCH)!==oy_work_bit.substring(0, OY_WORK_MATCH)) {}
        return oy_work_solution;
    }

    function oy_work_verify(oy_block_time, oy_key_public, oy_block_hash, oy_work_difficulty, oy_work_solutions) {//DUPLICATED IN MAIN BLOCK
        if (oy_work_solutions.length!==oy_work_difficulty) return false;
        if (OY_SIMULATOR_MODE===true) return true;

        for (let oy_work_nonce in oy_work_solutions) {
            if (!oy_work_verify_single(oy_block_time, oy_key_public, oy_block_hash, oy_work_nonce, oy_work_solutions[oy_work_nonce])) return false;
        }
        return true;
    }

    function oy_work_verify_single(oy_block_time, oy_key_public, oy_block_hash, oy_work_nonce, oy_work_solution) {//DUPLICATED IN MAIN BLOCK
        if (typeof(oy_work_solution)!=="string"||oy_work_solution.length!==OY_WORK_MATCH) return false;
        if (OY_SIMULATOR_MODE===true) return true;

        let oy_work_bit = oy_hash_gen(oy_block_time+oy_key_public+oy_block_hash+oy_work_nonce).substr(0, OY_WORK_MATCH);
        return oy_work_bit===oy_hash_gen(oy_work_bit+oy_work_solution).substr(0, OY_WORK_MATCH);
    }

    function oy_block_sync_hop(oy_dive_ledger, oy_passport_passive, oy_passport_crypt, oy_sync_crypt, oy_first) {
        if (oy_passport_passive.length===0) return oy_first!==true;
        let oy_node_select = oy_passport_passive.shift();
        let oy_crypt_select = oy_passport_crypt.shift();
        if (oy_key_verify(oy_node_select, oy_crypt_select, oy_sync_crypt)) {
            if (oy_first===false&&typeof(oy_dive_ledger[oy_node_select])==="undefined") return false;
            return oy_block_sync_hop(oy_dive_ledger, oy_passport_passive, oy_passport_crypt, oy_sync_crypt, false);
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

    function oy_key_verify(oy_key_public, oy_key_signature, oy_key_data, oy_sim_force = false) {//DUPLICATED IN MAIN BLOCK
        if (OY_SIMULATOR_MODE===true&&oy_sim_force===false) return true;
        return nacl.sign.detached.verify(nacl.util.decodeUTF8(oy_key_data), nacl.util.decodeBase64(oy_key_signature), nacl.util.decodeBase64(oy_key_public.substr(1)+"="));
    }

    function oy_worker_respond(oy_data) {
        if (OY_NODE_STATE===true) parentPort.postMessage(oy_data);
        else postMessage(oy_data);
    }

    function oy_worker_receive(oy_data) {
        let [oy_work_type, oy_work_data] = oy_data;

        if (oy_work_type===0) {
            let [oy_work_self, oy_work_nonce, oy_work_bit, oy_block_metahash] = oy_work_data;
            if (oy_work_nonce!==-1&&oy_work_bit.length!==OY_WORK_MATCH) return false;

            if (oy_work_nonce===-1) oy_worker_respond([oy_work_type, [oy_work_self, oy_work_nonce, null, oy_block_metahash]]);
            else {
                let oy_response = [oy_work_type, [oy_work_self, oy_work_nonce, oy_work_dive(oy_work_bit), oy_block_metahash]];
                if (OY_SIMULATOR_MODE===true) {
                    setTimeout(function() {
                        oy_worker_respond(oy_response);
                    }, 500+Math.round(Math.random()*500));
                }
                else oy_worker_respond(oy_response);
            }
        }
        else if (oy_work_type===1) {
            let [oy_data_payload, oy_dive_ledger, oy_block_boot, oy_block_time, oy_block_hash, oy_work_difficulty] = oy_work_data;

            if (OY_SIMULATOR_MODE===true||oy_block_sync_hop(oy_dive_ledger, oy_data_payload[0].slice(), oy_data_payload[1].slice(), oy_data_payload[2], true)||oy_block_boot===true) {
                let oy_work_solutions = JSON.parse(oy_data_payload[6]);
                if (oy_key_verify(oy_data_payload[0][0], oy_data_payload[2], oy_data_payload[3]+oy_data_payload[4]+oy_data_payload[5]+oy_data_payload[6])&&oy_work_verify(oy_block_time, oy_data_payload[0][0], oy_block_hash, oy_work_difficulty, oy_work_solutions)) {
                    let oy_sync_command = oy_block_command_hash(JSON.parse(oy_data_payload[4]));
                    if (oy_sync_command!==false) {
                        let oy_block_metahash = oy_hash_gen(oy_block_hash);
                        let oy_grade_array = [];
                        for (let i in oy_work_solutions) {
                            oy_grade_array.push(oy_calc_grade(oy_work_solutions[i], oy_block_metahash));
                        }
                        if (OY_SIMULATOR_MODE===true) {
                            setTimeout(function() {
                                oy_worker_respond([oy_work_type, [oy_data_payload, oy_sync_command, Math.floor(oy_calc_avg(oy_grade_array))]]);
                            }, 50+Math.round(Math.random()*50));
                        }
                        else oy_worker_respond([oy_work_type, [oy_data_payload, oy_sync_command, Math.floor(oy_calc_avg(oy_grade_array))]]);
                    }
                }
            }
        }
    }
    if (OY_NODE_STATE===true) {
        parentPort.on('message', (oy_data) => {
            oy_worker_receive(oy_data);
        });
    }
    else self.onmessage = function(oy_event) {
        oy_worker_receive(oy_event.data);
    };
}

function oy_worker_manager(oy_instance, oy_data) {
    let [oy_work_type, oy_work_data] = oy_data;

    let oy_time_local = oy_time();
    let oy_time_offset = oy_time_local-OY_BLOCK_TIME;
    if (oy_work_type===0) {
        let [oy_work_self, oy_work_nonce, oy_work_solution, oy_block_metahash] = oy_work_data;

        if (oy_time_offset<OY_BLOCK_SECTORS[0][0]-(OY_BLOCK_BUFFER_CLEAR[0]+OY_MESH_BUFFER[0])) return false;
        if (oy_work_self===true) {
            //oy_log("SOLUTION: "+oy_work_solution+" SOLUTIONS: "+JSON.stringify(OY_WORK_SOLUTIONS)+" BITS: "+JSON.stringify(OY_WORK_BITS)+" GRADES: "+JSON.stringify(OY_WORK_GRADES), 2);
            if (oy_work_nonce!==-1&&(OY_WORK_SOLUTIONS[oy_work_nonce]===null||oy_calc_grade(oy_work_solution, oy_block_metahash)>OY_WORK_GRADES[oy_work_nonce])) {
                OY_WORK_SOLUTIONS[oy_work_nonce] = oy_work_solution;
                OY_WORK_GRADES[oy_work_nonce] = oy_calc_grade(oy_work_solution, oy_block_metahash);
            }

            let oy_nonce_select;
            if (oy_work_nonce===-1) {
                oy_nonce_select = parseInt(oy_instance);
                if (oy_nonce_select>=OY_WORK_BITS.length) oy_nonce_select = Math.floor(Math.random()*OY_WORK_BITS.length);
            }
            else {
                oy_nonce_select = OY_WORK_GRADES.indexOf(null);
                if (oy_nonce_select===-1) {
                    oy_nonce_select = OY_WORK_GRADES.indexOf(true);
                    if (oy_nonce_select===-1&&OY_DIVE_GRADE===true&&oy_time_offset<OY_BLOCK_SECTORS[4][0]) oy_nonce_select = OY_WORK_GRADES.indexOf(Math.min(...OY_WORK_GRADES));
                }
                else OY_WORK_GRADES[oy_nonce_select] = true;
            }
            if (oy_nonce_select!==-1) oy_worker_process(0, oy_instance, [oy_work_self, oy_nonce_select, OY_WORK_BITS[oy_nonce_select], oy_block_metahash, OY_SELF_SHORT, oy_time_offset]);
        }
        else if (typeof(OY_INTRO_SOLUTIONS[oy_work_nonce])!=="undefined") {
            if (OY_INTRO_SOLUTIONS[oy_work_nonce]===null||oy_calc_grade(oy_work_solution, oy_block_metahash)>oy_calc_grade(OY_INTRO_SOLUTIONS[oy_work_nonce], oy_block_metahash)) OY_INTRO_SOLUTIONS[oy_work_nonce] = oy_work_solution;//TODO consider removing useless calc_grade comparison
            if (Object.keys(OY_INTRO_SOLUTIONS).length>0&&Object.values(OY_INTRO_SOLUTIONS).indexOf(null)===-1) {
                oy_intro_beam(OY_INTRO_SELECT, "OY_INTRO_DONE", [true, OY_SELF_PUBLIC, oy_key_sign(OY_SELF_PRIVATE, JSON.stringify(OY_INTRO_SOLUTIONS)), OY_INTRO_SOLUTIONS], oy_intro_process);
                OY_INTRO_SOLUTIONS = {};
            }
        }
    }
    else if (oy_work_type===1) {
        let [oy_data_payload, oy_sync_command, oy_work_grade] = oy_work_data;

        if (oy_state_current()===2&&typeof(OY_BLOCK_SYNC[oy_data_payload[0][0]])!=="undefined"&&OY_BLOCK_SYNC[oy_data_payload[0][0]]!==false&&OY_BLOCK_SYNC[oy_data_payload[0][0]][1]===false&&typeof(OY_BLOCK_SYNC_PASS[OY_BLOCK_TIME])!=="undefined"&&oy_data_payload[3]===OY_BLOCK_TIME&&oy_time_offset<OY_BLOCK_SECTORS[1][0]&&oy_block_command_scan(oy_sync_command, false)) {
            OY_BLOCK_SYNC[oy_data_payload[0][0]] = [oy_data_payload[2], oy_sync_command];
            OY_BLOCK_SYNC_PASS[OY_BLOCK_TIME][oy_data_payload[0][0]] = [JSON.parse(oy_data_payload[5]), JSON.parse(oy_data_payload[6]), 0];
            OY_BLOCK_WORK_GRADE[oy_data_payload[0][0]] = oy_work_grade;

            if (typeof(OY_SYNC_TALLY[oy_data_payload[0][0]])==="undefined") OY_SYNC_TALLY[oy_data_payload[0][0]] = oy_data_payload[0][oy_data_payload[0].length-1];
            if (oy_time_offset>OY_SYNC_LAST[1]) OY_SYNC_LAST[1] = oy_time_offset;
            if (typeof(OY_SYNC_MAP[1][oy_data_payload[0][0]])==="undefined") OY_SYNC_MAP[1][oy_data_payload[0][0]] = [oy_data_payload[0].length, oy_data_payload[0]];

            if (typeof(OY_BLOCK_LATENCY[oy_data_payload[0][0]])==="undefined"&&((typeof(OY_BLOCK[1][oy_data_payload[0][0]])!=="undefined"&&OY_BLOCK[1][oy_data_payload[0][0]][1]===1)||OY_BLOCK_BOOT===true)) OY_BLOCK_LATENCY[oy_data_payload[0][0]] = (oy_time_offset-OY_BLOCK_BUFFER_CLEAR[0])/oy_data_payload[0].length;

            if (typeof(OY_BLOCK[1][OY_SELF_PUBLIC])!=="undefined"||OY_BLOCK_BOOT===true) {
                oy_data_payload[1].push(oy_key_sign(OY_SELF_PRIVATE, oy_data_payload[2]));//TODO offset to worker
                oy_data_route("OY_LOGIC_SYNC", "OY_BLOCK_SYNC", oy_data_payload);
            }

            if (typeof(OY_BLOCK_MAP)==="function") OY_BLOCK_MAP(1);
        }
    }
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

    let oy_worker_define;
    if (OY_NODE_STATE===true) oy_worker_define = "("+oy_worker_internal.toString()+")(\""+encodeURI(JSON.stringify([OY_SIMULATOR_MODE, OY_WORK_MATCH]))+"\")";
    else oy_worker_define = URL.createObjectURL(new Blob(["("+oy_worker_internal.toString()+")(\""+encodeURI(JSON.stringify([OY_SIMULATOR_MODE, OY_WORK_MATCH]))+"\")"], {type: 'text/javascript'}));

    OY_WORKER_THREADS[oy_worker_type] = new Array(oy_worker_cores());
    OY_WORKER_THREADS[oy_worker_type].fill(null);
    OY_WORKER_POINTER[oy_worker_type] = 0;
    for (let i in OY_WORKER_THREADS[oy_worker_type]) {
        if (OY_NODE_STATE===true) {
            OY_WORKER_THREADS[oy_worker_type][i] = new Worker(oy_worker_define, {eval:true});
            OY_WORKER_THREADS[oy_worker_type][i].on('message', (oy_data) => {
                oy_worker_manager(i, oy_data);
            });
        }
        else {
            OY_WORKER_THREADS[oy_worker_type][i] = new Worker(oy_worker_define);
            OY_WORKER_THREADS[oy_worker_type][i].onmessage = function(oy_event) {
                oy_worker_manager(i, oy_event.data);
            };
        }
    }
}

function oy_worker_point(oy_worker_type) {
    OY_WORKER_POINTER[oy_worker_type]++;
    if (OY_WORKER_POINTER[oy_worker_type]>=OY_WORKER_THREADS[oy_worker_type].length) OY_WORKER_POINTER[oy_worker_type] = 0;
    return OY_WORKER_POINTER[oy_worker_type];
}

function oy_worker_process(oy_worker_type, oy_worker_instance, oy_worker_data) {
    if (oy_worker_instance===false) {
        for (let i in OY_WORKER_THREADS[oy_worker_type]) {
            OY_WORKER_THREADS[oy_worker_type][i].postMessage([oy_worker_type, oy_worker_data]);
        }
    }
    else if (oy_worker_instance===null) OY_WORKER_THREADS[oy_worker_type][oy_worker_point(oy_worker_type)].postMessage([oy_worker_type, oy_worker_data]);
    else OY_WORKER_THREADS[oy_worker_type][oy_worker_point(oy_worker_type)].postMessage([oy_worker_type, oy_worker_data]);
}
//WEB WORKER BLOCK

function oy_work_verify(oy_block_time, oy_key_public, oy_block_hash, oy_work_difficulty, oy_work_solutions) {//DUPLICATED IN WEB WORKER BLOCK
    if (oy_work_solutions.length!==oy_work_difficulty) return false;
    if (OY_SIMULATOR_MODE===true) return true;

    for (let oy_work_nonce in oy_work_solutions) {
        if (!oy_work_verify_single(oy_block_time, oy_key_public, oy_block_hash, oy_work_nonce, oy_work_solutions[oy_work_nonce])) return false;
    }
    return true;
}

function oy_work_verify_single(oy_block_time, oy_key_public, oy_block_hash, oy_work_nonce, oy_work_solution) {//DUPLICATED IN WEB WORKER BLOCK
    if (typeof(oy_work_solution)!=="string"||oy_work_solution.length!==OY_WORK_MATCH) return false;
    if (OY_SIMULATOR_MODE===true) return true;

    let oy_work_bit = oy_hash_gen(oy_block_time+oy_key_public+oy_block_hash+oy_work_nonce).substr(0, OY_WORK_MATCH);
    return oy_work_bit===oy_hash_gen(oy_work_bit+oy_work_solution).substr(0, OY_WORK_MATCH);
}

function oy_log(oy_log_msg, oy_log_attn = 0) {
    if (OY_PASSIVE_MODE===true) return true;

    if (OY_NODE_STATE===false&&typeof(oy_log_attn)!=="undefined"&&oy_log_attn===true) oy_log_msg = "<b>"+oy_log_msg+"</b>";
    if (OY_CONSOLE===undefined) {
        if (OY_NODE_STATE===true) {
            let oy_time_offset = (oy_time()-OY_BLOCK_TIME).toFixed(2);
            if (oy_log_attn===0) console.log(chalk.white.bgCyan("["+OY_SELF_SHORT+"]["+chalk.bolder(oy_state_current())+"]["+chalk.bolder(oy_peer_count())+"|"+chalk.bolder(oy_peer_count(true))+"]["+chalk.bolder(oy_time_offset)+"]")+oy_log_msg);
            else if (oy_log_attn===1) console.log(chalk.white.bgCyan("["+OY_SELF_SHORT+"]["+chalk.bolder(oy_state_current())+"]["+chalk.bolder(oy_peer_count())+"|"+chalk.bolder(oy_peer_count(true))+"]["+chalk.bolder(oy_time_offset)+"]")+chalk.hex('#00c9ff')(oy_log_msg));
            else if (oy_log_attn===2) console.log(chalk.white.bgRed("["+OY_SELF_SHORT+"]["+chalk.bolder(oy_state_current())+"]["+chalk.bolder(oy_peer_count())+"|"+chalk.bolder(oy_peer_count(true))+"]["+chalk.bolder(oy_time_offset)+"]")+chalk.white.bgMagenta(oy_log_msg));
            else if (oy_log_attn===3) console.log(chalk.white.bgBlueBright("["+OY_SELF_SHORT+"]["+chalk.bolder(oy_state_current())+"]["+chalk.bolder(oy_peer_count())+"|"+chalk.bolder(oy_peer_count(true))+"]["+chalk.bolder(oy_time_offset)+"]")+chalk.white.bgHex('#007bff')(oy_log_msg));
        }
        else console.log(oy_log_msg);
    }
    else OY_CONSOLE(oy_log_msg);
}

// noinspection JSUnusedGlobalSymbols
function oy_log_debug(oy_log_msg) {
    if (true||OY_SELF_SHORT===null) return false;//TODO restore

    oy_log_msg = "["+OY_SELF_SHORT+"]["+oy_time().toFixed(2)+"] "+oy_log_msg;
    let oy_xhttp = new XMLHttpRequest();
    oy_xhttp.open("POST", "https://top.oyster.org/oy_log_catch", true);
    oy_xhttp.send(JSON.stringify(oy_log_msg));
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

function oy_time() {
    return (Date.now()+OY_SIMULATOR_SKEW)/1000;
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

function oy_calc_median(oy_array) {
    if (typeof(oy_array)!=="object"||oy_array.length===0) return false;

    let oy_array_clone = oy_array.slice();

    oy_array_clone.sort(function(a,b) {
        return a - b;
    });

    let oy_half_point = Math.floor(oy_array_clone.length/2);
    if (oy_half_point.length%2) return oy_array_clone[oy_half_point];

    return (oy_array_clone[oy_half_point-1]+oy_array_clone[oy_half_point])/2;
}

function oy_calc_grade(oy_grade_input, oy_grade_entropy) {//DUPLICATED IN WEB WORKER BLOCK
    if (typeof(oy_grade_input)!=="string"||typeof(oy_grade_entropy)!=="string"||oy_grade_entropy.length!==64) return false;

    let oy_grade_null = {"1":1, "2":2, "3":3, "4":4, "5":5, "6":6, "7":7, "8":8, "9":9, "0":10, "a":20, "b":30, "c":40, "d":50, "e":60, "f":70};
    let oy_grade_alpha = ["0", "9", "8", "7", "6", "5", "4", "3", "2", "1"];
    let oy_grade_beta = ["z", "y", "x", "w", "v", "u", "t", "s", "r", "q", "p", "o", "n", "m", "l", "k", "j", "i", "h", "g", "f", "e", "d", "c", "b", "a"];
    let oy_grade_gamma = ["Z", "Y", "X", "W", "V", "U", "T", "S", "R", "Q", "P", "O", "N", "M", "L", "K", "J", "I", "H", "G", "F", "E", "D", "C", "B", "A"];

    let oy_entropy_curve = 0;
    for (let i = 0; i<oy_grade_entropy.length; i++) {
        if (typeof(oy_grade_null[oy_grade_entropy[i]])!=="undefined") oy_entropy_curve += oy_grade_null[oy_grade_entropy[i]];
    }
    oy_entropy_curve /= 1000;
    let oy_entropy_score = [1000, 2000, 3000];
    let oy_grade_points = {};
    let oy_local_points = oy_entropy_score[0];
    for (let i in oy_grade_alpha) {
        oy_grade_points[oy_grade_alpha[i]] = oy_local_points;
        oy_local_points = Math.ceil(oy_local_points/oy_entropy_curve);
    }
    oy_local_points = oy_entropy_score[1];
    for (let i in oy_grade_beta) {
        oy_grade_points[oy_grade_beta[i]] = oy_local_points;
        oy_local_points = Math.ceil(oy_local_points/oy_entropy_curve);
    }
    oy_local_points = oy_entropy_score[2];
    for (let i in oy_grade_gamma) {
        oy_grade_points[oy_grade_gamma[i]] = oy_local_points;
        oy_local_points = Math.ceil(oy_local_points/oy_entropy_curve);
    }
    let oy_grade_score = 0;
    for (let i = 0; i<oy_grade_input.length; i++) {
        if (typeof(oy_grade_points[oy_grade_input[i]])!=="undefined") oy_grade_score += oy_grade_points[oy_grade_input[i]];
    }
    return oy_grade_score;
}

function oy_rand_gen(oy_length) {//DUPLICATED IN WEB WORKER BLOCK
    let oy_rand = Math.round((Math.pow(36, oy_length+1)-Math.random()*Math.pow(36, oy_length))).toString(36).slice(1);
    if (oy_rand.length!==oy_length) return oy_rand_gen(oy_length);
    return oy_rand;
}

function oy_clone_object(oy_input) {
    return JSON.parse(JSON.stringify(oy_input));
}

function oy_hash_gen(oy_input) {//DUPLICATED IN WEB WORKER BLOCK
    return keccak256(oy_input);
}

function oy_hash_check(oy_input) {
    if (typeof(oy_input)!=="string") return false;
    return (oy_an_check(oy_input)&&oy_input.length===64);
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

function oy_key_sign(oy_key_private, oy_key_data, oy_sim_force = false) {
    if (OY_SIMULATOR_MODE===true&&oy_sim_force===false) return oy_rand_gen(4);
    return nacl.util.encodeBase64(nacl.sign.detached(nacl.util.decodeUTF8(oy_key_data), nacl.util.decodeBase64(oy_key_private)));
}

function oy_key_verify(oy_key_public, oy_key_signature, oy_key_data, oy_sim_force = false) {//DUPLICATED IN WEB WORKER BLOCK
    if (OY_SIMULATOR_MODE===true&&oy_sim_force===false) return true;
    return nacl.sign.detached.verify(nacl.util.decodeUTF8(oy_key_data), nacl.util.decodeBase64(oy_key_signature), nacl.util.decodeBase64(oy_key_public.substr(1)+"="));
}

function oy_key_hash(oy_key_public_raw) {
    let oy_hash_reference = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let oy_hash_index = 0;
    for (let oy_char of oy_key_public_raw) oy_hash_index ^= oy_char.charCodeAt(0);
    while (oy_hash_index>51) oy_hash_index -= 51;
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

function oy_intro_check(oy_intro_select) {
    let oy_intro_split = oy_intro_select.split(":");
    if (typeof(oy_intro_select)!=="string"||oy_intro_select.length>40||oy_intro_select.indexOf(":")===-1||oy_intro_select.indexOf(".")===-1||isNaN(oy_intro_split[1])) return false;

    return oy_an_check(oy_intro_split[0].replace(/./g, ""));
}

function oy_team_check(oy_team_select) {
    if (typeof(oy_team_select)!=="string"||oy_team_select.length>40) return false;

    return oy_an_check(oy_team_select);
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
    else oy_log("[ERROR][DB]["+chalk.bolder(oy_error.name)+"]["+chalk.bolder(oy_error.message)+"]", 2);
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
            oy_log("[LOCAL][UPDATE]["+oy_local_name+"]");
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

    OY_PEERS[oy_peer_id] = oy_clone_object(OY_PEER_TEMPLATE);
    if (OY_JUMP_ASSIGN[0]===oy_peer_id) OY_PEERS[oy_peer_id][0] = OY_BLOCK_NEXT;
    else OY_PEERS[oy_peer_id][0] = OY_BLOCK_TIME;
    OY_PEERS[oy_peer_id][1] = oy_state_flag;
    if (typeof(OY_INTRO_TAG[oy_peer_id])!=="undefined") OY_INTRO_TAG[oy_peer_id] = true;
    if (oy_peer_count()+oy_peer_count(true)===1) oy_event_dispatch("oy_peers_recover");
    oy_log("[START]["+chalk.bolder(oy_short(oy_peer_id))+"]["+chalk.bolder(oy_state_flag)+"]", 3);
    //oy_log_debug("PEER_ADD: "+OY_SELF_SHORT+" - "+oy_short(oy_peer_id)+" - "+OY_PEERS[oy_peer_id][0]+" - "+OY_PEERS[oy_peer_id][1]);
    return true;
}

//updates latency tracking of peer
function oy_peer_latency(oy_peer_id, oy_latency_new) {
    if (typeof(OY_PEERS[oy_peer_id])==="undefined") return false;

    OY_PEERS[oy_peer_id][4].unshift(oy_latency_new);
    if (OY_PEERS[oy_peer_id][4].length>OY_LATENCY_TRACK) OY_PEERS[oy_peer_id][4].pop();
    OY_PEERS[oy_peer_id][3] = (OY_PEERS[oy_peer_id][4].reduce(oy_reduce_sum))/OY_PEERS[oy_peer_id][4].length;
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

function oy_peer_cut() {
    let oy_cut_keep = [];
    for (let oy_peer_select in OY_PEERS) {
        if (OY_PEERS[oy_peer_select][1]===2) oy_cut_keep.push(OY_PEERS[oy_peer_select][9]);
    }
    let oy_cut_local = oy_calc_median(oy_cut_keep);
    if (oy_cut_local===false) oy_cut_local = 1;
    return oy_cut_local;
}

function oy_peer_count(oy_light_mode = false) {
    let oy_return_count = 0;
    if (oy_light_mode===false) {
        for (let oy_peer_select in OY_PEERS) {
            if (OY_PEERS[oy_peer_select][1]===2) oy_return_count++;
        }
    }
    else {
        for (let oy_peer_select in OY_PEERS) {
            if (OY_PEERS[oy_peer_select][1]===1||OY_PEERS[oy_peer_select][1]===0) oy_return_count++;
        }
    }
    return oy_return_count;
}

//process data sequence received from mutual peer oy_peer_id
function oy_peer_process(oy_peer_id, oy_data_flag, oy_data_payload) {
    if (typeof(OY_PEERS[oy_peer_id])==="undefined"||(OY_PEERS[oy_peer_id][1]===0&&oy_data_flag!=="OY_PEER_LATENCY"&&oy_data_flag!=="OY_PEER_LIGHT")) {
        oy_node_deny(oy_peer_id, "OY_DENY_PROCESS_INVALID");
        return false;
    }

    let oy_time_local = oy_time();
    if (oy_data_flag==="OY_BLOCK_COMMAND") {//OY_LOGIC_UPSTREAM
        //oy_data_payload = [oy_passport_passive, oy_command_array, oy_command_crypt]
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
        if (oy_state_current()!==2||oy_data_payload.length!==7||typeof(oy_data_payload[0])!=="object"||typeof(oy_data_payload[1])!=="object"||oy_data_payload[0].length===0||oy_data_payload[0].length>OY_SYNC_HOP_MAX||oy_data_payload[0].length!==oy_data_payload[1].length||!oy_key_check(oy_data_payload[0][0])||oy_data_payload[3]!==OY_BLOCK_TIME) {
            oy_node_deny(oy_peer_id, "OY_DENY_SYNC_INVALID");
            return false;
        }

        if (oy_data_payload[0][0]===OY_SELF_PUBLIC) return true;

        let oy_sync_pass = 0;
        if (typeof(OY_BLOCK_SYNC[oy_data_payload[0][0]])!=="undefined") {
            if (OY_BLOCK_SYNC[oy_data_payload[0][0]]!==false&&OY_BLOCK_SYNC[oy_data_payload[0][0]][0]!==oy_data_payload[2]) {
                oy_sync_pass = 1;
                oy_log("ERROR_BLOCK_SYNC_CORRUPT: "+JSON.stringify([OY_BLOCK_SYNC, oy_data_payload]), 2);
                process.exit();
            }
            else oy_sync_pass = 2;
        }

        let oy_identity_parse = JSON.parse(oy_data_payload[5]);
        if (oy_identity_parse[0]!==false&&!oy_key_check(oy_identity_parse[0])) {
            oy_node_deny(oy_peer_id, "OY_DENY_SYNC_PAYOUT");
            return false;
        }
        if (oy_identity_parse[1]!==false&&!oy_team_check(oy_identity_parse[1])) {
            oy_node_deny(oy_peer_id, "OY_DENY_SYNC_TEAM");
            return false;
        }
        if (oy_identity_parse[2]!==false&&!oy_intro_check(oy_identity_parse[2])) {
            oy_node_deny(oy_peer_id, "OY_DENY_SYNC_INTRO");
            return false;
        }

        let oy_time_offset = oy_time_local-OY_BLOCK_TIME;
        if (OY_LIGHT_STATE===false&&//check that self is running block_sync as a full node
            OY_BLOCK_HASH!==null&&//check that there is a known meshblock hash
            oy_data_payload[3]===OY_BLOCK_TIME&&//check that the current timestamp is in the sync processing zone
            oy_time_offset<OY_BLOCK_SECTORS[1][0]&&//check that the current timestamp is in the sync processing zone
            (typeof(OY_BLOCK_STRICT[oy_data_payload[0].length])==="undefined"||oy_time_offset<OY_BLOCK_STRICT[oy_data_payload[0].length])) {
            if (oy_sync_pass!==2) {
                if (oy_sync_pass===1) {
                    OY_BLOCK_SYNC[oy_data_payload[0][0]] = false;
                    if (typeof(OY_BLOCK[1][OY_SELF_PUBLIC])!=="undefined"||OY_BLOCK_BOOT===true) {
                        oy_data_payload[1].push(oy_key_sign(OY_SELF_PRIVATE, oy_data_payload[2]));//TODO stress AV
                        oy_data_route("OY_LOGIC_SYNC", "OY_BLOCK_SYNC", oy_data_payload);
                    }
                }
                else {
                    OY_BLOCK_SYNC[oy_data_payload[0][0]] = [oy_data_payload[2], false];
                    oy_worker_process(1, null, [oy_data_payload, OY_BLOCK[1], OY_BLOCK_BOOT, OY_BLOCK_TIME, OY_BLOCK_HASH, OY_BLOCK[0][3]]);
                }
            }
        }
        return true;
    }
    else if (oy_data_flag==="OY_INTRO_OFFER_A") {//OY_LOGIC_UPSTREAM+OY_LOGIC_FOLLOW
        //oy_data_payload = [oy_passport_passive, oy_passport_follow, oy_offer_crypt, oy_offer_rand, oy_signal_crypt]
        if (oy_data_payload.length!==5||oy_data_payload[3].length!==OY_MESH_SEQUENCE) {
            oy_node_deny(oy_peer_id, "OY_DENY_OFFER_A_INVALID");
            return false;
        }
        if (OY_PEERS[oy_peer_id][1]===0) {
            oy_node_deny(oy_peer_id, "OY_DENY_OFFER_A_BLANK");
            return false;
        }
        let oy_time_offset = oy_time()-OY_BLOCK_TIME;
        if (OY_BLOCK_HASH===null||oy_time_offset<OY_BLOCK_PEER_SPACE[0]-(OY_BLOCK_BUFFER_CLEAR[0]+OY_MESH_BUFFER[0])||oy_time_offset>OY_BLOCK_SECTORS[0][0]+OY_MESH_BUFFER[0]) return false;

        if (OY_LIGHT_STATE===false&&(OY_BLOCK_BOOT===true||typeof(OY_BLOCK[1][OY_SELF_PUBLIC])!=="undefined")) {
            if (OY_FULL_INTRO!==false&&((OY_BLOCK_BOOT===true&&OY_FULL_INTRO===OY_INTRO_BOOT)||(typeof(OY_BLOCK[1][OY_SELF_PUBLIC])!=="undefined"&&OY_BLOCK[1][OY_SELF_PUBLIC][1]===1))) {
                if (OY_OFFER_COUNTER<OY_INTRO_PRE_MAX&&typeof(OY_OFFER_COLLECT[oy_data_payload[0][0]])==="undefined") {
                    let oy_signal_carry = oy_signal_soak(oy_data_payload[4]);
                    if (!oy_signal_carry||oy_signal_carry[0]!==oy_data_payload[0][0]||typeof(OY_OFFER_COLLECT[oy_signal_carry[0]])!=="undefined"||!oy_key_verify(oy_data_payload[0][0], oy_data_payload[2], OY_BLOCK_HASH+oy_data_payload[3]+oy_data_payload[4])) return false;
                    OY_OFFER_COUNTER++;
                    OY_OFFER_COLLECT[oy_data_payload[0][0]] = [OY_OFFER_COUNTER, oy_data_payload[3], oy_data_payload[0], oy_data_payload[4]];//[[0]:priority_counter/broker_assign, [1]:oy_offer_rand, [2]:passport, [3]:signal_data]
                }
            }
            else {
                if (oy_data_payload[1].length===0) {
                    let oy_intro_select = [null, -1];
                    if (OY_BLOCK_BOOT===true) {
                        if (typeof(OY_SYNC_MAP[1][OY_INTRO_DEFAULT[OY_INTRO_BOOT]])!=="undefined") {
                            let oy_select_pass = true;
                            for (let i in oy_data_payload[0]) {
                                if (OY_SYNC_MAP[1][OY_INTRO_DEFAULT[OY_INTRO_BOOT]][1].indexOf(oy_data_payload[0][i])!==-1) {
                                    oy_select_pass = false;
                                    break;
                                }
                            }
                            if (oy_select_pass===true) oy_intro_select = [OY_SYNC_MAP[1][OY_INTRO_DEFAULT[OY_INTRO_BOOT]][1], OY_SYNC_MAP[1][OY_INTRO_DEFAULT[OY_INTRO_BOOT]][0]];
                        }
                        if (oy_intro_select[0]===null&&typeof(OY_SYNC_MAP[0][OY_INTRO_DEFAULT[OY_INTRO_BOOT]])!=="undefined") {
                            let oy_select_pass = true;
                            for (let i in oy_data_payload[0]) {
                                if (OY_SYNC_MAP[0][OY_INTRO_DEFAULT[OY_INTRO_BOOT]][1].indexOf(oy_data_payload[0][i])!==-1) {
                                    oy_select_pass = false;
                                    break;
                                }
                            }
                            if (oy_select_pass===true) oy_intro_select = [OY_SYNC_MAP[0][OY_INTRO_DEFAULT[OY_INTRO_BOOT]][1], OY_SYNC_MAP[0][OY_INTRO_DEFAULT[OY_INTRO_BOOT]][0]];
                        }
                    }
                    else {
                        for (let oy_key_public in OY_BLOCK[1]) {
                            if (OY_BLOCK[1][oy_key_public][1]===1&&OY_BLOCK[1][oy_key_public][6]!==0) {
                                if (typeof(OY_SYNC_MAP[1][oy_key_public])!=="undefined"&&(OY_SYNC_MAP[1][oy_key_public][0]<oy_intro_select[1]||oy_intro_select[1]===-1)) {
                                    let oy_select_pass = true;
                                    for (let i in oy_data_payload[0]) {
                                        if (OY_SYNC_MAP[1][oy_key_public][1].indexOf(oy_data_payload[0][i])!==-1) {
                                            oy_select_pass = false;
                                            break;
                                        }
                                    }
                                    if (oy_select_pass===true) oy_intro_select = [OY_SYNC_MAP[1][oy_key_public][1], OY_SYNC_MAP[1][oy_key_public][0]];
                                }
                            }
                        }
                        if (oy_intro_select[0]===null) {
                            for (let oy_key_public in OY_BLOCK[1]) {
                                if (OY_BLOCK[1][oy_key_public][1]===1&&OY_BLOCK[1][oy_key_public][6]!==0) {
                                    if (typeof(OY_SYNC_MAP[0][oy_key_public])!=="undefined"&&(OY_SYNC_MAP[0][oy_key_public][0]<oy_intro_select[1]||oy_intro_select[1]===-1)) {
                                        let oy_select_pass = true;
                                        for (let i in oy_data_payload[0]) {
                                            if (OY_SYNC_MAP[0][oy_key_public][1].indexOf(oy_data_payload[0][i])!==-1) {
                                                oy_select_pass = false;
                                                break;
                                            }
                                        }
                                        if (oy_select_pass===true) oy_intro_select = [OY_SYNC_MAP[0][oy_key_public][1], OY_SYNC_MAP[0][oy_key_public][0]];
                                    }
                                }
                            }
                        }
                    }
                    if (oy_intro_select[0]!==null) {
                        oy_data_payload[1] = oy_intro_select[0];
                        oy_data_route("OY_LOGIC_FOLLOW", "OY_INTRO_OFFER_A", oy_data_payload);
                    }
                }
                else oy_data_route("OY_LOGIC_FOLLOW", "OY_INTRO_OFFER_A", oy_data_payload);
            }
        }
        else oy_data_route("OY_LOGIC_UPSTREAM", "OY_INTRO_OFFER_A", oy_data_payload);
    }
    else if (oy_data_flag==="OY_INTRO_OFFER_B") {//OY_LOGIC_FOLLOW
        //oy_data_payload = [oy_passport_passive, oy_passport_follow, oy_offer_crypt, oy_signal_crypt]
        if (oy_data_payload.length!==4) {
            oy_node_deny(oy_peer_id, "OY_DENY_OFFER_B_INVALID");
            return false;
        }

        if (OY_BLOCK_HASH===null||(OY_BLOCK_BOOT===false&&(typeof(OY_BLOCK[1][oy_data_payload[0][0]])==="undefined"||OY_BLOCK[1][oy_data_payload[0][0]][1]===0||OY_BLOCK[1][oy_data_payload[0][0]][2]<OY_BLOCK[0][15]))) return false;

        if (OY_PEERS[oy_peer_id][1]===0) {
            oy_node_deny(oy_peer_id, "OY_DENY_OFFER_B_BLANK");
            return false;
        }

        if (oy_data_payload[1][0]===OY_SELF_PUBLIC) {
            let oy_signal_carry = oy_signal_soak(oy_data_payload[3]);
            if (OY_PEER_OFFER[0]===null||!oy_signal_carry||typeof(OY_NODES[oy_signal_carry[0]])!=="undefined"||!oy_key_verify(oy_data_payload[0][0], oy_data_payload[2], OY_PEER_OFFER[0]+OY_PEER_OFFER[2]+oy_data_payload[3])) return false;
            OY_NODES[oy_signal_carry[0]] = OY_PEER_OFFER[1];
            OY_PEER_OFFER = [null, null, null];
            if (OY_SIMULATOR_MODE===true) parentPort.postMessage([3, oy_signal_carry[0], null]);
            else {
                oy_node_connect(oy_signal_carry[0]);
                OY_NODES[oy_signal_carry[0]].on("connect", function() {
                    oy_node_initiate(oy_signal_carry[0]);
                });
                OY_NODES[oy_signal_carry[0]].signal(oy_signal_carry[1]);
            }
        }
        else oy_data_route("OY_LOGIC_FOLLOW", "OY_INTRO_OFFER_B", oy_data_payload);
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
            if (oy_peer_select!==oy_peer_id&&OY_PEERS[oy_peer_select][11][3]===null&&typeof(oy_data_payload[0][oy_hash_gen(oy_peer_select)])==="undefined") {
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
            function oy_signal_local(oy_signal_data) {
                oy_data_beam(oy_peer_id, "OY_PEER_EXCHANGE_C", oy_signal_beam(oy_signal_data));
            }
            if (OY_SIMULATOR_MODE===true) {
                OY_PEER_EXCHANGE[oy_signal_carry[0]] = true;
                OY_NODES[oy_signal_carry[0]] = true;
                oy_signal_local(oy_rand_gen(4));
            }
            else {
                OY_NODES[oy_signal_carry[0]] = oy_node_boot(false);
                oy_node_connect(oy_signal_carry[0]);
                OY_NODES[oy_signal_carry[0]].on("signal", oy_signal_local);
                OY_NODES[oy_signal_carry[0]].signal(oy_signal_carry[1]);
            }
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
        if (OY_PEERS[oy_peer_id][11][3]!==null&&typeof(OY_PEERS[OY_PEERS[oy_peer_id][11][3]])!=="undefined") oy_data_beam(OY_PEERS[oy_peer_id][11][3], "OY_PEER_EXCHANGE_D", oy_data_payload);
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
        if (typeof(OY_NODES[oy_signal_carry[0]])==="undefined") {
            OY_PEER_EXCHANGE[oy_signal_carry[0]] = true;
            OY_NODES[oy_signal_carry[0]] = OY_PEERS[oy_peer_id][10];
            OY_PEERS[oy_peer_id][10] = null;
            if (OY_SIMULATOR_MODE===true) parentPort.postMessage([3, oy_signal_carry[0], null]);
            else {
                oy_node_connect(oy_signal_carry[0]);
                OY_NODES[oy_signal_carry[0]].on("connect", function() {
                    if (typeof(OY_PEERS[oy_peer_id])!=="undefined") oy_node_initiate(oy_signal_carry[0]);//TODO remove condition?
                });
                OY_NODES[oy_signal_carry[0]].signal(oy_signal_carry[1]);
            }
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
            OY_BLOCK_METAHASH = oy_hash_gen(OY_BLOCK_HASH);
            OY_BLOCK_WEIGHT = new Blob([OY_BLOCK_FLAT]).size;

            if (!oy_block_verify(OY_BLOCK[2][1][OY_BLOCK[2][1].length-1], OY_BLOCK[1])) {
                oy_node_deny(oy_peer_id, "OY_DENY_WORK_INVALID");
                oy_block_reset("OY_RESET_BASE_INVALID");
                return false;
            }

            oy_log("[MESHBLOCK][BASE]["+chalk.bolder(OY_BLOCK_HASH)+"]", 1);
            //oy_log_debug("BASE MESHBLOCK HASH "+OY_BLOCK_HASH);//TODO temp

            OY_LIGHT_STATE = true;
            OY_DIVE_STATE = false;

            if (typeof(OY_BLOCK_MAP)==="function") OY_BLOCK_MAP(0);
            oy_event_dispatch("oy_block_trigger");
            oy_event_dispatch("oy_state_light");

            let oy_time_offset = oy_time()-OY_BLOCK_TIME;
            oy_chrono(function() {
                for (let oy_peer_select in OY_PEERS) {
                    oy_data_beam(oy_peer_select, "OY_PEER_LIGHT", oy_key_sign(OY_SELF_PRIVATE, OY_MESH_DYNASTY+OY_BLOCK_HASH, true));
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
        if (OY_PEERS[oy_peer_id][1]===1&&OY_BLOCK_TIME>OY_PEERS[oy_peer_id][0]) {
            oy_node_deny(oy_peer_id, "OY_DENY_LIGHT_MISALIGN");
            return false;
        }

        if (OY_BLOCK_HASH!==null&&!oy_key_verify(oy_peer_id, oy_data_payload, OY_MESH_DYNASTY+OY_BLOCK_HASH, true)) {
            oy_node_deny(oy_peer_id, "OY_DENY_LIGHT_FAIL");
            return false;
        }

        delete OY_BLOCK_CHALLENGE[oy_peer_id];
        OY_PEERS[oy_peer_id][1] = 1;
        return true;
    }
    else if (oy_data_flag==="OY_PEER_FULL") {//peer as a light node is converting into a full node
        if (OY_PEERS[oy_peer_id][1]===2&&OY_BLOCK_TIME>OY_PEERS[oy_peer_id][0]) {
            oy_node_deny(oy_peer_id, "OY_DENY_FULL_MISALIGN");
            return false;
        }

        if (OY_BLOCK_HASH!==null&&!oy_key_verify(oy_peer_id, oy_data_payload, OY_MESH_DYNASTY+OY_BLOCK_HASH, true)) {
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
        oy_data_payload[1] = oy_key_sign(OY_SELF_PRIVATE, OY_MESH_DYNASTY+((oy_data_payload[0]===0)?"0000000000000000000000000000000000000000":OY_BLOCK_HASH)+oy_data_payload[1], true);
        oy_data_beam(oy_peer_id, "OY_LATENCY_RESPONSE", oy_data_payload);
        return true;
    }
    else if (oy_data_flag==="OY_PEER_TERMINATE") {
        if (oy_peer_id===OY_JUMP_ASSIGN[0]) oy_block_jump_reset();
        oy_log("[END]["+chalk.bolder(oy_short(oy_peer_id))+"]["+chalk.bolder(OY_PEERS[oy_peer_id][1])+"]["+chalk.bolder(oy_data_payload)+"]", 2);
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
            if (oy_stored===true) oy_data_route("OY_LOGIC_FOLLOW", "OY_DATA_DEPOSIT", [[], oy_data_payload[0], OY_SELF_PUBLIC, oy_data_payload[1], oy_data_payload[2]]);
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
        if (oy_data_payload[1][0]===OY_SELF_PUBLIC) {
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
        if (oy_data_payload[1][0]===OY_SELF_PUBLIC) {
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
    else return false;

    return true;
}

//reports peership data to top, leads to seeing mesh big picture, mesh stability development, not required for mesh operation
function oy_peer_report() {
    let oy_report_pass = false;
    let oy_peers_thin = {};
    for (let oy_peer_select in OY_PEERS) {
        oy_report_pass = true;
        oy_peers_thin[oy_hash_gen(oy_peer_select).substr(0, OY_SHORT_LENGTH)] = 0;
    }

    if (oy_report_pass===true) {
        let ws = new websock("wss://top.oyster.org:5050");
        ws.onopen = function() {
            ws.send(JSON.stringify([oy_hash_gen(OY_SELF_PUBLIC).substr(0, OY_SHORT_LENGTH), oy_state_current(), oy_peers_thin]));
        };
        ws.onerror = function() {
            oy_log("[ERROR]["+chalk.bolder("PEER_REPORT_UNKNOWN")+"]", 2);
        };
    }
}

function oy_node_deny(oy_node_id, oy_deny_reason) {
    let oy_node_state = "D";
    if (typeof(OY_PEERS[oy_node_id])!=="undefined") {
        oy_node_state = OY_PEERS[oy_node_id][1];
        delete OY_PEERS[oy_node_id];
        if (oy_peer_count()+oy_peer_count(true)===0) oy_event_dispatch("oy_peers_null");
    }
    if (OY_JUMP_ASSIGN[0]===oy_node_id) {
        oy_log_debug("BLUE["+oy_deny_reason+"]["+JSON.stringify(OY_JUMP_ASSIGN)+"]");
        oy_block_jump_reset();
    }
    if (oy_deny_reason!=="OY_DENY_TERMINATE_RETURN"&&oy_deny_reason!=="OY_DENY_CONNECT_FAIL") {
        oy_data_beam(oy_node_id, "OY_PEER_TERMINATE", oy_deny_reason);
        oy_log("[DENY]["+chalk.bolder(oy_short(oy_node_id))+"]["+chalk.bolder(oy_node_state)+"]["+chalk.bolder(oy_deny_reason)+"]", 2);
    }
    oy_node_reset(oy_node_id);
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

    try {
        OY_NODES[oy_node_id].on("data", function(oy_data_raw) {
            oy_data_soak(oy_node_id, oy_data_raw);
        });
        OY_NODES[oy_node_id].on("error", function(oy_node_error) {
            oy_node_deny(oy_node_id, "OY_DENY_CONNECT_FAIL");
            oy_log("[ERROR]["+chalk.bolder(oy_short(oy_node_id))+"]["+chalk.bolder("OY_ERROR_CONNECT_FAIL")+"]["+chalk.bolder(oy_node_error)+"]", 2);
        });
        OY_NODES[oy_node_id].on("close", function() {
            delete OY_NODES[oy_node_id];
            delete OY_COLD[oy_node_id];
        });
    }
    catch(e) {
        console.log(e);
    }
    return true;
}

function oy_node_disconnect(oy_node_id) {
    if (typeof(OY_NODES[oy_node_id])!=="undefined") {
        try {
            if (OY_SIMULATOR_MODE===true) {
                oy_node_reset(oy_node_id);
                delete OY_NODES[oy_node_id];
            }
            else {
                oy_node_reset(oy_node_id);
                OY_COLD[oy_node_id] = true;
                OY_NODES[oy_node_id].destroy();
            }
            if (OY_VERBOSE_MODE===true) oy_log("[DISCONNECT]["+chalk.bolder(oy_node_id)+"]");
            return true;
        }
        catch(e) {
            console.log(e);
        }
    }
    return false;
}

//where the aggregate connectivity of the entire mesh begins
function oy_node_initiate(oy_node_id) {
    //let oy_time_local = oy_time();

    //(oy_state_current()!==0&&OY_JUMP_ASSIGN[0]!==oy_node_id&&oy_time_local-OY_BLOCK_TIME>OY_BLOCK_SECTORS[0][0])//TODO restore jump restriction whilst being compatible with new peering system
    let oy_intro_default = Object.values(OY_INTRO_DEFAULT);
    if (typeof(OY_PEERS[oy_node_id])!=="undefined"||typeof(OY_PROPOSED[oy_node_id])!=="undefined"||typeof(OY_PEERS_PRE[oy_node_id])!=="undefined"||typeof(OY_LATENCY[oy_node_id])!=="undefined"||(Object.keys(OY_NODES).length>=OY_NODE_MAX&&OY_JUMP_ASSIGN[0]!==oy_node_id&&oy_intro_default.indexOf(oy_node_id)===-1)||oy_node_id===OY_SELF_PUBLIC||OY_BLOCK_BOOT===null||(OY_LIGHT_MODE===true&&OY_BLOCK_BOOT===true)) return false;
    OY_PROPOSED[oy_node_id] = true;
    oy_data_beam(oy_node_id, "OY_PEER_REQUEST", oy_state_current(true));
    return true;
}

function oy_node_boot(oy_boot_init) {
    let oy_boot_obj = {initiator:oy_boot_init, trickle:false};
    if (OY_NODE_STATE===true) oy_boot_obj.wrtc = wrtc;
    return new SimplePeer(oy_boot_obj);
}

//respond to a node that is not mutually peered with self
function oy_node_negotiate(oy_node_id, oy_data_flag, oy_data_payload) {
    let oy_time_local = oy_time();

    if (oy_data_flag==="OY_PEER_ACCEPT") {
        //oy_log_debug("BERRY: "+JSON.stringify([typeof(OY_PROPOSED[oy_node_id])!=="undefined", OY_JUMP_ASSIGN[0]===oy_node_id, oy_node_id, OY_JUMP_ASSIGN]));
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
                oy_data_payload[1] = oy_key_sign(OY_SELF_PRIVATE, OY_MESH_DYNASTY+((oy_data_payload[0]===0)?"0000000000000000000000000000000000000000":OY_BLOCK_HASH)+oy_data_payload[1], true);
                oy_data_beam(oy_node_id, "OY_LATENCY_RESPONSE", oy_data_payload);
            }
        }
        else oy_data_beam(oy_node_id, "OY_LATENCY_DECLINE", null);
    }
    else if (oy_data_flag==="OY_PEER_REQUEST") {
        //TODO timing validation
        //if (oy_node_id===OY_JUMP_ASSIGN[0]) oy_log_debug("JUMP_DEBUG_REQUEST: "+JSON.stringify([(oy_data_payload===2&&oy_peer_count()>OY_PEER_INFLATE[0]), (oy_data_payload!==2&&oy_peer_count(true)>OY_PEER_INFLATE[1]), (oy_state_current()===0&&oy_data_payload===0), OY_BLOCK_BOOT===null, (OY_BLOCK_BOOT===true&&oy_data_payload!==2), oy_data_payload]));
        //(OY_JUMP_ASSIGN[0]!==oy_node_id&&oy_time_local-OY_BLOCK_TIME>OY_BLOCK_SECTORS[0][0])//TODO restore jump restriction with compatibility for new peering system
        if ((oy_data_payload===2&&oy_peer_count()>=OY_PEER_INFLATE[0])||
            ((oy_data_payload===0||oy_data_payload===1)&&(OY_BLOCK_BOOT===true||oy_peer_count(true)>=OY_PEER_INFLATE[1]))||
            (oy_state_current()===0&&oy_data_payload===0)||
            OY_BLOCK_BOOT===null) oy_data_beam(oy_node_id, "OY_PEER_UNREADY", "OY_DENY_PEER_UNREADY");
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
            oy_data_beam(oy_node_id, "OY_JUMP_UNREADY", "OY_DENY_JUMP_UNREADY_A");//TODO add node_disconnect?
        }
    }
    else if (oy_data_flag==="OY_JUMP_RESPONSE") {
        oy_log_debug("JUMP_DEBUG_E: "+oy_node_id+" "+JSON.stringify([OY_JUMP_ASSIGN[0]===null, typeof(OY_JUMP_PRE[oy_node_id])!=="undefined", OY_JUMP_PRE[oy_node_id]===false, oy_state_current(), Object.keys(OY_BLOCK_JUMP_MAP).length, oy_time_local-OY_BLOCK_TIME>OY_BLOCK_SECTORS[3][0]-OY_MESH_BUFFER[0], oy_time_local-OY_BLOCK_TIME<OY_BLOCK_SECTORS[4][0]+OY_MESH_BUFFER[0]]));
        if (OY_JUMP_ASSIGN[0]===null&&typeof(OY_JUMP_PRE[oy_node_id])!=="undefined"&&OY_JUMP_PRE[oy_node_id]===false&&oy_state_current()===2&&Object.keys(OY_BLOCK_JUMP_MAP).length>1&&oy_time_local-OY_BLOCK_TIME>OY_BLOCK_SECTORS[3][0]-OY_MESH_BUFFER[0]&&oy_time_local-OY_BLOCK_TIME<OY_BLOCK_SECTORS[4][0]+OY_MESH_BUFFER[0]) {
            oy_log_debug("JUMP_DEBUG_F: "+oy_node_id);
            OY_JUMP_PRE[oy_node_id] = true;
            if (JSON.stringify(OY_BLOCK[2][1])===JSON.stringify(oy_data_payload[2])) {
                oy_data_beam(oy_node_id, "OY_JUMP_REJECT", "OY_DENY_JUMP_REJECT_A");
                oy_log_debug("JUMP_DEBUG_Z: "+oy_node_id);
                return false;
            }
            if (oy_data_payload[0]<=OY_BLOCK[0][10]) {
                oy_log_debug("JUMP_DEBUG_H: "+oy_node_id);
                if (oy_data_payload[0]===OY_BLOCK[0][10]&&oy_data_payload[1]===Object.keys(OY_BLOCK[3]).length) oy_data_beam(oy_node_id, "OY_JUMP_REJECT", "OY_DENY_JUMP_REJECT_B");
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
                oy_data_beam(oy_node_id, "OY_JUMP_REJECT", "OY_DENY_JUMP_REJECT_C");
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
            oy_data_beam(oy_node_id, "OY_JUMP_UNREADY", "OY_DENY_JUMP_UNREADY_B");
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
            let oy_jump_payload = JSON.stringify([OY_BLOCK_METAHASH, oy_block_sync_pass, oy_block_command_rollback]);
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
            oy_data_beam(oy_node_id, "OY_JUMP_UNREADY", "OY_DENY_JUMP_UNREADY_C");
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

                let oy_time_offset = oy_time()-OY_BLOCK_TIME;
                if (oy_time_offset<OY_BLOCK_SECTORS[3][0]||oy_time_offset>OY_BLOCK_SECTORS[4][0]) {
                    oy_node_deny(oy_node_id, "OY_DENY_JUMP_TIMEOUT");
                    return false;
                }
                if (typeof(oy_block_sync_pass[OY_BLOCK_TIME_JUMP])==="undefined") {
                    oy_log_debug("REDJUMP1: "+JSON.stringify([OY_JUMP_ASSIGN[1], OY_BLOCK_TIME_JUMP, OY_BLOCK_TIME, oy_block_sync_pass]));
                    oy_node_deny(oy_node_id, "OY_DENY_JUMP_FAIL_E");
                    return false;
                }
                if (typeof(oy_block_command_rollback[OY_BLOCK_TIME_JUMP])==="undefined") {
                    oy_log_debug("REDJUMP2: "+JSON.stringify([OY_JUMP_ASSIGN[1], OY_BLOCK_TIME_JUMP, OY_BLOCK_TIME, oy_block_command_rollback]));
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
                    let oy_block_metahash = oy_hash_gen(OY_BLOCK_HASH_JUMP);
                    let oy_grade_array = [];
                    for (let i in oy_block_sync_pass[OY_BLOCK_TIME_JUMP][oy_key_public][1]) {
                        oy_grade_array.push(oy_calc_grade(oy_block_sync_pass[OY_BLOCK_TIME_JUMP][oy_key_public][1][i], oy_block_metahash));
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

            let oy_time_offset = oy_time()-OY_BLOCK_TIME;
            if (oy_hash_gen(OY_BLOCK_HASH_JUMP)===oy_hash_hash&&JSON.stringify(OY_BLOCK[2][1])!==JSON.stringify(OY_BLOCK_JUMP[2][1])&&oy_time_offset>OY_BLOCK_SECTORS[3][0]-OY_MESH_BUFFER[0]&&oy_time_offset<OY_BLOCK_SECTORS[4][0]+OY_MESH_BUFFER[0]) {
                //oy_worker_halt(0);

                OY_BLOCK_FLAT = OY_BLOCK_FLAT_JUMP;
                OY_BLOCK = JSON.parse(OY_BLOCK_FLAT);
                OY_BLOCK_HASH = oy_clone_object(OY_BLOCK_HASH_JUMP);
                OY_BLOCK_METAHASH = oy_hash_gen(OY_BLOCK_HASH);
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
        oy_log("[END]["+chalk.bolder(oy_short(oy_node_id))+"]["+chalk.bolder("N")+"]["+chalk.bolder(oy_data_payload)+"]", 2);
    }
    else oy_node_deny(oy_node_id, "OY_DENY_DATA_INCOHERENT");
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
    if (oy_data_beam(oy_node_id, "OY_PEER_LATENCY", [OY_LATENCY[oy_node_id][3], OY_LATENCY[oy_node_id][0], OY_LATENCY[oy_node_id][0].repeat(OY_LATENCY_SIZE)])) OY_LATENCY[oy_node_id][1] = oy_time();
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
    let oy_time_local = oy_time();
    if (!oy_key_verify(oy_node_id, oy_data_payload[1], OY_MESH_DYNASTY+((OY_LATENCY[oy_node_id][3]===0)?"0000000000000000000000000000000000000000":OY_BLOCK_HASH)+OY_LATENCY[oy_node_id][0], true)) {
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
            //if (OY_JUMP_ASSIGN[0]===oy_node_id) oy_log_debug("JUMP_DEBUG_LATENCY_A: "+OY_LATENCY[oy_node_id][2]+" - "+oy_node_id);
            let oy_intro_default = Object.values(OY_INTRO_DEFAULT);
            if ((OY_LATENCY[oy_node_id][3]===2&&oy_peer_count()<((typeof(OY_PEER_EXCHANGE[oy_node_id])!=="undefined")?OY_PEER_MAX[0]:OY_PEER_INFLATE[0]))||((OY_LATENCY[oy_node_id][3]===0||OY_LATENCY[oy_node_id][3]===1)&&oy_peer_count(true)<((typeof(OY_PEER_EXCHANGE[oy_node_id])!=="undefined")?OY_PEER_MAX[1]:OY_PEER_INFLATE[1]))||OY_JUMP_ASSIGN[0]===oy_node_id||oy_intro_default.indexOf(oy_node_id)!==-1) {//TODO test system without jump bypass once jumping works
                if (OY_JUMP_ASSIGN[0]===oy_node_id) oy_log_debug("JUMP_DEBUG_LATENCY_B: "+OY_LATENCY[oy_node_id][2]+" - "+oy_node_id);//TODO update jumpy map upon JUMP_DROP to lock out old peers - might need delay for 2+ splits
                oy_accept_response();
            }
            else {
                if (OY_JUMP_ASSIGN[0]===oy_node_id) oy_log_debug("JUMP_DEBUG_LATENCY_C: "+OY_LATENCY[oy_node_id][2]+" "+oy_node_id);
                let oy_cut_local = oy_peer_cut();
                let oy_peer_weak = [null, -1];
                for (let oy_peer_select in OY_PEERS) {
                    if (OY_PEERS[oy_peer_select][3]>oy_peer_weak[1]&&
                        OY_PEERS[oy_peer_select][0]<OY_BLOCK_TIME&&
                        OY_PEERS[oy_peer_select][9]<=oy_cut_local&&
                        oy_intro_default.indexOf(oy_peer_select)===-1&&
                        (oy_state_current()!==2||OY_LATENCY[oy_node_id][4]===2||OY_PEERS[oy_peer_select][1]!==2||typeof(OY_BLOCK[1][oy_peer_select])==="undefined")||OY_JUMP_ASSIGN[0]===oy_node_id) oy_peer_weak = [oy_peer_select, OY_PEERS[oy_peer_select][3]];
                }
                oy_log("GEO: "+Math.max(OY_LATENCY_GEO_MIN, ((OY_SYNC_LAST[0]===0)?0:OY_LATENCY_GEO_DIVISOR/OY_SYNC_LAST[0])));
                if (oy_peer_weak[0]!==null&&oy_latency_result*Math.max(OY_LATENCY_GEO_MIN, ((OY_SYNC_LAST[0]===0)?0:OY_LATENCY_GEO_DIVISOR/OY_SYNC_LAST[0]))<oy_peer_weak[1]) {
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

function oy_state_current(oy_seek_mode = false) {
    if (OY_BLOCK_HASH!==null) {
        if (OY_LIGHT_STATE===false||(oy_seek_mode===true&&OY_LIGHT_MODE===false)) return 2;//full node
        return 1;//light node
    }
    return 0;//blank node
}

//measures data flow on the mesh in either beam or soak direction
//returns false on mesh flow violation/cooling state and true on compliance
function oy_data_measure(oy_data_beam, oy_node_id, oy_data_length) {
    if (typeof(OY_PEERS[oy_node_id])==="undefined") return false;

    let oy_time_local = oy_time();
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
            if (oy_data_handle.substr(6, 64)===oy_hash_gen(oy_data_construct)) {
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
    //if (oy_data_payload[0].indexOf(OY_SELF_PUBLIC)!==-1) return false;
    if (typeof(oy_push_define)!=="undefined") {//TODO verify
        if (typeof(OY_DATA_PUSH[oy_data_payload[1]])==="undefined"||OY_DATA_PUSH[oy_data_payload[1]]===false||typeof(OY_PUSH_HOLD[oy_data_payload[1]])==="undefined") return true;
        oy_data_payload[3] = LZString.compressToUTF16(OY_PUSH_HOLD[oy_data_payload[1]].slice(oy_push_define[0], oy_push_define[1]));
    }
    if (oy_data_logic==="OY_LOGIC_SYNC") {
        //oy_data_payload[0] is oy_passport_passive
        //oy_data_payload[1] is oy_passport_crypt
        if (OY_BLOCK_HASH===null||oy_data_payload[0].length>=OY_SYNC_HOP_MAX) return false;

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
        //oy_data_payload[1] is oy_passport_active
        if (oy_data_payload[1].length===0) return false;

        let oy_peer_final = false;
        let oy_active_build = [];
        for (let i in oy_data_payload[1]) {
            oy_active_build.push(oy_data_payload[1][i]);
            if (typeof(OY_PEERS[oy_data_payload[1][i]])!=="undefined") {
                oy_peer_final = oy_data_payload[1][i];
                break;
            }
        }

        if (oy_peer_final===false) return false;

        oy_data_payload[1] = oy_active_build.slice();
        oy_data_payload[0].push(OY_SELF_PUBLIC);
        oy_data_beam(oy_peer_final, oy_data_flag, oy_data_payload);
    }
    else if (oy_data_logic==="OY_LOGIC_UPSTREAM") {
        //oy_data_payload[0] is oy_passport_passive
        if (OY_LIGHT_STATE===false&&typeof(OY_BLOCK[1][OY_SELF_PUBLIC])!=="undefined"&&oy_data_payload[0].length>0) return false;

        oy_data_payload[0].push(OY_SELF_PUBLIC);
        if (oy_data_payload[0].length===1) {
            for (let oy_peer_select in OY_PEERS) {
                if (OY_PEERS[oy_peer_select][1]!==0) oy_data_beam(oy_peer_select, oy_data_flag, oy_data_payload);
            }
        }
        else {
            let oy_peer_upstream = [null, -1];
            for (let oy_peer_select in OY_PEERS) {
                if (OY_PEERS[oy_peer_select][9]>oy_peer_upstream[1]&&OY_PEERS[oy_peer_select][1]!==0&&oy_data_payload[0].indexOf(oy_peer_select)===-1) oy_peer_upstream[0] = oy_peer_select;
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
    if (typeof(OY_NODES[oy_node_id])==="undefined") {
        oy_log("[ERROR]["+chalk.bolder(oy_short(oy_node_id))+"]["+chalk.bolder("OY_ERROR_BEAM_NODE_EMPTY")+"]["+chalk.bolder(oy_data_flag)+"]", 2);
        return false;
    }

    try {
        let oy_data_raw = JSON.stringify([oy_data_flag, oy_data_payload]);//convert data array to JSON
        let oy_data_direct_bool = oy_data_direct(oy_data_flag);
        if (oy_data_direct_bool===false) {
            if (oy_data_payload[0].length>OY_MESH_HOP_MAX) {
                oy_log("[ERROR]["+chalk.bolder(oy_data_flag)+"]["+chalk.bolder("OY_ERROR_HOP_MAX")+"]", 2);
                return false;
            }
            if (oy_data_payload[0].indexOf(oy_node_id)!==-1) {
                oy_log("[ERROR]["+chalk.bolder(oy_data_flag)+"]["+chalk.bolder("OY_ERROR_HOP_ALREADY")+"]", 2);
                return false;
            }
        }
        oy_data_payload = null;
        if (oy_data_raw.length>OY_DATA_MAX) {
            oy_log("[ERROR]["+chalk.bolder(oy_data_flag)+"]["+chalk.bolder("OY_ERROR_DATA_MAX")+"]", 2);
            return false;
        }
        if (oy_data_flag!=="OY_BLOCK_SYNC"&&oy_data_direct_bool===false&&typeof(OY_PEERS[oy_node_id])!=="undefined"&&!oy_data_measure(true, oy_node_id, oy_data_raw.length)) {
            oy_log("[COOL]["+chalk.bolder(oy_short(oy_node_id))+"]["+chalk.bolder(oy_data_flag)+"]");
            return true;
        }
        if (OY_SIMULATOR_MODE===true) parentPort.postMessage([0, oy_node_id, oy_data_raw]);
        else OY_NODES[oy_node_id].send(oy_data_raw);//send the JSON-converted data array to the destination node
        if (OY_VERBOSE_MODE===true&&oy_data_flag!=="OY_BLOCK_SYNC") oy_log("[BEAM]["+chalk.bolder((oy_time()-OY_BLOCK_TIME).toFixed(2))+"]["+chalk.bolder(oy_short(oy_node_id))+"]["+chalk.bolder(oy_data_flag)+"]");
        return true;
    }
    catch(e) {
        console.log(e);
    }
    oy_log("[ERROR]["+chalk.bolder(oy_data_flag)+"]["+chalk.bolder("OY_ERROR_BEAM_UNKNOWN")+"]", 2);
    return false;
}

//incoming data validation
function oy_data_soak(oy_node_id, oy_data_raw) {
   try {
       if (typeof(OY_NODES[oy_node_id])==="undefined") {
           oy_log("[ERROR]["+chalk.bolder(oy_short(oy_node_id))+"]["+chalk.bolder("OY_ERROR_SOAK_NODE_EMPTY")+"]["+chalk.bolder(JSON.parse(oy_data_raw)[0])+"]", 2);
           return false;
       }
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
           if (OY_VERBOSE_MODE===true&&oy_data[0]!=="OY_BLOCK_SYNC") oy_log("[SOAK]["+(oy_time()-OY_BLOCK_TIME).toFixed(2)+"]["+oy_short(oy_node_id)+"]["+oy_data[0]+"]");
           if (!oy_data_direct(oy_data[0])) {
               if (typeof(oy_data[1][0])!=="object") {
                   oy_node_deny(oy_node_id, "OY_DENY_PASSPORT_INVALID");
                   return false;
               }
               if (oy_data[1][0].length===0) {
                   oy_node_deny(oy_node_id, "OY_DENY_PASSPORT_EMPTY");
                   return false;
               }
               if (oy_data[1][0][oy_data[1][0].length-1]!==oy_node_id) {
                   oy_node_deny(oy_data[1][0][oy_data[1][0].length-1], "OY_DENY_PASSPORT_MISMATCH");
                   return false;
               }
               if (oy_data[1][0].indexOf(OY_SELF_PUBLIC)!==-1) {
                   oy_node_deny(oy_node_id, "OY_DENY_PASSPORT_ALREADY");
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
               }
           }
           if (oy_data[0]==="OY_LATENCY_RESPONSE") oy_latency_response(oy_node_id, oy_data[1]);
           else if (typeof(OY_PEERS[oy_node_id])!=="undefined") oy_peer_process(oy_node_id, oy_data[0], oy_data[1]);
           else oy_node_negotiate(oy_node_id, oy_data[0], oy_data[1]);
           return true;
       }
   }
   catch(e) {
       console.log(e);
   }
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

function oy_intro_beam(oy_intro_select, oy_data_flag, oy_data_payload, oy_callback = null) {
    if (oy_intro_select===OY_FULL_INTRO) return false;

    try {
        if (OY_VERBOSE_MODE===true) oy_log("[INTRO][BEAM]["+chalk.bolder(oy_data_flag)+"]["+chalk.bolder(oy_intro_select)+"]");
        if (OY_SIMULATOR_MODE===true) {
            let oy_sim_ref = oy_rand_gen(3);
            OY_SIMULATOR_CALLBACK[oy_sim_ref] = [oy_data_flag, oy_intro_select, oy_callback];
            parentPort.postMessage([1, oy_intro_select, JSON.stringify([oy_data_flag, oy_data_payload]), [oy_intro_select, oy_sim_ref]]);
        }
        else {
            let ws = new websock("wss://"+oy_intro_select);
            let oy_response = null;
            ws.onopen = function() {
                oy_response = false;
                ws.send(JSON.stringify([oy_data_flag, oy_data_payload]));
            };
            ws.onmessage = function(oy_event) {
                oy_response = true;
                ws.close();
                try {
                    let [oy_data_flag_sub, oy_data_payload_sub] = JSON.parse(oy_event.data);
                    if (oy_data_flag_sub==="OY_INTRO_UNREADY") {
                        if (OY_BLOCK_BOOT===false&&oy_data_flag!=="OY_INTRO_TIME") oy_intro_punish(oy_intro_select);
                    }
                    else if (oy_callback!==null) oy_callback(oy_data_flag_sub, oy_data_payload_sub);
                }
                catch(e) {
                    console.log(e);
                }
            };
            ws.onerror = function() {
                oy_log("[ERROR]["+chalk.bolder("INTRO_BEAM_UNKNOWN")+"]", 2);
            };
            oy_chrono(function() {
                if (oy_response===null||oy_response===false) {
                    if (oy_response===false) ws.close();
                    oy_intro_punish(oy_intro_select);
                }
            }, OY_INTRO_TRIP[1]);
        }
    }
    catch(e) {
        console.log(e);
    }
    return true;
}

function oy_intro_soak(oy_soak_node, oy_soak_data) {
    try {
        let oy_time_offset = oy_time()-OY_BLOCK_TIME;
        let [oy_data_flag, oy_data_payload] = JSON.parse(oy_soak_data);

        if (OY_VERBOSE_MODE===true&&oy_data_flag!=="OY_INTRO_PRE") oy_log("[INTRO][SOAK]["+chalk.bolder(oy_data_flag)+"]["+chalk.bolder(oy_soak_node)+"]");

        if (oy_data_flag==="OY_INTRO_PRE"&&oy_data_payload!==null&&typeof(oy_data_payload)==="object"&&typeof(OY_INTRO_DEFAULT[oy_data_payload[0]])!=="undefined"&&oy_key_verify(OY_INTRO_DEFAULT[oy_data_payload[0]], oy_data_payload[1], OY_BLOCK_TIME.toString())) OY_INTRO_PASS[oy_soak_node] = OY_INTRO_DEFAULT[oy_data_payload[0]];
        else if (typeof(OY_INTRO_PASS[oy_soak_node])==="undefined") {
            //if (typeof(OY_INTRO_BAN[oy_soak_node])!=="undefined") return false;
            if (oy_state_current()!==2||OY_INTRO_MARKER===null||OY_BLOCK_RECORD_KEEP.length<=1||(typeof(OY_INTRO_ALLOCATE[oy_soak_node])==="undefined"&&Object.keys(OY_INTRO_ALLOCATE).length>=OY_OFFER_PICKUP.length+OY_PEER_SELF)||(OY_BLOCK_BOOT===false&&(typeof(OY_BLOCK[1][OY_SELF_PUBLIC])==="undefined"||OY_BLOCK[1][OY_SELF_PUBLIC][1]===0||OY_BLOCK[1][OY_SELF_PUBLIC][2]<OY_BLOCK[0][15]))) return JSON.stringify(["OY_INTRO_UNREADY", 1]);
        }

        if (oy_data_flag==="OY_INTRO_PRE") {
            if ((typeof(OY_INTRO_PASS[oy_soak_node])==="undefined")&&(oy_time_offset<OY_BLOCK_SECTORS[0][0]-(OY_BLOCK_BUFFER_CLEAR[0]+OY_MESH_BUFFER[0])||oy_time_offset>OY_BLOCK_SECTORS[0][0]+OY_INTRO_TRIP[0]+OY_MESH_BUFFER[0]||(typeof(OY_INTRO_PRE[oy_soak_node])==="undefined"&&Object.keys(OY_INTRO_PRE).length>=OY_INTRO_PRE_MAX))) return false;
            OY_INTRO_PRE[oy_soak_node] = true;
            if (OY_VERBOSE_MODE===true) oy_log("[INTRO][SOAK]["+chalk.bolder(oy_data_flag)+"]["+chalk.bolder(oy_soak_node)+"]");
            return JSON.stringify(["OY_INTRO_TIME", OY_INTRO_MARKER]);
        }
        else if (oy_data_flag==="OY_INTRO_GET") {
            if (typeof(OY_INTRO_PRE[oy_soak_node])==="undefined") return false;

            let oy_work_queue = null;
            if (typeof(OY_INTRO_PASS[oy_soak_node])==="undefined") {
                if (OY_BLOCK_FINISH===false) return JSON.stringify(["OY_INTRO_UNREADY", 2]);
                if (oy_data_payload===true&&(oy_time_offset<(OY_INTRO_MARKER/1000)-OY_MESH_BUFFER[0]||oy_time_offset>(OY_INTRO_MARKER/1000)+OY_INTRO_TRIP[0]+OY_MESH_BUFFER[0])) return false;
                if (typeof(OY_INTRO_ALLOCATE[oy_soak_node])!=="undefined"||(oy_data_payload!==false&&oy_data_payload!==true)) {
                    OY_INTRO_BAN[oy_soak_node] = true;
                    delete OY_INTRO_ALLOCATE[oy_soak_node];
                    return false;
                }
                if (oy_data_payload===true) OY_INTRO_ALLOCATE[oy_soak_node] = 0;
                oy_work_queue = new Array(Math.ceil(OY_BLOCK[0][3]/OY_WORK_INTRO));
                oy_work_queue.fill([null, null]);
                for (let i in oy_work_queue) {
                    oy_work_queue[i][0] = Math.floor(Math.random()*OY_WORK_BITS.length);
                    oy_work_queue[i][1] = OY_WORK_BITS[oy_work_queue[i][0]];
                }
            }
            return JSON.stringify(["OY_INTRO_WORK", [OY_BLOCK_METAHASH, oy_work_queue]]);
        }
        else if (oy_data_flag==="OY_INTRO_DONE") {
            if (typeof(OY_INTRO_PRE[oy_soak_node])==="undefined") return false;

            if ((OY_BLOCK_FINISH===false&&typeof(OY_INTRO_PASS[oy_soak_node])==="undefined")||oy_data_payload===null||oy_data_payload.length!==4||(oy_data_payload[0]!==false&&oy_data_payload[0]!==true)||!oy_key_check(oy_data_payload[1])||(typeof(OY_INTRO_PASS[oy_soak_node])!=="undefined"&&Object.values(OY_INTRO_DEFAULT).indexOf(oy_data_payload[1])===-1)||(typeof(OY_INTRO_PASS[oy_soak_node])==="undefined"&&(typeof(oy_data_payload[3])!=="object"||Object.keys(oy_data_payload[3]).length!==Math.ceil(OY_BLOCK[0][3]/OY_WORK_INTRO)||!oy_key_verify(oy_data_payload[1], oy_data_payload[2], JSON.stringify(oy_data_payload[3]))))) {
                OY_INTRO_BAN[oy_soak_node] = true;
                return false;
            }

            if (typeof(OY_INTRO_PASS[oy_soak_node])==="undefined") {
                for (let oy_work_nonce in oy_data_payload[3]) {
                    if (typeof(OY_WORK_SOLUTIONS[oy_work_nonce])!=="undefined"&&oy_work_verify_single(OY_BLOCK_NEXT, OY_SELF_PUBLIC, OY_BLOCK_HASH, oy_work_nonce, oy_data_payload[3][oy_work_nonce])) {
                        if (OY_WORK_SOLUTIONS[oy_work_nonce]===null||oy_calc_grade(oy_data_payload[3][oy_work_nonce], OY_BLOCK_METAHASH)>OY_WORK_GRADES[oy_work_nonce]) {
                            OY_WORK_SOLUTIONS[oy_work_nonce] = oy_data_payload[3][oy_work_nonce];
                            OY_WORK_GRADES[oy_work_nonce] = oy_calc_grade(oy_data_payload[3][oy_work_nonce], OY_BLOCK_METAHASH);
                        }
                    }
                    else {
                        OY_INTRO_BAN[oy_soak_node] = true;
                        return false;
                    }
                }
            }

            if (oy_data_payload[0]===true) {
                if (typeof(OY_INTRO_PASS[oy_soak_node])==="undefined"&&typeof(OY_INTRO_ALLOCATE[oy_soak_node])==="undefined") {
                    OY_INTRO_BAN[oy_soak_node] = true;
                    return false;
                }
                let oy_signal_array = [];
                for (let i in OY_OFFER_PICKUP) {
                    if (OY_OFFER_PICKUP[i]===null) continue;
                    if (OY_OFFER_PICKUP[i][0]!==oy_data_payload[1]&&OY_OFFER_COLLECT[OY_OFFER_PICKUP[i][0]][0]!==oy_data_payload[1]&&(typeof(OY_OFFER_COLLECT[oy_data_payload[1]])==="undefined"||OY_OFFER_COLLECT[oy_data_payload[1]][0]!==OY_OFFER_PICKUP[i][0])) {
                        OY_OFFER_BROKER[oy_data_payload[1]] = oy_clone_object(OY_OFFER_COLLECT[OY_OFFER_PICKUP[i][0]]);
                        OY_OFFER_COLLECT[OY_OFFER_PICKUP[i][0]] = [oy_data_payload[1], null, null, null];
                        oy_signal_array.push(OY_OFFER_PICKUP[i][1]);
                        OY_OFFER_PICKUP[i] = null;
                        break;
                    }
                }
                if (oy_signal_array.length===0&&Object.keys(OY_INTRO_SELF).length>0&&(typeof(OY_INTRO_PASS[oy_soak_node])==="undefined"||typeof(OY_PEERS[OY_INTRO_PASS[oy_soak_node]])==="undefined")) {
                    for (let oy_offer_rand in OY_INTRO_SELF) {
                        if (OY_INTRO_SELF[oy_offer_rand][1]===null||OY_INTRO_SELF[oy_offer_rand][2]!==null) continue;
                        OY_INTRO_SELF[oy_offer_rand][2] = oy_soak_node;
                        oy_signal_array.push(OY_INTRO_SELF[oy_offer_rand][1]);
                        break;
                    }
                }
                if (oy_signal_array.length===0) return JSON.stringify(["OY_INTRO_UNREADY", 3]);
                else return JSON.stringify(["OY_INTRO_SIGNAL_A", oy_signal_array]);
            }
        }
        else if (oy_data_flag==="OY_INTRO_SIGNAL_B") {
            if (typeof(OY_INTRO_PRE[oy_soak_node])==="undefined") return false;

            let oy_self_pass = false;
            let oy_signal_carry = oy_signal_soak(oy_data_payload);
            if ((OY_BLOCK_FINISH===false&&typeof(OY_INTRO_PASS[oy_soak_node])==="undefined")||typeof(oy_data_payload)!=="string"||!oy_signal_carry||(typeof(OY_INTRO_PASS[oy_soak_node])!=="undefined"&&Object.values(OY_INTRO_DEFAULT).indexOf(oy_signal_carry[0])===-1)||(typeof(OY_INTRO_PASS[oy_soak_node])==="undefined"&&typeof(OY_INTRO_ALLOCATE[oy_soak_node])==="undefined")) {
                OY_INTRO_BAN[oy_soak_node] = true;
                delete OY_INTRO_ALLOCATE[oy_soak_node];
                return false;
            }
            if (typeof(OY_OFFER_BROKER[oy_signal_carry[0]])==="undefined") {
                for (let oy_offer_rand in OY_INTRO_SELF) {
                    if (OY_INTRO_SELF[oy_offer_rand][2]===oy_soak_node) {
                        oy_self_pass = oy_offer_rand;
                        break;
                    }
                }
                if (oy_self_pass===false) {
                    OY_INTRO_BAN[oy_soak_node] = true;
                    delete OY_INTRO_ALLOCATE[oy_soak_node];
                    return false;
                }
            }
            if (typeof(OY_INTRO_PASS[oy_soak_node])==="undefined") OY_INTRO_ALLOCATE[oy_soak_node]++;
            if (oy_self_pass!==false) {
                OY_NODES[oy_signal_carry[0]] = OY_INTRO_SELF[oy_self_pass][0];
                if (OY_SIMULATOR_MODE===true) parentPort.postMessage([3, oy_signal_carry[0], null]);
                else {
                    oy_node_connect(oy_signal_carry[0]);
                    OY_NODES[oy_signal_carry[0]].on("connect", function() {
                        oy_node_initiate(oy_signal_carry[0]);
                    });
                    OY_NODES[oy_signal_carry[0]].signal(oy_signal_carry[1]);
                }
            }
            else oy_data_route("OY_LOGIC_FOLLOW", "OY_INTRO_OFFER_B", [[], OY_OFFER_BROKER[oy_signal_carry[0]][2], oy_key_sign(OY_SELF_PRIVATE, OY_OFFER_BROKER[oy_signal_carry[0]][1]+OY_OFFER_BROKER[oy_signal_carry[0]][3]+oy_data_payload), oy_data_payload]);
            return false;
        }
    }
    catch(e) {
        console.log(e);
    }
    return false;
}

function oy_intro_punish(oy_intro_select) {
    //if (typeof(OY_INTRO_PUNISH[oy_intro_select])==="undefined") OY_INTRO_PUNISH[oy_intro_select] = 1;
    //else OY_INTRO_PUNISH[oy_intro_select]++;
    return true;
}

function oy_intro_process(oy_data_flag, oy_data_payload) {
    if (oy_data_flag!=="OY_INTRO_SIGNAL_A"||typeof(oy_data_payload)!=="object"||oy_data_payload.length===0) {
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
        function oy_signal_local(oy_signal_data) {
            oy_intro_beam(OY_INTRO_SELECT, "OY_INTRO_SIGNAL_B", oy_signal_beam(oy_signal_data));
        }
        if (OY_SIMULATOR_MODE===true) {
            OY_NODES[oy_signal_carry[0]] = true;
            oy_signal_local(oy_rand_gen(4));
        }
        else {
            OY_NODES[oy_signal_carry[0]] = oy_node_boot(false);
            oy_node_connect(oy_signal_carry[0]);
            OY_NODES[oy_signal_carry[0]].on("signal", oy_signal_local);
            OY_NODES[oy_signal_carry[0]].signal(oy_signal_carry[1]);
        }
    }
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

    let oy_time_offset = oy_time()-OY_BLOCK_TIME;
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
    return Math.floor(oy_time()/10)*10;
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
    let oy_time_local = oy_time();

    if (typeof(oy_reset_flag)==="undefined") oy_reset_flag = "OY_RESET_EVENT";
    else if (oy_reset_flag.toString()==="[object Event]"&&typeof(oy_reset_flag.type)==="string") oy_reset_flag = "OY_RESET_"+(oy_reset_flag.type.toUpperCase().substr(3));

    if ((OY_BLOCK_BOOT===true&&oy_reset_flag==="OY_RESET_EVENT")||(OY_BLOCK_HALT!==null&&oy_time_local-OY_BLOCK_HALT<OY_BLOCK_HALT_BUFFER)) return false;//adds boot safety and prevents duplicate calls of block_reset()

    OY_BLOCK_HALT = oy_time_local;
    OY_BLOCK_HASH = null;
    OY_BLOCK_METAHASH = null;
    OY_BLOCK_FLAT = null;
    OY_BLOCK_COMPRESS = null;
    OY_BLOCK_DIFF = false;
    OY_BLOCK_SIGN = null;
    OY_BLOCK_UPTIME = null;
    OY_BLOCK_WEIGHT = null;
    OY_BLOCK_ELAPSED = 0;
    OY_BLOCK_STABILITY = 0;
    OY_BLOCK_STABILITY_KEEP = [OY_BLOCK_RANGE_MIN];
    OY_BLOCK_COMMAND_NONCE = 0;
    OY_BLOCK_COMMAND = {};
    OY_BLOCK_SYNC = {};
    OY_BLOCK_RECORD = null;
    OY_BLOCK_RECORD_KEEP = [];
    OY_BLOCK_FINISH = false;
    OY_INTRO_MARKER = null;
    OY_INTRO_PRE = {};
    OY_INTRO_ALLOCATE = {};
    OY_INTRO_PASS = {};
    OY_INTRO_SELF = {};
    OY_INTRO_BAN = {};
    OY_BLOCK_CHALLENGE = {};
    OY_BLOCK_STRICT = [];
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
    OY_PEER_EXCHANGE = {};
    OY_PEER_OFFER = [null, null, null];
    OY_OFFER_COUNTER = 0;
    OY_OFFER_COLLECT = {};
    OY_OFFER_PICKUP = [];
    OY_OFFER_BROKER = {};
    OY_REPORT_HASH = null;

    oy_worker_halt(1);

    for (let oy_peer_select in OY_PEERS) {
        oy_node_deny(oy_peer_select, "OY_DENY_SELF_"+oy_reset_flag.substr(3));
    }

    oy_log("[BLOCK][RESET]["+oy_reset_flag+"]", 2);
    oy_log_debug("MESHBLOCK RESET["+OY_SELF_PUBLIC+"]["+oy_reset_flag+"]");//TODO temp

    oy_event_dispatch("oy_block_reset");
    oy_event_dispatch("oy_state_blank");
}

function oy_block_engine() {
    let oy_block_time_local = oy_block_time();
    setTimeout(oy_block_engine, (OY_LIGHT_MODE===false)?OY_BLOCK_LOOP[0]:OY_BLOCK_LOOP[1]);
    if (oy_block_time_local!==OY_BLOCK_TIME&&(oy_block_time_local/10)%6===0) {
        OY_BLOCK_TIME = oy_block_time_local;
        OY_BLOCK_NEXT = OY_BLOCK_TIME+OY_BLOCK_SECTORS[5][0];
        if (OY_BLOCK_TIME<OY_BLOCK_BOOT_MARK) OY_BLOCK_BOOT = null;
        else OY_BLOCK_BOOT = OY_BLOCK_TIME-OY_BLOCK_BOOT_MARK<OY_BLOCK_BOOT_BUFFER;
        OY_BLOCK_ELAPSED = Math.floor(oy_time()-OY_BLOCK_BOOT_MARK)-OY_BLOCK_BOOT_BUFFER;

        if (OY_FULL_INTRO!==false&&OY_FULL_INTRO===OY_INTRO_BOOT) {
            if (OY_BLOCK_BOOT===true) {
                OY_PEER_MAX = [OY_PEER_BOOT, 0];
                OY_PEER_INFLATE = [OY_PEER_BOOT, 0];
                OY_PEER_SELF = OY_PEER_BOOT;
                OY_NODE_MAX = OY_PEER_BOOT*2;
            }
            else {
                OY_PEER_MAX = OY_PEER_BOOT_RESTORE[0];
                OY_PEER_INFLATE = OY_PEER_BOOT_RESTORE[1];
                OY_PEER_SELF = OY_PEER_BOOT_RESTORE[2];
                OY_NODE_MAX = OY_PEER_BOOT_RESTORE[3];
                if (OY_BLOCK_ELAPSED<=OY_BLOCK_BOOT_BUFFER) {
                    let oy_local_max = Math.ceil(OY_PEER_BOOT/(OY_BLOCK_BOOT_BUFFER/OY_BLOCK_SECTORS[5][0]));
                    let oy_drop_counter = 0;
                    while (oy_peer_count()>OY_PEER_MAX[0]||oy_peer_count(true)>OY_PEER_MAX[1]) {
                        if (oy_drop_counter===oy_local_max) break;
                        let oy_peer_weak = [null, -1];
                        for (let oy_peer_select in OY_PEERS) {
                            if (OY_PEERS[oy_peer_select][3]>oy_peer_weak[1]) oy_peer_weak = [oy_peer_select, OY_PEERS[oy_peer_select][3]];
                        }
                        if (oy_peer_weak[0]==null) break;
                        oy_node_deny(oy_peer_weak[0], "OY_DENY_BOOT_DROP");
                        oy_drop_counter++;
                    }
                }
            }
        }

        if (OY_BLOCK_HASH!==null) oy_log("[MESHBLOCK][STATUS]["+chalk.bolder(OY_BLOCK[0][2])+"N]["+chalk.bolder(OY_BLOCK_STABILITY.toFixed(2))+"ST]["+chalk.bolder(OY_SYNC_LAST[0].toFixed(2))+"L]["+chalk.bolder(OY_FULL_INTRO.toString())+"]["+chalk.bolder(oy_peer_full().toString())+"]["+chalk.bolder(((((OY_BLOCK_ELAPSED/60)/60)/24)/365).toFixed(2))+"Y]["+chalk.bolder((((OY_BLOCK_ELAPSED/60)/60)/24).toFixed(2))+"D]["+chalk.bolder(OY_BLOCK_ELAPSED)+"S]"+JSON.stringify(OY_WORK_SOLUTIONS), 1);

        OY_BLOCK_COMMAND_NONCE = 0;
        OY_BLOCK_SYNC = {};
        OY_BLOCK_SYNC_PASS[OY_BLOCK_TIME] = {};
        OY_BLOCK_WORK_GRADE = {};
        OY_BLOCK_LATENCY = {};
        OY_BLOCK_RECORD = null;
        OY_BLOCK_FINISH = false;
        OY_SYNC_TALLY = {};
        OY_OFFER_COUNTER = 0;
        OY_OFFER_COLLECT = {};
        OY_OFFER_PICKUP = [];
        OY_OFFER_BROKER = {};
        OY_PEER_EXCHANGE = {};
        OY_PEER_OFFER = [null, null, null];
        OY_LIGHT_PROCESS = false;
        OY_BASE_BUILD = [];
        OY_JUMP_PRE = {};
        oy_block_jump_reset();
        let oy_block_continue = true;

        if (OY_INTRO_SELECT!==null&&Object.values(OY_INTRO_TAG).indexOf(true)===-1) oy_intro_punish(OY_INTRO_SELECT);

        OY_INTRO_SELECT = null;
        OY_INTRO_SOLUTIONS = {};
        OY_INTRO_PRE = {};
        OY_INTRO_ALLOCATE = {};
        OY_INTRO_PASS = {};
        OY_INTRO_SELF = {};
        OY_INTRO_TAG = {};
        OY_INTRO_BAN = {};

        if (OY_SIMULATOR_MODE===true) OY_SIMULATOR_CALLBACK = {};

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

        for (let oy_report_count = 10000; oy_report_count<=OY_BLOCK_SECTORS[5][1]; oy_report_count += 10000) {
            oy_chrono(oy_peer_report, oy_report_count);
        }

        //BLOCK SEED--------------------------------------------------
        if (OY_LIGHT_MODE===false&&OY_BLOCK_TIME===OY_BLOCK_BOOT_MARK) {
            oy_log("[MESHBLOCK]["+chalk.bolder("BOOT_SEED")+"]", 1);
            oy_log_debug("MESHBLOCK BOOT SEED");
            OY_BLOCK = oy_clone_object(OY_BLOCK_TEMPLATE);
            OY_BLOCK[0][0] = OY_MESH_DYNASTY;//dynasty
            OY_BLOCK[0][1] = OY_BLOCK_TIME-OY_BLOCK_SECTORS[5][0];
            OY_BLOCK[0][2] = OY_BLOCK_RANGE_MIN;//mesh range
            OY_BLOCK[0][3] = OY_WORK_MIN;//work difficulty
            OY_BLOCK[0][4] = OY_BLOCK_BOOT_MARK;//genesis timestamp
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
            OY_BLOCK_METAHASH = oy_hash_gen(OY_BLOCK_HASH);
            OY_BLOCK_RECORD_KEEP = [1, 1];
            oy_event_dispatch("oy_state_full");
            oy_worker_spawn(1);
        }
        //BLOCK SEED--------------------------------------------------

        /*
        if (OY_LIGHT_STATE===false) {//TODO merge if condition with block below
            let oy_array_length = (OY_BLOCK_BOOT===true||OY_BLOCK[0][2]===null)?OY_SYNC_HOP_MAX:Math.ceil(Math.sqrt(OY_BLOCK[0][2]))+OY_JUDGE_STRICT;
            OY_BLOCK_LEARN = [null];
            for (let i = 0;i<oy_array_length;i++) {
                OY_BLOCK_LEARN.push([]);
            }
        }
        */
        if (OY_LIGHT_STATE===false&&OY_BLOCK_HASH!==null&&OY_WORK_SOLUTIONS.indexOf(null)===-1&&(oy_peer_full()||OY_BLOCK_BOOT===true)) {
            if (OY_WORK_SOLUTIONS.length!==OY_BLOCK[0][3]) {
                oy_log("[ERROR]["+chalk.bolder("WORK_MISMATCH")+"]["+chalk.bolder(OY_WORK_SOLUTIONS.length)+"]["+chalk.bolder(OY_BLOCK[0][3])+"]", 2);
                throw new Error("OY_ERROR_FATAL");
            }

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

            if (OY_FULL_INTRO!==false&&!oy_intro_check(OY_FULL_INTRO)) {
                oy_block_reset("OY_RESET_SYNC_INTRO");
                return false;
            }

            let oy_grade_array = [];
            for (let i in OY_WORK_SOLUTIONS) {
                oy_grade_array.push(oy_calc_grade(OY_WORK_SOLUTIONS[i], OY_BLOCK_METAHASH));
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
                //oy_log("[SYNC][BROADCAST]["+(oy_time()-OY_BLOCK_TIME).toFixed(2)+"]", 2);
                oy_data_route("OY_LOGIC_SYNC", "OY_BLOCK_SYNC", [[], [oy_key_sign(OY_SELF_PRIVATE, oy_sync_crypt)], oy_sync_crypt, OY_BLOCK_TIME, oy_command_flat, oy_identity_flat, oy_solutions_flat]);
            }, OY_BLOCK_BUFFER_CLEAR[1]+OY_MESH_BUFFER[1]);
        }

        for (let oy_command_hash in OY_BLOCK_COMMAND) {
            if (OY_BLOCK_COMMAND[oy_command_hash][0][1][0]!==OY_BLOCK_NEXT) {
                delete OY_BLOCK_COMMAND[oy_command_hash];
                delete OY_BLOCK_COMMAND_SELF[oy_command_hash];
            }
        }

        if (OY_FULL_INTRO!==false&&OY_BLOCK_RECORD_KEEP.length>1) {
            OY_DIVE_GRADE = true;
            OY_INTRO_MARKER = Math.ceil(((OY_SYNC_LAST[0]>0)?Math.max(OY_BLOCK_SECTORS[0][1]+OY_INTRO_TRIP[1], Math.min(OY_BLOCK_SECTORS[1][1], Math.floor(OY_SYNC_LAST[0]*1000)+OY_BLOCK_BUFFER_SPACE[1])):OY_BLOCK_SECTORS[1][1])+(Math.max(...OY_BLOCK_RECORD_KEEP)*1000*OY_BLOCK_RECORD_INTRO_BUFFER));
        }
        else OY_INTRO_MARKER = null;

        oy_chrono(function() {
            if (OY_BLOCK_HASH===null||Object.keys(OY_NODES).length>=OY_NODE_MAX) return false;

            if (OY_FULL_INTRO===false) {
                if (oy_peer_count()+oy_peer_count(true)>0&&(oy_peer_count()<OY_PEER_MAX[0]||(OY_BLOCK_BOOT===false&&oy_peer_count(true)<OY_PEER_MAX[1]))) {
                    let oy_offer_rand = oy_rand_gen(OY_MESH_SEQUENCE);
                    function oy_signal_local(oy_signal_data) {
                        let oy_signal_crypt = oy_signal_beam(oy_signal_data);
                        OY_PEER_OFFER[2] = oy_signal_crypt;
                        oy_data_route("OY_LOGIC_UPSTREAM", "OY_INTRO_OFFER_A", [[], [], oy_key_sign(OY_SELF_PRIVATE, OY_BLOCK_HASH+oy_offer_rand+oy_signal_crypt), oy_offer_rand, oy_signal_crypt]);
                    }
                    if (OY_SIMULATOR_MODE===true) {
                        OY_PEER_OFFER = [oy_offer_rand, true, null];
                        oy_signal_local(oy_rand_gen(4));
                    }
                    else {
                        OY_PEER_OFFER = [oy_offer_rand, oy_node_boot(true), null];
                        OY_PEER_OFFER[1].on("signal", oy_signal_local);
                    }
                }
            }
            else if (OY_BLOCK_RECORD_KEEP.length>1&&(OY_BLOCK_BOOT===false||OY_FULL_INTRO===OY_INTRO_BOOT)) {
                for (let i = 0;i<OY_PEER_SELF;i++) {
                    let oy_offer_rand = oy_rand_gen(OY_MESH_SEQUENCE);
                    if (OY_SIMULATOR_MODE===true) OY_INTRO_SELF[oy_offer_rand] = [true, oy_signal_beam(oy_rand_gen(4)), null];
                    else {
                        OY_INTRO_SELF[oy_offer_rand] = [oy_node_boot(true), null, null];
                        OY_INTRO_SELF[oy_offer_rand][0].on("signal", function(oy_signal_data) {
                            OY_INTRO_SELF[oy_offer_rand][1] = oy_signal_beam(oy_signal_data);
                        });
                    }
                }
            }

            for (let oy_peer_select in OY_PEERS) {
                if (OY_PEERS[oy_peer_select][1]===0||OY_PEERS[oy_peer_select][0]>=OY_BLOCK_TIME) continue;
                if (OY_SIMULATOR_MODE===true) {
                    OY_PEERS[oy_peer_select][10] = true;
                    OY_PEERS[oy_peer_select][11][0] = true;
                    oy_data_beam(oy_peer_select, "OY_PEER_EXCHANGE_A", [oy_peer_map, oy_signal_beam(oy_rand_gen(4))]);
                }
                else {
                    OY_PEERS[oy_peer_select][10] = oy_node_boot(true);
                    OY_PEERS[oy_peer_select][10].on("signal", function(oy_signal_data) {
                        if (typeof(OY_PEERS[oy_peer_select])!=="undefined") {
                            OY_PEERS[oy_peer_select][11][0] = true;
                            oy_data_beam(oy_peer_select, "OY_PEER_EXCHANGE_A", [oy_peer_map, oy_signal_beam(oy_signal_data)]);
                        }
                    });
                }
            }
        }, OY_BLOCK_PEER_SPACE[1]);

        oy_chrono(function() {
            OY_BLOCK_DIFF = false;

            let oy_time_local = oy_time();

            if (OY_BLOCK_HASH===null||oy_peer_count()<=OY_PEER_INTRO||(OY_BLOCK_BOOT===false&&oy_peer_count(true)<=OY_PEER_INTRO)) {
                let oy_intro_initiate = function(oy_intro_select) {
                    oy_intro_beam(oy_intro_select, "OY_INTRO_PRE", (OY_FULL_INTRO!==false&&typeof(OY_INTRO_DEFAULT[OY_FULL_INTRO])!=="undefined")?[OY_FULL_INTRO, oy_key_sign(OY_SELF_PRIVATE, OY_BLOCK_TIME.toString())]:null, function(oy_data_flag, oy_data_payload) {
                        if (oy_data_flag==="OY_INTRO_UNREADY") return false;
                        if (oy_data_flag!=="OY_INTRO_TIME"||!Number.isInteger(oy_data_payload)||oy_data_payload<OY_BLOCK_SECTORS[0][1]||oy_data_payload>OY_BLOCK_SECTORS[4][1]) {
                            oy_intro_punish(oy_intro_select);
                            return false;
                        }
                        let oy_time_offset = (oy_time()-OY_BLOCK_TIME)*1000;
                        if (OY_INTRO_SELECT!==null||oy_data_payload<=oy_time_offset) return false;
                        OY_INTRO_SELECT = oy_intro_select;
                        oy_chrono(function() {
                            oy_intro_beam(oy_intro_select, "OY_INTRO_GET", true, function(oy_data_flag, oy_data_payload) {
                                if (oy_data_flag!=="OY_INTRO_WORK"||!oy_hash_check(oy_data_payload[0])||((OY_FULL_INTRO===false||typeof(OY_INTRO_DEFAULT[OY_FULL_INTRO])==="undefined")&&(typeof(oy_data_payload[1])!=="object"||oy_data_payload[1].length>OY_WORK_MAX/OY_WORK_INTRO))) {
                                    oy_intro_punish(oy_intro_select);
                                    return false;
                                }
                                if (oy_data_payload[1]===null) oy_intro_beam(OY_INTRO_SELECT, "OY_INTRO_DONE", [true, OY_SELF_PUBLIC, null, null], oy_intro_process);
                                else {
                                    OY_INTRO_SOLUTIONS = {};
                                    for (let i in oy_data_payload[1]) {
                                        OY_INTRO_SOLUTIONS[oy_data_payload[1][i][0]] = null;
                                        oy_worker_process(0, false, [false, oy_data_payload[1][i][0], oy_data_payload[1][i][1], oy_data_payload[0]]);
                                    }
                                }
                            });
                        }, (OY_FULL_INTRO!==false&&typeof(OY_INTRO_DEFAULT[OY_FULL_INTRO])!=="undefined")?1:(oy_data_payload-oy_time_offset));
                    });
                }
                if (OY_BLOCK_BOOT===true) {
                    if (oy_state_current()===2) oy_intro_initiate(OY_INTRO_BOOT);
                }
                else {
                    if (OY_BLOCK_HASH===null) {
                        let oy_intro_default = oy_calc_shuffle(Object.keys(OY_INTRO_DEFAULT)).slice(0, OY_INTRO_INITIATE);
                        for (let i in oy_intro_default) {
                            oy_intro_initiate(oy_intro_default[i]);
                        }
                    }
                    else {
                        let oy_intro_keep = {};
                        for (let oy_key_public in OY_BLOCK[1]) {
                            if (OY_BLOCK[1][oy_key_public][6]!==0&&OY_BLOCK[1][oy_key_public][1]===1&&OY_BLOCK[1][oy_key_public][2]>=OY_BLOCK[0][15]&&typeof(oy_intro_keep[OY_BLOCK[1][oy_key_public][6]])==="undefined") oy_intro_keep[OY_BLOCK[1][oy_key_public][6]] = true;
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
                        if (oy_intro_array.length>0) oy_intro_initiate(oy_intro_array[Math.floor(Math.random()*oy_intro_array.length)]);
                    }
                }
            }

            if (OY_BLOCK_HASH===null) {
                OY_BLOCK_CHALLENGE = {};
                oy_log("[MESHBLOCK][SKIP]["+chalk.bolder(OY_BLOCK_TIME)+"]", 1);
                oy_block_continue = false;
                return false;
            }
            if (OY_BLOCK[0][1]!==null&&OY_BLOCK[0][1]!==OY_BLOCK_TIME-OY_BLOCK_SECTORS[5][0]) {
                oy_block_reset("OY_RESET_MISSTEP");
                oy_block_continue = false;
                return false;
            }
            if (OY_BLOCK[0][4]!==OY_BLOCK_BOOT_MARK) {
                oy_block_reset("OY_RESET_BOOT_INVALID");
                oy_block_continue = false;
                return false;
            }
            if (oy_peer_count()+oy_peer_count(true)===0&&OY_BLOCK_BOOT===false) {
                oy_block_reset("OY_RESET_DROP_PEER");
                oy_block_continue = false;
                return false;
            }

            if (OY_BLOCK_UPTIME===null) OY_BLOCK_UPTIME = oy_time_local;

            if ((OY_FULL_INTRO!==false&&OY_BLOCK_RECORD_KEEP.length>1)&&(OY_BLOCK_BOOT===true||(typeof(OY_BLOCK[1][OY_SELF_PUBLIC])!=="undefined"&&OY_BLOCK[1][OY_SELF_PUBLIC][1]===1))) {
                OY_OFFER_PICKUP = [];
                for (let oy_key_public in OY_OFFER_COLLECT) {
                    if (typeof(OY_BLOCK[1][oy_key_public])!=="undefined") OY_OFFER_PICKUP.push([oy_key_public, OY_OFFER_COLLECT[oy_key_public][3], OY_BLOCK[1][oy_key_public][0], OY_BLOCK[1][oy_key_public][2]]);
                }
                if (OY_OFFER_PICKUP.length>0) {
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
                }
                let oy_pickup_sort = [];
                for (let oy_key_public in OY_OFFER_COLLECT) {
                    if (typeof(OY_BLOCK[1][oy_key_public])==="undefined") oy_pickup_sort.push([oy_key_public, OY_OFFER_COLLECT[oy_key_public][3], OY_OFFER_COLLECT[oy_key_public][0]]);
                }
                if (oy_pickup_sort.length>0) {
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
                }
                OY_OFFER_COUNTER = -1;
            }
        }, OY_BLOCK_SECTORS[0][1]-OY_BLOCK_BUFFER_CLEAR[1]);

        oy_chrono(function() {
            if (oy_block_continue===false||OY_LIGHT_STATE===true||OY_LIGHT_PROCESS===true) return false;

            if (OY_BLOCK_HASH===null) {
                oy_block_reset("OY_RESET_NULL_HASH_A");
                return false;
            }

            OY_BLOCK_RECORD = oy_time();

            let oy_mesh_range = null;
            let oy_command_execute = [];
            if (OY_BLOCK_BOOT===false||OY_BLOCK_TIME-OY_BLOCK_BOOT_MARK>=OY_BLOCK_BOOT_BUFFER-OY_BLOCK_SECTORS[5][0]) {
                for (let oy_key_public in OY_BLOCK_SYNC) {
                    if (OY_BLOCK_SYNC[oy_key_public]===false||OY_BLOCK_SYNC[oy_key_public][1]===false) {
                        delete OY_BLOCK_SYNC[oy_key_public];
                        delete OY_BLOCK_SYNC_PASS[OY_BLOCK_TIME][oy_key_public];
                        delete OY_SYNC_MAP[1][oy_key_public];
                    }
                }

                /*
                if (((OY_BLOCK_TIME-OY_BLOCK_BOOT_MARK)/60)%240===0&&Math.floor(Math.random()*2)===0) {//artificial mesh splitter
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
                    oy_dive_ledger[oy_key_public] = [OY_BLOCK_WORK_GRADE[oy_key_public], 0, (typeof(OY_BLOCK[1][oy_key_public])!=="undefined"&&OY_BLOCK[1][oy_key_public][4]===((oy_dive_payout===false)?0:oy_dive_payout)&&OY_BLOCK[1][oy_key_public][5]===((oy_dive_team===false)?0:oy_dive_team)&&OY_BLOCK[1][oy_key_public][6]===((oy_full_intro===false)?0:oy_full_intro))?OY_BLOCK[1][oy_key_public][2]+1:1, 0, (oy_dive_payout===false)?0:oy_dive_payout, (oy_dive_team===false)?0:oy_dive_team, (oy_full_intro===false)?0:oy_full_intro, OY_BLOCK_SYNC_PASS[OY_BLOCK_TIME][oy_key_public][1]];
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

                //oy_mesh_range_prev = OY_BLOCK[0][2];//TODO remove
                if (!oy_block_range(Object.keys(OY_BLOCK[1]).length)) return false;//block_range will invoke block_reset if necessary
                oy_mesh_range = OY_BLOCK[0][2];

                if (oy_dive_state_prev===true) {
                    for (let oy_peer_select in OY_PEERS) {
                        if (OY_PEERS[oy_peer_select][1]===2&&OY_PEERS[oy_peer_select][0]<OY_BLOCK_TIME&&typeof(OY_BLOCK[1][oy_peer_select])==="undefined") oy_node_deny(oy_peer_select, "OY_DENY_FULL_DIVE");
                    }
                }
            }
            else {
                if (Object.keys(OY_BLOCK_SYNC).length>1&&typeof(OY_BLOCK_SYNC[OY_INTRO_DEFAULT[OY_INTRO_BOOT]])==="undefined") {
                    for (let oy_peer_select in OY_PEERS) {
                        oy_node_deny(oy_peer_select, "OY_DENY_SELF_BOOT_INVALID");
                    }
                }
                oy_mesh_range = Object.keys(OY_BLOCK_SYNC).length;
                OY_BLOCK_SYNC = {};
                OY_SYNC_TALLY = {};
            }

            if (!oy_block_process(oy_command_execute, true, false)) return false;//block_process will invoke block_reset if necessary

            OY_BLOCK_FLAT = JSON.stringify(OY_BLOCK);
            OY_BLOCK_HASH = oy_hash_gen(OY_BLOCK_FLAT);
            OY_BLOCK_METAHASH = oy_hash_gen(OY_BLOCK_HASH);
            OY_BLOCK_WEIGHT = new Blob([OY_BLOCK_FLAT]).size;

            oy_log("[MESHBLOCK][FULL]["+chalk.bolder(OY_BLOCK_HASH)+"]", 1);
            //oy_log_debug("FULL MESHBLOCK HASH "+OY_BLOCK_HASH);
            //oy_log_debug("HASH: "+OY_BLOCK_HASH+"\nBLOCK: "+OY_BLOCK_FLAT);

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

            OY_BLOCK_STRICT = new Array(Math.max(1, Math.ceil(oy_mesh_range*OY_MESH_SECURITY)));
            OY_BLOCK_STRICT.fill(null);

            let oy_edge_latency = Math.sqrt(oy_mesh_range)*oy_calc_median(Object.values(OY_BLOCK_LATENCY));
            OY_BLOCK_STRICT[OY_BLOCK_STRICT.length-1] = OY_BLOCK_SECTORS[1][0]-oy_edge_latency;
            let oy_hop_latency = OY_BLOCK_STRICT[OY_BLOCK_STRICT.length-1]/OY_BLOCK_STRICT.length;
            let oy_curve_factor = 1-(OY_BLOCK_STRICT_CURVE/100);
            let oy_curve_increment = (OY_BLOCK_STRICT_CURVE/100)/OY_BLOCK_STRICT.length;
            for (let i in OY_BLOCK_STRICT) {
                if (i===0) continue;
                OY_BLOCK_STRICT[i] = oy_hop_latency*i*Math.min(1, (oy_curve_factor+(oy_curve_increment*(i+1))));
                console.log((oy_curve_factor+(oy_curve_increment*(i+1))));
            }

            oy_log("LATENCY: "+JSON.stringify(Object.values(OY_BLOCK_LATENCY))+"\nSTRICT: "+OY_BLOCK_STRICT.length+" "+JSON.stringify(OY_BLOCK_STRICT));
            //OY_BLOCK_STRICT = [];//TODO temp
            /*
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

            let oy_judge_last = null;
            for (let oy_pointer = OY_BLOCK_JUDGE.length-1; oy_pointer>0; oy_pointer--) {
                if (OY_BLOCK_JUDGE[oy_pointer]===true) {
                    if (oy_judge_last!==null) OY_BLOCK_JUDGE[oy_pointer] = oy_judge_last;
                }
                else oy_judge_last = OY_BLOCK_JUDGE[oy_pointer];
            }
            */
            //oy_log("JUDGE: "+JSON.stringify(OY_BLOCK_JUDGE));

            if (OY_BLOCK_BOOT===true) OY_SYNC_LAST = [0, 0];
            else {
                OY_SYNC_LAST.shift();
                OY_SYNC_LAST.push(0);
            }

            OY_SYNC_MAP.shift();
            OY_SYNC_MAP.push({});

            oy_block_finish();

            oy_chrono(function() {
                //FULL NODE -> LIGHT NODE
                if (OY_LIGHT_STATE===false&&OY_BLOCK_BOOT===false&&(OY_LIGHT_MODE===true||!oy_peer_full())) {
                    OY_LIGHT_STATE = true;
                    OY_DIVE_STATE = false;
                    OY_SYNC_LAST = [0, 0];
                    OY_SYNC_MAP = [{}, {}];

                    oy_event_dispatch("oy_state_light");
                    oy_worker_halt(1);

                    for (let oy_peer_select in OY_PEERS) {//TODO terminate any jump session
                        if (oy_peer_select!==OY_JUMP_ASSIGN[0]) oy_data_beam(oy_peer_select, "OY_PEER_LIGHT", oy_key_sign(OY_SELF_PRIVATE, OY_MESH_DYNASTY+OY_BLOCK_HASH, true));
                    }
                }
            }, (OY_BLOCK_SECTORS[4][0]-(oy_time()-OY_BLOCK_TIME))*1000);
        }, (OY_SYNC_LAST[0]>0)?Math.max(OY_BLOCK_SECTORS[0][1], Math.min(OY_BLOCK_SECTORS[1][1], Math.floor(OY_SYNC_LAST[0]*1000)+OY_BLOCK_BUFFER_SPACE[1])):OY_BLOCK_SECTORS[1][1]);

        oy_chrono(function() {
            if (oy_block_continue===true&&OY_LIGHT_STATE===true&&Object.keys(OY_LIGHT_BUILD).length>0) oy_block_light();
        }, OY_BLOCK_SECTORS[2][1]);

        oy_chrono(function() {
            oy_block_challenge(0);
        }, OY_BLOCK_SECTORS[3][1]);

        oy_chrono(function() {
            oy_block_challenge(1);
            oy_chrono(function() {
                let oy_light_deflate = function() {
                    let oy_intro_default = Object.values(OY_INTRO_DEFAULT);
                    let oy_peer_weak = [null, -1];
                    for (let oy_peer_select in OY_PEERS) {
                        if (OY_PEERS[oy_peer_select][1]===1&&
                            OY_PEERS[oy_peer_select][0]<OY_BLOCK_TIME&&
                            OY_PEERS[oy_peer_select][9]!==1&&
                            oy_intro_default.indexOf(oy_peer_select)===-1&&
                            OY_PEERS[oy_peer_select][3]>oy_peer_weak[1]) oy_peer_weak = [oy_peer_select, OY_PEERS[oy_peer_select][3]];
                    }
                    if (oy_peer_weak[0]!==null) oy_node_deny(oy_peer_weak[0], "OY_DENY_DEFLATE_DROP_L");
                }
                let oy_full_deflate = function() {
                    let oy_cut_local = oy_peer_cut();
                    let oy_intro_default = Object.values(OY_INTRO_DEFAULT);
                    let oy_peer_weak = [null, -1];
                    for (let oy_peer_select in OY_PEERS) {
                        if (OY_PEERS[oy_peer_select][1]===2&&
                            OY_PEERS[oy_peer_select][0]<OY_BLOCK_TIME&&
                            OY_PEERS[oy_peer_select][9]<=oy_cut_local&&
                            oy_intro_default.indexOf(oy_peer_select)===-1&&
                            OY_PEERS[oy_peer_select][3]>oy_peer_weak[1]) oy_peer_weak = [oy_peer_select, OY_PEERS[oy_peer_select][3]];
                    }
                    if (oy_peer_weak[0]!==null) oy_node_deny(oy_peer_weak[0], "OY_DENY_DEFLATE_DROP_F");
                }
                for (let i = 0;i<OY_PEER_INFLATE[0];i++) {
                    if (oy_peer_count()>OY_PEER_INFLATE[0]) oy_full_deflate();
                }
                for (let i = 0;i<OY_PEER_INFLATE[1];i++) {
                    if (oy_peer_count(true)>OY_PEER_INFLATE[1]) oy_light_deflate();
                }
                for (let i = 0;i<OY_PEER_DEFLATE[0];i++) {
                    if (oy_peer_count()>OY_PEER_MAX[0]) oy_full_deflate();
                }
                for (let i = 0;i<OY_PEER_DEFLATE[1];i++) {
                    if (oy_peer_count(true)>OY_PEER_MAX[1]) oy_light_deflate();
                }
            }, OY_BLOCK_BUFFER_CLEAR[1]);
        }, OY_BLOCK_SECTORS[4][1]);
    }
}

function oy_block_challenge(oy_challenge_stage) {
    if (oy_challenge_stage===0) {
        OY_BLOCK_CHALLENGE = {};
        for (let oy_peer_select in OY_PEERS) {
            if (OY_PEERS[oy_peer_select][1]!==0&&oy_peer_select!==OY_JUMP_ASSIGN[0]) OY_BLOCK_CHALLENGE[oy_peer_select] = true;
        }
        oy_chrono(function() {
            for (let oy_peer_select in OY_PEERS) {
                oy_latency_test(oy_peer_select, "OY_PEER_ROUTINE", OY_PEERS[oy_peer_select][1]);
            }
        }, OY_BLOCK_BUFFER_CLEAR[1]+OY_MESH_BUFFER[1]);
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
        let oy_block_metahash = oy_hash_gen(oy_block_hash);
        let oy_grade_array = [];
        for (let i in oy_dive_ledger[oy_key_public][7]) {
            oy_grade_array.push(oy_calc_grade(oy_dive_ledger[oy_key_public][7][i], oy_block_metahash));
        }
        if (Math.floor(oy_calc_avg(oy_grade_array))!==oy_dive_ledger[oy_key_public][0]||!oy_work_verify(OY_BLOCK_TIME-((oy_time()-OY_BLOCK_TIME<OY_BLOCK_SECTORS[0][0])?60:0), oy_key_public, oy_block_hash, (OY_BLOCK[0][5]===0)?OY_BLOCK[0][14][OY_BLOCK[0][14].length-1]:OY_BLOCK[0][3], oy_dive_ledger[oy_key_public][7])) return false;
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
    OY_BLOCK_RECORD = oy_time();

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
    OY_BLOCK_METAHASH = oy_hash_gen(OY_BLOCK_HASH);
    OY_BLOCK_WEIGHT = new Blob([OY_BLOCK_FLAT]).size;

    oy_log("[MESHBLOCK][LIGHT]["+chalk.bolder(OY_BLOCK_HASH)+"]", 1);
    oy_log_debug("LIGHT MESHBLOCK HASH "+OY_BLOCK_HASH+"\n"+OY_BLOCK_FLAT);

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
    if (OY_LIGHT_MODE===false&&OY_LIGHT_STATE===true&&oy_peer_full()) {
        OY_LIGHT_STATE = false;
        OY_BLOCK_STRICT = [];

        let oy_last_calc = (oy_time()-OY_BLOCK_TIME)+OY_SYNC_LAST_BUFFER;
        if (oy_last_calc>OY_BLOCK_SECTORS[0][0]&&oy_last_calc<OY_BLOCK_SECTORS[1][0]) OY_SYNC_LAST = [oy_last_calc, oy_last_calc];
        else OY_SYNC_LAST = [0, 0];

        oy_event_dispatch("oy_state_full");
        oy_worker_spawn(1);

        let oy_time_offset = oy_time()-OY_BLOCK_TIME;
        oy_chrono(function() {
            for (let oy_peer_select in OY_PEERS) {
                oy_data_beam(oy_peer_select, "OY_PEER_FULL", oy_key_sign(OY_SELF_PRIVATE, OY_MESH_DYNASTY+OY_BLOCK_HASH, true));
            }
        }, (OY_BLOCK_SECTORS[4][0]-oy_time_offset)*1000);
    }

    oy_block_finish();
}

function oy_block_range(oy_mesh_range_new) {
    if (oy_mesh_range_new<OY_BLOCK_RANGE_MIN&&OY_BLOCK_BOOT===false) {
        oy_block_reset("OY_RESET_RANGE_DROP");
        oy_log("[ERROR]["+chalk.bolder("RANGE_DROP")+"]["+chalk.bolder(OY_BLOCK[0][2])+"]["+chalk.bolder(oy_mesh_range_new)+"]", 2);
        return false;
    }
    if (OY_BLOCK[0][2]-oy_mesh_range_new>=OY_BLOCK[0][2]*OY_BLOCK_RANGE_KILL) {
        oy_block_reset("OY_RESET_RANGE_KILL");
        oy_log("[ERROR]["+chalk.bolder("RANGE_KILL")+"]["+chalk.bolder(OY_BLOCK[0][2])+"]["+chalk.bolder(oy_mesh_range_new)+"]", 2);
        return false;
    }
    OY_BLOCK[0][2] = oy_mesh_range_new;

    OY_BLOCK_STABILITY_KEEP.push(OY_BLOCK[0][2]);
    while (OY_BLOCK_STABILITY_KEEP.length>OY_BLOCK_STABILITY_LIMIT) OY_BLOCK_STABILITY_KEEP.shift();
    OY_BLOCK_STABILITY = (OY_BLOCK_STABILITY_KEEP.length<OY_BLOCK_STABILITY_TRIGGER)?0:oy_block_stability(OY_BLOCK_STABILITY_KEEP);
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
    oy_block[0][4] = OY_BLOCK_BOOT_MARK;
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
        oy_block[0][3] = Math.round(oy_block[0][3]*Math.max(1-OY_WORK_DELTA, Math.min(1+OY_WORK_DELTA, oy_calc_avg(oy_delta_array))));
        if (oy_block[0][3]<OY_WORK_MIN) oy_block[0][3] = OY_WORK_MIN;
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

    if (OY_BLOCK_BOOT!==false) {//transactions and fees are paused whilst the mesh calibrates its initial topology
        let oy_grade_array = [];
        for (let oy_key_public in oy_block[1]) {
            oy_grade_array.push(oy_block[1][oy_key_public][0]);
        }
        let oy_grade_median = oy_calc_median(oy_grade_array);

        for (let oy_key_public in oy_block[1]) {
            if (oy_block[1][oy_key_public][0]>=oy_grade_median) oy_block[1][oy_key_public][1] = 1;
        }
        return true;
    }

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

    let oy_grade_array = [];
    for (let oy_key_public in oy_block[1]) {
        oy_grade_array.push(oy_block[1][oy_key_public][0]);
    }
    let oy_grade_median = oy_calc_median(oy_grade_array);

    oy_dive_bounty += OY_AKOYA_ISSUANCE;
    for (let oy_key_public in oy_block[1]) {
        if (typeof(oy_block[4][oy_key_public])==="undefined") oy_block[4][oy_key_public] = 0;
        //if (oy_jump_flag===false&&oy_dive_reward===oy_dive_reward_pool[i]) OY_BLOCK_DIVE_TRACK += oy_dive_share;TODO track self dive earnings
        oy_block[4][oy_key_public] += Math.floor(oy_dive_bounty*(oy_block[1][oy_key_public][0]/oy_block[0][7]));//payout from meshblock maintenance fees and issuance
        oy_block[4][oy_key_public] += oy_block[1][oy_key_public][3];//payout from command transact fees
        if (oy_block[1][oy_key_public][0]>=oy_grade_median) oy_block[1][oy_key_public][1] = 1;
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
            OY_WORK_BITS[i] = oy_hash_gen(OY_BLOCK_NEXT+OY_SELF_PUBLIC+OY_BLOCK_HASH+i).substr(0, OY_WORK_MATCH);
        }
        oy_worker_process(0, false, [true, -1, null, OY_BLOCK_METAHASH, OY_SELF_SHORT])
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
        OY_BLOCK_RECORD_KEEP.push(oy_time()-OY_BLOCK_RECORD);
        while (OY_BLOCK_RECORD_KEEP.length>OY_BLOCK_RECORD_LIMIT) OY_BLOCK_RECORD_KEEP.shift();
    }
    OY_BLOCK_FINISH = true;
    //oy_log(JSON.stringify(OY_BLOCK));
}

//initialize oyster mesh boot up sequence
function oy_init(oy_console) {
    if (typeof(oy_console)==="function") {
        console.log("[OYSTER][CONSOLE][REDIRECT]");
        OY_CONSOLE = oy_console;
    }
    if (OY_INIT===true) {
        console.log("[ERROR]["+chalk.bolder("INIT_DUPLICATE")+"]", true);
        return false;
    }
    OY_INIT = true;
    if (OY_NODE_STATE===true) {
        chalk = require('chalk');
        chalk.bolder = function(input) {return (OY_NODE_STATE===true)?chalk.bold(input):input;}
        os = require('os');
        nacl = require('tweetnacl');
        nacl.util = require('tweetnacl-util');
        keccak256 = require('js-sha3').keccak256;
        LZString = require('lz-string');
        Worker = require('worker_threads').Worker;
        NodeEvent = require('events');
        perf = {now: function() {let end = process.hrtime();return Math.round((end[0]*1000) + (end[1]/1000000));}}
        XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
        globalThis.Blob = require("cross-blob");
        isMainThread = require('worker_threads').isMainThread;
        websock = require('ws');
        if (OY_SIMULATOR_MODE===false) {
            SimplePeer = require('simple-peer');
            wrtc = require('wrtc');
        }
    }
    else {
        websock = WebSocket;
        perf = performance;
        if (OY_SIMULATOR_MODE===true) {
            oy_log("[ERROR]["+chalk.bolder("SIMULATOR_ENABLED")+"]", 2);
            return false;
        }
        if (OY_FULL_INTRO!==false) {
            oy_log("[ERROR]["+chalk.bolder("INTRO_ENABLED")+"]", 2);
            return false;
        }
    }

    if (OY_SELF_PUBLIC===null) {
        let oy_key_pair = oy_key_gen();
        OY_SELF_PRIVATE = oy_key_pair[0];
        OY_SELF_PUBLIC = oy_key_pair[1];
        OY_SELF_SHORT = oy_short(OY_SELF_PUBLIC);
    }
    OY_PROPOSED = {};

    oy_worker_spawn(0);

    //EVENTS
    oy_event_create("oy_peers_null", oy_block_reset);//trigger-able event for when peer_count == 0
    oy_event_create("oy_peers_recover");//trigger-able event for when peer_count > 0
    oy_event_create("oy_block_init");//trigger-able event for when a new block is issued
    oy_event_create("oy_block_trigger");//trigger-able event for when a new block is issued
    oy_event_create("oy_block_reset");//trigger-able event for when a new block is issued
    oy_event_create("oy_state_blank");//trigger-able event for when self becomes blank
    oy_event_create("oy_state_light");//trigger-able event for when self becomes a light node
    oy_event_create("oy_state_full");//trigger-able event for when self becomes a full node

    let oy_key_rand = oy_rand_gen(32);
    if (!oy_key_verify(OY_SELF_PUBLIC, oy_key_sign(OY_SELF_PRIVATE, oy_key_rand, true), oy_key_rand, true)) {
        oy_log("[ERROR]["+chalk.bolder("KEY_INVALID")+"]", 2);
        return false;
    }
    if (OY_LIGHT_MODE===true&&OY_FULL_INTRO!==false) {
        oy_log("[ERROR]["+chalk.bolder("LIGHT_INTRO_INVALID")+"]", 2);
        return false;
    }
    if (OY_PEER_INFLATE[0]+OY_PEER_INFLATE[1]>=OY_NODE_MAX) {
        oy_log("[ERROR]["+chalk.bolder("PEER_INFLATE_INVALID")+"]", 2);
        return false;
    }
    if (OY_NODE_STATE===true&&typeof(process.argv[2])!=="undefined") OY_FULL_INTRO = process.argv[2];
    if (OY_FULL_INTRO!==false&&!oy_intro_check(OY_FULL_INTRO)) {
        oy_log("[ERROR]["+chalk.bolder("FULL_INTRO_INVALID")+"]", 2);
        return false;
    }
    for (let oy_intro_select in OY_INTRO_DEFAULT) {
        if (!oy_intro_check(oy_intro_select)||!oy_key_check(OY_INTRO_DEFAULT[oy_intro_select])) {
            oy_log("[ERROR]["+chalk.bolder("INTRO_DEFAULT_INVALID")+"]", 2);
            return false;
        }
    }
    if (typeof(OY_INTRO_DEFAULT[OY_INTRO_BOOT])==="undefined") {
        oy_log("[ERROR]["+chalk.bolder("INTRO_BOOT_INVALID")+"]", 2);
        return false;
    }

    let oy_boot_msg = "[OYSTER]["+chalk.bolder(OY_MESH_DYNASTY)+"]["+chalk.bolder(OY_SELF_SHORT)+"]["+chalk.bolder(OY_FULL_INTRO)+"]";
    if (OY_PASSIVE_MODE===true) console.log("[PASSIVE]"+oy_boot_msg);
    else oy_log(oy_boot_msg, 1);

    if (OY_SIMULATOR_MODE===true) {
        if (OY_VERBOSE_MODE===true) oy_log("[OYSTER][SIMULATOR][LOAD]"+chalk.bolder(JSON.stringify([OY_SIMULATOR_SKEW, OY_LIGHT_MODE, OY_FULL_INTRO])), 1);
        parentPort.postMessage([6, OY_SELF_PUBLIC, OY_FULL_INTRO]);
    }

    /*TODO nodejs DB integration
    //Dexie.delete("oy_db");
    OY_DB = new Dexie("oy_db");
    OY_DB.version(1).stores({
        oy_local:"oy_local_key",
        oy_data:"oy_data_key,oy_data_time"
    });
    */

    let oy_time_local = oy_time();
    if (oy_time_local<OY_BLOCK_BOOT_MARK) OY_BLOCK_BOOT = null;
    else OY_BLOCK_BOOT = oy_time_local-OY_BLOCK_BOOT_MARK<OY_BLOCK_BOOT_BUFFER;

    oy_block_engine();
    oy_event_dispatch("oy_state_blank");

    if (OY_FULL_INTRO!==false&&OY_SIMULATOR_MODE===false) {
        oy_log("[INTRO_MODE]["+chalk.bolder(OY_FULL_INTRO)+"]", 1);

        const fs = require('fs');
        const https = require('https');

        let privateKey = fs.readFileSync('/etc/letsencrypt/live/vnode1.oyster.org/privkey.pem', 'utf8');
        let certificate = fs.readFileSync('/etc/letsencrypt/live/vnode1.oyster.org/fullchain.pem', 'utf8');

        let credentials = {key:privateKey, cert:certificate};

        let httpsServer = https.createServer(credentials);
        httpsServer.listen(parseInt(OY_FULL_INTRO.split(":")[1]));

        let wss = new websock.Server({
            server: httpsServer
        });

        wss.on('connection', function(ws) {
            ws.on('message', function(oy_data_raw) {
                console.log('received: %s', oy_data_raw);
                let oy_soak_result = oy_intro_soak(ws._socket.remoteAddress, oy_data_raw);
                if (oy_soak_result!==false) ws.send(oy_soak_result);
                ws.close();
            });
        });
    }
}
if (OY_NODE_STATE===true) {
    if (isMainThread) oy_init();
    else {
        parentPort.on('message', (oy_data) => {
            let [oy_sim_type, oy_sim_node, oy_sim_data, oy_sim_intro] = oy_data;

            if (oy_sim_type===0) oy_data_soak(oy_sim_node, oy_sim_data);
            else if (oy_sim_type===1) {
                let oy_soak_result = oy_intro_soak(oy_sim_node, oy_sim_data);
                if (oy_soak_result!==false&&typeof(oy_sim_intro)!=="undefined"&&oy_sim_intro[0]===OY_FULL_INTRO) parentPort.postMessage([2, oy_sim_node, oy_soak_result, oy_sim_intro]);
            }
            else if (oy_sim_type===2) {
                if (typeof(OY_SIMULATOR_CALLBACK[oy_sim_intro[1]])!=="undefined") {
                    try {
                        let [oy_data_flag, oy_data_payload] = JSON.parse(oy_sim_data);
                        if (oy_data_flag==="OY_INTRO_UNREADY") {
                            if (OY_BLOCK_BOOT===false&&OY_SIMULATOR_CALLBACK[oy_sim_intro[1]][0]!=="OY_INTRO_TIME") oy_intro_punish(OY_SIMULATOR_CALLBACK[oy_sim_intro[1]][1]);
                        }
                        else if (OY_SIMULATOR_CALLBACK[oy_sim_intro[1]][2]!==null) OY_SIMULATOR_CALLBACK[oy_sim_intro[1]][2](oy_data_flag, oy_data_payload);
                        delete OY_SIMULATOR_CALLBACK[oy_sim_intro[1]];
                    }
                    catch(e) {
                        console.log(e);
                    }
                }
            }
            else if (oy_sim_type===3) oy_node_initiate(oy_sim_node);
            else if (oy_sim_type===4) {
                if (oy_sim_node==="OY_SIM_SET") {
                    OY_SIMULATOR_MODE = true;
                    OY_SIMULATOR_SKEW = oy_sim_data[0][0];
                    OY_LIGHT_MODE = oy_sim_data[0][1];
                    OY_FULL_INTRO = oy_sim_data[0][2];
                    if (oy_sim_data[0][3]!==null) {
                        OY_SELF_PRIVATE = oy_sim_data[0][3][0];
                        OY_SELF_PUBLIC = oy_sim_data[0][3][1];
                        OY_SELF_SHORT = oy_short(OY_SELF_PUBLIC);
                    }
                    for (let oy_var in oy_sim_data[1]) {
                        if (oy_var==="OY_PASSIVE_MODE") OY_PASSIVE_MODE = oy_sim_data[1][oy_var];
                        else if (oy_var==="OY_VERBOSE_MODE") OY_VERBOSE_MODE = oy_sim_data[1][oy_var];
                        else if (oy_var==="OY_BLOCK_BOOT_MARK") OY_BLOCK_BOOT_MARK = oy_sim_data[1][oy_var];
                        else if (oy_var==="OY_INTRO_BOOT") OY_INTRO_BOOT = oy_sim_data[1][oy_var];
                        else if (oy_var==="OY_INTRO_DEFAULT") OY_INTRO_DEFAULT = oy_sim_data[1][oy_var];
                        else if (oy_var==="OY_LATENCY_SIZE") OY_LATENCY_SIZE = oy_sim_data[1][oy_var];
                        else if (oy_var==="OY_LATENCY_GEO_MIN") OY_LATENCY_GEO_MIN = oy_sim_data[1][oy_var];
                        else if (oy_var==="OY_LATENCY_GEO_DIVISOR") OY_LATENCY_GEO_DIVISOR = oy_sim_data[1][oy_var];
                    }
                    oy_init();
                }
                else if (oy_sim_node==="OY_SIM_KILL") {

                }
            }
        });
        parentPort.postMessage([5, null, null]);
    }
}

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