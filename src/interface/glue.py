from middleware.PgConection import PgConection
from middleware.TongoyAPI import get

#Comprueba si es posible conectarse a Tongoy
#En caso de poder conectarse, carga los datos a PostgreSQL y a SQLite
#En caso de no poder conectarse, avisa que los datos a utilizarse serán los de SQLite
def dailyExecution():
    #obtiene json() de request
    result = get()
    #Si result es nulo significa que existen algún error de conexión.
    if result is not None:
        #En este caso se debe cargar a Pg y a SQLite
        for row in result:
            print(row)
    #Result es nulo, error
