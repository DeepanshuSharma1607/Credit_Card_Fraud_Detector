import { formatCurrency, formatDate, formatDateTime, formatPercent } from '../utils/format'
import { CATEGORY_OPTIONS } from '../data/options'

function categoryLabel(value) {
  return CATEGORY_OPTIONS.find((c) => c.value === value)?.label || value
}

export default function VerdictCard({ result, onDismiss }) {
  const { is_fraud, fraud_probability, uid } = result

  return (
    <div
      className={`sharp-corners border-4 p-6 lg:p-8 ${
        is_fraud ? 'border-accent bg-background' : 'border-foreground bg-background'
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-foreground pb-4">
        <div>
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-neutral-500">
            Case Filed &middot; {uid.slice(0, 8)}
          </span>
          <h2
            className={`mt-1 font-serif text-4xl font-black leading-none tracking-tight lg:text-5xl ${
              is_fraud ? 'text-accent' : 'text-foreground'
            }`}
          >
            {is_fraud ? 'Fraud Flagged' : 'Transaction Cleared'}
          </h2>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="border border-foreground px-3 py-2 font-sans text-xs uppercase tracking-widest hover:bg-foreground hover:text-background"
        >
          Dismiss
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="border border-foreground p-4">
          <p className="font-sans text-[11px] uppercase tracking-widest text-neutral-500">
            Fraud Probability
          </p>
          <p className={`mt-1 font-mono text-3xl font-bold ${is_fraud ? 'text-accent' : ''}`}>
            {formatPercent(fraud_probability)}
          </p>
        </div>
        <div className="border border-foreground p-4">
          <p className="font-sans text-[11px] uppercase tracking-widest text-neutral-500">
            Amount
          </p>
          <p className="mt-1 font-mono text-3xl font-bold">{formatCurrency(result.amt)}</p>
        </div>
        <div className="border border-foreground p-4">
          <p className="font-sans text-[11px] uppercase tracking-widest text-neutral-500">
            Category
          </p>
          <p className="mt-1 font-serif text-2xl font-bold">{categoryLabel(result.category)}</p>
        </div>
      </div>

      <dl className="mt-6 grid grid-cols-1 gap-x-8 gap-y-3 border-t border-muted pt-6 sm:grid-cols-2 font-body text-sm">
        <div className="flex justify-between border-b border-dashed border-neutral-400 pb-2">
          <dt className="text-neutral-600">Transaction Time</dt>
          <dd className="font-mono">{formatDateTime(result.trans_date_trans_time)}</dd>
        </div>
        <div className="flex justify-between border-b border-dashed border-neutral-400 pb-2">
          <dt className="text-neutral-600">Cardholder DOB</dt>
          <dd className="font-mono">{formatDate(result.dob)}</dd>
        </div>
        <div className="flex justify-between border-b border-dashed border-neutral-400 pb-2">
          <dt className="text-neutral-600">Gender</dt>
          <dd className="font-mono">{result.gender}</dd>
        </div>
        <div className="flex justify-between border-b border-dashed border-neutral-400 pb-2">
          <dt className="text-neutral-600">Distance from Home</dt>
          <dd className="font-mono">{result.dist} km</dd>
        </div>
        <div className="flex justify-between border-b border-dashed border-neutral-400 pb-2">
          <dt className="text-neutral-600">City Population</dt>
          <dd className="font-mono">{result.city_pop.toLocaleString()}</dd>
        </div>
        <div className="flex justify-between border-b border-dashed border-neutral-400 pb-2">
          <dt className="text-neutral-600">Occupation</dt>
          <dd className="font-mono text-right">{result.job}</dd>
        </div>
      </dl>
    </div>
  )
}
