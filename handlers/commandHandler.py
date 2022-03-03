from commands import SYS
from commands import DTA


def execute(command, text):
    cmd = command.split("_")
    if cmd[0] == "SYS":
        print(cmd)
        SYS.execute(cmd, None)

    if cmd[0] == "DTA":
        print(cmd)
        DTA.execute(cmd, None)