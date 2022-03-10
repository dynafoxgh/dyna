import json

global intents_data
global mappings_data


def init(intents, mappings):
    global intents_data
    global mappings_data
    with open(intents) as intents_file:
        intents_data = json.load(intents_file)["intents"]
    with open(mappings) as mappings_file:
        mappings_data = json.load(mappings_file)
    print(intents_data)
    print(mappings_data)


def request(audio):
    message = json.loads(audio)["text"]
    print(message)
    words = message.split(' ')
    # print(words)

    for i in range(len(words)):
        command = (' '.join(words[0:(i + 1)]))
        # print(command + " (command)")
        # print(len(intents_data))
        for j in range(len(intents_data)):
            # print(intents_data[j])
            for k in range(len(intents_data[j]["patterns"])):
                # print(intents_data[j]["patterns"])

                if command == intents_data[j]["patterns"][k]:
                    _temp_ = words
                    del _temp_[:i + 1]
                    print(_temp_)
                    return intents_data[j]["exc"], _temp_
                    # return mappings_data[intents_data[j]["exc"]]

    return None, None
