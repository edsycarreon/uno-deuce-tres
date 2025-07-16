import { motion } from "framer-motion";

const loadingContainerStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(255,255,255,0.95)", // subtle overlay
  zIndex: 9999,
};

export default function Loading() {
  return (
    <div style={loadingContainerStyle}>
      <motion.span
        style={{ fontSize: 80 }}
        animate={{
          y: [0, -30, 0],
          rotate: [0, 360],
        }}
        transition={{
          y: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 0.8,
            ease: "easeInOut",
          },
          rotate: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 2,
            ease: "linear",
          },
        }}
        role="img"
        aria-label="poop"
      >
        💩
      </motion.span>
    </div>
  );
}
