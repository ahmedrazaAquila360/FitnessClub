"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { getIcon } from "@/lib/icon-map";
import { cn } from "@/lib/utils";

export type WhyItem = {
  id: string;
  title: string;
  description: string;
  icon: string;
  image: string | null;
};

export function WhyChooseUsList({ items }: { items: WhyItem[] }) {
  const [active, setActive] = useState(0);
  const activeItem = items[active];

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
      <div className="relative hidden aspect-square overflow-hidden rounded-3xl lg:block">
        <AnimatePresence mode="wait">
          {activeItem.image && (
            <motion.div
              key={activeItem.id}
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <Image src={activeItem.image} alt={activeItem.title} fill sizes="500px" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="divide-y divide-white/10 border-t border-white/10 lg:border-none">
        {items.map((item, i) => {
          const Icon = getIcon(item.icon);
          const isActive = i === active;
          return (
            <button
              key={item.id}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className={cn(
                "flex w-full items-start gap-5 py-6 text-left transition-colors",
                isActive ? "text-foreground" : "text-foreground/50"
              )}
            >
              <span
                className={cn(
                  "heading-font shrink-0 text-2xl transition-colors",
                  isActive ? "text-brand" : "text-foreground/25"
                )}
              >
                0{i + 1}
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <Icon className={cn("h-5 w-5 shrink-0", isActive ? "text-brand" : "text-foreground/30")} />
                  <h3 className="heading-font text-xl tracking-wide sm:text-2xl">{item.title}</h3>
                </div>
                <AnimatePresence>
                  {isActive && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-2 max-w-md overflow-hidden text-sm leading-relaxed text-foreground/60"
                    >
                      {item.description}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
