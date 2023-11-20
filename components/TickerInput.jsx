'use client';
import { useState } from 'react';

export const TickerInput = ({ setDates, setTicker }) => {
  const [ticker, setLocalTicker] = useState('');

  const handleTickerSubmit = async (submittedTicker) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/options/${submittedTicker}`
      );
      if (!response.ok)
        throw new Error('Network response was not ok ' + response.statusText);
      const data = await response.json();
      setDates(data);
      setTicker(submittedTicker);
    } catch (error) {
      console.error(
        'There has been a problem with your fetch operation:',
        error
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleTickerSubmit(ticker);
  };

  return (
    <div className='flex justify-center items-center'>
      <input
        type='text'
        value={ticker}
        onChange={(e) => setLocalTicker(e.target.value)}
        placeholder='Enter Ticker'
        className='mr-2 p-2 border rounded text-slate-400'
      />
      <button
        onClick={handleSubmit}
        className='p-2 bg-blue-500 text-white rounded'>
        Get Dates
      </button>
    </div>
  );
};
