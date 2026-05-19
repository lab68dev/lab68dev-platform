import type { ReactNode } from "react"

type RichTextBlock =
  | { type: "code"; language: string; content: string }
  | { type: "heading"; level: 1 | 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "quote"; text: string }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "rule" }

function isListLine(line: string) {
  return /^\s*[-*]\s+/.test(line) || /^\s*\d+\.\s+/.test(line)
}

function isHeadingLine(line: string) {
  return /^#{1,3}\s+/.test(line)
}

function isRuleLine(line: string) {
  return /^\s*(-{3,}|_{3,}|\*{3,})\s*$/.test(line)
}

function isTableSeparator(line: string) {
  return /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line)
}

function splitTableRow(line: string) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim())
}

function parseBlocks(content: string): RichTextBlock[] {
  const lines = content.replace(/\r\n/g, "\n").split("\n")
  const blocks: RichTextBlock[] = []
  let index = 0

  while (index < lines.length) {
    const line = lines[index]

    if (!line.trim()) {
      index += 1
      continue
    }

    if (line.trimStart().startsWith("```")) {
      const language = line.trim().slice(3).trim()
      const codeLines: string[] = []
      index += 1

      while (index < lines.length && !lines[index].trimStart().startsWith("```")) {
        codeLines.push(lines[index])
        index += 1
      }

      if (index < lines.length) index += 1
      blocks.push({ type: "code", language, content: codeLines.join("\n") })
      continue
    }

    if (index + 1 < lines.length && line.includes("|") && isTableSeparator(lines[index + 1])) {
      const headers = splitTableRow(line)
      const rows: string[][] = []
      index += 2

      while (index < lines.length && lines[index].includes("|") && lines[index].trim()) {
        rows.push(splitTableRow(lines[index]))
        index += 1
      }

      blocks.push({ type: "table", headers, rows })
      continue
    }

    if (isHeadingLine(line)) {
      const marker = line.match(/^#{1,3}/)?.[0] || "#"
      blocks.push({
        type: "heading",
        level: Math.min(marker.length, 3) as 1 | 2 | 3,
        text: line.replace(/^#{1,3}\s+/, "").trim(),
      })
      index += 1
      continue
    }

    if (isRuleLine(line)) {
      blocks.push({ type: "rule" })
      index += 1
      continue
    }

    if (/^\s*>\s?/.test(line)) {
      const quoteLines: string[] = []

      while (index < lines.length && /^\s*>\s?/.test(lines[index])) {
        quoteLines.push(lines[index].replace(/^\s*>\s?/, ""))
        index += 1
      }

      blocks.push({ type: "quote", text: quoteLines.join("\n") })
      continue
    }

    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = []

      while (index < lines.length && /^\s*[-*]\s+/.test(lines[index])) {
        items.push(lines[index].replace(/^\s*[-*]\s+/, "").trim())
        index += 1
      }

      blocks.push({ type: "ul", items })
      continue
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = []

      while (index < lines.length && /^\s*\d+\.\s+/.test(lines[index])) {
        items.push(lines[index].replace(/^\s*\d+\.\s+/, "").trim())
        index += 1
      }

      blocks.push({ type: "ol", items })
      continue
    }

    const paragraphLines: string[] = []

    while (
      index < lines.length &&
      lines[index].trim() &&
      !lines[index].trimStart().startsWith("```") &&
      !isHeadingLine(lines[index]) &&
      !isRuleLine(lines[index]) &&
      !isListLine(lines[index]) &&
      !/^\s*>\s?/.test(lines[index])
    ) {
      paragraphLines.push(lines[index])
      index += 1
    }

    blocks.push({ type: "paragraph", text: paragraphLines.join("\n") })
  }

  return blocks
}

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = []
  const pattern = /(\[[^\]]+\]\(https?:\/\/[^\s)]+\)|`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index))
    }

    const token = match[0]
    const key = `${keyPrefix}-${match.index}`

    if (token.startsWith("[") && token.includes("](")) {
      const label = token.slice(1, token.indexOf("]("))
      const href = token.slice(token.indexOf("](") + 2, -1)

      nodes.push(
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary"
        >
          {renderInline(label, `${key}-link`)}
        </a>,
      )
    } else if (token.startsWith("`")) {
      nodes.push(
        <code key={key} className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[0.85em] text-primary">
          {token.slice(1, -1)}
        </code>,
      )
    } else if (token.startsWith("**")) {
      nodes.push(
        <strong key={key} className="font-semibold text-foreground">
          {renderInline(token.slice(2, -2), `${key}-strong`)}
        </strong>,
      )
    } else if (token.startsWith("*")) {
      nodes.push(
        <em key={key} className="text-foreground/90">
          {renderInline(token.slice(1, -1), `${key}-em`)}
        </em>,
      )
    }

    lastIndex = pattern.lastIndex
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex))
  }

  return nodes
}

export function RichTextMessage({ content }: { content: string }) {
  const blocks = parseBlocks(content)

  return (
    <div className="space-y-3 text-sm leading-7 text-foreground/90">
      {blocks.map((block, index) => {
        const key = `block-${index}`

        if (block.type === "code") {
          return (
            <div key={key} className="overflow-hidden rounded-lg border border-white/10 bg-black/40">
              {block.language ? (
                <div className="border-b border-white/10 px-3 py-1.5 font-mono text-[11px] uppercase text-zinc-500">
                  {block.language}
                </div>
              ) : null}
              <pre className="overflow-x-auto p-3 text-xs leading-6">
                <code>{block.content}</code>
              </pre>
            </div>
          )
        }

        if (block.type === "heading") {
          const headingClass = "font-semibold tracking-normal text-foreground"
          if (block.level === 1) {
            return (
              <h2 key={key} className={`${headingClass} text-lg`}>
                {renderInline(block.text, key)}
              </h2>
            )
          }
          if (block.level === 2) {
            return (
              <h3 key={key} className={`${headingClass} text-base`}>
                {renderInline(block.text, key)}
              </h3>
            )
          }
          return (
            <h4 key={key} className={`${headingClass} text-sm`}>
              {renderInline(block.text, key)}
            </h4>
          )
        }

        if (block.type === "ul") {
          return (
            <ul key={key} className="ml-4 list-disc space-y-1">
              {block.items.map((item, itemIndex) => (
                <li key={`${key}-${itemIndex}`}>{renderInline(item, `${key}-${itemIndex}`)}</li>
              ))}
            </ul>
          )
        }

        if (block.type === "ol") {
          return (
            <ol key={key} className="ml-4 list-decimal space-y-1">
              {block.items.map((item, itemIndex) => (
                <li key={`${key}-${itemIndex}`}>{renderInline(item, `${key}-${itemIndex}`)}</li>
              ))}
            </ol>
          )
        }

        if (block.type === "quote") {
          return (
            <blockquote key={key} className="border-l-2 border-primary/50 pl-3 text-muted-foreground">
              {renderInline(block.text, key)}
            </blockquote>
          )
        }

        if (block.type === "table") {
          return (
            <div key={key} className="overflow-x-auto rounded-lg border border-white/10">
              <table className="w-full min-w-max text-left text-xs">
                <thead className="bg-white/[0.04] text-zinc-300">
                  <tr>
                    {block.headers.map((header, headerIndex) => (
                      <th key={`${key}-head-${headerIndex}`} className="border-b border-white/10 px-3 py-2 font-semibold">
                        {renderInline(header, `${key}-head-${headerIndex}`)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, rowIndex) => (
                    <tr key={`${key}-row-${rowIndex}`} className="border-b border-white/5 last:border-b-0">
                      {row.map((cell, cellIndex) => (
                        <td key={`${key}-cell-${rowIndex}-${cellIndex}`} className="px-3 py-2 text-zinc-300">
                          {renderInline(cell, `${key}-cell-${rowIndex}-${cellIndex}`)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }

        if (block.type === "rule") {
          return <hr key={key} className="border-white/10" />
        }

        return (
          <p key={key} className="whitespace-pre-wrap break-words">
            {renderInline(block.text, key)}
          </p>
        )
      })}
    </div>
  )
}
