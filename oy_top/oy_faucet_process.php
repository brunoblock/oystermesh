<?php
header("Access-Control-Allow-Origin: *");
$oy_process_key_array = ["KEY1", "KEY2", "KEY3"];
$oy_process_key = str_replace("oy_process_key=", "", file_get_contents("php://input"));
if (!$oy_process_key||!in_array($oy_process_key, $oy_process_key_array)) die("ERROR: Invalid process key");

$oy_send_array = glob("/dev/shm/oy_faucet/*.send");
$oy_send_key_array = array_rand($oy_send_array, 1);
if ($oy_send_key_array===NULL) echo "OY_VOID";
else {
    echo file_get_contents($oy_send_array[$oy_send_key_array]);
    unlink($oy_send_array[$oy_send_key_array]);
}