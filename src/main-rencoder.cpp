#include <Arduino.h>
#include <BleKeyboard.h>

// Rotary Encoder Inputs
#define inputCLK 25
#define inputDT 33

int counter = 0;
int currentStateCLK;
int previousStateCLK;

String encdir = "";

BleKeyboard bleKeyboard("BLE_Switcheroonie", "BLough", 100);

void setup()
{

    // Set encoder pins as inputs
    pinMode(inputCLK, INPUT);
    pinMode(inputDT, INPUT);

    // Setup Serial Monitor
    Serial.begin(912600);
    bleKeyboard.begin();
    // Read the initial state of inputCLK
    // Assign to previousStateCLK variable
    previousStateCLK = digitalRead(inputCLK);
}

void loop()
{

    // Read the current state of inputCLK
    currentStateCLK = digitalRead(inputCLK);

    // If the previous and the current state of the inputCLK are different then a pulse has occured
    if (currentStateCLK != previousStateCLK)
    {

        // If the inputDT state is different than the inputCLK state then
        // the encoder is rotating counterclockwise
        if (digitalRead(inputDT) != currentStateCLK)
        {
            counter--;
            encdir = "CCW";
            bleKeyboard.write(KEY_MEDIA_VOLUME_UP);
            // digitalWrite(ledCW, LOW);
            // digitalWrite(ledCCW, HIGH);
        }
        else
        {
            // Encoder is rotating clockwise
            counter++;
            encdir = "CW";
            bleKeyboard.write(KEY_MEDIA_VOLUME_DOWN);
            // digitalWrite(ledCW, HIGH);
            // digitalWrite(ledCCW, LOW);
        }
        Serial.print("Direction: ");
        Serial.print(encdir);
        Serial.print(" -- Value: ");
        Serial.println(counter);
    }
    // Update previousStateCLK with the current state
    previousStateCLK = currentStateCLK;
}

// #include <Arduino.h>

// void setup()
// {
//     Serial.begin(912600);
// }

// void loop()
// {
//     Serial.println("1");
//     delay(1000);
// }