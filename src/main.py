import psycopg
import requests
from middleware.SQLiteConection import SQLiteConection
from middleware.PgConection import PgConection
import interface.glue as glue

def db_connect():
    pg_uri = "postgres://vrzalkcfjtdgoc:6124d64b27a67ecd43736811f206e555e5ac8b8e34a5ed258f094a18d6396a79@ec2-3-234-131-8.compute-1.amazonaws.com:5432/dbuno9hg4na1mf"
    conn_dict =  psycopg.conninfo.conninfo_to_dict(pg_uri)
    conn = psycopg.connect(**conn_dict)
    cursor = conn.cursor()
    return conn,cursor
    #conn.commit()
    #cursor.close()
    #conn.close()

if __name__ == '__main__':
    """
    arch = open("reporte.csv" , "w" , encoding = 'utf-8')
    url = 'https://losvilos.ucn.cl/tongoy/ab.php?o=pa'
    x = requests.get(url)
    arch.write("rut,id_sala,nombre_sala,codigo_ramo,nombre_ramo,paralelo,bloque"+"\n")
    for row in x.json():
        arch.write(",".join(map(str, list(row.values())))+"\n")
    arch.close()
    """
    """
    pgCon = PgConection()
    pgCon.getSala()
    cursor = pgCon.getCursor()
    result = cursor.fetchall()
    #print(result)
    pgCon.close()
    liteCon = SQLiteConection()
    liteCon.executeData()
    """
    #dailyExecution()