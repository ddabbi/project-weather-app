import { useEffect, useState } from "react";
import styles from './time-weather.module.css'
import Image from "next/image";
import Highcharts from 'highcharts';
import HighchartsReact from "highcharts-react-official";

interface ShortWeatherItem {
    baseDate : string;
    baseTime : string;
    category : string;
    fcstDate : string;
    fcstTime : string;
    fcstValue : string;
    nx:number;
    ny:number;
}

interface TimeWeatherProps {
    weatherData: ShortWeatherItem[];
}

interface GroupedData {
    [date: string]: {
        [time: string]: {
            TMP : number;
            UUU : number;
            VVV : number;
            VEC : number;
            WSD : number;
            SKY : number;
            PYT : number;
            POP : string;
            WAV : number;
            PCP : string;
            REH : string;
            SNO : string;
        };
        TMN? : any;
        TMX? : any;
    };
}


const TimeWeather: React.FC<TimeWeatherProps> = ({ weatherData }) => {
    const [view, setView] = useState('list');
    const [groupedWeatherData, setGroupedWeatherData] = useState<GroupedData>({});

    console.log(weatherData);

    useEffect(() => {
        const groupedData = groupData(weatherData);
        const { date: currentDate, time: currentTime } = getCurrentDateTime();
        const filteredData = filterPastData(groupedData, currentDate, currentTime);
        setGroupedWeatherData(filteredData);
        
        console.log(groupedWeatherData);
        
    }, [weatherData]);
    
    // 보기전환
    function handleViewChange(viewState : string) {
        setView(viewState);
    }

    const groupData = (data: any[]): GroupedData => {
        return data.reduce((acc: GroupedData, item) => {
            const { fcstDate, fcstTime, category, fcstValue } = item;

            if (!acc[fcstDate]) acc[fcstDate] = {};
            if (!acc[fcstDate][fcstTime]) {
                acc[fcstDate][fcstTime] = { TMP : 0, UUU: 0, VVV: 0, VEC: 0, WSD: 0, SKY: 0, PYT: 0, POP: '', WAV : 0, PCP: '', REH: '', SNO: ''};
            }
            
            acc[fcstDate][fcstTime][category] = fcstValue;

            // 최저, 최고기온은 따로 저장
            if (fcstTime === '1500') {
                if (category === 'TMN') {
                    (acc[fcstDate] as any).TMN = Number(fcstValue);
                }
                if (category === 'TMX') {
                    (acc[fcstDate] as any).TMX = Number(fcstValue);
                }
            }

          return acc;
        }, {} as GroupedData);
        
    };


    const filterPastData = (data: GroupedData, currentDate: string, currentTime: string): GroupedData => {
        const filteredData: GroupedData = {};

        for (const [date, times] of Object.entries(data)) {
            if (date === currentDate) {
                filteredData[date] = {};
                for (const [time, values] of Object.entries(times)) {
                    if (time >= currentTime) {
                        filteredData[date][time] = values;
                    }
                }
            } else if (date > currentDate) {
                filteredData[date] = times;
            }
        }
        return filteredData;
    };

    const getCurrentDateTime = () => {
        const now = new Date();
        const date = now.toISOString().slice(0, 10).replace(/-/g, ''); 
        const time = now.getHours().toString().padStart(2, '0') + '00';
        return { date, time };
    };

    // TMP(기온 데이터)만
    const filteredTMP = Object.entries(groupedWeatherData)
    .flatMap(([date, times]) =>
        Object.entries(times)
            .sort(([timeA], [timeB]) => timeA.localeCompare(timeB))
            .map(([, data]) => Number(data['TMP']))
    )
    .filter(value => !isNaN(value));

    // POP(강수확률 데이터)만
    const filteredPOP = Object.values(groupedWeatherData).flatMap(times =>
        Object.values(times).map(data => Number(data['POP']))
        .filter(value => !isNaN(value)));

    // PCP(강수량 데이터)만
    const filteredPCP = Object.values(groupedWeatherData).flatMap(times =>
        Object.values(times).map(data => {
            const value = data['PCP'];
            if (value === "강수없음") {
                return 0;
            } else if (value) {
                const numericValue = parseFloat(value.replace('mm', ''));
                return isNaN(numericValue) ? 0 : numericValue; 
            } else {
                return 0;
            }
        }).filter(value => !isNaN(value))
    );

    // REH(습도 데이터)만
    const filteredREH = Object.values(groupedWeatherData).flatMap(times =>
        Object.values(times).map(data => {
            const value = data['REH'];
            const numericValue = parseFloat(value);
            return numericValue;
            
        }).filter(value => !isNaN(value)) // NaN이 아닌 값만 포함
    );
    //console.log(filteredREH);

    // short요일변환
    function formatTodayDay(datestring: string){
        const year = datestring.substring(0, 4);
        const month = datestring.substring(4, 6);
        const day = datestring.substring(6, 8);
        
        const formattedDateString = `${year}-${month}-${day}`;

        const date = new Date(formattedDateString);
        const dayofWeek = new Intl.DateTimeFormat('ko-KR', {weekday : 'short'}).format(date);
        return dayofWeek;
    } 


    // chart 
    const TMPChartOptions: Highcharts.Options = {
        chart : { 
            type : 'line',
            height : 180,
            backgroundColor: 'rgba(255, 255, 255, 0)' ,
            margin: [ 0, 0, 0, 0]
        },
        title : { text : "" },
        legend : { enabled : false },
        tooltip : { enabled : false },
        plotOptions : {
            line : { 
                dataLabels : { 
                    enabled : true,
                    format : '{y}℃',
                    style : { fontSize : '16px', fontWeight: 'normal'},
                    align : 'center',
                    verticalAlign : 'bottom'
                },
                enableMouseTracking: false,
                lineWidth : 2
            },
        },
        xAxis : { 
            labels: { enabled : false },
            tickWidth : 0,
            gridLineWidth: 0,
            lineWidth : 0,
        },
        yAxis : { 
            labels: { enabled : false },
            tickWidth : 0,
            gridLineWidth: 0,
            title: {
                text: '',
            }
        },
        credits: { enabled : false },
        series: [{
            type : "line",
            data: 
            filteredTMP
        }]

    }

    const POPChartOptions: Highcharts.Options = {
        chart : { 
            type : 'column',
            height : 100,
            backgroundColor: 'rgba(255, 255, 255, 0)' ,
            margin: [ 0, 0, 0, 0],
        },
        title : { text : "" },
        legend : { enabled : false },
        tooltip : { enabled : false },
        plotOptions : {
            column : { 
                dataLabels : { 
                    enabled : true,
                    format : '{y}%',
                    style : { fontSize : '16px', fontWeight: 'normal'},
                    align : 'center'
                },
                
                borderWidth: 1,
                enableMouseTracking: false,
            },
        },
        xAxis : { 
            labels: { enabled : false },
            gridLineWidth: 0,
            lineWidth: 3,
            lineColor: '#0099E1',
            
        },
        yAxis : { 
            labels: { enabled : false },
            gridLineWidth: 0,
            lineWidth: 0,
            min: 0,
            max: 100
        },
        credits: { enabled : false },
        series: [{
            type : "column",
            data: 
            filteredPOP
        }]
    }

    const PCPChartOptions: Highcharts.Options = {
        chart : { 
            type : 'column',
            height : 100,
            backgroundColor: 'rgba(255, 255, 255, 0)' ,
            margin: [ 0, 0, 0, 0],
        },
        title : { text : "" },
        legend : { enabled : false },
        tooltip : { enabled : false },
        plotOptions : {
            column : { 
                dataLabels : { 
                    enabled : true,
                    format : '{y}',
                    style : { fontSize : '16px', fontWeight: 'normal'},
                    align : 'center'
                },
                
                borderWidth: 1,
                enableMouseTracking: false,
            },
        },
        xAxis : { 
            labels: { enabled : false },
            gridLineWidth: 0,
            lineWidth: 3,
            lineColor: '#0099E1',
            
        },
        yAxis : { 
            labels: { enabled : false },
            gridLineWidth: 0,
            lineWidth: 0,
            min: 0,
            max: 100
        },
        credits: { enabled : false },
        series: [{
            type : "column",
            data: 
            filteredPCP
        }]
    }
    
    const REHChartOptions: Highcharts.Options = {
        chart: { 
            type: 'areaspline',
            height: 100,
            backgroundColor: 'rgba(255, 255, 255, 0)',
            margin: [0, 0, 0, 0]
        },
        title: { text: "" },
        legend: { enabled: false },
        tooltip: { enabled: false },
        plotOptions: {
            areaspline: { 
                dataLabels: { 
                    enabled: true,
                    format: '{y}%',
                    style: { fontSize: '16px', fontWeight: 'normal' },
                    align: 'center',
                    verticalAlign: 'bottom'
                },
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, 'rgba(0, 153, 255, 0.5)'], // 시작 색상
                        [1, 'rgba(0, 153, 255, 0.1)']  // 끝 색상
                    ]
                },
                enableMouseTracking: false,
                lineWidth: 2
            },
        },
        xAxis: { 
            labels: { enabled: false },
            lineWidth: 3,
            lineColor: '#0099E1',
        },
        yAxis: { 
            labels: { enabled: false },
            gridLineWidth: 0,
            title: {
                text: '',
            }
        },
        credits: { enabled: false },
        series: [{
            type: "areaspline",
            data: filteredREH
        }]
    };

    // 날씨아이콘 변경
    function handleWeatherIcon(weather: number, time:string){
        const formatTime = Number(time.slice(0, 2));
    
        if(formatTime > 6 && formatTime < 20){
            const weatherIcons: { [key: number]: string } = {
                1: '/img/sunny.png',
                3: '/img/smallCloud.png',
                4: '/img/manyCloudy.png'
            };
            return <Image src={weatherIcons[weather]} alt="" width={55} height={55}/>;
        }else{
            const weatherIcons: { [key: number]: string } = {
                1: '/img/nightSunny.png',
                3: '/img/nightCloudy.png',
                4: '/img/manyCloudy.png'
            };
            return <Image src={weatherIcons[weather]} alt="" width={55} height={55}/>;
        }
        
    }
    // 풍향아이콘 변경
    function handleWindIcon(windDirection: number){
        return(
            <img src="https://www.weather.go.kr/w/resources/icon/ic_wd_48x.png" 
            style={{transform: `rotate(${windDirection}deg)`, width: '30px', height: '30px'}}/>
        ) 
    }
    
    function getWindDirection(vec: number){
        if (vec >= 337.5 || vec < 22.5) return '북';
        if (vec >= 22.5 && vec < 67.5) return '북동';
        if (vec >= 67.5 && vec < 112.5) return '동';
        if (vec >= 112.5 && vec < 157.5) return '남동';
        if (vec >= 157.5 && vec < 202.5) return '남';
        if (vec >= 202.5 && vec < 247.5) return '남서';
        if (vec >= 247.5 && vec < 292.5) return '서';
        if (vec >= 292.5 && vec < 337.5) return '북서';
      };


    return(
        <div>
            <div className={styles.TimeNavbar}>
                <h3>시간별 예보</h3>
                <div className={styles.Navbtn}>
                    <Image src="/img/View_mode_1.png" alt="" onClick={() => handleViewChange('list')} width={30} height={30} className={view === 'list' ? styles.SelectedImg : ''}/>
                    <Image src="/img/View_mode_2.png" alt="" onClick={() => handleViewChange('chart')} width={30} height={30} className={view === 'chart' ? styles.SelectedImg : ''}/>
                    <Image src="/img/View_mode_3.png" alt="" onClick={() => handleViewChange('table')} width={30} height={30} className={view === 'table' ? styles.SelectedImg : ''}/>
                </div>    
            </div>
            
            {/* 일반 */}
            { view === 'list' && (
                <div className={styles.ViewList}>                        
                    <div className={styles.ViewListNav}>
                        <ul>
                            <li>시각</li>
                            <li>날씨</li>
                            <li className={styles.AddHeight}>기온</li>
                            <li>체감온도</li>
                            <li className={styles.paddingNone}>강수량(mm)</li>
                            <li>강수확률</li>
                            <li>바람(m/s)</li>
                            <li>습도</li>
                            <li>폭염영향</li>
                        </ul>
                    </div>
                                               
                    <div className={styles.ViewListDetail}>                        
                    {Object.keys(groupedWeatherData).map(date =>(
                        <div>
                            <div className={styles.floatBox}>
                                <p className={styles.floatDate}>{`${date.slice(6, 8)}일(${formatTodayDay(date)})`}</p>
                                <p>{`최저 ${groupedWeatherData[date].TMN === undefined ? "-" : groupedWeatherData[date].TMN} / 최고 ${groupedWeatherData[date].TMX === undefined ? "-" : groupedWeatherData[date].TMX}℃`}</p>
                            </div>
                            <div className={styles.ViewListTimeDetail}>
                            {Object.keys(groupedWeatherData[date]).filter(time => time !== 'TMX' && time !== 'TMN').sort().map(time => (
                                <div>
                                    <ul>
                                        <li>{`${time.slice(0, 2)}시`}</li>
                                        <li>{handleWeatherIcon(groupedWeatherData[date][time].SKY, time)}</li>
                                        <li className={styles.AddHeight}>
                                        </li>
                                        <li>{`${groupedWeatherData[date][time].TMP}℃`}</li>
                                        <li className={styles.precipitation}>{groupedWeatherData[date][time].PCP === "강수없음" ? "-" : groupedWeatherData[date][time].PCP}</li>
                                        <li>{`${groupedWeatherData[date][time].POP}%`}</li>
                                        <li>
                                            <span>{handleWindIcon(groupedWeatherData[date][time].VEC)}</span> <br/>
                                            <span>{groupedWeatherData[date][time].WSD}</span>
                                        </li>
                                        <li>{`${groupedWeatherData[date][time].REH}%`}</li>
                                    </ul>
                                </div>
                            ))}

                            </div>
                        </div>
                    ))}
                    <div className={styles.TemperChart}>
                        <div>
                            <HighchartsReact 
                            highcharts={ Highcharts } 
                            options={ TMPChartOptions }/>
                        </div>
                    </div> 
                    </div>
                </div>
            )}
            
            {/* 그래프 형태 */}
            { view === 'chart' && (
                <div className={styles.ViewChart}>
                    <div className={styles.ViewChartNav}>
                        <ul>
                            <li>시각</li>
                            <li>날씨</li>
                            <li className={styles.AddHeight}>기온</li>
                            <li className={styles.AddHeight}>강수량</li>
                            <li className={styles.AddHeight}>강수확률</li>
                            <li className={styles.AddHeight}>풍향풍속</li>
                            <li>습도</li>
                        </ul>
                    </div>
                    <div className={styles.ViewChartDetail}>
                    { Object.keys(groupedWeatherData).map(date => (
                        <div>
                            <div className={styles.floatBox}>
                            <p className={styles.floatDate}>{`${date.slice(6, 8)}일(${formatTodayDay(date)})`}</p>
                            <p>{`최저 ${groupedWeatherData[date].TMN === undefined ? "-" : groupedWeatherData[date].TMN} / 최고 ${groupedWeatherData[date].TMX === undefined ? "-" : groupedWeatherData[date].TMX}℃`}</p>
                            </div>
                            <div className={styles.ViewChartTimeDetail}>
                            {Object.keys(groupedWeatherData[date]).filter(time => time !== 'TMX' && time !== 'TMN').sort().map(time =>(
                                <div>
                                    <ul>
                                        <li>{`${time.slice(0, 2)}시`}</li>
                                        <li>{handleWeatherIcon(groupedWeatherData[date][time].SKY, time)}</li>
                                        <li className={styles.AddHeight}></li>
                                        <li className={styles.AddHeight}></li>
                                        <li className={styles.AddHeight}></li>
                                        <li>
                                            <span>{handleWindIcon(groupedWeatherData[date][time].VEC)}</span> <br/>
                                            <span>{groupedWeatherData[date][time].WSD}</span>
                                        </li>
                                        <li></li>
                                    </ul>
                                </div>
                            ))}   
                            </div>
                        </div>   
                    ))}
                    <div className={styles.TemperChart}>
                        <div>
                            <HighchartsReact 
                            highcharts={ Highcharts } 
                            options={ TMPChartOptions }/>
                        </div>
                    </div>
                    <div className={styles.PCPChart}>
                        <HighchartsReact
                        highcharts={ Highcharts}
                        options = {PCPChartOptions} />
                    </div>
                    <div className={styles.precipChart}>
                        <HighchartsReact 
                        highcharts={ Highcharts } 
                        options={ POPChartOptions }/>
                    </div>
                    <div className={styles.REHChart}>
                        <HighchartsReact
                        highcharts={ Highcharts}
                        options = {REHChartOptions} />
                    </div>                    
                    </div>
                    <div>
                    </div>
                </div>
            )}
            {/* 테이블 */}
            {view === 'table' && (
                <div className={styles.ViewTable}>
                    <div className={styles.ViewTableDetail}>
                        {Object.keys(groupedWeatherData).map(date => (
                            <div className={styles.ViewTableTimeDetail}>
                                <div className={styles.ViewTableNav}>
                                    <h3>{`${date.slice(6, 8)}일(${formatTodayDay(date)})`}</h3>
                                    <p>{`최저 ${groupedWeatherData[date].TMN === undefined ? "-" : groupedWeatherData[date].TMN} / 최고 ${groupedWeatherData[date].TMX === undefined ? "-" : groupedWeatherData[date].TMX}℃`}</p>
                                </div>
                                <div>
                                    <ul>
                                        <li>시각</li>
                                        <li>날씨</li>
                                        <li>기온(체감)</li>
                                        <li>강수량</li>
                                        <li>강수<br/>확률</li>
                                        <li>바람</li>
                                        <li>습도</li>
                                        <li>폭염<br/>영향</li>
                                    </ul>
                                </div>
                                <div>
                                {Object.keys(groupedWeatherData[date]).filter(time => time !== 'TMX' && time !== 'TMN').sort().map(time => (
                                    <div>
                                        <ul>
                                            <li>{`${time.slice(0, 2)}시`}</li>
                                            <li>
                                                <div>
                                                    <div>{handleWeatherIcon(groupedWeatherData[date][time].SKY, time)}</div>
                                                    <p>{groupedWeatherData[date][time].SKY == 1 ? "맑음" : groupedWeatherData[date][time].SKY == 3 ? "구름많음" : "흐림"}</p>
                                                </div>
                                            </li>
                                            <li>
                                                <span>
                                                    <p>{`${groupedWeatherData[date][time].TMP}℃`}</p>
                                                    <p>{`(${groupedWeatherData[date][time].TMP}℃)`}</p>
                                                </span>
                                            </li>
                                            <li>{groupedWeatherData[date][time].PCP === "강수없음" ? "-" : groupedWeatherData[date][time].PCP}</li>
                                            <li>{`${groupedWeatherData[date][time].POP}%`}</li>
                                            <li>
                                                {`${getWindDirection(groupedWeatherData[date][time].VEC)}풍`} <br />
                                                <span>{groupedWeatherData[date][time].WSD}</span>
                                            </li>
                                            <li>{`${groupedWeatherData[date][time].REH}%`}</li>
                                        </ul>
                                    </div>
                                ))}  
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default TimeWeather;