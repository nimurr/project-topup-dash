import { ConfigProvider, Table, Pagination, Space, message, Modal, Button } from "antd";
import { useState } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

const RecentTransactions = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const [pageSize, setPageSize] = useState(10); // Items per page
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // Store selected user details

  // Static Data
  const recentUsers = [
    {
      id: 1,
      fullName: "John Doe",
      email: "john.doe@example.com",
      role: "Admin",
      createdAt: "2023-01-15",
    },
    {
      id: 2,
      fullName: "Jane Smith",
      email: "jane.smith@example.com",
      role: "User",
      createdAt: "2023-02-20",
    },
    {
      id: 3,
      fullName: "Michael Johnson",
      email: "michael.johnson@example.com",
      role: "Admin",
      createdAt: "2023-03-10",
    },
    {
      id: 4,
      fullName: "Sarah Brown",
      email: "sarah.brown@example.com",
      role: "User",
      createdAt: "2023-04-05",
    },
    {
      id: 5,
      fullName: "Chris Evans",
      email: "chris.evans@example.com",
      role: "Admin",
      createdAt: "2023-05-12",
    },
    {
      id: 6,
      fullName: "David Clark",
      email: "david.clark@example.com",
      role: "User",
      createdAt: "2023-06-18",
    },
    {
      id: 7,
      fullName: "Emily Davis",
      email: "emily.davis@example.com",
      role: "User",
      createdAt: "2023-07-22",
    },
    {
      id: 8,
      fullName: "James Wilson",
      email: "james.wilson@example.com",
      role: "Admin",
      createdAt: "2023-08-14",
    },
  ];

  // Handle User Blocking
  const handleUserRemove = async (id) => {
    try {
      message.success("User blocked successfully!");
    } catch (error) {
      message.error("Something went wrong");
    }
  };

  // Handle User Unblocking
  const handleUserUnBlock = async (id) => {
    try {
      message.success("User unblocked successfully!");
    } catch (error) {
      message.error("Something went wrong");
    }
  };

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

  const filteredData = recentUsers?.filter((user) => {
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
    role: user.role,
    joinDate: user.createdAt.split(",")[0],
  }));

  return (
    <div className="w-full bg-white rounded-lg">
      {/* Table */}
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

      {/* Custom Pagination Component */}
      <div className="flex justify-center my-10">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={filteredData?.length}
          onChange={(page, pageSize) => {
            setCurrentPage(page);
            setPageSize(pageSize);
          }}
          showSizeChanger
          pageSizeOptions={[10, 20, 50, 100]}
          style={{ display: "flex", justifyContent: "center", width: "100%" }} // Custom style for centering
        />
      </div>

      {/* User Details Modal */}
      <Modal
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[]}
      >
        {selectedUser && (
          <div>
            <h2 className="text-2xl font-semibold text-center mb-10">User Details</h2>
            <p className="flex items-center justify-between my-5"><strong>Name:</strong> {selectedUser.userName}</p>
            <p className="flex items-center justify-between my-5"><strong>Email:</strong> {selectedUser.email}</p>
            <p className="flex items-center justify-between my-5"><strong>Role:</strong> {selectedUser.role}</p>
            <p className="flex items-center justify-between my-5"><strong>Join Date:</strong> {selectedUser.joinDate}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RecentTransactions;
