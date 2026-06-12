const cityInput = document.getElementById("cityInput");
const weatherCard = document.getElementById("weatherCard");
const searchBtn = document.getElementById("searchBtn");

searchBtn.addEventListener("click", getWeather);
cityInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        getWeather();
    }
});

function showLoader() {
    weatherCard.innerHTML = `
        <div class="message-card">
            <div class="loader"></div>
            <p>Fetching the latest weather...</p>
        </div>
    `;
}

function showMessage(message) {
    weatherCard.innerHTML = `
        <div class="message-card">
            <p>${message}</p>
        </div>
    `;
}

async function getWeather() {
    const city = cityInput.value.trim();

    if (!city) {
        showMessage("Please enter a city name to continue.");
        return;
    }

    showLoader();

    try {
        const response = await fetch(`/weather/${encodeURIComponent(city)}`);

        if (!response.ok) {
            const errorData = await response.json();
            showMessage(errorData.message || "Unable to fetch weather. Try again.");
            return;
        }

        const data = await response.json();
        changeBackground(data.condition);

        weatherCard.innerHTML = `
            <div class="card">
                <h2>📍 ${data.city}, ${data.country}</h2>
                <div class="temp">${Math.round(data.temperature)}°C</div>
                <div class="condition">${getWeatherIcon(data.condition)} ${data.condition}</div>
                <p class="description">${capitalize(data.description)}</p>
                <div class="info">
                    <div class="info-card">
                        <span>💧</span>
                        <h3>${data.humidity}%</h3>
                        <small>Humidity</small>
                    </div>
                    <div class="info-card">
                        <span>🌬️</span>
                        <h3>${data.windSpeed} m/s</h3>
                        <small>Wind speed</small>
                    </div>
                    <div class="info-card">
                        <span>🌡️</span>
                        <h3>${Math.round(data.temperature * 1.8 + 32)}°F</h3>
                        <small>Feels like</small>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error(error);
        showMessage("Something went wrong. Please try again later.");
    }
}

function changeBackground(condition) {
    const normalized = condition.toLowerCase();
    document.body.className = "";

    if (normalized.includes("clear")) {
        document.body.classList.add("sunny");
    } else if (normalized.includes("cloud")) {
        document.body.classList.add("clouds");
    } else if (normalized.includes("rain") || normalized.includes("drizzle")) {
        document.body.classList.add("rain");
    } else if (normalized.includes("thunderstorm")) {
        document.body.classList.add("thunderstorm");
    } else if (normalized.includes("snow")) {
        document.body.classList.add("snow");
    } else {
        document.body.classList.add("mist");
    }
}

function getWeatherIcon(condition) {
    const normalized = condition.toLowerCase();
    if (normalized.includes("clear")) return "☀️";
    if (normalized.includes("cloud")) return "☁️";
    if (normalized.includes("rain") || normalized.includes("drizzle")) return "🌧️";
    if (normalized.includes("thunderstorm")) return "⛈️";
    if (normalized.includes("snow")) return "❄️";
    return "🌫️";
}

function capitalize(text) {
    return text
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

showMessage("Search for a city to see the weather details.");