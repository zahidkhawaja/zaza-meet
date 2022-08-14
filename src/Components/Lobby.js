import "../App.css"
import { useState, useEffect } from 'react';
import axios from 'axios';

function Lobby() {

  const [dt, setDt] = useState(new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }));
  const [lat, setLat] = useState();
  const [lon, setLon] = useState();
  const [temp, setTemp] = useState();
  const [city, setCity] = useState();

  const apiKey = process.env.REACT_APP_API_KEY;

  const fetchCoordinates = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setLat(pos.coords.latitude);
      setLon(pos.coords.longitude);
    })
  }

  useEffect(() => {
    axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`)
        .then(res => {
          setTemp(res.data.main.temp);
          setCity(res.data.name);
        }
        )
        .catch(err => {
          console.log(err);
        }
        ) 
  }, [lon, lat, apiKey]);

  useEffect(() => {
    let secTimer = setInterval( () => {
      setDt(new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }))
    },1000)

    return () => clearInterval(secTimer);
}, []);

  return (
      <div className='App-body'>
        <div className='all-content'>
          <div className = "left-side">
            <div className = "left-top">
            <div className = "new-meeting" onClick = {() => window.location.href = 'https://meet.atlzaza.com'}>
              <p>Join Meeting</p>
              </div>
              </div>
            </div>
            <div className = "right-side">
              <div className = "date">
              {/* Current time without seconds */}
              <p id = "time">{dt}</p>
              {/* Current date, formatted as day of the week and date*/}
              <p id = "day">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
              {/* Temp is fetched as kelvin */}
              {temp ? <p id = "temperature">{city}: {Math.round(((temp-273.15)*1.8)+32)} F</p>: <p id = "location"></p>}
              {!lon ? <button className = "fetch-location" onClick = {() => fetchCoordinates()}>Check Weather</button> : null}
              </div>
              </div>
        </div>
        </div>
  );
}

export default Lobby;
