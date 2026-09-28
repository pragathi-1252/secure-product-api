
import logger from "./logger";

const morganStream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

export default morganStream;