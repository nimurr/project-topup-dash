import React, { useState } from 'react';
import { Table, Pagination, Input, DatePicker, Space, ConfigProvider } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useGetTransactionsQuery } from '../../redux/features/transactions/transactions';
import moment from 'moment';

const Transactions = () => {
    const [searchText, setSearchText] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const limit = 10;
    const createdAt = moment().format('YYYY-MM-DD');

    const { data } = useGetTransactionsQuery({ limit, createdAt });
    const transactions = data?.data?.attributes?.results || [];
    console.log(transactions);

    // Columns for the Table
    const columns = [
        { title: 'SL', dataIndex: 'id', key: 'id', render: (id, record, index) => (currentPage - 1) * pageSize + index + 1 },
        { title: 'User Name', dataIndex: 'user', key: 'user', render: (user) => user?.fullName },
        { title: 'Phone Number', dataIndex: 'user', key: 'user', render: (user) => user?.callingCode + user?.phoneNumber },
        { title: 'Date & Time', dataIndex: 'createdAt', key: 'createdAt', render: (date) => moment(date).format('dddd MMMM Do YYYY') },
        { title: 'Payment Status', dataIndex: 'status', key: 'status', render: (status) => (status === "pending" ? <span style={{ color: 'orange' }}>{status}</span> : <span style={{ color: 'green' }}>{status}</span>) },
        { title: 'Amount', dataIndex: 'amount', key: 'amount' },
    ];

    // Filter Data based on Search
    const filteredData = transactions?.filter((transaction) => {
        return (
            transaction.user?.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
            transaction.id?.toString().includes(searchText) ||
            transaction.phoneNumber?.includes(searchText)
        );
    });

    // Filter Data based on Selected Date
    const filteredByDate = selectedDate
        ? filteredData.filter((transaction) => moment(transaction.createdAt).isSame(selectedDate, 'day'))
        : filteredData;

    // Paginated Data
    const paginatedData = filteredByDate.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div style={{ padding: '20px' }}>
            {/* Search and Date Filters */}
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <h2 className='text-2xl'>Transactions</h2>
                </div>
                <Space>
                    <DatePicker
                        onChange={(date) => setSelectedDate(date)}
                        placeholder="Date"
                        format="YYYY-MM-DD"
                        className='border border-[#00adb5]'
                    />
                    <Input
                        placeholder="Search by Name, Phone, or ID"
                        prefix={<SearchOutlined />}
                        onChange={(e) => setSearchText(e.target.value)}
                        value={searchText}
                        className='border border-[#00adb5]'
                    />
                </Space>
            </div>

            {/* ConfigProvider to customize table header color */}
            <ConfigProvider
                theme={{
                    components: {
                        Table: {
                            headerBg: '#00adb5', // Set background color for table header
                            headerColor: '#ffffff', // Set text color for table header
                        },
                    },
                }}
            >
                <Table
                    columns={columns}
                    dataSource={paginatedData}
                    pagination={false}
                    rowKey="id"
                    bordered
                    scroll={{ x: 'max-content' }}
                />
            </ConfigProvider>

            {/* Pagination */}
            <Pagination
                current={currentPage}
                total={filteredByDate.length}
                pageSize={pageSize}
                onChange={(page, size) => {
                    setCurrentPage(page);
                    setPageSize(size);
                }}
                showSizeChanger
                pageSizeOptions={[10, 20, 50, 100]}
                style={{ marginTop: '20px', textAlign: 'center' }}
                className='flex items-center justify-end'
            />
        </div>
    );
};

export default Transactions;
