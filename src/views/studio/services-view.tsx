"use client";

import { AreaChart, Badge, Card, CardDescription, CardHeader, CardTitle, Input } from "@hogoshi/ui";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const today = () => new Date().toISOString().slice(0, 10);

type Service = { id: string; name: string; up: boolean; hours: { hour: string; pulses: number }[] };

export function ServicesView() {
  const [day, setDay] = useState(today);
  const query = useQuery({
    queryKey: ["services", day],
    queryFn: async () => {
      const response = await fetch(`/api/studio/services?day=${day}`);
      if (!response.ok) throw new Error("Services failed");
      return response.json() as Promise<{ services: Service[] }>;
    },
  });
  const services = query.data?.services ?? [];
  return (
    <div className="mx-auto grid w-full max-w-5xl gap-4 px-4 py-6 lg:px-8">
      <div className="flex items-end justify-between gap-4">
        <h1 className="text-fg text-2xl font-semibold">Services</h1>
        <Input type="date" value={day} onChange={(event) => setDay(event.target.value)} className="w-40" />
      </div>
      {services.length ? (
        services.map((service) => (
          <Card key={service.id}>
            <CardHeader>
              <CardTitle>{service.name}</CardTitle>
              <CardDescription>
                <Badge tone={service.up ? "success" : "danger"}>{service.up ? "Up" : "Down"}</Badge>
              </CardDescription>
            </CardHeader>
            <AreaChart data={service.hours} index="hour" config={{ pulses: { label: "Pulses" } }} />
          </Card>
        ))
      ) : (
        <p className="text-fg-muted text-sm">No service has reported in.</p>
      )}
    </div>
  );
}
