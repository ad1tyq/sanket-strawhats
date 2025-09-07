"use client"
import Link from 'next/link';
import { usePathname } from "next/navigation";
import { ReactNode } from 'react';

interface CustomLinkProps {
  href: string;
  children: ReactNode;
}

export default function CustomLink({href, children}: CustomLinkProps){
    const pathname = usePathname();
    const isActive = pathname === href;
    return (
    <Link 
      href={href}
      className={`${isActive ? 'bg-white/60 backdrop-blur-md rounded-2xl text-blue-500' 
        :
        'hover:text-blue-500'}
      text-lg p-2 px-4 transition-colors font-mono-pixel`}>
      {children}
    </Link>
  );
}