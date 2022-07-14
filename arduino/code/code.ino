#include <SPI.h>
#include <MFRC522.h>
 
#define SS_PIN 23
#define RST_PIN 22

#define ACCESS_DELAY 2000
#define DENIED_DELAY 1000
MFRC522 mfrc522(SS_PIN, RST_PIN);   // Create MFRC522 instance.
int IN1 = 4;
int IN2 = 3;
int ENA = 7;
String response;
int LED_RED = 31;
int LED_GREEN = 33;
int LED_BLUE = 35;


void setup() 
{
  Serial.begin(9600);   // Initiate a serial communication
  SPI.begin();          // Initiate  SPI bus
  mfrc522.PCD_Init();   // Initiate MFRC522
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  pinMode(ENA, OUTPUT);
  pinMode(LED_RED, OUTPUT);
  pinMode(LED_BLUE, OUTPUT);
  pinMode(LED_GREEN, OUTPUT);
  
}
void loop() 
{
  while (!Serial.available());
  response = Serial.readString();
  if (response == "verde") //do if user has access
  {
    RGB_color(0, 255, 0);
  }
   if (response == "morado") //do if user in not registered
  {
    RGB_color(255, 0, 255);
  }
  if (response == "rojo") //do if user has no access
  {
    RGB_color(255, 0, 0);
  }
  if (response == "celeste"){ //do if there's an error 
    RGB_color(0, 255, 255);
  }
  if (response == "apagar"){ //do if there's an error 
    RGB_color(0, 0, 0);
  }
  if (response == "rfid-rgs" || response == "rfid-acs"){ //rfid
    unsigned long startedWaiting = millis();
    if (response == "rfid-rgs"){
      RGB_color(255,255,255);//blanco
    }
    else{
      RGB_color(255, 0, 255);//morado
    }
    bool b = false;
    while(!b && millis() - startedWaiting <= 10000){
      // Look for new cards
      if (mfrc522.PICC_IsNewCardPresent()) 
      {
        // Select one of the cards
        if (mfrc522.PICC_ReadCardSerial()) 
        {
          String content= "";
          byte letter;
          for (byte i = 0; i < mfrc522.uid.size; i++) 
          {
             Serial.print(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : " ");
             Serial.print(mfrc522.uid.uidByte[i], HEX);
             content.concat(String(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : " "));
             content.concat(String(mfrc522.uid.uidByte[i], HEX));
          }
          Serial.println();
          content.toUpperCase();
          b = true;
        }
      }
    }
    RGB_color(0, 0, 0);
  }
  if (response == "unlock"){ //rfid
    RGB_color(0, 255, 0);
    unlock();
    RGB_color(0, 0, 0);
  }
}

void unlock()
{
  digitalWrite(ENA, HIGH);
  digitalWrite(IN1, LOW);
  digitalWrite(IN2,HIGH);
  delay(2000);
  digitalWrite(ENA, LOW);
  delay(3000);
}
void lock()
{
  digitalWrite(ENA, HIGH);
  digitalWrite(IN1, LOW);
  digitalWrite(IN2,HIGH);
  delay(2000);
  digitalWrite(ENA, LOW);
  delay(3000);
}

void RGB_color(int red_light_value, int green_light_value, int blue_light_value)
 {
  analogWrite(LED_RED, red_light_value);
  analogWrite(LED_GREEN, green_light_value);
  analogWrite(LED_BLUE, blue_light_value);
}
