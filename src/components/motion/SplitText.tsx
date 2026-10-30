"use client";

import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import { motion } from "motion/react";

// Reveals text word by word, each word rising out of its own mask. Works on
// plain strings and on nested elements such as <em>, keeping their styling.
export default function SplitText({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: delay } } }}
    >
      {split(children)}
    </motion.span>
  );
}

function split(node: ReactNode, keyPrefix = "w"): ReactNode {
  return Children.toArray(node).flatMap((child, i) => {
    const key = `${keyPrefix}-${i}`;
    if (typeof child === "string" || typeof child === "number") {
      return String(child)
        .split(/(\s+)/)
        .map((part, j) => (part.trim() === "" ? part : <Word key={`${key}-${j}`}>{part}</Word>));
    }
    if (isValidElement<{ children?: ReactNode }>(child)) {
      return cloneElement(child as ReactElement<{ children?: ReactNode }>, { key }, split(child.props.children, key));
    }
    return child;
  });
}

function Word({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
      <motion.span
        className="inline-block"
        variants={{
          hidden: { y: "110%", rotate: 4 },
          show: { y: "0%", rotate: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
        }}
      >
        {children}
      </motion.span>
    </span>
  );
}
