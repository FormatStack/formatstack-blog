const placeholderColors = ["bg-[#ef795e]", "bg-[#8756da]", "bg-[#2f8c76]"];

export function StoryPlaceholder({ index }: { index: number }) {
  return (
    <span
      className={`grid size-full min-h-[inherit] place-items-center text-white ${placeholderColors[index % 3]}`}
      aria-hidden="true"
    >
      <span className="grid size-28 place-items-center rounded-full border border-white/50 text-[1.4rem] font-extrabold">
        {String(index + 1).padStart(2, "0")}
      </span>
    </span>
  );
}
