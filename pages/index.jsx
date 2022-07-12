import ArrowUp from "@mui/icons-material/ArrowDropUp";
import ArrowDown from "@mui/icons-material/ArrowDropDown";
import connectDB from "../utils/connectMongoose";
import { getDaysLeft, getDaysPassed, getYesterday } from "../utils/time";
import User from "../models/user";
import logger from "../utils/logger";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { formatDistance } from "date-fns/index";
import axios from "axios";
import Head from "next/head";
import { useState } from "react";
import { isToday } from "date-fns";
import { getMarks } from "../utils/marks";

function Nav() {
  return (
    <nav>
      <h1 className="px-4 h-14  font-moonrock flex items-center bg-primary text-2xl text-white font-bold">
        Count23
      </h1>
    </nav>
  );
}

function Main({ wastedDays, marks, lastUpdated }) {
  const daysLeft = getDaysLeft();

  const [disabled, setDisabled] = useState(isToday(new Date(lastUpdated)));
  const [userData, setUserData] = useState({
    wastedDays,
    marks,
    lastUpdated,
  });

  const handleUp = () => {
    axios.post("/api/up").then((res) => {
      if (res.data.result) {
        console.log(res.data);
        toast.success("Successfully utilised the day!");
        setUserData(res.data.user);
        setDisabled(true);
      } else {
        res.data.errs &&
          res.data.errs.forEach((err) => {
            toast.error(err);
          });
      }
    });
  };

  const handleDown = () => {
    axios.post("/api/down").then((res) => {
      if (res.data.result) {
        toast.error("Successfully wasted the day! 🥲");
        setUserData(res.data.user);
        setDisabled(true);
      } else {
        res.data.errs &&
          res.data.errs.forEach((err) => {
            toast.error(err);
          });
      }
    });
  };

  return (
    <main className=" bg-slate-900 flex flex-col justify-center  items-center w-full gap-6 min-h-onlymain">
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
            disabled={disabled}
            onClick={handleUp}
            className={`px-10 text-white ${
              disabled ? "cursor-not-allowed" : "active:scale-105"
            } duration-200 py-1 rounded-md bg-green-400`}
          >
            <ArrowUp className="text-5xl" />
          </button>
          <button
            disabled={disabled}
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
    </main>
  );
}

function Footer() {
  return (
    <div className=" px-4 h-10 font-indie bg-primary flex justify-end font-bold items-center text-white">
      Created by AVISEKH & YASH
    </div>
  );
}

export default function Home({ marks, wastedDays, lastUpdated }) {
  return (
    <>
      <Head>
        <title>Count23</title>
      </Head>
      <Nav />
      <Main wastedDays={wastedDays} marks={marks} lastUpdated={lastUpdated} />
      <ToastContainer theme="dark" position="bottom-right" />
      <Footer />
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
          }
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
