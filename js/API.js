const APIKey = 'CWB-1F2681D0-0BF1-458A-92C7-DBA3DC452170';
const requestURL =
  `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${APIKey}`;


async function getData(cities, infos) {
  if (cities.length === 0) return;

  try {
    const response = await fetch(`${requestURL}&locationName=${cities}&elementName=${infos}`);

    if (!response.ok) {
      throw new Error('Network response was not OK');
    }

    return await response.json();

  } catch (errorMsg) {
    console.error(errorMsg);
  }
}

export default getData;