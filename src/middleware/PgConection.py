import psycopg
from middleware.querys import queryset as q
from datetime import datetime as date

class PgConection(object):

    def __init__(self) -> None:
        self.dayN = date.today().strftime('%A').lower()[0:2]
        try:
            self.connstr = "postgres://vrzalkcfjtdgoc:6124d64b27a67ecd43736811f206e555e5ac8b8e34a5ed258f094a18d6396a79@ec2-3-234-131-8.compute-1.amazonaws.com:5432/dbuno9hg4na1mf"
            conn_dict =  psycopg.conninfo.conninfo_to_dict(self.connstr)
            self.conn = psycopg.connect(**conn_dict)
        except:
            raise ConnectionError

    def getConnection(self) -> None:
        return self.conn

    def getCursor(self) -> psycopg.Cursor:
        return self.cursor

    def executeDaily(self,json):
        self.cursor = self.conn.cursor()
        for row in json:
            self.cursor.execute(q['planificacion']['insert'].replace('X',self.dayN+'-'+row['bloque']).replace('Y',row['id']))
        self.cursor.close()

    def close(self):
        if self.cursor is not None:
            self.cursor.close()
        self.conn.close()
        del self