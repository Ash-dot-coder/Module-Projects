const apiKey = "Alpha Vantage API Key";   //Replace with your Alpha Vantage API Key
const apiUrl = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=";
const overviewUrl = "https://www.alphavantage.co/query?function=OVERVIEW&symbol=";
const timeSeriesUrl = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=";

async function fetchStockData() {
    const symbol = document.getElementById("stockSymbol").value.toUpperCase();
    if (!symbol) {
        alert("Please enter a stock symbol.");
        return;
    }

    try {
        // Fetch Real-Time Stock Data
        const stockUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
        const stockResponse = await fetch(stockUrl);
        const stockData = await stockResponse.json();

        if (!stockData["Global Quote"]) {
            alert("Invalid stock symbol or API limit exceeded.");
            return;
        }

        const stock = stockData["Global Quote"];
        const change = parseFloat(stock["09. change"]).toFixed(2);
    
        document.getElementById("stockPrice").innerText = `$${parseFloat(stock["05. price"]).toFixed(2)}`;
        document.getElementById("stockChange").innerText = `${stock["09. change"]} (${stock["10. change percent"]})`;
        document.getElementById("stockChange").style.color = change >= 0 ? "green" : "red";
        document.getElementById("stockOpen").innerText = `$${parseFloat(stock["02. open"]).toFixed(2)}`;
        document.getElementById("stockHigh").innerText = `$${parseFloat(stock["03. high"]).toFixed(2)}`;
        document.getElementById("stockLow").innerText = `$${parseFloat(stock["04. low"]).toFixed(2)}`;
        document.getElementById("stockVolume").innerText = `${stock["06. volume"]}`;
        document.getElementById("previousClose").innerText = parseFloat(stock["08. previous close"]).toFixed(2);

        // Fetch Additional Company Information
        const overviewUrl = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${apiKey}`;
        const overviewResponse = await fetch(overviewUrl);
        const overviewData = await overviewResponse.json();

        if (overviewData) {
            document.getElementById("companyName").innerText = overviewData["Name"] || "Company Name Not Available";
            document.getElementById("companyDescription").innerText = overviewData["Description"] || "No description available.";
            document.getElementById("stock52WeekHigh").innerText = `$${overviewData["52WeekHigh"]}`;
            document.getElementById("stock52WeekLow").innerText = `$${overviewData["52WeekLow"]}`;
            document.getElementById("marketCap").innerText = `$${(overviewData["MarketCapitalization"] / 1e9).toFixed(2)}B`;
            document.getElementById("peRatio").innerText = overviewData["PERatio"];
            document.getElementById("dividendYield").innerText = `${(overviewData["DividendYield"] * 100).toFixed(2)}%`;
            document.getElementById("sector").innerText = `${overviewData["Sector"]}`;
            document.getElementById("bookValue").innerText = `${overviewData["BookValue"]}`;
            document.getElementById("eps").innerText = `${overviewData["EPS"]}`;
            document.getElementById("ebitda").innerText = `${(overviewData["EBITDA"] / 1e9).toFixed(2)}B`;
            document.getElementById("beta").innerText = `${overviewData["Beta"]}`;
            document.getElementById("dayMovingAverage").innerText = `${overviewData["200DayMovingAverage"]}`;
        }

    } catch (error) {
        console.error("Error fetching stock data:", error);
        alert("Error fetching stock data. Please try again later");
    }
}