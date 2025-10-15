"use client";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";

const data = [
  { month: "Jan", research: 186, dao: 80 },
  { month: "Feb", research: 305, dao: 120 },
  { month: "Mar", research: 237, dao: 95 },
  { month: "Apr", research: 273, dao: 140 },
  { month: "May", research: 409, dao: 180 },
  { month: "Jun", research: 514, dao: 220 },
];

const chartConfig = {
  research: {
    label: "Research",
    color: "hsl(var(--chart-1))",
  },
  dao: {
    label: "DAO Activity",
    color: "hsl(var(--chart-2))",
  },
};

export function ActivityChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="fillResearch" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="fillDao" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis
            dataKey="month"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area
            type="monotone"
            dataKey="research"
            stroke="hsl(var(--chart-1))"
            strokeWidth={2}
            fill="url(#fillResearch)"
          />
          <Area type="monotone" dataKey="dao" stroke="hsl(var(--chart-2))" strokeWidth={2} fill="url(#fillDao)" />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
