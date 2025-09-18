import { loading } from './loading.js';

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


  // test open meteo geolocation api
/*

  const temperatureUnit = 'celsius';
  const windUnit = 'km/h';
  const precipitation = 'millimetres';

function getStateDetails(state) {
  let location = state.split(' ').join('+');
  console.log(location);
  const f = fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${location}&count=10&language=en&format=json`).then((r) => {
    let res = r.json();
    return res;
  }).then((res) => {
    console.log(res);
    return {
    stateName: res['results'][0].admin1, 
    countryName: res['results'][0].country, 
    longitude: res['results'][0].longitude, 
    latitude: res['results'][0].latitude
    };
  });
  return f;
}

async function run() {
  const stateDetails = await getStateDetails('calabar');
  console.log(stateDetails);
}
run();

function getWeatherInfo(longitude, latitude, temperatureUnit, windUnit, precipitationUnit) {
  fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min&hourly=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m&start_date=2025-09-11&end_date=2025-09-17${temperatureUnit ? '&temperature_unit=' + temperatureUnit : ''}${windUnit ? '&wind_speed_unit=' + windUnit : ''}${precipitationUnit ? '&precipitation_unit=' + precipitationUnit : ''}`).then(r => {
    return r.json();
  }).then(res => {
    console.log(res);
  });
}

getWeatherInfo('8.08577', '4.87649', 'celsius', 'kmh', 'mm');

*/

loading();