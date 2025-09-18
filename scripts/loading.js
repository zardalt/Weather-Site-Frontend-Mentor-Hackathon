export function loading() {
  const changeableItems = [
    document.querySelector('.weather-info'),
    document.querySelectorAll('.value'),
    document.querySelectorAll('.daily'),
    document.querySelectorAll('.hourly-forecast-data')
  ]

  const containerPara = document.querySelector('.hourly-forecast-dropdown-menu .container p')

  const weatherInfoLoading = () => {
    changeableItems[0].innerHTML = `
    <div class = "loading-container">
      <div class = "three-dots">
        <canvas width = "12" height = "12">.</canvas>
        <canvas width = "12" height = "12">.</canvas>
        <canvas width = "12" height = "12">.</canvas>
      </div>
      <div class = "loading">
        Loading...
      </div>
    </div>`;
    changeableItems[0].style.background = '#262540';
    changeableItems[0].style.height = `${124 + 80}px`;
  }
  const weatherDetailsContainerLoading =() => {
    changeableItems[1].forEach(val => {
      val.innerHTML = '-';
    });
  }
  const dayLoading = () => {
    changeableItems[2].forEach(d => {
      d.innerText = '';
      d.style.background = '#262540';
      d.style.height = `171px`;
    })
  }
  const hourlyForecastDataContainerLoading = () => {
    changeableItems[3].forEach(con => {
      con.innerText = '';
      con.style.background = '#302F4a';
      con.style.height = `61px`;
    });
    containerPara.innerHTML = '-';
  }
  hourlyForecastDataContainerLoading();
  dayLoading();
  weatherDetailsContainerLoading();
  weatherInfoLoading();

  oneElemAnimation(changeableItems[0])

  changeableItems.forEach((item, index) => {
    if (index > 1) {
      item.forEach(elem => {
        oneElemAnimation(elem);
      })
    }
  })

  const canvas = document.querySelectorAll('.three-dots canvas');
  
  canvas.forEach((canv, index) => {
    const c = canv.getContext('2d');
    
    c.beginPath();
    c.arc(6, 6, 6, Math.PI*2, false);
    c.fillStyle = "white";
    c.fill();

    animateCanvas(canv, index);
  });
}


const animationParameters = {
    duration: 1000,
    iterations: Infinity,
    easing: 'ease-in-out',
    fill: 'backwards',
    direction: 'alternate'
}

function oneElemAnimation (elem) {
  elem.animate(
    [
      { backgroundColor: "#3C3B5E" },
      { backgroundColor: "#302F4A" }
    ], animationParameters
  )
}

function animateCanvas(canv, index) {
  canv.animate(
    [
      { transform: "translateY(-10px)" },
      { transform: "translateY(0px)" }
    ],
    {
      duration: 500,
      iterations: Infinity,
      easing: 'ease-in-out',
      delay: index * 250,
      fill: 'forwards',
      direction: 'alternate'
    }
  );
}