import interface.glue as glue

try:
    glue.dailyExecution()
except Exception as e:
    print(e)