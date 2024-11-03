import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { MoonLoader } from "react-spinners";
import ProductCard from "./ProductCard";

async function fetchProduct(page = 1) {
  try {
    const res = await fetch(
      `http://127.0.0.1:7000/api/v1/products?page=${page}`
    );
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}

function AllProductList() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["products", page],
    queryFn: () => fetchProduct(page),
  });

  function handleNext() {
    if (data?.data?.products.length) {
      setPage((p) => p + 1);
    }
  }

  function handlePrev() {
    if (page > 1) {
      setPage((p) => p - 1);
    }
  }

  if (isLoading) {
    return (
      <div className="h-[60vh] flex justify-center items-center">
        <MoonLoader />
      </div>
    );
  }

  const products = data?.data?.products;

  return (
    <div className="p-4 mx-auto max-w-7xl">
      <div className="grid grid-cols-3 gap-3 py-4 mb-2 lg:grid-cols-5">
        {products?.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      {!products.length && (
        <div className="flex justify-center w-full py-4 text-3xl text-center uppercase ">
          No More Products
        </div>
      )}
      <div className="flex items-center justify-between ">
        <div>Page no.{page}</div>
        <div className="flex items-center gap-3 text-white ">
          <button
            onClick={handlePrev}
            disabled={page === 1 ? true : false}
            className="px-4 py-2 rounded-lg bg-violet-600 disabled:cursor-not-allowed disabled:bg-violet-300"
          >
            Prev
          </button>
          <button
            onClick={handleNext}
            disabled={data?.data?.products.length >= 10 ? false : true}
            className="px-4 py-2 rounded-lg bg-violet-600 disabled:cursor-not-allowed disabled:bg-violet-300"
          >
            Next
          </button>
        </div>
        <div>Per Page: 10</div>
      </div>
    </div>
  );
}

export default AllProductList;
