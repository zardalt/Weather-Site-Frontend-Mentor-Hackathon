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