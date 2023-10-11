'use client';
import { useState } from 'react';

export const TickerInput = ({ onTickerSubmit }) => {
  const [ticker, setTicker] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onTickerSubmit(ticker);
  };

  return (
    <div className='flex justify-center items-center'>
      <input
        type='text'
        value={ticker}
        onChange={(e) => setTicker(e.target.value)}
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
