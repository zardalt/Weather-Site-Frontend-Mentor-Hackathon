export function noSearchResult() {
  document.querySelector('main').innerHTML = `
    <p class = "search-result-none">No search result found!</p>
  `;

  const d = document.querySelector('.search-result-none').style;

  d.margin = "0 auto";
  d.fontSize = "1.25em";
  d.fontWeight = "700";
}

export function removeNoSearchResult() {
  document.querySelector('main').innerHTML = '';

  document.querySelector('main').innerHTML = `
    <div class = "left-section">

      <div class = "weather-info">
        
        <div class = "location-info">
          <p class = "location"></p>
          <p class = "date"></p>
        </div>
        <div class = "temperature-container">
          <img src = "assets/images/icon-sunny.webp" alt = "sunny" loading = "lazy" decoding = "async">
          <p></p>
        </div>

      </div>
      <div class = "weather-details-container">
        <div class = "feels-like">
          <p class = "title">Feels Like</p>
          <p class = "value">64&deg;</p>
        </div>
        <div class = "humidity">
          <p class = "title">Humidity</p>
          <p class = "value">46%</p>
        </div>
        <div class = "wind">
          <p class = "title">Wind</p>
          <p class = "value">9 mph</p>
        </div>
        <div class = "precipitation">
          <p class = "title">Precipitation</p>
          <p class = "value">0 in</p>
        </div>

      </div>
      <div class = "daily-forecast-container">
        <p class = "legend">
          Daily Forecast
        </p>

        <div class = "day"></div>
      </div>
    </div>

    <div class = "right-section">
        <div class="top-part">
          <p class = "top-title">Hourly Forecast</p>
          <div class = "hourly-forecast-dropdown-menu">
            <div class = "container" tabindex = "0">
              <p>Tuesday</p>
              <img src = "assets/images/icon-dropdown.svg" decoding = "sync" class = "unit-dropdown" aria-hidden = "true">
            </div>

            <div class = "dropdown">
              <button></button>
              <button></button>
              <button></button>
              <button></button>
              <button></button>
              <button></button>
              <button></button>
            </div>
          </div>
        </div>

        <div class = "hourly-forecast-data-container"></div>
      </div>
  `;
}