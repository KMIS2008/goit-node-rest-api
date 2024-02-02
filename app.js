const express = require ("express");
const morgan = require ("morgan");
const cors =require ("cors");

const authRouter = require('./routes/authRouter.js')
const contactsRouter = require ("./routes/contactsRouter.js");

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const {DB_HOST} = process.env;
mongoose.set('strictQuery', true);

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/users", authRouter);
app.use("/api/contacts", contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

mongoose.connect(DB_HOST)
.then(()=>{
  console.log('Database connection successful');
  app.listen(3000, () => {
  console.log("Server is running. Use our API on port: 3000");
})})
.catch(error=>{
  console.log(error.message)
  process.exit(1)
})

// app.listen(3000, () => {
//   console.log("Server is running. Use our API on port: 3000");
// });

