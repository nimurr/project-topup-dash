import { FaDatabase } from "react-icons/fa";
import { PiCurrencyCircleDollar, PiUsers, PiUsersThreeFill } from "react-icons/pi";
import { useGetDashboardStatusQuery } from "../../../redux/features/dashboard/dashboardApi";
const Status = () => {
  const { data, isLoading } = useGetDashboardStatusQuery();
  console.log(data);



  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

      <div className="flex justify-between items-center p-5 rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
        <div className="space-y-2">
          <h1>Today’s Revenue</h1>
          <h1 className=" text-4xl font-semibold text-[#222222]">
            $53,000
          </h1>
        </div>
        <div className="size-20 flex justify-center items-center rounded-full  ">
          <img src="/homepage/item1.png" alt="" />
        </div>
      </div>

      <div className="flex justify-between items-center p-5 rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
        <div className="space-y-2">
          <h1>Today’s Transactions</h1>
          <h1 className=" text-4xl font-semibold text-[#222222]">
            12,340
          </h1>
        </div>
        <div className="size-20 flex justify-center items-center rounded-full  ">
          <img src="/homepage/item2.png" alt="" />
        </div>
      </div>

      <div className="flex justify-between items-center p-5 rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
        <div className="space-y-2">
          <h1>Active User</h1>
          <h1 className=" text-4xl font-semibold text-[#222222]">
            8250
          </h1>
        </div>
        <div className="size-20 flex justify-center items-center rounded-full  ">
          <img src="/homepage/item3.png" alt="" />
        </div>
      </div>

      <div className="flex justify-between items-center p-5 rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
        <div className="space-y-2">
          <h1>Help Queue</h1>
          <h1 className=" text-4xl font-semibold text-[#222222]">
            9+
          </h1>
        </div>
        <div className="size-20 flex justify-center items-center rounded-full  ">
          <img src="/homepage/item4.png" alt="" />
        </div>
      </div>


    </div>
  );
};

export default Status;
