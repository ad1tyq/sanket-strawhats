import { AboutLine } from "../../../data/aboutdata"
import About from "@/components/About"
export default function Page(){
    return(
        <div className="mt-20 flex flex-col text-black items-center gap-15 py-15 pb-15">
            <h1 className="text-center text-xl font-bold md:text-4xl py-3 w-[15rem] border-blue-400 border-b-3 ">
                About Us</h1>
                {AboutLine.map((line)=>(
                    <About key={line.id} imageUrl={line.image} info={line.info} ind={line.ind} />
                ))}
        </div>
    )
}


