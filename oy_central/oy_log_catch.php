<?php
header("Access-Control-Allow-Origin: *");
$oy_log_catch = json_decode(str_replace("oy_log_catch=", "", file_get_contents("php://input")));

if (!is_dir("/dev/shm/oy_logs")) mkdir("/dev/shm/oy_logs");

$fh = fopen("/dev/shm/oy_logs/".$oy_log_catch[0].".log", "a");
fwrite($fh, $oy_log_catch[1]."\n");
fclose($fh);