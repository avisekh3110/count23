import { isToday } from "date-fns";
import User from "../../models/user";
import logger from "../../utils/logger";

const downHandler = (req, res) => {
  const downLogger = logger.child({
    name: "/api/down",
    method: req.method,
  });
  downLogger.info({ data: { path: "/api/down", method: req.method } });

  if (req.method === "POST") {
    downLogger.info({ data: { path: "/api/down", value: 1 } });
    User.exists({}).then((exists) => {
      downLogger.info({ data: { path: "/api/down", value: 2 } });
      if (exists) {
        User.findOne({})
          .then((user) => {
            downLogger.info({ data: { path: "/api/down", value: 3 } });
            downLogger.info({
              data: {
                isToday: isToday(new Date(user.lastUpdated)),
                lastUpdated: user.lastUpdated,
              },
            });
            if (isToday(new Date(user.lastUpdated))) {
              downLogger.info({ data: { path: "/api/down", value: 4 } });

              downLogger.info({ data: { msg: "User already updated today" } });
              res.status(200).json({
                result: false,
                errs: ["User already updated today"],
                message: "User already updated today",
              });
            } else {
              downLogger.info({ data: { path: "/api/down", value: 5 } });
              User.findOneAndUpdate(
                {},
                {
                  lastUpdated: new Date().toUTCString(),
                  $inc: { wastedDays: 1 },
                }
              )
                .then((updatedUser) => {
                  downLogger.info({ data: { path: "/api/down", value: 6 } });

                  downLogger.info({
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
                  downLogger.info({ data: { path: "/api/down", value: 7 } });

                  downLogger.error({ data: { err: errFOU } });
                  res.send({
                    message: "Error updating user",
                    errs: ["Error updating user"],
                    result: false,
                  });
                });
            }
          })
          .catch((errFOU) => {
            downLogger.info({ data: { path: "/api/down", value: 8 } });

            downLogger.error({ data: { err: errFOU } });
            res.send({
              message: "Error finding user",
              errs: ["Error finding user"],
              result: false,
            });
          });
      } else {
        downLogger.info({ data: { path: "/api/down", value: 9 } });

        downLogger.error({
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
export default downHandler;
