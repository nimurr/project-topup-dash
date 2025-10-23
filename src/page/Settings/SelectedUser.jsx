import React, { useEffect, useState } from "react";
import { Table, Checkbox, Button, Pagination, message } from "antd";
import { TbSend } from "react-icons/tb";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useGetAllUsersQuery } from "../../redux/features/user/userApi";
import { GoInfo } from "react-icons/go";
import { Link } from "react-router-dom";
import { useSendUserNotificationMutation } from "../../redux/features/setting/settingApi";

const SelectedUser = () => {
    const [searchParams] = useSearchParams();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        const titleParam = searchParams.get("title");
        const descriptionParam = searchParams.get("description");

        if (titleParam) setTitle(titleParam);
        if (descriptionParam) setDescription(descriptionParam);
    }, [searchParams]);

    const [searchText, setSearchText] = useState("");
    const [selectedDate, setSelectedDate] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);
    const [dataSource, setDataSource] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const { data: user, isLoading, isFetching } = useGetAllUsersQuery({
        page: currentPage,
        limit: pageSize,
    });

    const usersData = user?.data?.attributes?.results || [];

    // Format user data with fallback values
    useEffect(() => {
        if (usersData.length > 0) {
            const formattedUsers = usersData.map((user, index) => ({
                id: user.id,
                si: (currentPage - 1) * pageSize + index + 1,
                fullName: user.fullName || `${user.firstName || ""} ${user.lastName || ""}`.trim() || "N/A",
                accountID: user.accountID || "N/A",
                email: user.email || "N/A",
                phoneNumber: user.phoneNumber || "N/A",
                address_line1: user.address_line1 || "N/A",
                createdAt: user.createdAt ? new Date(user.createdAt).toLocaleString() : "N/A",
                imageUrl: user.profileImage ? `YOUR_BASE_URL_HERE/${user.profileImage}` : "default_image_url", // Set a default image URL
                status: user.status || "N/A",
                gender: user.gender || "N/A",
            }));
            setDataSource(formattedUsers);
        }
    }, [usersData, currentPage, pageSize]);

    // Handle Page Change
    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    // Handle Row Selection
    const handleSelectRow = (id) => {
        const newSelectedRowKeys = [...selectedRowKeys];
        if (newSelectedRowKeys.includes(id)) {
            const index = newSelectedRowKeys.indexOf(id);
            newSelectedRowKeys.splice(index, 1);
        } else {
            newSelectedRowKeys.push(id);
        }
        setSelectedRowKeys(newSelectedRowKeys);
    };

    // Handle Select All
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const allRowKeys = usersData.map((item) => item.id);
            setSelectedRowKeys(allRowKeys);
        } else {
            setSelectedRowKeys([]);
        }
    };

    // Check if all rows are selected
    const isAllSelected = selectedRowKeys.length === usersData.length;

    const columns = [
        {
            title: <Checkbox onChange={handleSelectAll} checked={isAllSelected} />,
            dataIndex: "select",
            key: "select",
            render: (text, record) => (
                <Checkbox
                    checked={selectedRowKeys.includes(record.id)}
                    onChange={() => handleSelectRow(record.id)}
                />
            ),
        },
        {
            title: "#SI",
            dataIndex: "si",
            key: "si",
            render: (text, record, index) => index + 1,
        },
        {
            title: "User Name",
            dataIndex: "fullName",
            key: "fullName",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Phone Number",
            dataIndex: "phoneNumber",
            key: "phoneNumber",
        },
        {
            title: "Joined Date",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date) => new Date(date).toLocaleDateString(),
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

    // Pagination Properties
    const paginationProps = {
        current: currentPage,
        pageSize: pageSize,
        total: usersData?.length,
        onChange: handlePageChange,
        showSizeChanger: false,
    };

    const [sendUserNotification, { isLoading: isSendingNotification }] = useSendUserNotificationMutation();
    const navigate = useNavigate();

    const handleSendNotification = async () => {
        const formData = {
            userIds: selectedRowKeys,
            title: title,
            content: description,
        };

        try {
            const response = await sendUserNotification(formData).unwrap();

            if (response.code === 200) {
                message.success("Notification sent successfully.");
                setSelectedRowKeys([]); // Clear selection after sending
                navigate('/settings/send-notification'); // Navigate to notification page
            } else {
                message.error("Failed to send notification.");
            }

        } catch (error) {
            console.error("Error sending notification:", error);
            message.error("Failed to send notification.");
        }

    };

    return (
        <div className="sm:p-8 p-2 overflow-x-auto">
            <div className="mb-2 capitalize">
                <h2> Title :- {title}</h2>
                <h2> Description :- {description}</h2>
            </div>
            <div className="min-w-[1000px]">
                <div className="flex justify-between w-full mb-5">
                    <h2 className="text-2xl font-semibold mb-4">User Management</h2>
                    <button
                        disabled={selectedRowKeys.length === 0}
                        onClick={handleSendNotification}
                        className={`text-white py-2 px-10 bg-[#00adb5] rounded flex items-center gap-2 ${selectedRowKeys.length === 0 && 'bg-[#536566] cursor-no-drop text-gray-400'}`}
                    >
                        Send Notification {isSendingNotification && '...'} <TbSend className="text-xl" />
                    </button>
                </div>
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    pagination={{
                        position: ["bottomCenter"],
                        current: currentPage,
                        pageSize: pageSize,
                        total: user?.data?.attributes?.totalResults, // Total items available for pagination
                        onChange: handlePageChange,
                        showSizeChanger: true, // Allow the user to change the page size

                    }}
                    rowKey="id"
                    bordered
                    className="mb-6"
                />
            </div>
        </div>
    );
};

export default SelectedUser;
