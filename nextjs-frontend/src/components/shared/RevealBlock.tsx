"use client";

import { motion, Variants } from "motion/react";
import { ReactNode } from "react";

interface RevealBlockProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
}

export const RevealBlock = ({
  children,
  delay = 0,
  direction = "up",
}: RevealBlockProps) => {
  const variants: Variants = {
    hidden: {
      opacity: 0,
      y: direction === "up" ? 80 : direction === "down" ? -80 : 0,
      x: direction === "left" ? 80 : direction === "right" ? -80 : 0,
      scale: 0.9,
      rotateX: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1], // Cinematic easing
        delay,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" }}
      variants={variants}
      className="will-change-transform origin-bottom"
    >
      {children}
    </motion.div>
  );
};
