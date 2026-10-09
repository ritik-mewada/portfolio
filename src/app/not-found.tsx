import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[80svh] max-w-xl flex-col items-center justify-center px-5 text-center">
      <p className="font-mono text-sm text-accent">✗ 1 failed · expected page, received 404</p>
      <h1 className="mt-6 text-5xl font-semibold tracking-tight">
        This page <span className="font-serif font-normal italic text-accent">didn&apos;t pass.</span>
      </h1>
      <p className="mt-4 text-muted-foreground">The link might be broken, or the page has moved. Let&apos;s get you back to something that works.</p>
      <Link href="/" className="mt-10 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground">
        Back to home
      </Link>
    </section>
  );
}
