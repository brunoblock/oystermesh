function ot_render(oy_broadcast_hash, oy_render_payload) {
    if (oy_render_payload===null) {
        if (document.getElementById("ot_render_"+oy_broadcast_hash)) document.getElementById("ot_render").removeChild(document.getElementById("ot_render_"+oy_broadcast_hash));
        return true;
    }

    if (document.getElementById("ot_render_"+oy_broadcast_hash)) return false;

    let ot_render_opacity = "";
    let ot_render_stats;
    if (oy_render_payload[0]===null) ot_render_stats = "S"+oy_render_payload[8].length+"A"+oy_render_payload[7];
    else if (oy_render_payload[5]===window.OY_WALLET_PUBLIC) {
        ot_render_stats = "<span id='ot_render_stats_echo_"+oy_broadcast_hash+"' style='color:indianred'>E0</span>";
        ot_render_opacity = "opacity:0.5;";
    }
    else ot_render_stats = "H"+oy_render_payload[0].length;

    ot_render_stats += "&nbsp;/&nbsp;"+oy_time_print(oy_render_payload[6]);

    let ot_panel_color;
    if (oy_render_payload[5]===window.OY_KEY_BRUNO) ot_panel_color = window.OT_MSG_COLOR_BRUNO;
    else if (oy_render_payload[5]===window.OY_WALLET_PUBLIC) ot_panel_color = window.OT_MSG_COLOR_SELF;
    else ot_panel_color = window.OT_MSG_COLOR_MAIN;

    let ot_badge = "";
    if (oy_render_payload[5]===window.OY_KEY_BRUNO) ot_badge = "<div style='position:absolute;top:1.1vh;left:-3.1vh;opacity:0.8;border-radius:0.2vh;font-size:1vh;padding:0.12vh;transform:translate(-50%, -50%);background-color: #2f7dab;color:#dadada'>&nbsp;FOUNDER&nbsp;</div><div style='position:absolute;top:2.9vh;left:-3.1vh;opacity:0.8;border-radius:0.2vh;font-size:1vh;padding:0.12vh;transform:translate(-50%, -50%);background-color: #8b59ab;color:#dadada'>&nbsp;LEAD&nbsp;DEV&nbsp;</div>";
    else if (window.OY_BLOCK_TEMP[2][window.OT_CHANNEL_ID][2].indexOf(oy_render_payload[5])!==-1) ot_badge = "<div style='position:absolute;top:2vh;left:-2.3vh;opacity:0.8;border-radius:0.2vh;font-size:1.1vh;padding:0.12vh;transform:translate(-50%, -50%);background-color: #aba920;color:#dadada'>&nbsp;MOD&nbsp;</div>";

    let ot_append = "";
    let ot_reply = "";
    let ot_reply_hash;
    let ot_reply_key_public = null;
    if (oy_render_payload[3].substr(0, 9)==="OT_REPLY_") {
        ot_reply_hash = oy_render_payload[3].substr(9, 40);
        oy_render_payload[3] = oy_render_payload[3].substr(49);
        let ot_reply_array = ot_reply_render(oy_broadcast_hash, ot_reply_hash);
        if (!ot_reply_array) {
            ot_reply = "<div id='ot_recall_reply_"+window.OT_RECALL_REPLY_COUNTER+"'></div>";
            window.OT_RECALL_REPLY["ot_recall_reply_"+window.OT_RECALL_REPLY_COUNTER] = [oy_broadcast_hash, ot_reply_hash];
            window.OT_RECALL_REPLY_COUNTER++;
        }
        else {
            ot_reply_key_public = ot_reply_array[0];
            ot_reply = ot_reply_array[1];
            ot_append = "<br>";
        }
    }

    let oy_element_html = "<div id='ot_render_append_"+oy_broadcast_hash+"'>"+ot_append+"</div><div id='ot_render_cont_"+oy_broadcast_hash+"' style='position:relative;"+ot_render_opacity+"'>"+ot_badge+ot_reply+"<div id='ot_render_avatar_"+oy_broadcast_hash+"' style='position:absolute;left:0;top:0;width:4vh;height:4vh;background-color: #2a2a2a' onmouseover='this.style.cursor = \"pointer\"' onclick='ot_copy_key(this.id)'></div><div id='ot_render_public_key_"+oy_broadcast_hash+"' style='display:none;'>"+oy_render_payload[5]+"</div><div style='position:relative;top:0;left:calc(4vh + 1.5%);padding:0.5vh 1vh;border-radius:0.15vh;background-color: "+ot_panel_color+";color:#000000;min-height:3vh;display: inline-flex;align-items: center;' onmouseover='this.style.cursor = \"pointer\"' onclick='ot_reply(\""+oy_broadcast_hash+"\")'><div id='ot_render_content_"+oy_broadcast_hash+"' style='display:block;max-width:65vh;word-wrap: break-word;'>"+ot_superhandle_convert(oy_render_payload[3])+"</div><div style='position:absolute;right:0;top:50%;transform: translate(calc(100% + 0.8vh), -50%);font-size:0.9vh;color: #dbdbdb'>[<span id='ot_render_stats_"+oy_broadcast_hash+"'>"+ot_render_stats+"</span>]</div></div></div><br>";

    let oy_element = document.createElement("div");
    oy_element.setAttribute('id', "ot_render_"+oy_broadcast_hash);
    oy_element.innerHTML = oy_element_html;
    if (window.OT_RENDER_KEEP.length===0||oy_render_payload[6]>window.OT_RENDER_KEEP[0][1]) document.getElementById("ot_render").appendChild(oy_element);
    else {
        // noinspection JSUnusedAssignment
        let oy_hash_last = window.OT_RENDER_KEEP[0][0];
        for (let i in window.OT_RENDER_KEEP) {
            if (oy_render_payload[6]>window.OT_RENDER_KEEP[i][1]) break;
            oy_hash_last = window.OT_RENDER_KEEP[i][0];
        }
        document.getElementById("ot_render").insertBefore(oy_element, document.getElementById("ot_render_"+oy_hash_last));
    }
    oy_avatar_gen(oy_render_payload[5], document.getElementById("ot_render_avatar_"+oy_broadcast_hash));
    if (ot_reply_key_public!==null) oy_avatar_gen(ot_reply_key_public, document.getElementById("ot_reply_avatar_"+oy_broadcast_hash));

    window.OT_RENDER_KEEP.push([oy_broadcast_hash, oy_render_payload[6]]);
    window.OT_RENDER_KEEP.sort(function(a, b) {
        return b[1] - a[1];
    });

    if (document.getElementById("ot_scroll_jump").style.display==="none") document.getElementById("ot_render_cont").scrollTo(0, document.getElementById("ot_render_cont").scrollHeight);
}

function ot_input() {
    if (document.getElementById("ot_broadcast_input").value.length===0||window.OT_BROADCAST_FREEZE===true||window.OY_PEER_COUNT===0) {
        document.getElementById("ot_broadcast_button").classList.remove("oy_button_broadcast_active");
        document.getElementById("ot_broadcast_button").classList.add("oy_button_all_dull");
    }
    else {
        document.getElementById("ot_broadcast_button").classList.remove("oy_button_all_dull");
        document.getElementById("ot_broadcast_button").classList.add("oy_button_broadcast_active");
    }
    let ot_broadcast_limit = Math.floor(((oy_base_encode(document.getElementById("ot_broadcast_input").value).length/window.OY_CHANNEL_BROADCAST_PACKET_MAX)*100)/0.7);
    if (ot_broadcast_limit>=100) {
        document.getElementById("ot_broadcast_input").value = window.OT_INPUT_SNAPSHOT;
        ot_input();
        return true;
    }
    window.OT_INPUT_SNAPSHOT = document.getElementById("ot_broadcast_input").value;
    if (ot_broadcast_limit>=50) document.getElementById("ot_broadcast_limit").innerHTML = "["+ot_broadcast_limit+"%&nbsp;remaining]";
    else document.getElementById("ot_broadcast_limit").innerHTML = "";
    return true;
}

function ot_copy_key(oy_object_id) {
    document.getElementById("ot_copy_key_input").value = document.getElementById("ot_render_public_key_"+oy_object_id.substr(17)).innerHTML;
    document.getElementById("ot_copy_key_input").select();
    document.execCommand("copy");
}

function ot_superhandle_convert(ot_message) {
    if (oy_superhandle_check(ot_message)) {
        ot_message = "<div style='width:6vh;white-space:nowrap;background-color:#484848;color:#e1e1e1;overflow:hidden;display:inline-block' onmouseover='this.style.cursor = \"pointer\"' onclick='ot_superhandle_process(this.innerHTML);ot_reply_reset(true)'>"+ot_message+"</div>";
    }
    return ot_message;
}

function ot_superhandle_process(ot_superhandle) {
    document.getElementById("oy_pull_superhandle").value = ot_superhandle;
    oy_pull_reset_handle_blur();
    oy_tab("oy_tab_download");
    oy_pull_execute();
    document.getElementById("oy_dapper").style.opacity = "0.2";
    setTimeout(function() {
        document.getElementById("oy_dapper").style.opacity = "1";
    }, 4000);
}

function ot_reply(oy_broadcast_hash) {
    let ot_render_content_object = document.getElementById("ot_render_content_"+oy_broadcast_hash);
    if (!ot_render_content_object) return false;
    window.OT_REPLY = "OT_REPLY_"+oy_broadcast_hash;
    let ot_reply_public_key = document.getElementById("ot_render_public_key_"+oy_broadcast_hash).innerHTML;
    let ot_reply_color;
    if (ot_reply_public_key===window.OY_KEY_BRUNO) ot_reply_color = window.OT_MSG_COLOR_BRUNO;
    else if (ot_reply_public_key===window.OY_WALLET_PUBLIC) ot_reply_color = window.OT_MSG_COLOR_SELF;
    else ot_reply_color = window.OT_MSG_COLOR_MAIN;
    document.getElementById("ot_broadcast_reply").innerHTML = "<div id='ot_broadcast_reply_avatar_"+oy_broadcast_hash+"' style='position:absolute;top:0;left:0;width:1.9vh;height:1.9vh;transform:translateX(-100%)'></div><div style='background-color:"+ot_reply_color+";white-space: nowrap;overflow:hidden;padding:0.25vh 0.75vh;height:calc(100% - 0.5vh);display: inline-flex;align-items: center;max-width:100%;' onmouseover='this.style.cursor = \"pointer\"' onclick='ot_reply_reset()'>"+ot_render_content_object.innerHTML.replace(/<br>/g, "")+"</div>";
    document.getElementById("ot_broadcast_reply").style.display = "block";
    oy_avatar_gen(ot_reply_public_key, document.getElementById("ot_broadcast_reply_avatar_"+oy_broadcast_hash));

    document.getElementById("ot_broadcast_input").focus();
}

function ot_reply_render(oy_broadcast_hash, ot_reply_hash) {
    let ot_render_content_object = document.getElementById("ot_render_content_"+ot_reply_hash);
    if (!ot_render_content_object) return false;
    let ot_reply_key_public = document.getElementById("ot_render_public_key_"+ot_reply_hash).innerHTML;
    let ot_reply_color;
    if (ot_reply_key_public===window.OY_KEY_BRUNO) ot_reply_color = window.OT_MSG_COLOR_BRUNO;
    else if (ot_reply_key_public===window.OY_WALLET_PUBLIC) ot_reply_color = window.OT_MSG_COLOR_SELF;
    else ot_reply_color = window.OT_MSG_COLOR_MAIN;
    return [ot_reply_key_public, "<div style='position:absolute;top:0;left:7vh;transform: translateY(-100%);height:2.1vh;font-size:1.3vh;opacity:0.8;'><div id='ot_reply_avatar_"+oy_broadcast_hash+"' style='position:absolute;top:0;left:0;width:2.1vh;height:2.1vh;transform:translateX(-99%)'></div><div style='background-color:"+ot_reply_color+";color:#000000;white-space: nowrap;overflow:hidden;padding:0.25vh 0.75vh;height:calc(100% - 0.5vh);display: inline-flex;align-items: center;max-width:55vh;' onmouseover='this.style.cursor = \"pointer\"' onclick='ot_reply(\""+ot_reply_hash+"\")'>"+ot_render_content_object.innerHTML.replace(/<br>/g, "")+"</div></div>"];
}

function ot_reply_reset(ot_reply_delay) {
    if (typeof(ot_reply_delay)!=="undefined") setTimeout("ot_reply_reset()", 10);
    else {
        window.OT_REPLY = "";
        document.getElementById("ot_broadcast_reply").innerHTML = "";
        document.getElementById("ot_broadcast_reply").style.display = "none";
    }
}

function ot_scroll() {
    let ot_render = document.getElementById("ot_render_cont");
    if (ot_render.offsetHeight+ot_render.scrollTop===ot_render.scrollHeight||ot_render.offsetHeight+ot_render.scrollTop===ot_render.scrollHeight+1||ot_render.offsetHeight+ot_render.scrollTop===ot_render.scrollHeight-1) document.getElementById("ot_scroll_jump").style.display = "none";
    else document.getElementById("ot_scroll_jump").style.display = "block";
}

function ot_scroll_jump() {
    document.getElementById("ot_render_cont").scrollTo(0, document.getElementById("ot_render_cont").scrollHeight);
    document.getElementById("ot_scroll_jump").style.display = "none";
}

function ot_broadcast() {
    if (document.getElementById("ot_broadcast_button").classList.contains("oy_button_all_dull")) return false;

    let oy_broadcast_msg = document.getElementById("ot_broadcast_input").value;
    if (oy_broadcast_msg.length===0) return false;
    oy_broadcast_msg = window.OT_REPLY+linkifyStr(oy_broadcast_msg, {attributes:{onclick:"ot_reply_reset(true)"}}).replace(/(?:\r\n|\r|\n)/g, "<br>");

    ot_reply_reset();
    document.getElementById("ot_broadcast_input").value = "";
    document.getElementById("ot_broadcast_button").classList.remove("oy_button_broadcast_active");
    document.getElementById("ot_broadcast_button").classList.add("oy_button_all_dull");

    if (window.OY_WALLET_PUBLIC!==window.OY_KEY_BRUNO) ot_broadcast_freeze();

    oy_channel_broadcast(window.OT_CHANNEL_ID, oy_broadcast_msg, window.OY_WALLET_PRIVATE, window.OY_WALLET_PUBLIC, function(oy_broadcast_hash, oy_render_payload) {
        ot_render(oy_broadcast_hash, oy_render_payload);
    }, function(oy_broadcast_hash) {
        let ot_render_stats_object = document.getElementById("ot_render_stats_echo_"+oy_broadcast_hash);
        if (ot_render_stats_object) {
            ot_render_stats_object.innerHTML = "E"+(parseInt(ot_render_stats_object.innerHTML.substr(1))+1);
            ot_render_stats_object.style.color = null;
            document.getElementById("ot_render_cont_"+oy_broadcast_hash).style.opacity = "1";
        }
    });

    document.getElementById("ot_broadcast_input").focus();
}

function ot_broadcast_freeze(ot_count) {
    if (typeof(ot_count)==="undefined") {
        window.OT_BROADCAST_FREEZE = true;
        ot_count = 9;
    }
    else if (ot_count===0) {
        window.OT_BROADCAST_FREEZE = false;
        document.getElementById("ot_broadcast_button_inner").innerHTML = "&nbsp;&nbsp;BROADCAST&nbsp;&nbsp;";
        ot_input();
        return true;
    }
    document.getElementById("ot_broadcast_button_inner").innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;["+ot_count+"s]&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
    setTimeout(function() {
        ot_broadcast_freeze(ot_count-1);
    }, 1000);
}

function ot_join() {
    let oy_xhttp = new XMLHttpRequest();
    oy_xhttp.onreadystatechange = function() {
        if (this.readyState===4&&this.status===200) {
            document.getElementById("ot_approval_cont").style.display = "none";
            if (this.responseText.substr(0, 5)==="ERROR"||this.responseText.length===0) {
                document.getElementById("ot_message").innerHTML = this.responseText;
                document.getElementById("ot_message").style.display = "block";
                setTimeout(function() {
                    document.getElementById("ot_approval_cont").style.display = "block";
                    document.getElementById("ot_message").style.display = "none";
                    document.getElementById("ot_message").innerHTML = "";
                }, 3500);
            }
            else if (this.responseText==="OT_ADDED") {
                document.getElementById("ot_message").innerHTML = "Please wait, checking new block for approval...";
                document.getElementById("ot_message").style.display = "block";
            }
        }
    };
    oy_xhttp.open("POST", "https://top.oyster.org/ot_join.php", true);
    oy_xhttp.send("ot_key_public="+window.OY_WALLET_PUBLIC);
}

function ot_approve() {
    if (typeof(window.OY_BLOCK_TEMP[2][window.OT_CHANNEL_ID])==="undefined") return false;
    if (window.OY_WALLET_PUBLIC!==null&&oy_channel_approved(window.OT_CHANNEL_ID, window.OY_WALLET_PUBLIC)) {
        oy_channel_listen(window.OT_CHANNEL_ID, function(oy_broadcast_hash, oy_render_payload) {
            ot_render(oy_broadcast_hash, oy_render_payload);
        }, window.OY_WALLET_PRIVATE, window.OY_WALLET_PUBLIC);
        document.getElementById("ot_bar_cover").style.display = "none";
    }
    else {
        oy_channel_listen(window.OT_CHANNEL_ID, function(oy_broadcast_hash, oy_render_payload) {
            ot_render(oy_broadcast_hash, oy_render_payload);
        });
        document.getElementById("ot_bar_cover").style.display = "block";
        if (window.OY_WALLET_PUBLIC===null) {
            document.getElementById("ot_wallet_load_cont").style.display = "block";
            document.getElementById("ot_approval_cont").style.display = "none";
        }
    }
}

function ot_load() {
    if (window.OY_WALLET_PUBLIC!==null) {
        document.getElementById("ot_broadcast_avatar_cont").innerHTML = "";
        oy_avatar_gen(window.OY_WALLET_PUBLIC, document.getElementById("ot_broadcast_avatar_cont"));
        document.getElementById("ot_wallet_load_cont").style.display = "none";
        document.getElementById("ot_approval_cont").style.display = "block";
    }
    else {
        document.getElementById("ot_broadcast_avatar_cont").innerHTML = "";
        document.getElementById("ot_wallet_load_cont").style.display = "block";
        document.getElementById("ot_approval_cont").style.display = "none";
    }

    document.getElementById("ot_message").style.display = "none";
    document.getElementById("ot_message").innerHTML = "";

    if (typeof(window.OY_BLOCK_TEMP[2][window.OT_CHANNEL_ID])!=="undefined") ot_approve();
}

function ot_peers_resume() {
    if (window.OT_PEERS_NULL===false) return false;
    window.OT_PEERS_NULL = false;
    document.getElementById("ot_peers_null").style.display = "none";
    document.getElementById("ot_rebuild_progress").style.display = "block";
    document.getElementById("ot_rebuild_progress_inner").style.transition = null;
    document.getElementById("ot_rebuild_progress_inner").style.width = "90%";
    document.getElementById("ot_rebuild_progress_inner").style.transition = "width "+(window.OY_CHANNEL_RECOVERTIME*4)+"s linear";
    setTimeout(function() {
        document.getElementById("ot_rebuild_progress_inner").style.width = "0";
    }, 100);
    setTimeout(function() {
        if (window.OT_PEERS_NULL===true) return false;
        document.getElementById("ot_rebuild_progress").style.display = "none";
        document.getElementById("ot_channel_stats").style.display = "block";
    }, (window.OY_CHANNEL_RECOVERTIME*4*1000)+100);
}

function ot_peers_halt() {
    if (window.OT_PEERS_NULL===true) return false;
    window.OT_PEERS_NULL = true;
    document.getElementById("ot_peers_null").style.display = "block";
    document.getElementById("ot_rebuild_progress").style.display = "none";
    document.getElementById("ot_channel_stats").style.display = "none";
}

function ot_close() {
    document.removeEventListener("oy_maintain_trigger", ot_maintain, false);
    document.removeEventListener("oy_block_trigger_temp", ot_approve, false);
    document.removeEventListener("oy_peers_null", ot_peers_halt, false);
    document.removeEventListener("oy_peers_null", ot_input, false);
    document.removeEventListener("oy_peers_recover", ot_peers_resume, false);
    document.removeEventListener("oy_peers_recover", ot_input, false);
    document.removeEventListener("oy_key_enter", ot_broadcast, false);
    document.removeEventListener("oy_wallet_close", ot_load, false);

    document.getElementById("ot_channel_stats").innerHTML = "";
    document.getElementById("ot_channel_stats").style.display = "none";

    oy_channel_mute(window.OT_CHANNEL_ID);
}

function ot_maintain() {
    if (window.OY_BLOCK_HASH!==null&&typeof(window.OY_BLOCK_TEMP[2][window.OT_CHANNEL_ID])!=="undefined") {
        let ot_top_count = oy_channel_top_count(window.OT_CHANNEL_ID);

        if (window.OY_WALLET_PUBLIC!==null&&oy_channel_approved(window.OT_CHANNEL_ID, window.OY_WALLET_PUBLIC)) ot_top_count[0]++;
        else ot_top_count[1]++;

        document.getElementById("ot_channel_stats").innerHTML = "["+(window.OY_BLOCK_TEMP[2][window.OT_CHANNEL_ID][2].length+window.OY_BLOCK_TEMP[2][window.OT_CHANNEL_ID][3].length)+"&nbsp;members&nbsp;/&nbsp;"+ot_top_count[0]+"&nbsp;online&nbsp;/&nbsp;"+ot_top_count[1]+"&nbsp;watching]";
    }

    for (let ot_recall_reply in window.OT_RECALL_REPLY) {
        let ot_reply_array = ot_reply_render(window.OT_RECALL_REPLY[ot_recall_reply][0], window.OT_RECALL_REPLY[ot_recall_reply][1]);
        if (!!ot_reply_array) {
            document.getElementById("ot_render_append_"+window.OT_RECALL_REPLY[ot_recall_reply][0]).innerHTML = "<br>";
            document.getElementById(ot_recall_reply).innerHTML = ot_reply_array[1];
            oy_avatar_gen(ot_reply_array[0], document.getElementById("ot_reply_avatar_"+window.OT_RECALL_REPLY[ot_recall_reply][0]));
            if (document.getElementById("ot_scroll_jump").style.display==="none") document.getElementById("ot_render_cont").scrollTo(0, document.getElementById("ot_render_cont").scrollHeight);
            delete window.OT_RECALL_REPLY[ot_recall_reply];
        }
    }
}

function ot_init() {
    window.OT_CHANNEL_ID = "936e62ced6eac3b08e236a9623929dbb9564bef0";
    window.OT_MSG_COLOR_MAIN = "#d6d6d6";
    window.OT_MSG_COLOR_SELF = "#bbbbbb";
    window.OT_MSG_COLOR_BRUNO = "#7bb3ee";

    window.OT_RENDER_KEEP = [];
    window.OT_RECALL_REPLY = {};
    window.OT_RECALL_REPLY_COUNTER = 0;
    window.OT_APPROVED_KEEP = {};
    window.OT_INPUT_SNAPSHOT = "";
    window.OT_PEERS_NULL = null;
    window.OT_BROADCAST_FREEZE = false;
    window.OT_REPLY = "";

    oy_channel_listen(window.OT_CHANNEL_ID, function(oy_broadcast_hash, oy_render_payload) {
        ot_render(oy_broadcast_hash, oy_render_payload);
    });
    document.getElementById("ot_bar_cover").style.display = "block";
    ot_load();

    if (window.OY_PEER_COUNT===0) ot_peers_halt();
    else ot_peers_resume();

    document.addEventListener("oy_maintain_trigger", ot_maintain, false);
    document.addEventListener("oy_block_trigger_temp", ot_approve, false);
    document.addEventListener("oy_peers_null", ot_peers_halt, false);
    document.addEventListener("oy_peers_null", ot_input, false);
    document.addEventListener("oy_peers_recover", ot_peers_resume, false);
    document.addEventListener("oy_peers_recover", ot_input, false);
    document.addEventListener("oy_key_enter", ot_broadcast, false);
    document.addEventListener("oy_wallet_close", ot_load, false);

    document.getElementById("ot_render_cont").scrollTo(0, document.getElementById("ot_render_cont").scrollHeight);
}