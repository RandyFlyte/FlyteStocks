export const PutOptionsList = ({ puts, onOptionClick }) => {
  return (
    <div>
      <h2>Puts</h2>
      {puts.map((put, index) => (
        <div key={index}>
          {put.contractSymbol} - Strike: {put.strike}
        </div>
      ))}
    </div>
  );
};
