// weather.js — Weather & Geolocation module
// TobywithDino Personal Website
// CWA Open Data API: https://opendata.cwa.gov.tw/
//
// ⚠️ IMPORTANT: Replace 'YOUR_CWA_API_KEY' below with your personal CWA API key.
// Apply for free at: https://opendata.cwa.gov.tw/userLogin

'use strict';

/* ── API Key — replace with your own ── */
const CWA_API_KEY = 'YOUR_CWA_API_KEY';

/* ── Default location: Taipei ── */
const DEFAULT_LAT = 25.0330;
const DEFAULT_LON = 121.5654;
const DEFAULT_CITY = '臺北市';
const DEFAULT_DISPLAY = '台北市, 台灣';

/* ── Weather code → display mapping (CWA Wx code) ── */
const WEATHER_CODE_MAP = {
  1:  { emoji: '☀️',  text: '晴天' },
  2:  { emoji: '🌤️', text: '晴時多雲' },
  3:  { emoji: '⛅',  text: '多雲' },
  4:  { emoji: '⛅',  text: '多雲' },
  5:  { emoji: '⛅',  text: '多雲' },
  6:  { emoji: '⛅',  text: '多雲' },
  7:  { emoji: '☁️',  text: '陰天' },
  8:  { emoji: '☁️',  text: '陰天' },
  9:  { emoji: '☁️',  text: '陰天' },
  10: { emoji: '🌦️', text: '短暫雨' },
  11: { emoji: '🌦️', text: '短暫雨' },
  12: { emoji: '🌦️', text: '短暫雨' },
  13: { emoji: '🌦️', text: '短暫陣雨' },
  14: { emoji: '🌦️', text: '短暫陣雨' },
  15: { emoji: '🌧️', text: '雨天' },
  16: { emoji: '🌧️', text: '雨天' },
  17: { emoji: '🌧️', text: '雨天' },
  18: { emoji: '🌧️', text: '雨天' },
  19: { emoji: '🌧️', text: '雨天' },
  20: { emoji: '🌧️', text: '雨天' },
  21: { emoji: '🌧️', text: '雨天' },
  22: { emoji: '🌧️', text: '雨天' },
  23: { emoji: '⛈️',  text: '大雨' },
  24: { emoji: '⛈️',  text: '大雨' },
  25: { emoji: '⛈️',  text: '大雨' },
  26: { emoji: '⛈️',  text: '豪雨' },
  27: { emoji: '⛈️',  text: '豪雨' },
  // 28~41: 暴雨 / 雷雨
};

function getWeatherDisplay(code) {
  const c = Number(code);
  if (WEATHER_CODE_MAP[c]) return WEATHER_CODE_MAP[c];
  if (c >= 28 && c <= 41) return { emoji: '🌩️', text: '暴雨' };
  return { emoji: '🌡', text: '未知天氣' };
}

/* ── DOM helpers ── */
function setWeatherBar(data) {
  const bar = document.getElementById('weather-bar');
  if (bar) bar.classList.remove('loading');

  const elLocation = document.getElementById('location-text');
  const elIcon     = document.getElementById('weather-icon');
  const elText     = document.getElementById('weather-text');
  const elPop      = document.getElementById('pop-value');
  const elTemp     = document.getElementById('temp-value');

  if (elLocation) elLocation.textContent = data.location ?? DEFAULT_DISPLAY;
  if (elIcon)     elIcon.textContent     = data.weatherEmoji ?? '🌡';
  if (elText)     elText.textContent     = data.weatherText  ?? '--';
  if (elPop)      elPop.textContent      = data.pop  != null ? `${data.pop}%` : '--%';
  if (elTemp)     elTemp.textContent     = data.temp != null ? data.temp      : '--';
}

function setWeatherError() {
  const bar = document.getElementById('weather-bar');
  if (bar) {
    bar.classList.remove('loading');
    bar.innerHTML = '<span>⚠️ 天氣資訊暫時無法取得</span>';
  }
}

function setLoadingState() {
  const bar = document.getElementById('weather-bar');
  if (bar) bar.classList.add('loading');
}

/* ── CWA API call ── */
async function fetchCWAWeather(cityName) {
  if (CWA_API_KEY === 'YOUR_CWA_API_KEY') {
    console.warn('[weather.js] CWA API key not set. Please replace YOUR_CWA_API_KEY.');
    setWeatherError();
    return;
  }

  const url = new URL(
    'https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001'
  );
  url.searchParams.set('Authorization', CWA_API_KEY);
  url.searchParams.set('locationName', cityName);
  url.searchParams.set('elementName', 'Wx,PoP,MinT,MaxT');

  let res;
  try {
    res = await fetch(url.toString());
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  } catch (err) {
    console.warn('[weather.js] Fetch failed:', err);
    setWeatherError();
    return;
  }

  let json;
  try {
    json = await res.json();
  } catch (err) {
    console.warn('[weather.js] JSON parse failed:', err);
    setWeatherError();
    return;
  }

  try {
    const location = json.records.location[0];
    const elements = {};
    location.weatherElement.forEach(el => { elements[el.elementName] = el; });

    // Wx: weather code is inside parameterValue of the first time period
    const wxCode    = elements['Wx']?.time[0]?.parameter?.parameterValue ?? '0';
    const pop       = elements['PoP']?.time[0]?.parameter?.parameterName ?? null;
    const minT      = elements['MinT']?.time[0]?.parameter?.parameterName ?? null;
    const maxT      = elements['MaxT']?.time[0]?.parameter?.parameterName ?? null;

    const { emoji, text } = getWeatherDisplay(wxCode);

    // Show average of min/max or just min
    let temp = null;
    if (minT !== null && maxT !== null) {
      temp = `${minT}~${maxT}`;
    } else if (minT !== null) {
      temp = minT;
    }

    setWeatherBar({
      weatherEmoji: emoji,
      weatherText:  text,
      pop:          pop,
      temp:         temp,
    });
  } catch (err) {
    console.warn('[weather.js] Data parse failed:', err);
    setWeatherError();
  }
}

/* ── Reverse geocoding: coords → city name (display only) ── */
async function reverseGeocode(lat, lon) {
  // Uses nominatim (free, no key required)
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=zh-TW`;
  try {
    const res = await fetch(url, {
      headers: { 'Accept-Language': 'zh-TW' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    // e.g. data.address.city / county / town
    const city  = data.address?.city || data.address?.county || data.address?.town || '';
    const country = data.address?.country || '';
    return city ? `${city}, ${country}` : null;
  } catch (_e) {
    return null;
  }
}

/* ── Map display city name to CWA location name ── */
function toCWACity(displayCity) {
  // Map common variations to CWA accepted names
  const MAP = {
    '台北': '臺北市', '臺北': '臺北市', '台北市': '臺北市', '臺北市': '臺北市',
    '新北': '新北市', '新北市': '新北市',
    '桃園': '桃園市', '桃園市': '桃園市',
    '台中': '臺中市', '臺中': '臺中市', '台中市': '臺中市', '臺中市': '臺中市',
    '台南': '臺南市', '臺南': '臺南市', '台南市': '臺南市', '臺南市': '臺南市',
    '高雄': '高雄市', '高雄市': '高雄市',
    '基隆': '基隆市', '基隆市': '基隆市',
    '新竹': '新竹市', '新竹市': '新竹市', '新竹縣': '新竹縣',
    '苗栗': '苗栗縣', '苗栗縣': '苗栗縣',
    '彰化': '彰化縣', '彰化縣': '彰化縣',
    '南投': '南投縣', '南投縣': '南投縣',
    '雲林': '雲林縣', '雲林縣': '雲林縣',
    '嘉義': '嘉義市', '嘉義市': '嘉義市', '嘉義縣': '嘉義縣',
    '屏東': '屏東縣', '屏東縣': '屏東縣',
    '宜蘭': '宜蘭縣', '宜蘭縣': '宜蘭縣',
    '花蓮': '花蓮縣', '花蓮縣': '花蓮縣',
    '台東': '臺東縣', '臺東': '臺東縣', '台東縣': '臺東縣', '臺東縣': '臺東縣',
    '澎湖': '澎湖縣', '澎湖縣': '澎湖縣',
    '金門': '金門縣', '金門縣': '金門縣',
    '連江': '連江縣', '馬祖': '連江縣',
  };
  if (!displayCity) return DEFAULT_CITY;
  // Try to find a key that is contained within the display city string
  for (const [key, val] of Object.entries(MAP)) {
    if (displayCity.includes(key)) return val;
  }
  return DEFAULT_CITY;
}

/* ── Main entry: resolve location then fetch weather ── */
async function initWeather(lat, lon, displayName = null) {
  setLoadingState();

  let locationLabel = displayName;
  let cwaCity = DEFAULT_CITY;

  if (displayName) {
    cwaCity = toCWACity(displayName);
  } else {
    // Try reverse geocoding for display label
    const geo = await reverseGeocode(lat, lon);
    if (geo) {
      locationLabel = geo;
      cwaCity = toCWACity(geo);
    } else {
      locationLabel = DEFAULT_DISPLAY;
    }
  }

  // Update location label in DOM first
  const elLocation = document.getElementById('location-text');
  if (elLocation) elLocation.textContent = locationLabel ?? DEFAULT_DISPLAY;

  await fetchCWAWeather(cwaCity);
}

/* ── Public API: allow external callers to push a new location ── */
export function setLocation(lat, lon, cityName = null) {
  initWeather(lat, lon, cityName);
}

/* ── Bootstrap: priority order: URL params → Geolocation → default ── */
(function bootstrap() {
  // 1. Check URL query params: ?lat=xx&lon=xx
  const params = new URLSearchParams(window.location.search);
  const qLat = parseFloat(params.get('lat'));
  const qLon = parseFloat(params.get('lon'));

  if (!isNaN(qLat) && !isNaN(qLon)) {
    initWeather(qLat, qLon);
    return;
  }

  // 2. Try browser Geolocation
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        initWeather(pos.coords.latitude, pos.coords.longitude);
      },
      (_err) => {
        // 3. Fallback to default Taipei
        initWeather(DEFAULT_LAT, DEFAULT_LON, DEFAULT_DISPLAY);
      },
      { timeout: 6000, maximumAge: 300000 }
    );
  } else {
    // 3. Geolocation not supported
    initWeather(DEFAULT_LAT, DEFAULT_LON, DEFAULT_DISPLAY);
  }
})();
