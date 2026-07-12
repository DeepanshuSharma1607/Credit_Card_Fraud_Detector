export default function Footer() {
  return (
    <footer className="border-t-4 border-foreground bg-foreground text-background">
      <div className="mx-auto max-w-screen-xl px-4 py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          <div className="md:col-span-6">
            <h2 className="font-serif text-2xl font-bold">The Fraud Gazette</h2>
            <p className="mt-2 max-w-md font-body text-sm text-neutral-400">
              An internal risk-review desk for credit card transactions.
              Every submission is scored the moment it's filed, and every
              verdict is added to the permanent ledger.
            </p>
          </div>
          <div className="md:col-span-3">
            <h3 className="font-sans text-xs uppercase tracking-widest text-neutral-400">
              Desk
            </h3>
            <ul className="mt-3 space-y-2 font-body text-sm">
              <li>File New Case</li>
              <li>The Ledger</li>
            </ul>
          </div>
          <div className="md:col-span-3">
            <h3 className="font-sans text-xs uppercase tracking-widest text-neutral-400">
              Edition
            </h3>
            <p className="mt-3 font-mono text-sm text-neutral-400">
              Vol. 1.0
              <br />
              Served locally
            </p>
          </div>
        </div>
        <div className="mt-10 border-t border-neutral-700 pt-6 text-center font-mono text-[11px] uppercase tracking-widest text-neutral-500">
          Not financial or legal advice &middot; Model output only
        </div>
      </div>
    </footer>
  )
}
