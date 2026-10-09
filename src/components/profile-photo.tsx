import Image from "next/image";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

/** The profile photo (portrait, or the face crop for small spots), or an initials placeholder when unset. */
export function ProfilePhoto({
  className,
  sizes,
  priority = false,
  avatar = false,
  decorative = false,
}: {
  className?: string;
  sizes: string;
  priority?: boolean;
  avatar?: boolean;
  /** Set when the name is already shown next to the photo. */
  decorative?: boolean;
}) {
  const src = avatar ? (site.avatar ?? site.photo) : site.photo;
  return (
    <div
      className={cn(
        "relative grid place-items-center overflow-hidden bg-[linear-gradient(140deg,#1e3a8a,#6d28d9)] text-white/90",
        className,
      )}
    >
      {src ? (
        <Image src={src} alt={decorative ? "" : site.name} fill sizes={sizes} priority={priority} className="object-cover" />
      ) : (
        <span aria-label={site.name} role="img" className="text-[length:inherit] font-semibold tracking-wide">
          {site.initials}
        </span>
      )}
    </div>
  );
}
