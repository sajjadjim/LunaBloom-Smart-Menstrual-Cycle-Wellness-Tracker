"use client";

import React from "react";
import { motion } from "framer-motion";

interface FlowerProps {
  size?: number;
  className?: string;
  animate?: boolean;
}

export function FlowerIllustration({ size = 120, className = "", animate = true }: FlowerProps) {
  const petals = [0, 45, 90, 135, 180, 225, 270, 315];

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={
          animate
            ? {
                rotate: [0, 4, -4, 0],
                scale: [1, 1.03, 0.98, 1],
              }
            : undefined
        }
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <defs>
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF176" />
            <stop offset="50%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#F59E0B" />
          </radialGradient>

          <linearGradient id="petalGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FCE7F3" />
            <stop offset="60%" stopColor="#F472B6" />
            <stop offset="100%" stopColor="#BE185D" />
          </linearGradient>

          <linearGradient id="petalGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFF0F5" />
            <stop offset="70%" stopColor="#F9A8D4" />
            <stop offset="100%" stopColor="#DB2777" />
          </linearGradient>

          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer petal ring */}
        <g filter="url(#softGlow)">
          {petals.map((angle, idx) => (
            <motion.path
              key={idx}
              d="M 100 100 C 70 30, 130 30, 100 100 Z"
              fill={idx % 2 === 0 ? "url(#petalGrad1)" : "url(#petalGrad2)"}
              opacity="0.9"
              transform={`rotate(${angle} 100 100)`}
              whileHover={{ scale: 1.08 }}
            />
          ))}
        </g>

        {/* Inner secondary delicate petals */}
        {petals.map((angle, idx) => (
          <path
            key={`inner-${idx}`}
            d="M 100 100 C 82 55, 118 55, 100 100 Z"
            fill="#FFF7FB"
            opacity="0.45"
            transform={`rotate(${angle + 22.5} 100 100)`}
          />
        ))}

        {/* Center glowing pistil */}
        <circle cx="100" cy="100" r="18" fill="url(#centerGlow)" />
        <circle cx="96" cy="96" r="4" fill="#ffffff" opacity="0.8" />
      </motion.svg>
    </div>
  );
}

export function FloatingPetals() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <motion.div
        className="absolute top-12 left-10 text-pink-300/40 text-2xl"
        animate={{ y: [-10, 15, -10], x: [0, 8, 0], rotate: [0, 20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        🌸
      </motion.div>
      <motion.div
        className="absolute top-1/3 right-12 text-rose-300/40 text-xl"
        animate={{ y: [10, -15, 10], x: [-5, 5, -5], rotate: [10, -15, 10] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        🌷
      </motion.div>
      <motion.div
        className="absolute bottom-20 left-1/4 text-pink-400/30 text-lg"
        animate={{ y: [-8, 12, -8], rotate: [-5, 15, -5] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        ✨
      </motion.div>
      <motion.div
        className="absolute top-2/3 right-1/4 text-pink-300/30 text-3xl"
        animate={{ y: [15, -10, 15], rotate: [0, -25, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      >
        🌸
      </motion.div>
    </div>
  );
}
