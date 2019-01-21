<?php
header("Access-Control-Allow-Origin: *");
$oy_peer_report = str_replace("oy_peer_report=", "", file_get_contents("php://input"));
if (!$oy_peer_report||strlen($oy_peer_report)>50000) die("ERROR: Invalid input, input length: ".strlen($oy_peer_report));

if (is_file("/dev/shm/oy_peers/".$_SERVER['REMOTE_ADDR'].".peer")&&(time()-filemtime("/dev/shm/oy_peers/".$_SERVER['REMOTE_ADDR'].".peer")) < 10) die("ERROR: Told too early");

function oy_node_valid($oy_node_id) {
    if (strlen($oy_node_id)==171) return true;
    return false;
}

if (!is_dir("/dev/shm/oy_peers")) mkdir("/dev/shm/oy_peers");

$fh = fopen("/dev/shm/oy_peers/".$_SERVER['REMOTE_ADDR'].".peer", "w");
fwrite($fh, $oy_peer_report);
fclose($fh);

if ($fh = opendir("/dev/shm/oy_peers")) {
    while (($oy_file = readdir($fh))!==false) {
        if ((time()-filemtime("/dev/shm/oy_peers/".$oy_file)) >= 15) {
            if (preg_match('/\.peer$/i', $oy_file)) unlink("/dev/shm/oy_peers/".$oy_file);
        }
    }
}
closedir($fh);
echo "OY_REPORT_SUCCESS";