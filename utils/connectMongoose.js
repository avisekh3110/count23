import logger from "./logger";
import { connect, connections } from "mongoose";

const dblogger = logger.child({
  name: "db",
});

const user = process.env.MONGO_USER || "";
const pswd = process.env.MONGO_PASS || "";

const URI = `mongodb+srv://${user}:${pswd}@main.ppnesjo.mongodb.net/?retryWrites=true&w=majority
`;

dblogger.info({ data: "Connecting to Database" });

const connectDB =
  (handler) =>
  async (req, res) => {
    if (connections[0].readyState) {
      return handler(req, res);
    }
    await connect(URI);
    return handler(req, res);
  };

export default connectDB;
