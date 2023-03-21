'use strict';
const express =  require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const dataj  = require('./data.json');
const app = express();
app.use(cors());
const PORT = process.env.PORT;
const apikey=process.env.API_KEY;
// routes
app.get('/favorite',favoritePageHandler);
app.get('/',dataHandler);  
app.get("/trending", trendingHandler);
app.get('/search', searchHandler);
app.get('/certification/movie/list', certificationHandler);
app.get('/discover/movie', discoverHandler);
app.use("*", handleNtFoundError)


//function
function favoritePageHandler(req,res){
    res.send("Welcome to Favorite Page");
}

function dataHandler(req,res){
  
  let newinfo = new info(dataj.title,dataj.poster_path,dataj.overview);
  res.json(newinfo);

}

function handleNtFoundError(req, res){
  res.status(404).send("not found")
}
function trendingHandler(req, res){
  
  let url = `https://api.themoviedb.org/3/trending/all/week?api_key=${apikey}`;
  axios.get(url)
  .then((result)=>{
      console.log(result.data.results);

      let datatrending = result.data.results.map((trend)=>{
          return new trending(trend.id,trend.title,trend.release_date,trend.poster_path,trend.overview)
      })
      
      res.json(datatrending);
  })
  .catch((err)=>{
      console.log(err);
  })

} 
function searchHandler(req,res){
  let movieName = req.query.title 
  console.log(movieName)
  let url=`https://api.themoviedb.org/3/search/movie?query=${movieName}&api_key=${apikey}`
  axios.get(url)
  .then((result)=>{
       
       let response= result.data.results;
       res.json(response);
  })
  .catch((err)=>{
       console.log(err)
  })

  
}  

function certificationHandler(req,res){
  
  let url=`https://api.themoviedb.org/3/certification/movie/list?api_key=${apikey}`
  axios.get(url)
  .then((result)=>{
      
        let certification= result.data.certifications;
        res.json(certification);
  })
  .catch((err)=>{
       console.log(err)
  })
}  
function discoverHandler(req,res){
 
  let url=`https://api.themoviedb.org/3/discover/movie?api_key=${apikey}`
  axios.get(url)
  .then((result)=>{
       console.log(result.data.results);
        let discover = result.data.results;
        res.json(discover);
  })
  .catch((err)=>{
       console.log(err)
  })

  
}  
function info(title,poster_path,overview){
  this.title=title;
  this.poster_path=poster_path;
  this.overview=overview;
}
function trending (id,title,release_date,poster_path,overview){
  this.id=id;
  this.title=title;
  this.release_date=release_date;
  this.poster_path=poster_path;
  this.overview=overview;
}

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
  })