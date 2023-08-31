express = require('express')
app = express();
const cors = require("cors");
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  credentials: true, // Allow cookies and other credentials to be sent
}));
routes = require('./Routes/routes')
path = require("path")
const cookieParser = require('cookie-parser');


app.use(express.static('./public/build'))

app.get('*', (req, res, next) => {
  if (req.url.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(__dirname, './public/build/index.html'));
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(cookieParser());


app.use('/api/v1',routes)

app.use((req, res) => res.status(404).send('Route does not exist'))

app.use((err, req, res, next) => {
  console.log({err:err})
  return res.status(500).json({ err: err })
})

app.listen(3001,()=>{
  console.log("server is running on port 3001")
})

