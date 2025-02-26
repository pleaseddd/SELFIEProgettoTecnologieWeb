const express = require('express');
const app = express();
const path = require("path");


app.get('/api', (req, res) => {
    res.json({"utente":["utente1","utente2","utente3"]});
})

app.use(express.static(path.join(__dirname, "../client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});


app.listen(8000, () => {
    console.log('Server started on http://localhost:8000');
});