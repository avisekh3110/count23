import logger from "../../utils/logger";

const getDataHandler = (req, res) => {
  const getDataLogger = logger.child({
    name: "getDataHandler",
    method: req.method,
  });

  if (req.method === "GET") {
  } else {
    getDataLogger.error({
      data: {
        msg: "Invalid request method",
      },
    });
    res.status(405).send("Invalid method");
  }
};
export default getDataHandler;
