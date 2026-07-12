import { useState } from 'react'
import FormField from './FormField'
import JobAutocomplete from './JobAutocomplete'
import { CATEGORY_OPTIONS, GENDER_OPTIONS, HIGH_RISK_CATEGORIES } from '../data/options'

const inputClasses =
  'w-full border-b-2 border-foreground bg-transparent px-3 py-2 font-mono text-sm focus-visible:bg-[#F0F0F0] focus-visible:outline-none'

function nowForDatetimeLocal() {
  const d = new Date()
  d.setSeconds(0, 0)
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 16)
}

const initialState = {
  trans_date_trans_time: nowForDatetimeLocal(),
  category: '',
  amt: '',
  gender: '',
  city_pop: '',
  job: '',
  dob: '',
  dist: '',
}

export default function PredictionForm({ onSubmit, submitting }) {
  const [form, setForm] = useState(initialState)
  const [errors, setErrors] = useState({})

  function setField(name, value) {
    setForm((f) => ({ ...f, [name]: value }))
    setErrors((e) => ({ ...e, [name]: undefined }))
  }

  function validate() {
    const next = {}

    if (!form.trans_date_trans_time) next.trans_date_trans_time = 'Required'
    if (!form.category) next.category = 'Choose a category'
    if (!form.gender) next.gender = 'Choose a gender'
    if (!form.job) next.job = 'Pick a job title from the list'
    if (!form.dob) next.dob = 'Required'

    const amt = Number(form.amt)
    if (form.amt === '' || Number.isNaN(amt) || amt <= 0) {
      next.amt = 'Enter an amount greater than 0'
    }

    const cityPop = Number(form.city_pop)
    if (form.city_pop === '' || !Number.isInteger(cityPop) || cityPop <= 0) {
      next.city_pop = 'Enter a whole number greater than 0'
    }

    const dist = Number(form.dist)
    if (form.dist === '' || Number.isNaN(dist) || dist < 0) {
      next.dist = 'Enter a distance of 0 or more'
    }

    if (form.dob && form.trans_date_trans_time) {
      const dob = new Date(form.dob)
      const transTime = new Date(form.trans_date_trans_time)
      if (dob.getTime() > transTime.getTime()) {
        next.dob = 'Date of birth is after the transaction date'
      }
    }

    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return

    const payload = {
      // IMPORTANT: send a naive datetime string (no trailing "Z"/offset).
      // The backend does `trans_time - dob` (prediction.py) where dob has
      // no timezone; sending a tz-aware value (e.g. via toISOString(),
      // which appends "Z") throws "Cannot subtract tz-naive and tz-aware
      // datetime-like objects" and the request 500s. The <input type=
      // "datetime-local"> value is already naive local time, so we pass
      // it straight through (just adding :00 seconds for a clean ISO shape).
      trans_date_trans_time: `${form.trans_date_trans_time}:00`,
      category: form.category,
      amt: Number(form.amt),
      gender: form.gender,
      city_pop: Number(form.city_pop),
      job: form.job,
      dob: form.dob,
      dist: Number(form.dist),
    }

    onSubmit(payload)
  }

  const isHighRiskCategory = HIGH_RISK_CATEGORIES.has(form.category)

  return (
    <form onSubmit={handleSubmit} className="border border-foreground bg-background p-6 lg:p-8">
      <div className="mb-6 flex items-baseline justify-between border-b border-foreground pb-4">
        <h2 className="font-serif text-2xl font-bold lg:text-3xl">Case Intake Form</h2>
        <span className="font-mono text-xs uppercase tracking-widest text-neutral-500">
          Fig. 1.1
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormField label="Transaction Date & Time" htmlFor="trans_date_trans_time" error={errors.trans_date_trans_time}>
          <input
            id="trans_date_trans_time"
            type="datetime-local"
            className={inputClasses}
            value={form.trans_date_trans_time}
            onChange={(e) => setField('trans_date_trans_time', e.target.value)}
          />
        </FormField>

        <FormField label="Amount (USD)" htmlFor="amt" error={errors.amt}>
          <input
            id="amt"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            className={inputClasses}
            value={form.amt}
            onChange={(e) => setField('amt', e.target.value)}
          />
        </FormField>

        <FormField
          label="Merchant Category"
          htmlFor="category"
          error={errors.category}
          hint={isHighRiskCategory ? 'Flagged as a historically higher-risk category.' : undefined}
        >
          <select
            id="category"
            className={inputClasses}
            value={form.category}
            onChange={(e) => setField('category', e.target.value)}
          >
            <option value="">Select category&hellip;</option>
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Distance from Home (km)" htmlFor="dist" error={errors.dist}>
          <input
            id="dist"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            className={inputClasses}
            value={form.dist}
            onChange={(e) => setField('dist', e.target.value)}
          />
        </FormField>

        <FormField label="Cardholder Gender" htmlFor="gender" error={errors.gender}>
          <select
            id="gender"
            className={inputClasses}
            value={form.gender}
            onChange={(e) => setField('gender', e.target.value)}
          >
            <option value="">Select&hellip;</option>
            {GENDER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Date of Birth" htmlFor="dob" error={errors.dob}>
          <input
            id="dob"
            type="date"
            className={inputClasses}
            value={form.dob}
            onChange={(e) => setField('dob', e.target.value)}
          />
        </FormField>

        <FormField label="City Population" htmlFor="city_pop" error={errors.city_pop}>
          <input
            id="city_pop"
            type="number"
            step="1"
            min="1"
            placeholder="e.g. 48000"
            className={inputClasses}
            value={form.city_pop}
            onChange={(e) => setField('city_pop', e.target.value)}
          />
        </FormField>

        <FormField label="Cardholder Occupation" htmlFor="job" error={errors.job} hint="494 job titles on file - starts filtering as you type.">
          <JobAutocomplete value={form.job} onChange={(v) => setField('job', v)} error={errors.job} />
        </FormField>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-8 w-full bg-foreground px-6 py-4 font-sans text-sm font-semibold uppercase tracking-widest text-background transition-all duration-200 hover:bg-white hover:text-foreground hover:border hover:border-foreground disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      >
        {submitting ? 'Filing Case…' : 'Submit for Review'}
      </button>
    </form>
  )
}
