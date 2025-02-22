const { createLogger, format, transports } = require("winston");

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
  ),
  transports: [
    //run logs on console
    new transports.Console(),
    //save logs on file
    new transports.File({ filename: "logs/activity.log" }),
  ],
});

module.exports = logger;
