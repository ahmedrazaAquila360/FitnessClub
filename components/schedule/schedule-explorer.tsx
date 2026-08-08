"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, MapPin, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { DAYS_OF_WEEK, DAY_LABELS, DIFFICULTY_LABELS } from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type ScheduleClass = {
  id: string;
  className: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  room: string;
  difficulty: string;
  capacity: number;
  booked: number;
  trainer: { name: string; slug: string; image: string };
  program: { name: string; slug: string } | null;
};

function timeBucket(time: string) {
  const hour = parseInt(time.split(":")[0] ?? "0", 10);
  if (hour < 12) return "MORNING";
  if (hour < 17) return "AFTERNOON";
  return "EVENING";
}

export function ScheduleExplorer({
  classes,
  trainers,
  programs,
}: {
  classes: ScheduleClass[];
  trainers: { slug: string; name: string }[];
  programs: { slug: string; name: string }[];
}) {
  const [day, setDay] = useState<string>("ALL");
  const [trainer, setTrainer] = useState<string>("ALL");
  const [program, setProgram] = useState<string>("ALL");
  const [difficulty, setDifficulty] = useState<string>("ALL");
  const [time, setTime] = useState<string>("ALL");

  const filtered = useMemo(() => {
    return classes.filter((c) => {
      if (day !== "ALL" && c.dayOfWeek !== day) return false;
      if (trainer !== "ALL" && c.trainer.slug !== trainer) return false;
      if (program !== "ALL" && c.program?.slug !== program) return false;
      if (difficulty !== "ALL" && c.difficulty !== difficulty) return false;
      if (time !== "ALL" && timeBucket(c.startTime) !== time) return false;
      return true;
    });
  }, [classes, day, trainer, program, difficulty, time]);

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => setDay("ALL")}
          className={cn(
            "rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors",
            day === "ALL" ? "border-brand bg-brand text-black" : "border-white/15 text-foreground/60 hover:border-white/40"
          )}
        >
          All Days
        </button>
        {DAYS_OF_WEEK.map((d) => (
          <button
            key={d}
            onClick={() => setDay(d)}
            className={cn(
              "rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors",
              day === d ? "border-brand bg-brand text-black" : "border-white/15 text-foreground/60 hover:border-white/40"
            )}
          >
            {DAY_LABELS[d].slice(0, 3)}
          </button>
        ))}
      </div>

      <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Select value={program} onValueChange={(value) => setProgram(value ?? "ALL")}>
          <SelectTrigger className="w-full border-white/15 bg-white/5">
            <SelectValue placeholder="Program" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Programs</SelectItem>
            {programs.map((p) => (
              <SelectItem key={p.slug} value={p.slug}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={trainer} onValueChange={(value) => setTrainer(value ?? "ALL")}>
          <SelectTrigger className="w-full border-white/15 bg-white/5">
            <SelectValue placeholder="Trainer" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Trainers</SelectItem>
            {trainers.map((t) => (
              <SelectItem key={t.slug} value={t.slug}>
                {t.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={difficulty} onValueChange={(value) => setDifficulty(value ?? "ALL")}>
          <SelectTrigger className="w-full border-white/15 bg-white/5">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Levels</SelectItem>
            {Object.entries(DIFFICULTY_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={time} onValueChange={(value) => setTime(value ?? "ALL")}>
          <SelectTrigger className="w-full border-white/15 bg-white/5">
            <SelectValue placeholder="Time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Any Time</SelectItem>
            <SelectItem value="MORNING">Morning</SelectItem>
            <SelectItem value="AFTERNOON">Afternoon</SelectItem>
            <SelectItem value="EVENING">Evening</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 text-center text-foreground/50"
            >
              No classes match those filters. Try widening your search.
            </motion.p>
          )}
          {filtered.map((c) => {
            const spotsLeft = Math.max(c.capacity - c.booked, 0);
            const isFull = spotsLeft === 0;
            return (
              <motion.div
                layout
                key={c.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/2 p-5 transition-colors hover:border-brand/30 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="flex w-16 shrink-0 flex-col items-center rounded-xl bg-white/5 py-2 text-center">
                    <span className="text-[10px] uppercase tracking-wide text-foreground/50">
                      {DAY_LABELS[c.dayOfWeek].slice(0, 3)}
                    </span>
                    <span className="heading-font text-sm text-brand">{c.startTime}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">{c.className}</h3>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-foreground/50">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {c.startTime}–{c.endTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {c.room}
                      </span>
                      <span>{DIFFICULTY_LABELS[c.difficulty] ?? c.difficulty}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <Link
                    href={`/trainers/${c.trainer.slug}`}
                    className="flex items-center gap-2 text-sm text-foreground/70 hover:text-brand"
                  >
                    <span className="relative h-8 w-8 overflow-hidden rounded-full">
                      <Image src={c.trainer.image} alt={c.trainer.name} fill sizes="32px" className="object-cover" />
                    </span>
                    {c.trainer.name}
                  </Link>
                  <span
                    className={cn(
                      "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
                      isFull ? "bg-white/10 text-foreground/40" : "bg-brand/15 text-brand"
                    )}
                  >
                    <Users className="h-3 w-3" />
                    {isFull ? "Full" : `${spotsLeft} spots left`}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
