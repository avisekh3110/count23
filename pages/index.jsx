import ArrowUp from "@mui/icons-material/ArrowDropUp";
import ArrowDown from "@mui/icons-material/ArrowDropDown";
import connectDB from "../utils/connectMongoose";
import { getDaysLeft } from "../utils/time";
import { useState } from "react";
import { getCookie } from "cookies-next";
import User from "../models/user";
import logger from "../utils/logger";

function Nav() {
  return (
    <nav>
      <h1 className="px-4 h-14 flex items-center bg-primary text-2xl text-white font-bold">
        Count23
      </h1>
    </nav>
  );
}

function Main() {
  let marks = 100;
  const [wastedDays, setwastedDays] = useState(0);
  const daysLeft = getDaysLeft();
  return (
    <main className=" bg-slate-900 flex flex-col justify-center items-center w-full gap-6 min-h-nonav">
      <div className="flex max-w-xs w-full flex-col justify-center items-center gap-6">
        <div className="flex flex-col select-none w-full justify-center bg-primary text-white py-8 rounded-md">
          <div className="text-7xl w-full flex font-bold justify-center">
            {daysLeft}
          </div>
          <div className="flex justify-center text-gray-200">days left</div>
        </div>
        <div className="flex justify-between w-full">
          <button className="px-12 hover:ring-8 ring-opacity-30 ring-green-400 py-2 rounded-md bg-green-400 duration-300">
            <ArrowUp fontSize="large" />
          </button>
          <button className="px-12 hover:ring-8 ring-opacity-30 ring-red-400 py-2 rounded-md bg-red-400 duration-300">
            <ArrowDown fontSize="large" />
          </button>
        </div>
      </div>
      <div
        className={`max-w-xs w-full select-none flex flex-col justify-center items-center ${
          marks >= 95
            ? "bg-green-400"
            : marks >= 85
            ? "bg-orange-400"
            : "bg-red-400"
        } text-white rounded-md py-8`}
      >
        <div className="text-7xl flex flex-col w-full justify-center items-center font-bold ">
          {marks}
        </div>
        <div>Percentage</div>
      </div>
      <div className="flex font-bold text-white gap-4">
        <div>DAYS WASTED :</div>
        <div>{wastedDays}</div>
      </div>
    </main>
  );
}

export default function Home({ marks, wastedDays }) {
  return (
    <>
      <Nav />
      <Main />
      {marks + " " + wastedDays}
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
      const user = await User.findOne({
        name: "Yavi",
      });
      const marks = 100 - Math.floor(user.wastedDays / 3);
      console.log("User Found", user);
      return {
        props: {
          marks,
          wastedDays: user.wastedDays,
        },
      };
    } catch (err) {
      console.log("User not Found");
      homeLogger.error({ err });
      return {
        props: {
          marks: 0,
          wastedDays: 0,
        },
      };
    }
  } catch (error) {
    homeLogger.error({ error });
    res.statusCode = 500;
    res.end(error.message);
  }
};
// };
