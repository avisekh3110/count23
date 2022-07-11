import logger from "./logger";
import { connect, connections } from "mongoose";

const dblogger = logger.child({
  name: "db",
});

const user = process.env.MONGO_USER || "";
const pswd = process.env.MONGO_PASS || "";

const URI = `mongodb+srv://${user}:${pswd}@cluster0.jc8msxu.mongodb.net/?retryWrites=true&w=majority`;

const connectDB = () => {
  return new Promise((resolve, reject) => {
    dblogger.info({
      data: {
        msg: "Connecting to database",
      },
    });
    connect(URI, { useNewUrlParser: true })
      .then((db) => {
        dblogger.info({
          data: {
            msg: "Connected to database",
          },
        });
        resolve(db);
      })
      .catch((err) => {
        dblogger.error({
          data: {
            msg: "Error connecting to database",
            err,
          },
        });
        reject(err);
      });
  });
};
export default connectDB;
