import AboutPoints from "../../data/aboutpointdata";
import Image from "next/image";
interface type {
    info: string,
    imageUrl: string,
    ind: number,
};
function About({ imageUrl, info, ind }: type) {
    return (
        <div>
        { ind === 1 ? (
            <div className="flex gap-10">
                <div className="flex flex-col w-[40rem] gap-5">
                    <h1 className="font-bold text-2xl">CoastGuard+ Experience</h1>
                    <p className="font-light w-[40vw]">{info}</p>
                    {AboutPoints.map((point, index) => {
                        return (
                            <div key={index} className="flex gap-5">
                                <Image src={point.image} alt="point img" height={26} width={26} />
                                <div>
                                    <p className="font-bold">{point.title}</p>
                                    <p className="font-light">{point.text}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <Image src={imageUrl} width={699} height={699} style={{ objectFit: 'cover' }}
                    alt="about us" className="w-150 h-120 rounded-lg shadow-lg object-cover" />
            </div>
        ) : (
            <div className="flex gap-10">
                <Image src={imageUrl} width={699} height={699} style={{ objectFit: 'cover' }}
                    alt="about us" className="w-150 h-120 rounded-lg shadow-lg object-cover" />
                <div className="flex flex-col w-[40rem] gap-5">
                    <h1 className="font-bold text-2xl">Application Features</h1>
                    <p className="font-light w-[40vw]">{info}</p>
                    {AboutPoints.map((point, index) => {
                        return (
                            <div key={index} className="flex gap-5">
                                <Image src={point.image} alt="point img" height={26} width={26} />
                                <div>
                                    <p className="font-bold">{point.title}</p>
                                    <p className="font-light">{point.text}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
                
            </div>
        )}
        </div>
    )
}
export default About;