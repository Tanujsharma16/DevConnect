import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyEmailOTP } from "../../services/authService";

function VerifyEmail() {
    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email || "";

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleVerify = async (e) => {
        e.preventDefault();

        if (!email) {
            setError(
                "Email not found. Please register again."
            );
            return;
        }

        try {
            setLoading(true);
            setError("");

            await verifyEmailOTP({
                email,
                otp,
            });

            alert(
                "Email verified successfully! Please login."
            );

            navigate("/login");

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to verify email"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

            <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8">

                <h1 className="text-3xl font-bold text-center">
                    Verify Email
                </h1>

                <p className="text-gray-500 text-center mt-3">
                    Enter the 6-digit OTP sent to
                </p>

                <p className="text-blue-600 font-semibold text-center mt-1">
                    {email || "your email"}
                </p>


                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mt-5 text-sm">
                        {error}
                    </div>
                )}


                <form
                    onSubmit={handleVerify}
                    className="mt-6 space-y-5"
                >

                    <input
                        type="text"
                        value={otp}
                        onChange={(e) =>
                            setOtp(
                                e.target.value
                                    .replace(/\D/g, "")
                                    .slice(0, 6)
                            )
                        }
                        placeholder="Enter 6-digit OTP"
                        maxLength={6}
                        required
                        className="w-full border rounded-lg px-4 py-3 text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />


                    <button
                        type="submit"
                        disabled={
                            loading ||
                            otp.length !== 6
                        }
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
                    >
                        {loading
                            ? "Verifying..."
                            : "Verify Email"}
                    </button>

                </form>

            </div>

        </div>
    );
}

export default VerifyEmail;