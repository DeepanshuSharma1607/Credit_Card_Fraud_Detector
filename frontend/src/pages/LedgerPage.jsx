import { useEffect, useState, useCallback } from 'react'
import StatsTicker from '../components/StatsTicker'
import PredictionsTable from '../components/PredictionsTable'
import Loader from '../components/Loader'
import ErrorBanner from '../components/ErrorBanner'
import { fetchPredictions } from '../api/predictionApi'
import { extractErrorMessage } from '../api/client'

export default function LedgerPage() {
  const [predictions, setPredictions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchPredictions()
      setPredictions(data)
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const total = predictions.length
  const fraudCount = predictions.filter((p) => p.is_fraud).length
  const totalAmount = predictions.reduce((sum, p) => sum + p.amt, 0)
  const fraudAmount = predictions
    .filter((p) => p.is_fraud)
    .reduce((sum, p) => sum + p.amt, 0)

  return (
    <div>
      <div className="mx-auto max-w-screen-xl px-4 pt-12">
        <div className="mb-6 flex items-end justify-between border-b-4 border-foreground pb-4">
          <div>
            <span className="font-sans text-xs uppercase tracking-widest text-neutral-500">
              Fig. 2.1 &middot; All Filed Cases
            </span>
            <h2 className="font-serif text-4xl font-black tracking-tight lg:text-5xl">
              The Ledger
            </h2>
          </div>
          <button
            type="button"
            onClick={load}
            className="hidden border border-foreground px-4 py-2 font-sans text-xs uppercase tracking-widest hover:bg-foreground hover:text-background sm:block"
          >
            Refresh
          </button>
        </div>
      </div>

      {!loading && !error && total > 0 && (
        <StatsTicker
          total={total}
          fraudCount={fraudCount}
          totalAmount={totalAmount}
          fraudAmount={fraudAmount}
        />
      )}

      <div className="mx-auto max-w-screen-xl px-4 py-10">
        {loading && <Loader label="Pulling the ledger…" />}
        {!loading && error && <ErrorBanner message={error} onRetry={load} />}
        {!loading && !error && total === 0 && (
          <div className="border border-dashed border-neutral-400 p-10 text-center">
            <p className="font-serif text-xl font-bold">No cases on file yet.</p>
            <p className="mt-2 font-body text-sm text-neutral-600">
              File a new case and it will appear here immediately.
            </p>
          </div>
        )}
        {!loading && !error && total > 0 && <PredictionsTable predictions={predictions} />}
      </div>
    </div>
  )
}
