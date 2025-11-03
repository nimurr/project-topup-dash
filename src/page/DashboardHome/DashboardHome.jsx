import { useEffect } from "react";
import IncomeGraphChart from "../../component/Main/Dashboard/IncomeGraphChart";
import Piechart from "../../component/Main/Dashboard/Piechart";
import RecentTransactions from "../../component/Main/Dashboard/RecentTransactions";
import Status from "../../component/Main/Dashboard/Status";
const DashboardHome = () => {

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      window.location.href = "/auth/login";
    }
  }, []);

  return (
    <section>
      <h1 className="text-4xl font-semibold py-5 px-3">Overview</h1>
      <div className="px-3">
        <Status />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-10 items-start">
          <IncomeGraphChart />
          <RecentTransactions />
        </div>
        {/* <Piechart /> */}
      </div>
    </section>
  );
};

export default DashboardHome;
