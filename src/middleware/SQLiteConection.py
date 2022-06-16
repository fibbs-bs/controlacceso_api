import sqlite3
from sqlite3 import Error
#from middleware.querys import queryset as q

class SQLiteConection(object):

    def __init__(self) -> None:
        try:
            self.connstr = "db/planificacion.db"
            self.conn = sqlite3.connect(self.connstr)
            print(sqlite3.version)
            self.cursor = self.conn.cursor()
        except Error as e:
            print(e)

    def getConnection(self) -> None:
        return self.conn

    def getCursor(self) -> sqlite3.Cursor:
        return self.cursor

    def executeData(self):
        #self.cursor = self.conn.cursor()
        #self.cursor.execute(q["sala"]["getNombre"].replace("X",'89'))
        self.cursor.execute(
        )

    def dailyExecution(self):
        
        self.cursor.execute()

    def close(self):
        if self.cursor is not None:
            self.cursor.close()
        self.conn.close()
        del self
