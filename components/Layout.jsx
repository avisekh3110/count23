import Head from "next/head";
import { ToastContainer } from "react-toastify";
import Footer from "./Footer";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <>
      <Head>
        <title>Count23</title>
      </Head>
      <Navbar />
      <main className="bg-slate-900 flex flex-col justify-center  items-center w-full gap-6 min-h-onlymain">
        {children}
      </main>
      <ToastContainer theme="dark" position="bottom-right" />
      <Footer />
    </>
  );
};

export default Layout;
