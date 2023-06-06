function createCardElement(location) {
  const element = document.createElement('div');
  const locationName = location.locationName;
  const { wx, pop, mint, ci, maxt } = reorganizedData(location)[0];

  element.classList.add('card', 'col-xs-12', 'flex-grow-1', 'flex-shrink-0');
  element.dataset.period = 0;
  element.innerHTML = `
    <div class="card-header">
      <h3 class="card-title">${locationName}</h3>
      <h5 class="timeText text-center text-primary d-xl-none mb-0">近12小時</h5>
      <button class="switchPeriodButton btn btn-secondary btn-sm d-xl-none">
        其他時段
      </button>
      <ul class="nav nav-tabs card-header-tabs d-none d-xl-flex">
        <li class="nav-item">
          <a class="nav-link active" aria-current="true" href="#">近12小時</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">12至24小時</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">24至36小時</a>
        </li>
      </ul>
    </div>
    <ul class="list-group list-group-flush">
      ${wx ? '<li class="list-group-item">天氣: ' + wx : ''}
      ${maxt ? '<li class="list-group-item">最高溫度: ' + maxt + '°C' : ''}
      ${mint ? '<li class="list-group-item">最低溫度: ' + mint + '°C' : ''}
      ${ci ? '<li class="list-group-item">舒適度: ' + ci : ''}
      ${pop ? '<li class="list-group-item">降雨機率: ' + pop + '%' : ''}
    </ul >
  `;

  return element;
}

function reorganizedData(data) {
  const result = [];

  for (let i = 0; i < 3; i++) {
    const obj = {};

    data.weatherElement.forEach(element => {
      obj[element.elementName.toLowerCase()] = element.time[i].parameter.parameterName;
    });

    result.push(obj);
  }

  return result;
}

function getTimesFromData(data, timePeriod) {
  let { startTime, endTime } = data.weatherElement[0].time[timePeriod];
  startTime = setTimeString(startTime);
  endTime = setTimeString(endTime);

  return { startTime, endTime };
}

function setTimeString(timeString) {
  return timeString.slice(5, 16);
}

function displayInfoCards(data) {
  const displayContent = document.querySelector('.displayContent');

  displayContent.innerHTML = "";

  data.records.location.forEach(locationData => {
    const newCardElement = createCardElement(locationData);

    displayContent.appendChild(newCardElement);
    setSwitchListener(newCardElement, locationData);
  });
}

function displayNoCard() {
  const displayContent = document.querySelector('.displayContent');
  displayContent.innerHTML = '選擇至少一個城市';
}

function setSwitchListener(cardElement, data) {
  const navItems = cardElement.querySelectorAll('.nav-item');
  const navLinks = cardElement.querySelectorAll('.nav-link');

  const switchPeriodButton = cardElement.querySelector('.switchPeriodButton');

  navItems.forEach((navItem, index) => {
    navItem.addEventListener('click', e => {
      cardElement.dataset.period = index;
      setTimeText(cardElement);
      setActiveClass(e.target);
      setContent(cardElement, data);
    });
  });

  switchPeriodButton.addEventListener('click', (e) => {
    let newPeriod = switchToNextPeriod(cardElement);
    setTimeText(cardElement);
    setActiveClass(navLinks[newPeriod]);
    setContent(cardElement, data);
  });

  function setActiveClass(newActiveElement) {
    const navLinks = cardElement.querySelectorAll('.nav-link');
    navLinks.forEach(navLink => navLink.classList.remove('active'));
    newActiveElement.classList.add('active');
  }

}

function switchToNextPeriod(cardElement) {

  if (cardElement.dataset.period === '0') {
    cardElement.dataset.period = '1';
  } else if (cardElement.dataset.period === '1') {
    cardElement.dataset.period = '2';
  } else if (cardElement.dataset.period === '2') {
    cardElement.dataset.period = '0';
  } else {
    console.error("wrong period");
  }

  return cardElement.dataset.period;
}

function setContent(cardElement, data) {
  const listGroupElement = cardElement.querySelector('.list-group');
  const { wx, pop, mint, ci, maxt } = reorganizedData(data)[cardElement.dataset.period];

  listGroupElement.innerHTML = `
    ${wx ? '<li class="list-group-item">天氣: ' + wx : ''}
    ${maxt ? '<li class="list-group-item">最高溫度: ' + maxt + '°C' : ''}
    ${mint ? '<li class="list-group-item">最低溫度: ' + mint + '°C' : ''}
    ${ci ? '<li class="list-group-item">舒適度: ' + ci : ''}
    ${pop ? '<li class="list-group-item">降雨機率: ' + pop + '%' : ''}
  `;
}

function setTimeText(cardElement) {
  const timeTextElement = cardElement.querySelector('.timeText');
  let timeTextContent = '';
  if (cardElement.dataset.period === '0') {
    timeTextContent = '近12小時';
  } else if (cardElement.dataset.period === '1') {
    timeTextContent = '12至24小時';
  } else if (cardElement.dataset.period === '2') {
    timeTextContent = '24至36小時';
  } else {
    console.error("wrong period");
  }

  timeTextElement.innerText = timeTextContent;
}

export { displayInfoCards, displayNoCard };  