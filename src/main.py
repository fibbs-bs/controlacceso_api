import interface.glue as glue

codigoSala = 353

if __name__ == '__main__':
    #cardUid = '25BEFBC2'#Pineda
    cardUid = '25BEFBC3'#Profe de rut 93370783
    print(glue.getAccess(cardUid,codigoSala))
