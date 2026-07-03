export default function HighlightText({
  text,
  highlight,
  className = "font-bold text-[#E7A64F]",
}: {
  text: string;
  highlight: string;
  className?: string;
}) {
  const idx = text.toLowerCase().indexOf(highlight.toLowerCase());
  if (idx === -1) return <>{text}</>;

  const before = text.slice(0, idx);
  const match = text.slice(idx, idx + highlight.length);
  const after = text.slice(idx + highlight.length);

  return (
    <>
      {before}
      <span className={className}>{match}</span>
      {after}
    </>
  );
}
