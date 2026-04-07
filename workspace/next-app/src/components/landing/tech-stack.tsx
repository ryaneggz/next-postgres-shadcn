"use client";

import type { LucideIcon } from "lucide-react";
import {
  Code2,
  FileCode2,
  Database,
  Layers,
  Paintbrush,
  Container,
  Globe,
  TestTube2,
  MonitorCheck,
  Hexagon,
} from "lucide-react";

interface TechItem {
  name: string;
  icon: LucideIcon;
}

const stack: TechItem[] = [
  { name: "Next.js 16", icon: Hexagon },
  { name: "TypeScript", icon: FileCode2 },
  { name: "PostgreSQL 16", icon: Database },
  { name: "Prisma 7", icon: Layers },
  { name: "shadcn/ui", icon: Code2 },
  { name: "Tailwind CSS v4", icon: Paintbrush },
  { name: "Docker", icon: Container },
  { name: "Cloudflare Tunnels", icon: Globe },
  { name: "Vitest", icon: TestTube2 },
  { name: "Playwright", icon: MonitorCheck },
];

function TechBadge({ name, icon: Icon }: TechItem) {
  return (
    <div className="flex shrink-0 items-center gap-3 rounded-full border border-border/40 bg-card/50 px-5 py-2.5 backdrop-blur-sm">
      <Icon className="h-5 w-5 text-muted-foreground" />
      <span className="whitespace-nowrap text-sm font-medium">{name}</span>
    </div>
  );
}

function MarqueeTrack({ items, reverse }: { items: TechItem[]; reverse?: boolean }) {
  const tripled = [...items, ...items, ...items];
  const direction = reverse ? "animate-marquee-reverse" : "animate-marquee";

  return (
    <div className="group relative overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />
      <div
        className={`flex w-max gap-4 py-1 ${direction} group-hover:[animation-play-state:paused]`}
      >
        {tripled.map((tech, i) => (
          <TechBadge key={`${tech.name}-${i}`} {...tech} />
        ))}
      </div>
    </div>
  );
}

export function TechStack() {
  const half = Math.ceil(stack.length / 2);
  const row1 = stack.slice(0, half);
  const row2 = stack.slice(half);

  return (
    <section className="py-16">
      <h2 className="mb-2 text-center text-2xl font-bold tracking-tight sm:text-3xl">Tech Stack</h2>
      <p className="mb-10 text-center text-muted-foreground">
        Production-grade tools, zero configuration.
      </p>
      <div className="flex flex-col gap-4">
        <MarqueeTrack items={row1} />
        <MarqueeTrack items={row2} reverse />
      </div>
    </section>
  );
}
