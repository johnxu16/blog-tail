export interface LexicalProps {
  state: unknown
}

export default function Lexical({ state }: LexicalProps) {
  if (!state || typeof state !== 'object') {
    return null
  }

  const root = state as { root?: { children?: unknown[] } }
  const blocks = Array.isArray(root.root?.children) ? root.root!.children! : []

  return (
    <div>
      {blocks.map((node, i) => (
        <LexicalNode key={i} node={node} />
      ))}
    </div>
  )
}

function LexicalNode({ node }: { node: unknown }) {
  if (!node || typeof node !== 'object') return null
  const n = node as { type?: string; tag?: string; text?: string; children?: unknown[] }
  const children = Array.isArray(n.children) ? n.children : []

  if (n.type === 'text') {
    return <span>{n.text ?? ''}</span>
  }

  const inner = children.map((c, i) => <LexicalNode key={i} node={c} />)

  switch (n.tag) {
    case 'h1':
      return <h1>{inner}</h1>
    case 'h2':
      return <h2>{inner}</h2>
    case 'h3':
      return <h3>{inner}</h3>
    case 'h4':
      return <h4>{inner}</h4>
    case 'h5':
      return <h5>{inner}</h5>
    case 'h6':
      return <h6>{inner}</h6>
    case 'p':
      return <p>{inner}</p>
    case 'ul':
      return <ul>{inner}</ul>
    case 'ol':
      return <ol>{inner}</ol>
    case 'li':
      return <li>{inner}</li>
    case 'blockquote':
      return <blockquote>{inner}</blockquote>
    case 'pre':
      return <pre>{inner}</pre>
    case 'code':
      return <code>{inner}</code>
    case 'a':
      return (
        <a href={(n as unknown as { url?: string }).url ?? '#'} rel="noopener noreferrer">
          {inner}
        </a>
      )
    case 'hr':
      return <hr />
    default:
      return <div>{inner}</div>
  }
}
