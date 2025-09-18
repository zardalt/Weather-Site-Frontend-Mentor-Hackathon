export function errorState() {
  const headerCode = `
    <header>

      <div class = "logo">
        <img src = "assets/images/logo.svg" decoding = "sync">
      </div>

      <div class = "unit-dropdown-menu">
        <div tabindex="0" class = "container">
          <img class = "units-icon" src = "assets/images/icon-units.svg" decoding = "sync" alt = "logo">
          <p>Units</p>
          <img src = "assets/images/icon-dropdown.svg" decoding = "sync" class = "unit-dropdown" aria-hidden = "true">
        </div>

        <div class = "switch">
          <button class = "switch-legend">Switch to <span class = "unit">Imperial</span></button>

          <div class = "indi temp">
            <p>Temperature</p>

            <button class = "active btn-1">Celsius (&deg;C)</button>
            <button class = "btn-2">Fahrenheit (&deg;F)</button>
          </div>

          <hr>

          <div class = "indi w-speed">
            <p>Wind Speed</p>

            <button class = "active btn-1">km/h</button>
            <button class = "btn-2">mph</button>
          </div>

          <hr>

          <div class = "indi preci">
            <p>Precipitation</p>

            <button class = "active btn-1">Millimetres (mm)</button>
            <button class = "btn-2">Inches (in)</button>
          </div>
        </div>
      </div>
    </header>
  `;

  const errorCode = `
    <div class = "error-container">
      <img src = "../assets/images/icon-error.svg" alt = "error icon" aria-hidden = "true" loading = "eager" decoding = "sync">

      <h1>Something went wrong</h1>

      <p>We couldn't connect to the server (API error). Please try again in a few moments.</p>

      <div>
        <button>
          <img src = "../assets/images/icon-retry.svg" alt = "retry icon" aria-hidden = "true" loading = "eager" decoding = "sync">
          <p>Retry</p>
        </button>
      </div>
    </div>
  `;

  document.body.innerHTML = headerCode + errorCode;
}