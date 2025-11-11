import { ConfigProvider, Table, Pagination, Space, message, Modal, Button } from "antd";
import { useState } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { useGetAllUsersQuery } from "../../../redux/features/user/userApi";
import moment from "moment";

const RecentTransactions = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const [pageSize, setPageSize] = useState(10); // Items per page
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // Store selected user details

  const { data, isLoading } = useGetAllUsersQuery({ page: currentPage, limit: pageSize });
  const fullData = data?.data?.attributes?.results || [];

  // Open Modal with User Details
  const viewDetails = (user) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  // Close Modal
  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedUser(null);
  };

  const columns = [
    {
      title: "#SL",
      dataIndex: "si",
      key: "si",
      align: "center",
    },
    {
      title: "User Name",
      dataIndex: "userName",
      key: "userName",
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
      render: (text) => <span className="font-semibold">{text || "---"}</span>,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      align: "center",
    },
    {
      title: "Join Date",
      dataIndex: "joinDate",
      key: "joinDate",
      align: "center",
      render: (date) => moment(date).format("DD MMM YYYY"),
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space size="middle" className="flex flex-row justify-center">
          <button onClick={() => viewDetails(record)}>
            <HiOutlineDotsHorizontal className="text-2xl" />
          </button>
        </Space>
      ),
    },
  ];

  const filteredData = fullData?.filter((user) => {
    const matchesText =
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchText.toLowerCase());
    const matchesDate = selectedDate
      ? user.date === selectedDate.format("YYYY-MM-DD")
      : true;

    return matchesText && matchesDate;
  });

  // Paginate the filtered data
  const paginatedData = filteredData?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const dataSource = paginatedData?.map((user, index) => ({
    key: user.id,
    si: (currentPage - 1) * pageSize + index + 1, // Correct the serial number based on page
    userName: `${user?.fullName}`,
    email: user.email,
    deviceUUID: user.deviceUUID,
    role: user.role,
    joinDate: user.createdAt.split(",")[0],
  }));

  return (
    <div className="w-full bg-white rounded-lg">
      {
        isLoading ? <div class="mx-auto w-full h-[420px] flex items-center justify-center animate-pulse rounded-md border border-[#00acb581] p-4">
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
          :
          <ConfigProvider
            theme={{
              components: {
                Table: {
                  headerBg: "#00adb5",
                  headerColor: "#fff",
                  headerBorderRadius: 5,
                },
              },
            }}
          >
            <Table
              columns={columns}
              dataSource={dataSource}
              pagination={false} // Disable pagination in the table to handle it manually
              scroll={{ x: 500 }}
              className="text-center"
            />
          </ConfigProvider>
      }
      {/* Table */}

      {/* User Details Modal */}
      <Modal
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[]}
      >
        {selectedUser && (
          <div>
            <h2 className="text-2xl font-semibold text-center mb-10">User Details</h2>
            <p className="flex items-center justify-between my-5"><strong>Name:</strong> {selectedUser.userName || "---"}</p>
            <p className="flex items-center justify-between my-5"><strong>Email:</strong> {selectedUser.email || "---"}</p>
            <p className="flex items-center justify-between my-5"><strong>Device UUID:</strong> {selectedUser?.deviceUUID}</p>
            <p className="flex items-center justify-between my-5"><strong>Address:</strong> {selectedUser?.address}</p>
            <p className="flex items-center justify-between my-5"><strong>Role:</strong> {selectedUser.role}</p>
            <p className="flex items-center justify-between my-5"><strong>Join Date:</strong> {moment(selectedUser.createdAt).format("DD MMM YYYY")}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RecentTransactions;
