const winston = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");
const config = require("./env.config");

const levels = {
  fatal: 0,
  error: 1,
  warning: 2,
  info: 3,
  http: 4,
  debug: 5,
};

const colors = {
  fatal: "red",
  error: "red",
  warning: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level}] ${message}`;
  })
);

const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level}] ${message}`;
  })
);

const transports = [
  new winston.transports.Console({
    format: consoleFormat,
    level: config.NODE_ENV === "production" ? "info" : "debug",
  }),
  new DailyRotateFile({
    filename: "logs/error-%DATE%.log",
    datePattern: "YYYY-MM-DD",
    level: "error",
    maxFiles: "14d",
    format,
  }),
  new DailyRotateFile({
    filename: "logs/combined-%DATE%.log",
    datePattern: "YYYY-MM-DD",
    level: config.NODE_ENV === "production" ? "info" : "debug",
    maxFiles: "14d",
    format,
  }),
];

const logger = winston.createLogger({
  levels,
  transports,
});

module.exports = logger;