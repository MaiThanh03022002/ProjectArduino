#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <DHT_U.h>

#define DHTPIN D5
const float ldrPin = A0;
#define DHTTYPE DHT11
DHT_Unified dht(DHTPIN, DHTTYPE);
uint32_t delayMS;

const char* ssid = "OPPO A9 2020";
const char* password = "44444444";
const char* mqtt_server = "192.168.71.4";
const char* topic = "Tempdata";
const int serverPort = 3001;
WiFiClient espClient;
PubSubClient client(espClient);

unsigned long lastMsg = 0;
String msgStr = "";
float temp, hum;


void setup_wifi() {

  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {

    Serial.print(".");
    digitalWrite(2, 0);
    delay(200);
    digitalWrite(2, 1);
    delay(200);
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  
  String message = "";
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  Serial.print(message);
  Serial.println();

  if (message.equals("off1")) {
    digitalWrite(D6, LOW);
  } else if (message.equals("on1")) {
    digitalWrite(D6, HIGH);
  } else if (message.equals("on2")) {
    digitalWrite(D7, HIGH);
  } else if (message.equals("off2")) {
    digitalWrite(D7, LOW);
  }
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    String clientId = "ESP8266Client-";
    clientId += String(random(0xffff), HEX);
    if (client.connect(clientId.c_str())) {
      Serial.println("connected");
      client.subscribe("device/led");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void setup() {
  pinMode(D6, OUTPUT);
  pinMode(D7, OUTPUT);
  pinMode(ldrPin, OUTPUT);
  dht.begin();
  sensor_t sensor;
  dht.temperature().getSensor(&sensor);

  dht.humidity().getSensor(&sensor);
  delayMS = sensor.min_delay / 1000;

  Serial.begin(9600);
  setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
}

void loop() {

  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  unsigned long now = millis();
  if (now - lastMsg > 2000) {
    lastMsg = now;
    sensors_event_t event;
    dht.temperature().getEvent(&event);
    if (isnan(event.temperature)) {
      Serial.println(F("Error reading temperature!"));
    } else {
      Serial.print(F("Temperature: "));
      Serial.print(event.temperature);
      Serial.println(F("°C"));
      temp = event.temperature;
    }
    dht.humidity().getEvent(&event);
    if (isnan(event.relative_humidity)) {
      Serial.println(F("Error reading humidity!"));
    } else {
      Serial.print(F("Humidity: "));
      Serial.print(event.relative_humidity);
      Serial.println(F("%"));
      hum = event.relative_humidity;
    }
    int rawData = analogRead(ldrPin);
    float lux = rawData;
    Serial.print("Lux: ");
    Serial.println(rawData);

    msgStr = String(temp) + "," + String(hum) + "," + String(lux);
    byte arrSize = msgStr.length() + 1;
    char msg[arrSize];
    msgStr.toCharArray(msg, arrSize);
    Serial.print("PUBLISH DATA:");
    Serial.println(msgStr);
    client.publish(topic, msg);
    msgStr = "";
    delay(50);
  }
}