#!/usr/bin/env bash
declare -a VNODES=(
"user@100.100.100.100"`#VNODE1`
"user@100.100.100.101"`#VNODE2`
"user@100.100.100.102"`#VNODE3`
)

for i in "${VNODES[@]}"
do
   if [[ "$1" != "boot" ]]; then
        scp /absolute_dir/oystermesh/oystermesh.js ${i}:/home/user/oystermesh
   fi
   if [[ "$1" != "shutdown" ]]; then
        ssh -o ConnectTimeout=3 ${i} reboot
   fi
done