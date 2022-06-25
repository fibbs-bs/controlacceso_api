import interface.glue as glue

codigoSala = 42

if __name__ == '__main__':
    cardUid = '25BEFBC2'
    #print(glue.getAccess(cardUid,codigoSala)) #Pineda sala de código 42
    glue.dailyExecution()