import { FaDatabase } from "react-icons/fa";
import { PiCurrencyCircleDollar, PiUsers, PiUsersThreeFill } from "react-icons/pi";
import { useGetDashboardStatusQuery } from "../../../redux/features/dashboard/dashboardApi";
const Status = () => {
  const { data, isLoading } = useGetDashboardStatusQuery();
  const fullData = data?.data?.attributes || [];

  return (
    <div >

      {
        isLoading ? <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {[1, 2, 3].map((item) => (
            <div class="mx-auto w-full max-w-sm animate-pulse rounded-md border border-[#00acb581] p-4">
              <div class="flex animate-pulse space-x-4">
                <div class="size-10 rounded-full bg-[#00acb581]"></div>
                <div class="flex-1 space-y-6 py-1">
                  <div class="h-2 rounded bg-[#00acb581]"></div>
                  <div class="space-y-3">
                    <div class="grid grid-cols-3 gap-4">
                      <div class="col-span-2 h-2 rounded bg-[#00acb581]"></div>
                      <div class="col-span-1 h-2 rounded bg-[#00acb581]"></div>
                    </div>
                    <div class="h-2 rounded bg-[#00acb581]"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
          :
          <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            <div className="flex justify-between items-center p-5 rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
              <div className="space-y-2">
                <h1 className="text-xl font-semibold">Total Earnings</h1>
                <h1 className=" text-4xl font-semibold text-[#222222]">
                  ${fullData?.totalEarnings}
                </h1>
              </div>
              <div className="size-20 flex justify-center items-center rounded-full  ">
                <img src="/homepage/item1.png" alt="" />
              </div>
            </div>

            <div className="flex justify-between items-center p-5 rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
              <div className="space-y-2">
                <h1 className="text-xl font-semibold"> Today Earnings</h1>
                <h1 className=" text-4xl font-semibold text-[#222222]">
                  ${fullData?.totalEarnings}
                </h1>
              </div>
              <div className="size-20 flex justify-center items-center rounded-full  ">
                <img src="/homepage/item2.png" alt="" />
              </div>
            </div>

            <div className="flex justify-between items-center p-5 rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
              <div className="space-y-2">
                <h1 className="text-xl font-semibold">Total User</h1>
                <h1 className=" text-4xl font-semibold text-[#222222]">
                  {fullData?.totalUser}
                </h1>
              </div>
              <div className="size-20 flex justify-center items-center rounded-full  ">
                <img src="/homepage/item3.png" alt="" />
              </div>
            </div>

          </div>
      }

    </div>
  );
};

export default Status;
