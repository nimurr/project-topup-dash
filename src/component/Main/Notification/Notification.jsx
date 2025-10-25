import { message, Pagination } from "antd";
import { useState } from "react";
import { FaAngleLeft } from "react-icons/fa";
import { IoMdNotificationsOutline } from "react-icons/io";
import { Link } from "react-router-dom";
import moment from "moment";
import { useGetAllNotificationQuery, useReadNotificationMutation } from "../../../redux/features/setting/settingApi";

const Notification = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, refetch } = useGetAllNotificationQuery();
  const pageSize = 25;

  // Pagination Logic
  const paginatedNotifications = data?.data?.attributes?.notifications?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const onPageChange = (page) => {
    setCurrentPage(page);
  };


  const [readNotification, { isLoading: isReadLoading }] = useReadNotificationMutation();

  const handleRead = async (id) => {
    const data = { notificationId: id };
    console.log(id);
    try {
      const res = await readNotification(data).unwrap();
      console.log(res);
      if (res?.code === 200) {
        message.success(res?.message);
        refetch();
      }
      else {
        message.error(res?.message);
      }

    } catch (error) {
      message.error(error?.data?.message);
    }
  };

  return (
    <div className="p-4">
      <Link to={"/"} className="text-2xl flex items-center mb-4">
        <FaAngleLeft /> Notification
      </Link>

      <div className="space-y-4">
        {
          isLoading && <p className="text-center text-[#00adb5] pb-5">Loading...</p>
        }
        {paginatedNotifications?.map((item) => (
          <div
            key={item._id}
            onClick={() => handleRead(item?._id)}
            className={`border ${item?.status === "unread" ? "border-[#00adb5] hover:bg-[#b0e6e8d2]" : ""} cursor-pointer rounded-md p-4 flex items-center space-x-4`}
          >
            <div className={` ${item?.status === "unread" ? "text-[#00adb5] border border-[#00adb5]" : ""}  rounded-full p-2`}>
              <span className={`${item?.status === "unread" ? "bg-[#00adb5]" : ""} p-1.5 rounded-full absolute ml-4 z-20`}></span>
              <IoMdNotificationsOutline size={30} className="relative" />
            </div>
            <div>
              <p className={`font-semibold ${item?.status === "unread" ? "text-[#00adb5]" : ""}`}>{item?.content.length > 100 ? item?.content.slice(0, 100) + "..." : item?.content}</p>
              <p className="text-gray-500">{moment(item?.createdAt).fromNow()}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Centering the Pagination */}
      <div className="mt-4 flex justify-center">
        <Pagination
          current={currentPage}
          total={data?.data?.attributes?.notifications.length}
          pageSize={pageSize}
          onChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default Notification;
