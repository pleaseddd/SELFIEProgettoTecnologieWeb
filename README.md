# Per testare in locale:
- clonare la repo / fare "git pull origin meetisa"
- nella root dir, fare "npm run postinstall" per installare node_modules su client e su server
- "npm start" nella root per far partire in localhost:8000

## per il database
- non si può accedere al db del progetto da fuori, quindi ho creato un cluster su atlas per i test
- in server.js, usare TEST_MONGO_URL al posto di MONGO_URL in mongoose.connect()
- non so perchè ma se si usa ALMA_WIFI non riesce a connettersi al cluster, bisogna usare un altro wifi
