import React, { useState, useEffect } from 'react';
import { Modal, Input, message, Button, Select, DatePicker, Radio } from 'antd';
import { IoMdInformationCircleOutline } from 'react-icons/io';
import { useCreatePromoCodeMutation, useDeletePromoCodeMutation, useGetAllPromoCodeListQuery, useUpdatePromoCodeMutation } from '../../redux/features/offerFees/offerFees';
import moment from 'moment';
import { MdOutlineDeleteForever } from 'react-icons/md';
import OfferFeeComponent from './OfferFeeComponent';

const OffersAndFees = () => {
    const { data } = useGetAllPromoCodeListQuery();
    const fullData = data?.data?.attributes || [];

    const [selectedOption, setSelectedOption] = useState('1');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);  // New state to check edit mode
    const [promoCodeType, setPromoCodeType] = useState('top-up');
    const [promoCode, setPromoCode] = useState('');
    const [promoCodeValue, setPromoCodeValue] = useState('');
    const [promoCodeStatus, setPromoCodeStatus] = useState('active');
    const [expiresAt, setExpiresAt] = useState(null);
    const [usageLimit, setUsageLimit] = useState('');
    const [amount, setAmount] = useState('');
    const [selectedPromoCodeId, setSelectedPromoCodeId] = useState(null);  // Store selected promo code id

    // Mutations
    const [createPromoCode] = useCreatePromoCodeMutation();
    const [updatePromoCode] = useUpdatePromoCodeMutation();

    // Handle form submission for new promo code
    const handleCreatePromoCode = async () => {
        if (!promoCode || !promoCodeValue || !promoCodeStatus || !expiresAt || !usageLimit) {
            message.error('Please fill in all required fields');
            return;
        }

        const promoCodeData = {
            referralCode: promoCode,
            percentage: promoCodeValue,
            status: promoCodeStatus,
            type: promoCodeType,
            expiresAt: moment(expiresAt).format('YYYY-MM-DD'),
            usageLimit,
            amount,
        };

        try {
            const res = await createPromoCode(promoCodeData).unwrap();
            console.log(res);
            if (res.code === 201) {
                message.success(res?.message || 'Promo code created successfully');
                setIsModalVisible(false);
            } else {
                message.error(res?.message || 'Failed to create promo code');
            }
        } catch (error) {
            console.log(error?.data?.message);
            message.error(error?.data?.message || 'Failed to create promo code');
        }
    };

    // Handle form submission for editing an existing promo code
    const handleUpdatePromoCode = async () => {
        if (!promoCode || !promoCodeValue || !promoCodeStatus || !expiresAt || !usageLimit) {
            message.error('Please fill in all required fields');
            return;
        }

        const promoCodeData = {
            referralCode: promoCode,
            percentage: promoCodeValue,
            status: promoCodeStatus,
            type: promoCodeType,
            expiresAt: moment(expiresAt).format('YYYY-MM-DD'),
            usageLimit,
            amount,
        };

        try {
            const res = await updatePromoCode({ id: selectedPromoCodeId, ...promoCodeData }).unwrap();
            console.log(res);
            if (res.code === 200) {
                message.success(res?.message || 'Promo code updated successfully');
                setIsModalVisible(false);
            } else {
                message.error(res?.message || 'Failed to update promo code');
            }
        } catch (error) {
            console.log(error?.data?.message);
            message.error(error?.data?.message || 'Failed to update promo code');
        }
    };

    const [deletePromoCode] = useDeletePromoCodeMutation();

    const handleDelete = async (id) => {
        try {
            const res = await deletePromoCode(id).unwrap();
            console.log(res);
            if (res.code === 200) {
                message.success(res?.message || 'Promo code deleted successfully');
            } else {
                message.error(res?.message || 'Failed to delete promo code');
            }
        } catch (error) {
            console.log(error);
            message.error(error?.data?.message || 'Failed to delete promo code');
        }
    };

    // Open modal for creating or editing a promo code
    const openModal = (promoCodeId = null) => {
        if (promoCodeId) {
            // Editing a promo code
            const promo = fullData.find(item => item.referralCode === promoCodeId);
            setPromoCode(promo.referralCode);
            setPromoCodeValue(promo.percentage);
            setPromoCodeStatus(promo.status);
            setPromoCodeType(promo.type);
            setExpiresAt(moment(promo.expiresAt));
            setUsageLimit(promo.usageLimit);
            setAmount(promo.amount || '');
            setSelectedPromoCodeId(promoCodeId);  // Set selected promo code ID
            setIsEditMode(true);
        } else {
            // Creating a new promo code
            setPromoCode('');
            setPromoCodeValue('');
            setPromoCodeStatus('active');
            setPromoCodeType('top-up');
            setExpiresAt(null);
            setUsageLimit('');
            setAmount('');
            setIsEditMode(false);
        }

        setIsModalVisible(true);
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
                                    <td className="py-3 px-4">{item?.type}</td>
                                    <td className="py-3 px-4">{item?.referralCode}</td>
                                    <td className="py-3 px-4">{item?.percentage}%</td>
                                    <td className="py-3 px-4">{item?.usageLimit} times</td>
                                    <td className="py-3 px-4">
                                        {moment(item?.expiresAt).format('dddd, MMMM Do YYYY')}
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
                            value={promoCodeType}
                            onChange={setPromoCodeType}
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
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Promo Code Value</label>
                        <Input
                            type="number"
                            className="py-2"
                            placeholder="Promo Code Value"
                            value={promoCodeValue}
                            onChange={(e) => setPromoCodeValue(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Promo Code Status</label>
                        <Radio.Group value={promoCodeStatus} onChange={(e) => setPromoCodeStatus(e.target.value)}>
                            <Radio value="active">Active</Radio>
                            <Radio value="pushed">Pushed</Radio>
                            <Radio value="expired">Expired</Radio>
                        </Radio.Group>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Expiration Date</label>
                        <DatePicker
                            className="w-full py-2 px-4 border rounded bg-gray-100"
                            value={expiresAt}
                            onChange={(date) => setExpiresAt(date)}
                            format="YYYY-MM-DD"
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

                    <div>
                        <label className="block text-sm font-medium">Amount (optional)</label>
                        <Input
                            type="number"
                            className="py-2"
                            placeholder="Amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
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