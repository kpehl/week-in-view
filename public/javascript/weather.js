// From Kathleen Pehl's Weather Dashboard project
// https://github.com/kpehl/weather-dashboard
// A variable for the Open Weather API key
var apiKey = '86a0171fe8b8a02fbb9273530ba556fd'
//  var apiKey = process.env.WEATHER_API_KEY;

// An element for the form
var cityFormEl = document.querySelector("#city-form");
// An element for the form input
var cityInputEl = document.querySelector("#city");
// An element for the current weather container
var currentWeatherContainerEl = document.querySelector("#current-weather-container");
// create a container for the current weather
var currentWeatherEl = document.createElement("div");
currentWeatherEl.classList = "card align-left p-3";
currentWeatherEl.id = "current-weather"
// create a container for the current weather header
var currentWeatherHeader = document.createElement("div");
currentWeatherHeader.classList = "header";
// An element for the city returned by the API
var citySearchTerm = document.querySelector("#city-search-term");
// An element for the forecast container
var forecastContainerEl = document.querySelector("#forecast-container");
var forecastCardContainerEl = document.createElement("div");
forecastCardContainerEl.classList = ("card-deck");
// An element for the saved searches container
var savedSearchesContainerEl = document.querySelector("#saved-searches");

// A moment for the current date
var currentDate = moment().format("M/D/YYYY");

// A function to handle the form input
var formSubmitHandler = function(event) {
    // prevent the default action of submitting the input to an external database
    event.preventDefault();
    // get the value of the city and clear the form
    var city = cityInputEl.value.trim();
    if (city) {
        getCurrentWeather(city);
        cityInputEl.value = "";
    // if no value is entered, alert the user
    } else {
        alert("Please enter a city");
    }
};

// Initialize the saved searches array
var savedSearchesArr = [];
// Create a function to load saved searches
var loadSavedSearches = function() {
    savedSearchesArr = JSON.parse(localStorage.getItem("city-weather"));
    if (!savedSearchesArr) {
      savedSearchesArr = [];
    }
    $.each(savedSearchesArr, function(index,savedSearchItem) {
        searchEl = addSavedSearchButton(savedSearchItem);
        savedSearchesContainerEl.appendChild(searchEl)
        });
    // if the DOM list is longer than 3, remove the last (oldest) value
    var savedSearchesCount = savedSearchesContainerEl.childElementCount;
    if (savedSearchesCount > 3) {
        savedSearchesContainerEl.removeChild(savedSearchesContainerEl.lastChild);
    }
};

// A function create a saved search button for a city
var addSavedSearchButton = function(city) {
    searchEl = document.createElement("button");
    searchEl.classList = "btn btn-white btn-block btn-outline-dark";
    searchEl.setAttribute("city-search", city);
    searchEl.textContent = city;
    return searchEl;
};

// A function to add a saved search to the saved search array and to the DOM
var addSavedSearch = function(city) {
    // loop through the saved searches to see if a search is a duplicate, and if it is, remove the older instance
    $.each(savedSearchesArr, function(index,savedSearchItem) {
        if(savedSearchItem == city) {
            savedSearchesArr.splice(index,1);
        }
    });
    // add the new search to the beginning of the array
    savedSearchesArr.splice(0,0,city);
    // if the saved searches array is longer than 3, pop off the last (oldest) value
    if (savedSearchesArr.length > 3) {
        savedSearchesArr.pop();
    }
    // save the array to local storage
    saveSearches();
    //clear the old data
    savedSearchesContainerEl.textContent = "";
    // load the saved searches to populate the DOM
    loadSavedSearches();
};

// A function to save the recent searches
var saveSearches = function() {
    localStorage.setItem("city-weather", JSON.stringify(savedSearchesArr));
  };


// A function to handle the saved search button clicks
var savedSearchesHandler = function(event) {
    var citySearch = event.target.getAttribute("city-search");
    // if a language is selected, clear out old content and get the featured repos (asynchonous event, so order doesn't matter in the if)
    if (citySearch) {
        getCurrentWeather(citySearch);
    }
};

// Function to get the current weather data, uv data, and 5 day forecast
var getCurrentWeather = function(city) {
    // Create a URL for a current weather query, specifying the city, that imperial units are desired, and adding my API key
    var weatherApiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&APPID=" + apiKey;
    fetch(weatherApiUrl).then(function(response) {
        return response.json().then(function(data) {
            // error handling
            switch (data.cod) {
                case "404":
                    // clear displayed data from the DOM
                    currentWeatherContainerEl.textContent = "";
                    currentWeatherEl.textContent = "";
                    forecastContainerEl.textContent = "";
                    forecastCardContainerEl.textContent = "";
                    alert("404 Error: " + data.message);
                    break;
                case "401":
                    // clear displayed data from the DOM
                    currentWeatherContainerEl.textContent = "";
                    currentWeatherEl.textContent = "";
                    forecastContainerEl.textContent = "";
                    forecastCardContainerEl.textContent = "";
                    alert("401 Error: " + data.message);
                    break;
                case "429":
                    // clear displayed data from the DOM
                    currentWeatherContainerEl.textContent = "";
                    currentWeatherEl.textContent = "";
                    forecastContainerEl.textContent = "";
                    forecastCardContainerEl.textContent = "";                    
                    alert("429 Error: " +data.message);
                    break;
            };
            
            // display the weather data provided
            displayCurrentWeather(data, city);
            // get the named city from the data
            var cityName = data.name;
            // save the successful search in the saved searches list
            addSavedSearch(cityName);
            // Get the latitude and longitude from the weather data
            var cityLat = data.coord.lat;
            var cityLon = data.coord.lon;
            // use a nested fetch to get the forecast data with the defined latitude and longitude
            // Create a URL for the one call query with current weather, uvi ( not currently working ), and 7 day forecast
            var oneCallUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLon + "&units=imperial&exclude=minutely,hourly&APPID=" + apiKey;
            return fetch(oneCallUrl);
        })
        .then(function(response) {
            return response.json().then(function(data) {

                //display the 5 day forecast data in a new set of cards
                displayForecast(data);

                var cityLat = data.lat;
                var cityLon = data.lon;

                // use another nested fetch to get the UVI data
                var uviUrl = "https://api.openweathermap.org/data/2.5/uvi?lat=" + cityLat + "&lon=" + cityLon + "&APPID=86a0171fe8b8a02fbb9273530ba556fd"
                return fetch(uviUrl);
            })
        })
        .then(function(response) {
            return response.json().then(function(data) {
                // display the current UV data on the card
                displayCurrentUv(data);
            })
        })
    })
    // .catch(function(error) {
    //     alert("Something went wrong - reloading")
    //     document.location.reload();
    // })
};

// Function to display the current weather data
var displayCurrentWeather = function(weatherData, searchTerm) {
    // clear old content
    currentWeatherContainerEl.textContent = "";
    currentWeatherHeader.textContent = "";
    currentWeatherEl.textContent = "";
    // create a heading container for the city name
    var cityNameHeader = document.createElement("h3");
    // get the city name that the API provided from the search
    var cityName = weatherData.name;
    // create the header text
    cityNameHeader.textContent = cityName + " (" + currentDate + ") ";
    
    // get the weather icon for the current weather
    var iconCode = weatherData.weather[0].icon;
    var iconCodeText = weatherData.weather[0].description;
    // var iconEl = getIcon(iconCode, iconCodeText);

    // get the weather condition code
    var weatherConditionCode = weatherData.weather[0].id;
    // get an alternate weather icon
    var altIconEl = getAltIcon(weatherConditionCode, iconCode, iconCodeText);

    // get the latitude and longitude
    cityLatEl = weatherData.coord.lat;
    cityLonEl = weatherData.coord.lon;

    // append the heading to the header div
    currentWeatherHeader.appendChild(cityNameHeader)
    // append the image to the header div
    currentWeatherHeader.appendChild(altIconEl);

    // append the header to the container
    currentWeatherEl.appendChild(currentWeatherHeader);

    // create an element for the temperature
    var currentTempEl = document.createElement("p");
    // get the temperature from the API data
    var currentTemp = weatherData.main.temp;
    // round the temperature to one decimal place
    var currentTemp = currentTemp.toFixed(1);
    // create the temperature text
    currentTempEl.textContent = "Current Temperature: " + currentTemp + " °F";
    // append the text to the current weather container
    currentWeatherEl.appendChild(currentTempEl);

    // create an element for the humidity
    var currentHumidityEl = document.createElement("p");
    var currentHumidity = weatherData.main.humidity;
    currentHumidityEl.textContent = "Current Humidity: " + currentHumidity + "%";
    currentWeatherEl.appendChild(currentHumidityEl);
    
    // create an element for the wind speed
    var currentWindEl = document.createElement("p");
    var currentWind = weatherData.wind.speed;
    currentWindEl.textContent = "Current Wind Speed: " + currentWind + " MPH";
    currentWeatherEl.appendChild(currentWindEl);

    // append the container to the DOM
    currentWeatherContainerEl.appendChild(currentWeatherEl);

};

// A function to display the UV index data
var displayCurrentUv = function(data) {
    // create an element for the UV index
    var currentUvEl = document.createElement("a");
    // set the value based on the API data
    var currentUv = data.value;
    // set the link to the EPA UV Index Scale page
    currentUvEl.setAttribute("href", "https://www.epa.gov/sunsafety/uv-index-scale-0");
    currentUvEl.setAttribute("target", "_blank");
    // add a badge span with a color for Favorable (success), Moderate (warning), and Severe (danger)
    var uvSpan = document.createElement("span");
    if (currentUv > 7) {
        uvSpan.classList = "badge badge-danger"
    } else if (currentUv > 3) {
        uvSpan.classList = "badge badge-warning"
    } else {
        uvSpan.classList = "badge badge-success"
    }

    // add the value of the UV index to the badge
    uvSpan.innerHTML = currentUv;
    // create the text context of the element
    currentUvEl.textContent = "UV Index: ";
    // create the text context of the element
    currentUvEl.appendChild(uvSpan);
    // get the current weather card populated by displayCurrentWeather()
    currentWeatherEl.querySelector("#current-weather");
    // append the current UV index
    currentWeatherEl.appendChild(currentUvEl);
};

// A function to generate the icon image tag
var getIcon = function(iconCode, iconCodeText) {
    // Create a URL for the weather icon provided by the weather data
    var iconUrl = "https://openweathermap.org/img/wn/" + iconCode + "@2x.png"
    // Create an icon image element
    var iconImgEl = document.createElement("img")
    iconImgEl.setAttribute("src", iconUrl);
    iconImgEl.setAttribute("alt", iconCodeText);
    var tooltipSpan = document.createElement("span");
    tooltipSpan.classList = "tooltiptext";
    tooltipSpan.textContent = iconCodeText;
    var iconEl = document.createElement("div")
    iconEl.classList = "tooltip"
    iconEl.appendChild(iconImgEl);
    iconEl.appendChild(tooltipSpan);
    return(iconEl);
};

// A function to generate an alternate icon image tag
var getAltIcon = function(weatherConditionCode, iconCode, iconCodeText) {
    if (iconCode.includes("n")){      
        var altIconCode = "wi-owm-night-" + weatherConditionCode;
    } else if (iconCode.includes("d")) {
        var altIconCode = "wi-owm-day-" + weatherConditionCode;
    } else {
        var altIconCode = "wi-owm-" + weatherConditionCode;
    }
    var altIconImgEl = '<i class="wi ' + altIconCode + '"></i>';

    var tooltipSpan = document.createElement("span");
    tooltipSpan.classList = "tooltiptext";
    tooltipSpan.textContent = iconCodeText;
    var altIconEl = document.createElement("div")
    altIconEl.classList = "tooltip";
    altIconEl.innerHTML = altIconImgEl;
    altIconEl.appendChild(tooltipSpan);
    return(altIconEl);
};


// A function to display the 5 day forecast
var displayForecast = function(data) {
    // clear out old data
    forecastContainerEl.textContent = "";
    forecastCardContainerEl.textContent = "";
    // Add the title
    var forecastContainerTitleEl = document.createElement("h3");
    forecastContainerTitleEl.textContent = "5-Day Forecast:";
    forecastContainerEl.appendChild(forecastContainerTitleEl);
    // loop over the daily data to get the information for each card, 
    // starting with the first entry in the array, today, and going for 5 days
    var forecastDate = [];
    var dailyMaxTemp = [];
    var dailyMaxHumidity = [];
    var dailyIconCode = [];
    var dailyIconCodeText = [];
    var dailyWeatherConditionCode = [];
    var cardElementName = [];
    for (var i = 0; i < 5; i++) {
        forecastDate[i] = moment.unix(data.daily[i].dt).format("M/D/YYYY");
        dailyMaxTemp[i] = (data.daily[i].temp.max).toFixed(1);
        dailyMaxHumidity[i] = data.daily[i].humidity;
        dailyIconCode[i] = data.daily[i].weather[0].icon;
        dailyIconCodeText[i] = data.daily[i].weather[0].description;
        dailyWeatherConditionCode[i] = data.daily[i].weather[0].id;
        cardElementName[i] = "forecastCard" + i;
    }

    // create the forecast cards
    for (var i = 0; i < 5; i++) {
        // Create the card div and style it
        var forecastCardEl = document.createElement("div");
        forecastCardEl.classList = ("card text-white bg-primary p-1")
        forecastCardEl.id = cardElementName[i];
        // Create the card body div
        var cardBody = document.createElement("div");
        cardBody.classList = ("card-body");
        // Create the card title with the date and append it
        var cardTitle = document.createElement("h5");
        cardTitle.classList = ("card-title pb-4 align-top");
        cardTitle.textContent = forecastDate[i]
        cardBody.appendChild(cardTitle);

        // Create the icon and append it
        // var iconCodeEl = getIcon(dailyIconCode[i], dailyIconCodeText[i]);

        var altIconEl = getAltIcon(dailyWeatherConditionCode[i], dailyIconCode[i],dailyIconCodeText[i]);

        cardBody.appendChild(altIconEl);

        // Create the daily max temperature, and append it
        var tempEl = document.createElement("p");
        tempEl.classList = "card-text";
        tempEl.textContent = "Temp: " + dailyMaxTemp[i] + " °F";
        cardBody.appendChild(tempEl);
        // Create the daily max humidity and append it
        var humidityEl = document.createElement("p");
        humidityEl.classList = "card-text";
        humidityEl.textContent = "Humidity: " + dailyMaxHumidity[i] + "%";
        cardBody.appendChild(humidityEl);

        forecastCardEl.appendChild(cardBody);
        forecastCardContainerEl.appendChild(forecastCardEl);
    }
    forecastContainerEl.appendChild(forecastCardContainerEl);
};

// Load saved searches upon page load
loadSavedSearches();

// Event Listener for the Search Button
cityFormEl.addEventListener("submit", formSubmitHandler)

// Event Listener for the Saved Search Buttons
savedSearchesContainerEl.addEventListener("click", savedSearchesHandler)