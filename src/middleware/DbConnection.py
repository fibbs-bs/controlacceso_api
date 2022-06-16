from util.querys import queryset as q
from datetime import datetime as date

class DbConnection(object):

    def __init__(self) -> None:
        self.dayN = date.today().strftime('%A').lower()[0:2]
        self.conn = None
        self.cursor = None
        self.access = False

    def executeDaily(self,json):
        self.cursor = self.conn.cursor()
        for row in json:
            self.cursor.execute(q['planificacion']['insert'].replace('X',self.dayN+'-'+row['bloque']).replace('Y',row['id']))
        self.cursor.close()

    def getAccess(self):
        return self.access

    def close(self):
        if self.cursor is not None:
            self.cursor.close()
        self.conn.close()
        del self