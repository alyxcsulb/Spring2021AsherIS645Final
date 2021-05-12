// Add required packages
const express = require("express");
const app = express();

// Add addiional packages
const dblib = require("./dblib.js");
require('dotenv').config()

const multer = require("multer");
const upload = multer();

// Add middleware to parse default urlencoded form
app.use(express.urlencoded({ extended: false }));

// Set up EJS
app.set("view engine", "ejs");

// Enable CORS (see https://enable-cors.org/server_expressjs.html)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });


// Start listener
app.listen(process.env.PORT || 3000, () => {
    console.log("Server started (http://localhost:3000/) !");
});

// Setup routes
app.get("/", (req, res) => {
    //res.send ("Hello world...");
    res.render("index");
});

// Add database package and connection string (can remove ssl)
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// get and post home


// get and post sum of series
app.get("/sum", (req, res) => {
    res.render("sum");
})

app.post("/sum", async (req, res) => {
    res.render("sum");
})


// get and post import aka input
app.get("/input", async (req, res) => {
    const totRecs = await dblib.getTotalRecords();
    const book = {
  
      book_id: "",
      title: "",
      total_pages: "",
      rating: "",
      isbn: "",
      published_date: ""
  
    };
  
    res.render("input", {
      type: "get",
      totRecs: totRecs.totRecords,
      book: book
    });
  });
 
 app.post("/input",  upload.single('filename'), (req, res) => {
     if(!req.file || Object.keys(req.file).length === 0) {
         message = "Error: Import file not uploaded";
         return res.send(message);
     };
     //Read file line by line, inserting records
     const buffer = req.file.buffer; 
     const lines = buffer.toString().split(/\r?\n/);
 
     lines.forEach(line => {
          //console.log(line);
          book = line.split(",");
          //console.log(customer);
          const sql = "INSERT INTO book(book_id, title, total_pages, rating, isbn, published_date) VALUES ($1, $2, $3, $4, $5, $6)";
          pool.query(sql, book, (err, result) => {
              if (err) {
                  console.log(`Insert Error.  Error message: ${err.message}`);
              } else {
                  console.log(`Inserted successfully`);
              }
         });
     });
     message = `Processing Complete - Processed ${lines.length} records`;
     res.send(message);
 });
