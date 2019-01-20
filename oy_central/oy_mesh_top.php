<?php
header("Access-Control-Allow-Origin: *");
$oy_mesh_top = [[], []];
$oy_mesh_keep = [];
$oy_mesh_file_array = glob("/dev/shm/oy_peers/*.peer");
foreach ($oy_mesh_file_array as $oy_mesh_file_unique) {
    $oy_mesh_data = json_decode(file_get_contents($oy_mesh_file_unique), true);
    //var_dump($oy_mesh_data);
    $oy_mesh_data[0] = sha1($oy_mesh_data[0]);
    $oy_mesh_top[0][] = $oy_mesh_data[0];
    $oy_mesh_keep[] = $oy_mesh_data;
}
foreach ($oy_mesh_keep as $oy_mesh_data) {
    foreach ($oy_mesh_data[1] as $oy_mesh_peer => $oy_null) {
        unset($oy_null);
        $oy_mesh_peer = sha1($oy_mesh_peer);
        if ($oy_mesh_peer!="oy_aggregate_node"&&in_array($oy_mesh_peer, $oy_mesh_top[0])) {
            $oy_mesh_top[1][] = [$oy_mesh_data[0], $oy_mesh_peer];
        }
    }
}
echo json_encode($oy_mesh_top);