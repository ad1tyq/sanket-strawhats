"use client"
// Enhanced page.tsx - Integrated Citizen Portal
import Community from "@/components/posts/community";
import Link from "next/link"
import { useSession } from "next-auth/react"

export default function Page() {
    const { data: session } = useSession();
    if (!session) {
        return (
            <div className="relative mt-20 flex size-full min-h-screen flex-col overflow-x-hidden text-[var(--text-primary)]">
                <div className="flex flex-col items-center">
                    <div className="shadow-lg bg-gray-200 mt-10 rounded-[10px] w-[auto]
            text-[clamp(0.9rem,1.1vw,1.1rem)] h-auto py-10 px-8 gap-5 flex flex-col justify-center">
                        <p><b>Session Logged Out</b></p>
                    </div>
                    <Link href="/"
                        className="rounded cursor-pointer transition-all duration-300 hover:scale-102 hover:bg-gray-400 hover:text-gray-700 px-5 py-[2px] font-semibold text-lg mt-5 text-gray-800 bg-gray-300">home
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen mt-10 bg-gradient-to-br from-slate-50 to-blue-50 pt-20 pb-10">

            {/* Main Content Layout */}
            <div className="max-w-7xl mx-auto px-6">

                {/* Full-width Feedback Section */}
                <div className="mb-8">
                    <Community/>
                </div>
            </div>
        </div>
    )
}