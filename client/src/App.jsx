import { useEffect, useMemo, useState } from 'react';
import ExpenseForm from './components/ExpenseForm.jsx';
import { request } from './services/api.js';

const categories = ['Food', 'Travel', 'Education', 'Shopping', 'Entertainment', 'Health', 'Other'];
const categoryColors = {
  Food: '#db8c50', Travel: '#6c99a5', Education: '#8a9f6a', Shopping: '#c77b70',
  Entertainment: '#927fba', Health: '#5d9b83', Other: '#a58c64',
};

function getToday() {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}

function formatMoney(amount) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(amount);
}

function formatDate(date) {
  const [year, month, day] = date.slice(0, 10).split('-').map(Number);
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    .format(new Date(year, month - 1, day));
}

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [activeExpense, setActiveExpense] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');

  async function loadExpenses() {
    setLoading(true);
    try {
      setExpenses(await request('/api/expenses'));
      setError('');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadExpenses(); }, []);

  const filteredExpenses = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return expenses.filter((expense) =>
      expense.title.toLocaleLowerCase().includes(query)
      && (!categoryFilter || expense.category === categoryFilter)
      && (!monthFilter || expense.date.slice(0, 7) === monthFilter));
  }, [expenses, search, categoryFilter, monthFilter]);

  const currentMonth = getToday().slice(0, 7);
  const totalSpent = expenses.reduce((total, expense) => total + expense.amount, 0);
  const monthSpent = expenses.filter((expense) => expense.date.slice(0, 7) === currentMonth)
    .reduce((total, expense) => total + expense.amount, 0);
  const categoryTotals = categories.map((name) => ({
    name,
    total: expenses.filter((expense) => expense.category === name)
      .reduce((total, expense) => total + expense.amount, 0),
  })).filter((item) => item.total > 0).sort((first, second) => second.total - first.total);
  const largestCategoryTotal = Math.max(...categoryTotals.map((item) => item.total), 0);
  const recentExpenses = expenses.slice(0, 5);

  function openForm(expense = null) {
    setActiveExpense(expense);
    setFormError('');
    setIsFormOpen(true);
  }

  async function saveExpense(values) {
    try {
      const editing = Boolean(activeExpense);
      const path = editing ? `/api/expenses/${activeExpense._id}` : '/api/expenses';
      const saved = await request(path, { method: editing ? 'PUT' : 'POST', body: values });
      setExpenses((current) => {
        const next = editing ? current.map((item) => item._id === saved._id ? saved : item) : [saved, ...current];
        return next.sort((first, second) => new Date(second.date) - new Date(first.date));
      });
      setIsFormOpen(false);
      setError('');
    } catch (requestError) {
      setFormError(requestError.message);
    }
  }

  async function deleteExpense(expense) {
    if (!window.confirm(`Delete “${expense.title}”? This cannot be undone.`)) return;
    try {
      await request(`/api/expenses/${expense._id}`, { method: 'DELETE' });
      setExpenses((current) => current.filter((item) => item._id !== expense._id));
      setError('');
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#dashboard" aria-label="SpendWise dashboard"><span className="brand-mark">S</span><span>spendwise<span className="brand-period">.</span></span></a>
        <div className="side-label">YOUR SPACE</div>
        <a className="nav-link active" href="#dashboard"><span className="nav-icon" aria-hidden="true">▦</span> Overview</a>
        <button className="nav-link nav-action" onClick={() => openForm()}><span className="nav-icon" aria-hidden="true">＋</span> Add expense</button>
        <div className="sidebar-note"><span className="note-spark" aria-hidden="true">✳</span><p>Small choices add up. Keep an eye on where yours go.</p></div>
        <div className="sidebar-footer">A LITTLE MORE MINDFUL, EVERY DAY</div>
      </aside>

      <main className="main-content" id="dashboard">
        <header className="topbar">
          <div className="breadcrumb">Your money <span>/</span> Overview</div>
          <button className="primary-button" onClick={() => openForm()}><span aria-hidden="true">＋</span> Add expense</button>
        </header>
        <section className="page-heading">
          <div><p className="eyebrow">YOUR FINANCES, AT A GLANCE</p><h1>A clearer view of your spending.</h1><p className="heading-copy">Every little expense tells a story. Here’s yours so far.</p></div>
          <div className="heading-date">{new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' }).format(new Date())}</div>
        </section>

        {error && <div className="alert" role="alert"><span>{error}</span><button className="text-button" onClick={loadExpenses}>Try again</button></div>}

        <section className="summary-grid" aria-label="Spending summary">
          <article className="summary-item summary-featured"><div className="summary-top"><span>Total spending</span><span className="summary-mark" aria-hidden="true">↗</span></div><div className="summary-value">{formatMoney(totalSpent)}</div><div className="summary-caption">Across all recorded expenses</div></article>
          <article className="summary-item"><div className="summary-top"><span>This month</span><span className="mini-line" aria-hidden="true" /></div><div className="summary-value">{formatMoney(monthSpent)}</div><div className="summary-caption">Spent in {new Intl.DateTimeFormat('en-IN', { month: 'long' }).format(new Date())}</div></article>
          <article className="summary-item"><div className="summary-top"><span>Transactions</span><span className="transaction-icon" aria-hidden="true">≡</span></div><div className="summary-value">{expenses.length}</div><div className="summary-caption">Expenses logged so far</div></article>
        </section>

        <section className="insights-grid">
          <article className="panel category-panel">
            <div className="panel-heading"><div><p className="eyebrow">THE BREAKDOWN</p><h2>Where it goes</h2></div><span className="panel-caption">By category</span></div>
            {categoryTotals.length === 0 ? <p className="empty-inline">Your category breakdown will show up here.</p> : (
              <div className="category-list">{categoryTotals.map((item) => <div className="category-row" key={item.name}>
                <div className="category-label"><span className="category-dot" style={{ backgroundColor: categoryColors[item.name] }} /><span>{item.name}</span><strong>{formatMoney(item.total)}</strong></div>
                <div className="bar-track"><span className="bar-fill" style={{ width: `${item.total / largestCategoryTotal * 100}%`, backgroundColor: categoryColors[item.name] }} /></div>
              </div>)}</div>
            )}
          </article>
          <article className="panel recent-panel">
            <div className="panel-heading"><div><p className="eyebrow">JUST THE LATEST</p><h2>Recent expenses</h2></div><span className="recent-count">{Math.min(expenses.length, 5)} / 5</span></div>
            {recentExpenses.length === 0 ? <p className="empty-inline">Nothing here yet. Add your first expense to get started.</p> : (
              <div className="recent-list">{recentExpenses.map((expense) => <div className="recent-row" key={expense._id}>
                <span className="recent-dot" style={{ backgroundColor: categoryColors[expense.category] }} />
                <span className="recent-description"><strong>{expense.title}</strong><small>{expense.category} · {formatDate(expense.date)}</small></span>
                <strong className="recent-amount">{formatMoney(expense.amount)}</strong>
              </div>)}</div>
            )}
          </article>
        </section>

        <section className="expenses-section">
          <div className="expenses-heading">
            <div><p className="eyebrow">YOUR RECORD</p><h2>All expenses <span>{filteredExpenses.length}</span></h2></div>
            <div className="filters" role="search">
              <label className="search-field"><span className="sr-only">Search expense titles</span><span className="search-icon" aria-hidden="true">⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search expenses" /></label>
              <label><span className="sr-only">Filter by category</span><select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}><option value="">All categories</option>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
              <label><span className="sr-only">Filter by month</span><input className="month-filter" type="month" value={monthFilter} onChange={(event) => setMonthFilter(event.target.value)} /></label>
            </div>
          </div>
          <div className="expense-table-wrap"><table className="expense-table">
            <thead><tr><th>Expense</th><th>Category</th><th>Date</th><th>Amount</th><th><span className="sr-only">Actions</span></th></tr></thead>
            <tbody>
              {loading ? <tr><td className="table-message" colSpan="5">Loading your expenses…</td></tr> : filteredExpenses.length === 0 ? (
                <tr><td className="table-message" colSpan="5">{expenses.length === 0 ? 'No expenses yet. Add one to start your record.' : 'No expenses match these filters.'}</td></tr>
              ) : filteredExpenses.map((expense) => <tr key={expense._id}>
                <td><span className="expense-title">{expense.title}</span>{expense.description && <span className="expense-description">{expense.description}</span>}</td>
                <td><span className="category-tag"><span className="category-dot" style={{ backgroundColor: categoryColors[expense.category] }} />{expense.category}</span></td>
                <td className="date-cell">{formatDate(expense.date)}</td><td className="amount-cell">{formatMoney(expense.amount)}</td>
                <td><div className="row-actions"><button className="icon-button" aria-label={`Edit ${expense.title}`} onClick={() => openForm(expense)}>Edit</button><button className="icon-button delete-button" aria-label={`Delete ${expense.title}`} onClick={() => deleteExpense(expense)}>Delete</button></div></td>
              </tr>)}
            </tbody>
          </table></div>
        </section>
        <footer className="page-footer">Spend with intention. Make room for what matters.</footer>
      </main>
      {isFormOpen && <ExpenseForm key={activeExpense?._id || 'new-expense'} expense={activeExpense} categories={categories} error={formError} onSave={saveExpense} onCancel={() => setIsFormOpen(false)} />}
    </div>
  );
}