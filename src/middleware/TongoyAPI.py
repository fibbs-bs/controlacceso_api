import requests

def get():
    try:
        url = 'https://losvilos.ucn.cl/tongoy/ab.php?o=pa'
        x = requests.get(url)
        if x.status_code==200:
            print("Tongoy API status:",x.status_code)
            return x.json()
        else: 
            return None
    except:
        return None