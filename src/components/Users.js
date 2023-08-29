import useAxiosPrivate from "../context/useAxiosPrivate"
import { useState,useEffect } from "react"
import useRefreshToken from "../context/useRefreshToken"


const Users = () => {

   const [users,setUsers]=useState()
   const refresh=useRefreshToken()
   const axiosPrivate=useAxiosPrivate()

   useEffect(()=>{
      
      const getusers=async ()=>{  
        const response= await axiosPrivate.get("/users")

        setUsers(response.data)
      } 
      getusers();


   },[])

  return (
    <article>
            <h2>Users List</h2>
            {users?.length
                ? (
                    <ul>
                        {users.map((user, i) => <li key={i}>{user?.username}</li>)}
                    </ul>
                ) : <p>No users to display</p>
            }
        </article>
  )
}

export default Users