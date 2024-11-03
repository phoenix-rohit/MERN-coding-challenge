import { useQuery } from "@tanstack/react-query";
import { MoonLoader } from "react-spinners";

async function fetchStats(month) {
  try {
    // const res = await fetch(
    //   `http://127.0.0.1:7000/api/v1/products?page=${page}&month=${month}`
    // );
    const res = await fetch(
      `http://127.0.0.1:7000/api/v1/products/product-stats?month=${month}`
    );
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}

function TransctionStats({ month }) {
  const { data, isLoading } = useQuery({
    queryKey: ["productStats", month],
    queryFn: () => fetchStats(month),
  });

  const productStats = data?.data?.productStats[0];

  if (isLoading) {
    return <MoonLoader />;
  }

  return (
    <div className=" bg-[#0A100D] w-[50vw] mb-3 rounded-md text-white flex flex-col gap-3 p-3">
      <div className="flex items-center justify-between">
        <p>Total sale</p>
        <p>{productStats.totalSaleAmount.toFixed(3)}</p>
      </div>
      <div className="flex items-center justify-between">
        <p>Total sold items</p>
        <p>{productStats.totalSoldItems}</p>
      </div>
      <div className="flex items-center justify-between">
        <p>Total unsold items</p>
        <p>{productStats.totalUnsoldItems}</p>
      </div>
    </div>
  );
}

export default TransctionStats;
