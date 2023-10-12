'use client';
import { TickerInput } from '@/components/TickerInput';
import { useState, useEffect } from 'react';

export default function Home() {
  const [dates, setDates] = useState([]);
  const [positions, setPositions] = useState([]);
  const [bidAndAsk, setBidAndAsk] = useState({});

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

  const fetchPositions = async () => {
    try {
      const response = await fetch('/api'); // Adjust this URL to match your API endpoint
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      const data = await response.json();
      setPositions(data.data); // Assumes your data is nested under a "data" property
    } catch (error) {
      console.error(
        'There has been a problem with your fetch operation:',
        error
      );
    }
  };

  useEffect(() => {
    fetchPositions();
  }, []); // Empty array means this useEffect runs once, similar to componentDidMount

  const fetchBidAndAsk = async (symbol) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/info/${symbol}`);
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      const data = await response.json();
      setBidAndAsk({ bid: data.bid, ask: data.ask });
    } catch (error) {
      console.error(
        'There has been a problem with your fetch operation:',
        error
      );
    }
  };

  useEffect(() => {
    if (positions.length > 0) {
      const symbol = positions[1].symbol; // Assumes positions are stored with a 'symbol' property
      fetchBidAndAsk(symbol);
    }
  }, [positions]);

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
      <div className='mt-4'>
        {positions.map((position, index) => (
          <div key={index} className='mb-2'>
            {position.symbol}: {position.price} x {position.quantity}
          </div>
        ))}
      </div>
      {Object.keys(bidAndAsk).length > 0 && (
        <div className='mt-4'>
          Bid: {bidAndAsk.bid}, Ask: {bidAndAsk.ask}
        </div>
      )}
    </main>
  );
}
