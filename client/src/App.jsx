// App.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE = import.meta.env.PROD
  ? 'https://thescoreboard.onrender.com/api'
  : '/api';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [type, setType] = useState('win');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [user, setUser] = useState('Kevin');
  const [view, setView] = useState('select');
  const ITEMS_PER_PAGE = 7;
  const [currentPage, setCurrentPage] = useState(1);


  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(`${API_BASE}/transactions`);
      setTransactions(res.data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  };

  const handleAdd = async () => {
    if (!amount || !description || !type || !category || !user) return;
    const newTx = { user, description, entry, exit, amount };
    try {
      await axios.post(`${API_BASE}/transactions`, newTx);
      fetchTransactions();
      setAmount('');
      setDescription('');
      setUser('Kevin');
    } catch (err) {
      console.error('Error adding transaction:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/transactions/${id}`);
      fetchTransactions();
    } catch (err) {
      console.error('Failed to delete transaction:', err);
    }
  };

  const filtered = (cat) =>
    transactions.filter((tx) => tx.category === cat);

  const sum = (list, type) =>
    list.filter(tx => tx.type === type).reduce((acc, tx) => acc + Number(tx.amount), 0);

  const total = (cat) => {
    const list = filtered(cat);
    return sum(list, 'win') - sum(list, 'loss');
  };

  const formatCurrency = (num) =>
    '$' + Number(num).toLocaleString();

  if (view === 'select') {
    return (
      <div className="app-container">
        <div className="selection-panel">
          <div className="card" onClick={() => { setCategory('Paper'); setView('Paper'); }}>
            <h2>Paper</h2>
          </div>
          <div className="card" onClick={() => { setCategory('Fiat'); setView('Fiat'); }}>
            <h2>Fiat</h2>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString(); // or .toLocaleDateString() for just the date
  };

  const filteredTransactions = filtered(category);
    const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
    const paginatedTransactions = filteredTransactions.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );

  return (
    <div className="app-container">
      <div className="header-row">
        <button className="card-btn" onClick={() => setView('select')}>Back</button>
        <h1 className="view-title">{category}</h1>
      </div>

      <div className="summary-panel">
        <div className="card-summary">Total: {formatCurrency(total(category))}</div>
        <div className="card-summary win">Win: {formatCurrency(sum(filtered(category), 'win'))}</div>
        <div className="card-summary loss">Loss: {formatCurrency(sum(filtered(category), 'loss'))}</div>
      </div>

      <div className="form-panel">
        <select value={user} onChange={(e) => setUser(e.target.value)}>
          <option value="Kevin">Kevin</option>
          <option value="Addison">Addison</option>
        </select>
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Entry Price"
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
        />
        <input
          type="number"
          placeholder="Exit Price"
          value={exit}
          onChange={(e) => setExit(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount ($)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button className="card-btn" onClick={handleAdd}>Add</button>
      </div>

      <table className="transaction-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Description</th>
            <th>Result</th>
            <th>Return</th>
            <th>Percentage</th>
            <th>Date/Time</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {paginatedTransactions.map((tx) => {
            const entry = Number(tx.entry);
            const exit = Number(tx.exit);
            const amount = Number(tx.amount);
            const isWin = exit > entry;
            const percentageChange = ((exit - entry) / entry) * 100;
            const returnAmount = (percentageChange / 100) * amount;

            return (
              <tr key={tx._id}>
                <td>{tx.user}</td>
                <td>{tx.description}</td>
                <td className={isWin ? 'type-win' : 'type-loss'}>
                  {isWin ? 'Win' : 'Loss'}
                </td>
                <td className={isWin ? 'type-win' : 'type-loss'}>
                  {(isWin ? '+' : '-') + formatCurrency(Math.abs(returnAmount))}
                </td>
                <td className={isWin ? 'type-win' : 'type-loss'}>
                  {(isWin ? '+' : '-') + Math.abs(percentageChange).toFixed(1) + '%'}
                </td>
                <td>{formatDate(tx.createdAt)}</td>
                <td>
                  <button className="delete-btn" onClick={() => handleDelete(tx._id)}>x</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="pagination">
        {totalPages > 1 && (
          <>
            {currentPage > 3 && (
              <button onClick={() => setCurrentPage(1)}>First</button>
            )}
            {currentPage > 1 && (
              <button onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => {
                if (totalPages <= 5) return true;
                if (page === 1 || page === totalPages) return true;
                if (Math.abs(page - currentPage) <= 2) return true;
                return false;
              })
              .map((page, index, arr) => {
                const isGap =
                  index > 0 && page - arr[index - 1] > 1;
                return isGap ? (
                  <span key={`gap-${index}`} className="gap">...</span>
                ) : (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={currentPage === page ? 'active' : ''}
                  >
                    {page}
                  </button>
                );
              })}

            {currentPage < totalPages && (
              <button onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
            )}
            {currentPage < totalPages - 2 && (
              <button onClick={() => setCurrentPage(totalPages)}>Last</button>
            )}
          </>
        )}
      </div>

      <h2 style={{ marginTop: '2rem' }}>User Breakdown</h2>
        <table className="transaction-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Win</th>
              <th>Loss</th>
              <th>Total</th>
              <th>Share</th>
            </tr>
          </thead>
          <tbody>
            {['Kevin', 'Addison'].map((u) => {
              const userTx = transactions.filter(tx => tx.category === category && tx.user === u);
              const winSum = sum(userTx, 'win');
              const lossSum = sum(userTx, 'loss');
              const netTotal = winSum - lossSum;
              const categoryTotal = total(category);
              const percentage = categoryTotal === 0 ? 0 : ((netTotal / categoryTotal) * 100).toFixed(1);

              return (
                <tr key={u}>
                  <td>{u}</td>
                  <td>{formatCurrency(winSum)}</td>
                  <td>{formatCurrency(lossSum)}</td>
                  <td>{formatCurrency(netTotal)}</td>
                  <td>{percentage}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
    </div>
  );
}

export default App;
