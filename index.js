'use strict';
const express =  require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const bodyParser = require('body-parser')
const { Client } = require('pg')
let url = `postgres://firas:0000@localhost:5432/movies`;
const client = new Client(url)

const dataj  = require('./data.json');
const app = express();
const PORT = process.env.PORT;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

const apikey=process.env.API_KEY;
// routes
app.get('/favorite',favoritePageHandler);
app.get('/',dataHandler);  
app.get("/trending", trendingHandler);
app.get('/search', searchHandler);
app.get('/certification/movie/list', certificationHandler);
app.get('/discover/movie', discoverHandler);
app.post('/addMovie',addMovieHandler);
app.get('/getMovies',getMoviesHandler);
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

function addMovieHandler(req,res){
  console.log(req.body);
  
   let {title,release_date,poster_path} = req.body; 
   let sql = `INSERT INTO movies (title, release_date, poster_path)
    VALUES ($1,$2,$3) RETURNING *;`
   let values = [title, release_date, poster_path]
   client.query(sql,values).then((result)=>{
      
 
       res.status(201).json(result.rows)

   }

   ).catch((err)=>{
       errorHandler(err,req,res);
   })

}
function getMoviesHandler(req,res) {
  let sql =`SELECT * FROM movies;`; 
  client.query(sql).then((result)=>{
      
      res.json(result.rows)
  }).catch((err)=>{
      errorHandler(err,req,res)
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
client.connect().then(()=>{
  app.listen(PORT,()=>{
      console.log(`listening on port${PORT}`);
  })

}).catch()
