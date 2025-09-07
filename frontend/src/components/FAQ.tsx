"use client"
import { useState } from "react"
import faqData from "../../data/FAQdata";
function FAQ() {
    const [isOpen, setOpen] = useState<number | null>(null);

    return (
        <div className="flex flex-col items-center gap-5 border-t text-black border-black/5 bg-gray-50 pt-10 pb-30">
        <h1 className="text-center text-xl font-bold md:text-4xl mb-10 py-3 w-[40rem] border-amber-700 border-b-3 ">Frequently Asked Questions</h1>
        <div className="flex flex-col items-center text-xl gap-2">
            {faqData.map((faq) => {
                return (
                    <div key={faq.id} onMouseEnter={() => setOpen(faq.id)} onMouseLeave={()=>setOpen(null)}
                        className={`flex flex-col items-center hover:bg-black/30 bg-gray-300 w-[60rem] gap-2 py-5 rounded-[3rem]
                        `}>
                        <div className="cursor-pointer w-full font-bold text-center h-[3rem] flex items-center justify-center tracking-tight">{faq.question}</div>
                        <div
                            className={`overflow-hidden transition-all duration-700 ease-in-out ${isOpen === faq.id
                                    ? "max-h-60 translate-y-0 opacity-100"
                                    : "max-h-0 translate-y-0 opacity-0"
                                }`}
                            style={{
                                transitionProperty: "max-height, opacity, transform",
                            }}
                        >
                            <div className="px-1 pb-2">
                            <div className="border-t border-white/30 pt-4">
                            <p className="text-black/80 w-[50rem] transform text-center text-[clamp(0.65rem,1.3vw,1.3rem)] leading-relaxed transition-transform duration-300">
                            {faq.answer}
                            </p>
                            </div>
                            </div>
                            </div>
                        </div>
                        )
            })}
                    </div>
                    </div>
                )
            }
export default FAQ;

