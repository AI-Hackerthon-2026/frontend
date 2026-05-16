import type { ReactNode } from 'react'
import { resolveApiAssetUrl } from '../services/api'

interface MarkdownRenderOptions {
  blockquoteClassName?: string
  codeBlockClassName?: string
  codeClassName?: string
  heading1ClassName?: string
  heading2ClassName?: string
  heading3ClassName?: string
  heading4ClassName?: string
  heading5ClassName?: string
  heading6ClassName?: string
  hrClassName?: string
  imageClassName?: string
  listClassName?: string
  listItemClassName?: string
  paragraphClassName?: string
  spacerClassName?: string
  tableCellClassName?: string
  tableClassName?: string
  tableHeaderCellClassName?: string
  tableWrapperClassName?: string
}

const defaultOptions: Required<MarkdownRenderOptions> = {
  blockquoteClassName:
    'mb-[10px] border-l-4 border-[#c9d9ee] bg-[#f7fbff] py-[8px] pl-[12px] text-[13px] leading-[22px] text-[#5c6a84]',
  codeBlockClassName:
    'my-[14px] overflow-x-auto rounded-[10px] border border-[#d4e1f2] bg-[#102047] p-[14px] font-mono text-[12px] leading-[20px] text-[#edf4fd]',
  codeClassName:
    'rounded-[4px] bg-[#edf4fd] px-[5px] py-[2px] font-mono text-[12px] text-[#2e569d]',
  heading1ClassName: 'mb-[12px] mt-[2px] text-[20px] font-bold text-[#121a34]',
  heading2ClassName: 'mb-[8px] mt-[18px] text-[16px] font-bold text-[#102047]',
  heading3ClassName: 'mb-[6px] mt-[14px] text-[14px] font-bold text-[#102047]',
  heading4ClassName: 'mb-[6px] mt-[12px] text-[13px] font-bold text-[#102047]',
  heading5ClassName: 'mb-[6px] mt-[10px] text-[12px] font-bold text-[#102047]',
  heading6ClassName: 'mb-[6px] mt-[10px] text-[12px] font-semibold text-[#304f9a]',
  hrClassName: 'my-[18px] h-px border-0 bg-[#dde7f3]',
  imageClassName: 'my-[14px] max-h-[240px] w-full rounded-[10px] object-contain',
  listClassName: 'mb-[10px] space-y-[5px] pl-[18px] text-[#5c6a84]',
  listItemClassName: 'text-[13px] leading-[22px]',
  paragraphClassName: 'mb-[8px] text-[13px] leading-[22px] text-[#5c6a84]',
  spacerClassName: 'h-[8px]',
  tableCellClassName:
    'border border-[#d4e1f2] px-[12px] py-[9px] text-left align-top text-[13px] leading-[21px] text-[#5c6a84]',
  tableClassName: 'w-full border-collapse',
  tableHeaderCellClassName:
    'border border-[#c9d9ee] bg-[#edf4fd] px-[12px] py-[9px] text-left align-top text-[13px] font-bold leading-[21px] text-[#102047]',
  tableWrapperClassName: 'my-[14px] overflow-x-auto rounded-[10px] border border-[#d4e1f2]',
}

export function renderMarkdown(
  markdown: string,
  options: MarkdownRenderOptions = {},
) {
  const mergedOptions = { ...defaultOptions, ...options }
  const lines = markdown.split('\n')
  const nodes: ReactNode[] = []
  let index = 0

  while (index < lines.length) {
    const line = lines[index]
    const trimmedLine = line.trim()

    const codeFenceMatch = trimmedLine.match(/^(```|~~~)\s*([\w-]+)?\s*$/)
    if (codeFenceMatch) {
      const fence = codeFenceMatch[1]
      const language = codeFenceMatch[2]
      const codeLines: string[] = []
      const startIndex = index
      index += 1

      while (index < lines.length && !lines[index].trim().startsWith(fence)) {
        codeLines.push(lines[index])
        index += 1
      }

      if (index < lines.length) {
        index += 1
      }

      nodes.push(
        <pre className={mergedOptions.codeBlockClassName} key={`code-${startIndex}`}>
          {language && (
            <span className="mb-[8px] block text-[11px] font-semibold uppercase tracking-[0.04em] text-[#9fb8e8]">
              {language}
            </span>
          )}
          <code>{codeLines.join('\n')}</code>
        </pre>,
      )
      continue
    }

    if (!trimmedLine) {
      nodes.push(<div className={mergedOptions.spacerClassName} key={`empty-${index}`} />)
      index += 1
      continue
    }

    if (isTableStart(lines, index)) {
      const startIndex = index
      const headers = parseTableRow(lines[index])
      const alignments = parseTableRow(lines[index + 1]).map((cell) => {
        if (/^:-+:$/.test(cell)) {
          return 'center'
        }

        if (/^-+:$/.test(cell)) {
          return 'right'
        }

        return 'left'
      })
      const rows: string[][] = []
      index += 2

      while (index < lines.length && lines[index].includes('|') && lines[index].trim()) {
        rows.push(parseTableRow(lines[index]))
        index += 1
      }

      nodes.push(
        <div className={mergedOptions.tableWrapperClassName} key={`table-${startIndex}`}>
          <table className={mergedOptions.tableClassName}>
            <thead>
              <tr>
                {headers.map((header, cellIndex) => (
                  <th
                    className={mergedOptions.tableHeaderCellClassName}
                    key={`table-head-${startIndex}-${cellIndex}`}
                    style={{ textAlign: alignments[cellIndex] as 'center' | 'left' | 'right' }}
                  >
                    {renderInline(header, mergedOptions)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={`table-row-${startIndex}-${rowIndex}`}>
                  {headers.map((_, cellIndex) => (
                    <td
                      className={mergedOptions.tableCellClassName}
                      key={`table-cell-${startIndex}-${rowIndex}-${cellIndex}`}
                      style={{ textAlign: alignments[cellIndex] as 'center' | 'left' | 'right' }}
                    >
                      {renderInline(row[cellIndex] ?? '', mergedOptions)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      )
      continue
    }

    const imageMatch = trimmedLine.match(/^!\[(.*?)]\((.*?)\)$/)
    if (imageMatch) {
      nodes.push(
        <figure className="my-[14px]" key={`image-${index}`}>
          <img
            alt={imageMatch[1]}
            className={mergedOptions.imageClassName}
            src={resolveApiAssetUrl(imageMatch[2])}
          />
        </figure>,
      )
      index += 1
      continue
    }

    const headingMatch = trimmedLine.match(/^(#{1,6})\s+(.+)$/)
    if (headingMatch) {
      const level = headingMatch[1].length
      const headingClassName = getHeadingClassName(level, mergedOptions)

      nodes.push(
        <div className={headingClassName} key={`h-${index}`}>
          {renderInline(headingMatch[2], mergedOptions)}
        </div>,
      )
      index += 1
      continue
    }

    if (trimmedLine === '---' || trimmedLine === '***' || trimmedLine === '___') {
      nodes.push(<hr className={mergedOptions.hrClassName} key={`hr-${index}`} />)
      index += 1
      continue
    }

    if (trimmedLine.startsWith('> ')) {
      const blockquoteLines: string[] = []
      const startIndex = index

      while (index < lines.length && lines[index].trim().startsWith('> ')) {
        blockquoteLines.push(lines[index].trim().slice(2))
        index += 1
      }

      nodes.push(
        <blockquote className={mergedOptions.blockquoteClassName} key={`quote-${startIndex}`}>
          {renderInline(blockquoteLines.join(' '), mergedOptions)}
        </blockquote>,
      )
      continue
    }

    if (/^[-*+] /.test(trimmedLine)) {
      const listItems: ReactNode[] = []
      const startIndex = index

      while (index < lines.length && /^[-*+] /.test(lines[index].trim())) {
        const itemText = lines[index].trim().slice(2)
        const taskMatch = itemText.match(/^\[( |x|X)]\s+(.+)$/)

        listItems.push(
          <li className={mergedOptions.listItemClassName} key={`ul-item-${index}`}>
            {taskMatch ? (
              <label className="inline-flex items-start gap-[8px]">
                <input
                  checked={taskMatch[1].toLowerCase() === 'x'}
                  className="mt-[4px]"
                  readOnly
                  type="checkbox"
                />
                <span>{renderInline(taskMatch[2], mergedOptions)}</span>
              </label>
            ) : (
              renderInline(itemText, mergedOptions)
            )}
          </li>,
        )
        index += 1
      }

      nodes.push(
        <ul className={`${mergedOptions.listClassName} list-disc`} key={`ul-${startIndex}`}>
          {listItems}
        </ul>,
      )
      continue
    }

    if (/^\d+\. /.test(trimmedLine)) {
      const listItems: ReactNode[] = []
      const startIndex = index

      while (index < lines.length && /^\d+\. /.test(lines[index].trim())) {
        listItems.push(
          <li className={mergedOptions.listItemClassName} key={`ol-item-${index}`}>
            {renderInline(lines[index].trim().replace(/^\d+\. /, ''), mergedOptions)}
          </li>,
        )
        index += 1
      }

      nodes.push(
        <ol className={`${mergedOptions.listClassName} list-decimal`} key={`ol-${startIndex}`}>
          {listItems}
        </ol>,
      )
      continue
    }

    const paragraphLines = [line]
    const startIndex = index
    index += 1

    while (
      index < lines.length &&
      lines[index].trim() &&
      !isBlockStart(lines, index)
    ) {
      paragraphLines.push(lines[index])
      index += 1
    }

    nodes.push(
      <p className={mergedOptions.paragraphClassName} key={`p-${startIndex}`}>
        {renderInline(paragraphLines.join(' '), mergedOptions)}
      </p>,
    )
  }

  return nodes
}

function renderInline(text: string, options: Required<MarkdownRenderOptions>) {
  const tokens = text.split(
    /(!\[.*?]\(.*?\)|\*\*.+?\*\*|__.+?__|~~.+?~~|`.+?`|\[.+?]\(.+?\)|<https?:\/\/[^>]+>|\*[^*]+?\*|_[^_]+?_)/g,
  )

  return tokens.map((token, index) => {
    if (!token) {
      return null
    }

    if (token.startsWith('**') && token.endsWith('**')) {
      return <strong key={`${token}-${index}`}>{token.slice(2, -2)}</strong>
    }

    if (token.startsWith('__') && token.endsWith('__')) {
      return <strong key={`${token}-${index}`}>{token.slice(2, -2)}</strong>
    }

    if (token.startsWith('~~') && token.endsWith('~~')) {
      return <del key={`${token}-${index}`}>{token.slice(2, -2)}</del>
    }

    if (token.startsWith('`') && token.endsWith('`')) {
      return (
        <code className={options.codeClassName} key={`${token}-${index}`}>
          {token.slice(1, -1)}
        </code>
      )
    }

    const imageMatch = token.match(/^!\[(.*?)]\((.*?)\)$/)
    if (imageMatch) {
      return (
        <img
          alt={imageMatch[1]}
          className="mx-[4px] inline-block max-h-[120px] max-w-full rounded-[8px] align-middle"
          key={`${token}-${index}`}
          src={resolveApiAssetUrl(imageMatch[2])}
        />
      )
    }

    const linkMatch = token.match(/^\[(.+?)]\((.+?)\)$/)
    if (linkMatch) {
      return (
        <a
          className="font-semibold text-[#2e569d] underline underline-offset-2"
          href={linkMatch[2]}
          key={`${token}-${index}`}
          rel="noreferrer"
          target="_blank"
        >
          {linkMatch[1]}
        </a>
      )
    }

    const autoLinkMatch = token.match(/^<(https?:\/\/[^>]+)>$/)
    if (autoLinkMatch) {
      return (
        <a
          className="font-semibold text-[#2e569d] underline underline-offset-2"
          href={autoLinkMatch[1]}
          key={`${token}-${index}`}
          rel="noreferrer"
          target="_blank"
        >
          {autoLinkMatch[1]}
        </a>
      )
    }

    if (token.startsWith('*') && token.endsWith('*')) {
      return <em key={`${token}-${index}`}>{token.slice(1, -1)}</em>
    }

    if (token.startsWith('_') && token.endsWith('_')) {
      return <em key={`${token}-${index}`}>{token.slice(1, -1)}</em>
    }

    return token
  })
}

function getHeadingClassName(
  level: number,
  options: Required<MarkdownRenderOptions>,
) {
  if (level === 1) {
    return options.heading1ClassName
  }

  if (level === 2) {
    return options.heading2ClassName
  }

  if (level === 3) {
    return options.heading3ClassName
  }

  if (level === 4) {
    return options.heading4ClassName
  }

  if (level === 5) {
    return options.heading5ClassName
  }

  return options.heading6ClassName
}

function isBlockStart(lines: string[], index: number) {
  const trimmedLine = lines[index].trim()

  return (
    /^(```|~~~)/.test(trimmedLine) ||
    /^#{1,6}\s+/.test(trimmedLine) ||
    /^!\[(.*?)]\((.*?)\)$/.test(trimmedLine) ||
    trimmedLine === '---' ||
    trimmedLine === '***' ||
    trimmedLine === '___' ||
    trimmedLine.startsWith('> ') ||
    /^[-*+] /.test(trimmedLine) ||
    /^\d+\. /.test(trimmedLine) ||
    isTableStart(lines, index)
  )
}

function isTableStart(lines: string[], index: number) {
  if (index + 1 >= lines.length) {
    return false
  }

  const headerLine = lines[index].trim()
  const separatorLine = lines[index + 1].trim()

  return (
    headerLine.includes('|') &&
    /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(separatorLine)
  )
}

function parseTableRow(row: string) {
  const trimmedRow = row.trim().replace(/^\|/, '').replace(/\|$/, '')

  return trimmedRow.split('|').map((cell) => cell.trim())
}
