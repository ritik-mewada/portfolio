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
    "Software engineer with over four years of experience in full-stack development and quality engineering. I've shipped products built with React, Next.js, and Node.js for marketplaces, analytics platforms, and SaaS tools, and I now validate IoT systems used in digital mining at Maestro Digital Mine.",
  about: [
    "I started out building React dashboards and REST APIs, and over the years, I grew into a role where I owned front-end architecture, design systems, and CI/CD pipelines for products used by thousands of people.",
    "Building software taught me how it can break, and that's what drew me toward quality engineering. I now test the sensors, devices, and networks used to monitor underground mines, where accurate readings are critical to safety.",
    "I enjoy working at the intersection of these two disciplines: developer-minded testing and test-minded development.",
  ],
  location: "Ontario, Canada",
  email: "ritikmewada@gmail.com",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://ritik-mewada.github.io",
  availability: "Open to interesting conversations",
  socials: {
    github: "https://github.com/ritik-mewada",
    linkedin: "https://www.linkedin.com/in/ritikmewada",
  },
  githubUsername: "ritik-mewada",
  stats: [
    { value: 4, suffix: "+", label: "Years of software development experience" },
    { value: 5, suffix: "", label: "Companies I've shipped products for" },
    { value: 25, suffix: "k+", label: "API requests handled daily" },
    { value: 20, suffix: "+", label: "Public GitHub repositories" },
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
      "Manually test devices, sensors, and networks used for safety monitoring in underground mines.",
    highlights: [
      "Design test cases and perform manual testing on hardware devices and airflow sensors.",
      "Test gas sensors from different manufacturers by configuring them, performing factory calibration, recording sensor readings in Excel, and retesting them every one to two weeks to assess their reliability over time and identify potential failures.",
      "Verify that devices communicate correctly using Modbus, TCP/IP, and MQTT.",
      "Use Wireshark to identify connected devices' IP addresses and monitor device-specific network traffic.",
      "Log bugs in Jira with clear reproduction steps and track them through resolution.",
    ],
    stack: ["Manual Testing", "Test Cases", "Gas & Airflow Sensors", "Calibration", "Bump Testing", "Modbus", "TCP/IP", "MQTT", "Wireshark", "Jira"],
  },
  {
    company: "HRX Connect",
    role: "Software Developer",
    location: "Toronto, ON",
    start: "May 2025",
    end: "Oct 2025",
    summary:
      "Served as the front-end lead for a multi-vendor marketplace built with React and Django REST Framework.",
    highlights: [
      "Owned front-end architecture and a reusable component library, reducing UI development effort by approximately 30%.",
      "Integrated Stripe Connect for 50+ vendors and the DoorDash delivery APIs, resulting in 40% fewer payment errors and a 60% improvement in delivery-tracking visibility.",
      "Containerized services with Docker and Kubernetes to enable zero-downtime releases, and load-tested the platform to support a launch target of over 5,000 monthly users.",
      "Automated CI/CD with GitHub Actions, reducing deployment times from 45 to 20 minutes, and mentored two junior developers.",
    ],
    stack: ["React", "Django REST Framework", "Stripe Connect", "Docker", "Kubernetes", "GitHub Actions"],
  },
  {
    company: "Vosyn",
    role: "Frontend Developer",
    location: "Toronto, ON",
    start: "Oct 2024",
    end: "Apr 2025",
    summary: "Migrated a React single-page application to a fast, SEO-friendly application built with Next.js and TypeScript.",
    highlights: [
      "Led the migration from React to Next.js and TypeScript with SSR/ISR, improving the Lighthouse SEO score by 35% and reducing initial page-load time by 1.2 seconds.",
      "Introduced TanStack Query, lazy loading, and code splitting, reducing API wait times by 45% and bundle size by 28%.",
      "Built a Tailwind CSS component library compliant with WCAG 2.1 AA, used across 20+ screens, reducing post-release UI fixes by 20%.",
    ],
    stack: ["Next.js", "TypeScript", "TanStack Query", "Tailwind CSS", "Jest", "RTL"],
  },
  {
    company: "Emerging Five",
    role: "Software Developer",
    location: "Ahmedabad, India",
    start: "Jan 2022",
    end: "Nov 2023",
    summary: "Worked as a full-stack MERN developer building analytics dashboards and business platforms.",
    highlights: [
      "Built MERN applications serving 10,000+ active users and REST APIs handling 25,000–30,000 requests per day.",
      "Improved rendering performance by approximately 30% through caching, bundle optimization, and standardizing Redux across more than 15 modules, resulting in 40% fewer UI defects.",
      "Delivered releases every two weeks as part of an eight-person Scrum team and resolved 50+ production incidents.",
    ],
    stack: ["React", "Node.js", "Express", "MongoDB", "Redux", "Redis"],
  },
  {
    company: "Akash Technolabs",
    role: "Software Developer Intern",
    location: "Ahmedabad, India",
    start: "May 2021",
    end: "Oct 2021",
    summary: "First professional role, focused on internal tools and dashboards.",
    highlights: [
      "Built a React admin dashboard to visualize more than one million MySQL records for internal stakeholders.",
      "Participated in Agile sprint planning and daily stand-ups, helping accelerate feature delivery by approximately 20%.",
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
    title: "Front-end",
    items: ["React", "Next.js", "Redux", "TanStack Query", "Tailwind CSS", "React Native", "Angular"],
  },
  {
    title: "Back-end",
    items: ["Node.js", "Express", "NestJS", "Django REST Framework", "GraphQL", "WebSockets", "Stripe"],
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
    items: ["Hardware Testing", "Sensor Validation", "Network Testing", "Modbus", "TCP/IP", "MQTT", "Wireshark"],
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
    tagline: "Microservices-based food-ordering platform",
    description:
      "A multi-tenant pizza-ordering platform divided into independent services: an auth service that issues RSA-signed JWTs, an order service with Stripe payments, a Next.js storefront, and a React admin dashboard.",
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
      "Auth service that issues RSA-signed access and refresh tokens, exposes a public JWKS endpoint, and uses PostgreSQL via TypeORM.",
      "MongoDB-backed order service that verifies tokens against the auth service's JWKS and processes payments with Stripe.",
      "Next.js storefront built with shadcn/Radix UI, using Redux Toolkit for cart state and TanStack Query for server data.",
      "The auth service includes development and production Docker images, Jest integration tests, and SonarQube analysis.",
    ],
    learned:
      "How to draw service boundaries, share identity across services without sharing a database, and keep a distributed system easy to debug with structured logging.",
  },
  {
    slug: "playwright-suite",
    title: "Playwright Test Suite",
    tagline: "E2E and API test automation framework",
    description:
      "A TypeScript-based test automation framework built using the Page Object Model, covering API contract and security testing, a complete e-commerce checkout flow, and a real-world Angular single-page application.",
    status: "Complete",
    year: "2026",
    featured: true,
    stack: ["Playwright", "TypeScript", "Page Object Model", "API Testing"],
    repos: [{ label: "Repository", url: "https://github.com/ritik-mewada/playwright_task" }],
    highlights: [
      "An API contract and security suite runs first, validating schemas and field types and asserting that secrets such as password hashes are never exposed.",
      "The Sauce Demo suite covers login paths, sorting, cart-badge sync, tax calculations, and checkout totals.",
      "The Conduit suite tests an Angular SPA with generated users, covering the article lifecycle, comments, and follow/unfollow feeds.",
      "Edge-case coverage for empty, null, and incorrectly typed inputs.",
    ],
    learned:
      "How to design tests that are fast, independent, and readable, and how to order suites so that fast API checks fail before slower browser tests run.",
  },
  {
    slug: "stylecast-erp",
    title: "StyleCast ERP",
    tagline: "Multi-tenant brand administration API",
    description:
      "A back-end system for a fashion marketplace's brand administration ERP. Brands manage products, inventory, orders, shipping rules, and analytics through a documented REST API.",
    status: "In progress",
    year: "2026",
    featured: true,
    stack: ["Node.js", "TypeScript", "Express 5", "TypeORM", "PostgreSQL", "Swagger"],
    repos: [{ label: "Repository", url: "https://github.com/ritik-mewada/stylecast_erp" }],
    highlights: [
      "Tenant-scoped data model that ensures each brand sees only its own catalog and orders.",
      "Request validation with class-validator DTOs, plus hardened security defaults using Helmet and CORS.",
      "OpenAPI 3 documentation served through Swagger UI.",
    ],
    learned: "Multi-tenancy patterns, and why API documentation should be treated as a first-class deliverable.",
  },
  {
    slug: "pricify",
    title: "Pricify",
    tagline: "SaaS platform for embeddable pricing cards",
    description:
      "A SaaS tool that lets businesses design pricing cards, preview them live, and embed them in any website, eliminating the need to manually edit pricing pages.",
    status: "Academic",
    year: "2025",
    featured: true,
    stack: ["React", "Ant Design", "Node.js", "Express", "MongoDB", "JWT"],
    repos: [{ label: "Repository", url: "https://github.com/ritik-mewada/Pricify" }],
    highlights: [
      "Visual editor with real-time preview of pricing cards.",
      "Embeddable output, so cards can be added to existing websites.",
      "Express and MongoDB API with JWT authentication and input validation for each user's templates.",
    ],
    learned: "When building for non-technical users, sensible defaults matter more than extra options.",
  },
  {
    slug: "finance-tracker",
    title: "Finance Tracker",
    tagline: "Gamified personal-finance dashboard",
    description:
      "A Next.js app for tracking savings goals, budgets, debts, subscriptions, and transactions in one dashboard, with missions and achievements to keep users motivated.",
    status: "Team project",
    year: "2025",
    stack: ["Next.js", "TypeScript", "shadcn/ui", "MongoDB", "JWT"],
    repos: [{ label: "Repository", url: "https://github.com/ritik-mewada/web_project_team_prism" }],
    live: "https://web-project-team-prism.vercel.app",
    highlights: [
      "Dashboards for goals, budgets, debts, and subscriptions.",
      "Mission and achievement system to encourage good habits.",
      "Accessible UI built with Radix primitives.",
    ],
    learned: "Collaborating on a shared codebase using code reviews, branches, and a common component kit.",
  },
  {
    slug: "travel-tales",
    title: "Travel Tales",
    tagline: "Tour-booking web app",
    description:
      "A server-rendered tour-booking site with authentication, Stripe checkout, image processing, and a hardened Express API.",
    status: "Learning build",
    year: "2023 – 2025",
    stack: ["Node.js", "Express", "MongoDB", "Stripe", "JWT"],
    repos: [{ label: "Repository", url: "https://github.com/ritik-mewada/travel-tales" }],
    highlights: [
      "JWT authentication with password-reset emails sent via Nodemailer.",
      "Security middleware for rate limiting, Helmet, HPP, and XSS and NoSQL-injection sanitization.",
      "Stripe checkout and image resizing with Sharp.",
    ],
    learned: "Production-grade Express practices: error handling, security headers, and API design.",
  },
  {
    slug: "coders-house",
    title: "Coder's House",
    tagline: "Real-time voice rooms with WebRTC",
    description: "A clone of a social audio app where developers can join live voice rooms.",
    status: "Learning build",
    year: "2023",
    stack: ["React", "Redux Toolkit", "Node.js", "WebRTC", "Socket.io", "Twilio"],
    repos: [{ label: "Repository", url: "https://github.com/ritik-mewada/codershouse-clone" }],
    highlights: [
      "Peer-to-peer audio with WebRTC and Socket.io signaling.",
      "OTP sign-up via Twilio SMS, JWT sessions, and room management.",
    ],
    learned: "How WebRTC signaling, ICE, and peer connections fit together.",
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
