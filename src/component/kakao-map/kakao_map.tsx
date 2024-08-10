import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Map, CustomOverlayMap } from "react-kakao-maps-sdk";
import styles from './kakao_map.module.css';

const regions: Region[] = [
  { name: "서울", lat: 37.5665, lng: 126.9780, nx: 60, ny: 127 },
  { name: "부산", lat: 35.1796, lng: 129.0756, nx: 98, ny: 76 },
  { name: "대구", lat: 35.8714, lng: 128.6014, nx: 89, ny: 90 },
  { name: "인천", lat: 37.4563, lng: 126.7052, nx: 55, ny: 124 },
  { name: "광주", lat: 35.1601, lng: 126.8514, nx: 58, ny: 74 },
  { name: "대전", lat: 36.3504, lng: 127.3845, nx: 67, ny: 100 },
  { name: "울산", lat: 35.5384, lng: 129.3114, nx: 102, ny: 84 },
  { name: "세종", lat: 36.4801, lng: 127.2890, nx: 66, ny: 103 },
  { name: "제주", lat: 33.4996, lng: 126.5312, nx: 52, ny: 38 },
  { name: "강릉", lat: 37.7519, lng: 128.8761, nx: 92, ny: 131 },
  { name: "원주", lat: 37.3422, lng: 127.9204, nx: 75, ny: 115 },
  { name: "수원", lat: 37.2636, lng: 127.0286, nx: 60, ny: 121 },
  { name: "청주", lat: 36.6424, lng: 127.4890, nx: 69, ny: 107 },
  { name: "천안", lat: 36.8152, lng: 127.1139, nx: 66, ny: 111 },
  { name: "전주", lat: 35.8242, lng: 127.1470, nx: 63, ny: 89 },
  { name: "목포", lat: 34.8118, lng: 126.3924, nx: 51, ny: 67 },
  { name: "포항", lat: 36.0190, lng: 129.3435, nx: 102, ny: 94 },
  { name: "안동", lat: 36.5684, lng: 128.7294, nx: 91, ny: 106 },
  { name: "창원", lat: 35.2270, lng: 128.6811, nx: 89, ny: 77 },
  { name: "진주", lat: 35.1798, lng: 128.1076, nx: 90, ny: 75 },
  { name: "통영", lat: 34.8544, lng: 128.4336, nx: 86, ny: 67 },
  { name: "김해", lat: 35.2285, lng: 128.8896, nx: 92, ny: 77 },
  { name: "거제", lat: 34.8804, lng: 128.6214, nx: 89, ny: 69 },
  { name: "광양", lat: 34.9403, lng: 127.6956, nx: 76, ny: 72 },
  { name: "여수", lat: 34.7604, lng: 127.6622, nx: 77, ny: 67 },
  { name: "순천", lat: 34.9507, lng: 127.4875, nx: 76, ny: 72 },
  { name: "남원", lat: 35.4166, lng: 127.3850, nx: 68, ny: 80 },
  { name: "군산", lat: 35.9677, lng: 126.7361, nx: 56, ny: 92 },
  { name: "경주", lat: 35.8562, lng: 129.2247, nx: 100, ny: 90 },
  { name: "속초", lat: 38.2043, lng: 128.5916, nx: 87, ny: 141 },
  { name: "평창", lat: 37.3704, lng: 128.3906, nx: 76, ny: 115 },
  { name: "춘천", lat: 37.8813, lng: 127.7298, nx: 73, ny: 134 },
  { name: "양양", lat: 38.0752, lng: 128.6191, nx: 87, ny: 139 },
  { name: "동해", lat: 37.5247, lng: 129.1142, nx: 98, ny: 127 },
  { name: "삼척", lat: 37.4502, lng: 129.1658, nx: 98, ny: 126 },
  { name: "태백", lat: 37.1648, lng: 128.9850, nx: 95, ny: 120 },
  { name: "보령", lat: 36.3336, lng: 126.6126, nx: 55, ny: 101 },
  { name: "서산", lat: 36.7845, lng: 126.4501, nx: 55, ny: 110 },
  { name: "당진", lat: 36.8897, lng: 126.6282, nx: 53, ny: 111 },
  { name: "홍성", lat: 36.6016, lng: 126.6608, nx: 54, ny: 106 },
  { name: "논산", lat: 36.2038, lng: 127.0842, nx: 66, ny: 100 },
  { name: "계룡", lat: 36.2740, lng: 127.2486, nx: 68, ny: 102 },
  { name: "공주", lat: 36.4467, lng: 127.1190, nx: 67, ny: 105 },
  { name: "부여", lat: 36.2754, lng: 126.9097, nx: 64, ny: 102 },
  { name: "천안", lat: 36.8151, lng: 127.1139, nx: 66, ny: 111 },
  { name: "아산", lat: 36.7895, lng: 127.0042, nx: 65, ny: 110 },
  { name: "예산", lat: 36.6803, lng: 126.8500, nx: 57, ny: 108 },
  { name: "청양", lat: 36.4607, lng: 126.8008, nx: 59, ny: 104 },
  { name: "태안", lat: 36.7454, lng: 126.2976, nx: 48, ny: 109 },
  { name: "홍천", lat: 37.6971, lng: 127.8886, nx: 74, ny: 128 },
  { name: "철원", lat: 38.1469, lng: 127.3131, nx: 65, ny: 140 },
  { name: "화천", lat: 38.1064, lng: 127.7081, nx: 73, ny: 140 },
  { name: "인제", lat: 38.0694, lng: 128.1708, nx: 79, ny: 139 },
  { name: "양구", lat: 38.1104, lng: 128.0843, nx: 78, ny: 139 },
  { name: "고성", lat: 38.3784, lng: 128.4677, nx: 83, ny: 144 },
  { name: "김포", lat: 37.6191, lng: 126.7150, nx: 55, ny: 128 },
  { name: "광주(경기)", lat: 37.4293, lng: 127.2557, nx: 62, ny: 122 },
  { name: "군포", lat: 37.3617, lng: 126.9353, nx: 58, ny: 120 },
  { name: "남양주", lat: 37.6366, lng: 127.2165, nx: 63, ny: 127 },
  { name: "안양", lat: 37.3943, lng: 126.9568, nx: 59, ny: 121 },
  { name: "오산", lat: 37.1454, lng: 127.0664, nx: 60, ny: 116 },
  { name: "파주", lat: 37.7616, lng: 126.7794, nx: 55, ny: 130 },
  { name: "평택", lat: 36.9945, lng: 127.1121, nx: 62, ny: 114 },
  { name: "하남", lat: 37.5394, lng: 127.2142, nx: 63, ny: 125 },
  { name: "의정부", lat: 37.7381, lng: 127.0348, nx: 61, ny: 130 },
  { name: "고양", lat: 37.6583, lng: 126.8314, nx: 56, ny: 129 },
  { name: "양주", lat: 37.7853, lng: 127.0452, nx: 61, ny: 131 },
  { name: "안산", lat: 37.3219, lng: 126.8309, nx: 56, ny: 119 },
  { name: "부천", lat: 37.5037, lng: 126.7660, nx: 55, ny: 125 },
  { name: "화성", lat: 37.1996, lng: 126.8310, nx: 56, ny: 117 },
  { name: "시흥", lat: 37.3803, lng: 126.8034, nx: 55, ny: 120 },
  { name: "광명", lat: 37.4781, lng: 126.8640, nx: 57, ny: 124 },
  { name: "과천", lat: 37.4292, lng: 126.9876, nx: 59, ny: 122 },
  { name: "성남", lat: 37.4497, lng: 127.1280, nx: 61, ny: 122 },
  { name: "의왕", lat: 37.3443, lng: 126.9688, nx: 58, ny: 119 },
  { name: "용인", lat: 37.2411, lng: 127.1773, nx: 62, ny: 118 },
  { name: "구리", lat: 37.5943, lng: 127.1290, nx: 61, ny: 126 },
  { name: "안성", lat: 37.0085, lng: 127.2709, nx: 65, ny: 114 },
  { name: "포천", lat: 37.8943, lng: 127.2008, nx: 63, ny: 133 },
  { name: "이천", lat: 37.2795, lng: 127.4426, nx: 63, ny: 119 },
  { name: "여주", lat: 37.2980, lng: 127.6363, nx: 67, ny: 119 },
  { name: "가평", lat: 37.8315, lng: 127.5092, nx: 69, ny: 132 },
  { name: "연천", lat: 38.0962, lng: 127.0746, nx: 65, ny: 139 },
  { name: "동두천", lat: 37.9031, lng: 127.0604, nx: 65, ny: 133 }
];

interface Region {
  name: string;
  lat: number;
  lng: number;
  nx: number;
  ny: number;
}

interface WeatherData {
  temperature: string | null;
  sky: string | null;
  precipitation: string | null;
}

const Weather: React.FC<{ region: Region }> = ({ region }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWeather() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/weather?nx=${region.nx}&ny=${region.ny}`);
        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }
        const data = await response.json();
        console.log('Weather data:', data);
        setWeatherData({
          temperature: data.temperature,
          sky: data.sky ? getSkyStatus(data.sky) : '데이터 없음',
          precipitation: data.precipitation ? getPrecipitationStatus(data.precipitation) : '데이터 없음'
        });
      } catch (err) {
        setError('날씨 정보를 불러오는데 실패했습니다.');
        if (process.env.NODE_ENV !== 'production') {
          console.error('Error fetching weather data:', err);
        }
      } finally {
        setIsLoading(false);
      }
    }
    fetchWeather();
  }, [region]);

  function getSkyStatus(code: string) {
    switch (code) {
      case '1':
        return '맑음';
      case '3':
        return '구름많음';
      case '4':
        return '흐림';
      default:
        return `알 수 없음 (코드: ${code})`;
    }
  }

  function getPrecipitationStatus(code: string) {
    switch (code) {
      case '0':
        return '없음';
      case '1':
        return '비';
      case '2':
        return '비/눈';
      case '3':
        return '눈';
      case '4':
        return '소나기';
      default:
        return `알 수 없음 (코드: ${code})`;
    }
  }

  function getWeatherIconClass(sky: string | null, precipitation: string | null) {
    if (precipitation === '비') return styles.rain;
    if (precipitation === '비/눈') return styles['rain-snow'];
    if (precipitation === '눈') return styles.snow;
    if (precipitation === '소나기') return styles.shower;

    if (sky === '맑음') return styles.clear;
    if (sky === '구름많음') return styles.cloudy;
    if (sky === '흐림') return styles.overcast;

    return '';
  }

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  const weatherIconClass = getWeatherIconClass(weatherData?.sky, weatherData?.precipitation);

  return (
    <div className={styles.weather}>
    
      <h3>{region.name}</h3>
      <div className={styles.weatherContainer}>
      {weatherData && (
        <>
          <div className={`${styles['weather-icon']} ${weatherIconClass}`}></div>
          <p> {weatherData.temperature}°C</p>
         
        </>
      )}
      </div>
    </div>
  );
}
const KakaoMap: React.FC = () => {
  const [center] = useState({ lat: 36.5, lng: 127.5 });
  const [level, setLevel] = useState(13);
  const mapRef = useRef<kakao.maps.Map>(null);

  const handleLevel = useCallback((type: "increase" | "decrease") => {
    const map = mapRef.current;
    if (!map) return;
    const newLevel = type === "increase" ? map.getLevel() + 1 : map.getLevel() - 1;
    map.setLevel(newLevel);
    setLevel(newLevel);
  }, []);

  const getVisibleRegions = () => {
    if (level <= 9) {
      return regions; // 모든 지역을 표시
    } else if (level <= 10) {
      return regions.filter(region => ["서울", "부산", "대구", "인천","울산","대전","광주","전주","제주","강릉","원주","천안","목포","포항","안동","창원","통영","광양","세종","수원","진주","청주","천안","통영","김해","거제","여수","순천","남원","군산"].includes(region.name)); // 세종 제외
    } else if (level <= 11) {
      return regions.filter(region => ["서울", "부산", "대구", "인천","울산","대전","광주","전주","제주","강릉","원주","목포","포항","안동","창원","통영","광양"].includes(region.name)); 
    } else {
      return regions.filter(region => ["서울", "인천","부산","강릉","제주","광주"].includes(region.name));
    }
  }

  const visibleRegions = getVisibleRegions();

  return (
    
    <Map
      center={center}
      style={{ width: "50%", height: "600px" }}
      level={level}
      zoomable={true}
      ref={mapRef}
      className={styles.map}
    >
      {visibleRegions.map((region) => (
        <CustomOverlayMap
          key={region.name}
          position={{ lat: region.lat, lng: region.lng }}
          yAnchor={1}
        >
          <Weather region={region} />
        </CustomOverlayMap>
      ))}
      <p className={styles.zoom_box}>
        <button className={styles.zoom_btn} onClick={() => handleLevel("decrease")}>+</button>{" "}
        <button className={styles.zoom_btn} onClick={() => handleLevel("increase")}>-</button>{" "}
      </p>
    </Map>
  );
}

export default KakaoMap;
