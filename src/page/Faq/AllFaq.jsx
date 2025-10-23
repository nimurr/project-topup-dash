import React, { useEffect, useState } from 'react';
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { Modal, Button, Input, Form, notification, message } from 'antd';
import { FaArrowLeft, FaPlus } from 'react-icons/fa';
import { useAddFaqMainMutation, useDeleteFaqMutation, useGetAllFaqQuery, useUpdateFaqMutation } from '../../redux/features/setting/settingApi';

const AllFaq = () => {
    const { data: fulldata, refetch } = useGetAllFaqQuery();
    const allFaq = fulldata?.data?.attributes?.results;

    const [faqsDelete] = useDeleteFaqMutation();
    const [addFaq] = useAddFaqMainMutation();
    const [updateFaq] = useUpdateFaqMutation();  // Mutation to update FAQ

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);  // State for the update modal
    const [selectedFaq, setSelectedFaq] = useState(null);  // State for selected FAQ to be updated
    const [form] = Form.useForm();  // Form reference for modal

    useEffect(() => {
        refetch();
    }, [refetch]);

    const showModal = () => {
        setIsModalVisible(true); // Open the add FAQ modal
    };

    const handleCancel = () => {
        setIsModalVisible(false); // Close the modal
    };

    const handleAddFaq = async (values) => {
        // Add the new FAQ to the list
        console.log(values);

        try {
            const res = await addFaq(values).unwrap();
            console.log(res);

            if (res?.success) {
                notification.success({
                    message: 'FAQ Added Successfully!',
                });
                refetch();
                setIsModalVisible(false);
                form.resetFields();  // Reset the form fields
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleDelete = async (faq) => {
        try {
            const res = await faqsDelete({ question: faq?.question });
            console.log(res);
            if (res?.data?.success) {
                notification.success({
                    message: 'FAQ Deleted Successfully!',
                });
                refetch();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const showUpdateModal = (faq) => {
        setSelectedFaq(faq);
        form.setFieldsValue({
            question: faq.question,
            answer: faq.answer,
        });
        setIsUpdateModalVisible(true);  // Open the update FAQ modal
    };

    const handleUpdateFaq = async (values) => {
        const data = {
            question: values.question,
            answer: values.answer
        }
        try {
            const res = await updateFaq({ id: selectedFaq.id, data }).unwrap();
            console.log(res);

            if (res?.code === 200) {
                message.success(res?.message);
                refetch();
                setIsUpdateModalVisible(false);
                form.resetFields();
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <div className='md:p-4 mt-5 sm:mt-0 flex items-center justify-between'>
                <Link to={"/settings"} className="flex items-center cursor-pointer my-8">
                    <FaArrowLeft size={25} />
                    <h1 className="text-xl font-medium ml-1">All FAQ</h1>
                </Link>
                <div>
                    <button
                        className="bg-[#00adb5] text-white px-10 py-3 text-xl rounded-lg flex items-center gap-2"
                        onClick={showModal} // Open modal when clicking the button
                    >
                        <FaPlus className='text-xl font-semibold text-white' /> Add FAQ
                    </button>
                </div>
            </div>

            {/* List of FAQs */}
            <div className="mt-5 md:px-8 px-3">
                <div className="my-5">
                    {allFaq?.map((faq, index) => (
                        <div key={index} className="flex items-start gap-3 border border-[#00adb5] p-3 rounded-lg justify-between py-5">
                            <div>
                                <p className="font-medium text-xl mb-2">{++index}. {faq.question}</p>
                                <p><span className='font-semibold'>Answer:</span>  {faq.answer}</p>
                            </div>
                            <div>
                                <button
                                    onClick={() => showUpdateModal(faq)} // Call update function on button click
                                    className='bg-[#00adb5] mb-1 text-white md:px-10 px-6 py-3 rounded-lg mr-2'
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(faq)} // Call delete function on button click
                                    className='bg-[#dd1811] text-white md:px-10 px-6 py-3 rounded-lg'
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal for adding FAQ */}
            <Modal
                title="Add New FAQ"
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <Form
                    form={form}
                    onFinish={handleAddFaq}
                    layout="vertical"
                    initialValues={{ question: '', answer: '' }}
                >
                    <Form.Item
                        name="question"
                        label="Question"
                        rules={[{ required: true, message: 'Please enter the question!' }]}
                    >
                        <Input placeholder="Enter the question" />
                    </Form.Item>
                    <Form.Item
                        name="answer"
                        label="Answer"
                        rules={[{ required: true, message: 'Please enter the answer!' }]}
                    >
                        <Input.TextArea placeholder="Enter the answer" rows={4} />
                    </Form.Item>

                    <div className="flex justify-end gap-4">
                        <Button onClick={handleCancel} className="bg-gray-400 text-white">
                            Cancel
                        </Button>
                        <Button type="primary" htmlType="submit" className="bg-[#00adb5] text-white">
                            Add FAQ
                        </Button>
                    </div>
                </Form>
            </Modal>

            {/* Modal for updating FAQ */}
            <Modal
                title="Update FAQ"
                visible={isUpdateModalVisible}
                onCancel={() => setIsUpdateModalVisible(false)}
                footer={null}
            >
                <Form
                    form={form}
                    onFinish={handleUpdateFaq}
                    layout="vertical"
                    initialValues={{
                        question: selectedFaq?.question,
                        answer: selectedFaq?.answer,
                    }}
                >
                    <Form.Item
                        name="question"
                        label="Question"
                        rules={[{ required: true, message: 'Please enter the question!' }]}
                    >
                        <Input placeholder="Enter the question" />
                    </Form.Item>
                    <Form.Item
                        name="answer"
                        label="Answer"
                        rules={[{ required: true, message: 'Please enter the answer!' }]}
                    >
                        <Input.TextArea placeholder="Enter the answer" rows={4} />
                    </Form.Item>

                    <div className="flex justify-end gap-4">
                        <Button onClick={() => setIsUpdateModalVisible(false)} className="bg-gray-400 text-white">
                            Cancel
                        </Button>
                        <Button type="primary" htmlType="submit" className="bg-[#00adb5] text-white">
                            Update FAQ
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default AllFaq;