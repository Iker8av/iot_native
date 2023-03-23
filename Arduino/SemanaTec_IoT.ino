#include <SPI.h>
#include <MFRC522.h>

#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <DHT_U.h>

#include <WiFi.h>
#include <Firebase_ESP_Client.h>


//Provide the token generation process info.
#include "addons/TokenHelper.h"
//Provide the RTDB payload printing info and other helper functions.
#include "addons/RTDBHelper.h"

#define RST_PIN  22 // Reset pin
#define SS_PIN  21 // Slave select pin
#define BUZZER_PIN 12 // Buzzer pin

#define DHTPIN 13
#define DHTTYPE  DHT11
float temperature;

#define TRIG_PIN  27
#define ECHO_PIN  26
#define BUZZER_PIN 12

float duration, distance;

#define WIFI_SSID "Galaxy A51 2922"
#define WIFI_PASSWORD "nvwi4741"

#define API_KEY "AIzaSyBjYmJU2nu8nzuSbEU5kQzqbjRyrB1maRE"//"AIzaSyDUZyJZ-UFinVn15J9nzda7pfPE90kHHTA"

#define DATABASE_URL "https://hs-iot-aa7d2-default-rtdb.firebaseio.com"//"https://prueba-esp32-6529e-default-rtdb.firebaseio.com/" 

//Define Firebase Data object
FirebaseData fbdo;

FirebaseAuth auth;
FirebaseConfig config;
/////////////////////////////////////


unsigned long sendDataPrevMillis = 0;
int count = 0;
bool signupOK = false;



//PUERTA///
bool statePuerta = 0;



uint32_t delayMS;


DHT_Unified dht(DHTPIN, DHTTYPE);
MFRC522 rfid(SS_PIN, RST_PIN); // Create MFRC522 instance





void SentToDbFloat(String variable, float data){
  if (Firebase.ready() && signupOK && (millis() - sendDataPrevMillis > 15000 || sendDataPrevMillis == 0)){
    sendDataPrevMillis = millis();
    // Write an Int number on the database path test/int
    if (Firebase.RTDB.pushFloatAsync(&fbdo, variable, data)){
      Serial.println("PASSED");
      Serial.println("PATH: " + fbdo.dataPath());
      Serial.println("TYPE: " + fbdo.dataType());
    }
    else {
      Serial.println("FAILED");
      Serial.println("REASON: " + fbdo.errorReason());
    }

  }
}

void SentToDbBool(String variable, bool data){
  if (Firebase.ready() && signupOK && (millis() - sendDataPrevMillis > 15000 || sendDataPrevMillis == 0)){
    sendDataPrevMillis = millis();
    // Write an Int number on the database path test/int
    if (Firebase.RTDB.pushBoolAsync(&fbdo, variable, data)){
      Serial.println("PASSED");
      Serial.println("PATH: " + fbdo.dataPath());
      Serial.println("TYPE: " + fbdo.dataType());
    }
    else {
      Serial.println("FAILED");
      Serial.println("REASON: " + fbdo.errorReason());
    }

  }
}

/*//////////////TEMP///////////////*/

void GetTemp(){
  dht.begin();
  sensors_event_t event;
    dht.temperature().getEvent(&event);
    if (isnan(event.temperature)) {
      Serial.println(F("Error reading temperature!"));
    }
    else {
      temperature = event.temperature;
      Serial.print(F("Temp: "));
      Serial.print(temperature);
      Serial.println(F("°C"));
      
      delayMS = 1000;
    }
}

/////////////////////////////////////////

void GetDistance() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  duration = pulseIn(ECHO_PIN, HIGH);
  distance = (duration*.0343)/2;
}


void setup() 
{
  
  Serial.begin(115200); 

  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(2, OUTPUT);
  Serial.begin(115200);



  //CONNECT WIFI
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.print(".");
    delay(250);
  }
  Serial.print("\nConectado al Wi-Fi");
  Serial.println();



    /* Assign the api key (required) */
  config.api_key = API_KEY;

  /* Assign the RTDB URL (required) */
  config.database_url = DATABASE_URL;

  /* Sign up */
  if (Firebase.signUp(&config, &auth, "", "")){
    Serial.println("ok");
    signupOK = true;
  }
  else{
    Serial.printf("%s\n", config.signer.signupError.message.c_str());
  }

  /* Assign the callback function for the long running token generation task */
  config.token_status_callback = tokenStatusCallback; //see addons/TokenHelper.h
  
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
  

  
  //RFID//
  pinMode(BUZZER_PIN, OUTPUT);
  SPI.begin(); // Init SPI bus
  rfid.PCD_Init(); // Init MFRC522
  rfid.PCD_DumpVersionToSerial(); // Show details of PCD - MFRC522 Card Reader details

  //TEMP
  
  GetTemp();
  SentToDbFloat("Temperatura", temperature);

}

void loop() {


/****************RFID**************************/

  // Look for new cards
  if ( ! rfid.PICC_IsNewCardPresent()) {
  return;
  }

  // Select one of the cards
  if ( ! rfid.PICC_ReadCardSerial()) {
  return;
  }

  // Dump debug info about the card; PICC_HaltA() is automatically called
  //mfrc522.PICC_DumpToSerial(&(mfrc522.uid));

  
  for (int i = 0; i < rfid.uid.size; i++) {
    Serial.print(rfid.uid.uidByte[i] < 0x10 ? " 0" : " ");
    Serial.print(rfid.uid.uidByte[i], HEX);
  }
  Serial.println();

  rfid.PICC_HaltA(); // halt PICC



  
  //statePuerta = !statePuerta;
  delay(3000);
  rfid.PCD_StopCrypto1(); // stop encryption on PCD
  SentToDbBool("Puerta", true);
  delay(100);
  
  SentToDbFloat("Temperatura", temperature);
  GetDistance();

  if (distance < 20){
      Serial.println("Menor A 20");
      digitalWrite(2,HIGH);
      digitalWrite(BUZZER_PIN, HIGH);

      SentToDbBool("Foco", true);
      
  }
  else{
      Serial.println("MAYOR A 20"); 
      digitalWrite(2,LOW);
      digitalWrite(BUZZER_PIN, LOW);
      SentToDbBool("Foco", false);

  }
  digitalWrite(BUZZER_PIN, HIGH);
  delay(1000);
  digitalWrite(BUZZER_PIN, LOW);
  

  Serial.print("Distance: ");
  Serial.println(distance);
  Serial.println("************");












/****************##RFID##**************************/

/****************TEMP******************************/
  GetTemp();
/*************##TEMP##********************************************/


/****DISTANCIA******/
  GetDistance();

  if (distance < 20){
      Serial.println("Menor A 20");
      digitalWrite(2,HIGH);
      digitalWrite(BUZZER_PIN, HIGH);

      SentToDbBool("Foco", true);
  }
  else{
      Serial.println("MAYOR A 20"); 
      digitalWrite(2,LOW);
      digitalWrite(BUZZER_PIN, LOW);
      SentToDbBool("Foco", false);

  }

  Serial.print("Distance: ");
  Serial.println(distance);
  Serial.println("************");

  
/************************/



///////database///////////

  GetTemp();
  SentToDbFloat("Temperatura", temperature);
  SentToDbBool("Puerta", false);

}