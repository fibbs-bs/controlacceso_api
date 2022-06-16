import requests

def get():
    try:
        url = 'https://losvilos.ucn.cl/tongoy/ab.php?o=pa'
        x = requests.get(url)
        if x.status_code==200:
            return x.json()
        else: 
            return None
    except:
        return None