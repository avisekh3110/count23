import { model, models, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const UserSchema = new Schema({
  name: {
    type: String,
    default: uuidv4(),
  },
  wastedDays: {
    type: Number,
    default: 0,
  },
});

const User = models.user || model("user", UserSchema);

export default User;
