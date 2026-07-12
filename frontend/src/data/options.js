import jobsRaw from './jobs_raw.json'

/**
 * These are NOT arbitrary UI choices - they were extracted directly from
 * backend/src/fraud_model_1.pkl (package['cat_freq_map'], package['job_freq_map'],
 * package['gender_encoder'].classes_).
 *
 * The backend (src/backend/prediction.py) frequency-encodes `category` and `job`
 * using lookup tables the model was trained on. Pydantic's CreateCreditCardDetails
 * schema will accept any string for these fields, but a value the model has never
 * seen falls back to a frequency of 0, silently degrading the prediction. Gender is
 * stricter: it goes through a scikit-learn LabelEncoder fit only on ["F", "M"],
 * so anything else throws a server-side error (ValueError: y contains previously
 * unseen labels) rather than degrading gracefully.
 *
 * Restricting the form to these known values keeps every submission meaningful
 * and prevents the gender case from ever hitting a 500.
 */

export const GENDER_OPTIONS = [
  { value: 'F', label: 'Female' },
  { value: 'M', label: 'Male' },
]

// Order mirrors descending frequency in the training data (most common first).
export const CATEGORY_OPTIONS = [
  { value: 'gas_transport', label: 'Gas & Transport' },
  { value: 'grocery_pos', label: 'Grocery (In-Store)' },
  { value: 'home', label: 'Home' },
  { value: 'shopping_pos', label: 'Shopping (In-Store)' },
  { value: 'kids_pets', label: 'Kids & Pets' },
  { value: 'shopping_net', label: 'Shopping (Online)' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'food_dining', label: 'Food & Dining' },
  { value: 'personal_care', label: 'Personal Care' },
  { value: 'health_fitness', label: 'Health & Fitness' },
  { value: 'misc_pos', label: 'Misc (In-Store)' },
  { value: 'misc_net', label: 'Misc (Online)' },
  { value: 'grocery_net', label: 'Grocery (Online)' },
  { value: 'travel', label: 'Travel' },
]

// Categories the prediction.py HIGH_RISK list flags - surfaced in the UI so a
// person filling the form understands why a transaction might be scored higher.
export const HIGH_RISK_CATEGORIES = new Set([
  'misc_net',
  'grocery_pos',
  'gas_transport',
  'entertainment',
  'grocery_net',
  'shopping_net',
  'shopping_pos',
  'misc_pos',
])

// All 494 job titles the frequency-encoder recognizes, alphabetized.
export const JOB_OPTIONS = jobsRaw
