"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { type ProjectCategory, categoryLabels, projects } from "@/data/projects";
import ProjectCard from "./ProjectCard";

type Tab = ProjectCategory | "all";
const tabs: Tab[] = ["all", "apartment", "villa"];
const tabLabel = (t: Tab) => (t === "all" ? "All" : categoryLabels[t]);

// Project grid split into Apartments and Villas.
export default function ProjectTabs() {
  const [active, setActive] = useState<Tab>("all");
  const visible = active === "all" ? projects : projects.filter((p) => p.category === active);

  return (
    <div>
      <div role="tablist" className="flex flex-wrap gap-2 border-b border-navy-900/10">
        {tabs.map((tab) => {
          const count = tab === "all" ? projects.length : projects.filter((p) => p.category === tab).length;
          const selected = tab === active;
          return (
            <button
              key={tab}
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(tab)}
              className={`relative px-5 py-4 text-sm font-semibold tracking-wide transition-colors ${selected ? "text-navy-900" : "text-muted hover:text-navy-900"}`}
            >
              {tabLabel(tab)} <span className="ml-1 text-gold-600">{String(count).padStart(2, "0")}</span>
              {selected && <motion.span layoutId="tab-underline" className="absolute inset-x-0 -bottom-px h-0.5 bg-gold-500" />}
            </button>
          );
        })}
      </div>

      <motion.div layout className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((project, i) => (
            <motion.div
              key={project.slug}
              layout
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.08 } }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.25 } }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
