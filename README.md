# Oyster

Bandwidth Bound Consensus.

## The Mesh

NOTICE: The mesh is currently offline or inaccessible whilst V6 development is underway

The Oyster Mesh Protocol provides:

- Decentralized and immutable data storage, hosting, retrieval and sharing.
- Akoya: a peer-to-peer decentralized, currency with a 20-40 second confirmation time, sustainable low-energy consumption. 
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

## Akoya Digital Currency

Akoya wallet + node: https://oyster.org/#akoya

Akoya testnet faucet: https://top.oyster.org/oy_akoya_faucet.html

Akoya characteristics:
- 20-40 second confirmation time.
- Capable of high transaction throughput (TPS).
- Transactions cost nothing, no currency and no PoW. If you're light node has weak connectivity you can pay a fee to increase the chance that your transaction is processed.
- Microfee is deducted per wallet address per 20 seconds, fees are paid out to full nodes that are currently online and securing the Akoya ledger.
- Low energy consumption required to secure the network.
- Transaction history is retained actively for 3 hrs and can be validated 

Coin information:

- Akoya mainnet coins will have the symbol AKY
- AKYE is an ERC-20 token that is redeemable 1:1 with AKY
- AKYE is mainly used to allow compatibility with decentralized exchanges
- AKYE market: https://forkdelta.app/#!/trade/0x4c218ac55d53e9de63214f7dde5b4db2a5d48ed3-ETH
- AKYE contract address: 0x4C218ac55d53e9De63214f7DDE5B4dB2a5d48ED3
- AKYE contract decimals: 18

Akoya for personal/commercial financial transactions:
- Security is the most audit-able since the code runs live in your browser in an open-source state. Almost every other coin requires you to blindly trust a compiled binary executable. Coins, including Bitcoin, perpetually suffer from this problem - unlike Akoya.
- Akoya runs entirely in the browser, hence the wallet interface has the practicality of MEW whilst being fully decentralized.
- Fast and predictable transaction settlement. The system can tell you exactly when your transaction will get approved. No concerns of a low fee creating a stuck transaction. Within 40 seconds you will know for sure if your transaction was confirmed or not, delays are not possible.
- Akoya is a much better store of value than Bitcoin. Bitcoin cannibalizes its own marketcap by paying for colossal amounts of electricity to be spent. Akoya preserves its own marketcap by not paying million dollar electric bills, Akoya is an asset whilst Bitcoin is a liability.

Akoya for IoT Infrastructure:
- Nodes consume a negligible amount of electricity, hard disk space, and computer resources in general.
- The network is tolerant of nodes constantly going offline and online.
- Nodes that boot from a blank state can synchronize with the Akoya ledger in a matter of seconds (unlike Bitcoin/Ethereum which takes days).
- Zero transaction fees as a full node.
- High transaction throughput capabilities, will report on TPS results after more testing is performed.
- IoT companies will seek to monetize their infrastructure since connecting to the network earns Akoya.

## Website Monetization

Here is the fully functioning one line of code for website monetization:
```
<script id="oy.js" payout=“AKOYA_ADDRESS” src="https://oyster.org/oy.js"></script>
```

Instructions:

1. Go to https://oyster.org/#akoya and generate/load a wallet.
2. Copy the public key to your clipboard.
3. Replace AKOYA_ADDRESS with your public key.
4. Add the one line code to the `<head>` section of your website.

That’s all it takes. You can check your dive earnings by loading your wallet at https://oyster.org/#akoya.

Oyster only consumes a significant amount of bandwidth, CPU usage is negligible. In future revisions there will be more advanced features like disabling ads only if the script confirms that they are diving on the mesh, scripted consent notices etc.

Don’t forget that fees are paid per wallet, not per transaction, so if you dive once for only a tiny amount your small earnings will eventually get consumed by the reoccurring microfee. Also keep in mind that these are testnet coins, balances will get periodically reset.

## Data Push/Pull Example

Required files are oysterdepend.js (dependencies like PeerJS) and oystermesh.js (protocol logic):

```
<script src="oysterdepend.js"></script>
<script src="oystermesh.js"></script>
```
Example for pushing and then pulling data to/from the Oyster mesh:
```
function render(superhandle, data) {
    alert(data);//alert the data pulled from the mesh
}

function example() {
    let glue_count = 0;//track how many times the data has been stored on the mesh
    let callback = function() {//this callback is called when a data nonce (part) is confirmed as deposited on the mesh
        glue_count++;
        if (glue_count>=5) {//stop pushing when the data has been stored 5+ times on the mesh
            window.OY_DATA_PUSH[handle] = false;//stop pushing the data to the mesh by referencing the handle (data ID only, no decryption key included)
            oy_data_pull(superhandle, render);//pull the data from the mesh by referencing the superhandle (data ID + decryption key)
        }
    };

    let superhandle = oy_data_push("EXAMPLE-DATA-HERE", callback);//call protocol function to push data to mesh
    let handle = superhandle.split("@")[0].substr(0, 46);//superhandle is the key to identify and unlock the data, handle skips the decryption part and is used to manage threads
}

oy_init(example);//run example after oyster initializes via callback
```

See https://github.com/brunoblock/oystermesh/blob/master/example.html

## Browser Support

### Firefox

Firefox is the best browser to run Oyster. Connections are stable and CPU usage is minimal. I have noticed that, rarely, Oyster will run sluggishly after 12+ hrs of running continuously in Firefox and restarting the browser is the only solution. Make sure to use the latest stable version of Firefox.

### Chrome

Chrome runs Oyster fine for 1 hour or less. Chrome has a known bug that affects all webRTC projects: https://bugs.chromium.org/p/chromium/issues/detail?id=825576. This bug will cause new webRTC connections to fail after ~1.5hrs of continuous use without a refresh. Otherwise Chrome works fine albeit with slightly heavier CPU usage than Firefox.

### Safari

Safari used to work but was recently broken by a recent Apple update.

## Questions/Contact

Open a Github issue if you have any questions about the technology.

~~Join us at the mesh chat room: https://oyster.org/#oystertalk.mesh~~

## License
This project is licensed under GNU GPLv3 - see the [LICENSE.md](LICENSE.md) file for details.