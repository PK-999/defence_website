import Link from "next/link";
export function Pagination({ page, pageCount, params }: { page: number; pageCount: number; params: URLSearchParams }) {
  if (pageCount <= 1) return null;
  const link = (next: number) => { const copy = new URLSearchParams(params.toString()); copy.set("page", String(next)); return `?${copy.toString()}`; };
  return <nav aria-label="Pagination" className="flex items-center justify-between border-t border-border pt-4 text-sm"><span>Page {page} of {pageCount}</span><div className="flex gap-2">{page > 1 && <Link className="rounded border px-3 py-1" href={link(page - 1)}>Previous</Link>}{page < pageCount && <Link className="rounded border px-3 py-1" href={link(page + 1)}>Next</Link>}</div></nav>;
}
