import React, { useState } from 'react';
import { Tooltip, Input, Button, message } from 'antd';
import { IoMdInformationCircleOutline } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import { FaChevronLeft } from 'react-icons/fa';

const SendNotification = () => {
    // State to manage selected notification type and input values
    const [selectedNotification, setSelectedNotification] = useState('Especial Offer');
    const [input1, setInput1] = useState('');
    const [input2, setInput2] = useState('');
    const navigate = useNavigate();

    // Dummy text for description
    const notificationDescription = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularized in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`;

    // Function to handle button clicks
    const handleSendToAllUser = () => {
        // if (!input1 || !input2) {
        //     return message.error('Please fill in both Title and Description fields');
        // }
        // message.success('Notification sent to all users');
    };

    const handleSelectUser = () => {
        if (!input1 || !input2) {
            return message.error('Please fill in both Title and Description fields');
        }
        return navigate(`/settings/selected-user?title=${input1}&description=${input2}`);
    };

    return (
        <div className="p-8">
            {/* Setting Section */}
            <div className="mb-6">
                <Link to="/settings" className="text-2xl font-semibold flex items-center gap-2"> <FaChevronLeft className='text-xl' /> Users Notifications </Link>
            </div>

  

            {/* Input Fields Section */}
            <div className=" gap-2 grid md:grid-cols-3">
                {/* Input Field 1 */}
                <div className='md:col-span-1'>
                    <label className="block text-base font-medium">Title</label>
                    <input
                        placeholder="Enter Title"
                        value={input1}
                        onChange={(e) => setInput1(e.target.value)}
                        className="w-full py-2 px-4 border rounded outline-none right-0 bg-gray-100"
                    />
                </div>

                {/* Input Field 2 */}
                <div className='md:col-span-2'>
                    <label className="block text-base font-medium">Description</label>
                    <textarea
                        placeholder="Enter Description"
                        value={input2}
                        rows={5}
                        onChange={(e) => setInput2(e.target.value)}
                        className="w-full py-2 px-4 border rounded outline-none right-0 bg-gray-100"
                    />
                </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-end gap-2">
                {/* <button onClick={handleSendToAllUser} className="bg-[#00adb5] text-white py-3 px-6 rounded-lg text-base font-semibold">
                    Send To All User
                </button> */}
                <button onClick={handleSelectUser} className="bg-[#00adb5] text-white border-2 border-[#00adb5] py-3 px-6 rounded-lg text-base font-semibold">
                    Select User
                </button>
            </div>
        </div>
    );
};

export default SendNotification;
