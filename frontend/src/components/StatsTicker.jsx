import { formatCurrency, formatPercent } from '../utils/format'

export default function StatsTicker({ total, fraudCount, totalAmount, fraudAmount }) {
  const fraudRate = total > 0 ? fraudCount / total : 0

  const items = [
    `${total} CASE${total === 1 ? '' : 'S'} ON FILE`,
    `${fraudCount} FLAGGED FRAUDULENT`,
    `FRAUD RATE: ${formatPercent(fraudRate)}`,
    `TOTAL VOLUME: ${formatCurrency(totalAmount)}`,
    `FLAGGED VOLUME: ${formatCurrency(fraudAmount)}`,
  ]

  const track = [...items, ...items]

  return (
    <div className="overflow-hidden border-y-2 border-foreground bg-foreground py-3 text-background">
      <div className="flex w-max animate-marquee gap-12 whitespace-nowrap font-mono text-xs uppercase tracking-widest">
        {track.map((item, idx) => (
          <span key={idx} className="flex items-center gap-3">
            <span className="text-accent">&#9632;</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
