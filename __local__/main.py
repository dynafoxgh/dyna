from datetime import datetime
from sqlite3 import adapt
from vosk import Model, KaldiRecognizer
from dotenv import load_dotenv
import intents as vulpes
from playsound import playsound
import pyttsx3 as tts
import sys
import pyaudio
import json
import time

load_dotenv()

vulpes.init(".\\intents\\intents-en.json")

model = Model('.\\vosk-data\\en-us')
engine = tts.init()
engine.setProperty("voice", engine.getProperty("voices")[0].id)
engine.setProperty("rate", 172)
recognizer = KaldiRecognizer(model, 16000)

capture = pyaudio.PyAudio()
stream = capture.open(format=pyaudio.paInt16,
                      channels=1,
                      rate=16000,
                      input=True,
                      frames_per_buffer=8192)
stream.start_stream()

active = False


def _say_(text):
    engine.say(text)
    engine.runAndWait()


def _checkcall_(audio):
    text = json.loads(audio)["text"]
    print(json.loads(audio)["text"])

    if text == "he milo" or text == "hey milo" or text == "google" or text == "hey google" or text == "he google" or text == "he fixes" or text == "he fixes":

        global active
        active = True
    else:
        return False
    playsound(".\\audio\\activate.mp3")


def _listen_():
    data = stream.read(4096, exception_on_overflow=False)
    valid = False
    while valid == False:
        if recognizer.AcceptWaveform(data):
            audio = recognizer.Result()
            return audio


def run(exc, args):
    if "SYS_EXIT" == exc:
        SYS_EXIT()
    elif "TIME" == exc:
        TIME(args)


def TIME(args):
    print("The time is " + datetime.now().strftime("%I %M %p"))
    _say_("The time is " + datetime.now().strftime("%I %M %p"))


def SYS_EXIT():
    _say_("Exiting Now")
    sys.exit(0)


def main():
    global active
    playsound(".\\audio\\ready.mp3")
    print("Ready and listening!")
    while True:
        data = stream.read(4096, exception_on_overflow=False)
        if recognizer.AcceptWaveform(data):
            audio = recognizer.Result()
            print(audio)

            if not active:
                _checkcall_(audio)

            elif active:

                print(active)
                exc, args = vulpes.request(audio)
                if exc == None:
                    playsound(".\\audio\\canceled.mp3")
                active = False
                run(exc, args)


main()