function slug(value: string) { return value.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-"); }
export function ArticleBody({ content }: { content: string | null | undefined }) {
  if (!content?.trim()) return null;
  const blocks = content.trim().split(/\n{2,}/);
  return <div className="article-body">{blocks.map((block, index) => {
    const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
    if (lines.every((line) => /^[-*]\s+/.test(line))) return <ul key={index}>{lines.map((line) => <li key={line}>{line.replace(/^[-*]\s+/, "")}</li>)}</ul>;
    if (lines.every((line) => /^\d+\.\s+/.test(line))) return <ol key={index}>{lines.map((line) => <li key={line}>{line.replace(/^\d+\.\s+/, "")}</li>)}</ol>;
    if (lines.length === 1 && /^#{2,4}\s+/.test(lines[0])) { const text = lines[0].replace(/^#{2,4}\s+/, ""); return <h2 id={slug(text)} key={index}>{text}</h2>; }
    return <p key={index}>{lines.join(" ")}</p>;
  })}</div>;
}
