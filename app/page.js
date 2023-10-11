'use client';
import { TickerInput } from '@/components/TickerInput';
import { useState } from 'react';

export default function Home() {
  const [dates, setDates] = useState([]);

  const handleTickerSubmit = async (ticker) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/options/${ticker}`);
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      const data = await response.json();
      setDates(data);
    } catch (error) {
      console.error(
        'There has been a problem with your fetch operation:',
        error
      );
    }
  };

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <TickerInput onTickerSubmit={handleTickerSubmit} />
      <div className='mt-4'>
        {dates.map((date, index) => (
          <div key={index} className='mb-2'>
            {date}
          </div>
        ))}
      </div>
    </main>
  );
}
