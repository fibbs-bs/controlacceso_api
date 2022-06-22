from middleware.SQLiteConnection import SQLiteConnection
import interface.glue as glue
import middleware.TongoyAPI as t


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
    print(glue.getAccess('25BEFBC2',42))#Pineda sala de código 42