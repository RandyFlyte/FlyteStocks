export const CallOptionsList = ({ calls, onOptionClick, ticker, date }) => {
  return (
    <div>
      <h2>Calls</h2>
      {calls.map((call, index) => (
        <div key={index}>
          <button
            onClick={() => onOptionClick(call.contractSymbol)}
            className='text-blue-600 hover:underline focus:outline-none'>
            {call.contractSymbol}
          </button>
          - Strike: {call.strike}
        </div>
      ))}
    </div>
  );
};
