/* eslint-disable @typescript-eslint/no-var-requires */
const pino = require("pino");
const ecsFormat = require("@elastic/ecs-pino-format");

const logger = (defaultConfig) =>
  pino({
    ...defaultConfig,
    ...ecsFormat(),
  });

module.exports = {
  logger,
};
