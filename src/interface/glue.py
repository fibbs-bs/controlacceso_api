from tokenize import String
from middleware.SQLiteConnection import SQLiteConnection
from middleware.PgConnection import PgConnection
import middleware.TongoyAPI as TongoyAPI
import util.bloque as bloques

#Comprueba si es posible conectarse a Tongoy
#En caso de poder conectarse, carga los datos a PostgreSQL y a SQLite
#En caso de no poder conectarse, avisa que los datos a utilizarse serán los de SQLite
def dailyExecution():
    #obtiene json() de request
    jsonResult = TongoyAPI.get()
    #Si result es nulo significa que existen algún error de conexión.
    if jsonResult is not None:
        #En este caso se debe cargar a Pg y a SQLite
        try:
            sqliteConn = SQLiteConnection()
            if sqliteConn.getAccess():
                sqliteConn.executeDaily(jsonResult)
                sqliteConn.close()
            pgConn = PgConnection()
            if pgConn.getAccess():
                pgConn.executeDaily(jsonResult)
                pgConn.close()
            return True
        except Exception as e:
            print(e)
            return False
    else:
        #Esto significa que no hay conexión con Tongoy, por lo tanto se debe recurrir a mantener la info desde sqlite
        return False
    


def getAccess(uid,sala):
    bloque = bloques.getCurrentBlock()
    #Obtener rut según uid
    rut = None
    try:
        pgConn = PgConnection()
        rut = pgConn.getRut(uid)
    except Exception as e:
        print('Error de conexión con PostreSQL',e)
        liteConn = SQLiteConnection()
        rut = liteConn.getRut(uid)
    if rut is not None:
        try:
            result = [tupla for tupla in TongoyAPI.get() if (tupla['rut']==rut)]
            for tupla in result:
                if tupla['id'] == sala and tupla['bloque']==bloque:
                    return 200
            return 404
        except Exception as e:
            print(e)
            return 500
    else:
        return 500