"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ParallaxImage } from "@/components/animations/parallax";

export function AboutImages({
  image,
  secondaryImage,
}: {
  image: string;
  secondaryImage: string;
}) {
  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative aspect-4/5 w-full overflow-hidden rounded-3xl"
      >
        <ParallaxImage className="h-full w-full" strength={30}>
          <Image
            src={image}
            alt="Inside Apex Athletic"
            fill
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="object-cover"
          />
        </ParallaxImage>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute -bottom-10 -right-6 hidden aspect-[4/3] w-2/3 overflow-hidden rounded-2xl border-4 border-background shadow-2xl sm:block lg:-right-10"
      >
        <Image
          src={secondaryImage}
          alt="Training at Apex Athletic"
          fill
          sizes="30vw"
          className="object-cover"
        />
      </motion.div>
    </div>
  );
}
