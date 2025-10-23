import { Button, Form, Input, message, Upload } from "antd";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { LuImagePlus } from "react-icons/lu";
import defaultUserImage from "/public/Auth/user.png";
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";
import { useGetUserProfileQuery, useUpdateProfileMutation } from "../../redux/features/setting/settingApi";
import Url from "../../redux/baseApi/forImageUrl";

const PersonalinfoEdit = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { data: userProfile, isLoading, refetch } = useGetUserProfileQuery();
  const user = userProfile?.data?.attributes?.user;

  const [fileList, setFileList] = useState([]);
  const [imageUrl, setImageUrl] = useState(defaultUserImage);
  const [callingCode, setCallingCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [updateProfile] = useUpdateProfileMutation();

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.fullName || "",
        email: user.email || "",
      });
      // Extract calling code and number
      if (user.callingCode && user.phoneNumber) {
        setCallingCode(user.callingCode);
        setPhoneNumber(user.phoneNumber);
      }
      setImageUrl(user.profileImage ? Url + user.profileImage : defaultUserImage);
    }
  }, [user, form]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  // ✅ Handle File Upload
  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (newFileList[0]?.originFileObj) {
      const reader = new FileReader();
      reader.readAsDataURL(newFileList[0].originFileObj);
      reader.onload = () => setImageUrl(reader.result);
    }
  };

  // ✅ Handle Submit
  const handleUpdateProfile = async (values) => {
    const formData = new FormData();
    formData.append("fullName", values.name);
    formData.append("callingCode", callingCode);
    formData.append("phoneNumber", phoneNumber);

    // console.log(callingCode, phoneNumber);
    // return;

    if (fileList[0]?.originFileObj) {
      formData.append("profileImage", fileList[0].originFileObj);
    }

    try {
      const response = await updateProfile(formData).unwrap();
      if (response?.code) {
        message.success(response?.message);
        navigate("/settings/personal-info");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error("Failed to update profile.");
    }
  };

  return (
    <div className="font-[Aldrich]">
      <div onClick={() => navigate("/settings/personal-info")} className="flex items-center cursor-pointer ml-6 my-8">
        <MdOutlineKeyboardArrowLeft size={30} />
        <h1 className="text-xl font-medium ml-2">Edit Profile</h1>
      </div>

      <div className="sm:mx-6 rounded-xl bg-white">
        <Form form={form} layout="vertical" autoComplete="off" onFinish={handleUpdateProfile}>
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Profile Image */}
            <div className="flex flex-col items-center w-full lg:w-1/3 border-dotted border">
              <div className="relative sm:w-56 w-48 sm:h-56 h-48 rounded-full flex justify-center items-center mt-5 bg-gray-50 border">
                <Upload name="profile" showUploadList={false} onChange={handleUploadChange}>
                  <img className="w-44 h-44 rounded-full" src={imageUrl} alt="Profile" />
                  <Button
                    className="border-none text-md text-blue-500 absolute bottom-6 flex items-center"
                    icon={<LuImagePlus size={20} className="mr-2" />}
                  >
                    Change Picture
                  </Button>
                </Upload>
              </div>

              <div className="text-center mt-6">
                <p className="text-lg">{user?.role}</p>
                <h1 className="text-2xl font-medium">{user?.fullName || "N/A"}</h1>
              </div>
            </div>

            {/* Form Fields */}
            <div className="flex-1 w-full lg:w-2/3">
              <div className="flex flex-col gap-6">
                <Form.Item label={<span className="text-lg font-medium">Name</span>} name="name">
                  <Input placeholder="Name" className="p-4 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500" />
                </Form.Item>

                <Form.Item label={<span className="text-lg font-medium">Email</span>} name="email">
                  <Input placeholder="Email" className="p-4 rounded-lg border-gray-300" readOnly />
                </Form.Item>

                <div className="flex flex-col">
                  <label className="text-lg font-medium mb-2">Phone Number</label>
                  <PhoneInput
                    country={"bd"}
                    value={callingCode + phoneNumber}
                    onChange={(value, countryData, event, formattedValue) => {
                      const dialCode = "+" + countryData.dialCode;
                      const localNumber = value.replace(countryData.dialCode, "");
                      setCallingCode(dialCode);
                      setPhoneNumber(localNumber);
                    }}
                    inputClass="!w-full !py-3 !px-2 !border-2 !border-gray-300 !rounded-lg"
                    buttonClass="!border-2 !border-gray-300"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex sm:justify-end justify-center items-center mt-8">
            <Button htmlType="submit" className="h-14 md:px-20 !bg-[#00adb5] !text-white rounded-lg text-lg font-medium">
              Save Changes
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default PersonalinfoEdit;