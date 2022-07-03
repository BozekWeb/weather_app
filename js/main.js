//OpenWeather API Key
const API_KEY = '61af27d00228aedc9774940f38faebaa'

//OpenWeather custom variables
let lat, lon, currentWeather, forecastWeather, currentAirPolution

//DOM Elements for core features
let searchBtn
let searchInput
let searchCity
let currentTempBox
let currentTemp
let currentHumidity
let currentPressure
let currentWind
let forecastBox
let forecastBoxInner
let forecastItem
let airPollutionHeader
let airPollutionValue
let airPollutionText
let airPollutionItems
let airPollutionValues
let langPL
let langEN

//DOM Elements for language change
let navLink
let currentHumidityName
let currentPressureName
let currentWindName
let headerForecast
let headerPollution

//Variables for carousel forecast
let touchstartX
let touchMoveX
let value

//MoveCarousel
let pressed = false
let startX
let x

//Basic language setting and dictionary init
let lang = 'pl'
let dict = {
	web: '',
	temp: '',
	hum: '',
	pres: '',
	wind: '',
	navbar: '',
	navbar_e1: '',
	header_1: '',
	header_2: '',
	header_2_T: '',
	header_2_G: '',
	header_2_M: '',
	header_2_B: '',
	header_2_VB: '',
}

const FORECAST_ITEM_NUM = 16
let FORECAST_ITEM_WIDTH = 250
let FORECAST_ITEM_HEIGTH = 200
//
const main = () => {
	setLanguage()
	prepareDOMElements()
	setDOMLanguage()
	prepareDOMEvents()
	updatePage()
}

//Init DOM elements
const prepareDOMElements = () => {
	//DOM elements needed API part
	searchBtn = document.querySelector('.search__button')
	searchInput = document.querySelector('.search__input')
	searchCity = document.querySelector('.search__city')
	currentTemp = document.querySelector('.current-temperature__value')
	currentTempBox = document.querySelector('.current-temperature')
	currentHumidity = document.querySelector('.current-humidity__value')
	currentPressure = document.querySelector('.current-pressure__value')
	currentWind = document.querySelector('.current-wind__value')
	forecastBox = document.querySelector('.forecast-weather__box')
	forecastBoxInner = document.querySelector('.forecast-weather__box-inner')
	forecastItem = document.querySelector('.forecast-weather__item')
	airPollutionHeader = document.querySelector('.air-polution__header')
	airPollutionText = document.querySelector('.air-polution__header-text')
	airPollutionValue = document.querySelector('.air-polution__header-value')
	airPollutionItems = document.querySelectorAll('.air-polution__item')
	airPollutionValues = document.querySelectorAll('.air-polution__item-value')

	//Additional DOM elements for language change
	langPL = document.querySelector('.navigation__lang-item--pl')
	langEN = document.querySelector('.navigation__lang-item--en')
	navLink = document.querySelector('.navigation__link')
	currentHumidityName = document.querySelector('.current-info__item-box--humidity')
	currentPressureName = document.querySelector('.current-info__item-box--pressure')
	currentWindName = document.querySelector('.current-info__item-box--wind')
	headerForecast = document.querySelector('.header--forecast')
	headerPollution = document.querySelector('.header--pollution')
}

//Add values to language dictionary
const setLanguage = (language = 'pl') => {
	if (language === 'pl') {
		lang = language
		dict.web = 'Strona Główna'
		dict.temp = 'Temperatura'
		dict.pres = 'Ciśnienie'
		dict.hum = 'Wilgotność'
		dict.wind = 'Wiatr'
		dict.navbar = 'Wpisz miasto'
		dict.navbar_e1 = 'Niepoprawne dane'
		dict.header_1 = 'Prognoza pogody na 48 godzin'
		dict.header_2 = 'Zanieczyszczenie powietrza'
		dict.header_2_T = 'Jakość powietrza jest '
		dict.header_2_G = 'idealna'
		dict.header_2_M = 'umiarkowana'
		dict.header_2_B = 'zła'
		dict.header_2_VB = 'bardzo zła'
	} else {
		lang = language
		dict.web = 'Home'
		dict.temp = 'Temperature'
		dict.pres = 'Pressure'
		dict.hum = 'Humidity'
		dict.wind = 'Wind'
		dict.navbar = 'Enter city'
		dict.navbar_e1 = 'Incorrect data'
		dict.header_1 = 'Weather forecast for 48 hours'
		dict.header_2 = 'Air pollution'
		dict.header_2_T = 'Air quality is '
		dict.header_2_G = 'perfect'
		dict.header_2_M = 'moderate'
		dict.header_2_B = 'bad'
		dict.header_2_VB = 'very bad'
	}
}

//set lang to pl and reload content
const setLanguagePL = () => {
	lang = 'pl'
	langPL.classList.add('navigation__lang-item--active')
	langEN.classList.remove('navigation__lang-item--active')
	setLanguage(lang)
	setDOMLanguage()
	updatePage()
}

//set lang to en and reload content
const setLanguageEN = () => {
	lang = 'en'
	langEN.classList.add('navigation__lang-item--active')
	langPL.classList.remove('navigation__lang-item--active')
	setLanguage(lang)
	setDOMLanguage()
	updatePage()
}

//Set language on all DOM elements
const setDOMLanguage = () => {
	navLink.textContent = dict.web
	searchInput.placeholder = dict.navbar
	currentHumidityName.textContent = dict.hum
	currentPressureName.textContent = dict.pres
	currentWindName.textContent = dict.wind
	headerForecast.innerHTML = `<span>${dict.header_1}</span>`
	headerPollution.innerHTML = `<span>${dict.header_2}</span>`
}

//Add event listener to DOM elements
const prepareDOMEvents = () => {
	langPL.addEventListener('click', setLanguagePL)
	langEN.addEventListener('click', setLanguageEN)

	searchBtn.addEventListener('click', manageSearchBar)
	searchInput.addEventListener('keyup', enterKeyCheck)

	//Add events for touch device
	forecastBox.addEventListener('touchstart', mobileGetStartX)
	forecastBox.addEventListener('touchstop', stopTouch)
	forecastBox.addEventListener('touchmove', e => {
		mobileGetMoveX(e)
		moveForecastBox()
	})

	//adds events for mouse device
	forecastBox.addEventListener('mousedown', desktopGetStartX)
	forecastBox.addEventListener('mouseup', stopTouch)
	forecastBox.addEventListener('mouseleave', stopTouch)
	forecastBox.addEventListener('mousemove', e => {
		desktopGetMoveX(e)
		moveForecastBox()
	})
}

//First click open searchbar, second click call getWeater()
const manageSearchBar = () => {
	if (!searchInput.classList.contains('search__input--active')) {
		searchInput.classList.add('search__input--active')
	} else {
		getWeather()
	}
}

//check if enter is pressed
const enterKeyCheck = e => {
	if (e.key === 'Enter') {
		getWeather()
	}
}

//check is searchbar isn't empty and call updatePage()
const getWeather = () => {
	if (searchInput.value === '') {
		showError(dict.navbar)
	} else {
		updatePage(searchInput.value)
	}
}

//refresh API data and change data in DOM elements
async function updatePage(city = 'Jelenia Góra') {
	await getCoords(city)
	await getCurrentWeather()
	await getForecastWeather()
	await getAirPollution()
	updateCurrentWeather()
	updateForecastWeather()
	updateAirPollution()
	resetForecastBox()
}

//get lon and lat from API basis on city input
async function getCoords(city) {
	let response

	response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`)
	if (!response.ok) {
		showError()
		throw new Error(`HTTP error! status: ${response.status}`)
	} else {
		const data = await response.json()

		if (data.length === 0) {
			showError()
		} else {
			lon = await data[0].lon
			lat = await data[0].lat
			resetSearchBar()
		}
	}
}

//get current weather from API
async function getCurrentWeather() {
	let response
	response = await fetch(
		`https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&lang=${lang}&appid=${API_KEY}`
	)

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`)
	} else {
		currentWeather = await response.json()
	}
}

//get forecast weather for 5 day from API
async function getForecastWeather() {
	let response
	response = await fetch(
		`https://api.openweathermap.org/data/2.5/forecast?units=metric&lat=${lat}&lon=${lon}&lang=${lang}&appid=${API_KEY}`
	)

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`)
	} else {
		forecastWeather = await response.json()
	}
}

//get current air pollution from API
async function getAirPollution() {
	let response
	response = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`)

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`)
	} else {
		currentAirPolution = await response.json()
	}
}

//update current weather on page
const updateCurrentWeather = () => {
	searchCity.textContent = currentWeather.name + ', ' + currentWeather.sys.country
	currentTemp.innerHTML = `${currentWeather.main.temp.toFixed(1)}<span>&#176;</span>C`
	currentHumidity.textContent = `${currentWeather.main.humidity}%`
	currentPressure.textContent = `${currentWeather.main.pressure} hPa`
	currentWind.textContent = `${(currentWeather.wind.speed * 3.6).toFixed(1)} km/h`

	const status = Object.assign({}, ...currentWeather.weather)

	const weatherDay = status.icon.includes('d')

	if (weatherDay) {
		setBackgroundImage(status, 'day')
	} else {
		setBackgroundImage(status, 'night')
	}
}

//set main background basis on daytime and weather type
const setBackgroundImage = (status, day) => {
	currentTempBox.className = 'current-temperature'

	if (status.id >= 200 && status.id < 300) {
		currentTempBox.classList.add(`current-temperature--thunderstorm-${day}`)
	} else if (status.id >= 300 && status.id < 400) {
		currentTempBox.classList.add(`current-temperature--drizzle`)
	} else if (status.id >= 500 && status.id < 600) {
		currentTempBox.classList.add(`current-temperature--rain-${day}`)
	} else if (status.id >= 600 && status.id < 700) {
		currentTempBox.classList.add(`current-temperature--snow-${day}`)
	} else if (status.id >= 700 && status.id < 800) {
		currentTempBox.classList.add(`current-temperature--fog-${day}`)
	} else if (status.id === 800) {
		currentTempBox.classList.add(`current-temperature--${day}`)
	} else if (status.id > 800 && status.id < 900) {
		currentTempBox.classList.add(`current-temperature--cloud-${day}`)
	} else {
		console.log('uknown-weather')
	}
}

//generate forecast weather items on page
const updateForecastWeather = () => {
	forecastBox.style.height = `${FORECAST_ITEM_HEIGTH}px`
	forecastBoxInner.style.width = `${FORECAST_ITEM_WIDTH * FORECAST_ITEM_NUM}px`
	forecastBoxInner.textContent = ''

	for (let i = 1; i <= FORECAST_ITEM_NUM; i++) {
		const item = document.createElement('div')
		item.classList.add('forecast-weather__item')
		item.style.width = `${FORECAST_ITEM_WIDTH}px`
		item.style.heigth = `${FORECAST_ITEM_HEIGTH}px`
		forecastBoxInner.appendChild(item)

		let dateText = forecastWeather.list[i].dt_txt.split(' ')[0]
		let hourText = forecastWeather.list[i].dt_txt.split(' ')[1].slice(0, 5)

		const date = document.createElement('div')
		date.classList.add('forecast-weather__item-date')
		date.textContent = dateText + ', ' + hourText
		item.append(date)

		const info = document.createElement('div')
		info.classList.add('forecast-weather__item-info')
		item.append(info)

		const temp = document.createElement('div')
		temp.classList.add('forecast-weather__item-box')
		temp.innerHTML = `${dict.temp}: ${forecastWeather.list[i].main.temp.toFixed(1)} &#176;C`

		const pressure = document.createElement('div')
		pressure.classList.add('forecast-weather__item-box')
		pressure.textContent = `${dict.pres}: ${forecastWeather.list[i].main.pressure} hPa`

		const humidity = document.createElement('div')
		humidity.classList.add('forecast-weather__item-box')
		humidity.textContent = `${dict.hum}: ${forecastWeather.list[i].main.humidity}%`

		const wind = document.createElement('div')
		wind.classList.add('forecast-weather__item-box')
		wind.textContent = `${dict.wind}: ${(forecastWeather.list[i].wind.speed * 3.6).toFixed(1)} km/h`

		info.append(temp, pressure, humidity, wind)

		const img = document.createElement('img')
		img.classList.add('forecast-weather__item-img')
		img.setAttribute('alt', 'obrazek, przedstawiący pogodę')
		img.setAttribute('src', `https://openweathermap.org/img/wn/${forecastWeather.list[i].weather[0].icon}@2x.png`)
		item.append(img)
	}
}

//update air pollution on page
const updateAirPollution = () => {
	const pollutionArray = [
		currentAirPolution.list[0].components.pm2_5,
		currentAirPolution.list[0].components.pm10,
		currentAirPolution.list[0].components.no2,
		currentAirPolution.list[0].components.o3,
		currentAirPolution.list[0].components.so2,
		currentAirPolution.list[0].components.nh3,
	]

	const pollutionDangerArray = [
		[15, 45, 75],
		[25, 65, 130],
		[50, 120, 220],
		[60, 140, 200],
		[40, 380, 900],
		[200, 800, 1250],
	]

	airPollutionItems.forEach(item => {
		item.classList.remove('air-polution__item--good')
		item.classList.remove('air-polution__item--moderate')
		item.classList.remove('air-polution__item--bad')
		item.classList.remove('air-polution__item--very-bad')
	})

	airPollutionHeader.classList.remove('air-polution__header--good')
	airPollutionHeader.classList.remove('air-polution__header--moderate')
	airPollutionHeader.classList.remove('air-polution__header--bad')
	airPollutionHeader.classList.remove('air-polution__header--very-bad')

	airPollutionText.textContent = dict.header_2_T

	if (currentAirPolution.list[0].main.aqi === 1) {
		airPollutionHeader.classList.add('air-polution__header--good')
		airPollutionValue.innerHTML = `&nbsp;${dict.header_2_G}`
	} else if (currentAirPolution.list[0].main.aqi === 2) {
		airPollutionHeader.classList.add('air-polution__header--moderate')
		airPollutionValue.innerHTML = `&nbsp;${dict.header_2_M}`
	} else if (currentAirPolution.list[0].main.aqi === 3) {
		airPollutionHeader.classList.add('air-polution__header--bad')
		airPollutionValue.innerHTML = `&nbsp;${dict.header_2_B}`
	} else {
		airPollutionHeader.classList.add('air-polution__header--very-bad')
		airPollutionValue.innerHTML = `&nbsp;${dict.header_2_VB}`
	}

	//Add color to each pollution item
	for (let i = 0; i < pollutionArray.length; i++) {
		airPollutionValues[i].innerHTML = `${pollutionArray[i]} μg/m<sup>2</sup>`
		const array = pollutionDangerArray[i]

		if (0 < pollutionArray[i] && pollutionArray[i] <= array[0]) {
			airPollutionItems[i].classList.add('air-polution__item--good')
		} else if (array[0] < pollutionArray[i] && pollutionArray[i] <= array[1]) {
			airPollutionItems[i].classList.add('air-polution__item--moderate')
		} else if (array[1] < pollutionArray[i] && pollutionArray[i] <= array[2]) {
			airPollutionItems[i].classList.add('air-polution__item--bad')
		} else {
			airPollutionItems[i].classList.add('air-polution__item--very-bad')
		}
	}
}

//set startX on touch device
const mobileGetStartX = e => {
	startX = e.changedTouches[0].pageX - forecastBoxInner.offsetLeft
}

//set startX on mouse device
const desktopGetStartX = e => {
	pressed = true
	startX = e.offsetX - forecastBoxInner.offsetLeft
	forecastBox.style.cursor = 'grabbing'
}

//set x on touch device
const mobileGetMoveX = e => {
	x = e.changedTouches[0].pageX - startX
}

//set x on mouse device
const desktopGetMoveX = e => {
	if (!pressed) return
	e.preventDefault()
	x = e.offsetX - startX
}

//reset pressed variable and style
const stopTouch = () => {
	pressed = false
	forecastBox.style.cursor = 'grab'
}

//reset position of forecastbox
const resetForecastBox = () => {
	forecastBoxInner.style.left = `${0}px`
}

//change position of forecast box
const moveForecastBox = () => {
	let width = document.querySelector('.forecast__container').offsetWidth
	let maxWidth = FORECAST_ITEM_NUM * FORECAST_ITEM_WIDTH
	let maxBondary = -(maxWidth - width)

	if (x >= 0) {
		forecastBoxInner.style.left = `0px`
	} else if (x <= maxBondary) {
		forecastBoxInner.style.left = `${maxBondary}px`
	} else {
		forecastBoxInner.style.left = `${x}px`
	}
}

//reset searchbar into init value
const resetSearchBar = () => {
	searchInput.placeholder = dict.navbar
	searchInput.value = ''
	searchInput.classList.remove('search__input--error')
	searchInput.classList.remove('search__input--active')
}

//show error in searchbar placeholder
const showError = (text = dict.navbar_e1) => {
	searchInput.placeholder = text
	searchInput.value = ''
	searchInput.classList.add('search__input--error')
}

//start wheatherApp on page laod
document.addEventListener('DOMContentLoaded', main)
