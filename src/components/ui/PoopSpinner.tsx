"use client";

import { motion } from "framer-motion";

export default function PoopSpinner({ size = 36 }: { size?: number }) {
  return (
    <motion.span
      style={{ fontSize: size, display: "inline-block" }}
      animate={{ y: [0, -12, 0], rotate: [0, 0, 0] }}
      transition={{
        duration: 1.8,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
      }}
      role="img"
      aria-label="poop spinner"
    >
      💩
    </motion.span>
  );
}
