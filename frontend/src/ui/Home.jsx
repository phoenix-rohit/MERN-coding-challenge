import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AllProductList from "../components/AllProductList";
import AppLayout from "./AppLayout";
import ProductList from "../components/ProductList";
import HomeLayout from "./HomeLayout";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <HomeLayout />,
      },
      {
        path: "/products",
        element: <AllProductList />,
      },
      {
        path: "/transaction",
        element: <ProductList />,
      },
    ],
  },
]);

function Home() {
  return <RouterProvider router={router} />;
}

export default Home;
