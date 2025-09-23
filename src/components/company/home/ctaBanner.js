import { ButtonCustom } from "@/components/global/buttons/buttons";
import Image from "next/image";

export function CtaBanner() {
    return (
        <section className="pt-6 pb-10">
            <div className="container mx-auto max-w-[1280px]">
                <div className="relative overflow-hidden rounded-3xl w-full h-[440px] flex justify-center items-center ">
                    {/* bgImage  */}
                    <div className="absolute  w-full h-full">
                        <Image src={"/assets/home/bg-gradient-cta.png"} alt="Gradient" fill className=" bg-amethyst-300 object-cover object-center " />
                        <div className="bg-amethyst-300"></div>
                    </div>
                    {/* Content */}
                    <div className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center gap-6 ">
                        <h2 className="text-4xl  font-medium text-white  leading-tight">
                            Real Insights for Your Mental Health
                        </h2>
                        <p className="text-lg font-extralight text-white max-w-2xl mx-auto leading-relaxed md:w-3/4">
                            Make well-being choices with certainty. Explore genuine experiences
                            from others to gain insights and confidently decide on your best
                            path forward.
                        </p>
                        <ButtonCustom variant={3}>View Recents Reviews</ButtonCustom>
                    </div>
                </div>
            </div>
        </section>
    );
}