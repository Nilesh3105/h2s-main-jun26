import './HelpResources.css'

import { HELPLINES } from '../content/helplines'

export interface HelpResourcesProps {
  heading?: string
}

/**
 * A calm, validating panel of verified India crisis helplines.
 * Tone follows safe-messaging guidance: warm and non-clinical, never alarming,
 * and never describing methods. Numbers come from HELPLINES — never hardcoded.
 */
export function HelpResources({ heading = 'Need to talk to someone now?' }: HelpResourcesProps) {
  return (
    <section className="help-resources" aria-labelledby="help-heading">
      <h2 id="help-heading" className="help-resources__heading">
        {heading}
      </h2>
      <p className="help-resources__intro">
        You don&rsquo;t have to carry this on your own. Reaching out is a strong, caring thing to do
        for yourself. The lines below are free and confidential, and you don&rsquo;t need to sign up
        or explain anything in advance &mdash; a kind person is ready to listen whenever
        you&rsquo;re ready to talk.
      </p>
      <ul className="help-resources__list">
        {HELPLINES.map((helpline) => (
          <li key={helpline.tel} className="help-resources__item">
            <span className="help-resources__name">{helpline.name}</span>
            <a className="help-resources__call" href={`tel:${helpline.tel}`}>
              {helpline.number}
            </a>
            <span className="help-resources__detail">{helpline.detail}</span>
          </li>
        ))}
      </ul>
      <p className="help-resources__emergency">
        If you&rsquo;re in immediate danger, please call the all-India emergency number{' '}
        <a className="help-resources__call help-resources__call--inline" href="tel:112">
          112
        </a>{' '}
        right away.
      </p>
    </section>
  )
}
