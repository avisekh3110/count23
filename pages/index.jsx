import ArrowUp from "@mui/icons-material/ArrowDropUp";
import ArrowDown from "@mui/icons-material/ArrowDropDown";
import connectDB from "../utils/connectMongoose";
import { getDaysLeft, getDaysPassed, getYesterday } from "../utils/time";
import User from "../models/user";
import logger from "../utils/logger";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { formatDistance } from "date-fns/index";
import axios from "axios";
import Head from "next/head";
import { useState } from "react";
import { isToday } from "date-fns";
import { getMarks } from "../utils/marks";
import { Link as MuiLink } from "@mui/material";
import Link from "next/link";

export default function Home({ wastedDays, marks, lastUpdated }) {
  const daysLeft = getDaysLeft();

  const [disabled, setDisabled] = useState(isToday(new Date(lastUpdated)));
  const [userData, setUserData] = useState({
    wastedDays: wastedDays,
    marks: marks,
    lastUpdated: lastUpdated,
  });

  const handleUp = () => {
    setDisabled(true);
    axios
      .post("/api/up")
      .then((res) => {
        if (res.data.result) {
          console.log(res.data);
          toast.success("Successfully utilised the day!");
          setUserData({
            wastedDays: res.data.user.wastedDays,
            marks: getMarks(res.data.user.wastedDays),
            lastUpdated: res.data.user.lastUpdated,
          });
        } else {
          res.data.errs &&
            res.data.errs.forEach((err) => {
              toast.error(err);
            });
          setDisabled(false);
        }
      })
      .catch((err) => {
        toast.error(err);
        setDisabled(false);
      });
  };

  const handleDown = () => {
    setDisabled(true);
    axios
      .post("/api/down")
      .then((res) => {
        if (res.data.result) {
          toast.error("Successfull wasted the day! 🥲");
          console.log({
            wastedDays: res.data.user.wastedDays,
            marks: getMarks(res.data.user.wastedDays),
            lastUpdated: res.data.user.lastUpdated,
          });
          setUserData({
            wastedDays: res.data.user.wastedDays,
            marks: getMarks(res.data.user.wastedDays),
            lastUpdated: res.data.user.lastUpdated,
          });
        } else {
          res.data.errs &&
            res.data.errs.forEach((err) => {
              toast.error(err);
            });
          setDisabled(false);
        }
      })
      .catch((err) => {
        toast.error(err);
        setDisabled(false);
      });
  };

  return (
    <>
      <Head>
        <title>Count23</title>
      </Head>
      <div className="flex max-w-xs  w-full flex-col justify-center items-center gap-6">
        <div className="text-white font-extralight text-lg">
          last updated:{" "}
          {formatDistance(new Date(userData.lastUpdated), new Date())} ago
        </div>
        <div className="flex flex-col select-none w-full justify-center bg-primary text-white py-8 rounded-md">
          <div className="text-7xl w-full flex font-bold justify-center">
            {daysLeft}
          </div>
          <div className="flex justify-center text-gray-200">days left</div>
        </div>
        <div className="flex justify-between  w-full">
          <button
            onClick={handleUp}
            className={`px-10 text-white ${
              disabled ? "cursor-not-allowed" : "active:scale-105"
            } duration-200 py-1 rounded-md bg-green-400`}
          >
            <ArrowUp className="text-5xl" />
          </button>
          <button
            onClick={handleDown}
            className={`px-10 text-white ${
              disabled ? "cursor-not-allowed" : "active:scale-105"
            } duration-200 py-1 an rounded-md bg-rose-500`}
          >
            <ArrowDown className="text-5xl" />
          </button>
        </div>
      </div>
      <div
        className={`max-w-xs w-full select-none flex flex-col justify-center items-center ${
          userData.marks >= 95
            ? "bg-green-400"
            : userData.marks >= 85
            ? "bg-orange-400"
            : "bg-rose-500"
        } text-white rounded-md py-8`}
      >
        <div className="text-7xl flex flex-col w-full justify-center items-center font-bold ">
          {getMarks(userData.wastedDays)}
        </div>
        <div>Percentage</div>
      </div>
      <div className="flex font-bold text-white gap-4">
        <div>DAYS WASTED :</div>
        <div>{userData.wastedDays}</div>
      </div>
      <Link href="/routine">
        <a className="bg-white px-4 py-2 rounded-md font-bold uppercase fixed bottom-16 right-6">
          Routine
        </a>
      </Link>
    </>
  );
}

export const getServerSideProps = async ({ req, res }) => {
  const homeLogger = logger.child({
    name: "home",
  });
  try {
    await connectDB();
    try {
      const exists = await User.exists({});
      let user;
      if (!exists) {
        user = new User({
          lastUpdated: getYesterday().toUTCString(),
        });
        await user.save();
        console.log("User created:", user);
      } else {
        user = await User.findOne({});
        console.log("User Found:", user);
      }
      const daysNotLoggedIn = getDaysPassed(user.lastUpdated);
      homeLogger.info({
        data: {
          daysNotLoggedIn,
        },
      });
      if (daysNotLoggedIn > 0) {
        user = await User.findOneAndUpdate(
          {},
          {
            $set: { lastUpdated: getYesterday().toUTCString() },
            $inc: { wastedDays: daysNotLoggedIn },
          },
          { returnDocument: "after" }
        );
        logger.info({
          data: {
            user,
          },
        });
      }
      const marks = getMarks(user.wastedDays);
      return {
        props: {
          marks,
          wastedDays: user.wastedDays,
          lastUpdated: user.lastUpdated,
        },
      };
    } catch (err) {
      console.log("User not Found");
      homeLogger.error({ err });
      return {
        props: {
          marks: 0,
          wastedDays: 0,
          lastUpdated: new Date(),
        },
      };
    }
  } catch (error) {
    homeLogger.error({ error });
    res.statusCode = 500;
    res.end(error.message);
  }
};
