"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Cinzel } from "next/font/google";
import { useState, useEffect } from "react";

const cinzel = Cinzel({ subsets: ["latin"], weight: "700" }); 

export default function LandingPage() {
  const eventDate = new Date("2025-10-24T00:00:00"); // Event start date
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = eventDate.getTime() - now.getTime();

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / (1000 * 60)) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      {/* Mobile Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="sm:hidden absolute inset-0"
      >
        <Image
          src="/eternal-phone.png"
          alt="Eliora Retreat Mobile"
          fill
          priority
          className="object-cover scale-110 sm:scale-100"
        />
      </motion.div>

      {/* Desktop Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="hidden sm:block absolute inset-0"
      >
        <Image
          src="/eternal.png"
          alt="Eliora Retreat Desktop"
          fill
          priority
          className="object-cover"
        />
      </motion.div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-blue-950/60" />

      {/* Content */}

      <div className="relative z-10 flex items-center min-h-screen px-6 sm:px-12">
        <div className="text-left max-w-2xl mt-12 lg:ml-20">
          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`text-xl sm:text-2xl md:text-3xl font-semibold bg-gradient-to-r from-indigo-400 via-white to-cyan-400 text-transparent bg-clip-text drop-shadow-[0_0_20px_rgba(150,200,255,0.8)] mb-4 ${cinzel.className}`}
          >
            Jesus Youth Vadodara
          </motion.p>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className={`text-6xl sm:text-8xl md:text-9xl font-extrabold leading-tight ${cinzel.className}`}
          >
            <span className="bg-gradient-to-r from-cyan-300 via-white to-cyan-300 text-transparent bg-clip-text drop-shadow-[0_0_30px_rgba(0,200,255,0.9)]">
              ELIORA
            </span>
          </motion.h1>

          {/* Countdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-10 sm:mt-12"
          >
            <p className="text-white text-lg sm:text-xl font-semibold mb-4">
              Countdown to Eliora
            </p>
            <div className="flex gap-3 sm:gap-6">
              {/* Days */}
              <div className="bg-white/90 text-blue-900 rounded-lg px-4 py-2 shadow-md">
                <p className="text-xl sm:text-2xl font-bold">{timeLeft.days}</p>
                <span className="text-sm">Days</span>
              </div>
              {/* Hours */}
              <div className="bg-white/90 text-blue-900 rounded-lg px-4 py-2 shadow-md">
                <p className="text-xl sm:text-2xl font-bold">
                  {timeLeft.hours}
                </p>
                <span className="text-sm">Hours</span>
              </div>
              {/* Minutes */}
              <div className="bg-white/90 text-blue-900 rounded-lg px-4 py-2 shadow-md">
                <p className="text-xl sm:text-2xl font-bold">
                  {timeLeft.minutes}
                </p>
                <span className="text-sm">Minutes</span>
              </div>
              {/* Seconds */}
              <div className="bg-white/90 text-blue-900 rounded-lg px-4 py-2 shadow-md">
                <p className="text-xl sm:text-2xl font-bold">
                  {timeLeft.seconds}
                </p>
                <span className="text-sm">Seconds</span>
              </div>
            </div>
          </motion.div>

          {/* Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="mt-10"
          >
            <Link href="/register">
              <button onClick={() => { window.localStorage.removeItem("Details") }} className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-indigo-500 to-cyan-600 text-white text-lg sm:text-xl font-semibold rounded-2xl shadow-lg hover:from-indigo-400 hover:to-cyan-500 hover:shadow-[0_0_25px_rgba(120,200,255,0.9)] transition-all">
                Register Now
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
