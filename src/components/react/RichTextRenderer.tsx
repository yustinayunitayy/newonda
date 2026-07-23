import React from 'react'
import { img as cdnimg } from '../../lib/image'

interface RichTextRendererProps {
  content: any
  className?: string
}

const IS_BOLD = 1
const IS_ITALIC = 2
const IS_STRIKETHROUGH = 4
const IS_UNDERLINE = 8
const IS_CODE = 16
const IS_SUBSCRIPT = 32
const IS_SUPERSCRIPT = 64

export function RichTextRenderer({ content, className = '' }: RichTextRendererProps) {
  if (!content) return null

  const contentArray =
    content?.root?.children || content?.children || (Array.isArray(content) ? content : [])

  if (!Array.isArray(contentArray)) return null

  const renderText = (node: any, key: number): React.ReactNode => {
    if (node.text === undefined) return null

    let text: React.ReactNode = node.text
    const format = node.format || 0

    if ((format & IS_CODE) !== 0)
      text = <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm">{text}</code>
    if ((format & IS_SUBSCRIPT) !== 0) text = <sub>{text}</sub>
    if ((format & IS_SUPERSCRIPT) !== 0) text = <sup>{text}</sup>
    if ((format & IS_STRIKETHROUGH) !== 0) text = <s>{text}</s>
    if ((format & IS_UNDERLINE) !== 0) text = <u>{text}</u>
    if ((format & IS_ITALIC) !== 0) text = <em>{text}</em>
    if ((format & IS_BOLD) !== 0) text = <strong>{text}</strong>

    return <React.Fragment key={key}>{text}</React.Fragment>
  }

  const renderNode = (node: any, key: number): React.ReactNode => {
    if (!node) return null
    if (node.text !== undefined) return renderText(node, key)

    switch (node.type) {
      case 'heading': {
        const level = node.tag ? parseInt(node.tag.replace('h', '')) : 2
        const cls: Record<number, string> = {
          1: 'font-bold text-2xl text-onda-blue mt-6 mb-4',
          2: 'font-bold text-xl text-onda-blue mt-6 mb-4',
          3: 'font-semibold text-lg text-onda-blue mt-5 mb-3',
        }
        const children = node.children?.map(renderNode)
        return React.createElement(`h${level}`, { key, className: cls[level] ?? cls[2] }, children)
      }

      case 'paragraph':
        return (
          <p key={key} className="text-dark-blue-shade text-body mb-4 leading-relaxed">
            {node.children?.map(renderNode)}
          </p>
        )

      case 'list': {
        const Tag = node.listType === 'number' ? 'ol' : 'ul'
        const listCls =
          node.listType === 'number'
            ? 'list-decimal'
            : node.listType === 'check'
              ? 'list-none'
              : 'list-disc'
        return (
          <Tag key={key} className={`${listCls} mb-4 ml-6 list-outside space-y-2`}>
            {node.children?.map(renderNode)}
          </Tag>
        )
      }

      case 'listitem':
        return (
          <li key={key} className="leading-relaxed text-gray-600">
            {node.checked !== undefined && (
              <input
                type="checkbox"
                checked={node.checked}
                readOnly
                className="mr-2 align-middle"
              />
            )}
            {node.children?.map((child: any, i: number) =>
              child.type === 'paragraph' ? child.children?.map(renderNode) : renderNode(child, i)
            )}
          </li>
        )

      case 'link':
      case 'autolink': {
        const href = node.fields?.url || node.url || node.fields?.doc?.value?.slug || '#'
        const newTab = node.fields?.newTab !== false
        return (
          <a
            key={key}
            href={href}
            target={newTab ? '_blank' : '_self'}
            rel={newTab ? 'noopener noreferrer' : undefined}
            className="text-onda-blue underline transition-opacity hover:opacity-75"
          >
            {node.children?.map(renderNode)}
          </a>
        )
      }

      case 'upload': {
        const img = node.value
        if (!img) return null
        return (
          <div key={key} className="my-6">
            <img
              src={cdnimg(img.url, 1200)}
              alt={img.alt || img.filename || ''}
              className="h-auto w-full rounded-lg"
              loading="lazy" // ➕
            />
            {img.caption && (
              <p className="mt-2 text-center text-sm text-gray-400 italic">{img.caption}</p>
            )}
          </div>
        )
      }

      case 'quote':
        return (
          <blockquote
            key={key}
            className="border-onda-blue my-4 border-l-4 pl-4 text-gray-500 italic"
          >
            {node.children?.map(renderNode)}
          </blockquote>
        )

      case 'code':
        return (
          <pre
            key={key}
            className="mb-4 overflow-x-auto rounded-lg bg-gray-100 p-4 font-mono text-sm"
          >
            <code>{node.children?.map((c: any) => c.text).join('')}</code>
          </pre>
        )

      case 'horizontalrule':
        return <hr key={key} className="my-8 border-gray-200" />

      default:
        return node.children?.map(renderNode) ?? null
    }
  }

  return <div className={`max-w-none ${className}`}>{contentArray.map(renderNode)}</div>
}
