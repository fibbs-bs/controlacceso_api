from middleware.PgConection import PgConection
import requests



def checkRutNow(rut):
    url = 'https://losvilos.ucn.cl/tongoy/ab.php?o=pa'
    x = requests.get(url)
    #checkear status code
