import type { ReactNode } from "react";

function rich(text: string, key: string) {
  const nodes: ReactNode[] = [];
  const pattern = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g;
  let last = 0;
  let match = pattern.exec(text);
  let index = 0;
  while (match) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    nodes.push(
      <a key={`${key}-${index}`} href={match[2]} className="text-fg underline underline-offset-4">
        {match[1]}
      </a>,
    );
    last = match.index + match[0].length;
    index += 1;
    match = pattern.exec(text);
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function Markdown({ source }: { source: string }) {
  const lines = source.replaceAll("\r\n", "\n").split("\n");
  const blocks: ReactNode[] = [];
  let index = 0;
  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) {
      index += 1;
      continue;
    }
    if (line.startsWith("```")) {
      const body: string[] = [];
      index += 1;
      while (index < lines.length && !lines[index].startsWith("```")) {
        body.push(lines[index]);
        index += 1;
      }
      index += 1;
      blocks.push(
        <pre key={blocks.length} className="bg-bg-subtle overflow-x-auto rounded-[var(--radius-md)] p-3 font-mono text-xs">
          {body.join("\n")}
        </pre>,
      );
      continue;
    }
    const heading = /^(#{1,3})\s+(.+)$/.exec(line);
    if (heading) {
      const Tag = heading[1].length === 1 ? "h2" : heading[1].length === 2 ? "h3" : "h4";
      blocks.push(
        <Tag key={blocks.length} className="text-fg font-semibold tracking-tight">
          {heading[2]}
        </Tag>,
      );
      index += 1;
      continue;
    }
    const image = /^!\[([^\]]*)\]\(([^)\s]+)\)$/.exec(line.trim());
    if (image) {
      blocks.push(
        <img key={blocks.length} src={image[2]} alt={image[1]} className="w-full rounded-[var(--radius-md)]" />,
      );
      index += 1;
      continue;
    }
    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (index < lines.length && lines[index].startsWith("- ")) {
        items.push(lines[index].slice(2));
        index += 1;
      }
      blocks.push(
        <ul key={blocks.length} className="grid list-disc gap-1 pl-5">
          {items.map((item, at) => (
            <li key={at}>{rich(item, `li-${at}`)}</li>
          ))}
        </ul>,
      );
      continue;
    }
    const paragraph: string[] = [];
    while (index < lines.length && lines[index].trim() && !lines[index].startsWith("#") && !lines[index].startsWith("- ") && !lines[index].startsWith("```") && !lines[index].startsWith("!")) {
      paragraph.push(lines[index]);
      index += 1;
    }
    blocks.push(
      <p key={blocks.length} className="text-fg-muted leading-relaxed">
        {rich(paragraph.join(" "), `p-${blocks.length}`)}
      </p>,
    );
  }
  return <div className="grid gap-4">{blocks}</div>;
}
