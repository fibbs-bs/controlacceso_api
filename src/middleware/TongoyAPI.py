import requests

def get():
    try:
        url = 'https://losvilos.ucn.cl/tongoy/ab.php?o=pa'
        x = requests.get(url)
        return x
    except:
        return None