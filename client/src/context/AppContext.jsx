import { createContext } from "react";

export const AppContent = createContext()

export const AppContextProvider =(props)=>{
    const value ={
        
    }
    return(
            <AppContent.Provider> 
                {props.children}
            </AppContent.Provider>
    )
}