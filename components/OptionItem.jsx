// This could be a component for individual options
const OptionItem = ({ symbol, onOptionClick }) => {
  return (
    <button
      onClick={() => onOptionClick(symbol)}
      className='p-2 m-1 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors'>
      {symbol}
    </button>
  );
};
