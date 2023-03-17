'use strict';
const express =  require('express')
const dataj  = require('./data.json')
const app = express();
const port = 3000

// Home Page routes
app.get('/',dataHandler);  

function dataHandler(req,res){
  
        let newinfo = new info(dataj.title,dataj.poster_path,dataj.overview);
        res.json(newinfo);
  
    function info(title,poster_path,overview){
      this.title=title;
      this.poster_path=poster_path;
      this.overview=overview;
    }
   }
// Favorite Page routes 
app.get('/favorite',favoritePageHandler);

function favoritePageHandler(req,res){
    res.send("Welcome to Favorite Page");
}

// handle (status 404)
app.use((req, res, next) => {
  res.status(404).send("Sorry, something went wrong")
  
})
// handle (status 500)
 app.use((err, req, res, next) => {
   console.error(err.stack)
   res.status(500).send('Something broke!')
 })



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })