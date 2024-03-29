const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const grantAccessButton=document.querySelector("[data-grantAccess]");
const searchInput=document.querySelector("[data-searchInput]");

let oldTab=userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
oldTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(newTab) {
    if(newTab != oldTab) {
        oldTab.classList.remove("current-tab");
        oldTab = newTab;
        oldTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")) {
            //kya search form wala container is invisible, if yes then make it visible
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else {
            //main pehle search wale tab pr tha, ab your weather tab visible karna h 
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //ab main your weather tab me aagya hu, toh weather bhi display karna poadega, so let's check local storage first
            //for coordinates, if we haved saved them there.
            getfromSessionStorage();
        }
    }
}


userTab.addEventListener("click",()=>{
    switchTab(userTab);
});
searchTab.addEventListener("click",()=>{
    switchTab(searchTab);
});

//check whether cordinate are aviallable or not
function getfromSessionStorage(){
    const localCoordinates= sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        // agr nahi hai to
        grantAccessContainer.classList.add("active");
    }
    else{
       //agaer hai to coordiTE ko json string me convert krke api call krdo
       const coordinates=JSON.parse(localCoordinates);
       fetchUserWeatherInfo(coordinates);
    }
}
async function fetchUserWeatherInfo(coordinates){
    const {lat,lon} = coordinates;
     // make grantcontainer invisible
     grantAccessContainer.classList.remove("active");
     //make loader visible
     loadingScreen.classList.add("active");
     //Api call
     try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        const data=await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);

        }
        catch(err){
            loadingScreen.classList.remove("active");
        }
     }
    function renderWeatherInfo(weatherInfo){
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");
    //fetch all value and put it into the UI
    cityName.innerText=weatherInfo?.name;
    countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText= weatherInfo?.weather?.[0]?.description;
    weatherIcon.src=`http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText=`${weatherInfo?.main?.temp}°C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;


     }
     function getLocation() {
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        }
        else {
            //HW - show an alert for no gelolocation support available
        }
    }
    
    function showPosition(position) {
    
        const userCoordinates = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
        }
    
        sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
        fetchUserWeatherInfo(userCoordinates);
    
    }
    grantAccessButton.addEventListener("click",getLocation);
    searchForm.addEventListener("click",(e)=>{
        e.preventDefault();
        let cityName=searchInput.value;
        if(cityName === ""){
            return ;
        }
        else{
            fetchSearchWeatherInfo(cityName);
        }
    })
    
async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        //hW
    }
}
    
   