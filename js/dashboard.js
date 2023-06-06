import getData from './API.js';
import { displayInfoCards, displayNoCard } from './card.js';

const cityNames = [
  '臺北市', '新北市', '基隆市', '新竹市', '桃園市', '新竹縣', '宜蘭縣', '臺中市',
  '苗栗縣', '彰化縣', '南投縣', '雲林縣', '高雄市', '臺南市', '嘉義市', '嘉義縣',
  '屏東縣', '澎湖縣', '花蓮縣', '臺東縣', '金門縣', '連江縣'
];

const displayInfo = ['天氣現象', '最高溫度', '最低溫度', '舒適度', '降雨機率'];

createCheckElements("city", cityNames, document.querySelector(".cityCheckButtons"));
createCheckElements("info", displayInfo, document.querySelector(".infoCheckButtons"));
setQueryButton();
setHidingButton();

function createCheckElements(dataTag, dataArray, targetElement) {
  dataArray.map((data, index) => {
    const newInputElement = createCheckboxElement(dataTag, data, index,);
    const newLabelElement = createLabelElement(dataTag, data, index);

    targetElement.appendChild(newInputElement);
    targetElement.appendChild(newLabelElement);
  });
}

function createCheckboxElement(dataTag, data, index,) {
  const element = document.createElement('input');

  element.type = 'checkBox';
  element.autocomplete = 'off';
  element.classList.add('btn-check');
  element.dataset[dataTag] = data;
  element.id = `${dataTag}Check-${index}`;

  return element;
}

function createLabelElement(dataTag, data, index) {
  const element = document.createElement('label');

  element.classList.add('btn', 'btn-outline-primary');
  element.htmlFor = `${dataTag}Check-${index}`;
  element.innerText = data;

  return element;
}

function setQueryButton() {
  const queryButton = document.querySelector('.queryButton');

  queryButton.addEventListener('click', () => {
    executeQuery(getSelectedCities(), getSelectedInfos());
  });
}

function getSelectedCities() {
  const cityCheckBoxes = document.querySelectorAll('.cityCheckButtons input');
  const selectedCities = [];

  cityCheckBoxes.forEach(cityCheckBox => {
    if (!cityCheckBox.checked)
      return;
    selectedCities.push(cityCheckBox.dataset.city);
  });

  return selectedCities;
}

function getSelectedInfos() {
  const infoCheckBoxes = document.querySelectorAll('.infoCheckButtons input');
  const selectedInfos = [];

  infoCheckBoxes.forEach(infoCheckBox => {
    if (!infoCheckBox.checked)
      return;
    selectedInfos.push(infoCheckBox.dataset.info);
  });

  return transformInfo(selectedInfos);
}

function transformInfo(cnInfo) {
  const transformList = {
    "天氣現象": "Wx",
    "最高溫度": "MaxT",
    "最低溫度": "MinT",
    "舒適度": "CI",
    "降雨機率": "PoP",

  }
  const enInfo = cnInfo.map(info => transformList[info]);

  return enInfo;
}

function setHidingButton() {
  const dashboard = document.querySelector('.dashboard');
  dashboard.addEventListener('click', () => {
    dashboard.classList.toggle('hiding');
  });
}

async function executeQuery(cities, infos) {
  const dashboard = document.querySelector('.dashboard');
  dashboard.classList.remove('hiding');

  if (cities.length === 0) {
    displayNoCard();
    return;
  };
  displayInfoCards(await getData(cities, infos));
}