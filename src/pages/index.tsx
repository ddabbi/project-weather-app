// 의존성 임포트
import Head from "next/head";
import dynamic from 'next/dynamic';
import { Inter } from "next/font/google";
import axios from "axios";
import { GetServerSideProps } from "next";

// 스타일 임포트
import styles from "@/styles/Home.module.css";

// 동적 임포트
const KakaoMap = dynamic(() => import('@/component/kakao-map/kakao_map'), {
  ssr: false,
});
const NowWeather = dynamic(() => import('@/component/now-weather/now-weather'), {
  ssr: false,
});
const TimeWeather = dynamic(() => import('@/component/time-weather/time-weather'), {
  ssr: false,
});
const WeekWeather = dynamic(()=>import('@/component/week-weather/week-weather'),{
  ssr: false,
})

const inter = Inter({ subsets: ["latin"] });

interface ShortWeatherResponse {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    },
    body: {
      dataType: string;
      items: {
        item: ShortWeatherItem[];
      };
      pageNo: number;
      numOfRows: number;
      totalCount: number;
    }
  }
}

interface TimeWeatherItem {
  baseDate : string;
  baseTime : string;
  category : string;
  fcstDate : string;
  fcstTime : string;
  fcstValue : string;
  nx:number;
  ny:number;
}

interface ShortWeatherItem {
  baseDate: string;
  baseTime: string;
  category: string;
  nx: number;
  ny: number;
  obsrValue: string;
}

interface SunriseSunsetResponse {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items: {
        item: SunriseSunsetItem[];
      };
      numOfRows: number;
      pageNo: number;
      totalCount: number;
    };
  };
}

interface SunriseSunsetItem {
  sunrise: string;
  sunset: string;
}

interface HomeProps {
  weatherData: ShortWeatherItem[];
  sunriseSunsetData: SunriseSunsetItem[];
  weatherShortData : TimeWeatherItem[];
}

const weatherUrl = 'https://apihub.kma.go.kr/api/typ02/openApi/VilageFcstInfoService_2.0/getUltraSrtNcst';
const sunriseSunsetUrl = 'http://apis.data.go.kr/B090041/openapi/service/RiseSetInfoService/getAreaRiseSetInfo';
const weatherAuthKey = 'oRIlKky8TDqSJSpMvPw6Aw';
const sunriseSunsetAuthKey = 'yaffGNRuw48SPoAj/aHF91dtGjGx87nkQopY9gR0iMQXDo8rcfNIfeniedTYxbzSMCAQZgcwO5H/KG2J2nYOLw==';


const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, '0');
const day = String(now.getDate()).padStart(2, '0');
const hours = String(now.getHours()).padStart(2, '0');
const minutes = String(now.getMinutes()).padStart(2, '0');
const base_date = `${year}${month}${day}`.trim();
const base_time = `${hours}${minutes}`.trim();
console.log(base_date);
console.log(base_time);


const weatherShortUrl = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=t9p6up5q88nSC%2FMPvWuuNlJKZ23e9LGZeGU4aaIOxDp0Rinq7FVxlPK5jKxgJNSV4LQKWNN4qT1KwyLTV3GaSQ%3D%3D&pageNo=1&numOfRows=1000&dataType=JSON&base_date=${base_date}&base_time=0500&nx=55&ny=127`;



export const getServerSideProps: GetServerSideProps = async () => {

  const weatherParams = {
    pageNo: 1,
    numOfRows: 1000,
    dataType: 'json',
    base_date: base_date,
    base_time: base_time,
    nx: 55,
    ny: 127,
    authKey: weatherAuthKey
  };

  const sunriseSunsetParams = {
    location: '서울',
    locdate: base_date,
    ServiceKey: sunriseSunsetAuthKey
  };

  
  try {
    const jsonWeatherData = await axios.get<ShortWeatherResponse>(weatherUrl, { params: weatherParams });
    const weatherData = jsonWeatherData.data.response.body.items.item;
    
    const sunriseSunsetResponse = await axios.get(sunriseSunsetUrl, { params: sunriseSunsetParams});
    const item = sunriseSunsetResponse.data.response.body.items.item;
    const sunriseSunsetData = item ? [{
      sunrise: item.sunrise.trim(),
      sunset: item.sunset.trim()
    }] : [];

    const jsonWeatherShortData = await axios.get(weatherShortUrl);
    const weatherShortData = jsonWeatherShortData.data.response.body.items.item;
    
    return {
      props: {
        weatherData,
        sunriseSunsetData: sunriseSunsetData,
        weatherShortData
      }
    };
  } catch (error) {
    console.error('데이터를 가져오는 중 오류 발생:', error);
    return {
      props: {
        weatherData: [],
        sunriseSunsetData: [],
        weatherShortData: []
      }
    };
  }
};

const Home = ({ weatherData, sunriseSunsetData,weatherShortData }: HomeProps) => {
  console.log(weatherShortData);
  return (
    <div>
      <div className={styles.topSection}>
        <KakaoMap />
        <NowWeather weatherData={weatherData} sunriseSunsetData={sunriseSunsetData} />
      </div>
      <div>
        {/* 주간일보 */}
        <WeekWeather baseDate={base_date}/>
      </div>
      <div>
        <TimeWeather 
          weatherData={weatherShortData} 
        />
      </div>
    </div>
  );
}

export default Home;
