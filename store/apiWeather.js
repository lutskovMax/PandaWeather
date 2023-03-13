import axios from 'axios';

export default function getWeather(latitude, longitude) {
  return axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=2debf794ddf65fd58af043580a42e985`)
    .then(response => response.data)
    .catch(error => console.log(error));
}