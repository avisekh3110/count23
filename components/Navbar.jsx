import Link from "next/link";

function Navbar() {
  return (
    <nav>
      <Link href="/">
        <a className="px-4 h-14  font-moonrock flex items-center bg-primary text-2xl text-white font-bold">
          Count23
        </a>
      </Link>
    </nav>
  );
}
export default Navbar;
