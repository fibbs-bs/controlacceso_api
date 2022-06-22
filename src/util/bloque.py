from datetime import datetime

bloques = { #contiene horas (datetime.time) de cada bloque
    'A':  [datetime.strptime('08:10','%H:%M').time(),datetime.strptime('09:40','%H:%M').time()],
    'B':  [datetime.strptime('09:40','%H:%M').time(),datetime.strptime('11:25','%H:%M').time()],
    'C':  [datetime.strptime('11:25','%H:%M').time(),datetime.strptime('13:10','%H:%M').time()],
    'C2': [datetime.strptime('13:10','%H:%M').time(),datetime.strptime('14:15','%H:%M').time()],
    'D':  [datetime.strptime('14:15','%H:%M').time(),datetime.strptime('16:00','%H:%M').time()],
    'E':  [datetime.strptime('16:00','%H:%M').time(),datetime.strptime('17:45','%H:%M').time()],
    'F':  [datetime.strptime('17:45','%H:%M').time(),datetime.strptime('19:30','%H:%M').time()],
    'G':  [datetime.strptime('19:30','%H:%M').time(),datetime.strptime('21:15','%H:%M').time()],
}

def getCurrentBlock():
    now = datetime.now().time()
    for bloque in bloques:
        if bloques[bloque][0] <= now <= bloques[bloque][1]:
            return bloque
    return 'H'

print(getCurrentBlock())