import React, { useState } from 'react';
import { Modal, Input, Button, message, Select } from 'antd';
import { useGerAllFeesQuery, useUpdateFeesMutation } from '../../redux/features/offerFees/offerFees';
import moment from 'moment';

const OfferFeeComponent = () => {
    const { data, isLoading } = useGerAllFeesQuery();
    const fullData = data?.data?.attributes;

    // State variables for modal visibility
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);

    // States for the data of the selected fee type (for editing purposes)
    const [selectedFee, setSelectedFee] = useState(null);
    const [stripePercentageFee, setStripePercentageFee] = useState('');
    const [feeType, setFeeType] = useState('');

    const [updateFees] = useUpdateFeesMutation();

    // Open the view modal and populate with the selected fee type data
    const openViewModal = (fee) => {
        setSelectedFee(fee);
        setIsViewModalVisible(true);
    };

    // Open the edit modal and populate with the stripePercentageFee data
    const openEditModal = (fee) => {
        setSelectedFee(fee);
        setStripePercentageFee(fee.stripePercentageFee || '');
        setFeeType(fee.type || 'stripe');  // Set the fee type for editing
        setIsEditModalVisible(true);
    };

    // Handle saving the edited data
    const handleEditSave = async () => {
        if (!stripePercentageFee) {
            message.error('Please enter a valid stripe percentage fee');
            return;
        }

        const updatedFee = {
            type: feeType,
            stripePercentageFee: stripePercentageFee,
        };

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

                <div className="mt-4 rounded-lg gap-2">
                    <table
                        border={1}
                        className="w-full !border-2 !rounded-lg border-[#F0F9FF] table-auto text-left border-collapse"
                    >
                        <thead>
                            <tr className="border-b border-[#F0F9FF]">
                                <th className="py-2 px-4 text-base font-semibold">Stripe Percentage Fee</th>
                                <th className="py-2 px-4 text-base font-semibold">Top-Up Fee</th>
                                <th className="py-2 px-4 text-base font-semibold">Gift Card Fee</th>
                                <th className="py-2 px-4 text-base font-semibold">Status</th>
                                <th className="py-2 px-4 text-base font-semibold">Created At</th>
                                <th className="py-2 px-4 text-base font-semibold">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                fullData?.map((fee) => (
                                    <tr key={fee.id} className="border-b capitalize border-[#F0F9FF]">
                                        <td className="py-2 px-4">{fee.stripePercentageFee}%</td>
                                        <td className="py-2 px-4">{fee.topUpFees}</td>
                                        <td className="py-2 px-4">{fee.giftCardFee}</td>
                                        <td className="py-2 px-4">{fee.status}</td>
                                        <td className="py-2 px-4">{moment(fee.createdAt).format('YYYY-MM-DD')}</td>
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
                </div>
            </div>

            {/* View Modal */}
            <Modal
                visible={isViewModalVisible}
                onCancel={() => setIsViewModalVisible(false)}
                footer={null}
            >
                <div className="space-y-3 mt-5">
                    <p className="text-base flex justify-between"><strong>Stripe Percentage Fee:</strong> {selectedFee?.stripePercentageFee}%</p>
                    <p className="text-base flex justify-between"><strong>Top-Up Fee:</strong> {selectedFee?.topUpFees}</p>
                    <p className="text-base flex justify-between"><strong>Gift Card Fee:</strong> {selectedFee?.giftCardFee}</p>
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
                        <label className="block text-sm font-medium">Stripe Percentage Fee</label>
                        <Input
                            type="number"
                            value={stripePercentageFee}
                            className="p-2"
                            onChange={(e) => setStripePercentageFee(e.target.value)}
                            placeholder="Enter stripe fee percentage"
                        />
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
