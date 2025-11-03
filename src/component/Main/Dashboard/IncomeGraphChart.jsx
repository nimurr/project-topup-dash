/* eslint-disable react/prop-types */
import { DatePicker } from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useGetIncomeRatioQuery } from "../../../redux/features/dashboard/dashboardApi";

// Static data for income by month
const data = [
  { month: "Jan", income: 5000 },
  { month: "Feb", income: 4000 },
  { month: "Mar", income: 7000 },
  { month: "Apr", income: 8000 },
  { month: "May", income: 9000 },
  { month: "Jun", income: 10000 },
  { month: "Jul", income: 11000 },
  { month: "Aug", income: 10000 },
  { month: "Sep", income: 9000 },
  { month: "Oct", income: 14000 },
  { month: "Nov", income: 15000 },
  { month: "Dec", income: 16000 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip bg-[#00adb5] p-2 border text-white border-[#00adb5] rounded shadow-lg">
        <p className="label font-semibold">{`Month: ${label}`}</p>
        <p className="intro">{`Total Income: $${payload[0].value.toLocaleString()}`}</p>
      </div>
    );
  }

  return null;
};

const IncomeGraphChart = () => {
  // For now, you can mock the current year if needed
  const currentYear = new Date().getFullYear();

  const { data, isLoading } = useGetIncomeRatioQuery();
  const fullData = data?.data?.attributes || [];


  return (
    <div>
      {
        isLoading ? <div className="">
          <div class="mx-auto w-full h-[420px] flex items-center justify-center animate-pulse rounded-md border border-[#00acb581] p-4">
            <div class="flex animate-pulse space-x-4 w-full">
              <div class="size-10 rounded-full bg-[#00acb581]"></div>
              <div class="flex-1 space-y-6 py-1">
                <div class="h-2 rounded bg-[#00acb581]"></div>
                <div class="h-2 rounded bg-[#00acb581]"></div>
                <div class="h-2 rounded bg-[#00acb581]"></div>
                <div class="h-2 rounded bg-[#00acb581]"></div>
                <div class="space-y-3">
                  <div class="grid grid-cols-3 gap-4">
                    <div class="col-span-2 h-2 rounded bg-[#00acb581]"></div>
                    <div class="col-span-1 h-2 rounded bg-[#00acb581]"></div>
                  </div>
                  <div class="h-2 rounded bg-[#00acb581]"></div>
                  <div class="h-2 rounded bg-[#00acb581]"></div>
                  <div class="h-2 rounded bg-[#00acb581]"></div>
                  <div class="h-2 rounded bg-[#00acb581]"></div>
                </div>
              </div> 
            </div>
          </div>
        </div>
          :
          <section className="w-full bg-white rounded-lg shadow-[0_0_10px_rgb(0,0,0,0.2)] border border-[#b0e6e8]">
            <div className="border-b border-[#b0e6e8]">
              <div className="flex justify-between items-center p-3">
                <h1 className="font-semibold">Income Ratio</h1>
                {/* <DatePicker picker="year" defaultOpenValue={currentYear} /> */}
              </div>
            </div>
            <div className="">
              <ResponsiveContainer className="pr-4" width="100%" height={400}>
                <LineChart
                  data={fullData}
                  margin={{
                    top: 5,
                    bottom: 5,
                  }}
                  className="md:mt-5 md:mb-5 "
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="totalEarnings" stroke="#b0e6e8" dot={true} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>
      }
    </div>
  );
};

export default IncomeGraphChart;
