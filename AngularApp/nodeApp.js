const express = require("express");
const mysql = require("mysql");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

//connection with database
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database : "worldbank"
});

db.connect((err) => {
    if(err) throw err;
    console.log("MySql Connected..");
});

//connection with app
const corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));


//Body parser middleware
app.use(bodyParser.json());

//get requests from database
app.get("/countries", (req,res) =>{
    let sql = `SELECT * FROM countries `;
    let query = db.query(sql, (err,result) =>{
        if(err) throw err;
        res.send(result);
        console.log("Available countries loading to frond-end..");
    });
});

app.get("/indicators", (req,res) =>{
    let sql = `SELECT * FROM indicators `;
    let query = db.query(sql, (err,result) =>{
        if(err) throw err;
        res.send(result);
        console.log("Available inticators loading to frond-end..");
    });
});

app.get("/years", (req,res) =>{
  let sql = `SELECT YEAR FROM years `;
  let query = db.query(sql, (err,result) =>{
      if(err) throw err;
      res.send(result);
      console.log("Available years loading to frond-end..");
  });
});

app.get("/countries/:country", (req,res) =>{
  var country = req.params.country;
  console.log(country);
  let sql = `SELECT * FROM countries WHERE COUNTRY_NAME =  '${country}'`;
  let query = db.query(sql, (err,result) =>{
      if(err) throw err;
      res.send(result);
      console.log("Available countries loading to frond-end..");
  });
});

app.get("/years/:period", (req,res) =>{
  let index = req.params.period;
  //array of index first is the period and second the year
  let arr = index.split(',');
  console.log(arr[0]);
  console.log(arr[1]);
  period = arr[0];
  year = arr[1];
  let sql = `SELECT ${period} FROM years WHERE YEAR= '${year}'`;
  let query = db.query(sql, (err,result) =>{
      if(err) throw err;
      res.send(result);
      console.log("Year period loading to frond-end..");
  });
});
//NE.EXP.GNFS.ZS
app.get("/mesurement/:mes", (req,res) =>{
  let index = req.params.mes;
  //array of index first: country, second:indicator, third:year
  let arr = index.split(',');
  country = arr[0];
  indicator = arr[1];
  year = arr[2];
  let sql = `SELECT MEASUREMENT FROM measurements WHERE C_CODE = '${country}' AND I_CODE= '${indicator}' AND YEAR= '${year}'`;
  let query = db.query(sql, (err,result) =>{
      if(err) throw err;
      res.send(result);
      console.log("Mesurement loading to frond-end..");
  });
});


//Start server
app.listen("3000",() => {
    console.log("Server started on port 3000");
});


