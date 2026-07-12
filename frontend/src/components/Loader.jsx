export default function Loader({ label = 'Loading…' }) {
  return (
    <div className="flex items-center justify-center gap-3 border border-dashed border-neutral-400 p-10 font-mono text-xs uppercase tracking-widest text-neutral-500">
      <span className="h-2 w-2 animate-pulse bg-foreground" />
      {label}
    </div>
  )
}
