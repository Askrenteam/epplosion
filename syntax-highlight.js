const green = "\x1b[32m";
const purple = "\x1b[35m";
const blue = "\x1b[36m";
const nocolor = "\x1b[0m"

const highlight = code =>
    code.replace(
        /<(\/?\w+)(.*?)>/g,
        `${green}<${blue}$1${purple}$2${green}>${nocolor}`
    );

module.exports = highlight;