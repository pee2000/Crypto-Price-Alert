async function fetchCryptoData() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching crypto data:", error);
        return [];
    }
}

async function displayTrendingCryptos() {
    const cryptoList = document.getElementById("crypto-list");
    cryptoList.innerHTML = "Loading...";

    const data = await fetchCryptoData();
    if (data.length === 0) {
        cryptoList.innerHTML = "Failed to load data.";
        return;
    }

    cryptoList.innerHTML = "";

    // Define meme coins on Ethereum & BSC
    const ethMemeCoins = ["dogecoin", "shiba-inu", "pepe", "floki", "bonk"];

    // Define meme coins on TON ecosystem
    const tonMemeCoins = ["catcoin-ton", "notcoin", "tonfrog", "tonk", "hamster-kart"];

    // Separate meme coins from the full list
    const trendingMemes = data.filter(coin => ethMemeCoins.includes(coin.id) || tonMemeCoins.includes(coin.id));

    // Merge all trending coins with meme coins
    const finalList = [...data, ...trendingMemes];

    // Display the selected cryptos
    finalList.forEach(coin => {
        const priceChangeClass = coin.price_change_percentage_24h > 0 ? "price-up" : "price-down";
        const coinElement = `
            <div class="crypto-item">
                <div class="crypto-name">
                    <img src="${coin.image}" alt="${coin.name}">
                    ${coin.name} (${coin.symbol.toUpperCase()})
                </div>
                <span class="${priceChangeClass}">
                    ${coin.price_change_percentage_24h.toFixed(2)}%
                </span>
            </div>
        `;
        cryptoList.innerHTML += coinElement;
    });
}

async function subscribe() {
    const email = document.getElementById("email").value;
    if (!email) {
        document.getElementById("message").innerText = "Please enter a valid email!";
        return;
    }

    const data = await fetchCryptoData();
    const risingCryptos = data.filter(coin => coin.price_change_percentage_24h > 5);

    if (risingCryptos.length > 0) {
        sendEmailAlert(email, risingCryptos);
    } else {
        document.getElementById("message").innerText = "No significant price increase detected.";
    }
}

function sendEmailAlert(email, risingCryptos) {
    const coinList = risingCryptos.map(coin => `${coin.name} (${coin.symbol.toUpperCase()}) - Up ${coin.price_change_percentage_24h.toFixed(2)}%`).join("\n");

    const emailBody = `The following cryptocurrencies have increased significantly:\n\n${coinList}`;

    window.location.href = `mailto:${email}?subject=Crypto Price Alert!&body=${encodeURIComponent(emailBody)}`;
}

displayTrendingCryptos();
