<?php
if (php_sapi_name()!=="cli"||!isset($argv[1])) exit;

$ot_approved_array = json_decode(file_get_contents("/dev/shm/ot_approved.block"));

$ot_approved_new = [];
foreach ($ot_approved_array as $ot_approved_unique) {
    if ($ot_approved_unique!==$argv[1]) $ot_approved_new[] = $ot_approved_unique;
}

$fh = fopen("/dev/shm/ot_approved.block", "w");
fwrite($fh, json_encode($ot_approved_new));
fclose($fh);

echo count($ot_approved_array)." -> ".count($ot_approved_new)."\n";