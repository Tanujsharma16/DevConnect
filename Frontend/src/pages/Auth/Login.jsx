import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Mail, Lock } from "lucide-react";

import InputField from "../../components/ui/InputField";
import Button from "../../components/ui/Button";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
        setLoading(true);

        const res = await loginUser(data);

        login(res.data.user);

        navigate("/dashboard");

    } catch (error) {
        alert(
            error.response?.data?.message || "Login Failed"
        );
    } finally {
        setLoading(false);
    }
};
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">

        <div className="text-center mb-8">

          <h1 className="text-4xl font-bold text-blue-600">
            DevConnect
          </h1>

          <p className="text-gray-500 mt-2">
            Welcome Back 👋
          </p>

        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >

          <InputField
            label="Email"
            type="email"
            placeholder="Enter your email"
            register={register("email", {
              required: "Email is required",
            })}
            error={errors.email}
          />

          <InputField
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            register={register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Minimum 6 characters",
              },
            })}
            error={errors.password}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />

          <Button loading={loading}>
            Login
          </Button>

        </form>

        <div className="text-center mt-6">

          <p className="text-gray-600">

            Don't have an account?{" "}

            <Link
              to="/register"
              className="text-blue-600 font-semibold hover:underline"
            >
              Register
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;