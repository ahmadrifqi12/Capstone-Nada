/** React 19 hoists <title> and <meta> to <head>. Each page renders its own (CLAUDE.md §6). */
export default function Meta({ title, description }: { title: string; description?: string }) {
  return (
    <>
      <title>{title === "NADA" ? "NADA — Busana Muslimah" : `${title} — NADA`}</title>
      {description && <meta name="description" content={description} />}
    </>
  );
}
