# Per testare in locale:
- clonare la repo / fare "git pull origin meetisa"
- nella root dir, fare "npm run postinstall" per installare node_modules su client e su server
- "npm start" nella root per far partire in localhost:8000

## per il database
- non si può accedere al db del progetto da fuori, quindi ho creato un cluster su atlas per i test
- in server.js, usare TEST_MONGO_URL al posto di MONGO_URL in mongoose.connect()
- non so perchè ma se si usa ALMA_WIFI non riesce a connettersi al cluster, bisogna usare un altro wifi


#Utenti per il test:
fv1
  email:fv1@gmail.com
  pw:12345678a
  
fv2
  email:fv2@gmail.com
  pw:12345678a
  
as1
  email:as1@gmail.com
  pw:12345678a
  
asPM
  email:asPM@gmail.com
  pw:12345678a
  
utente1
  email:utente1@gmail.com
  pw:12345678a

utente2
  email:utente2@gmail.com
  pw:12345678a

utente3
email:utente3@gmail.com
pw:12345678a
