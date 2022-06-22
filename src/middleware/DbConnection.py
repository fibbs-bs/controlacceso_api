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

    def getDayN(self):
        return self.dayN

    def selectUID(self,uid,bloque,sala):
        self.cursor = self.conn.cursor()
        if self.__class__.__name__ == "PgConnection":
            self.cursor.execute("select getAccess('{}','{}',{})".format(uid,bloque,sala))
        else:
            self.cursor.execute("")
        for el in self.cursor.fetchall():
            print(el)
        self.cursor.close()
        return self.cursor.fetchone()

    def getRut(self,uid):
        self.cursor = self.conn.cursor()
        self.cursor.execute("select rut from persona where uid = '{}'".format(uid))
        data = self.cursor.fetchone()
        self.cursor.close()
        if data[0] != '':
            return data[0]
        else:
            return None

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
            #Planificacion
            try:
                self.cursor.execute(q['planificacion']['insert'].replace('X',self.dayN+'-'+row['bloque']).replace('Y',str(row['id'])))
                self.conn.commit()
            except Exception as e:
                print(e)
                if self.__class__.__name__ == "PgConnection":
                    self.conn.rollback()
                else:
                    self.cursor.execute("rollback")
            #Acceso
            try:
                self.cursor.execute(q['acceso']['insert'].replace('X',self.dayN+'-'+row['bloque']+str(row['id'])).replace('Y',str(row['rut'])))
                self.conn.commit()
            except Exception as e:
                print(e)
                if self.__class__.__name__ == "PgConnection":
                    self.conn.rollback()
                else:
                    self.cursor.execute("rollback")
                print(self.dayN+'-'+row['bloque'],row['id'])
        print("Done in",self.__class__.__name__,'with',(time.time()-start_time),"seconds")
        self.cursor.close()


    def close(self):
        if self.cursor is not None:
            self.cursor.close()
        self.conn.close()
        del self