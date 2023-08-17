// `https://api.frankfurter.app/latest?amount=100&from=EUR&to=USD`

import { useEffect, useState } from "react";

function App() {
  const [amount, setAmount] = useState(15000);
  const [fromCurrency, setFromCurrency] = useState("IDR");
  const [toCurrency, setToCurrency] = useState("USD");
  const [rates, setRates] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(
    function () {
      const host = "api.frankfurter.app";
      const controller = new AbortController();

      async function fetchCurrencies() {
        try {
          setIsLoading(true);
          const res = await fetch(
            `https://${host}/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`,
            { signal: controller.signal }
          );
          if (!res.ok) throw new Error();
          const data = await res.json();
          if (data.Response === "False") throw new Error(data.Error);
          setRates(data.rates[toCurrency]);
          setIsLoading(false);
          setError("");
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
        disabled={isLoading}
      />
      <select
        value={fromCurrency}
        onChange={(e) => setFromCurrency(e.target.value)}
        disabled={isLoading}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="IDR">IDR</option>
        <option value="AUD">AUD</option>
      </select>
      <select
        value={toCurrency}
        onChange={(e) => setToCurrency(e.target.value)}
        disabled={isLoading}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="IDR">IDR</option>
        <option value="AUD">AUD</option>
      </select>
      {!error && !isLoading && (
        <p>
          {fromCurrency !== toCurrency ? rates : amount} {toCurrency}
        </p>
      )}
      {error && <p>{error}</p>}
      {isLoading && !error && <p>Loading...</p>}
    </div>
  );
}

export default App;
