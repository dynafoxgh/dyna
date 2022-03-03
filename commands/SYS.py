import sys


def execute(cat, args):
    if cat[1] == "ACTION":
        ACTION(cat, None)


def ACTION(cat, args):
    if cat[2] == "SHUTDOWN":
        print("shutdown")
        sys.exit()