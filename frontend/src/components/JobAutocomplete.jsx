import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { JOB_OPTIONS } from '../data/options'

export default function JobAutocomplete({ value, onChange, error }) {
  const [query, setQuery] = useState(value || '')
  const [open, setOpen] = useState(false)
  const [highlight, setHighlight] = useState(0)
  const wrapperRef = useRef(null)
  const listId = useId()

  useEffect(() => {
    setQuery(value || '')
  }, [value])

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return JOB_OPTIONS.slice(0, 25)
    return JOB_OPTIONS.filter((job) => job.toLowerCase().includes(q)).slice(0, 25)
  }, [query])

  function selectJob(job) {
    onChange(job)
    setQuery(job)
    setOpen(false)
  }

  function handleKeyDown(e) {
    if (!open) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlight((h) => Math.min(h + 1, matches.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlight((h) => Math.max(h - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (matches[highlight]) selectJob(matches[highlight])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          onChange('')
          setOpen(true)
          setHighlight(0)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="Start typing a job title..."
        className={`w-full border-b-2 bg-transparent px-3 py-2 font-mono text-sm focus-visible:bg-[#F0F0F0] focus-visible:outline-none ${
          error ? 'border-accent' : 'border-foreground'
        }`}
      />
      {open && matches.length > 0 && (
        <ul
          id={listId}
          className="absolute z-30 mt-0 max-h-64 w-full overflow-y-auto border border-t-0 border-foreground bg-background"
        >
          {matches.map((job, idx) => (
            <li key={job}>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault()
                  selectJob(job)
                }}
                className={`block w-full px-3 py-2 text-left font-body text-sm ${
                  idx === highlight ? 'bg-neutral-100' : ''
                }`}
              >
                {job}
              </button>
            </li>
          ))}
        </ul>
      )}
      {open && query.trim() && matches.length === 0 && (
        <div className="absolute z-30 w-full border border-t-0 border-foreground bg-background px-3 py-2 font-body text-sm text-neutral-500">
          No matching job title on file.
        </div>
      )}
    </div>
  )
}
