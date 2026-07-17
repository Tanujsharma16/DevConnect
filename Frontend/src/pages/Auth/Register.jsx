import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

import AuthLayout from "../../layouts/AuthLayout";
import InputField from "../../components/ui/InputField";
import Button from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";
function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");
const onSubmit = async (data) => {
  try {
    setLoading(true);

    const { confirmPassword, ...userData } = data;

    const res = await registerUser(userData);

    alert(res.data.message);

    navigate("/");

  } catch (error) {
    alert(error.response?.data?.message || "Registration Failed");
  } finally {
    setLoading(false);
  }
};
  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join the DevConnect community 🚀"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        <InputField
          label="First Name"
          type="text"
          placeholder="Enter first name"
          register={register("firstName", {
            required: "First name is required",
          })}
          error={errors.firstName}
        />

        <InputField
          label="Last Name"
          type="text"
          placeholder="Enter last name"
          register={register("lastName", {
            required: "Last name is required",
          })}
          error={errors.lastName}
        />

        <InputField
          label="Email"
          type="email"
          placeholder="Enter email"
          register={register("email", {
            required: "Email is required",
          })}
          error={errors.email}
        />

        <InputField
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter password"
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

        <InputField
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Confirm password"
          register={register("confirmPassword", {
            required: "Confirm password is required",
            validate: (value) =>
              value === password || "Passwords do not match",
          })}
          error={errors.confirmPassword}
          showPassword={showConfirmPassword}
          setShowPassword={setShowConfirmPassword}
        />

        <Button loading={loading}>
          Register
        </Button>
      </form>

      <div className="text-center mt-6">
        <p className="text-gray-600">
          Already have an account?{" "}
          <Link
            to="/"
            className="text-blue-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

export default Register;