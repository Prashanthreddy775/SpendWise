import { useState } from 'react';

function todayAsInputValue() {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}

function isValidDateOnly(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export default function ExpenseForm({ expense, categories, error, onSave, onCancel }) {
  const [values, setValues] = useState({
    title: expense?.title || '',
    amount: expense?.amount ?? '',
    category: expense?.category || '',
    date: expense?.date?.slice(0, 10) || todayAsInputValue(),
    description: expense?.description || '',
  });
  const [validationError, setValidationError] = useState('');
  const [saving, setSaving] = useState(false);

  function updateValue(event) {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
    setValidationError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const amount = Number(values.amount);

    if (!values.title.trim()) {
      setValidationError('Add a title for this expense.');
      return;
    }
    if (!Number.isFinite(amount) || amount <= 0 || amount > 1000000000) {
      setValidationError('Enter an amount greater than zero and no more than 1,000,000,000.');
      return;
    }
    if (!categories.includes(values.category)) {
      setValidationError('Choose an expense category.');
      return;
    }
    if (!isValidDateOnly(values.date)) {
      setValidationError('Choose a valid expense date.');
      return;
    }

    setSaving(true);
    await onSave({ ...values, title: values.title.trim(), amount, description: values.description.trim() });
    setSaving(false);
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onCancel();
    }}>
      <section className="expense-dialog" role="dialog" aria-modal="true" aria-labelledby="form-title">
        <div className="dialog-heading">
          <div>
            <p className="eyebrow">{expense ? 'MAKE A CHANGE' : 'ADD TO YOUR RECORD'}</p>
            <h2 id="form-title">{expense ? 'Edit expense' : 'New expense'}</h2>
          </div>
          <button className="close-button" aria-label="Close form" onClick={onCancel}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <label className="form-field">
            <span>Title <span className="required-mark">*</span></span>
            <input name="title" value={values.title} onChange={updateValue} maxLength="100" autoFocus placeholder="e.g. Lunch with friends" />
          </label>
          <div className="form-row">
            <label className="form-field">
              <span>Amount <span className="required-mark">*</span></span>
              <div className="amount-input"><span>₹</span><input name="amount" type="number" value={values.amount} onChange={updateValue} min="0.01" max="1000000000" step="0.01" placeholder="0.00" /></div>
            </label>
            <label className="form-field">
              <span>Date <span className="required-mark">*</span></span>
              <input name="date" type="date" value={values.date} onChange={updateValue} />
            </label>
          </div>
          <label className="form-field">
            <span>Category <span className="required-mark">*</span></span>
            <select name="category" value={values.category} onChange={updateValue}>
              <option value="">Choose a category</option>
              {categories.map((category) => <option key={category}>{category}</option>)}
            </select>
          </label>
          <label className="form-field">
            <span>Description <span className="optional-label">Optional</span></span>
            <textarea name="description" value={values.description} onChange={updateValue} maxLength="500" rows="3" placeholder="Add a note if you like" />
          </label>
          {(validationError || error) && <p className="form-error" role="alert">{validationError || error}</p>}
          <div className="form-actions">
            <button className="secondary-button" type="button" onClick={onCancel}>Cancel</button>
            <button className="primary-button" type="submit" disabled={saving}>{saving ? 'Saving…' : expense ? 'Save changes' : 'Add expense'}</button>
          </div>
        </form>
      </section>
    </div>
  );
}