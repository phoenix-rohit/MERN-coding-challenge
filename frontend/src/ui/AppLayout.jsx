import { Link, Outlet } from "react-router-dom";
import Navigation from "./Navigation";

function AppLayout() {
  return (
    <div>
      <Navigation />

      <Outlet />
    </div>
  );
}

export default AppLayout;
