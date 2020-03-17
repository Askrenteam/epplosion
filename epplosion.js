#!/usr/bin/env node
const net = require('net');
const readline = require('readline');
const highlight = require('./syntax-highlight');

let serverOptions = {
    host: "localhost",
    port: 7000
}

const helpMessage =
`Epplosion - EPP Client
    -u --url\t URL of the EPP server
    -p --port\t port of the EPP server
    -h --help\t this help message
`
let args = process.argv.slice(2);
let arg;
while (arg = args.shift()) {
    switch (arg) {
        case "-u":
        case "--url":
            serverOptions.host = args.shift();
            break;
        case "-p":
        case "--port":
            serverOptions.port = parseInt(args.shift());
            break;
        case "-h":
        case "--help":
            console.log(helpMessage);
            process.exit();
        default:
            console.error(`unrecognised option : ${arg}`);
            process.exit(1);
    }
}

const sock = net.connect(serverOptions);
sock.on("data", d => {
    console.log();
    console.log(highlight(d.slice(4).toLocaleString()));
});
sock.on("error", e => {
    console.error(e);
    process.exit(1);
})

const getLengthHeader = i => {
    i += 4;
    if (i > 2**32) {
        console.error("Message too long");
        process.exit(1);
    }
    return Uint8Array.from([(i>>(3*8))&(2**8-1), 
        (i>>(2*8))&(2**8-1),
        (i>>(1*8))&(2**8-1),
        i&(2**8-1)]);
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true
});

rl.on('close', () => {
    sock.end();
    process.exit();
})
rl.on('line', line => {
    if (["quit", "q", "exit"].includes(line)) {
        sock.end();
        process.exit();
    }
    const buffer = Buffer.from(line.trim());
    sock.write(getLengthHeader(buffer.byteLength));
    sock.write(buffer);
});

