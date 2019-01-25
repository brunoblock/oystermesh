<?php
header("Access-Control-Allow-Origin: *");
//[0] is nodes, [1] is peer relationships [2] is stats
$oy_mesh_top = [[], [], [["oy_stat_avg_latency"=>[], "oy_stat_avg_peership"=>[], "oy_stat_mesh_size"=>0, "oy_stat_mesh_flow"=>0, "oy_stat_sector_count"=>[]], []]];
$oy_mesh_keep = [];
$oy_mesh_file_array = glob("/dev/shm/oy_peers/*.peer");
if (count($oy_mesh_file_array)<=2) die(json_encode($oy_mesh_top));
foreach ($oy_mesh_file_array as $oy_mesh_file_unique) {
    $oy_mesh_data = json_decode(file_get_contents($oy_mesh_file_unique), true);
    //var_dump($oy_mesh_data);
    $oy_mesh_data[0] = sha1($oy_mesh_data[0]);
    $oy_mesh_top[0][] = $oy_mesh_data[0];
    $oy_mesh_keep[] = $oy_mesh_data;
}
//TODO add type safety since JSON comes from untrusted sources
$oy_time_local = time();
$oy_punish_track = [];
foreach ($oy_mesh_keep as $oy_mesh_data) {
    foreach ($oy_mesh_data[1] as $oy_mesh_peer => $oy_peer_data) {
        $oy_mesh_peer = sha1($oy_mesh_peer);
        if ($oy_mesh_peer!="oy_aggregate_node"&&in_array($oy_mesh_peer, $oy_mesh_top[0])) {
            $oy_peer_add = true;
            foreach ($oy_mesh_top[1] as $oy_mesh_unique) {
                if ($oy_mesh_unique[0]===$oy_mesh_peer&&$oy_mesh_unique[1]===$oy_mesh_data[0]) {
                    $oy_peer_add = false;
                    break;
                }
            }
            if ($oy_peer_add===true) $oy_mesh_top[1][] = [$oy_mesh_data[0], $oy_mesh_peer];
            $oy_mesh_top[2][0]["oy_stat_avg_latency"][] = ($oy_peer_data[3]>0)?$oy_peer_data[3]:0;
            $oy_mesh_top[2][0]["oy_stat_avg_peership"][] = $oy_time_local-$oy_peer_data[0];
            $oy_mesh_top[2][0]["oy_stat_mesh_flow"] += ($oy_peer_data[5]+$oy_peer_data[7])/2;
        }
    }
    foreach ($oy_mesh_data[2] as $oy_mesh_blacklist) {
        foreach ($oy_mesh_blacklist[3] as $oy_punish_unique) {
            if (!isset($oy_punish_track[$oy_punish_unique])) $oy_punish_track[$oy_punish_unique] = 1;
            else $oy_punish_track[$oy_punish_unique]++;
        }
    }
}
$oy_mesh_top[2][0]["oy_stat_avg_latency"] = round(array_sum($oy_mesh_top[2][0]["oy_stat_avg_latency"])/count($oy_mesh_top[2][0]["oy_stat_avg_latency"]), 4);
$oy_mesh_top[2][0]["oy_stat_avg_peership"] = round((((array_sum($oy_mesh_top[2][0]["oy_stat_avg_peership"])/count($oy_mesh_top[2][0]["oy_stat_avg_peership"])/60)/60)/24), 2);
$oy_mesh_top[2][0]["oy_stat_mesh_size"] = count($oy_mesh_top[0]);
$oy_mesh_top[2][0]["oy_stat_mesh_flow"] = round($oy_mesh_top[2][0]["oy_stat_mesh_flow"]);
arsort($oy_punish_track);
$oy_punish_total = array_sum($oy_punish_track);
foreach ($oy_punish_track as $oy_punish_type => $oy_punish_count) {
    $oy_mesh_top[2][1][] = [str_replace("OY_PUNISH_", "", $oy_punish_type), $oy_punish_count, round(($oy_punish_count/$oy_punish_total)*100, 1)];
}
echo json_encode($oy_mesh_top);