from util.querys import queryset as q
from datetime import datetime as date
from util.bloque import bloques

class DbConnection(object):

    def __init__(self) -> None:
        self.dayN = date.today().strftime('%A').lower()[0:2]
        self.conn = None
        self.cursor = None
        self.access = False

    def select(self):
        self.cursor = self.conn.cursor()
        self.cursor.execute("select * from sala")
        for el in self.cursor.fetchall():
            print(el)
        self.cursor.close()

    def delete(self):
        self.cursor = self.conn.cursor()
        self.cursor.execute("drop table planificacion")
        self.conn.commit()
        self.cursor.close()

    def executeDaily(self,json):
        self.cursor = self.conn.cursor()
        for bloque in list(bloques):
            self.cursor.execute(q['planificacion']['delete'].replace('X',self.dayN+'-'+bloque))
        for row in json:
            self.cursor.execute(q['planificacion']['insert'].replace('X',self.dayN+'-'+row['bloque']).replace('Y',str(row['id'])))
        self.conn.commit()
        print("Ok",self.__class__.__name__)
        self.cursor.close()

    def insert(self):
        arch = open("middleware/salas.csv")
        linea = arch.readline().strip()
        linea = arch.readline().strip()
        self.cursor = self.conn.cursor()
        while linea!="":
            partes = linea.split(",")
            self.cursor.execute(q["sala"]["insert"].replace('x',partes[0]).replace('y',partes[1]))
            linea = arch.readline().strip()
        arch1 = open("middleware/horarios.csv")
        linea1 = arch1.readline().strip()
        while linea1!="":
            partes = linea1.split(",")
            self.cursor.execute(q["horario"]["insert"].replace('x',partes[0]).replace('y',partes[1]).replace('z',partes[2]))
            linea1 = arch1.readline().strip()
        self.conn.commit()

    def getAccess(self):
        return self.access

    def close(self):
        if self.cursor is not None:
            self.cursor.close()
        self.conn.close()
        del self