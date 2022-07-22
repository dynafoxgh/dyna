#include <Arduino.h>
#include <WiFi.h>
#include <WebServer.h>
#include <HTTPClient.h>
#include <WiFiManager.h>

String UID = "1.0.0";
String SERVER_ADDRESS = "192.168.0.249:3000";

// MODULE CONSTANTS
#define REG_COUNT 1
#define REG_PIN_COUNT REG_COUNT * 8
#define SER_PIN 19
#define RCLK_PIN 18
#define SRCLK_PIN 5
#define EEPROM_SIZE 512
#define WMOD_PIN 0

#define CONFIG_FILE "/config.txt"

// VARIABLES
bool REGISTERS[REG_PIN_COUNT];
bool saveConfig = true;

// OTHER
WebServer server(80);
HTTPClient http;
WiFiManager wm;

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

    bool forceConfig = false;

    // Init Serial USB
    Serial.begin(912600);
    Serial.println(F("Initializing Module"));

    // WiFiManagerParameter server_addr("server_addr", "Server Address", SERVER_ADDRESS, 64);
    // WiFiManagerParameter uniqueid("uniqueid", "UID", UID, 16);

    // wm.addParameter(&server_addr);
    // wm.addParameter(&uniqueid);

    wm.autoConnect("DYNA MODULE");

    Serial.println("");
    Serial.println("Connected to WiFi");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());

    // strncpy(SERVER_ADDRESS, server_addr.getValue(), sizeof(SERVER_ADDRESS));
    // Serial.print("Server Address: ");
    // Serial.println(SERVER_ADDRESS);

    // strncpy(UID, uniqueid.getValue(), sizeof(UID));
    // Serial.print("UID: ");
    // Serial.println(UID);

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