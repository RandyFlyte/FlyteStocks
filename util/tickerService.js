const handleTickerSubmit = async (ticker, setDates, setTicker) => {
  try {
    const response = await fetch(`http://127.0.0.1:5000/options/${ticker}`);
    if (!response.ok)
      throw new Error('Network response was not ok ' + response.statusText);
    const data = await response.json();
    setDates(data);
    setTicker(ticker);
    return data; // Returning the fetched data
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
    throw error; // Rethrowing the error for handling in the component
  }
};

export default handleTickerSubmit;
