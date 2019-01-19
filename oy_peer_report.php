<?php
if (!isset($_POST['oy_peer_report'])) die("ERROR: Invalid input");

header("Access-Control-Allow-Origin: *");
function oy_node_valid($oy_node_id) {
    if (strlen($oy_node_id)==171) return true;
    return false;
}

$oy_peer_report = json_decode($_POST['oy_peer_report']);

if (!oy_node_valid($oy_peer_report[0])) die("ERROR: Invalid node ID");

if (!is_dir("/dev/shm/oy_peers")) mkdir("/dev/shm/oy_peers");

$fh = fopen("/dev/shm/oy_peers/".$_SERVER['REMOTE_ADDR'].".peer", "w");
fwrite($fh, $_POST['oy_peer_report']);
fclose($fh);