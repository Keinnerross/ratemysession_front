import Image from "next/image";
import Link from "next/link";
import {missionData}  from "@/data/about/mission";
import {historyData} from "@/data/about/history";

export function InfoSection({ data }) {
  const {
    title,
    subtitle,
    content,
    imageSrc,
    imageAlt,
    buttonText,
    buttonLink,
    imagePosition = "left",
    showDecoration = true,
    decorationPosition = "top-right",
  } = data;

  const isImageLeft = imagePosition === "left";
  const isDecorationTopRight = decorationPosition === "top-right";

  return (
    <div
      className={`px-6 md:px-0 flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-30 ${
        !isImageLeft ? "lg:flex-row-reverse" : ""
      }`}
    >
      {/* Image Container */}
      <div className="flex-1 w-full">
        <div className="relative w-full h-[400px] lg:h-[600px] z-10 rounded-3xl overflow-hidden">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover object-center"
          />
        </div>
      </div>

      {/* Content Container */}

      <div className="flex-1 relative">
        {subtitle && <p className="text-fern-700 text-lg mb-4">{subtitle}</p>}

        <h2 className="text-4xl lg:text-5xl font-medium text-stone-700 mb-6 lg:mb-8">
          {title}
        </h2>
        <p className="text-base font-base text-stone-600 mb-6 lg:mb-8 leading-relaxed whitespace-pre-line">
          {content}
        </p>
        <Link
          href={buttonLink}
          className="inline-flex items-center gap-3 bg-amethyst-400 text-white px-6 py-3 rounded-full hover:bg-amethyst-500 transition-colors"
        >
          {buttonText}
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>

        {/* Decoration Circle */}
        {showDecoration && (
          <div
            className={`absolute hidden lg:block ${
              isDecorationTopRight ? "-top-20 -right-10" : "-top-20 -left-20"
            } w-[400px] h-[400px] opacity-70`}
          >
            <Image
              src="/assets/about/elipse.png"
              alt="Elipse"
              fill
              className="object-contain object-center"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export function InfoAboutSection() {


    
  return (
    <section className="w-full max-w-[1330px] pt-6 pb-26 md:pb-38 space-y-20 md:space-y-30 ">
      <InfoSection data={historyData} />
      <InfoSection data={missionData} />
    </section>
  );
}
