const mqtt = require('mqtt');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const http = require('http').createServer(app);
const cors =require("cors")
app.use(cors());
app.use(bodyParser.json());
const mqttBroker = 'mqtt://192.168.71.4:1883'; 
const mqttTopic = 'Tempdata'; 

const client = mqtt.connect(mqttBroker);

client.on('connect', () => {
    client.subscribe(mqttTopic);
});
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'thanh',
  password: '12345',
  database: 'arduino',
});

connection.connect((err) => {
  if (err) {
    console.error('Lỗi :', err);
  } else {
    console.log('Thành công.');
  }
});
client.on('message', (topic, message) => {
    const data = message.toString();
    console.log(data)
    global.mqttData = data;
    const valua= data.split(",");
    const tg = new Date(); 

  const sql = 'INSERT INTO sensor_data (temperature, humidity , light,timestamp) VALUES (?, ?, ?, ?)';
  console.log(valua[0]);
  console.log(valua[1]);
  console.log(valua[2]);
  connection.query(sql, [parseFloat(valua[0]),parseFloat(valua[1]),parseInt(valua[2],10), tg], (error, results) => {
    if (error) {
      console.error('Lỗi khi lưu dữ liệu vào cơ sở dữ liệu:', error);
    } else {
      console.log('Dữ liệu đã được lưu vào cơ sở dữ liệu.');
    }
  });
});

app.get('/mqtt-data', (req, res) => {
    res.send(global.mqttData);
});
app.post('/api', (req, res) => {
  const message = req.body.message; 
  global.data1=message
  client.publish('device/led', message);
  let Deviced;

  if (message === 'on1' || message==="off1") {
    Deviced = 'but';
  } else if (message === 'on2' || message==="off2") {
    Deviced = 'fan';
  } else {
    Deviced = 'unknown'; 
  }

  const tg = new Date(); 

  const sql = 'INSERT INTO action1 (Deviceid, Acti , tg) VALUES (?, ?, ?)';

  connection.query(sql, [Deviced, message, tg], (error, results) => {
    if (error) {
      console.error('Lỗi khi lưu dữ liệu vào cơ sở dữ liệu:', error);
      res.status(500).json({ message: 'Lỗi khi lưu dữ liệu.' });
    } else {
      console.log('Dữ liệu đã được lưu vào cơ sở dữ liệu.');
      res.json({ message: 'Dữ liệu đã được gửi và lưu thành công.' });
    }
  });
});
app.get('/api/action', (req, res) => {
  connection.query('SELECT * FROM action1', (error, results) => {
    if (error) {
      console.error('Lỗi khi truy vấn dữ liệu:', error);
    } else {
      res.json(results);
    }
  });
});
app.get('/api/actionbut', (req, res) => {
  connection.query('SELECT count(*) FROM action1 WHERE Acti = ?', ['on1'], (error, results) => {
    if (error) {
      console.error('Lỗi khi truy vấn dữ liệu:', error);
    } else {
      res.send(results);
    }
  });
});

app.get('/api/actionfan', (req, res) => {
  connection.query('SELECT count(*) FROM action1 WHERE Acti = ?', ['on2'], (error, results) => {
    if (error) {
      console.error('Lỗi khi truy vấn dữ liệu:', error);
    } else {
      res.send(results);
    }
  });
});
app.get('/api/actionbutoff', (req, res) => {
  connection.query('SELECT count(*) FROM action1 WHERE Acti = ?', ['off1'], (error, results) => {
    if (error) {
      console.error('Lỗi khi truy vấn dữ liệu:', error);
    } else {
      res.send(results);
    }
  });
});

app.get('/api/actionfanoff', (req, res) => {
  connection.query('SELECT count(*) FROM action1 WHERE Acti = ?', ['off2'], (error, results) => {
    if (error) {
      console.error('Lỗi khi truy vấn dữ liệu:', error);
    } else {
      res.send(results);
    }
  });
});
app.get('/api/actionsta', (req, res) => {
  connection.query('SELECT * FROM sensor_data WHERE id = (SELECT MAX(id) FROM sensor_data)', (error, results) => {
    if (error) {
      console.error(error);
    } else {
        res.send(results[0]);
    }
  });
});

app.get('/api/actionsta1', (req, res) => {
  connection.query('SELECT * FROM action1 WHERE id = (SELECT MAX(id) FROM action1)', (error, results) => {
    if (error) {
      console.error( error);
    } else {
        res.send(results[0]); 
    }
  });
});


app.get('/api/sensor', (req, res) => {
  connection.query('SELECT * FROM sensor_data', (error, results) => {
    if (error) {
      console.error('Lỗi khi truy vấn dữ liệu:', error);
    } else {
      res.json(results);
    }
  });
});
app.get('/api', (req, res) => {
  res.send(global.data1)
});

const port = 3001;
http.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
