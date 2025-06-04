const apiKey = "Y4ZOC5WMSBL4X62F"; // Replace with your Alpha Vantage API Key
const apiUrl = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=";
const overviewBaseUrl = "https://www.alphavantage.co/query?function=OVERVIEW&symbol=";
const timeSeriesUrl = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=";

async function fetchStockData() {
    const symbol = document.getElementById("stockSymbol").value.toUpperCase();
    if (!symbol) {
        alert("Please enter a stock symbol.");
        return;
    }

    // Optional: Clear old values
    document.querySelectorAll(".stock-info").forEach(el => el.innerText = "Loading...");

    try {
        // Fetch Real-Time Stock Data
        const stockUrl = `${apiUrl}${symbol}&apikey=${apiKey}`;
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
        document.getElementById("stockVolume").innerText = stock["06. volume"] || "N/A";
        document.getElementById("previousClose").innerText = parseFloat(stock["08. previous close"]).toFixed(2);

        // Fetch Company Overview
        const companyOverviewUrl = `${overviewBaseUrl}${symbol}&apikey=${apiKey}`;
        const overviewResponse = await fetch(companyOverviewUrl);
        const overviewData = await overviewResponse.json();

        if (overviewData) {
            document.getElementById("companyName").innerText = overviewData["Name"] || "Company Name Not Available";
            document.getElementById("companyDescription").innerText = overviewData["Description"] || "No description available.";
            document.getElementById("stock52WeekHigh").innerText = overviewData["52WeekHigh"] ? `$${overviewData["52WeekHigh"]}` : "N/A";
            document.getElementById("stock52WeekLow").innerText = overviewData["52WeekLow"] ? `$${overviewData["52WeekLow"]}` : "N/A";
            document.getElementById("marketCap").innerText = overviewData["MarketCapitalization"]
                ? `$${(overviewData["MarketCapitalization"] / 1e9).toFixed(2)}B`
                : "N/A";
            document.getElementById("peRatio").innerText = overviewData["PERatio"] || "N/A";
            document.getElementById("dividendYield").innerText = overviewData["DividendYield"]
                ? `${(overviewData["DividendYield"] * 100).toFixed(2)}%`
                : "N/A";
            document.getElementById("sector").innerText = overviewData["Sector"] || "N/A";
            document.getElementById("bookValue").innerText = overviewData["BookValue"] || "N/A";
            document.getElementById("eps").innerText = overviewData["EPS"] || "N/A";
            document.getElementById("ebitda").innerText = overviewData["EBITDA"]
                ? `${(overviewData["EBITDA"] / 1e9).toFixed(2)}B`
                : "N/A";
            document.getElementById("beta").innerText = overviewData["Beta"] || "N/A";
            document.getElementById("dayMovingAverage").innerText = overviewData["200DayMovingAverage"] || "N/A";
        }

    } catch (error) {
        console.error("Error fetching stock data:", error);
        alert("Error fetching stock data. Please try again later.");
    }
}
