"use client";

import { AreaChart, Card, CardDescription, CardHeader, CardTitle, Input } from "@hogoshi/ui";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const today = () => new Date().toISOString().slice(0, 10);

export function PulseView() {
  const [day, setDay] = useState(today);
  const query = useQuery({
    queryKey: ["pulse", day],
    queryFn: async () => {
      const response = await fetch(`/api/studio/pulse?day=${day}`);
      if (!response.ok) throw new Error("Pulse failed");
      return response.json() as Promise<{ online: number; hours: { hour: string; visits: number }[] }>;
    },
  });
  return (
    <div className="mx-auto grid w-full max-w-5xl gap-4 px-4 py-6 lg:px-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-fg text-2xl font-semibold">Pulse</h1>
          <p className="text-fg-muted text-sm">{query.data ? `${query.data.online} online` : "Loading"}</p>
        </div>
        <Input type="date" value={day} onChange={(event) => setDay(event.target.value)} className="w-40" />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Visits</CardTitle>
          <CardDescription>Unique visitors each hour</CardDescription>
        </CardHeader>
        <AreaChart data={query.data?.hours ?? []} index="hour" config={{ visits: { label: "Visits" } }} />
      </Card>
    </div>
  );
}
