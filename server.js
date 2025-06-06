const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const { xss } = require('express-xss-sanitizer');
const rateLimit = require('express-rate-limit');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

dotenv.config({ path: "./config/config.env" });

connectDB();

//mount files
const Providers = require("./routes/providers");
const Bookings = require("./routes/Bookings");
const auth = require("./routes/auth");

const app = express();
app.use(cors());

app.use(express.json());
app.use(cookieParser());

//Sanitize data
app.use(mongoSanitize());

//Set security headers
app.use(helmet());

app.use(xss());

//Rate Limiting
const limiter=rateLimit({
windowsMs:10*60*1000,//10 mins
max: 1000
});
app.use(limiter);

//mount routes
app.use("/api/v1/providers", Providers);
app.use('/api/v1/bookings', Bookings);
app.use("/api/v1/auth", auth);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    "Server running in ",
    process.env.NODE_ENV,
    " mode on port ",
    PORT
  )
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
}); 

const swaggerOptions={
  swaggerDefinition:{
  openapi: '3.0.0',
    info: {
      title: 'Library API',
      version: '1.0.0',
      description: 'A simple Express VacQ API'
    },
    servers:
      [
        {
          url: 'http://localhost:5003/api/v1'
        }
      ],
  },
  apis:['./routes/*.js'],
};

const swaggerDocs=swaggerJsDoc(swaggerOptions);
app.use('/api-docs',swaggerUI.serve, swaggerUI.setup(swaggerDocs));