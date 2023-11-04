// This will be the pop-up modal component
const SymbolModal = ({ data, onClose, symbol }) => {
  if (!data) return null;
  //const symbol = data.underlyingSymbol || data.symbol;

  const handleBuy = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const requestData = {
      symbol: symbol,
      price: formData.get('price'),
      quantity: formData.get('quantity'),
    };
    const response = await fetch('/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });
    const data = await response.json();
    if (response.ok) {
      console.log('Success:', data);
      onClose(); // Close the modal on success
    } else {
      console.error('Error:', data.error);
    }
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center'>
      <div className='bg-white text-slate-800 p-4 rounded shadow-lg'>
        <h3 className='text-lg'>{data.shortName}</h3>
        <p>Bid: {data.bid}</p>
        <p>Ask: {data.ask}</p>
        <p>Mark: {(data.bid + data.ask) / 2}</p>
        <form onSubmit={handleBuy} className='space-y-4 text-slate-800'>
          <input type='hidden' name='symbol' value={symbol} />
          <div>
            <label htmlFor='quantityInput'>Quantity:</label>
            <input
              id='quantityInput'
              name='quantity'
              type='number'
              defaultValue={1}
              min={1}
              className='border rounded p-1'
            />
          </div>
          <div>
            <label htmlFor='priceInput'>Price:</label>
            <input
              id='priceInput'
              name='price'
              type='number'
              step='0.01'
              defaultValue={(data.bid + data.ask) / 2}
              className='border rounded p-1'
            />
          </div>
          <div className='text-right'>
            <button
              type='submit'
              className='p-2 bg-blue-500 text-white rounded'>
              Buy
            </button>
          </div>
        </form>
        <button
          onClick={onClose}
          className='mt-4 p-2 bg-red-500 text-white rounded'>
          Close
        </button>
      </div>
    </div>
  );
};

export default SymbolModal;
