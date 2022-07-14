#include <Arduino.h>
#include <WiFi.h>
#include <WebServer.h>
#include <HTTPClient.h>
#include <WiFiManager.h>
#include <EEPROM.h>
// SYSTEM CONSTANTS (will be removed and moved to internal flash memory)
// const String SERVER_ADDRESS = "192.168.0.249:3000";
String UID = "";
String SERVER_ADDRESS = "";

// MODULE CONSTANTS
#define REG_COUNT 1
#define REG_PIN_COUNT REG_COUNT * 8
#define SER_PIN 19
#define RCLK_PIN 18
#define SRCLK_PIN 5
#define EEPROM_SIZE 512
#define WMOD_PIN 0

#define JSON_CONFIG_FILE "/config.json"

// VARIABLES
bool REGISTERS[REG_PIN_COUNT];
bool saveConfig = false;

// OTHER
WebServer server(80);
HTTPClient http;

// FUNCTIONS
void clearRegisters()
{ // function clearRegisters
    for (int i = REG_PIN_COUNT - 1; i >= 0; i--)
    {
        REGISTERS[i] = LOW; // LOW;
    }
}

void writeRegisters()
{ // function writeRegisters
    digitalWrite(RCLK_PIN, LOW);
    for (int i = REG_PIN_COUNT - 1; i >= 0; i--)
    {
        digitalWrite(SRCLK_PIN, LOW);
        int val = REGISTERS[i];
        digitalWrite(SER_PIN, val);
        digitalWrite(SRCLK_PIN, HIGH);
    }
    digitalWrite(RCLK_PIN, HIGH);
}

void setRegisterPin(int index, int value)
{ /* function setRegisterPin */
    REGISTERS[index] = value;
}

void boot()
{
    SERVER_ADDRESS = server.arg("ip");
    UID = server.arg("uid");
    server.send(200, "application/json", "{}");
}

void control()
{
    String node = server.arg("node");
    String state = server.arg("state");

    if (state == "1")
    {
        setRegisterPin(node.toInt(), HIGH);
    }
    else
    {
        setRegisterPin(node.toInt(), LOW);
    }
    writeRegisters();

    http.begin("http://" + String(SERVER_ADDRESS) + "/api/data/io?uid=" + UID);
    http.addHeader("Content-Type", "application/json");

    int httpResponseCode = http.PUT("{\"node\":\"" + server.arg("node") + "\",\"newState\":\"" + server.arg("state") + "\"}");
    http.end();
    server.send(200, "application/json", "{}");
}

// MAIN
void setup()
{
    // Init Serial USB
    Serial.begin(912600);
    Serial.println(F("Initializing Module"));

    WiFiManager wm;

    bool res;
    res = wm.autoConnect("Dyna Module");

    while (WiFi.status() != WL_CONNECTED)
    {
        Serial.print(".");
        delay(500);
    }
    Serial.print("");

    Serial.print("Connected to the WiFi network with IP: ");
    Serial.println(WiFi.localIP());

    // Init register
    pinMode(SER_PIN, OUTPUT);
    pinMode(RCLK_PIN, OUTPUT);
    pinMode(SRCLK_PIN, OUTPUT);
    pinMode(WMOD_PIN, INPUT_PULLUP);
    clearRegisters();
    writeRegisters();

    server.on("/control", HTTP_PUT, control);
    server.on("/boot", HTTP_POST, boot);

    server.begin();

    Serial.println("Ready!");
    delay(500);
}

void loop()
{
    if (digitalRead(WMOD_PIN) == LOW)
    {

        WiFiManager wm;
        wm.resetSettings();
        wm.setConfigPortalTimeout(120);

        Serial.println("Resetting module");
        delay(3000);
        ESP.restart();
        delay(5000);
    }
    server.handleClient();
    delay(2);
}