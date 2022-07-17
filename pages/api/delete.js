import User from "../../models/user";
import connectDB from "../../utils/connectMongoose";

const deleteHandler = (req, res) => {
  if (req.method === "POST") {
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
  } else {
    res.send({
      message: "Do not do this!",
    });
  }
};

export default deleteHandler;
