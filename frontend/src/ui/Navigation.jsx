import { NavLink } from "react-router-dom";

function Navigation() {
  return (
    <nav className="sticky top-0 z-20 w-full py-4 bg-black text-slate-400">
      <ul className="flex items-center gap-10 px-4 ">
        <li className=" hover:text-white">
          <NavLink
            to="/transaction"
            className="text-xl text-center active:text-white"
          >
            Transaction Dashboard
          </NavLink>
        </li>
        <li className="hover:text-white">
          <NavLink to="/products" className="text-xl text-center">
            All Products
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
