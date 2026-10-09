// Fixed, softly drifting colour field that the glass surfaces blur.
// Radial gradients (not CSS blur filters) keep it cheap to animate on phones.
const blobs = [
  "left-[-15vw] top-[-20vh] size-[70vmax] bg-[radial-gradient(closest-side,var(--blob-1),transparent)] [animation:drift-a_22s_ease-in-out_infinite_alternate]",
  "right-[-20vw] top-[5vh] size-[60vmax] bg-[radial-gradient(closest-side,var(--blob-2),transparent)] [animation:drift-b_26s_ease-in-out_infinite_alternate]",
  "left-[15vw] bottom-[-30vh] size-[75vmax] bg-[radial-gradient(closest-side,var(--blob-3),transparent)] [animation:drift-a_30s_ease-in-out_infinite_alternate-reverse]",
  "right-[5vw] bottom-[-10vh] size-[45vmax] bg-[radial-gradient(closest-side,var(--blob-4),transparent)] [animation:drift-b_20s_ease-in-out_infinite_alternate-reverse]",
];

export function Wallpaper() {
  return (
    <div aria-hidden className="no-print pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background">
      {blobs.map((cls) => (
        <span key={cls} className={`absolute rounded-full will-change-transform ${cls}`} />
      ))}
    </div>
  );
}
