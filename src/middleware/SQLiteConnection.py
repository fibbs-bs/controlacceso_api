import sqlite3
from middleware.DbConnection import DbConnection

class SQLiteConnection(DbConnection):

    def __init__(self) -> None:
        DbConnection.__init__(self)
        try:
            self.connstr = "/home/grupo2/controlacceso_api/src/db/planificacion.db"
            self.conn = sqlite3.connect(self.connstr)
            self.access = True
        except Exception as e:
            self.access = False