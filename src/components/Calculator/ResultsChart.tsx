import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface ResultsChartProps {
  currentRevenue: number;
  improvedRevenue: number;
  revenueAtRisk: number;
}

const ResultsChart = ({ currentRevenue, improvedRevenue, revenueAtRisk }: ResultsChartProps) => {
  const data = [
    {
      name: "Current Revenue",
      value: currentRevenue,
    },
    {
      name: "Improved Revenue",
      value: improvedRevenue,
    },
    {
      name: "Revenue at Risk",
      value: revenueAtRisk,
    },
  ];

  return (
    <div className="w-full h-[300px] mt-8">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip
            formatter={(value) => [`$${value.toLocaleString()}`, "Amount"]}
          />
          <Bar dataKey="value" fill="#0284c7" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ResultsChart;