from util.querys import queryset as q
from datetime import datetime as date
from util.bloque import bloques
import time

class DbConnection(object):

    def __init__(self) -> None:
        self.dayN = date.today().strftime('%A')[0:2]
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
        self.cursor.execute("drop table acceso")
        self.cursor.execute(q['acceso']['create'])
        self.conn.commit()
        self.cursor.close()

    def executeDaily(self,json):
        start_time = time.time()
        self.cursor = self.conn.cursor()
        for bloque in list(bloques):
            self.cursor.execute(q['planificacion']['delete'].replace('X',self.dayN+'-'+bloque))
        self.conn.commit()
        print("Delete in",self.__class__.__name__)
        for row in json:
            #Personas (borrar)
            if self.__class__.__name__=="PgConnection": 
                try:
                    self.cursor.execute("insert into persona (rut,tipo) values ('Y','D')".replace('Y',str(row['rut'])))
                    self.conn.commit()
                except:
                    print(row['rut'])
            #Planificacion
            try:
                self.cursor.execute(q['planificacion']['insert'].replace('X',self.dayN+'-'+row['bloque']).replace('Y',str(row['id'])))
                self.conn.commit()
            except Exception as e:
                if self.__class__.__name__=="PgConnection":
                    self.conn.rollback()
                else:
                    self.cursor.execute("rollback")
            #Acceso
            try:
                self.cursor.execute(q['acceso']['insert'].replace('X',self.dayN+'-'+row['bloque']+str(row['id'])).replace('Y',str(row['rut'])))
                self.conn.commit()
            except Exception as e:
                print(e)
                if self.__class__.__name__=="PgConnection":
                    self.conn.rollback()
                else:
                    self.cursor.execute("rollback")
                print(self.dayN+'-'+row['bloque'],row['id'])
        print("Done in",self.__class__.__name__,'with',(time.time()-start_time),"seconds")
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