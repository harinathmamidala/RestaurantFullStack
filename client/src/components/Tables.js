import React from 'react'
import Table from './Table'

export default function Tables({AddTable,menu,tables,onDelete,loggedin,setTables}) {

  

  return (
    <>
    <p> 
      Below interface shows occupancy of each table
      Please choose one table which is empty and try ordering 
      something we can offer </p>
    {loggedin?
      <>
      <button onClick={AddTable}  className="addBtn">Add Table</button>
      </>
        :
      <> </>
    }
    <div className='Tables'>
     {
      tables.map((oneTable,index)=>{
        return <Table loggedin={loggedin} key={index} menu={menu} oneTable={oneTable} onDelete={onDelete} setTables={setTables}/>
      })
      }
    </div>
    </>
    
  )
}
