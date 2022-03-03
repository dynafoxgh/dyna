from js2py import require
from vosk import Model, KaldiRecognizer
import pyttsx3
import sys
import pyaudio
import json
from dotenv import load_dotenv
from handlers import mainHandler

with open(".\\lib\\translations\\NL-NL.json") as f:
    lang = json.load(f)

load_dotenv()

model = Model('.\\lib\\lang\\en')
engine = pyttsx3.init()
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

print("Ready and listening!")


def analyse_audio(audio):
    # engine.say(audio)
    # engine.runAndWait()
    mainHandler.analyse(audio)
    # if "milo" not in command:
    #     return

    # mainHandler.execute(lang["COMMANDS"][command])
    # print(lang["COMMANDS"][command])
    # if command == "shutdown" or command == "shut down":
    #     sys.exit()


while True:
    data = stream.read(4096, exception_on_overflow=False)
    if recognizer.AcceptWaveform(data):
        # print(recognizer.Result())
        # if "python" in json.loads(recognizer.Result())["text"]:
        analyse_audio(recognizer.Result())

print(model)