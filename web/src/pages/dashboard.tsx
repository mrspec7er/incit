import React, { useEffect, useState } from "react";
import { IoMdLogIn, IoMdLogOut } from "react-icons/io";
import { RxCountdownTimer } from "react-icons/rx";

export interface Statistic {
  user: UserStatistic;
  totalUser: number;
  activeUser: number;
  averageActiveUser: number;
}

export interface UserStatistic {
  id: number;
  email: string;
  password: string;
  authProvider: string;
  verificationToken: string;
  verifiedEmail: boolean;
  signUpTime: string;
  lastLoginTime: string;
  lastLogoutTime: string;
  loginCount: number;
  createdAt: string;
  updatedAt: string;
}

const Dashboard = () => {
  const [statistics, setStatistics] = useState<Statistic>();
  async function getStatistics() {
    const statistics: Statistic = await fetch(
      `${import.meta.env.VITE_BASE_URL}/users/statistics`,
      {
        credentials: "include",
      }
    ).then((res) => res.json());
    setStatistics(statistics);
  }

  useEffect(() => {
    getStatistics();
  }, []);

  function dateConverter(isoDateString: string | undefined) {
    if (!isoDateString) {
      return "undefine";
    }
    const date = new Date(isoDateString);

    return date.toLocaleString("id-ID");
  }
  return (
    <div>
      <p className="text-xl font-semibold py-10">Statistics:</p>
      <div className="flex justify-between">
        <div className="w-1/3 flex items-center gap-5">
          <div className="text-5xl">
            <IoMdLogIn />
          </div>
          <div className="flex flex-col justify-start items-start">
            <p className="font-medium text-xl">Total User</p>
            <p>{statistics?.totalUser}</p>
          </div>
        </div>
        <div className="w-1/3 flex items-center gap-5">
          <div className="text-5xl">
            <RxCountdownTimer />
          </div>
          <div className="flex flex-col justify-start items-start">
            <p className="font-medium text-xl">Daily User Active</p>
            <p>{statistics?.activeUser}</p>
          </div>
        </div>
        <div className="w-1/3 flex items-center gap-5">
          <div className="text-5xl">
            <IoMdLogOut />
          </div>
          <div className="flex flex-col justify-start items-start">
            <p className="font-medium text-xl">Weekly Average Active User</p>
            <p>{statistics?.averageActiveUser}</p>
          </div>
        </div>
      </div>
      <p className="text-xl font-semibold py-10">User Data:</p>
      <div className="flex justify-between">
        <div className="w-1/3 flex items-center gap-5">
          <div className="text-5xl">
            <IoMdLogIn />
          </div>
          <div className="flex flex-col justify-start items-start">
            <p className="font-medium text-xl">Sing Up At</p>
            <p>{dateConverter(statistics?.user?.signUpTime)}</p>
          </div>
        </div>
        <div className="w-1/3 flex items-center gap-5">
          <div className="text-5xl">
            <RxCountdownTimer />
          </div>
          <div className="flex flex-col justify-start items-start">
            <p className="font-medium text-xl">Login Count</p>
            <p>{statistics?.user?.loginCount!}</p>
          </div>
        </div>
        <div className="w-1/3 flex items-center gap-5">
          <div className="text-5xl">
            <IoMdLogOut />
          </div>
          <div className="flex flex-col justify-start items-start">
            <p className="font-medium text-xl">Last Logout</p>
            <p>{dateConverter(statistics?.user?.lastLogoutTime)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
