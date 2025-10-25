import React, { useState } from 'react';
import { Table, Pagination, Input, DatePicker, Space, ConfigProvider } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useGetTransactionsQuery } from '../../redux/features/transactions/transactions';
import moment from 'moment';

const Transactions = () => {
    const limit = 10;
    const createdAt = moment().format('YYYY-MM-DD');

    const { data } = useGetTransactionsQuery({ limit, createdAt });
    console.log(data);

    // Static Data for Transactions
    const transactionData = [
        { id: 9003237, userName: "Andrew Chapman", phoneNumber: "+7 (903) 941-02-27", transactionType: "Top-up", paymentMethod: "Credit card", date: "2020-05-02 07:10:15", amount: "$1,927,105", status: "Pending" },
        { id: 5637657, userName: "James Phillips", phoneNumber: "+7 (903) 941-02-27", transactionType: "Gift Card", paymentMethod: "Visha card", date: "2020-05-02 07:10:15", amount: "$1,859,704", status: "Completed" },
        // More data entries...
    ];

    const [searchText, setSearchText] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Columns for the Table
    const columns = [
        { title: 'Transaction ID', dataIndex: 'id', key: 'id' },
        { title: 'User Name', dataIndex: 'userName', key: 'userName' },
        { title: 'Phone Number', dataIndex: 'phoneNumber', key: 'phoneNumber' },
        { title: 'Transaction Type', dataIndex: 'transactionType', key: 'transactionType' },
        { title: 'Payment Method', dataIndex: 'paymentMethod', key: 'paymentMethod' },
        { title: 'Date & Time', dataIndex: 'date', key: 'date' },
        { title: 'Amount', dataIndex: 'amount', key: 'amount' },
        {
            title: 'Status', dataIndex: 'status', key: 'status',
            render: (status) => (
                status === "Pending" ? (
                    <span style={{ color: 'red' }}>{status}</span>
                ) : (
                    <span style={{ color: 'green' }}>{status}</span>
                )
            )
        },
    ];

    // Filter Data based on Search
    const filteredData = transactionData.filter((transaction) => {
        return (
            transaction.userName.toLowerCase().includes(searchText.toLowerCase()) ||
            transaction.id.toString().includes(searchText) ||
            transaction.phoneNumber.includes(searchText)
        );
    });

    // Filter Data based on Selected Date
    const filteredByDate = selectedDate
        ? filteredData.filter((transaction) => transaction.date.startsWith(selectedDate.format('YYYY-MM-DD')))
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
                    <DatePicker onChange={(date) => setSelectedDate(date)} placeholder="Date" />
                    <Input
                        placeholder="Search by Name, Phone, or ID"
                        prefix={<SearchOutlined />}
                        onChange={(e) => setSearchText(e.target.value)}
                        value={searchText}
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
