import { loading } from './loading.js';
import { errorState } from './errorState.js';
import { noSearchResult } from './noSearchResult.js';
import dayjs from "https://esm.sh/dayjs";
import { removeLoading } from './loading.js';
import { removeNoSearchResult } from './noSearchResult.js';

class DropdownEffects {
  unitsDropdown;
  switchDropdown;
  timeoutid;
  timeoutid2;
  switchBtns;

  constructor() {
    this.switchBtns = document.querySelectorAll('.switch button');
    this.switchDropdown = document.querySelector('.switch');
    this.unitsDropdown = document.querySelector('.container');

    // create events
   
  }

  unitEvents = () => {
    this.unitsDropdown.addEventListener('mouseenter', this.showUnitDropdown);
    this.unitsDropdown.addEventListener('mouseleave', this.hideUnitDropdown);
  }

  showUnitDropdown = () => {
    clearInterval(this.timeoutid2);
    this.switchDropdown.style.display = "block";
    this.timeoutid = setTimeout(() => { 
      this.switchDropdown.style.opacity = "1";
      this.switchDropdown.style.transform = "scale(1)";
    }, 50);
  }

  hideUnitDropdown = () => {
    clearInterval(this.timeoutid);
    this.switchDropdown.style.opacity = "0";
    this.switchDropdown.style.transform = "scale(.95)";

    this.timeoutid2 = setTimeout(() => {
      this.switchDropdown.style.display = "none";
    }, 200);
  }
}

const unitDropdown = new DropdownEffects();

 unitDropdown.unitEvents();

unitDropdown.switchBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    unitDropdown.hideUnitDropdown();
    unitDropdown.unitEvents();
  })
});

unitDropdown.unitsDropdown.addEventListener('focus', () => {
  unitDropdown.unitsDropdown.removeEventListener('mouseenter', unitDropdown.showUnitDropdown)
  unitDropdown.unitsDropdown.removeEventListener('mouseleave', unitDropdown.hideUnitDropdown)
});

class DayDropdown extends DropdownEffects {
  constructor() {
    super();
    this.unitsDropdown = document.querySelector('.hourly-forecast-dropdown-menu .container');
    this.switchDropdown = document.querySelector('.hourly-forecast-dropdown-menu .dropdown');
    this.switchBtns = document.querySelectorAll('.hourly-forecast-dropdown-menu .dropdown button');
  }
}

const dayDropdown = new DayDropdown();

  dayDropdown.unitEvents();

  dayDropdown.switchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      dayDropdown.hideUnitDropdown();
      dayDropdown.unitEvents();
    })
  });

  dayDropdown.unitsDropdown.addEventListener('focus', () => {
    dayDropdown.unitsDropdown.removeEventListener('mouseenter', dayDropdown.showUnitDropdown)
    dayDropdown.unitsDropdown.removeEventListener('mouseleave', dayDropdown.hideUnitDropdown)
  });


class Weather {
  location = localStorage.getItem('loc');
  countryName = localStorage.getItem('cou');
  longitude = localStorage.getItem('lon');
  latitude = localStorage.getItem('lat');
  todaysDate = dayjs().format('YYYY-MM-DD');
  oneWeek = dayjs().add(6, 'days').format('YYYY-MM-DD');
  temperatureUnit = 'celsius';
  precipitationUnit = 'mm';
  windUnit = 'kmh';
  currentWeatherDetails = {
    temperature: null,
    humidity: null,
    windSpeed: null,
    precipitation: null,
    weatherCode: null
  }
  dailyForecast = [];
  hourlyForecast = [];
  hourlyForecastDay = dayjs().format('dddd');
  noSearch = false;


  constructor() {
    this.fillInfo();
  }

  getUserLocation = async () => {
    try {
    await fetch("https://ipapi.co/json/").then((res) => {
      return res.json();
    }).then((r) => {
      this.location = r.city;
      this.countryName = r.country_name;
      this.latitude = r.latitude;
      this.longitude = r.longitude;
    }).then(() => {
      this.fillInfo();
    });
  } catch {
    errorState();
  }
  }

  async getWeatherInfo() {
    if (!this.noSearch) {
      let f;
    try {
       f = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${this.latitude}&longitude=${this.longitude}&current=weather_code,temperature,relative_humidity_2m,precipitation,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&hourly=temperature_2m,weather_code&start_date=${this.todaysDate}&end_date=${this.oneWeek}${this.temperatureUnit ? '&temperature_unit=' + this.temperatureUnit : ''}${this.windUnit ? '&wind_speed_unit=' + this.windUnit : ''}${this.precipitationUnit ? '&precipitation_unit=' + this.precipitationUnit : ''}`).then(r => {
      return r.json();
      }).then(res => {
        return res;
      });
      } catch {
        errorState();
      }
    return f;
    }
  }

  fillInfo = async () => {
    loading();
    let allWeatherInfo;
      if (this.countryName && this.latitude && this.longitude) {
        allWeatherInfo = await this.getWeatherInfo();
      } else{
        await this.getUserLocation();
      }
      this.setStorage();

    if (allWeatherInfo) {
      // current
      this.currentWeatherDetails.precipitation = allWeatherInfo.current.precipitation; 
      this.currentWeatherDetails.temperature = allWeatherInfo.current.temperature;
      this.currentWeatherDetails.humidity = allWeatherInfo.current.relative_humidity_2m;
      this.currentWeatherDetails.windSpeed = allWeatherInfo.current.wind_speed_10m;
      this.currentWeatherDetails.weatherCode = allWeatherInfo.current.weather_code;

      // daily
      const d = allWeatherInfo.daily
      for (let i = 0; i < 7; i++) {
        this.dailyForecast.push(
          {
            day: dayjs(d.time[i]).format('ddd'),
            weatherCode: d.weather_code[i],
            minTemperature: d.temperature_2m_min[i],
            maxTemperature: d.temperature_2m_max[i]
          }
        )
      }

      // hourly
      const h = allWeatherInfo.hourly;
      for (let i = 0; i < 7; i++) {
        let counter = 24 * i;
        const day = [
          dayjs(h.time[counter]).format('dddd')
        ];
        for (let j = 0; j < 24; j++) {
          day.push({
            weatherCode: h.weather_code[counter + j],
            time: dayjs(h.time[counter + j]).format('h A'),
            temperature: h.temperature_2m[counter + j]
          })
        }
        this.hourlyForecast.push(day);
      }

      removeLoading();
      this.updatePage();
    }
  }

  mapping = (code) => {
    if (code >= 0 && code <= 2) return '../assets/images/icon-partly-cloudy.webp';
    else if (code === 3) return '../assets/images/icon-overcast.webp'
    else if (code === 45 || code === 48) return '../assets/images/icon-fog.webp'
    else if (code >= 51 && code <= 57) return '../assets/images/icon-drizzle.webp' 
    else if ((code > 60 && code < 68) || (code > 79 &&  code < 87)) return '../assets/images/icon-rain.webp'
    else if (code > 70 &&  code < 78) return '../assets/images/icon-snow.webp'
    else if (code > 94 &&  code < 100) return '../assets/images/icon-storm.webp'
  }

  updatePage = () => {
    // current weather info
    document.querySelector('.location-info .location').innerHTML = `${this.location !== 'undefined' ? this.location + ',' : ''} ${this.countryName}`;
    document.querySelector('.location-info .date').innerHTML = dayjs().format('dddd, MMM D, YYYY');
    document.querySelector('.weather-info .temperature-container').innerHTML = `
      <img src = ${this.mapping(this.currentWeatherDetails.weatherCode)} alt = "sunny" loading = "lazy" decoding = "async">
      <p>${this.currentWeatherDetails.temperature}${this.mapUnits('temperature')}</p>
    `;

    // weather details container

    document.querySelector('.feels-like .value').innerHTML = `${this.currentWeatherDetails.temperature}${this.mapUnits('temperature')} `;
    document.querySelector('.humidity .value').innerHTML = this.currentWeatherDetails.humidity + '%';
    document.querySelector('.wind .value').innerHTML = this.currentWeatherDetails.windSpeed + this.mapUnits('wind');
    document.querySelector('.precipitation .value').innerHTML = this.currentWeatherDetails.precipitation + this.mapUnits('precipitation');

    // daily forecast
    document.querySelector('.day').innerHTML = '';
    for (let i = 0; i < 7; i++) {
      document.querySelector('.day').innerHTML += `
        <div class = "daily">
          <div class = "day-name">${this.dailyForecast[i].day}</div>
          <div class = "weather-condition">
            <img src = ${this.mapping(this.dailyForecast[i].weatherCode)} alt = "foggy" loading = "lazy" decoding = "async">
          </div>
          <div class = "temperature">
            <p class = "min">${this.dailyForecast[i].minTemperature + this.mapUnits('temperature')}</p>
            <p class = "max">${this.dailyForecast[i].maxTemperature + this.mapUnits('temperature')}</p>
          </div>
        </div>
      `
    }

    // hourly forecast

    const hfdc = document.querySelector('.hourly-forecast-data-container');
    hfdc.innerHTML = '';
    const displayDay = this.hourlyForecast[this.mapDays()];
    for (let i = 1; i < 25; i++) {
      hfdc.innerHTML += `
        <div class = "hourly-forecast-data">
          <img class = "condition" src = ${this.mapping(displayDay[i].weatherCode)} alt = "partly-cloudy" loading = "eager" decoding = "sync">
          <p>${displayDay[i].time}</p>
          <p>${displayDay[i].temperature + this.mapUnits('temperature')}</p>
        </div>
      ` ;
    }
    call();
  }

  mapDays = (request) => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(this.hourlyForecast[i][0])
    }
    if (!request) {
    return days.indexOf(this.hourlyForecastDay);
    } else return days;
  }

  mapUnits = (option) => {
    if (option === 'temperature') {
      if (this.temperatureUnit === 'celsius') return '&deg;'
      else return '&deg;F'
    } else if (option === 'wind') {
      if (this.windUnit === 'kmh') return ' km/h';
      else return ' mph'
    } else if (option === 'precipitation') {
      if (this.precipitationUnit === 'mm') return ' mm';
      else return ' in'
    }
  }

  setStorage = () => {
    if (this.latitude && this.longitude && this.countryName) {
    localStorage.setItem('lon', this.longitude);
    localStorage.setItem('lat', this.latitude);
    localStorage.setItem('loc', this.location);
    localStorage.setItem('cou', this.countryName);
    }
  }
}

const updatePage = new Weather();

class Units {
  unit = 'Metric';
  unitSpan = document.querySelector('.switch-legend .unit');
  unitTemp = document.querySelectorAll('.switch .temp button');
  unitWind = document.querySelectorAll('.switch .w-speed button');
  unitPrec = document.querySelectorAll('.switch .preci button');

  constructor() {
    if (this.unit === 'Metric') this.unitSpan.innerText = 'Imperial';
    else this.unitSpan.innerText = 'Metric';
    this.switchUnitEvents();
    this.temperatureSwitch();
    this.windSwitch();
    this.precipSwitch();
    this.setStorage();
  }

  switchUnitEvents = () => {
    document.querySelector('.switch-legend').addEventListener('click', () => {
      if (this.unit === 'Imperial') {
        this.unit = 'Metric';
        this.setStorage();
        this.unitSpan.innerText = 'Imperial';
        updatePage.windUnit = 'kmh';
        this.unitWind[0].classList.add('active')
        this.unitWind[1].classList.remove('active')
        updatePage.precipitationUnit = 'mm';
        this.unitPrec[0].classList.add('active')
        this.unitPrec[1].classList.remove('active')
        updatePage.fillInfo();
      } else if (this.unit === 'Metric') {
        this.unit = 'Imperial';
        this.setStorage();
        this.unitSpan.innerText = 'Metric';
        updatePage.windUnit = 'mph';
        this.unitWind[1].classList.add('active')
        this.unitWind[0].classList.remove('active')
        updatePage.precipitationUnit = 'inch';
        this.unitPrec[1].classList.add('active')
        this.unitPrec[0].classList.remove('active')
        updatePage.fillInfo();
      }
    })
  }

  temperatureSwitch = () => {
    this.unitTemp.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        if (index === 0) {
          updatePage.temperatureUnit = 'celsius';
          updatePage.fillInfo();
          this.unitTemp[1].classList.remove('active');
          this.unitTemp[0].classList.add('active')
        } else if (index === 1) {
          updatePage.temperatureUnit = 'fahrenheit';
          updatePage.fillInfo();
          this.unitTemp[0].classList.remove('active');
          this.unitTemp[1].classList.add('active')
        }
      })
    })
  }

  windSwitch = () => {
    this.unitWind.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        if (index === 0) {
          updatePage.windUnit = 'kmh';
          updatePage.fillInfo();
          this.unitWind[1].classList.remove('active');
          this.unitWind[0].classList.add('active')
        } else if (index === 1) {
          updatePage.windUnit = 'mph';
          updatePage.fillInfo();
          this.unitWind[0].classList.remove('active');
          this.unitWind[1].classList.add('active')
        }
      })
    })
  }

  precipSwitch = () => {
    this.unitPrec.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        if (index === 0) {
          updatePage.precipitationUnit = 'mm';
          updatePage.fillInfo();
          this.unitPrec[1].classList.remove('active');
          this.unitPrec[0].classList.add('active')
        } else if (index === 1) {
          updatePage.precipitationUnit = 'inch';
          updatePage.fillInfo();
          this.unitPrec[0].classList.remove('active');
          this.unitPrec[1].classList.add('active')
        }
      })
    })
  }

  setStorage = () => {
    localStorage.setItem('unit', this.unit);
  }
}

const units = new Units();

class Search{
  name;
  searchInput = document.querySelector('.search-place');
  displaySearch = document.querySelector('.options');
  searchBtn = document.querySelector('.search-place-btn');

  constructor() {
    this.searchBtnEvent();
  }

  searching = () => {
    this.displaySearch.innerHTML = `
          <div class = "value js-value">
            <div class = "div">
              <img src = "../assets/images/icon-loading.svg" aria-hidden loading = "eager" decoding = "sync">
            </div>
            <p>Search in progress</p>
          </div>
        `;
        const d = document.querySelector('.div').style;
        const j = document.querySelector('.js-value').style;
        d.height = "fit-content";
        d.width = "fit-content";
        j.display = "flex";
        j.gap = (10 / 16) + 'rem';
        j.cursor = "wait";
        document.querySelector('.js-value p').style.fontSize = "1rem";
        const i = document.querySelector('.value .div img')
        i.animate([
          { transform: "rotate(0deg)" },
          { transform: "rotate(360deg)" }
        ],
        {
          duration: 1000,
          iterations: Infinity,
          fill: "forwards"
        }
    );
    i.style.position = "static"
  }

  searchBtnEvent = () => {
    this.searchBtn.addEventListener('click', async () => {
      if (this.searchInput.value.length > 0) {
      this.displaySearch.style.display = "flex";
        this.searching();
      const val = this.searchInput.value;
      try {
        await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${val}&count=10&language=en&format=json`).then(res => {
        return res.json();
      }).then(r => {
        if (r.results) return r.results;
        else {noSearchResult(); this.displaySearch.innerHTML = ''}
      }).then(results => {
        if (results && results.length !== 0) {
          this.displaySearch.innerHTML = '';
          results.forEach(result => {
            if (result.name && result.name !== result.country) {
            this.displaySearch.innerHTML += `
              <div class = "value">
                <button data-name = "${result.name}" data-country = "${result.country}" data-lat = "${result.latitude}" data-lon = "${result.longitude}"  class = "name">${result.name + `${result.admin1 ? ', ' + result.admin1 : ''}` + `, ${result.country}`}</button>
              </div>
            `;
            } else if (result.country) {
              this.displaySearch.innerHTML += `
              <div class = "value">
                <button data-country = "${result.country}" data-lat = "${result.latitude}" data-lon = "${result.longitude}" class = "name">${result.country}</button>
              </div>
            `;
            } else;
          })

          document.querySelectorAll('.value button').forEach(btn => {
            btn.addEventListener('click', () => {
              if (updatePage.noSearch) {
                removeNoSearchResult();
              } 
                const b = btn.dataset;
                updatePage.location = b.name ? b.name : undefined;
                updatePage.countryName = b.country;
                updatePage.latitude = b.lat;
                updatePage.longitude = b.lon;
                updatePage.setStorage();
                new Weather(updatePage.place);
                this.displaySearch.innerHTML = '';
            })
          })
      } else {
        noSearchResult();
        updatePage.noSearch = true;
      }
      })
    } catch {
      errorState();
    }
      } else {
        this.searchInput.placeholder = "Please type something"
        setTimeout(() => {
          this.searchInput.placeholder = "Search for a place..."
        }, 5000)
      }
    })
  }
}

const search = new Search();

function call() {
  const d = document.querySelectorAll('.hourly-forecast-dropdown-menu .dropdown button');
  const p = document.querySelector('.hourly-forecast-dropdown-menu .container p')

  const days = updatePage.mapDays(true);

  p.innerHTML = updatePage.hourlyForecastDay;
  d.forEach((btn, index) => {
    btn.innerHTML = days[index];

    btn.addEventListener('click', () => {
      updatePage.hourlyForecastDay = btn.innerHTML;
      updatePage.fillInfo();
    });
  });
}