"use client"
import { useRouter } from 'next/navigation';

function Intro() {
    const router = useRouter();
    return (
        <div className="flex flex-col item-center pt-60">
            <h1 className="text-5xl md:text-7xl font-bold text-white text-center z-20">Plantventory</h1>
            <p className="text-center text-xl md:text-2xl text-white py-5 z-20">
                Unlock your green thumb with smart plant tracking and<br />personalized care schedules, right at your fingertips.
            </p>
            <div className="flex gap-5 justify-center z-20">
                <button onClick={()=>router.push('/plants')}
                className="bg-amber-300 hover:bg-amber-300/60 text-white transition-all font-semibold duration-200 p-[0.7rem] px-[1rem] rounded-md cursor-pointer">
                    Go To Dashboard</button>
                <button onClick={()=>router.push('/#about')}
                className="bg-white border text-black hover:text-white transition-all duration-200 border-white hover:bg-white/20 p-[0.7rem] px-[1.5rem] rounded-md cursor-pointer">
                    Learn More</button>
            </div>
        </div>
    )
}
export default Intro;