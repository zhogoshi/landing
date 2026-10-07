"use client";

import { Button, Input, Label } from "@hogoshi/ui";
import { useState } from "react";

export function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  return (
    <form
      className="mx-auto grid w-full max-w-sm gap-3 px-6 py-24"
      onSubmit={async (event) => {
        event.preventDefault();
        setError("");
        const response = await fetch("/api/studio/login", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ password }),
        });
        if (!response.ok) {
          setError("That password did not match.");
          return;
        }
        window.location.reload();
      }}
    >
      <Label htmlFor="studio-password">Password</Label>
      <Input id="studio-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
      {error ? <p className="text-danger text-xs">{error}</p> : null}
      <Button type="submit">Enter</Button>
    </form>
  );
}
