"use client"
import React,{ useEffect, useState } from'react';
import axios from 'axios';
import { UserDetailContext } from './context/UserDetailContext';
import { Toaster } from 'sonner';
import { useUser } from '@clerk/nextjs';

const provider = ({children} : {children: React.ReactNode}) => {
const [userDetail, setUserDetail] = useState<any>();
const { user, isLoaded } = useUser();
 useEffect(() => {
   if (isLoaded && user) {
            CreateNewUser();
        }
  }, [user, isLoaded]); 
    
    const CreateNewUser = async ()=>{
        const result = await axios.post('/api/user',{});
        console.log(result.data);
        setUserDetail(result.data);
    
    }

  return (
    <div>
        <UserDetailContext.Provider value={{userDetail,setUserDetail}}>
          <div className='max-w-7xl mx-auto'>
             {children}
             
          </div>
       </UserDetailContext.Provider>
    </div>
  )
}

export default provider
