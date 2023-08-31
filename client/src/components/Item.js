import React, { useState } from 'react'

export default function Item({setTable,item}) {
  const [Added,setAdded]=useState(0);
  function add(){
    setTable((table)=>{
      return table.orders?
      {
        ...table,
        orders:[...table.orders,item],
        total:table.total+item.item_cost
      }
      :
      {
        ...table,orders:[item],
        total:item.item_cost
      }
    })
    setAdded(Added+1)
  }


  function remove(){
    setTable((table)=>{

      var temp=[];
      let totalBill = 0;
      var i=0;  
      for(i=0;i<table.orders.length;i++){
        if(table.orders[i]===item){
          break;
        }
        temp.push(table.orders[i]);
        totalBill = totalBill + table.orders[i].item_cost
      }
      for(i=i+1;i<table.orders.length;i++){
        temp.push(table.orders[i]);
        totalBill = totalBill + table.orders[i].item_cost
      }
      if(Added>0)
      setAdded(Added-1)
      return {...table,orders:temp,total:totalBill}
    })

  }

  return (
  
    <>
    
    <li>
      <div className='item' style={Added>0?{backgroundColor:"rgba(70, 231, 84, 0.833)"}:{backgroundColor:"white"}}>
        <p className='itemname'>{item.item_name}</p>
        <p className='itemcost'>{item.item_cost}</p>
      </div>
      
      <button className='removeM' onClick={remove}>remove</button>
      <button className='addM' onClick={add}>add</button>
      <button style={{backgroundColor:"rgba(69, 211, 251, 0.833)"}}>Quantity = {Added}</button>
      
    </li>
    </>
    
  )
}
