import json
from handlers import commandHandler

with open(".\\lib\\translations\\EN-US.json") as f:
    lang = json.load(f)


def test():
    print("test")


def execute(command, args):
    print("temp")


def analyse(audio):
    text = json.loads(audio)["text"]

    sentence = text.split(' ')
    print(text)
    i = 0
    for i in range(len(sentence) + 1):
        command = (' '.join(sentence[0:i]))

        if command in lang['COMMANDS']:
            args = sentence
            del args[0:i]
            print(args)
            commandHandler.execute(lang["COMMANDS"][command], args)
            print(lang["COMMANDS"][command])
