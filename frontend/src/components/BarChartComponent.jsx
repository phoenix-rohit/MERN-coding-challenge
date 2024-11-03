import { useQuery } from "@tanstack/react-query";
import { MoonLoader } from "react-spinners";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const rangeStat = [
  {
    "0-100": 3,
    "101-200": 1,
    "201-300": 0,
    "301-400": 0,
    "401-500": 0,
    "501-600": 2,
    "601-700": 1,
    "701-800": 0,
    "801-900": 0,
    "901-10000": 3,
  },
];

function alterData(arrOfRange, arrOfItems) {
  const alteredArrayOfObjects = [];

  for (let i = 0; i < arrOfItems.length; i++) {
    let obj1 = { range: null, items: null };
    obj1.items = arrOfItems[i];
    obj1.range = arrOfRange[i];

    alteredArrayOfObjects.push(obj1);
    obj1 = { range: null, items: null };
  }

  return alteredArrayOfObjects;
}

async function fetchByRange(month = 3) {
  try {
    const res = await fetch(
      `http://127.0.0.1:7000/api/v1/products/range-stats?month=${month}`
    );
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}

export default function BarChartComponent({ month }) {
  const { data, isLoading } = useQuery({
    queryKey: ["range"],
    queryFn: () => fetchByRange(month),
  });

  if (isLoading) {
    return <MoonLoader />;
  }
  const rangeStats = data?.data?.rangeStats[0];

  const arrOfRange = Object.keys(rangeStats);
  const arrOfItems = Object.values(rangeStats);

  const alteredData = alterData(arrOfRange, arrOfItems);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={500}
        height={300}
        // data={data}
        data={alteredData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        {/* <CartesianGrid strokeDasharray="5 5" /> */}
        <XAxis dataKey="range" />
        <YAxis dataKey="items" />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="items"
          fill="#0D2C54"
          activeBar={<Rectangle fill="pink" stroke="blue" />}
        />
        {/* <Bar
          dataKey="uv"
          fill="#82ca9d"
          activeBar={<Rectangle fill="gold" stroke="purple" />}
        /> */}
      </BarChart>
    </ResponsiveContainer>
  );
}
