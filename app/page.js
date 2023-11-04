'use client';
import { TickerInput } from '@/components/TickerInput';
import ExpirationDatesList from '@/components/ExpirationDatesList';
import FetchOptionsAtExpDate from '@/util/FetchOptionsAtExpDate';
import { CallOptionsList } from '@/components/CallOptionsList';
import { PutOptionsList } from '@/components/PutOptionsList';
import SymbolModal from '@/components/SymbolModal';
import { useState, useEffect } from 'react';

export default function Home() {
  const [dates, setDates] = useState([]);
  const [date, setDate] = useState('');
  const [ticker, setTicker] = useState('');
  const [selectedSymbol, setSelectedSymbol] = useState(null); // Add a new state variable for the selected symbol
  const [positions, setPositions] = useState([]);
  const [optionData, setOptionData] = useState({ calls: [], puts: [] });
  const [bidAndAsk, setBidAndAsk] = useState({});
  //const [bidAndAsk, setBidAndAsk] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // When enter Ticker and hit Submit
  const handleTickerSubmit = async (ticker) => {
    try {
      // Call Flask api endpoint (returns expiration dates for inputted ticker)
      const response = await fetch(`http://127.0.0.1:5000/options/${ticker}`);
      if (!response.ok)
        throw new Error('Network response was not ok ' + response.statusText);
      // Assign data to API response ex: [ "2023-11-10", "2023-11-17", ...]
      const data = await response.json();
      // Populate dates array state with response data
      setDates(data);
      setTicker(ticker);
    } catch (error) {
      console.error(
        'There has been a problem with your fetch operation:',
        error
      );
    }
  };

  // When user clicks on an expiration date
  const handleDateClick = async (ticker, date) => {
    setDate(date);
    const data = await FetchOptionsAtExpDate(ticker, date);
    setOptionData(data);
  };

  // When user click on an indivdual options symbol
  const handleOptionClick = (symbol) => {
    fetchBidAndAsk(symbol);
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
        />
      )}

      {/* <div className='mt-4'>
        {dates.map((date, index) => (
          <div key={index} className='mb-2'>
            {date}
          </div>
        ))}
      </div> */}
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
