import { Pagination } from "antd";
import { useState } from "react";
import { FaAngleLeft } from "react-icons/fa";
import { IoMdNotificationsOutline } from "react-icons/io";
import { Link } from "react-router-dom";
import moment from "moment";
import { useGetAllNotificationQuery } from "../../../redux/features/setting/settingApi";

const Notification = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const { data } = useGetAllNotificationQuery();
  console.log(data);

  // Static notifications data
  const allNotification = {
    notifications: [
      {
        id: 1,
        message: "Your subscription has been activated.",
        createdAt: "2023-04-01T10:30:00Z",
      },
      {
        id: 2,
        message: "You have a new message from John Doe.",
        createdAt: "2023-04-02T12:15:00Z",
      },
      {
        id: 3,
        message: "Your profile has been updated successfully.",
        createdAt: "2023-04-03T09:00:00Z",
      },
      {
        id: 4,
        message: "New login from an unrecognized device.",
        createdAt: "2023-04-04T11:45:00Z",
      },
      {
        id: 5,
        message: "Password change requested.",
        createdAt: "2023-04-05T08:30:00Z",
      },
      {
        id: 6,
        message: "Your account balance is low.",
        createdAt: "2023-04-06T14:00:00Z",
      },
      {
        id: 7,
        message: "You have a new friend request.",
        createdAt: "2023-04-07T17:30:00Z",
      },
      {
        id: 8,
        message: "Event reminder: Meeting tomorrow at 10 AM.",
        createdAt: "2023-04-08T07:15:00Z",
      },
      {
        id: 9,
        message: "Your document has been approved.",
        createdAt: "2023-04-09T13:00:00Z",
      },
      {
        id: 10,
        message: "Your recent purchase has been shipped.",
        createdAt: "2023-04-10T15:00:00Z",
      },
      {
        id: 11,
        message: "You have a new notification in the app.",
        createdAt: "2023-04-11T16:30:00Z",
      },
      {
        id: 12,
        message: "Security alert: New device login detected.",
        createdAt: "2023-04-12T19:00:00Z",
      },
    ],
  };

  const pageSize = 10;

  // Pagination Logic
  const paginatedNotifications = allNotification?.notifications.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-4">
      <Link to={"/"} className="text-2xl flex items-center mb-4">
        <FaAngleLeft /> Notification
      </Link>

      <div className="space-y-4">
        {paginatedNotifications?.map((item) => (
          <div
            key={item.id}
            className="border border-[#00adb5] hover:bg-[#b0e6e8d2] cursor-pointer rounded-md p-4 flex items-center space-x-4"
          >
            <div className="text-[#00adb5] border border-[#00adb5] rounded-full p-2">
              <span className=" bg-[#00adb5] p-1.5 rounded-full absolute ml-4 z-20"></span>
              <IoMdNotificationsOutline size={30} className="relative" />
            </div>
            <div>
              <p className="font-semibold">{item?.message}</p>
              <p className="text-gray-500">{moment(item?.createdAt).fromNow()}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Centering the Pagination */}
      <div className="mt-4 flex justify-center">
        <Pagination
          current={currentPage}
          total={allNotification?.notifications.length}
          pageSize={pageSize}
          onChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default Notification;
