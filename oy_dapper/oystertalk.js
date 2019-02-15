function ot_render(oy_broadcast_hash, oy_render_payload) {
    if (document.getElementById("ot_render_"+oy_broadcast_hash)) {
        console.log(oy_broadcast_hash+" was already rendered");
        return false;
    }

    let oy_render_stats;

    if (oy_render_payload[0]===null) oy_render_stats = "S"+oy_render_payload[7].length;
    else if (oy_render_payload[5]===window.OY_WALLET_PUBLIC) oy_render_stats = "<span id='ot_render_stats_echo_"+oy_broadcast_hash+"' style='color:indianred'>E0</span>";
    else oy_render_stats = "H"+oy_render_payload[0].length;

    oy_render_stats += "&nbsp;/&nbsp;"+ot_time_print(oy_render_payload[6]);

    let oy_panel_color;
    if (oy_render_payload[5]===window.OY_KEY_BRUNO) oy_panel_color = "#7bb3ee";
    else if (oy_render_payload[5]===window.OY_WALLET_PUBLIC) oy_panel_color = "#c2c2c2";
    else oy_panel_color = "#d6d6d6";
    let oy_element_html = "<div style='position:relative;'><div id='ot_render_avatar_"+oy_broadcast_hash+"' style='position:absolute;left:0;top:0;width:4vh;height:4vh;background-color: #2a2a2a'></div><div style='position:relative;top:0;left:calc(4vh + 1.5%);padding:0.5vh 1vh;border-radius:0.15vh;background-color: "+oy_panel_color+";color:#000000;min-height:3vh;display: inline-flex;align-items: center;'><div>"+oy_render_payload[3]+"</div><div style='position:absolute;right:0;top:50%;transform: translate(calc(100% + 0.8vh), -50%);font-size:0.9vh;color: #dbdbdb'>[<span id='ot_render_stats_"+oy_broadcast_hash+"'>"+oy_render_stats+"</span>]</div></div></div><br>";

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

    window.OT_RENDER_KEEP.push([oy_broadcast_hash, oy_render_payload[6]]);
    window.OT_RENDER_KEEP.sort(function(a, b) {
        return b[1] - a[1];
    });
    document.getElementById("ot_render_cont").scrollTo(0, document.getElementById("ot_render_cont").scrollHeight);
}

function ot_time_print(ot_time) {
    let d = new Date(ot_time * 1000),	// Convert the passed timestamp to milliseconds
        dd = d.getDate(),
        hh = d.getHours(),
        h = hh,
        min = ('0' + d.getMinutes()).slice(-2),
        ampm = 'AM';
    if (hh > 12) {
        h = hh - 12;
        ampm = 'PM';
    }
    else if (hh===12) {
        h = 12;
        ampm = 'PM';
    }
    else if (hh === 0) h = 12;
    let z = "th";
    if (dd===1) z = "st";
    else if (dd===2) z = "nd";
    else if (dd===3) z = "rd";
    return dd+z+"&nbsp;/&nbsp;"+h+":"+min+'&nbsp;'+ampm;
}

function ot_input() {
    if (document.getElementById("ot_broadcast_input").value.length===0||window.OT_BROADCAST_FREEZE===true) {
        document.getElementById("ot_broadcast_button").classList.remove("oy_button_broadcast_active");
        document.getElementById("ot_broadcast_button").classList.add("oy_button_all_dull");
    }
    else {
        document.getElementById("ot_broadcast_button").classList.remove("oy_button_all_dull");
        document.getElementById("ot_broadcast_button").classList.add("oy_button_broadcast_active");
    }
}

function ot_broadcast() {
    if (document.getElementById("ot_broadcast_button").classList.contains("oy_button_all_dull")) return false;

    let oy_broadcast_msg = document.getElementById("ot_broadcast_input").value;
    if (oy_broadcast_msg.length===0) return false;
    oy_broadcast_msg = oy_broadcast_msg.replace(/(?:\r\n|\r|\n)/g, "<br>");

    document.getElementById("ot_broadcast_input").value = "";
    document.getElementById("ot_broadcast_button").classList.remove("oy_button_broadcast_active");
    document.getElementById("ot_broadcast_button").classList.add("oy_button_all_dull");

    if (window.OY_WALLET_PUBLIC!==window.OY_KEY_BRUNO) ot_broadcast_freeze();//TODO use main protocol function which uses space optimization

    oy_channel_broadcast(window.OT_CHANNEL_ID, oy_broadcast_msg, window.OY_WALLET_PRIVATE, window.OY_WALLET_PUBLIC, function(oy_broadcast_hash, oy_render_payload) {
        ot_render(oy_broadcast_hash, oy_render_payload);
    }, function(oy_broadcast_hash) {
        let ot_render_stats_object = document.getElementById("ot_render_stats_echo_"+oy_broadcast_hash);
        if (ot_render_stats_object) {
            ot_render_stats_object.innerHTML = "E"+(parseInt(ot_render_stats_object.innerHTML.substr(1))+1);
            ot_render_stats_object.style.color = null;
        }
    });
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
    if (typeof(window.OY_BLOCK[2][window.OT_CHANNEL_ID])==="undefined") return false;
    if (window.OY_WALLET_PUBLIC!==null&&(window.OY_BLOCK[2][window.OT_CHANNEL_ID][2].indexOf(window.OY_WALLET_PUBLIC)!==-1||window.OY_BLOCK[2][window.OT_CHANNEL_ID][3].indexOf(window.OY_WALLET_PUBLIC)!==-1)) {//TODO use main protocol function which uses space optimization
        oy_channel_listen(window.OT_CHANNEL_ID,function(oy_broadcast_hash, oy_render_payload) {
            ot_render(oy_broadcast_hash, oy_render_payload);
        }, window.OY_WALLET_PRIVATE, window.OY_WALLET_PUBLIC);
        document.getElementById("ot_bar_cover").style.display = "none";
    }
    else {
        oy_channel_listen(window.OT_CHANNEL_ID, function(oy_broadcast_hash, oy_render_payload) {
            ot_render(oy_broadcast_hash, oy_render_payload);
        });
        document.getElementById("ot_bar_cover").style.display = "block";
    }
}

function ot_load() {
    if (window.OY_WALLET_PUBLIC!==null) {
        oy_avatar_gen(window.OY_WALLET_PUBLIC, document.getElementById("ot_broadcast_avatar_cont"));
        document.getElementById("ot_wallet_load_cont").style.display = "none";
        document.getElementById("ot_approval_cont").style.display = "block";

        if (typeof(window.OY_BLOCK[2][window.OT_CHANNEL_ID])!=="undefined") ot_approve();
    }
}

function ot_peers_resume() {
    if (window.OT_PEERS_NULL===false) return false;
    window.OT_PEERS_NULL = false;
    document.getElementById("ot_peers_null").style.display = "none";
    document.getElementById("ot_rebuild_progress").style.display = "block";
    document.getElementById("ot_rebuild_progress_inner").style.transition = null;
    document.getElementById("ot_rebuild_progress_inner").style.width = "90%";
    document.getElementById("ot_rebuild_progress_inner").style.transition = "width "+(window.OY_CHANNEL_KEEPTIME*1.4)+"s linear";
    setTimeout(function() {
        document.getElementById("ot_rebuild_progress_inner").style.width = "0";
    }, 100);
    setTimeout(function() {
        if (window.OT_PEERS_NULL===true) return false;
        document.getElementById("ot_rebuild_progress").style.display = "none";
    }, (window.OY_CHANNEL_KEEPTIME*1.4*1000)+100);
}

function ot_peers_halt() {
    if (window.OT_PEERS_NULL===true) return false;
    window.OT_PEERS_NULL = true;
    document.getElementById("ot_peers_null").style.display = "block";
    document.getElementById("ot_rebuild_progress").style.display = "none";
}

function ot_close() {
    document.removeEventListener("oy_block_trigger", ot_approve, false);
    document.removeEventListener("oy_peers_null", ot_peers_halt, false);
    document.removeEventListener("oy_peers_recover", ot_peers_resume, false);
    document.removeEventListener("oy_key_enter", ot_broadcast, false);
    oy_channel_mute(window.OT_CHANNEL_ID);
}

function ot_init() {
    window.OT_CHANNEL_ID = "936e62ced6eac3b08e236a9623929dbb9564bef0";

    window.OT_RENDER_KEEP = [];
    window.OT_PEERS_NULL = null;
    window.OT_BROADCAST_FREEZE = false;

    oy_channel_listen(window.OT_CHANNEL_ID, function(oy_broadcast_hash, oy_render_payload) {
        ot_render(oy_broadcast_hash, oy_render_payload);
    });
    document.getElementById("ot_bar_cover").style.display = "block";

    console.log(window.OY_PEER_COUNT);
    if (window.OY_PEER_COUNT===0) ot_peers_halt();
    else ot_peers_resume();

    document.addEventListener("oy_block_trigger", ot_approve, false);
    document.addEventListener("oy_peers_null", ot_peers_halt, false);
    document.addEventListener("oy_peers_recover", ot_peers_resume, false);
    document.addEventListener("oy_key_enter", ot_broadcast, false);
}