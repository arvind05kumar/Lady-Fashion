"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Lock scroll while splash is visible
    document.body.style.overflow = "hidden";

    const timer = setTimeout(() => {
      setIsVisible(false);
      document.body.style.overflow = "";
    }, 2800);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#fdfaf7]"
        >
          {/* Subtle radial glow behind logo */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[400px] h-[400px] rounded-full bg-[#c9a85c]/10 blur-3xl" />
          </div>

          {/* Logo with zoom-in entry + zoom-out exit */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 9, opacity: 0 }}
            transition={{
              duration: 1.4,
              ease: [0.65, 0, 0.35, 1],
              delay: 0.1,
            }}
            className="relative flex flex-col items-center"
          >
            <Image
              src="/logo1.png"
              alt="The Lady Fashion"
              width={280}
              height={280}
              priority
              className="object-contain drop-shadow-xl"
            />

            {/* Tagline below logo — fades in after logo */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mt-4 font-serif text-base tracking-[0.25em] text-[#8B6914] uppercase"
            >
              Elegance in Every Thread
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
