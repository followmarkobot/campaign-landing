'use client'
import './globals.css'
import { useState } from 'react'

export default function Home() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState(null) // 'success' | 'error'
  const [msg, setMsg] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim()) return
    setSubmitting(true)
    setStatus(null)
    setMsg('')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() })
      })
      const data = await res.json()
      if (res.ok) {
        setStatus('success')
        setMsg("You're in. First issue coming to your inbox.")
        setEmail('')
      } else {
        setStatus('error')
        setMsg(data.error || 'Something went wrong. Try again.')
      }
    } catch {
      setStatus('error')
      setMsg('Something went wrong. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <section className="hero">
        <h1 className="headline">CAMPAIGN<br/>WITH <span>AI</span></h1>
        <p className="subhead">One tactic. Every week. Win in 2026. A newsletter for campaigns ready to use AI before their opponents figure it out.</p>
        <a href="#subscribe" className="cta-button">Subscribe Free →</a>
      </section>

      <section className="history">
        <div className="history-inner">
          <div className="history-item">
            <div className="year">2008</div>
            <div className="history-text">Obama won by being <strong>first to Facebook ads</strong>.</div>
          </div>
          <div className="history-item">
            <div className="year">2016</div>
            <div className="history-text">Trump won by being <strong>first to Twitter</strong>.</div>
          </div>
          <div className="history-item future">
            <div className="year">2026</div>
            <div className="history-text">Races will be won by whoever <strong>uses AI best</strong>. Not AI that writes generic slop—campaigns that learned how to make it sound like their candidate, know their voters, and have it running while they sleep.</div>
          </div>
        </div>
      </section>

      <section className="checklist">
        <div className="checklist-inner">
          <h2 className="section-title">Are you doing all of these?</h2>
          {[
            'Recording everything (meetings, events, calls)',
            'Transcribing automatically (Otter, Granola, Riverside)',
            'Storing transcripts in one folder—your campaign brain',
            'Using Vizard to turn long videos into social clips',
            'Assigning one person to own AI (volunteer or part-time)',
            'Training your team on the tools',
          ].map((text, i) => (
            <div className="check-item" key={i}>
              <div className="check-box"></div>
              <div className="check-text">{text}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="question">
        <p className="question-text">Everyone has the same 24 hours. One campaign will use them differently. Is that you?</p>
      </section>

      <section className="newsletter" id="subscribe">
        <div className="newsletter-inner">
          <h2 className="newsletter-title">Get the edge. Every week.</h2>
          <p className="newsletter-desc">One AI tactic for campaigns. Practical. Specific. Ready to use Monday morning.</p>
          <form className="email-form" onSubmit={handleSubmit}>
            <input
              type="email"
              className="email-input"
              placeholder="Your email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <button type="submit" className="submit-button" disabled={submitting}>
              {submitting ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
          {msg && <p className={`form-message ${status}`}>{msg}</p>}
        </div>
      </section>

      <footer>Campaign with AI</footer>
    </>
  )
}
