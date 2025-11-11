import React, { useState, useEffect } from 'react';
import { Modal, Input, message, Button, Select, Radio } from 'antd';
import { useCreatePromoCodeMutation, useDeletePromoCodeMutation, useGetAllPromoCodeListQuery, useUpdatePromoCodeMutation } from '../../redux/features/offerFees/offerFees';
import { MdOutlineDeleteForever } from 'react-icons/md';
import OfferFeeComponent from './OfferFeeComponent';
import moment from 'moment';

const OffersAndFees = () => {
    const { data , isLoading } = useGetAllPromoCodeListQuery();
    const fullData = data?.data?.attributes || [];


    const [selectedOption, setSelectedOption] = useState('1');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false); // To track whether we're editing a promo code
    const [referralCode, setReferralCode] = useState('');
    const [discount, setDiscount] = useState('');
    const [status, setStatus] = useState('active');
    const [discountType, setDiscountType] = useState('gift-card');
    const [typeOfDiscount, setTypeOfDiscount] = useState('fixed');
    const [disconnectOn, setDisconnectOn] = useState('onlyApplicatinFees');
    const [startDate, setStartDate] = useState(null);
    const [expiryDate, setExpiryDate] = useState(null);
    const [usageLimit, setUsageLimit] = useState('');
    const [selectedPromoCodeId, setSelectedPromoCodeId] = useState(null); // Store selected promo code ID

    const [createPromoCode] = useCreatePromoCodeMutation();
    const [updatePromoCode] = useUpdatePromoCodeMutation();

    // Handle form submission for creating a new promo code
    const handleCreatePromoCode = async () => {
        const promoCodeData = {
            referralCode,
            discount,
            status,
            discountType,
            typeOfDiscount,
            disconnectOn,
            startDate: moment(startDate).format('YYYY-MM-DD'), // Ensure correct format
            expiryDate: moment(expiryDate).format('YYYY-MM-DD') || null, // Ensure correct format
            usageLimit,
        };

        console.log(promoCodeData);

        try {
            const res = await createPromoCode(promoCodeData).unwrap();
            console.log(res);
            if (res.code === 201) {
                message.success(res?.message || 'Promo code created successfully');
                setIsModalVisible(false);
                setReferralCode('');
                setDiscount('');
                setStatus('active');
                setDiscountType('gift-card');
                setTypeOfDiscount('fixed');
                setDisconnectOn('onlyApplicatinFees');
                setStartDate(null);
                setExpiryDate(null);
                setUsageLimit('');
            } else {
                message.error(res?.message || 'Failed to create promo code');
            }
        } catch (error) {
            console.log(error);
            message.error(error?.data?.message || 'Failed to create promo code');
        }
    };

    // Handle form submission for editing an existing promo code
    const handleUpdatePromoCode = async () => {
        if (!referralCode || !discount || !status || !startDate || !usageLimit) {
            message.error('Please fill in all required fields');
            return;
        }

        const promoCodeData = {
            discount,
            status,
            discountType,
            typeOfDiscount,
            disconnectOn,
            startDate: moment(startDate).format('YYYY-MM-DD'), // Ensure correct format
            expiryDate: moment(expiryDate).format('YYYY-MM-DD') || null, // Ensure correct format
            usageLimit,
        };

        try {
            const res = await updatePromoCode({ id: referralCode, data: promoCodeData }).unwrap();
            if (res.code === 200) {
                message.success(res?.message || 'Promo code updated successfully');
                setIsModalVisible(false);
            } else {
                message.error(res?.message || 'Failed to update promo code');
            }
        } catch (error) {
            message.error(error?.data?.message || 'Failed to update promo code');
        }
    };

    const [deletePromoCode] = useDeletePromoCodeMutation();

    const handleDelete = async (id) => {
        try {
            const res = await deletePromoCode(id).unwrap();
            if (res.code === 200) {
                message.success(res?.message || 'Promo code deleted successfully');
            } else {
                message.error(res?.message || 'Failed to delete promo code');
            }
        } catch (error) {
            message.error(error?.data?.message || 'Failed to delete promo code');
        }
    };

    // Open modal for creating or editing a promo code
    const openModal = (promoCodeId = null) => {
        if (promoCodeId) {
            // Editing a promo code
            const promo = fullData.find(item => item.referralCode === promoCodeId);
            setReferralCode(promo.referralCode);
            setDiscount(promo.discount);
            setStatus(promo.status);
            setDiscountType(promo.discountType);
            setTypeOfDiscount(promo.typeOfDiscount);
            setDisconnectOn(promo.disconnectOn);
            setStartDate(moment(promo.startDate).format('YYYY-MM-DD')); // Set start date correctly
            setExpiryDate(promo.expiryDate ? moment(promo.expiryDate).format('YYYY-MM-DD') : null); // Set expiry date correctly
            setUsageLimit(promo.usageLimit);
            setSelectedPromoCodeId(promoCodeId);
            setIsEditMode(true);
        } else {
            // Creating a new promo code
            setReferralCode('');
            setDiscount('');
            setStatus('active');
            setDiscountType('gift-card');
            setTypeOfDiscount('fixed');
            setDisconnectOn('onlyApplicatinFees');
            setStartDate(null);
            setExpiryDate(null);
            setUsageLimit('');
            setIsEditMode(false);
        }

        setIsModalVisible(true);
    };

    const handleDateChange = (date, setter) => {
        // Format the date before setting it into state (e.g. YYYY-MM-DD format)
        setter(date);
    };

    return (
        <div className="lg:p-8 overflow-x-auto">
            <OfferFeeComponent />

            <div>
                <h2 className="text-2xl font-semibold">Promo Code</h2>
                <p className="text-sm text-gray-500">Manage your promo codes</p>

                <div className="mt-4 bg-[#F0F9FF] !rounded-lg overflow-hidden">
                    <table className="w-full table-auto text-left border-collapse">
                        <thead className="bg-[#00adb5] text-white">
                            <tr>
                                <th className="py-3 px-4 text-xl font-semibold">Promo Code Type</th>
                                <th className="py-3 px-4 text-xl font-semibold">Promo Code</th>
                                <th className="py-3 px-4 text-xl font-semibold">Promo Code Value</th>
                                <th className="py-3 px-4 text-xl font-semibold">Used</th>
                                <th className="py-3 px-4 text-xl font-semibold">ExpiresAt</th>
                                <th className="py-3 px-4 text-xl font-semibold">Action</th>
                            </tr>
                        </thead>
                        <tbody className="!border rounded-lg">
                            {fullData?.map((item, index) => (
                                <tr className="bg-white hover:bg-[#F0F9FF] !border-b capitalize" key={index}>
                                    <td className="py-3 px-4">{item?.discountType}</td>
                                    <td className="py-3 px-4">{item?.referralCode}</td>
                                    <td className="py-3 px-4">{item?.discount}%</td>
                                    <td className="py-3 px-4">{item?.usageLimit} times</td>
                                    <td className="py-3 px-4">
                                        {moment(item?.startDate).format('dddd, MMMM Do YYYY')}
                                    </td>
                                    <td className="py-3 flex items-center gap-2 px-4">
                                        <button
                                            onClick={() => openModal(item?.referralCode)}
                                            className="text-blue-500 mr-2"
                                        >
                                            Edit
                                        </button>
                                        <button onClick={() => handleDelete(item?.referralCode)} className="text-red-500">
                                            <MdOutlineDeleteForever className="text-3xl" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div>
                        {
                            isLoading && <h1 className=' font-semibold text-center text-blue-600 flex items-center justify-center py-3' >Loading...</h1>
                        }
                    </div>
                </div>

                {/* Create New Button */}
                <div className="mt-4">
                    <button
                        className="bg-[#00ADB5] text-white py-2 px-6 rounded-lg"
                        onClick={() => openModal()}  // Open for new promo code
                    >
                        Create New
                    </button>
                </div>
            </div>

            {/* Modal for creating or editing a promo code */}
            <Modal
                title={isEditMode ? 'Edit Promo Code' : 'Create New Promo Code'}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Promo Code Type</label>
                        <Select
                            className="w-full h-10 rounded"
                            value={discountType}
                            onChange={setDiscountType}
                        >
                            <Select.Option value="top-up">Top-Up</Select.Option>
                            <Select.Option value="gift-card">Gift Card</Select.Option>
                            <Select.Option value="uc">Pubg Card</Select.Option>
                        </Select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Promo Code</label>
                        <Input
                            placeholder="Promo Code"
                            className="py-2"
                            value={referralCode}
                            onChange={(e) => setReferralCode(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Promo Code Value</label>
                        <Input
                            type="number"
                            className="py-2"
                            placeholder="Promo Code Value"
                            value={discount}
                            onChange={(e) => setDiscount(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Promo Code Status</label>
                        <Radio.Group value={status} onChange={(e) => setStatus(e.target.value)}>
                            <Radio value="active">Active</Radio>
                            <Radio value="pushed">Pushed</Radio>
                            <Radio value="expired">Expired</Radio>
                        </Radio.Group>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Type of Discount</label>
                        <Select
                            className="w-full h-10 rounded"
                            value={typeOfDiscount}
                            onChange={setTypeOfDiscount}
                        >
                            <Select.Option value="fixed">Fixed</Select.Option>
                            <Select.Option value="percentage">Percentage</Select.Option>
                        </Select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Start Date</label>
                        <input
                            type="date"
                            className="w-full py-2 px-4 border rounded bg-gray-100"
                            value={startDate}  // Directly use the state variable for startDate
                            onChange={(e) => handleDateChange(e.target.value, setStartDate)}  // Handle date change and set the state
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">End Date</label>
                        <input
                            type="date"
                            className="w-full py-2 px-4 border rounded bg-gray-100"
                            value={expiryDate}  // Directly use the state variable for expiryDate
                            onChange={(e) => handleDateChange(e.target.value, setExpiryDate)}  // Handle date change and set the state
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Usage Limit</label>
                        <Input
                            type="number"
                            className="py-2"
                            placeholder="Usage Limit"
                            value={usageLimit}
                            onChange={(e) => setUsageLimit(e.target.value)}
                        />
                    </div>

                    <div className="flex justify-end space-x-4">
                        <Button onClick={() => setIsModalVisible(false)} className="bg-red-500 h-10 px-8 text-white">
                            Cancel
                        </Button>
                        <Button
                            onClick={isEditMode ? handleUpdatePromoCode : handleCreatePromoCode}
                            className="bg-[#00ADB5] h-10 px-8 text-white"
                        >
                            {isEditMode ? 'Update' : 'Create'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default OffersAndFees;
