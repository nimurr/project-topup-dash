import React, { useState } from 'react';
import { Table, Pagination, Input, DatePicker, Space, ConfigProvider, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useGetTransactionsQuery } from '../../redux/features/transactions/transactions';
import moment from 'moment';

const Transactions = () => {
    const [searchText, setSearchText] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const { data, isLoading } = useGetTransactionsQuery({ page: currentPage, limit: pageSize });
    const transactions = data?.data?.attributes?.results || [];

    // Columns for the Table
    const columns = [
        { title: 'SL', dataIndex: 'id', key: 'id', render: (id, record, index) => (currentPage - 1) * pageSize + index + 1 },
        { title: 'User Name', dataIndex: 'user', key: 'user', render: (user) => user?.fullName || 'N/A' },
        { title: 'Phone Number', dataIndex: 'user', key: 'user', render: (user) => user?.callingCode + user?.phoneNumber },
        { title: 'Date & Time', dataIndex: 'createdAt', key: 'createdAt', render: (date) => moment(date).format('dddd MMMM Do YYYY') },
        { title: 'Payment Status', dataIndex: 'status', key: 'status', render: (status) => (status === "pending" ? <span className='capitalize' style={{ color: 'orange' }}>{status}</span> : <span className='capitalize' style={{ color: 'green' }}>{status}</span>) },
        { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (amount) => `$${amount}` },
    ];

    // Filter Data based on Search
    const filteredData = transactions?.filter((transaction) => {
        const fullName = transaction.user?.fullName?.toLowerCase() || '';
        const phoneNumber = transaction.user?.phoneNumber?.toString() || ''; // Ensure phoneNumber is treated as string
        const transactionId = transaction.id?.toString() || '';

        return (
            fullName.includes(searchText.toLowerCase()) ||
            phoneNumber.includes(searchText) ||
            transactionId.includes(searchText)
        );
    });

    // Filter Data based on Selected Date (compare formatted dates)
    const filteredByDate = selectedDate
        ? filteredData.filter((transaction) => {
            const transactionDate = moment(transaction?.createdAt).format('YYYY-MM-DD');
            return transactionDate === selectedDate.format('YYYY-MM-DD');
        })
        : filteredData;

    // Paginated Data: Apply pagination to the filtered data
    const paginatedData = filteredByDate?.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
                        placeholder="Select Date"
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

            {/* Loading Spinner */}
            {isLoading ? (
                <Spin size="large" style={{ display: 'block', textAlign: 'center', marginTop: '50px' }} />
            ) : (
                <>
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
                        total={filteredByDate.length} // Use filtered data length for pagination
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
                </>
            )}
        </div>
    );
};

export default Transactions;