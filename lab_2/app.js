const express = require("express");
const hbs = require("hbs");
const axios = require('axios');
let app = express();

hbs.registerPartials(__dirname + '/views/partials');
const apiKey = '4f020934a49607e9f949be5b71b80d58';

app.use('/bootstrap', express.static('https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css'));


app.set('view engine', 'hbs');
app.get('/', (req, res) => {
    res.render('partials/welcome')
});

app.get('/weather/:city', (req, res) => {
    const city = req.params.city;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    axios.get(apiUrl)
        .then(response => {
            const weather = {
                city: `${city}`,
                pressure: `${response.data.main.pressure}`,
                humidity: `${response.data.main.humidity}`,
                temp: `${response.data.main.temp}`,
                icon: `${response.data.weather[0].icon}`
            }

            res.render('weather', {weather});
        })
        .catch(error => {
            res.send(error)
        });
});
app.get('/weather', (req, res) => {
    res.render('partials/cities');
});
app.get('/login', (req, res) => {
    res.send("This is a Login Page");
});
app.use((req, res, next) => {
    res.status(404).send("404 Not Found");
});
app.listen(3000, () => {

});
