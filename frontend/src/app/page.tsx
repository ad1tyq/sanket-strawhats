import Intro from "@/components/intro";
import FAQ from "@/components/FAQ";
import About from "@/components/About";
import Image from "next/image";
import { AboutLine } from "../../data/aboutdata";
export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="absolute bg-black/40 w-full h-[41.5rem] z-0 top-0"></div>
      <Image src="/bg/bg.jpg"
      alt="background" fill style={{ objectFit: 'cover' }}
      className="absolute  top-0 -z-10" />
      <Intro />
      <div id="about" className="bg-white mt-50">
        <div className="flex flex-col text-black items-center gap-15 py-15 pb-15">
            <h1 className="text-center text-xl font-bold md:text-4xl py-3 w-[15rem] border-blue-400 border-b-3 ">
                About Us</h1>
                {AboutLine.map((line)=>(
                    <About key={line.id} imageUrl={line.image} info={line.info} ind={line.ind} />
                ))}
        </div>
      </div>
      <FAQ />
    </div>
  );
}
