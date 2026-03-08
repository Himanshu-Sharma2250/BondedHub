import { Mail, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';

const CheckEmailPage = () => {
    const location = useLocation();
    const { user, forgotPassword } = useAuthStore(); // or a dedicated resendVerification action
    const [resending, setResending] = useState(false);

    // Email can be passed from registration via state, or from the logged-in user
    const email = location.state?.email || user?.email || 'your email';

    const handleResend = async () => {
        setResending(true);
        try {
            // Assuming you have a resend verification endpoint
            await forgotPassword({ email }); // adjust to your actual API
            toast.success('Verification email resent!');
        } catch (error) {
            toast.error('Failed to resend email. Please try again.');
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4">
            <div className="max-w-md w-full bg-white border-2 border-[#CBD5E1] rounded-md shadow-sm p-8">
                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-[#2A6E8C]/10 rounded-full flex items-center justify-center">
                        <Mail className="w-8 h-8 text-[#2A6E8C]" />
                    </div>
                </div>

                {/* Heading */}
                <h1 className="text-2xl font-bold text-center text-[#0F172A] mb-2">
                    Verify your email
                </h1>

                {/* Message */}
                <p className="text-center text-[#334155] mb-6">
                    We've sent a verification link to{' '}
                    <span className="font-semibold text-[#2A6E8C]">{email}</span>.
                    Please check your inbox and click the link to activate your account.
                </p>

                {/* Tip about spam */}
                <div className="bg-[#F1F5F9] border border-[#CBD5E1] rounded-md p-3 mb-6 text-sm text-[#475569]">
                    <p className="flex items-start gap-2">
                        <span className="text-[#FF7A59] font-bold">!</span>
                        <span>
                            Didn't receive the email? Check your spam folder or click the button below to resend.
                        </span>
                    </p>
                </div>

                {/* Link to login */}
                <div className="text-center">
                    <NavLink
                        to="/signin"
                        className="inline-flex items-center gap-1 text-sm text-[#64748B] hover:text-[#2A6E8C] transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to login
                    </NavLink>
                </div>
            </div>
        </div>
    );
};

export default CheckEmailPage;