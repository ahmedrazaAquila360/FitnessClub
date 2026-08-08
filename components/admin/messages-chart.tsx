"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  messages: {
    label: "Messages",
    color: "var(--brand-primary)",
  },
} satisfies ChartConfig;

export function MessagesChart({ data }: { data: { date: string; messages: number }[] }) {
  return (
    <ChartContainer config={chartConfig} className="h-[220px] w-full">
      <AreaChart data={data} margin={{ left: 0, right: 12, top: 8, bottom: 0 }}>
        <defs>
          <linearGradient id="fillMessages" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--brand-primary)" stopOpacity={0.4} />
            <stop offset="95%" stopColor="var(--brand-primary)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          fontSize={11}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          dataKey="messages"
          type="monotone"
          fill="url(#fillMessages)"
          stroke="var(--brand-primary)"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  );
}
