import React from 'react'
import { useState } from 'react'
import tableImg from './images/tableImg.png'
import Item from './Item';
import axios from 'axios'


export default function Table({menu,oneTable,onDelete,loggedin,setTables}) {
  const [table,setTable]=useState(oneTable);
  const [showMenu,setShowMenu]=useState(false)

 const confirmOrder = async() => {
    try {
      if(table.orders.length===0){ 
        alert("add something to confirm order")
        return
      }
      const response = await axios.put('api/v1/tables', { table });
      console.log('Item created:', response.data);
      setShowMenu(false);
      setTables((prev) =>{
        return prev.map((ele)=>{
          if(ele.table_id === oneTable.table_id){
            return {
              table_id : ele.table_id,
              isbooked : true,
              token : response.data.token,
              total : table.totalBill
            }
          }
          return ele;
        })
      })
    } catch (error) {
      console.error('Error creating item:', error);
    }
  }

  return (
    <>
      <div className='menuDiv'  style={showMenu?{display:"block"}:{display:"none"}}>
        <div className='menuShade'>
          <div className='menu-content'>
            <span className='close' onClick={()=>setShowMenu((ele)=>!ele)}>&#215;</span>
            <h2>MENU</h2>
            {
              menu.map((item,index)=>{
                return (
                  <ul key={index}>
                    <Item  setTable={setTable} item={item}/>
                  </ul>
                )
              })
            }
            <div className='endbill'>
              <button className='addM' onClick={confirmOrder}>Confirm order</button>
              <p>Total = {table.total}</p>
            </div>
            
          </div>
        </div>
      </div>
      <div className={oneTable.isbooked?"imgDivB":'imgDiv'} onClick={()=>setShowMenu(!showMenu)}>
        {
          oneTable.isbooked?
          <>
           <h5 className='bookedmark'>BOOKED</h5>
           <h5 className='Token'>TOKEN({oneTable.token})</h5>
          </>
          :
          <h5 className='bookedmark'>EMPTY</h5>
        }
        
        <img className='tableImg' src={tableImg} alt=''/>
        <h4 className='tableNo'>Table No - {oneTable.table_id}</h4>
        {loggedin?<span className='close' onClick={(event)=>{event.stopPropagation(); onDelete(oneTable);}}>&#215;</span>:<></>}
      </div>
      
    </>
  )
}