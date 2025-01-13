import { createContext, useState } from "react";
import axios from 'axios'
import {toast} from 'react-toastify'
import { data } from "react-router-dom";
export const AppContent = createContext()

export const AppContextProvider =(props)=>{
    const backendUrl = import.meta.env.VITE_BACKEND
    const [isLoggedIn,setIsLoggedIn] = useState(false)
    const [userData,setUserData] = useState(false)

    // const getAuthData=async ()=>{
    //     try {
    //         const {data}=await axios.get(backendUrl + '/api/auth/is-auth')
    //         if(data.success){
    //             setUserData(true)
    //             getUsersData()
    //         }
    //     } catch (error) {
    //         toast.error(error.message);
    //     }
    // }
    const getUsersData=async ()=>{
        try {
            const {data}=await axios.get(backendUrl + '/api/user/data')
            data.success?setUserData(data.userData):toast.error(data.message);
        } catch (error) {
            toast.error(data.message);
        }
    }

    // useEffect(()=>{
    //     getAuthData()
    // },[])
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