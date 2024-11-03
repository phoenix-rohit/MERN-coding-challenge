import { useQuery } from "@tanstack/react-query";
import { MoonLoader } from "react-spinners";
import { PieChart, Pie, Tooltip, ResponsiveContainer } from "recharts";

async function fetchByCategory(month = 3) {
  try {
    const res = await fetch(
      `http://127.0.0.1:7000/api/v1/products/category-stats?month=${month}`
    );
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}

function PieChartComponent({ month }) {
  const { data, isLoading } = useQuery({
    queryKey: ["category"],
    queryFn: () => fetchByCategory(month),
  });

  if (isLoading) {
    return <MoonLoader />;
  }

  const categoryStats = data.data.categoryStats;

  const dataFormat = categoryStats.map((el) => {
    return { value: el.items, name: el.category };
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart width={400} height={400}>
        <Pie
          dataKey="value"
          data={dataFormat}
          // cx="50%"
          cy="50%"
          outerRadius={80}
          type="monotone"
          fill="#00A6ED"
          label
        />

        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default PieChartComponent;
