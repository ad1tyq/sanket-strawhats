import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card } from "../ui/card";
import Image from "next/image";

interface AshaLoginProps {
  onLogin: (mobile: string) => void;
}

export function AshaLogin({ onLogin }: AshaLoginProps) {
  const [mobile, setMobile] = useState("");
  const [step, setStep] = useState<"mobile" | "otp">("mobile");
  const [otp, setOtp] = useState("");

  const handleGetOTP = () => {
    if (mobile.length === 10) {
      setStep("otp");
    }
  };

  const handleVerifyOTP = () => {
    if (otp.length === 6) {
      onLogin(mobile);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
            <span className="text-3xl font-semibold text-primary-foreground">
              <Image src="/bg/medical-symbol.png" alt="main logo" width={150} height={150} />
            </span>
          </div>
          <div className="flex justify-center">
            <Image src="/bg/logo.png" alt="main logo" width={150} height={150} />
          </div>
          <p className="text-muted-foreground">Community Health Reporter</p>
        </div>

        {/* Login Form */}
        <Card className="p-6 shadow-card border-0 bg-card">
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
                  className="h-12 bg-input-background border-border text-base"
                />
              </div>
              <Button
                onClick={handleGetOTP}
                disabled={mobile.length !== 10}
                className="w-full h-12 text-base font-medium"
              >
                Get OTP
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Enter OTP</Label>
                <p className="text-sm text-muted-foreground">
                  OTP sent to +91 {mobile}
                </p>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="h-12 bg-input-background border-border text-base tracking-widest text-center"
                />
              </div>
              <div className="space-y-3">
                <Button
                  onClick={handleVerifyOTP}
                  disabled={otp.length !== 6}
                  className="w-full h-12 text-base font-medium"
                >
                  Verify & Login
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setStep("mobile")}
                  className="w-full h-10 text-sm"
                >
                  Back
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}