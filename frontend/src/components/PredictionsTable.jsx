import { useMemo, useState } from 'react'
import { formatCurrency, formatDateTime, formatPercent } from '../utils/format'
import { CATEGORY_OPTIONS } from '../data/options'

function categoryLabel(value) {
  return CATEGORY_OPTIONS.find((c) => c.value === value)?.label || value
}

export default function PredictionsTable({ predictions }) {
  const [query, setQuery] = useState('')
  const [fraudOnly, setFraudOnly] = useState(false)

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return predictions
      .filter((p) => (fraudOnly ? p.is_fraud : true))
      .filter((p) => {
        if (!q) return true
        return (
          p.job.toLowerCase().includes(q) ||
          categoryLabel(p.category).toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        )
      })
      .sort(
        (a, b) => new Date(b.trans_date_trans_time) - new Date(a.trans_date_trans_time)
      )
  }, [predictions, query, fraudOnly])

  return (
    <div className="border border-foreground bg-background">
      <div className="flex flex-col gap-4 border-b border-foreground p-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          placeholder="Search by occupation or category..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border-b-2 border-foreground bg-transparent px-3 py-2 font-mono text-sm focus-visible:bg-[#F0F0F0] focus-visible:outline-none sm:max-w-xs"
        />
        <label className="flex min-h-[44px] items-center gap-2 font-sans text-xs uppercase tracking-widest">
          <input
            type="checkbox"
            checked={fraudOnly}
            onChange={(e) => setFraudOnly(e.target.checked)}
            className="h-4 w-4 accent-[#CC0000]"
          />
          Flagged cases only
        </label>
      </div>

      {rows.length === 0 ? (
        <p className="p-8 text-center font-body text-sm text-neutral-500">
          No cases match this search.
        </p>
      ) : (
        <>
          {/* Desktop / tablet table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full border-collapse text-left font-body text-sm">
              <thead>
                <tr className="border-b border-foreground font-sans text-[11px] uppercase tracking-widest text-neutral-600">
                  <th className="border-r border-muted px-4 py-3">Filed</th>
                  <th className="border-r border-muted px-4 py-3">Category</th>
                  <th className="border-r border-muted px-4 py-3 text-right">Amount</th>
                  <th className="border-r border-muted px-4 py-3">Occupation</th>
                  <th className="border-r border-muted px-4 py-3 text-right">Distance</th>
                  <th className="border-r border-muted px-4 py-3 text-right">Probability</th>
                  <th className="px-4 py-3 text-right">Verdict</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((p) => (
                  <tr
                    key={p.uid}
                    className={`border-b border-muted hover:bg-neutral-100 ${
                      p.is_fraud ? 'bg-[#FDF3F3]' : ''
                    }`}
                  >
                    <td className="border-r border-muted px-4 py-3 font-mono text-xs">
                      {formatDateTime(p.trans_date_trans_time)}
                    </td>
                    <td className="border-r border-muted px-4 py-3">
                      {categoryLabel(p.category)}
                    </td>
                    <td className="border-r border-muted px-4 py-3 text-right font-mono">
                      {formatCurrency(p.amt)}
                    </td>
                    <td className="border-r border-muted px-4 py-3">{p.job}</td>
                    <td className="border-r border-muted px-4 py-3 text-right font-mono">
                      {p.dist} km
                    </td>
                    <td className="border-r border-muted px-4 py-3 text-right font-mono">
                      {formatPercent(p.fraud_probability)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`font-sans text-xs font-bold uppercase tracking-widest ${
                          p.is_fraud ? 'text-accent' : 'text-neutral-600'
                        }`}
                      >
                        {p.is_fraud ? 'Fraud' : 'Cleared'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile stacked cards */}
          <ul className="divide-y divide-muted md:hidden">
            {rows.map((p) => (
              <li key={p.uid} className={`p-4 ${p.is_fraud ? 'bg-[#FDF3F3]' : ''}`}>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-neutral-600">
                    {formatDateTime(p.trans_date_trans_time)}
                  </span>
                  <span
                    className={`font-sans text-xs font-bold uppercase tracking-widest ${
                      p.is_fraud ? 'text-accent' : 'text-neutral-600'
                    }`}
                  >
                    {p.is_fraud ? 'Fraud' : 'Cleared'}
                  </span>
                </div>
                <p className="mt-1 font-serif text-lg font-bold">
                  {formatCurrency(p.amt)} &middot; {categoryLabel(p.category)}
                </p>
                <p className="mt-1 font-body text-sm text-neutral-600">{p.job}</p>
                <p className="mt-1 font-mono text-xs text-neutral-500">
                  {p.dist} km from home &middot; {formatPercent(p.fraud_probability)} probability
                </p>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
