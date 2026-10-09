import Image from "next/image";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

/** The profile photo, or an initials placeholder until `site.photo` is set. */
export function ProfilePhoto({ className, sizes, priority = false }: { className?: string; sizes: string; priority?: boolean }) {
  return (
    <div
      className={cn(
        "relative grid place-items-center overflow-hidden bg-[linear-gradient(140deg,#1e3a8a,#6d28d9)] text-white/90",
        className,
      )}
    >
      {site.photo ? (
        <Image src={site.photo} alt={site.name} fill sizes={sizes} priority={priority} className="object-cover" />
      ) : (
        <span aria-label={site.name} role="img" className="text-[length:inherit] font-semibold tracking-wide">
          {site.initials}
        </span>
      )}
    </div>
  );
}
