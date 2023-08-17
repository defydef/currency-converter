// `https://api.frankfurter.app/latest?amount=100&from=EUR&to=USD`

import { useEffect, useState } from "react";

function App() {
  const [amount, setAmount] = useState(15000);
  const [fromCurrency, setFromCurrency] = useState("IDR");
  const [toCurrency, setToCurrency] = useState("USD");
  const [rates, setRates] = useState("Loading...");

  const [error, setError] = useState("");

  useEffect(
    function () {
      const host = "api.frankfurter.app";
      const controller = new AbortController();

      async function fetchCurrencies() {
        try {
          const res = await fetch(
            `https://${host}/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`,
            { signal: controller.signal }
          );
          if (!res.ok) throw new Error();
          const data = await res.json();
          if (data.Response === "False") throw new Error(data.Error);
          setRates(data.rates[toCurrency]);
        } catch (e) {
          if (e.name !== "AbortError") setError(e.message);
        }
      }
      if (amount !== 0 && fromCurrency !== toCurrency) fetchCurrencies();

      // cleanup function
      return function () {
        controller.abort();
      };
    },
    [amount, fromCurrency, toCurrency]
  );

  return (
    <div>
      <input
        type="text"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />
      <select
        value={fromCurrency}
        onChange={(e) => setFromCurrency(e.target.value)}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="IDR">IDR</option>
        <option value="AUD">AUD</option>
      </select>
      <select
        value={toCurrency}
        onChange={(e) => setToCurrency(e.target.value)}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="IDR">IDR</option>
        <option value="AUD">AUD</option>
      </select>
      {!error && <p>{fromCurrency !== toCurrency ? rates : amount}</p>}
      {error && <p>{error}</p>}
    </div>
  );
}

export default App;
