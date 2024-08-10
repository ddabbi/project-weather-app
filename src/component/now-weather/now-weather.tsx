import React from 'react';
import styles from './now-weather.module.css';
import Image from 'next/image';

interface ShortWeatherItem {
  baseDate: string;
  baseTime: string;
  category: string;
  nx: number;
  ny: number;
  obsrValue: string;
}

interface SunriseSunsetItem {
  sunrise: string;
  sunset: string;
}

interface WeatherDisplayProps {
  weatherData: ShortWeatherItem[];
  sunriseSunsetData: SunriseSunsetItem[];
}

const extractWeatherData = (data: ShortWeatherItem[]) => {
  return {
    temperature: data.find(item => item.category === 'T1H')?.obsrValue || '',
    humidity: data.find(item => item.category === 'REH')?.obsrValue || '',
    rainfall: data.find(item => item.category === 'RN1')?.obsrValue || '',
    windSpeed: data.find(item => item.category === 'WSD')?.obsrValue || '',
    windDirection: data.find(item => item.category === 'VEC')?.obsrValue || '',
  };
};

const getWindDirection = (vec: string) => {
  const direction = parseInt(vec, 10);
  if (direction >= 337.5 || direction < 22.5) return '북';
  if (direction >= 22.5 && direction < 67.5) return '북동';
  if (direction >= 67.5 && direction < 112.5) return '동';
  if (direction >= 112.5 && direction < 157.5) return '남동';
  if (direction >= 157.5 && direction < 202.5) return '남';
  if (direction >= 202.5 && direction < 247.5) return '남서';
  if (direction >= 247.5 && direction < 292.5) return '서';
  if (direction >= 292.5 && direction < 337.5) return '북서';
  return '';
};

const formatTime = (timeString: string): string => {
  const hours = timeString.slice(0, 2);
  const minutes = timeString.slice(2, 4);
  return `${hours}:${minutes}`;
};

const NowWeather: React.FC<WeatherDisplayProps> = ({ weatherData, sunriseSunsetData }) => {
  const weather = extractWeatherData(weatherData);
  const windDirection = getWindDirection(weather.windDirection);
  const sunriseSunset = sunriseSunsetData[0] || {};

  const formattedSunrise = formatTime(sunriseSunset.sunrise || '');
  const formattedSunset = formatTime(sunriseSunset.sunset || '');

  return (
    <div className={styles.weatherContainer}>
      <div className={styles.temperature}>
        <h1>{weather.temperature}°C</h1>
        <Image src="/img/tempIcon.png" alt="온도" width={30} height={30} />
      </div>
      <div className={styles.details}>
        <div className={styles.detailItem}>
          <div className={styles.detailInner}>
            <Image src="/img/humidityIcon.png" alt="습도" width={24} height={24} />
            <p className={styles.detailTitle}>습도</p>
          </div>
          <p className={styles.detailVal}>{weather.humidity}%</p>
        </div>
        <div className={styles.detailItem}>
          <div className={styles.detailInner}>
            <Image src="/img/windIcon.png" alt="바람" width={24} height={24} />
            <p className={styles.detailTitle}>바람</p>
          </div>
          <p className={styles.detailVal}>{windDirection} {weather.windSpeed}m/s</p>
        </div>
        <div className={styles.detailItem}>
          <div className={styles.detailInner}>
            <Image src="/img/rainIcon.png" alt="강수량" width={24} height={24} />
            <p className={styles.detailTitle}>강수량</p>
          </div>
          <p className={styles.detailVal}>{weather.rainfall} mm</p>
        </div>
      </div>
      <div className={styles.sunTimes}>
        <div className={styles.sunriseTime}>
          <Image src="/img/sunriseIcon.png" alt="일출" width={24} height={24} />
          <p>일출 {formattedSunrise}</p>
        </div>
        <div className={styles.sunsetTime}>
          <Image src="/img/sunsetIcon.png" alt="일몰" width={24} height={24} />
          <p>일몰 {formattedSunset}</p>
        </div>
      </div>
    </div>
  );
};

export default NowWeather;
