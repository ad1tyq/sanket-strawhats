"use client";
import { useSession, signOut } from "next-auth/react";

export default function SignOut() {
    const { data: session } = useSession();

    return (
        // Use inline-flex to make the wrapper only as wide as the button
        <div className="relative group inline-flex">
            <button
                className="bg-white border border-gray-400 text-black transition-all duration-200 hover:bg-gray-100
                 p-[0.2rem] px-[1rem] rounded-md cursor-pointer"
                onClick={() => signOut()}
            >
                Sign out
            </button>

            <span
                className="
                    absolute
                    top-full           /* Position the tooltip BELOW the button */
                    right-0            /* Align to the RIGHT edge of the parent */
                    mt-2               /* Add a small margin on top */
                    px-3 py-1
                    text-sm
                    text-white
                    bg-gray-800
                    rounded-md
                    whitespace-nowrap

                    /* --- Visibility & Animation --- */
                    invisible
                    opacity-0
                    transform
                    scale-95

                    group-hover:visible
                    group-hover:opacity-100
                    group-hover:scale-100

                    transition-all
                    duration-200
                "
            >
                Signed in as {session?.user?.email}
                {/* --- Arrow pointing up --- */}
                <span className="absolute bottom-full right-4 -translate-x-1/2 border-4 border-transparent border-b-gray-800"></span>
            </span>
        </div>
    );
}

