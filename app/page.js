'use client';

import { useState, useEffect } from 'react';
import { TickerInput } from '@/components/TickerInput';
import ExpirationDatesList from '@/components/ExpirationDatesList';
import FetchOptionsAtExpDate from '@/util/FetchOptionsAtExpDate';
import { CallOptionsList } from '@/components/CallOptionsList';
import { PutOptionsList } from '@/components/PutOptionsList';
import SymbolModal from '@/components/SymbolModal';
import handleTickerSubmit from '@/util/tickerService';

import { useStore } from 'zustand';

export default function Home() {
  const [dates, setDates] = useState([]);
  const [date, setDate] = useState('');
  const [ticker, setTicker] = useState('');
  const [selectedSymbol, setSelectedSymbol] = useState(null);
  const [positions, setPositions] = useState([]);
  const [optionData, setOptionData] = useState({ calls: [], puts: [] });
  const [bidAndAsk, setBidAndAsk] = useState({});
  const [showModal, setShowModal] = useState(false);

  // When user clicks on an expiration date
  const handleDateClick = async (ticker, date) => {
    setDate(date); // Store date in date state.
    const data = await FetchOptionsAtExpDate(ticker, date);
    setOptionData(data);
  };

  // When user click on an indivdual options symbol
  const handleOptionClick = (symbol) => {
    fetchBidAndAsk(symbol); // Set states bid and ask for symbol
    setSelectedSymbol(symbol); // Store the selected symbol in the state
    setShowModal(true); // Add this line to show the modal
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const fetchPositions = async () => {
    try {
      const response = await fetch('/api'); // Adjust this URL to match your API endpoint
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      const data = await response.json();
      setPositions(data.data); // Set current positions state
    } catch (error) {
      console.error(
        'There has been a problem with your fetch operation:',
        error
      );
    }
  };

  useEffect(() => {
    fetchPositions();
  }, []);

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

  const fetchMark = async (symbol) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/info/${symbol}`);
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      const data = await response.json();
      const mark = (data.bid + data.ask) / 2;
      return mark;
    } catch (error) {
      console.error(
        'There has been a problem with your fetch operation:',
        error
      );
    }
  };

  const updatePositionsWithMark = async () => {
    const updatedPositions = await Promise.all(
      positions.map(async (position) => {
        const mark = await fetchMark(position.symbol);
        return { ...position, mark }; // Add the mark to the position object
      })
    );
    setPositions(updatedPositions);
  };

  useEffect(() => {
    if (positions.length > 0) {
      const symbol = positions[1].symbol; // Assumes positions are stored with a 'symbol' property
      fetchBidAndAsk(symbol);
    }
  }, [positions]);

  useEffect(() => {
    if (positions.length > 0) {
      updatePositionsWithMark();
    }
  }, []); // Dependency array contains positions, this effect will run when positions change

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <TickerInput setDates={setDates} setTicker={setTicker} />

      <ExpirationDatesList
        dates={dates}
        ticker={ticker}
        onDateClick={handleDateClick}
      />

      <div className='flex flex-col md:flex-row justify-around items-start'>
        <div className='flex-1 pr-8'>
          {/* Display CallOptionsList */}
          <CallOptionsList
            calls={optionData.calls}
            onOptionClick={handleOptionClick}
            ticker={ticker}
            date={date}
          />
        </div>

        <div className='flex-1'>
          {/* Display PutOptionsList */}
          <PutOptionsList
            puts={optionData.puts}
            onOptionClick={handleOptionClick}
          />
        </div>
      </div>

      {showModal && (
        <SymbolModal
          data={bidAndAsk}
          onClose={handleCloseModal}
          key={bidAndAsk.ask}
          symbol={selectedSymbol}
          ticker={ticker}
          date={date}
        />
      )}

      <div className='mt-4'>
        <span>Portfolio</span>
        {positions.map((position, index) => (
          <div key={index} className='mb-2'>
            {position.symbol}: {parseFloat(position.price).toFixed(2)} x{' '}
            {position.quantity}
            {/* Use position.symbol to get current price */}
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
