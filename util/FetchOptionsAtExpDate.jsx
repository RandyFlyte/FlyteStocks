const FetchOptionsAtExpDate = async (ticker, date) => {
  try {
    const response = await fetch(
      `http://127.0.0.1:5000/option_chain/${ticker}/${date}`
    );
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return { calls: data.calls, puts: data.puts };
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
    return { calls: [], puts: [] }; // Return empty arrays in case of error
  }
};

export default FetchOptionsAtExpDate;
