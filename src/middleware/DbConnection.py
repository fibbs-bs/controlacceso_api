from util.querys import queryset as q
from datetime import datetime as date
import pandas as pd
import util.bloque as bloques

class DbConnection(object):

    def __init__(self) -> None:
        self.dayN = date.today().strftime('%A')[0:2]
        self.conn = None
        self.cursor = None
        self.access = False

    def getDayN(self):
        return self.dayN

    def selectUID(self,uid:str,bloque:str,sala:int) -> str or None:
        self.cursor = self.conn.cursor()
        if self.__class__.__name__ == "PgConnection":
            self.cursor.execute("select getAccess('{}','{}',{})".format(uid,bloque,sala))
        else:
            self.cursor.execute(q['acceso']['checkAccess'].format(uid,bloque,sala))
        data = self.cursor.fetchone()
        self.cursor.close()
        if data[0] != '':
            return data[0]
        else:
            return None

    def getData(self,a):
        self.cursor = self.conn.cursor()
        self.cursor.execute(q[a]["select"])
        data = self.cursor.fetchall()
        self.cursor.close()
        return data

    def getFrame(self,table):
        df = pd.read_sql(q[table]['select'],self.conn)
        return df

    def doGet(self,a):
        self.cursor = self.conn.cursor()
        self.cursor.execute(a)
        data = self.cursor.fetchall()
        self.cursor.close()
        return data
    def getPersonas(self):
        data = self.doGet("select rut,uid from persona")
        return dict(zip([item[0] for item in data],[item[1] for item in data]))
    def getPlanificacion(self):
        data = self.doGet("select * from planificacion where bloque like '{}%'".format(bloques.getCurrentDoW_()))
        return dict(zip([item[0] for item in data],[(item[1],item[2]) for item in data]))
    def getAcceso(self):
        data = self.doGet("select id from acceso where id_planificacion like '%{}%'".format(bloques.getCurrentDoW()))
        return [item[0] for item in data]
    def do(self,a):
        self.cursor = self.conn.cursor()
        self.cursor.execute(a)
        if self.__class__.__name__=="PgConnection":
            self.conn.commit()
        self.cursor.close()
    def getRut(self,uid):
        self.cursor = self.conn.cursor()
        self.cursor.execute("select rut from persona where uid = '{}'".format(uid))
        data = self.cursor.fetchone()
        self.cursor.close()
        if data[0] != '':
            return data[0]
        else:
            return None

    def insert(self,table,A,B,C,D):
        self.cursor = self.conn.cursor()
        self.cursor.execute(q[table]['insert'].format(A,B,C,D))
        self.conn.commit()

    def delete(self,table,A,B,C,D):
        self.cursor = self.conn.cursor()
        self.cursor.execute(q[table]['delete'].format(A,B,C,D))
        self.conn.commit()

    def close(self):
        if self.cursor is not None:
            self.cursor.close()
        self.conn.close()
        del self