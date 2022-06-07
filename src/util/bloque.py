from datetime import datetime

bloques = { #contiene horas (datetime.time) de cada bloque
    'A':  [datetime.strptime('08:10','%H:%M').time(),datetime.strptime('09:40','%H:%M')],
    'B':  [datetime.strptime('09:55','%H:%M').time(),datetime.strptime('11:25','%H:%M')],
    'C':  [datetime.strptime('11:40','%H:%M').time(),datetime.strptime('13:10','%H:%M')],
    'C2': [datetime.strptime('13:10','%H:%M').time(),datetime.strptime('14:30','%H:%M')],
    'D':  [datetime.strptime('14:30','%H:%M').time(),datetime.strptime('16:00','%H:%M')],
    'E':  [datetime.strptime('16:15','%H:%M').time(),datetime.strptime('17:45','%H:%M')],
    'F':  [datetime.strptime('18:00','%H:%M').time(),datetime.strptime('19:30','%H:%M')],
    'G':  [datetime.strptime('19:45','%H:%M').time(),datetime.strptime('21:15','%H:%M')],
}

def getCurrentBlock():
    now = datetime.datetime.now().time()

