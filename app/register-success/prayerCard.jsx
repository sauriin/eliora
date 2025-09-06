"use client";

import Image from "next/image";
import React, { forwardRef } from "react";

const PrayerCard = forwardRef(
  ({ fullName, blessing, verse }, ref) => {
    return (
      <div
        ref={ref}
        className="relative w-[300px] h-[450px] aspect-[2/3] 
                   rounded-2xl border-2 border-yellow-500 shadow-[0_0_25px_rgba(255,215,0,0.5)]
                   flex flex-col justify-start items-center px-4 py-4
                   bg-gradient-to-b from-[#3a0ca3] via-[#240046] to-[#5a189a]
                   overflow-hidden"
      >
        {/* Left Logo with Glow */}
        <div className="absolute top-4 left-4 p-1 rounded-full bg-white/50 shadow-md">
          <Image src="/Images/JYLogo.png" alt="JY Logo" width={28} height={28} />
        </div>

        {/* Right Logo */}
        <div className="absolute top-4 right-4">
          <Image src="/Images/Jaago2025Logo.png" alt="Jaago 2025 Logo" width={25} height={25} />
        </div>

        {/* Content wrapper with scroll if needed */}
        <div className="flex flex-col justify-start items-start flex-1 w-full mt-12 overflow-auto">
          {/* Heading */}
          <h2 className="text-[22px] font-serif font-semibold text-yellow-300 mt-7 mb-2.5 drop-shadow-lg">
            Blessing Card
          </h2>

          {/* Blessing */}
          <p className="text-[14px] leading-[1.4] text-yellow-100 drop-shadow-md  break-words">
            Dear {fullName}, {blessing}
          </p>

          {/* Verse */}
          {verse && (
            <p className="mt-8 text-[12px] leading-[1.3] text-yellow-200  italic drop-shadow-md break-words">
              {verse}
            </p>
          )}
        </div>
      </div>
    );
  }
);

PrayerCard.displayName = "PrayerCard";
export default PrayerCard;
