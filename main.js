/* eslint-disable func-names */
/* eslint-disable no-plusplus */
/* eslint-disable no-use-before-define */
/* eslint-disable no-console */
import './style.css'

const APIKey = '808155e7ff0244878ef164509212112';
let location = 'london';


async function getData(loc) {
    const weatherAPI = `http://api.weatherapi.com/v1/forecast.json?key=${APIKey}&q=${loc}&days=10&aqi=no&alerts=no`;
    const response = await fetch(weatherAPI);
    const data = await response.json();
    addtoDOM(data);
}

document.querySelector('.form').addEventListener('submit', sendRequest);
function sendRequest(e){
    location = e.target.input.value
    e.preventDefault();
    getData(location.toLowerCase());
    e.target.input.value = '';
    clearTodaysForecastDOM()
}

const button = document.querySelector('.btn');
button.addEventListener('click', toggleClass);
function toggleClass(){
    const buttonFah = document.querySelector('.fahrenheit');
    const buttonCel = document.querySelector('.celsius');
    buttonFah.classList.toggle('deactivated');
    buttonCel.classList.toggle('deactivated');
}

function addtoDOM(APIData){
    const currentDate = new Date(APIData.location.localtime);

    function displayCurrentData(data){
        document.querySelector('#city').textContent = data.location.name;
        document.querySelector('#condition-text').textContent = data.current.condition.text;
        document.querySelector('#temp').textContent = `${Math.round(data.current.temp_c)}°`;
    }

    function displayTodaysForecast(data){
        const todaysForecast = document.querySelector("#todays-forecast");
        const nowTemp = document.createElement('div');
        nowTemp.innerHTML = `        
        <div class="time">
            <div>Now</div>
            <img src="${data.current.condition.icon}">
            <div>${Math.round(data.current.temp_c)}°</div>
        </div>`;
    
        todaysForecast.appendChild(nowTemp);


        const forecastArray = [];
        for (let i = 0; i < data.forecast.forecastday[0].hour.length; i++) {
            const forecastDate = new Date(data.forecast.forecastday[0].hour[i].time);

            if(currentDate.getTime() < forecastDate.getTime()){
                forecastArray.push(data.forecast.forecastday[0].hour[i])
            }
        }
        for (let i = 0; i < forecastArray.length; i++){
            const timeArray = forecastArray[i].time.split(' ');
            const time = timeArray[1];
            const {icon} = forecastArray[i].condition;
            const temp = forecastArray[i].temp_c;
            const forecast = document.createElement('div');
            forecast.innerHTML = `
            <div class="time">
                <div>${time}</div>
                <img src="${icon}">
                <div>${Math.round(temp)}°</div>
            </div>`;
            todaysForecast.appendChild(forecast);
        }
    }

    function displayDetails(data){
        const {sunrise} = data.forecast.forecastday[0].astro;
        const {sunset} = data.forecast.forecastday[0].astro;
        const chanceOfRain = `${data.forecast.forecastday[0].day.daily_chance_of_rain}%`;
        const humidity = `${data.current.humidity}%`;
        const wind = `${data.current.wind_kph}km/h`;
        const feelsLike = `${Math.round(data.current.feelslike_c)}°`;
        const uvIndex = `${data.current.uv}`;
        const visibility = `${data.current.vis_km}km`;
        const chanceOfSnow = `${data.forecast.forecastday[0].day.daily_chance_of_snow}%`;
        const cloudCover = `${data.current.cloud}%`;
        document.getElementById("sunrise").textContent = sunrise;
        document.getElementById("sunset").textContent = sunset;
        document.getElementById("chance-rain").textContent = chanceOfRain;
        document.getElementById("humidity").textContent = humidity;
        document.getElementById("wind").textContent = wind;
        document.getElementById("feels-like").textContent = feelsLike;
        document.getElementById("uv-index").textContent = uvIndex;
        document.getElementById("visibility").textContent = visibility;
        document.getElementById("chance-snow").textContent = chanceOfSnow;
        document.getElementById("cloud-cover").textContent = cloudCover;
    }

    function displayForecast(data){
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday','Sunday'];

        const table = document.getElementById("table");
        console.log(data.forecast.forecastday);
        const forecastDays = data.forecast.forecastday;
        for(let i = 1; i < forecastDays.length; i++){
            const date = new Date(forecastDays[i].date);
            const tr = document.createElement("tr");
            tr.setAttribute('id', 'forecast-tr');
            tr.innerHTML = `
                <td>${days[date.getDay()]}</td>
                <td>${Math.round(forecastDays[i].day.avgtemp_c)}°</td>
                <td>
                    <img src="${forecastDays[i].day.condition.icon}">
                </td>
                <td>${forecastDays[i].day.daily_chance_of_rain}%</td>
                <td>${forecastDays[i].day.avghumidity}%</td>
            `;
            table.appendChild(tr);
            console.log(forecastDays[i]);
        }
    }


    displayCurrentData(APIData);
    displayTodaysForecast(APIData);
    displayForecast(APIData);
    displayDetails(APIData);
}

(function(){
    getData('Los Angeles');
})()

function clearTodaysForecastDOM(){
    document.querySelector("#todays-forecast").innerHTML = "";
    document.getElementById("table").removeChild(document.getElementById("forecast-tr"));
}

// if(isDay){
//     document.querySelector('.bg-image').style.backgroundImage = 'url("./images/bg-day.png")';
// }
// else{
//     document.querySelector('.bg-image').style.backgroundImage = 'url("./images/bg-night.png")';
// }

