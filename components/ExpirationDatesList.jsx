const ExpirationDatesList = ({ dates, ticker, onDateClick }) => {
  return (
    <div className='mt-4 px-2'>
      <ul className='flex flex-wrap justify-start items-center space-x-4'>
        {dates.map((date, index) => (
          <li
            key={index}
            className={`px-1 mb-2 ${dates.length > 0 ? 'flex-grow' : ''}`}>
            {/* We use a button or a span with an onClick handler instead of an <a> tag to avoid page reloads */}
            <button
              onClick={() => onDateClick(ticker, date)}
              className='text-blue-600 hover:underline focus:outline-none'>
              {date}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpirationDatesList;
