import React, { useState } from "react";
import { message } from "antd";
import { FaAngleLeft } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { GoInfo } from "react-icons/go";
import { useGetSingleUserQuery } from "../../redux/features/user/userApi";
import Url from "../../redux/baseApi/forImageUrl";

const UserDetails = () => {
  const { id } = useParams();


  const { data } = useGetSingleUserQuery({ id });
  const userData = data?.data?.attributes;
  console.log(userData);

  const handleUserRemove = async () => {
    // Simulate block action
    setIsBanned(true);
    message.success("User has been blocked.");
  };

  const handleUserUnBlock = async () => {
    // Simulate unblock action
    setIsBanned(false);
    message.success("User has been unblocked.");
  };

  return (
    <div>
      <Link to={"/users"} className="text-2xl flex items-center mt-5">
        <FaAngleLeft /> User Details
      </Link>

      <div className="my-10 w-full md:w-2/4 mx-auto">
        {/* User Profile Section */}
        <div className="flex items-center justify-between gap-5 mb-5">
          <div className="flex items-center gap-5">
            <img
              className="w-24 h-24 rounded-full"
              src={Url + userData.profileImage || "https://www.pngall.com/wp-content/uploads/5/Profile-PNG-File.png"}
              alt="User"
            />
            <h1 className="text-2xl font-semibold">{userData?.fullName}</h1>
          </div>
        </div>

        {/* User Details Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 border-b-2 border-[#00000042]">
            <span className="font-semibold">Name</span>
            <span>{userData?.fullName || "-"}</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b-2 border-[#00000042]">
            <span className="font-semibold">Email</span>
            <span>{userData?.email || "-"}</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b-2 border-[#00000042]">
            <span className="font-semibold">Phone Number</span>
            <span>{userData?.callingCode} {userData?.phoneNumber || "-"}</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b-2 border-[#00000042]">
            <span className="font-semibold">User Type</span>
            <span>{userData?.role || "-"}</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b-2 border-[#00000042]">
            <span className="font-semibold">Joining Date</span>
            <span>
              {new Date(userData?.createdAt || "-").toLocaleDateString("en-US", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>


      </div>
    </div>
  );
};

export default UserDetails;