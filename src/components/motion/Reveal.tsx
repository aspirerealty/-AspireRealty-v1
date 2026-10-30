"use client";

import { motion, type HTMLMotionProps } from "motion/react";

type RevealProps = HTMLMotionProps<"div"> & {
  delay?: number;
  y?: number;
};

// Fades and lifts content into view the first time it scrolls on screen.
export function Reveal({ delay = 0, y = 32, children, ...rest }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

// Parent that staggers its <StaggerItem> children as they enter the viewport.
export function Stagger({ children, gap = 0.12, ...rest }: HTMLMotionProps<"div"> & { gap?: number }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={{ show: { transition: { staggerChildren: gap } } }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, ...rest }: HTMLMotionProps<"div">) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 28 },
        show: { opacity: 1, y: 0, transition: { duration: 0.7 } },
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

// Image wrapper that unveils with a navy panel wiping upward while the image
// settles from a slight zoom. Uses transforms only, so it stays smooth.
export function ImageReveal({ children, className, delay = 0, ...rest }: HTMLMotionProps<"div"> & { delay?: number }) {
  return (
    <motion.div className={className} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} {...rest}>
      <motion.div
        className="absolute inset-0"
        variants={{ hidden: { scale: 1.15 }, show: { scale: 1, transition: { duration: 1.4, delay } } }}
      >
        {children}
      </motion.div>
      <motion.div
        aria-hidden
        className="absolute inset-0 origin-top bg-navy-900"
        variants={{ hidden: { scaleY: 1 }, show: { scaleY: 0, transition: { duration: 1, delay } } }}
      />
    </motion.div>
  );
}
