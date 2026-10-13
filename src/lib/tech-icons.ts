import type { ComponentType } from "react";
import { FlaskConical } from "lucide-react";
import {
  SiAngular, SiCypress, SiDjango, SiDocker, SiExpress, SiGithubactions, SiGraphql, SiJavascript,
  SiJest, SiKubernetes, SiLinux, SiMongodb, SiMysql, SiNestjs, SiNextdotjs, SiNodedotjs,
  SiPostgresql, SiPostman, SiPython, SiReact, SiReactquery, SiRedis, SiRedux, SiSocketdotio,
  SiStripe, SiTailwindcss, SiTestinglibrary, SiTypescript, SiWebrtc,
} from "react-icons/si";
import { TbBrandAws, TbBrandAzure } from "react-icons/tb";

export const techIcons: Record<string, ComponentType> = {
  Angular: SiAngular,
  AWS: TbBrandAws,
  Azure: TbBrandAzure,
  Cypress: SiCypress,
  "Django REST": SiDjango,
  Docker: SiDocker,
  Express: SiExpress,
  "GitHub Actions": SiGithubactions,
  GraphQL: SiGraphql,
  JavaScript: SiJavascript,
  Jest: SiJest,
  Kubernetes: SiKubernetes,
  Linux: SiLinux,
  MongoDB: SiMongodb,
  MySQL: SiMysql,
  NestJS: SiNestjs,
  "Next.js": SiNextdotjs,
  "Node.js": SiNodedotjs,
  Playwright: FlaskConical,
  PostgreSQL: SiPostgresql,
  Postman: SiPostman,
  Python: SiPython,
  React: SiReact,
  "React Native": SiReact,
  "React Testing Library": SiTestinglibrary,
  "TanStack Query": SiReactquery,
  Redis: SiRedis,
  Redux: SiRedux,
  "Socket.io": SiSocketdotio,
  Stripe: SiStripe,
  "Tailwind CSS": SiTailwindcss,
  TypeScript: SiTypescript,
  WebRTC: SiWebrtc,
};

/** The sprite symbol id for a technology name, e.g. "Node.js" → "node-js". */
export const techIconId = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
