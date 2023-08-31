express = require('express')
mysql = require("mysql")
const jwt = require('jsonwebtoken');

require('dotenv').config();
const router = express.Router()

const pool = mysql.createPool({
  host: process.env.DB_HOST, // MySQL database host
  user: process.env.DB_USER, // MySQL username
  password: process.env.DB_PASSWORD, // MySQL password
  database: process.env.DB_DATABASE, // MySQL database name
});


const asyncWrapper = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}

const getAllTablesInfo = asyncWrapper(async (req, res) => {
  const header = req.headers['authorization'];
  let isLoggedIn = false;
  if (typeof header !== 'undefined') {
    const token = header.split(' ')[1];
    if (token) {
      jwt.verify(token, secretKey, (err, decoded) => {
        if(!err){
          isLoggedIn = true
        }
      });
    }
  }
  await pool.query('select * from tables',async(err,tables)=>{
    if(err){
      console.log(err);
      return res.status(500).json({err:err});
    }
    await pool.query('select * from menu',(err,menu)=>{
      return res.json({tables,menu,isLoggedIn:isLoggedIn})
    })
  })
})

const saveOrder = asyncWrapper(async (req,res) => {
  // {
  //   table_id : 98,
  //   isbooked:1,
  //   orders : [
  //     {
  //       item_name : "sjhdf",
  //       item_cost : 90
  //     },
  //     {
  //       item_name:"sjhgd",
  //       item_cost: 77
  //     }
  //   ],
  //   token : 2,
  //   total : total

  // }
  const {table} = req.body;
  console.log(table)
  await pool.query('select max(token) as maxToken from tables;',async(err,resul) => {
    if(err){
      console.log(err);
      return res.status(500).json({err:err});
    }
    const {maxToken} = resul[0];
    await pool.query('UPDATE tables SET isbooked = 1, token = ?, total = ? WHERE table_id = ?;',[maxToken+1,table.totalBill,table.table_id],async(err,results)=>{
      if(err){
        console.log(err);
        return res.status(500).json({err:err});
      }
  
      const promises = [];
  
      for (let i = 0; i < table.orders.length; i++) {
        promises.push(pool.query(`INSERT INTO orders (table_id, item_name, item_cost) VALUES (?, ?, ?)`, [table.table_id,table.orders[i]['item_name'],table.orders[i]['item_cost']]));
      }
      await Promise.all(promises)
      res.json({token: maxToken+1});
    })
  })
})

const getOrders = asyncWrapper(async (req,res) => {
  await pool.query(`select * from tables where isbooked = 1 ORDER BY token`,(err,results)=>{
    if(err){
      console.log(err);
      res.json(err);
    }
    res.json(results)
  })
})

const getOrder = asyncWrapper(async (req,res) => {
  const table_id = req.params.table_id
  await pool.query(`select * from orders where table_id = `+table_id,(err,results)=>{
    if(err){
      console.log(err);
      res.json(err);
    }
    res.json(results)
  })
})

const secretKey = 'your-secret-key';


// Middleware to protect routes
function authenticateToken(req, res, next) {
  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.redirect('/api/v1/login');
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.redirect('/api/v1/login');
    }
    req.user = decoded; // Make user information available to routes
    next();
  });
}




const login = asyncWrapper( async(req, res) => {
  const { username, password } = req.body;
  await pool.query(`select * from logindata where username = ? and password = ?;`,[username,password],(err,results)=>{
    if(err){
      console.log(err);
      res.json(err);
    }
    const { username, password } = req.body;

    const user = results.find(u => u.username === username && u.password === password);
    if (!user) {
      return res.status(401).send("invalid user pass");
    }
    // Create a JWT token
    const token = jwt.sign({ userId: user.id, username: user.username }, secretKey, { expiresIn: '1h' });

    res.json({ message: 'Login successful', token });
  })
})

const signUp = asyncWrapper( async(req, res) => {

  await pool.query(`select username from logindata`,async(err,results)=>{
    if(err){
      console.log(err);
      res.json(err);
    }
    const { username, password } = req.body;

    const existingUser = results.find(u => u.username === username);
    if (existingUser) {
      return res.status(401).json({ message: 'Username is already taken' });
    }

    // Create a new user
    await pool.query(`insert into logindata (username,password) values(?,?)`,[username,password]);
    res.json({ message: 'Signup successful' });
  })
});

const checkOutOrder = asyncWrapper(async (req,res) => {
  const table_id = req.params.table_id
  await pool.query(`delete from orders where table_id = `+table_id , async(err,results)=>{
    if(err){
      console.log(err);
      res.json(err);
    }
    await pool.query(`update tables set isbooked = 0, token = 0,total=0 where table_id = `+table_id )
    res.json(results)
  })
})

const deleteTable = asyncWrapper(async (req,res) => {
  // const table_id = req.params.table_id;
  const table = req.body;
  if(table.isbooked) {
    return res.status(400).json({message : "cannot delete when it is booked"})
  }
  await pool.query(`delete from tables where table_id = `+table.table_id)
  await pool.query(`delete from orders where table_id = `+table.table_id,(err,results)=>{
    if(err){
      console.log(err);
      res.json(err);
    }
    res.json(results)
  })
})

const addTable = asyncWrapper(async (req,res) => {

  await pool.query(`insert into tables values()`,(err,results)=>{
    if(err){
      console.log(err);
      res.json(err);
    }
    res.json(results)
  })
})


router.route('/login').post(login)
router.route('/signup').post(signUp)
router.route('/tables').get(getAllTablesInfo).put(saveOrder).post(authenticateToken,addTable).delete(authenticateToken,deleteTable)
// router.route('/tables/:table_id').delete(authenticateToken,deleteTable)
router.route('/orders').get(getOrders)
router.route('/orders/:table_id').get(getOrder).delete(authenticateToken,checkOutOrder)

module.exports = router
