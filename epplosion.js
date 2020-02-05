#! node
const net = require('net');
const readline = require('readline');

const green = "\x1b[32m";
const purple = "\x1b[35m";
const blue = "\x1b[36m";
const nocolor = "\x1b[0m"

const highlight = code =>
    code.replace(
        /<(\/?\w+)(.*?)>/g,
        `${green}<${blue}$1${purple}$2${green}>${nocolor}`
    );

const sock = net.connect({port: 7000, host: "localhost"});

sock.on("data", d => {
    console.log();
    console.log(highlight(d.slice(4).toLocaleString()));
});

const getLengthHeader = i => {
    i += 4;
    if (i > 2**32) {
        throw new Error("Message too long")
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
  
rl.on('line', line => {
    if (["quit", "q", "exit"].includes(line)) {
        sock.end;
        process.exit();
    }
    const buffer = Buffer.from(line.trim());
    sock.write(getLengthHeader(buffer.byteLength));
    sock.write(buffer);
});

