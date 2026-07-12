import { useState } from 'react'
import PredictionForm from '../components/PredictionForm'
import VerdictCard from '../components/VerdictCard'
import ErrorBanner from '../components/ErrorBanner'
import { createPrediction } from '../api/predictionApi'
import { extractErrorMessage } from '../api/client'

export default function NewCasePage() {
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [lastPayload, setLastPayload] = useState(null)

  async function handleSubmit(payload) {
    setSubmitting(true)
    setError(null)
    setLastPayload(payload)
    try {
      const data = await createPrediction(payload)
      setResult(data)
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  async function handleRetry() {
    if (!lastPayload) return
    setSubmitting(true)
    setError(null)
    try {
      const data = await createPrediction(lastPayload)
      setResult(data)
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-12">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          {error && (
            <div className="mb-6">
              <ErrorBanner message={error} onRetry={handleRetry} />
            </div>
          )}

          {result ? (
            <VerdictCard result={result} onDismiss={() => setResult(null)} />
          ) : (
            <PredictionForm onSubmit={handleSubmit} submitting={submitting} />
          )}
        </div>

        <aside className="lg:col-span-4">
          <div className="sticky top-32 border border-foreground p-6">
            <h3 className="font-serif text-xl font-bold">About This Desk</h3>
            <p className="mt-3 font-body text-sm text-neutral-600">
              Every case filed here is scored instantly by a trained model and
              written to the permanent ledger. Nothing is deleted or
              anonymized after submission.
            </p>
            <div className="mt-6 border-t border-dashed border-neutral-400 pt-4">
              <p className="font-sans text-xs uppercase tracking-widest text-neutral-500">
                What counts as high risk
              </p>
              <p className="mt-2 font-body text-sm text-neutral-600">
                Gas &amp; transport, grocery, entertainment, and shopping
                categories carry a higher historical fraud rate in the
                training data and are flagged accordingly in the form.
              </p>
            </div>
            <div className="mt-6 border-t border-dashed border-neutral-400 pt-4">
              <p className="font-sans text-xs uppercase tracking-widest text-neutral-500">
                Occupation field
              </p>
              <p className="mt-2 font-body text-sm text-neutral-600">
                Limited to the 494 job titles the model was trained on, so
                every submission is scored meaningfully.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
