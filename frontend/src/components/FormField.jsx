export default function FormField({ label, hint, error, children, htmlFor }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="font-sans text-xs font-semibold uppercase tracking-widest text-neutral-700"
      >
        {label}
      </label>
      {children}
      {hint && !error && (
        <p className="font-sans text-[11px] text-neutral-500">{hint}</p>
      )}
      {error && (
        <p className="font-sans text-[11px] font-semibold uppercase tracking-wide text-accent">
          {error}
        </p>
      )}
    </div>
  )
}
