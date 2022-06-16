from middleware.SQLiteConnection import SQLiteConnection
from middleware.PgConnection import PgConnection
from middleware.TongoyAPI import get

#Comprueba si es posible conectarse a Tongoy
#En caso de poder conectarse, carga los datos a PostgreSQL y a SQLite
#En caso de no poder conectarse, avisa que los datos a utilizarse serán los de SQLite
def dailyExecution():
    sqliteConn = SQLiteConnection()
    pgConn = PgConnection()
    #obtiene json() de request
    jsonResult = get()
    #Si result es nulo significa que existen algún error de conexión.
    if jsonResult is not None:
        #En este caso se debe cargar a Pg y a SQLite
        try:
            if sqliteConn.getAccess():
                sqliteConn.executeDaily(jsonResult)
            if pgConn.getAccess():
                pgConn.executeDaily(jsonResult)
            return True
        except Exception as e:
            print(e)
            return False
    else:
        #Esto significa que no hay conexión con Tongoy, por lo tanto se debe recurrir a mantener la info desde sqlite
        return False

