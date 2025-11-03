import signinImage from "/public/Auth/login.png";
import { Link, useNavigate } from "react-router-dom";
import { Form, Checkbox } from "antd";
import { HiOutlineLockClosed, HiOutlineMail } from "react-icons/hi";
import CustomInput from "../../../utils/CustomInput";
import { useLoginMutation } from "../../../redux/features/auth/authApi";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { loggedUser } from "../../../redux/features/auth/authSlice";

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (values) => {
    const { email, password } = values;
    const data = {
      email, password
    }
    try {
      const res = await login(data).unwrap();
      if (res.error) {
        toast.error(res.error.data.message);
      }
      if (res?.code === 200) {
        localStorage.setItem("token", res?.data?.attributes?.tokens?.access?.token);
        localStorage.setItem("user", JSON.stringify(res?.data?.attributes?.user));
        dispatch(loggedUser(res?.data?.attributes?.user));
        toast.success(res?.message);
        navigate("/");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="w-full  h-full md:h-screen md:flex justify-around overflow-visible">
      <div className="w-full max-w-7xl mx-auto border-shadow rounded-md h-[70%] md:my-28 grid grid-cols-1 md:grid-cols-2 place-content-center  gap-8 bg-white md:mx-10">

        <div className="mt-16 px-10 py-10">
          <div className="mb-8">
            <img src='/Auth/logo.png' className="w-[80px] mb-5" alt="" />
            <h1 className="font-semibold text-3xl text-[#00adb5]">
              Hello, Welcome!
            </h1>
            <p className="text-gray-500">
              Please Enter Your Details Below to Continue
            </p>
          </div>
          <Form
            layout="vertical"
            onFinish={handleSubmit}
            className="space-y-4"
            initialValues={{
              remember: true,
            }}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your email!",
                },
                {
                  type: "email",
                  message: "The input is not a valid email!",
                },
              ]}
            >
              <CustomInput
                type="email"
                icon={HiOutlineMail}
                placeholder={"Enter Email"}
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <CustomInput
                type="password"
                icon={HiOutlineLockClosed}
                placeholder={"Enter password"}
                isPassword
              />
            </Form.Item>

            <div className="flex justify-between items-center">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <Link to="/auth/forget-password" className="underline text-red-500 font-semibold">
                Forgot password?
              </Link>
            </div>

            <Form.Item>
              <button type="submit" loading={isLoading} className="w-full bg-[#00adb5] text-xl font-semibold text-white  rounded-md py-2" border={true}>
                Login {isLoading ? '...' : ''}
              </button>
            </Form.Item>
          </Form>
        </div>
        <div className="hidden md:flex justify-center overflow-hidden">
          <img
            src={signinImage}
            className="w-full h-full mx-auto"
            alt="Sign in illustration"
          />
        </div>
      </div>
    </div>
  );
};

export default SignIn;
