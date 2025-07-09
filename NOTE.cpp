// #include <ESP8266WiFi.h>
// #include <FirebaseESP8266.h>
// #include <Wire.h>
// #include <MPU6050.h>
// #include <vector>
// #include <algorithm>
// #include <math.h>
// #include <TinyGPS++.h>
// #include <SoftwareSerial.h>
// using namespace std;

// // ===================== إعداد المعطيات العامة =====================
// const String boardID = "esp8266_0001";
// const char* ssid = "M";
// const char* password = "mo01020445156";

// FirebaseConfig config;
// FirebaseAuth auth;
// FirebaseData firebaseData;

// // ===================== define PINS and THRESHOLD =====================
// #define FSR_PIN A0
// #define BUZZER_PIN D4
// #define VELOCITY_THRESHOLD 1.0
// #define FORCE_THRESHOLD 50
// #define OVERTURNS_ANGLE_THRESHOLD 90
// #define VECTOR_LIMIT 10
// #define sz(x) x.size()
// #define all(x) x.begin(), x.end()

// // ===================== define sensors =====================
// MPU6050 mpu;
// vector<float> velocityChanges;
// vector<int> forceValues;
// float lastForce = 0;
// float lastOverturns = 0;

// // ===================== إعداد GPS =====================
// SoftwareSerial SerialGPS(D5, D6);
// TinyGPSPlus gps;

// // ===================== الدالة لإرسال البيانات إلى Firebase =====================
// void sendFirebaseData(const String& type, bool state, float value1 = 0) {
//   FirebaseJson json;
//   json.set("type", type);
//   json.set("state", state);
//   json.set("value1", value1);

//   if (type == "Collision") {
//     String status;
//     if (lastForce < 10 && lastOverturns < 30)
//       status = "Normal";
//     else if ((lastForce >= 10 && lastForce < 50) || (lastOverturns >= 30 && lastOverturns < 90))
//       status = "Medium";
//     else
//       status = "Dangerous";
//     json.set("statusNow", status);
//   }

//   String path = String("/BoardsSensor/") + boardID + "/sensors/" + type;
//   if (Firebase.setJSON(firebaseData, path, json)) {
//     Serial.println(type + " data updated successfully!");
//   } else {
//     Serial.print("Failed to update " + type + " data: ");
//     Serial.println(firebaseData.errorReason());
//   }
// }

// // ===================== Collisions Function =====================
// tuple<float, float, float> calculateVelocityChange() {
//   static int16_t prevAx = 0, prevAy = 0, prevAz = 0;
//   int16_t ax, ay, az;
//   mpu.getAcceleration(&ax, &ay, &az);
//   float deltaTime = 1.0;
//   float velocityX = (ax - prevAx) * deltaTime / 16384.0;
//   float velocityY = (ay - prevAy) * deltaTime / 16384.0;
//   float velocityZ = (az - prevAz) * deltaTime / 16384.0;
//   prevAx = ax;
//   prevAy = ay;
//   prevAz = az;
//   float totalVelocityChange = sqrt(velocityX * velocityX + velocityY * velocityY + velocityZ * velocityZ);
//   return {velocityX, velocityY, totalVelocityChange};
// }

// int checkForce() {
//   int sensorValue = analogRead(FSR_PIN);
//   lastForce = sensorValue;
//   sendFirebaseData("Force", sensorValue > FORCE_THRESHOLD, sensorValue);
//   return sensorValue;
// }

// bool checkOverturns() {
//   int16_t ax, ay, az;
//   mpu.getAcceleration(&ax, &ay, &az);
//   float angleX = atan2(ay, az) * 180 / PI;
//   float angleY = atan2(ax, az) * 180 / PI;
//   lastOverturns = (abs(angleX) > abs(angleY) ? abs(angleX) : abs(angleY));
//   bool overturnDetected = lastOverturns > OVERTURNS_ANGLE_THRESHOLD;
//   sendFirebaseData("Overturns", overturnDetected, lastOverturns);
//   return overturnDetected;
// }

// // ===================== دالة إرسال بيانات GPS إلى Firebase =====================
// void sendGPSDataToFirebase() {
//   while (SerialGPS.available() > 0) {
//     gps.encode(SerialGPS.read());
//   }
  
//   if (gps.location.isValid()) {
//     String lat = String(gps.location.lat(), 6);
//     String lng = String(gps.location.lng(), 6);
    
//     String dateStr = "";
//     if (gps.date.isValid()) {
//       dateStr = (gps.date.day() < 10 ? "0" : "") + String(gps.date.day()) + "/" +
//                 (gps.date.month() < 10 ? "0" : "") + String(gps.date.month()) + "/" +
//                 String(gps.date.year());
//     }
    
//     String timeStr = "";
//     if (gps.time.isValid()) {
//       timeStr = (gps.time.hour() < 10 ? "0" : "") + String(gps.time.hour()) + ":" +
//                 (gps.time.minute() < 10 ? "0" : "") + String(gps.time.minute()) + ":" +
//                 (gps.time.second() < 10 ? "0" : "") + String(gps.time.second());
//     }
    
//     FirebaseJson json;
//     json.set("Latitude", lat);
//     json.set("Longitude", lng);
//     json.set("Date", dateStr);
//     json.set("Time", timeStr);
    
//     String path = String("/BoardsSensor/") + boardID + "/Location";
//     if (Firebase.setJSON(firebaseData, path, json)) {
//       Serial.println("GPS data sent to Firebase successfully!");
//     } else {
//       Serial.print("Error sending GPS data: ");
//       Serial.println(firebaseData.errorReason());
//     }
//   }
// }

// // ===================== الدالة setup =====================
// void setup() {
//   Serial.begin(9600);
//   SerialGPS.begin(9600);

//   WiFi.begin(ssid, password);
//   while (WiFi.status() != WL_CONNECTED) {
//     delay(500);
//     Serial.println("Connecting to WiFi...");
//   }
//   Serial.println("Connected to WiFi!");

//   config.host = "smart-accident-system-default-rtdb.firebaseio.com";
//   config.signer.tokens.legacy_token = "jp4w8nU57vFIyZ7xKJ3zkYORhfz3KfzfVk2zx5dw";
//   Firebase.begin(&config, &auth);

//   Wire.begin();
//   mpu.initialize();
//   if (mpu.testConnection()) {
//     Serial.println("MPU6050 connected successfully!");
//   } else {
//     Serial.println("MPU6050 connection failed!");
//     while (1);
//   }

//   pinMode(BUZZER_PIN, OUTPUT);
// }

// // ===================== الدالة loop =====================
// void loop() {
//   auto [velocityX, velocityY, totalVelocityChange] = calculateVelocityChange();
//   velocityChanges.push_back(totalVelocityChange);
//   forceValues.push_back(checkForce());

//   sendFirebaseData("VelocityChange", totalVelocityChange > VELOCITY_THRESHOLD, totalVelocityChange);

//   bool collisionDetected = false;

//   if (sz(velocityChanges) >= VECTOR_LIMIT) {
//     float maxVelocityChange = *max_element(all(velocityChanges));
//     int maxForce = *max_element(all(forceValues));
  
//     if (maxVelocityChange > VELOCITY_THRESHOLD && maxForce > FORCE_THRESHOLD) {
//       collisionDetected = true;
//     }
//     velocityChanges.clear();
//     forceValues.clear();
//   }

//   bool overturnDetected = checkOverturns();

//   if (collisionDetected || overturnDetected) {
//     sendFirebaseData("Collision", true);
//     digitalWrite(BUZZER_PIN, HIGH);
//     delay(1000);
//   } else {
//     sendFirebaseData("Collision", false);
//     digitalWrite(BUZZER_PIN, LOW);
//   }

//   sendGPSDataToFirebase();
  
//   delay(2000);
// }
