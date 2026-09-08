export function ScrambleText({ text, className = "" }: { text: string; className?: string }) {
  return <span className={`font-heading tracking-widest uppercase inline-block ${className}`}>{text}</span>;
}
