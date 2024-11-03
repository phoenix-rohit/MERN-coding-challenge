import { Link } from "react-router-dom";

function HomeLayout() {
  return (
    <div className=" h-[90vh] flex  gap-9 items-center justify-center text-white">
      <Link to="/transaction">
        <button className="px-4 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-700">
          See Transaction
        </button>
      </Link>
      <Link to="/products">
        <button className="px-4 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-700">
          View All Products
        </button>
      </Link>
    </div>
  );
}

export default HomeLayout;
