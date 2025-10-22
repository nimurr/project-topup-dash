import { useEffect, useState } from "react";
import { ConfigProvider, Table, Form, Input, DatePicker } from "antd";
import moment from "moment";
import { IoIosSearch } from "react-icons/io";
import { FaAngleLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import { GoInfo } from "react-icons/go";
import { useGetAllUsersQuery } from "../../../redux/features/user/userApi";

const { Item } = Form;

const Users = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25); // Set initial page size
  const [dataSource, setDataSource] = useState([]); // Store filtered data

  // Pass page and limit dynamically to the query
  const { data, isLoading, isFetching } = useGetAllUsersQuery({
    page: currentPage,
    limit: pageSize,
  });
 

  const usersData = data?.data?.attributes?.results || []; 

  // Format static user data
  useEffect(() => {
    if (usersData.length > 0) {
      const formattedUsers = usersData.map((user, index) => ({
        id: user.id,
        si: (currentPage - 1) * pageSize + index + 1, // Adjust the SI based on the current page
        fullName: user.fullName,
        accountID: user.accountID,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address_line1: user.address_line1,
        createdAt: user.createdAt,
        imageUrl: user.imageUrl,
        status: user.status,
        gender: user.gender,
      }));
      setDataSource(formattedUsers);
    }
  }, [usersData, currentPage, pageSize]); // Run whenever usersData, currentPage, or pageSize changes

  // Search Filter
  useEffect(() => {
    if (searchText.trim() === "") {
      setDataSource(usersData);
    } else {
      setDataSource(
        usersData.filter(
          (user) =>
            user.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
            user.email.toLowerCase().includes(searchText.toLowerCase()) ||
            String(user.phoneNumber).includes(searchText)
        )
      );
    }
  }, [searchText, usersData]);

  // Date Filter
  useEffect(() => {
    if (!selectedDate) {
      setDataSource(usersData);
    } else {
      const formattedDate = selectedDate.format("YYYY-MM-DD");
      setDataSource(
        usersData.filter(
          (user) => moment(user.createdAt).format("YYYY-MM-DD") === formattedDate
        )
      );
    }
  }, [selectedDate, usersData]);

  const columns = [
    {
      title: "#SI",
      dataIndex: "si",
      key: "si",
      render: (text, record, index) => {
        return <span>{index + 1}</span>;
      },
    },
    { title: "Full Name", dataIndex: "fullName", key: "fullName" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone Number", dataIndex: "phoneNumber", key: "phoneNumber" },
    {
      title: "Joined Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => moment(date).format("DD MMM YYYY"),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Link to={`/users/${record.id}`}>
          <GoInfo className="text-2xl" />
        </Link>
      ),
    },
  ];

  // Handle page change
  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize); // Update page size if changed
  };

  return (
    <section>
      <div className="md:flex justify-between items-center py-6 mb-4">
        <Link to={"/collaborator"} className="text-2xl flex items-center">
          <FaAngleLeft /> Users List
        </Link>
        <Form layout="inline" className="md:flex space-x-2 mt-4 md:mt-0">
          <Item name="date">
            <DatePicker
              className="rounded-md border border-[#92b8c0]"
              onChange={(date) => setSelectedDate(date)}
              placeholder="Select Date"
            />
          </Item>
          <Item name="username">
            <Input
              className="rounded-md w-[70%] md:w-full border border-[#92b8c0]"
              placeholder="User Name"
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Item>
          <Item>
            <button className="size-8 rounded-full flex justify-center items-center bg-[#92b8c0] text-black">
              <IoIosSearch className="size-5" />
            </button>
          </Item>
        </Form>
      </div>

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
          pagination={{
            position: ["bottomCenter"],
            current: currentPage,
            pageSize: pageSize,
            total: data?.data?.attributes?.totalResults, // Total items available for pagination
            onChange: handlePageChange,
            showSizeChanger: true, // Allow the user to change the page size
          }}
          loading={isLoading || isFetching}
          scroll={{ x: "max-content" }}
          responsive={true}
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
        />
      </ConfigProvider>
    </section>
  );
};

export default Users;