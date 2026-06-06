import './ResearchDocPage.css'

import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Link, useParams } from 'react-router-dom'
import remarkGfm from 'remark-gfm'

import { RESEARCH_GITHUB_BASE, findResearchDoc } from '../content/research'

type LoadState = 'loading' | 'ready' | 'error'

/** Renders one research note (markdown from /public/research) as an in-app page. */
export function ResearchDocPage() {
  const { slug } = useParams<{ slug: string }>()
  const doc = slug ? findResearchDoc(slug) : undefined
  const [content, setContent] = useState('')
  const [state, setState] = useState<LoadState>('loading')

  useEffect(() => {
    if (!doc) {
      return
    }
    // `state` starts at 'loading'; we only flip it in the async callbacks below
    // (never synchronously here) so this stays a data-load, not a render cascade.
    let active = true
    fetch(`/research/${doc.file}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`status ${res.status}`)
        }
        return res.text()
      })
      .then((text) => {
        if (active) {
          setContent(text)
          setState('ready')
        }
      })
      .catch(() => {
        if (active) {
          setState('error')
        }
      })
    return () => {
      active = false
    }
  }, [doc])

  if (!doc) {
    return (
      <div className="research-doc">
        <p className="research-doc__back">
          <Link to="/approach/research">&larr; All research</Link>
        </p>
        <h2>That research note doesn&rsquo;t exist</h2>
        <p>It may have moved — browse the full list instead.</p>
      </div>
    )
  }

  const githubUrl = `${RESEARCH_GITHUB_BASE}${doc.file}`

  return (
    <div className="research-doc">
      <p className="research-doc__back">
        <Link to="/approach/research">&larr; All research</Link>
      </p>

      {state === 'loading' && <p>Loading the note&hellip;</p>}

      {state === 'error' && (
        <p role="alert" className="form-error">
          Couldn&rsquo;t load this note here. You can read it on{' '}
          <a href={githubUrl} target="_blank" rel="noreferrer">
            GitHub
          </a>
          .
        </p>
      )}

      {state === 'ready' && (
        <>
          <article className="markdown-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </article>
          <p className="research-doc__source">
            Source:{' '}
            <a href={githubUrl} target="_blank" rel="noreferrer">
              research/{doc.file} on GitHub
            </a>
          </p>
        </>
      )}
    </div>
  )
}
