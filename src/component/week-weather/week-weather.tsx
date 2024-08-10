import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styles from './week-weather.module.css';

interface WeekWeatherItem {
  date: string;
  day: string;
  morningTemp: string;
  afternoonTemp: string;
  morningWeather: string;
  afternoonWeather: string;
  morningRainProbability: string;
  afternoonRainProbability: string;
}

interface WeekWeatherProps {
    baseDate: string;
  }
// 날씨 이미지를 위한 
const weatherIcons: { [key: string]: string } = {
맑음: '/img/sunny.png',
구름조금:'/img/smallCloud.png',
구름많음: '/img/cloudy.png',
흐림: '/img/manyCloudy.png',
비: '/img/rainy.png',
눈: '/img/snowy.png',
// 다른 날씨 아이콘도 추가
};

const weekWeatherUrl = 'YOUR_API_ENDPOINT'; // 기상청 API 엔드포인트를 여기에 입력하세요
const apiKey = 'oRIlKky8TDqSJSpMvPw6Aw'; // 기상청 API 키를 여기에 입력하세요

const img = ()=>{

}

const WeekWeather: React.FC<WeekWeatherProps> = ({baseDate }) => {
  const [weekWeatherData, setWeekWeatherData] = useState<WeekWeatherItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeekWeatherData = async () => {
      try {
        // const response = await axios.get(weekWeatherUrl, {
        //     params: {
        //     serviceKey: apiKey,
        //     numOfRows: 10,
        //     pageNo: 1,
        //     dataType: 'JSON',
        //     base_date: baseDate, // 날짜 파라미터 추가
        //     },    
        // });

        // 임시데이터
        const data = [
            {
              date: baseDate,
              day: '일요일',
              morningTemp: '25',
              afternoonTemp: '30',
              morningWeather: '맑음',
              afternoonWeather: '흐림',
              morningRainProbability: '10',
              afternoonRainProbability: '20',
            },
            {
              date: baseDate,
              day: '월요일',
              morningTemp: '24',
              afternoonTemp: '29',
              morningWeather: '맑음',
              afternoonWeather: '구름많음',
              morningRainProbability: '10',
              afternoonRainProbability: '30',
            },
            {
                date: baseDate,
                day: '월요일',
                morningTemp: '24',
                afternoonTemp: '29',
                morningWeather: '맑음',
                afternoonWeather: '구름많음',
                morningRainProbability: '10',
                afternoonRainProbability: '30',
              },
              {
                date: baseDate,
                day: '월요일',
                morningTemp: '24',
                afternoonTemp: '29',
                morningWeather: '맑음',
                afternoonWeather: '구름많음',
                morningRainProbability: '10',
                afternoonRainProbability: '30',
              },
              {
                date: baseDate,
                day: '월요일',
                morningTemp: '24',
                afternoonTemp: '29',
                morningWeather: '맑음',
                afternoonWeather: '구름많음',
                morningRainProbability: '10',
                afternoonRainProbability: '30',
              },
              {
                date: baseDate,
                day: '월요일',
                morningTemp: '24',
                afternoonTemp: '29',
                morningWeather: '맑음',
                afternoonWeather: '구름많음',
                morningRainProbability: '10',
                afternoonRainProbability: '30',
              },
              {
                date: baseDate,
                day: '월요일',
                morningTemp: '24',
                afternoonTemp: '29',
                morningWeather: '맑음',
                afternoonWeather: '구름많음',
                morningRainProbability: '10',
                afternoonRainProbability: '30',
              },
            // 나머지 일주일 데이터를 추가합니다.
          ];


        // response.data.response.body.items.item
        // const weekWeatherData = data.map((item: any) => ({
        //   date: item.fcstDate,
        //   day: item.fcstDay,
        //   morningTemp: item.taMin3,
        //   afternoonTemp: item.taMax3,
        //   morningWeather: item.wf3Am,
        //   afternoonWeather: item.wf3Pm,
        //   morningRainProbability: item.pop3Am,
        //   afternoonRainProbability: item.pop3Pm,
        // }));

        setWeekWeatherData(data);
      } catch (error) {
        setError('데이터를 가져오는 중 오류가 발생했습니다.');
        console.error('Error fetching week weather data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeekWeatherData();
  }, []);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className={styles.container}>
        <h2 className={styles.title}>일별 예보</h2>
        <div className={styles.weekWeatherContainer}>
            <div className={styles.labels}>
                <span className={styles.dateLabel}>날짜</span>
                <span className={styles.timeLabel}>시각</span>
                <span className={styles.weather}>날씨</span>
                <span className={styles.tempLabel}>기온</span>
                <span>강수확률</span>
            </div>
            <div className={styles.tableContainer}>
                {weekWeatherData.map((item, index) => (
                <div key={index} className={styles.weatherCard}>
                    <div className={styles.date}>{item.day}</div>
                    <div className={styles.weatherCardContent}>
                        <div className={styles.weatherInfo}>
                            <div className={styles.timeContainer}>
                                <div className={styles.time}>오전</div>
                            </div>
                            <img src={weatherIcons[item.morningWeather]} alt={item.morningWeather} width={30} height={30} />
                            {/* <div className={styles.weather}>{item.morningWeather}</div> */}
                            <div className={styles.temp}>{item.morningTemp}°C</div>     
                            <div className={styles.rainProb}>{item.morningRainProbability}%</div>
                        </div>
                        <div className={styles.weatherInfo}>
                            <div className={styles.timeContainer}>
                                <div className={styles.time}>오후</div>
                            </div>
                            <img src={weatherIcons[item.afternoonWeather]} alt={item.afternoonWeather} width={30} height={30} />
                            {/* <div className={styles.weather}>{item.afternoonWeather}</div> */}
                            <div className={styles.temp}>{item.afternoonTemp}°C</div>
                            <div className={styles.rainProb}>{item.afternoonRainProbability}%</div>
                        </div>
                    </div>
                </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default WeekWeather;
