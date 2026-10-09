// Single source of truth for everything on the site.
// Edit this file to update your portfolio — no component changes needed.

export const site = {
  name: "Ritik Mewada",
  shortName: "Ritik",
  initials: "RM",
  role: "Software Engineer",
  rotatingRoles: [
    "Quality Assurance Engineering",
    "IoT & Hardware Testing",
    "Full-Stack Development",
    "Test Automation",
    "Front-End Architecture",
  ],
  summary:
    "Software engineer with 4+ years across full-stack development and quality engineering. I've shipped React, Next.js and Node.js products for marketplaces, analytics platforms and SaaS tools — and today I validate IoT systems for digital mining at Maestro Digital Mine.",
  about: [
    "I started out writing React dashboards and REST APIs, and over the years grew into owning front-end architecture, design systems and CI/CD pipelines for products used by thousands of people.",
    "Building things taught me how they break. That's what pulled me toward quality engineering: I now test the sensors, devices and networks behind underground mining operations, where a missed bug isn't just a bad UX — it's a gas reading nobody sees.",
    "I like work that sits between the two worlds: developer-minded testing, test-minded development.",
  ],
  location: "Ontario, Canada",
  email: "ritikmewada@gmail.com",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://ritik-mewada.vercel.app",
  availability: "Open to interesting conversations",
  socials: {
    github: "https://github.com/ritik-mewada",
    linkedin: "https://www.linkedin.com/in/ritikmewada",
  },
  githubUsername: "ritik-mewada",
  stats: [
    { value: 4, suffix: "+", label: "Years building software" },
    { value: 5, suffix: "", label: "Companies shipped with" },
    { value: 25, suffix: "k+", label: "Daily API requests served" },
    { value: 20, suffix: "+", label: "Public repos on GitHub" },
  ],
} as const;

type Experience = {
  company: string;
  role: string;
  url?: string;
  location: string;
  start: string;
  end: string;
  current?: boolean;
  summary: string;
  highlights: string[];
  stack: string[];
};

export const experience: Experience[] = [
  {
    company: "Maestro Digital Mine",
    role: "Quality Assurance Engineer",
    url: "https://maestrodigitalmine.com",
    location: "Ontario, Canada",
    start: "Jul 2026",
    end: "Present",
    current: true,
    summary:
      "Testing the hardware, sensors and networks behind real-time safety monitoring in underground mines.",
    highlights: [
      "Test hardware devices end to end, validating gas and airflow sensors to make sure every reading is accurate and reliable.",
      "Validate the network stack that connects the devices, checking it holds up under every condition — from normal operation to degraded and failure scenarios.",
      "Verify device communication over industrial protocols including Modbus, TCP/IP and MQTT.",
      "Own test management in Jira: write and maintain test cases, log reproducible bugs and track them through to resolution.",
    ],
    stack: ["Hardware Testing", "Gas & Airflow Sensors", "Modbus", "TCP/IP", "MQTT", "Jira"],
  },
  {
    company: "HRX Connect",
    role: "Software Developer",
    location: "Toronto, ON",
    start: "May 2025",
    end: "Oct 2025",
    summary:
      "Front-end lead on a multi-vendor marketplace built with React and Django REST Framework.",
    highlights: [
      "Owned front-end architecture and a reusable component library, cutting UI development effort by ~30%.",
      "Integrated Stripe Connect for 50+ vendors and DoorDash delivery APIs — 40% fewer payment errors, 60% better delivery-tracking visibility.",
      "Containerised services with Docker and Kubernetes for zero-downtime releases; load-tested the platform for a 5,000+ monthly-user launch target.",
      "Automated CI/CD with GitHub Actions, taking deploys from 45 to 20 minutes, and mentored two junior developers.",
    ],
    stack: ["React", "Django REST", "Stripe Connect", "Docker", "Kubernetes", "GitHub Actions"],
  },
  {
    company: "Vosyn",
    role: "Frontend Developer",
    location: "Toronto, ON",
    start: "Oct 2024",
    end: "Apr 2025",
    summary: "Modernised a React SPA into a fast, SEO-friendly Next.js + TypeScript app.",
    highlights: [
      "Led the React → Next.js and TypeScript migration with SSR/ISR, lifting Lighthouse SEO by 35% and cutting initial load by 1.2s.",
      "Introduced TanStack Query, lazy loading and code splitting — 45% shorter API waits and a 28% smaller bundle.",
      "Built a WCAG 2.1 AA Tailwind component library used across 20+ screens, reducing post-release UI fixes by 20%.",
    ],
    stack: ["Next.js", "TypeScript", "TanStack Query", "Tailwind CSS", "Jest", "RTL"],
  },
  {
    company: "Emerging Five",
    role: "Software Developer",
    location: "Ahmedabad, India",
    start: "Jan 2022",
    end: "Nov 2023",
    summary: "Full-stack MERN developer on analytics dashboards and business platforms.",
    highlights: [
      "Built MERN applications serving 10,000+ active users and REST APIs handling 25–30k requests a day.",
      "Improved rendering performance ~30% with caching, bundle optimisation and Redux standardised across 15+ modules — 40% fewer UI defects.",
      "Shipped bi-weekly releases in an 8-person Scrum team and resolved 50+ production incidents.",
    ],
    stack: ["React", "Node.js", "Express", "MongoDB", "Redux", "Redis"],
  },
  {
    company: "Akash Technolabs",
    role: "Software Developer Intern",
    location: "Ahmedabad, India",
    start: "May 2021",
    end: "Oct 2021",
    summary: "First professional role — internal tooling and dashboards.",
    highlights: [
      "Built a React admin dashboard visualising 1M+ MySQL records for internal stakeholders.",
      "Took part in Agile sprint planning and stand-ups, helping speed up feature delivery by ~20%.",
    ],
    stack: ["React", "CoreUI", "MySQL"],
  },
];

export const education = [
  {
    school: "Humber College",
    credential: "Postgraduate Certificate, Information Technology Solutions",
    location: "Toronto, ON",
    period: "2024 – 2025",
    note: "GPA 4.20 / 5.00",
  },
  {
    school: "Gujarat Technological University",
    credential: "Bachelor of Engineering, Computer Engineering",
    location: "Ahmedabad, India",
    period: "2019 – 2022",
    note: "CGPA 8.20 / 10",
  },
];

type SkillGroup = { title: string; items: string[] };

export const skills: SkillGroup[] = [
  {
    title: "Languages",
    items: ["TypeScript", "JavaScript", "Python", "Java", "SQL", "HTML", "CSS"],
  },
  {
    title: "Frontend",
    items: ["React", "Next.js", "Redux", "TanStack Query", "Tailwind CSS", "React Native", "Angular"],
  },
  {
    title: "Backend",
    items: ["Node.js", "Express", "NestJS", "Django REST", "GraphQL", "WebSockets", "Stripe"],
  },
  {
    title: "Data",
    items: ["PostgreSQL", "MongoDB", "MySQL", "Redis", "TypeORM", "Mongoose"],
  },
  {
    title: "Quality & Testing",
    items: ["Playwright", "Cypress", "Jest", "React Testing Library", "Postman", "Jira", "Test Case Design"],
  },
  {
    title: "IoT & Protocols",
    items: ["Hardware Testing", "Sensor Validation", "Network Testing", "Modbus", "TCP/IP", "MQTT"],
  },
  {
    title: "Cloud & DevOps",
    items: ["Docker", "Kubernetes", "GitHub Actions", "AWS", "Azure", "Linux"],
  },
];

export type ProjectStatus = "Complete" | "In progress" | "Learning build" | "Team project" | "Academic";

type Project = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  status: ProjectStatus;
  year: string;
  featured?: boolean;
  stack: string[];
  repos: { label: string; url: string }[];
  live?: string;
  highlights: string[];
  learned: string;
};

export const projects: Project[] = [
  {
    slug: "mernspace",
    title: "MERNspace",
    tagline: "Microservice food-ordering platform",
    description:
      "A multi-tenant pizza-ordering platform split into independent services: an auth service issuing RSA-signed JWTs, an order service with Stripe payments, a Next.js storefront and a React admin dashboard.",
    status: "In progress",
    year: "2024 – 2026",
    featured: true,
    stack: ["Next.js", "TypeScript", "Express", "PostgreSQL", "MongoDB", "Stripe", "Docker", "TanStack Query"],
    repos: [
      { label: "Storefront", url: "https://github.com/ritik-mewada/mernspace-client-ui" },
      { label: "Auth service", url: "https://github.com/ritik-mewada/mernspace-auth-service" },
      { label: "Order service", url: "https://github.com/ritik-mewada/mernspace-order-service" },
      { label: "Admin dashboard", url: "https://github.com/ritik-mewada/mern_admin_dashboard" },
    ],
    highlights: [
      "Auth service issuing RSA-signed access/refresh tokens with a public JWKS endpoint, backed by PostgreSQL via TypeORM.",
      "Order service on MongoDB that verifies tokens against the auth service's JWKS and takes payments with Stripe.",
      "Next.js storefront with shadcn/Radix UI, Redux Toolkit for cart state and TanStack Query for server data.",
      "Auth service ships with dev/prod Docker images, Jest integration tests and SonarQube analysis.",
    ],
    learned:
      "How to draw service boundaries, share identity across services without sharing a database, and keep a distributed system debuggable with structured logging.",
  },
  {
    slug: "playwright-suite",
    title: "Playwright Test Suite",
    tagline: "E2E + API test automation framework",
    description:
      "A TypeScript test-automation framework built on the Page Object Model, covering API contracts and security, a full e-commerce checkout and a real-world Angular SPA.",
    status: "Complete",
    year: "2026",
    featured: true,
    stack: ["Playwright", "TypeScript", "Page Object Model", "API Testing"],
    repos: [{ label: "Repository", url: "https://github.com/ritik-mewada/playwright_task" }],
    highlights: [
      "API contract & security suite runs first: validates schemas and field types, and asserts that secrets like password hashes never leak.",
      "Sauce Demo suite covers login paths, sorting, cart-badge sync, tax math and checkout totals.",
      "Conduit suite exercises an Angular SPA with generated users — article lifecycle, comments and follow/unfollow feeds.",
      "Edge-case coverage with empty, null and wrongly-typed inputs.",
    ],
    learned:
      "Designing tests that are fast, independent and readable — and ordering suites so cheap API checks fail before slow browser tests run.",
  },
  {
    slug: "stylecast-erp",
    title: "StyleCast ERP",
    tagline: "Multi-tenant brand admin API",
    description:
      "Backend for a fashion marketplace's brand-admin ERP. Brands manage products, inventory, orders, shipping rules and analytics through a documented REST API.",
    status: "In progress",
    year: "2026",
    featured: true,
    stack: ["Node.js", "TypeScript", "Express 5", "TypeORM", "PostgreSQL", "Swagger"],
    repos: [{ label: "Repository", url: "https://github.com/ritik-mewada/stylecast_erp" }],
    highlights: [
      "Tenant-scoped data model so every brand only ever sees its own catalogue and orders.",
      "Request validation with class-validator DTOs and hardened defaults with Helmet and CORS.",
      "OpenAPI 3 documentation served through Swagger UI.",
    ],
    learned: "Multi-tenancy patterns and treating API documentation as a first-class deliverable.",
  },
  {
    slug: "pricify",
    title: "Pricify",
    tagline: "Embeddable pricing-card SaaS",
    description:
      "A SaaS tool that lets businesses design pricing cards, preview them live and embed them into any website — replacing hand-edited pricing pages.",
    status: "Academic",
    year: "2025",
    featured: true,
    stack: ["React", "Ant Design", "Node.js", "Express", "MongoDB", "JWT"],
    repos: [{ label: "Repository", url: "https://github.com/ritik-mewada/Pricify" }],
    highlights: [
      "Visual editor with real-time preview of pricing cards.",
      "Embeddable output so cards can be dropped into existing sites.",
      "Express + MongoDB API with JWT auth and validated inputs for each user's templates.",
    ],
    learned: "Building a product for non-technical users — sensible defaults matter more than options.",
  },
  {
    slug: "finance-tracker",
    title: "Finance Tracker",
    tagline: "Gamified personal-finance dashboard",
    description:
      "A Next.js app for tracking savings goals, budgets, debts, subscriptions and transactions in one dashboard, with missions and achievements to keep users motivated.",
    status: "Team project",
    year: "2025",
    stack: ["Next.js", "TypeScript", "shadcn/ui", "MongoDB", "JWT"],
    repos: [{ label: "Repository", url: "https://github.com/ritik-mewada/web_project_team_prism" }],
    live: "https://web-project-team-prism.vercel.app",
    highlights: [
      "Dashboards for goals, budgets, debts and subscriptions.",
      "Mission and achievement system to encourage good habits.",
      "Accessible UI built with Radix primitives.",
    ],
    learned: "Collaborating on a shared codebase with reviews, branches and a shared component kit.",
  },
  {
    slug: "travel-tales",
    title: "Travel Tales",
    tagline: "Tour-booking web app",
    description:
      "A server-rendered tour-booking site with authentication, Stripe checkout, image processing and a hardened Express API.",
    status: "Learning build",
    year: "2023 – 2025",
    stack: ["Node.js", "Express", "MongoDB", "Stripe", "JWT"],
    repos: [{ label: "Repository", url: "https://github.com/ritik-mewada/travel-tales" }],
    highlights: [
      "JWT auth with password reset emails via Nodemailer.",
      "Security middleware: rate limiting, Helmet, HPP, XSS and NoSQL-injection sanitising.",
      "Stripe checkout and Sharp-based image resizing.",
    ],
    learned: "Production-grade Express: error handling, security headers and API design.",
  },
  {
    slug: "coders-house",
    title: "Coder's House",
    tagline: "Real-time voice rooms with WebRTC",
    description: "A clone of a social audio app where developers can drop into live voice rooms.",
    status: "Learning build",
    year: "2023",
    stack: ["React", "Redux Toolkit", "Node.js", "WebRTC", "Socket.io", "Twilio"],
    repos: [{ label: "Repository", url: "https://github.com/ritik-mewada/codershouse-clone" }],
    highlights: [
      "Peer-to-peer audio with WebRTC and Socket.io signalling.",
      "OTP sign-up via Twilio SMS, JWT sessions and room management.",
    ],
    learned: "How WebRTC signalling, ICE and peer connections actually fit together.",
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
