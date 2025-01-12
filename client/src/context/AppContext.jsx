import { createContext, useState } from "react";
import axios from 'axios'
import {toast} from 'react-toastify'
export const AppContent = createContext()

export const AppContextProvider =(props)=>{
    const backendUrl = import.meta.env.VITE_BACKEND
    const [isLoggedIn,setIsLoggedIn] = useState(false)
    const [userData,setUserData] = useState(false)

    const getUsersData=async ()=>{
        try {
            const {data}=await axios.get(backendUrl + '/api/user/data')
            data.success?setUserData(true):toast.error(data.message);
        } catch (error) {
            toast.error(data.message);
        }
    }
    const value ={
        backendUrl,
        isLoggedIn,setIsLoggedIn, 
        userData,setUserData,
        getUsersData
    }
    return(
            <AppContent.Provider value={value}> 
                {props.children}
            </AppContent.Provider>
    )
}