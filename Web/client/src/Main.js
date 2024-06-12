import './Main.css'
import React, { useState, useEffect } from 'react'
import { FaPercent } from 'react-icons/fa'
import { TbTemperatureCelsius } from 'react-icons/tb'
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto'
import { Chart }            from 'react-chartjs-2'
import Header from './Header';
import fanimage from './fan.png'
import lightimage from './light.png'
import axios from "axios"
export default function Main() {
      
    const [luxValue, setLuxValue] = useState(0);
    const [humidityValue, setHumidityValue] = useState(0);
    const [temperatureValue, setTemperatureValue] = useState(0);
    const [backgroundLux, setBackgroundLux]= useState('linear-gradient(to bottom, #ECD95F, #D3E7EE)');
    const [backgroundHum, setBackgroundHum]= useState('linear-gradient(to bottom, #88CDF6, #BCE6FF)');
    const [backgroundTem, setBackgroundTem]= useState('linear-gradient(to bottom, #FD8F52, #FFBD71)');
    const [backgroundWanning,setBackgroundWanning]=useState('linear-gradient(to bottom, #FFFFFF, #68B2A0)');
    const [gifWarning,setGifWarning]=useState('none');
    const [backgroundButOn,setBackgroundButON]=useState('linear-gradient(to bottom, #A9A9A9, #FF4500)');
    const [backgroundButOff,setBackgroundButOff]=useState(' linear-gradient(to right, #A9A9A9,#00FF00)');
    const [backgroundFanOn,setBackgroundFanOn]=useState(' linear-gradient(to bottom, #A9A9A9, #FF4500)');
    const [backgroundFanOff,setBackgroundFanOff]=useState(' linear-gradient(to right, #A9A9A9,#00FF00)');
    const [image1But,setImage1But]=useState(true);
    const [image2But,setImage2But]=useState(false);
    const [image1Fan,setImage1Fan]=useState(true);
    const [image2Fan,setImage2Fan]=useState(false);
    const [slbatden,setSlbatden]=useState(0);
    const [slbatbut,setSlbatbut]=useState(0);
    const [sltatden,setSltatden]=useState(0);
    const [sltatbut,setSltatbut]=useState(0);
    function luuData1() {
        axios.get('http://localhost:3001/api/actionbut')
          .then((response) => {
            const data = response.data;
            setSlbatbut(data[0]["count(*)"])
            
          })
          
      }
      
    function luuData2() {
      axios.get('http://localhost:3001/api/actionfan')
        .then((response) => {
          const data = response.data;
          setSlbatden(data[0]["count(*)"])
        })
    }    
    function luuData3() {
        axios.get('http://localhost:3001/api/actionfanoff')
          .then((response) => {
            const data = response.data;
            setSltatden(data[0]["count(*)"])
          })
      }    
      function luuData4() {
        axios.get('http://localhost:3001/api/actionbutoff')
          .then((response) => {
            const data = response.data;
            setSltatbut(data[0]["count(*)"])
          })}
      useEffect(() => {
          fetchData(); 
          luuData();
        }, []);
      
    
      const fetchData = () => {
        axios.get('http://localhost:3001/api/actionsta')
          .then((response) => {
            const data = response.data;
            if (data && data.id) {
              setTemperatureValue(data.temperature); 
              setHumidityValue(data.humidity);
              setLuxValue(data.light)
            }
          })
      };
      function luuData() {
      axios.get('http://localhost:3001/api/actionsta1')
        .then((response) => {
          const data = response.data;
          if (data && data.id) {
            if(data.Deviceid==="but" ){
                if (data.Acti==="off1"){
                    setImage2But(true)
                    setImage1But(false)
                }
                if (data.Acti==="on1"){

                    setImage1But(false)
                    setImage2But(true)
                    
                }
            }
            if(data.Deviceid==="fan" ){
                if (data.Acti==="off2"){
                    setImage1Fan(true)
                    setImage2Fan(false)
                }
                if (data.Acti==="on2"){
                    setImage2Fan(true)
                    setImage1Fan(false)
                }
            }
          }
        })
    } 
    
    const [chartData, setChartData] = useState({
        labels: [
        ], 
        datasets: [
            {
                label: 'Nhiệt Độ',
                data: [], 
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false,
            },
            {
                label: 'Độ ẩm',
                data: [], 
                borderColor: 'rgba(255, 99, 132, 1)',
                fill: false,
            },
            {
                label: 'Ánh Sáng',
                data: [],
                borderColor: 'rgba(255, 206, 86, 1)',
                fill: false,
            },
        ],
    });
    
    function updateData() {
        axios.get("http://localhost:3001/mqtt-data").then((reponse)=>{
            const values =reponse.data.split(",")
            const temperature = parseFloat(values[0]);
            const humidity = parseFloat(values[1]);
            const lux = parseFloat(values[2]);
            setHumidityValue(humidity);
            setTemperatureValue(temperature);
            setLuxValue(lux);
        if(temperature >=0 && temperature<=30){
            setBackgroundTem('linear-gradient(to bottom, #FD8F52, #FFBD71)');
        }
        else if(temperature>30 && temperature<=70){
            setBackgroundTem('linear-gradient(to bottom, #FE676E, #FD8F52)');
        }
        else{
            setBackgroundTem('linear-gradient(to bottom, #C73866, #FE676E)');
        }
        
        if(humidity >=0 && humidity<=30){
            setBackgroundHum('linear-gradient(to bottom, #88CDF6, #BCE6FF)');
        }
        else if(humidity>30 && humidity<=60){
            setBackgroundHum('linear-gradient(to bottom, #2D82B5, #53A6D8)');
        }
        else{
            setBackgroundHum('linear-gradient(to bottom, #004E9A, #428CD4)');
        }

        if(lux>=0 && lux<=30){
            setBackgroundLux('linear-gradient(to bottom, #ECD95F, #D3E7EE)');
        }
        else if(lux>30 && lux<=60){
            setBackgroundLux('linear-gradient(to bottom, #F8D90F, #D3DD18)');
        }
        else{
            setBackgroundLux('linear-gradient(to bottom, #FE7A15, #F8D90F)');
        }

        if(humidity >=80 || temperature>=50 || lux>=1100){
            setBackgroundWanning('linear-gradient(to bottom, #F04393, #F9C449)');
            setGifWarning('block');
        }
        else{
            setBackgroundWanning('linear-gradient(to bottom, #FFFFFF, #68B2A0)');
            setGifWarning('none');
        }
        const currentTime = new Date().toLocaleTimeString();
        
        setChartData((prevData) => {
            if (prevData.labels.length >= 10    ) {
                prevData.labels.shift();
                prevData.datasets[0].data.shift();
                prevData.datasets[1].data.shift();
                prevData.datasets[2].data.shift();
            } 

            return {
                ...prevData,
                labels: [...prevData.labels, currentTime],
                datasets: [
                    {
                        ...prevData.datasets[0],
                        data: [...prevData.datasets[0].data, temperature],
                    },
                    {
                        ...prevData.datasets[1],
                        data: [...prevData.datasets[1].data, humidity],
                    },
                    {
                        ...prevData.datasets[2],
                        data: [...prevData.datasets[2].data, lux],
                    },
                ],
            };
        })});
    }
    
    useEffect(() => {
        const intervalId = setInterval(() => {
            updateData();
            luuData1();
            luuData2();
            luuData3();
            luuData4();

        }, 2000);
        
        return () => clearInterval(intervalId);
    }, []);
    
    const handleOnClick=() =>{
        setImage1Fan(false);
        setImage2Fan(true);
        setBackgroundFanOn('linear-gradient(to right, #A9A9A9,#00FF00)');
        setBackgroundFanOff('linear-gradient(to bottom, #A9A9A9, #FF4500)');

    }
    const handleOffClick=()=>{
        setImage2Fan(false);
        setImage1Fan(true);
        setBackgroundFanOff('linear-gradient(to right, #A9A9A9,#00FF00)');
        setBackgroundFanOn('linear-gradient(to bottom, #A9A9A9, #FF4500)');
    }
    const handleOnClickBut=() =>{
        setImage1But(false);
        setImage2But(true);
        setBackgroundButON('linear-gradient(to right, #A9A9A9,#00FF00)');
        setBackgroundButOff('linear-gradient(to bottom, #A9A9A9, #FF4500)');
    }
    const handleOffClickBut=()=>{
        setImage2But(false);
        setImage1But(true);
        setBackgroundButOff('linear-gradient(to right, #A9A9A9,#00FF00)');
        setBackgroundButON('linear-gradient(to bottom, #A9A9A9, #FF4500)');
    }
    const sendButOn = () => {
        const message = "on1";
        axios.post('http://localhost:3001/api', {message})
            .then(response => {
                console.log('Tin nhắn đã được gửi thành công.');
         })
            .catch(error => {
                console.error('Lỗi khi gửi tin nhắn:', error);
        });
    };
    const sendButOff= () => {
        const message = "off1";
        axios.post('http://localhost:3001/api', {message})
            .then(response => {
                console.log('Tin nhắn đã được gửi thành công.');
         })
            .catch(error => {
                console.error('Lỗi khi gửi tin nhắn:', error);
        });
    };
    const sendFanOn = () => {
        const message = "on2";
        axios.post('http://localhost:3001/api', {message})
            .then(response => {
                console.log('Tin nhắn đã được gửi thành công.');
         })
            .catch(error => {
                console.error('Lỗi khi gửi tin nhắn:', error);
        });
    };
    const sendFanOff = () => {
        const message = "off2";
        axios.post('http://localhost:3001/api', {message})
            .then(response => {
                console.log('Tin nhắn đã được gửi thành công.');
         })
            .catch(error => {
                console.error('Lỗi khi gửi tin nhắn:', error);
        });
    };
    return (
        <div className='root' style={{background:backgroundWanning}}>
            <img className='img-root' style={{display:gifWarning}} src='https://media1.giphy.com/media/6XPmkX0c6Z868tLYu4/200w.webp?cid=ecf05e4747qdbfw3vepxcithnohwiv531zwtplgiyb77hv7e&ep=v1_gifs_senrch&rid=200w.webp&ct=g' alt=''></img>
            <Header></Header>
            <div className='Contain'>
                <div className='Header-Contain'>
                    <div className='Temperature'  style={{background:backgroundTem}}>
                        <div className='top-hea'>
                            <span>Nhiệt Độ</span>
                        </div>
                        <div className='bot-hea'>
                            <h3 >{temperatureValue}</h3>
                            <TbTemperatureCelsius className="heart1-icon" />
                        </div>
                    </div>
                    <div className='Humidity' style={{background:backgroundHum}}>
                        <div className='top-hea'>
                            <span>Độ ẩm</span>
                        </div>
                        <div className='bot-hea'>
                            <h3>{humidityValue}</h3>
                            <FaPercent className="heart2-icon" />
                        </div>
                    </div>
                    <div className='Light' style={{background:backgroundLux}}>
                        <div className='top-hea'>
                            <span>Ánh sáng</span>
                        </div>
                        <div className='bot-hea'>
                            <h3>{luxValue}</h3>
                            <h3>Lux</h3>
                        </div>
                    </div>
                </div>
                <div className='Bot-Contain'>
                    <div className='left-bot-contain'>
                    <Line data={chartData} />
                    </div>
                    <div className='right-bot-contain'>
                        <div className='ball-light'>
                            <div className='contain-light'>
                                <div className='ball-light-gif'>
                                    {image1But&&(
                                        <img src={lightimage} alt=""></img>
                                    )}
                                    {image2But&&(
                                         <img src="https://media4.giphy.com/media/xUNda1t8JRgpyoC6re/200.webp?cid=ecf05e474jkdbo6vs4g6kwhjr46mkk4r6fl0s196l4mlmzbm&ep=v1_gifs_search&rid=200.webp&ct=g" alt=""></img>
                                    )}
                                </div>
                                <div className='battatden'>
                                    <h3> so lan bat:{slbatbut}</h3>
                                    <h3>so lan tat:{sltatbut}</h3>
                                </div>
                            </div>
                            <div className='but-ball'>
                                <button className='but-ball-onoff' onClick={() => { sendButOn(); handleOnClickBut(); }} style={{background:backgroundButOn}}>On</button>
                                <button className='but-ball-onoff'onClick={() => { sendButOff();handleOffClickBut();}} style={{background:backgroundButOff}}>Off</button>
                            </div>
                        </div>
                        <div className='fan'>
                            <div className='contain-fan'>
                                <div className='fan-gif'>
                                    {image2Fan&&(
                                    <img src="https://media3.giphy.com/media/Jx9cjz45Q3k4aCnvVf/200w.webp?cid=ecf05e4752zk0xnjdehz1rta7wnktpqsh56rv66hgg5o9g88&ep=v1_gifs_search&rid=200w.webp&ct=g" alt=""></img>
                                    )}
                                    {image1Fan&&(
                                    <img src={fanimage} alt=""></img>
                                    )}
                                </div>
                                <div className='battatden'>
                                    <h3>so lan bat :{slbatden}</h3>
                                    <h3>so lan tat: {sltatden}</h3>
                                </div>
                            </div>
                            <div className='but-fan'>
                            <button className='but-fan-onoff' onClick={() => { sendFanOn(); handleOnClick();}} style={{background:backgroundFanOn}}>On</button>
                            <button className='but-fan-onoff'onClick={()=>{handleOffClick();sendFanOff();}} style={{background:backgroundFanOff}}>Off</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    );
    
}
