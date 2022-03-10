from datetime import datetime
from vosk import Model, KaldiRecognizer
# from neuralintents import GenericAssistant
from dotenv import load_dotenv
import intents as vulpes
import pyttsx3 as tts
import sys
import pyaudio
import json

with open(".\\lib\\translations\\NL-NL.json") as f:
    lang = json.load(f)

load_dotenv()

vulpes.init(".\\lib\\intents-en.json", ".\\lib\\mappings.json")

model = Model('.\\lib\\lang\\en')
engine = tts.init()
engine.setProperty("voice", engine.getProperty("voices")[1].id)
engine.setProperty("rate", 172)
recognizer = KaldiRecognizer(model, 16000)

capture = pyaudio.PyAudio()
stream = capture.open(format=pyaudio.paInt16,
                      channels=1,
                      rate=16000,
                      input=True,
                      frames_per_buffer=8192)
stream.start_stream()


def _say_(text):
    engine.say(text)
    engine.runAndWait()


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


# test


def main():
    print("Ready and listening!")
    while True:
        data = stream.read(4096, exception_on_overflow=False)
        if recognizer.AcceptWaveform(data):
            exc, args = vulpes.request(recognizer.Result())
            run(exc, args)


main()