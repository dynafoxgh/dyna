from commands import WEATHER


def execute(cat, args):
    if cat[1] == "WEATHER":
        WEATHER.execute(cat, args)
