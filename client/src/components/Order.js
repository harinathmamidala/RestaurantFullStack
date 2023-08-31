import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function Order({table,loggedin,closeOrder}) {
  const [orders,setOrders] = useState([]);

  useEffect(()=>{
    const getOrder = async()=>{
      try {
        const response = await axios.get('api/v1/orders/'+table.table_id);
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    getOrder()
  },[table.table_id])

  
  return(

    <>
      <h5>Orders:</h5>
      {

        orders.map(({item_name,item_cost},index)=>{
          return(
            <div className='orders' key={index}>
              <p>{item_name}</p>
              <p>{item_cost}</p>
            </div>
          )
        })
      } 
      <hr></hr>
      <div className='orders'>
        <p>TOTAL BILL</p>
        <p>{table.total}</p>
      </div>
      
      {
      loggedin?  
        <button onClick={()=>closeOrder(table.table_id)}>Close</button>:<></>
      } 
    </>
  )
}
