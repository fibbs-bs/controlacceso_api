from middleware.SQLiteConnection import SQLiteConnection
from middleware.PgConnection import PgConnection
import middleware.TongoyAPI as TongoyAPI
import util.bloque as bloques
import pandas as pd

def registrarAcceso(liteCon,rut,sala,acceso):
    dow = bloques.getDiaSemana()
    bloque = bloques.getCurrentBlock()
    cuando = bloques.now()
    pgCon = PgConnection()
    if pgCon.access:
        try:
            pgCon.insert("registro",rut,dow,bloque,sala,cuando,acceso)
        finally:
            pgCon.close()
            print(rut,sala,acceso)
    else:
        liteCon.insert("registro",rut,dow,bloque,sala,cuando,acceso)
        liteCon.close()
        print(rut,sala,acceso)

def dailyPersona(liteConn,pgConn,tongoyFrame):
    tongoyUniqueRuts = tongoyFrame['rut'].unique()
    litePersonaDict = liteConn.getPersonas() #genera un dict key=rut,value=uid
    pgPersonaDict = pgConn.getPersonas() #genera un dict key=rut,value=uid
    for rutTongoy in tongoyUniqueRuts:
        #Si el rut de tongoy no está en Postgres, se agrega a Postgres
        if rutTongoy not in list(pgPersonaDict.keys()):
            pgConn.insert('persona',rutTongoy,'','','','','')
        #Si el rut de tongoy no está en SQLite, se agrega a SQLite
        if rutTongoy not in list(litePersonaDict.keys()):
            liteConn.insert('persona',rutTongoy,'','','','','')
    for rutPg in list(pgPersonaDict.keys()):
        #Si el rut de Postgres no está en SQLite, se agrega a SQLite
        if rutPg not in list(litePersonaDict.keys()):
            try:
                liteConn.insert('persona',rutPg,'','','','','')
            except:
                #Si entra acá es porque se agrego este rut en el for anterior y lanzaría un UNIQUE constraint en SQLite
                pass

def do():
    lite = SQLiteConnection()
    lite.do('drop table registro')
    lite.do("create table registro(rut text, dow text,bloque varchar(2),sala int, cuando timestamp,acceso varchar(2))")
    lite.close()

def format(string):
    if string == 'C2':
        return '2'
    else:
        return string

def dailyPlanificacion(liteConn: SQLiteConnection,pgConn: PgConnection,tongoyFrame: pd.DataFrame):
    #  El ID debe ser horario+sala (horario: Bloque+PrimerasDosLetrasEnMayusDelDOW)
    dow = bloques.getCurrentDoW()
    dow_ = bloques.getCurrentDoW_()
    tongoy = dict(
        zip(
            list(tongoyFrame[['bloque','id']].apply(lambda x: (x['bloque']+dow+str(x['id'])).ljust(7,'0'), axis=1)),
            [(dow_+'-'+format(tongoyFrame['bloque'][i]),tongoyFrame['id'][i]) for i in tongoyFrame.index]
        )
    )
    lite = liteConn.getPlanificacion()
    try:
        pg = pgConn.getPlanificacion()
        registrosLite = liteConn.getRegistros()
        if len(registrosLite)>0:
            try:
                for reg in registrosLite:
                    pgConn.insert("registro",reg['rut'],reg['dow'],reg['bloque'],reg['sala'],reg['cuando'],'')
                pgConn.delRegistros()
            except:
                pass    
    except Exception as e:
        print(e)
    for id in list(tongoy.keys()):
        if id not in list(lite.keys()):
            try:
                liteConn.insert('planificacion',id,tongoy[id][0],tongoy[id][1],'','','')
            except:
                pass
        if id not in list(pg.keys()):
            try:
                pgConn.insert('planificacion',id,tongoy[id][0],tongoy[id][1],'','','')
            except:
                pass
    for id in list(lite.keys()):
        if id not in list(tongoy.keys()):
            #falta testing acá
            try:
                liteConn.delete('planificacion',id,'','','')
                pgConn.delete('planificacion',id,'','','')
            except:
                pass

def dailyAcceso(liteConn: SQLiteConnection,pgConn: PgConnection,tongoyFrame: pd.DataFrame):
    dow = bloques.getCurrentDoW()
    tongoy = dict(
        zip(
            list(tongoyFrame[['bloque','id','rut']].apply(lambda x: (x['bloque']+dow+str(x['id'])).ljust(7,'0')+x['rut'], axis=1)),
            list(tongoyFrame['rut'])
        )
    )
    lite = liteConn.getAcceso()
    try:
        pg = pgConn.getAcceso()
    except Exception as e:
        return
    for id in list(tongoy.keys()):
        if id not in lite:
            try:
                liteConn.insert('acceso',id,id.replace(tongoy[id],''),tongoy[id],'','','')
            except Exception as e:
                print(e,'lite')
                pass
        if id not in pg:
            try:
                pgConn.insert('acceso',id,id.replace(tongoy[id],''),tongoy[id],'','','')
            except Exception as e:
                print(e,'pg')
                pass
    for id in lite:
        if id not in list(tongoy.keys()):
            #falta testing acá
            try:
                liteConn.delete('acceso',id,'','','')
                pgConn.delete('acceso',id,'','','')
                print(id)
            except Exception as e:
                print(e)
                pass

#Obtiene los datos desde Tongoy y los carga en PostgreSQL y SQLite
def dailyExecution():
    # Hacer key de diccionario los id de los datos, y value los siguientes datos en formato list
    # tuplas = [
    #           {"id_value":[]},
    #           {"id_value":[]},
    #           ...
    #          ]
    # - En planificacion:
    #   El ID debe ser horario+sala (horario: Bloque+PrimerasDosLetrasEnMayusDelDOW)
    #   Obtener id actuales y cruzarlos contra los nuevos, los que no estén en el conjunto nuevo
    #   es porque son nuevos, por lo que hay que agregarlos.
    #   Si hay tuplas que existen en el anterior y no en el nuevo deben ser eliminados.
    # - En acceso:
    #   El ID debe ser ID de planificacion + rutSinVerificador
    #   Aplicar misma lógica que en planificacion.
    # Tabla registro no posea PK.
    tongoyData = TongoyAPI.get()
    if tongoyData is None:
        return
    else:
        try:
            tongoyFrame = pd.DataFrame(tongoyData)
            liteConn = SQLiteConnection()
            pgConn = PgConnection()
            dailyPersona(liteConn,pgConn,tongoyFrame)
            dailyPlanificacion(liteConn,pgConn,tongoyFrame)
            dailyAcceso(liteConn,pgConn,tongoyFrame)
            liteConn.close()
            pgConn.close()
        except Exception as e:
            try:
                liteConn.close()
                pgConn.close()
            except:
                pass
            print(e)
            return

def getAccess(uid,sala):
    liteConn = SQLiteConnection()
    #Obtener rut según uid
    rut = None
    try:
        pgConn = PgConnection()
        rut = pgConn.getRut(uid)
    except Exception as e:
        rut = liteConn.getRut(uid)
    #Consultar a Tongoy API si el rut coincide con el bloque y sala
    if rut is not None:
        try:
            result = [tupla for tupla in TongoyAPI.get() if (tupla['rut']==rut)]
            for tupla in result:
                if tupla['id'] == sala and tupla['bloque']==bloques.getCurrentBlock():
                    registrarAcceso(liteConn,rut,sala,'Si')
                    return 200
            dbRut = pgConn.selectUID(uid,bloques.getCurrentBlockAndDay(),sala)
            if dbRut is None:
                registrarAcceso(pgConn,rut,sala,'No')
                pgConn.close()
                return 404
            else:
                registrarAcceso(pgConn,rut,sala,'Si')
                pgConn.close()
                return 200
        #Si lanza error significa que no posee conexión a Tongoy, por lo que tocará revisar en SQLite
        #para comprobar el último backup realizado.
        except Exception as e:
            print(e)
            try:
                dbRut = liteConn.selectUID(uid,bloques.getCurrentBlockAndDay(),sala)
                if dbRut is None:
                    registrarAcceso(liteConn,rut,sala,'No')
                    return 404
                else:
                    registrarAcceso(liteConn,rut,sala,'Si')
                    return 200
            except Exception as e:
                print(e)
                liteConn.close()
                return 500
    else:
        #No autorizado ya que su CARD-UID no está enrolado
        registrarAcceso(liteConn,'Null (UID:'+uid+')',sala,'No')
        return 401

def registrarUID(rut,uid):
    liteConn = SQLiteConnection()
    pgConn = PgConnection()
    try:
        liteConn.update('persona',uid,rut)
        pgConn.update('persona',uid,rut)
        return 200
    except Exception as e:

        print(e)
        return 500