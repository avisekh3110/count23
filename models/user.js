import { model, models, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { getYesterday } from "../utils/time";

const UserSchema = new Schema({
  name: {
    type: String,
    default: uuidv4(),
  },
  wastedDays: {
    type: Number,
    default: 0,
  },
  lastUpdated: {
    type: String,
    default: getYesterday().toUTCString(),
  },
});

const User = models.user || model("user", UserSchema);

export default User;
