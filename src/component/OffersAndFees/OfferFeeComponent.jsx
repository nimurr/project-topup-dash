import React, { useState } from 'react';
import { Modal, Input, Button, message, Select } from 'antd';
import { useGerAllFeesQuery, useUpdateFeesMutation } from '../../redux/features/offerFees/offerFees';
import moment from 'moment';

const OfferFeeComponent = () => {
    const { data, isLoading } = useGerAllFeesQuery();
    const fullData = data?.data?.attributes;

    console.log(fullData);

    // State variables for modal visibility
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);

    // States for the data of the selected fee type (for editing purposes)
    const [selectedFee, setSelectedFee] = useState(null);
    const [stripeAmount, setStripeAmount] = useState('');
    const [stripeUnit, setStripeUnit] = useState('percentage');
    const [giftCardAmount, setGiftCardAmount] = useState('');
    const [giftCardUnit, setGiftCardUnit] = useState('fixed');
    const [topUpAmount, setTopUpAmount] = useState('');
    const [topUpUnit, setTopUpUnit] = useState('fixed');
    const [feeType, setFeeType] = useState('stripe'); // default to stripe

    const [updateFees] = useUpdateFeesMutation();

    // Open the view modal and populate with the selected fee type data
    const openViewModal = (fee) => {
        setSelectedFee(fee);
        setIsViewModalVisible(true);
    };

    // Open the edit modal and populate with the fee data
    const openEditModal = (fee) => {
        setSelectedFee(fee);
        setStripeAmount(fee?.stripeFee?.amount || '');
        setStripeUnit(fee?.stripeFee?.unit || 'percentage');
        setGiftCardAmount(fee?.giftCardFee?.amount || '');
        setGiftCardUnit(fee?.giftCardFee?.unit || 'fixed');
        setTopUpAmount(fee?.topUpFees?.amount || '');
        setTopUpUnit(fee?.topUpFees?.unit || 'fixed');
        setFeeType(fee?.type || 'stripe');
        setIsEditModalVisible(true);
    };

    // Handle saving the edited data
    const handleEditSave = async () => {
        if (!stripeAmount || !giftCardAmount || !topUpAmount) {
            message.error('Please enter valid amounts for all fees');
            return;
        }

        // Prepare the updated fee object based on the fee type
        const updatedFee = {
            type: feeType,
            stripeFee: { amount: stripeAmount, unit: stripeUnit },
            giftCardFee: { amount: giftCardAmount, unit: giftCardUnit },
            topUpFees: { amount: topUpAmount, unit: topUpUnit },
        };

        console.log(updatedFee);

        try {
            // Call the mutation to update the fee
            const res = await updateFees(updatedFee).unwrap();
            console.log(res);
            message.success('Fee updated successfully!');
            setIsEditModalVisible(false);
        } catch (error) {
            message.error('Failed to update fee');
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-2xl font-semibold">Offers & Fees</h2>
                <p className="text-sm text-gray-500">Set your commission for top-ups and gift cards</p>

                <div className="mt-4 rounded-lg gap-2 overflow-hidden ">
                    <table
                        border={1}
                        className="w-full !border border-[#00adb5] !rounded-lg overflow-hidden table-auto text-left border-collapse"
                    >
                        <thead className='bg-[#00adb5] text-white overflow-hidden rounded-lg'>
                            <tr className="border-b border-[#F0F9FF]">
                                <th className="py-3 px-4 text-base font-semibold">Stripe Percentage Fee</th>
                                <th className="py-3 px-4 text-base font-semibold">Top-Up Fee</th>
                                <th className="py-3 px-4 text-base font-semibold">Gift Card Fee</th>
                                <th className="py-3 px-4 text-base font-semibold">Status</th>
                                <th className="py-3 px-4 text-base font-semibold">Created At</th>
                                <th className="py-3 px-4 text-base font-semibold">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                fullData?.map((fee) => (
                                    <tr key={fee.id} className="border capitalize border-[#00adb5]">
                                        <td className="py-2 px-4">{fee?.stripeFee?.amount}{fee?.stripeFee?.unit == 'fixed' ? '$' : '%'}</td>
                                        <td className="py-2 px-4">{fee?.topUpFees?.amount}{fee?.topUpFees?.unit == 'fixed' ? '$' : '%'}</td>
                                        <td className="py-2 px-4">{fee?.giftCardFee?.amount}{fee?.giftCardFee?.unit == 'fixed' ? '$' : '%'}</td>
                                        <td className="py-2 px-4">{fee?.status}</td>
                                        <td className="py-2 px-4">{moment(fee?.createdAt).format('YYYY-MM-DD')}</td>
                                        <td className="py-2 px-4 flex items-center gap-3">
                                            <button
                                                onClick={() => openViewModal(fee)}
                                                className="text-blue-500 mr-2"
                                            >
                                                View
                                            </button>
                                            <button
                                                onClick={() => openEditModal(fee)}
                                                className="text-blue-500"
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    <div>
                        {
                            isLoading && <h1 className=' font-semibold text-center text-blue-600 flex items-center justify-center py-3' >Loading...</h1>
                        }
                    </div>
                </div>
            </div>

            {/* View Modal */}
            <Modal
                visible={isViewModalVisible}
                onCancel={() => setIsViewModalVisible(false)}
                footer={null}
            >
                <div className="space-y-3 mt-5">
                    <p className="text-base flex justify-between"><strong>Stripe Percentage Fee:</strong> {selectedFee?.stripeFee?.amount} ({selectedFee?.stripeFee?.unit})</p>
                    <p className="text-base flex justify-between"><strong>Top-Up Fee:</strong> {selectedFee?.topUpFees?.amount} ({selectedFee?.topUpFees?.unit})</p>
                    <p className="text-base flex justify-between"><strong>Gift Card Fee:</strong> {selectedFee?.giftCardFee?.amount} ({selectedFee?.giftCardFee?.unit})</p>
                    <p className="text-base flex justify-between"><strong>Status:</strong> {selectedFee?.status}</p>
                    <p className="text-base flex justify-between"><strong>Created At:</strong> {new Date(selectedFee?.createdAt).toLocaleString()}</p>
                </div>
            </Modal>

            {/* Edit Modal */}
            <Modal
                title={`Edit ${selectedFee?.type} Fee`}
                visible={isEditModalVisible}
                onCancel={() => setIsEditModalVisible(false)}
                footer={null}
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Fee Type</label>
                        <Select
                            value={feeType}
                            onChange={setFeeType}
                            className="w-full border rounded-lg border-gray-200 h-10"
                        >
                            <Select.Option value="stripe">Stripe</Select.Option>
                            <Select.Option value="topUp">Top Up</Select.Option>
                            <Select.Option value="giftCard">Gift Card</Select.Option>
                        </Select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Amount</label>
                        <Input
                            type="number"
                            value={feeType === 'stripe' ? stripeAmount : feeType === 'giftCard' ? giftCardAmount : topUpAmount}
                            className="p-2"
                            onChange={(e) => {
                                if (feeType === 'stripe') setStripeAmount(e.target.value);
                                else if (feeType === 'giftCard') setGiftCardAmount(e.target.value);
                                else setTopUpAmount(e.target.value);
                            }}
                            placeholder="Enter fee amount"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Type of Fee</label>
                        <Select
                            value={feeType === 'stripe' ? stripeUnit : feeType === 'giftCard' ? giftCardUnit : topUpUnit}
                            onChange={(value) => {
                                if (feeType === 'stripe') setStripeUnit(value);
                                else if (feeType === 'giftCard') setGiftCardUnit(value);
                                else setTopUpUnit(value);
                            }}
                            className="w-full border rounded-lg border-gray-200 h-10"
                        >
                            <Select.Option value="percentage">Percentage</Select.Option>
                            <Select.Option value="fixed">Fixed</Select.Option>
                        </Select>
                    </div>

                    <div className="flex justify-end space-x-4">
                        <Button onClick={() => setIsEditModalVisible(false)} className="bg-gray-500 text-white">
                            Cancel
                        </Button>
                        <Button onClick={handleEditSave} className="bg-[#00ADB5] text-white">
                            Save
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default OfferFeeComponent;
