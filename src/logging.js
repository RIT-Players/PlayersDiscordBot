const winston = require('winston');

// winston configuration
const config = {
    file: {
        level: 'info',
        filename: 'players.log',
        handleExceptions: true,
        json: true,
        format: winston.format.combine(
            winston.format.splat(),
            winston.format.json()
        ),
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
    },
    console: {
        level: 'debug',
        handleExceptions: true,
        format: winston.format.combine(
            winston.format.splat(),
            winston.format.simple()
        ),
        json: false,
        colorize: true,
    }
};

// winston logger
exports.logger = winston.createLogger({
    transports: [
        new winston.transports.File(config.file),
        new winston.transports.Console(config.console)
    ]
});