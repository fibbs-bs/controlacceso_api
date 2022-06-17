from middleware.SQLiteConnection import SQLiteConnection
from interface.glue import dailyExecution


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
    """
    lite = SQLiteConnection()
    lite.delete()
    lite.close()