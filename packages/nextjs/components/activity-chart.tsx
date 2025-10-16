"use client";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";

// TODO: 실제 데이터를 props로 받아오기
interface ActivityChartProps {
  data?: Array<{
    month: string;
    research: number;
    dao: number;
  }>;
}

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

export function ActivityChart({ data = [] }: ActivityChartProps) {
  // 데이터가 없을 때 빈 상태 표시
  if (data.length === 0) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center">
        <p className="text-sm text-muted-foreground">No activity data available</p>
      </div>
    );
  }

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
