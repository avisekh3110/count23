import User from "../../models/user";
import connectDB from "../../utils/connectMongoose";

const deleteHandler = (req, res) => {
  connectDB()
    .then(() => {
      User.exists({}).then((exists) => {
        if (!exists) {
          res.status(404).json({ message: "User not found" });
        } else {
          User.deleteMany({}).then(() => {
            res.status(200).json({ message: "User deleted" });
          });
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

export default deleteHandler;
