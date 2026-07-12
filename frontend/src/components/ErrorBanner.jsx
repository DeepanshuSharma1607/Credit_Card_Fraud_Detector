export default function ErrorBanner({ message, onRetry }) {
  if (!message) return null
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-2 border-accent bg-background px-5 py-4">
      <p className="font-sans text-sm">
        <span className="mr-2 font-bold uppercase tracking-widest text-accent">
          Dispatch Failed:
        </span>
        {message}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="border border-foreground px-3 py-1.5 font-sans text-xs uppercase tracking-widest hover:bg-foreground hover:text-background"
        >
          Retry
        </button>
      )}
    </div>
  )
}
