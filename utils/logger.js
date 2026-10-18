
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');

const logFolder = path.join(__dirname, '../logs');

if (!fs.existsSync(logFolder)) {
    fs.mkdirSync(logFolder);
}

const logFile = fs.createWriteStream(
    path.join(logFolder, 'app.log'),
    { flags: 'a' }
);

const logger = morgan((tokens, req, res) => {
    const date = new Date().toISOString();
    const method = tokens.method(req, res);
    const status = tokens.status(req, res);

    return `${date} ${method} ${req.path} ${status}`;
}, {
    stream: logFile
});

module.exports = logger;