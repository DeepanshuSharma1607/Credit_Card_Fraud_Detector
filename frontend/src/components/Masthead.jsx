import { NavLink } from 'react-router-dom'

const todayEdition = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}).format(new Date())

const navLinkClasses = ({ isActive }) =>
  [
    'px-4 py-3 text-xs font-sans uppercase tracking-widest transition-colors duration-200',
    isActive
      ? 'bg-foreground text-background'
      : 'text-foreground hover:bg-neutral-100',
  ].join(' ')

export default function Masthead() {
  return (
    <header className="sticky top-0 z-40 border-b-4 border-foreground bg-background">
      <div className="mx-auto max-w-screen-xl px-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-foreground py-2 font-mono text-[11px] uppercase tracking-widest text-neutral-600">
          <span>Vol. 1 &middot; No. 001</span>
          <span>{todayEdition}</span>
          <span>Risk &amp; Ledger Edition</span>
        </div>

        <div className="flex flex-col items-center gap-1 py-6 text-center">
          <span className="font-sans text-xs uppercase tracking-[0.35em] text-accent">
            Real-Time Detection Desk
          </span>
          <h1 className="font-serif text-5xl font-black leading-[0.9] tracking-tighter sm:text-6xl lg:text-7xl">
            The Fraud Gazette
          </h1>
          <p className="max-w-xl font-body text-sm italic text-neutral-600">
            Every transaction, scrutinized. Filed against a model trained on
            millions of prior cases.
          </p>
        </div>

        <nav className="flex border-t border-foreground">
          <NavLink to="/" end className={navLinkClasses}>
            File New Case
          </NavLink>
          <NavLink to="/ledger" className={navLinkClasses}>
            The Ledger
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
