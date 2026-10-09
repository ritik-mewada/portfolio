import { FlaskConical } from "lucide-react";
import {
  SiAngular, SiCypress, SiDjango, SiDocker, SiExpress, SiGithubactions, SiGraphql, SiJavascript,
  SiJest, SiKubernetes, SiLinux, SiMongodb, SiMysql, SiNestjs, SiNextdotjs, SiNodedotjs,
  SiPostgresql, SiPostman, SiPython, SiReact, SiReactquery, SiRedis, SiRedux, SiSocketdotio,
  SiStripe, SiTailwindcss, SiTestinglibrary, SiTypescript, SiWebrtc,
} from "react-icons/si";
import { TbBrandAws, TbBrandAzure } from "react-icons/tb";

const icons: Record<string, React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>> = {
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

export function hasTechIcon(name: string) {
  return name in icons;
}

export function TechIcon({ name, className }: { name: string; className?: string }) {
  const Icon = icons[name];
  return Icon ? <Icon aria-hidden className={className} /> : null;
}
