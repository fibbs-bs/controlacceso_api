import interface.glue as glue
from middleware.SQLiteConnection import SQLiteConnection
from interface.glue import dailyExecution
from middleware.PgConnection import PgConnection
import re
import serial.tools.list_ports
from picamera import PiCamera
from time import sleep
from PIL import Image
import zbarlight
import time

codigoSala = 38
##Inicio codigo para envio de -uid arduino -> raspberry
ports = serial.tools.list_ports.comports()
serialInst = serial.Serial()

portList = []


portVar="/dev/ttyACM0"
serialInst.baudrate = 9600
serialInst.port = portVar
serialInst.open()

#Fin codigo para envio de -uid arduino -> raspberry
##Inicio codigo para obtencion de uid camara
camera = PiCamera()
while True:
    camera.resolution = (1920,1080)
    camera.start_preview()
    print("Se inicio la cámara")
    serialInst.write("celeste".encode("utf-8"))
    sleep(5)
    camera.capture('/home/grupo2/Desktop/qrcode.png')
    camera.stop_preview()
    print("Cámara cerrada")
    serialInst.write("apagar".encode("utf-8"))
    file_path = '/home/grupo2/Desktop/qrcode.png'
    with open(file_path, 'rb') as image_file:
        image = Image.open(image_file)
        image.load()
    codes = str(zbarlight.scan_codes(['qrcode'], image))
    if(codes != "None"):
        textqr = codes[3:len(codes)-2]
        print(textqr)
        textqr = textqr.split(sep="-")
        if(textqr[0] == "RGS"):
            print("Metodo registro QR")
            textqr = textqr[1]
            rut = re.sub(r"\s+", "", textqr)
            timeout = time.time() + 10
            uidFinal = ""
            #Obteniendo UID desde RFID
            serialInst.write("rfid-rgs".encode("utf-8"))
            print("Acerque tarjeta para escanear")
            while True:
                if(timeout < time.time()):
                    serialInst.write("apagar".encode("utf-8"))
                    break
                if serialInst.inWaiting():
                    serialInst.write("apagar".encode("utf-8"))
                    packet = serialInst.readline()
                    print(packet.decode('utf').rstrip('\n'))
                    uidAr = re.sub(r"\s+", "", packet.decode('utf').rstrip('\n')) ##UID del RIFD concatenado
                    uidFinal = uidAr
                    print(uidFinal)
                    response = str(glue.registrarUID(rut, uidFinal))
                    print(response)
                    if(response == "200"):
                        serialInst.write("verde".encode("utf-8"))
                    else:
                        serialInst.write("rojo".encode("utf-8"))
                    sleep(2)
                    serialInst.write("apagar".encode("utf-8"))
                    break
        elif(textqr[0]=="ACS"):
            print("Metodo acceso QR")
            uidQr = textqr[1]
            response = str(glue.getAccess(uidQr, codigoSala))
            print(response)
            if(response == "200"):
                serialInst.write("unlock".encode("utf-8"))
                sleep(5)
            else:
                serialInst.write("rojo".encode("utf-8"))
                sleep(2)
                serialInst.write("apagar".encode("utf-8"))
    else:
        print("Metodo acceso RFID")
        print("Acerque tarjeta para escanear")
        serialInst.write("rfid-acs".encode("utf-8"))
        timeout = time.time() + 10
        while True:
            if(timeout < time.time()):
                serialInst.write("apagar".encode("utf-8"))
                break
            if serialInst.inWaiting():
                serialInst.write("apagar".encode("utf-8"))
                packet = serialInst.readline()
                uidAr = re.sub(r"\s+", "", packet.decode('utf').rstrip('\n')) ##UID del RIFD concatenado
                uidFinal = uidAr
                print(uidFinal)
                print("Se cerró el RFID")
                response = str(glue.getAccess(uidFinal, codigoSala))
                print(response)
                if(response == "200"):
                    serialInst.write("unlock".encode("utf-8"))
                else:
                    serialInst.write("rojo".encode("utf-8"))
                    sleep(2)
                    serialInst.write("apagar".encode("utf-8"))
                break
        sleep(2)