<?php
header("Access-Control-Allow-Origin: *");
$oy_node_id = str_replace("oy_node_id=", "", file_get_contents("php://input"));
if (!$oy_node_id||!oy_node_valid($oy_node_id)) die("ERROR: Invalid node ID");

function oy_node_valid($oy_node_id) {
    if (strlen($oy_node_id)==40) return true;
    return false;
}

if (!is_dir("/dev/shm/oy_nodes")) mkdir("/dev/shm/oy_nodes");

if (is_file("/dev/shm/oy_nodes/".$_SERVER['REMOTE_ADDR'].".node")&&(time()-filemtime("/dev/shm/oy_nodes/".$_SERVER['REMOTE_ADDR'].".node")) < 10) die("ERROR: Asked too early");

//chance of DB failing > chance of filesystem failing, data persistence is not needed here anyways
//if central gets more complex might switch to a DB down the road
$fh = fopen("/dev/shm/oy_nodes/".$_SERVER['REMOTE_ADDR'].".node", "w");
fwrite($fh, $oy_node_id);
fclose($fh);

if ($fh = opendir("/dev/shm/oy_nodes")) {
    while (($oy_file = readdir($fh))!==false) {
        if ((time()-filemtime("/dev/shm/oy_nodes/".$oy_file)) >= 240) {
            if (preg_match('/\.node$/i', $oy_file)) unlink("/dev/shm/oy_nodes/".$oy_file);
        }
    }
}
closedir($fh);

$oy_node_array = glob("/dev/shm/oy_nodes/*.node");
$oy_node_key_array = array_rand($oy_node_array, 3);
$oy_node_send = array();
foreach ($oy_node_key_array as $oy_node_key_unique) {
    if ($oy_node_array[$oy_node_key_unique]=="/dev/shm/oy_nodes/".$_SERVER['REMOTE_ADDR'].".node") continue;
    $oy_node_send[] = file_get_contents($oy_node_array[$oy_node_key_unique]);
}
echo json_encode($oy_node_send);