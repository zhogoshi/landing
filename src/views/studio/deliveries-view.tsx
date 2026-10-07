"use client";

import { Badge, Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@hogoshi/ui";
import { useQuery } from "@tanstack/react-query";
export type Delivery = {
  post_id: string;
  title: string;
  slug: string;
  message_id: string | null;
  status: string | null;
  error: string | null;
  updated_at: string | null;
};

export function DeliveriesView() {
  const query = useQuery({
    queryKey: ["deliveries"],
    queryFn: async () => {
      const response = await fetch("/api/studio/deliveries");
      if (!response.ok) throw new Error("Deliveries failed");
      return response.json() as Promise<{ deliveries: Delivery[] }>;
    },
  });
  return (
    <div className="mx-auto grid w-full max-w-5xl gap-4 px-4 py-6 lg:px-8">
      <h1 className="text-fg text-2xl font-semibold">Deliveries</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Note</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Message</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {(query.data?.deliveries ?? []).map((row) => (
            <TableRow key={row.post_id}>
              <TableCell>{row.title}</TableCell>
              <TableCell>
                <Badge tone={row.status === "sent" ? "success" : row.status === "error" ? "danger" : "neutral"}>
                  {row.status ?? "waiting"}
                </Badge>
              </TableCell>
              <TableCell className="text-fg-muted">{row.error || row.message_id || "—"}</TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={async () => {
                    await fetch(`/api/studio/deliveries/${row.post_id}`, { method: "POST" });
                    void query.refetch();
                  }}
                >
                  Retry
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
