import axios from "axios"
import ArrowUp from '@mui/icons-material/ArrowDropUp';
import ArrowDown from '@mui/icons-material/ArrowDropDown';
import { ArrowDownward } from "@mui/icons-material";
import { getCookie } from "cookies-next";

function Nav() {
  return (
    <nav>
      <h1 className="px-4 h-14 flex items-center bg-black text-2xl text-white font-bold" >
        Count23
      </h1>
    </nav>
  );
}
function Main({ daysLeft }) {
  return (
    <div className="flex max-w-xs flex-col justify-center items-center min-h-nonav gap-6">
      <div className="flex flex-col w-full justify-center border border-6 border-gray-00 py-8">
        <div className="text-7xl w-full flex justify-c">
          {daysLeft}
        </div>
        <div className="flex justify-center">
          days left
        </div>
      </div>
      <div className="flex justify-between w-full">
        <button className="px-12 py-2 rounded-md bg-green-400">
          <ArrowUp fontSize="large"  />
        </button>
        <button className="px-12 py-2 rounded-md bg-red-400 ">
          <ArrowDown fontSize="large"  />
        </button>
      </div>
    </div>
  )
}


export default function Home({ daysLeft }) {
  return (
    <>
      <Nav />
      <Main daysLeft={daysLeft} />
    </>
  )
}

export const getServerSideProps = async ({ req, res }) => {

  const { data } = await axios.get('http://localhost:3000/api/getdata');
  console.log("data", data);
  return {
    props: {
      daysLeft: data.daysLeft
    }
  }
}