import requests

def get():
    try:
        url = 'https://losvilos.ucn.cl/tongoy/ab.php?o=pa'
        x = requests.get(url)
        json = x.json()
        if len(json)>1:
            print("Tongoy API status:",x.status_code)
            return json
        else:
            return None
    except:
        return None

print(get())