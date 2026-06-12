require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.OPENWEATHER_API_KEY;

if (!API_KEY) {
    console.error("Missing OPENWEATHER_API_KEY in environment. Set it in .env.");
    process.exit(1);
}

// Weather API Route
app.get("/weather/:city", async (req, res) => {

    const city = req.params.city;

    console.log("City Received:", city);

    try {

        const url =
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

        const response = await axios.get(url);

        const weatherData = {
            city: response.data.name,
            country: response.data.sys.country,
            temperature: response.data.main.temp,
            humidity: response.data.main.humidity,
            condition: response.data.weather[0].main,
            description: response.data.weather[0].description,
            windSpeed: response.data.wind.speed
        };

        res.json(weatherData);

    } catch (error) {

        console.log(error.response?.data || error.message);

        res.status(404).json({
            message: "City not found"
        });
    }
});

app.listen(PORT, () => {
    console.log(`WeatherVista running at http://localhost:${PORT}`);
});