//import { Facebook, Instagram, Mail, Twitter } from "../../Images";
import Link from "next/link";
const Footer = () => {
  return (
    <footer className="bg-emerald-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-center gap-90 mb-12">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="font-bold text-2xl">Plantventory</span>
            </div>
            <p className="text-gray-400 w-[20vw] text-sm">
              Your digital companion for a thriving garden. Catalog, track, and nurture your plants with AI-powered care.
            </p>
          </div>
          
          <div className="-ml-20">
            <h3 className="font-medium text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-purple hover:text-white/80 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-purple hover:text-white/80 transition-colors">How It Works</a></li>
              <li><a href="#" className="hover:text-purple hover:text-white/80 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-purple hover:text-white/80 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
          
          <div className="flex flex-col items-center">
            <h3 className="font-medium text-lg mb-4">Connect With Us</h3>
            <div className="flex space-x-4 mb-6">
              <Link href="#" className="bg-white hover:bg-white/80 p-2 rounded-full hover:bg-purple transition-colors">
                {/*<Instagram/>*/}
              </Link>
              <Link href="#" className="bg-white hover:bg-white/80 p-2 rounded-full hover:bg-purple transition-colors">
                {/*<Facebook/>*/}
              </Link>
              <Link href="#" className="bg-white hover:bg-white/80 p-2 rounded-full hover:bg-purple transition-colors">
                {/*<Twitter/>*/}
              </Link>
              <Link href="#" className="bg-white hover:bg-white/80 p-2 rounded-full hover:bg-purple transition-colors">
                {/*<Mail/>*/}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;