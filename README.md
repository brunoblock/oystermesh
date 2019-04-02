# Oyster

Bandwidth Bound Consensus.

## The Mesh

The Oyster Mesh Protocol provides:

- Decentralized and immutable data storage, hosting, retrieval and sharing.
- Akoya: a peer-to-peer decentralized, deflationary currency with a 20 second confirmation time, sustainable low-energy consumption, no mining, and no transaction fees. 
- Automated geolocation-aware load balancing of data.
- Proof of Latency (PoL) anti-spam mechanism has low and sustainable CPU/energy requirements.
- Implicitly DDOS-proof data hosting; service denial requires physical proximity to the data’s location whilst the location is obfuscated.
- Built-in redundancy algorithm maintains data integrity without counter-party risk.
- Secure and untraceable access to data like a decentralized VPN.
- Decentralized application (dApp) platform to run immutable JavaScript code.
- Peer-to-peer topology forms a node mesh which can circumvent centralized legacy communication lines.
- Efficient data routing between any devices across the mesh via swarm intelligence.
- IoT-compatible ultra-low power consumption; anti-spam and integrity-upkeep mechanisms consume network bandwidth instead of CPU cycles.
- Decentralized GPS (DGPS) system allows trust-less location triangulation.
- Decentralized .mesh domain name resolving system.

## Browser Support

###Firefox
Firefox is the best browser to run Oyster. Connections are stable and CPU usage is minimal. I have noticed that, rarely, Oyster will run sluggishly after 12+ hrs of running continuously in Firefox and restarting the browser is the only solution. Make sure to use the latest stable version of Firefox.

###Chrome
Chrome runs Oyster fine for 1 hour or less. There is a known bug in chrome that affects all webrtc projects: https://bugs.chromium.org/p/chromium/issues/detail?id=825576. This bug will cause new webrtc connections to fail after ~1.5hrs of continuous use without a refresh. Otherwise Chrome works fine albiet with slightly heavier CPU usage than Firefox.

###Safari
Oyster runs fine in Safari on both macOS and iOS devices. However, I have noticed a bug where after some heavy usage your node will become unable to make new connections, and only restarting the browser solves the problem. The front-end interface has not been optimizes for mobile devices so it may render somewhat inelegantly.

## License
This project is licensed under GNU GPLv3 - see the [LICENSE.md](LICENSE.md) file for details.