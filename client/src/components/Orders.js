import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Order from './Order'


export default function Orders({loggedin, setTables}) {

  const [ords,setOrds] = useState([]);

  useEffect(()=>{
    const getOrders = async() =>{
      try {
        const response = await axios.get('api/v1/orders');
        setOrds(response.data);
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    getOrders()
  },[])


  const closeOrder = async(table_id) => {
    try {
      const storedToken = localStorage.getItem('token');
      const options = {
        method: 'DELETE', 
        url: '/api/v1/orders/'+table_id, 
        headers: {
          'Authorization': `Bearer ${storedToken}`,
          'Content-Type': 'application/json', 
        },
      };
      await axios(options);
      console.log("checked out table " + table_id )
      setOrds(ords.filter((table) => table.table_id !== table_id ))
      setTables((prev) => {
        return prev.map((table)=>{
          if(table.table_id === table_id){
            return {
              table_id: table_id,
              isbooked: 0,
              token: 0,
              total: 0
            }
          }
          return table
        })
      })
    } catch (error) {
      console.error('error checking ', error);
    }
  }


  return (
    <div>
      {
        ords.map((table,index) =>{
          return(  
            <details key={index}>
              <summary>
                <h3>Table No : {table.table_id}</h3>
              </summary>
              <div>
                  <Order table={table} loggedin={loggedin} closeOrder = {closeOrder}/>
              </div>
            </details>
          )
          
        })
      }
    </div>
  )


  
}


