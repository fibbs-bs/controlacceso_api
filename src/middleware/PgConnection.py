import psycopg
from middleware.DbConnection import DbConnection

class PgConnection(DbConnection):

    def __init__(self) -> None:
        DbConnection.__init__(self)
        try:
            connstr = "postgres://vrzalkcfjtdgoc:6124d64b27a67ecd43736811f206e555e5ac8b8e34a5ed258f094a18d6396a79@ec2-3-234-131-8.compute-1.amazonaws.com:5432/dbuno9hg4na1mf"
            conn_dict =  psycopg.conninfo.conninfo_to_dict(connstr)
            self.conn = psycopg.connect(**conn_dict)
            
            self.access = True
        except:
            print('error')
            self.access = False
