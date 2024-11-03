import { useQuery } from "@tanstack/react-query";
import ProductCard from "./ProductCard";
import { useState } from "react";
import { MoonLoader } from "react-spinners";
import PieChartComponent from "./PieChartComponent";
import BarChartComponent from "./BarChartComponent";
import TransctionStats from "./TransctionStats";

async function fetchProduct(month = 3) {
  try {
    const res = await fetch(
      `http://127.0.0.1:7000/api/v1/products/month/${month}`
    );
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}

const months = [
  {
    month: 1,
    name: "January",
  },
  {
    month: 2,
    name: "Feburary",
  },
  {
    month: 3,
    name: "March",
  },
  {
    month: 4,
    name: "April",
  },
  {
    month: 5,
    name: "May",
  },
  {
    month: 6,
    name: "June",
  },
  {
    month: 7,
    name: "July",
  },
  {
    month: 8,
    name: "August",
  },
  {
    month: 9,
    name: "September",
  },
  {
    month: 10,
    name: "October",
  },
  {
    month: 11,
    name: "November",
  },
  {
    month: 12,
    name: "December",
  },
];

function ProductList() {
  const [month, setMonth] = useState(3);

  const { data, isLoading } = useQuery({
    queryKey: ["products", month],
    queryFn: () => fetchProduct(month),
  });

  if (isLoading) {
    return (
      <div className="h-[60vh] flex justify-center items-center">
        <MoonLoader />
      </div>
    );
  }
  const products = data?.data?.products;

  return (
    <>
      <div className="p-4 mx-auto max-w-7xl">
        <div className="">
          <TransctionStats month={month} />
        </div>
        <div className="flex items-center justify-end gap-2 p-2 bg-slate-200">
          <label htmlFor="months" className="">
            Select a month:
          </label>
          <select
            className="p-1 rounded"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            name="months"
            id="months"
          >
            {months.map(({ month, name }) => {
              return (
                <option key={name} value={month}>
                  {name}
                </option>
              );
            })}
          </select>
        </div>

        <div className="h-[40vh] grid grid-cols-[1fr_2fr] justify-between">
          <PieChartComponent month={month} />
          <BarChartComponent month={month} />
        </div>

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
        {/* <div className="flex items-center justify-between ">
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
        </div> */}
      </div>
    </>
  );
}

export default ProductList;
