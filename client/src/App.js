import './App.css';
import Header from './components/Header';
import Tables from './components/Tables';
import Login from './components/Login';
import Orders from './components/Orders';
import axios from 'axios'
import { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
function App() {
   
  const [tables,setTables] = useState([])
  const [menu,setMenu]=useState([]);
  const [loggedin,setLoggedin]=useState(false);

  useEffect(()=>{
    const fetchData = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        const options = {
          method: 'GET', 
          url: '/api/v1/tables', 
          headers: {
            'Authorization': `Bearer ${storedToken}`,
            'Content-Type': 'application/json', 
          },
        };
        const response = await axios(options);
        setTables(response.data.tables);
        setMenu(response.data.menu)
        setLoggedin(response.data.isLoggedIn)
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData()

  },[])







 



  const AddTable = async() => {
    try {
      const storedToken = localStorage.getItem('token');
      const options = {
        method: 'POST', 
        url: '/api/v1/tables', 
        headers: {
          'Authorization': `Bearer ${storedToken}`,
          'Content-Type': 'application/json', 
        },
      };
      const response = await axios(options);
      setTables([...tables,{
        table_id:response.data.insertId,
        isbooked: 0,
        token: 0,
        total: 0
      }])
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    
    
  }



  
  const onDelete=async(table)=>{
    try {
      const storedToken = localStorage.getItem('token');
      const options = {
        method: 'DELETE', 
        url: '/api/v1/tables/', 
        headers: {
          'Authorization': `Bearer ${storedToken}`,
          'Content-Type': 'application/json', 
        },
        data:table
      };
      await axios(options);
      setTables(tables.filter((ele)=>table.table_id !== ele.table_id))
    } catch (error) {
      alert("cannot remove when its booked")
      console.error('Error fetching data:', error);
    }
  }





  return (
    <Router>
      <h2>Welcome to Our restaurent</h2>
      <Header /> 
      <Login loggedin={loggedin} setLoggedin={setLoggedin}  />
      

      <Routes>
        <Route exact path="/" element={
          <>
          <Tables AddTable={AddTable} loggedin={loggedin} menu={menu} tables={tables} onDelete={onDelete} setTables={setTables}/>
          </>
        }> 
        </Route>
        <Route exact path="/orders" element={<Orders loggedin={loggedin} setTables={setTables}/>}>
        
          
        </Route>
         <Route exact path="/contact" element={
          <div>
            contact email harinathmamidala@gamil.com
          </div>
           
         }>

         </Route>
         <Route exact path="/about" element={
          <p >
            The food you love...The Tradition we follow... We welcome you to indulge in our traditional creations....
            We serve a wide variety of authentic Hyderabadi, Indian and Indo Chinese cuisine. Cooking is an art and our chefs have mastered the art by combining traditional recipes and adding their own personal touch to it. Every delicious dish that leaves our kitchen is created by one of our highly acclaimed chefs. Whether you eat a simple Chicken tikka kebab or our signature dish Hyderabad Nawabi Chicken Dum Biryani, you are sure to enjoy the tantalizing flavors we have to offer.
          </p>
           
         }>

         </Route>
      </Routes>

      <p className='footer'>Never become waiter by waiting for waiter</p> 
      
    </Router>
  );
}

export default App;
