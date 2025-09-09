import React, { useState, useEffect, useTransition } from "react";
import Image from "next/image";

import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyBZaG8YlslypFVsE1Zx6YBV6nwtqH39Z-o",
  authDomain: "otp-auth-82e63.firebaseapp.com",
  projectId: "otp-auth-82e63",
  storageBucket: "otp-auth-82e63.firebasestorage.app",
  messagingSenderId: "907580235322",
  appId: "1:907580235322:web:6cc8a39c0d8760fd621f03",
  measurementId: "G-56YV06YQMV"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}

interface AshaLoginProps {
  onLogin: (mobile: string) => void;
}


const Card = ({ className, children }: { className?: string; children: React.ReactNode }) => (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>{children}</div>
);
const Label = ({ htmlFor, children, className }: { htmlFor: string; children: React.ReactNode; className?: string }) => (
    <label htmlFor={htmlFor} className={`block text-sm font-medium text-gray-700 ${className}`}>{children}</label>
);
const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${props.className}`} />
);
const Button = ({ children, variant, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string }) => {
    const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
    const variantClasses = variant === 'ghost' 
        ? "hover:bg-gray-100 hover:text-gray-900" 
        : "bg-gray-800 text-white hover:bg-black";
    return (
        <button {...props} className={`${baseClasses} ${variantClasses} ${props.className}`}>
            {children}
        </button>
    );
};


export function AshaLogin({ onLogin }: AshaLoginProps) {

  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"mobile" | "otp">("mobile");

  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition(); 

  useEffect(() => {

    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
      });
    }
  }, []);

  const handleGetOTP = async () => {
    setError(null); 
    if (mobile.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    startTransition(async () => {
      try {
        const recaptchaVerifier = window.recaptchaVerifier;
        if (!recaptchaVerifier) {
          setError("reCAPTCHA verifier not initialized. Please refresh the page.");
          return;
        }

        // Firebase requires the phone number in E.164 format (e.g., +919876543210)
        const formattedMobile = `+91${mobile}`;

        const confirmation = await signInWithPhoneNumber(auth, formattedMobile, recaptchaVerifier);
        
        setConfirmationResult(confirmation);
        setStep("otp"); // Move to the OTP screen on success

      } catch (err: any) {
        console.error("Error sending OTP:", err);

        window.recaptchaVerifier?.clear();

        let errorMessage = "An unknown error occurred. Please try again.";
        switch (err.code) {
            case 'auth/too-many-requests':
                errorMessage = "We've blocked requests from this device due to unusual activity. Try again later.";
                break;
            case 'auth/invalid-phone-number':
                errorMessage = "The phone number format is invalid. Please check the number.";
                break;
            case 'auth/network-request-failed':
                 errorMessage = "Network error. Please check your internet connection.";
                 break;
            case 'auth/app-not-authorized':
            case 'auth/operation-not-allowed':
                errorMessage = "This app is not authorized. Please check Firebase configuration.";
                console.error("Firebase Auth Error: Ensure your app's domain (e.g., localhost) is listed in the 'Authorized Domains' in the Firebase Console -> Authentication -> Settings. Also ensure the 'Phone' sign-in provider is enabled.");
                break;
            default:
                errorMessage = "Failed to send OTP. Please check the console for more details.";
                console.error(`Unhandled Firebase Auth Error: ${err.code}`);
                break;
        }
        setError(errorMessage);
      }
    });
  };

  const handleVerifyOTP = async () => {
    setError(null);
    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }
    if (!confirmationResult) {
      setError("Something went wrong. Please request a new OTP.");
      return;
    }

    startTransition(async () => {
        try {
            await confirmationResult.confirm(otp);
            onLogin(mobile);
        } catch (err) {
            console.error("Error verifying OTP:", err);
            setError("The OTP you entered is invalid. Please try again.");
        }
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div id="recaptcha-container" />

      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto">
            <span className="text-3xl font-semibold text-primary-foreground">
              <Image src="/bg/medical-symbol.png" alt="main logo" width={150} height={150} />
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-center">
              <Image src="/bg/logo.png" alt="main logo" width={150} height={150} />
            </div>
            <p className="text-muted-foreground">Smart Community Health Monitoring</p>
          </div>
        </div>

        {/* Login Form */}
        <Card className="p-6 border-0">
          {step === "mobile" ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="Enter your 10-digit mobile number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  className="h-12 bg-gray-100 border-gray-300 text-base"
                />
              </div>
              <Button
                onClick={handleGetOTP}
                disabled={mobile.length !== 10 || isPending}
                className="w-full h-12 text-base font-medium"
              >
                {isPending ? "Sending OTP..." : "Get OTP"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Enter OTP</Label>
                <p className="text-sm text-gray-500">
                  OTP sent to +91 {mobile}
                </p>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="h-12 bg-gray-100 border-gray-300 text-base tracking-widest text-center"
                />
              </div>
              <div className="space-y-3">
                <Button
                  onClick={handleVerifyOTP}
                  disabled={otp.length !== 6 || isPending}
                  className="w-full h-12 text-base font-medium"
                >
                  {isPending ? "Verifying..." : "Verify & Login"}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setStep("mobile");
                    setError(null); // Clear errors when going back
                  }}
                  className="w-full h-10 text-sm text-gray-600"
                  disabled={isPending}
                >
                  Back
                </Button>
              </div>
            </div>
          )}
          {error && (
              <p className="mt-4 text-sm text-center text-red-500">{error}</p>
          )}
        </Card>
      </div>
    </div>
  );
}

