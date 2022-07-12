import { isToday } from "date-fns";
import User from "../../models/user";
import logger from "../../utils/logger";

const upHandler = (req, res) => {
  const upLogger = logger.child({
    name: "/api/up",
    method: req.method,
  });

  if (req.method === "POST") {
    User.exists({}).then((exists) => {
      if (exists) {
        User.findOne({})
          .then((user) => {
            upLogger.info({
              data: {
                isToday: isToday(new Date(user.lastUpdated)),
                lastUpdated: user.lastUpdated,
              },
            });
            if (isToday(new Date(user.lastUpdated))) {
              upLogger.info("User already updated today");
              res.status(200).json({
                result: false,
                errs: ["User already updated today"],
                message: "User already updated today",
              });
            } else {
              User.findOneAndUpdate(
                {},
                {
                  lastUpdated: new Date().toUTCString(),
                  $inc: { wastedDays: 1 },
                }
              )
                .then((updatedUser) => {
                  upLogger.info({
                    data: {
                      user: updatedUser,
                      message: "Wasted successfully",
                    },
                  });
                  res.send({
                    user: updatedUser,
                    message: "Wasted successfully",
                    result: true,
                  });
                })
                .catch((errFOU) => {
                  upLogger.error({ data: { err: errFOU } });
                  res.send({
                    message: "Error updating user",
                    errs: ["Error updating user"],
                    result: false,
                  });
                });
            }
          })
          .catch((errFOU) => {
            upLogger.error({ data: { err: errFOU } });
            res.send({
              message: "Error finding user",
              errs: ["Error finding user"],
              result: false,
            });
          });
      } else {
        uplogger.error({
          data: {
            message: "User does not exist",
            result: false,
          },
        });
        res.send({
          message: "User does not exist",
          result: false,
          errs: ["User does not exist"],
        });
      }
    });
  }
};
export default upHandler;
