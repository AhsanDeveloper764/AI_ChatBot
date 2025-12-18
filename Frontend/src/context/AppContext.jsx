import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyChats, dummyUserData } from "../assets/assets";

const AppContext = createContext();

export const AppContextProvider = ({children}) => {
    const navigate = useNavigate();
    const [user,setUser] = useState(null);
    const [chats,setChats] = useState([]);
    const [selectedChats,setSelectedChats] = useState(null);
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    const fetchUser = async () => {
        setUser(dummyUserData)
    }

    const fetchUsersChats = async () => {
        setChats(dummyChats)
        setSelectedChats(dummyChats[0]) 
    }
    // Ye user ke sabhi chats set karta hai aur first chat ko “selected” bana deta hai.

    useEffect(()=>{
        if(theme === "dark"){
            document.documentElement.classList.add('dark')
        }else{
            document.documentElement.classList.remove('dark')
        }
        localStorage.setItem("theme",theme)
    },[theme])
    // Jab bhi theme change hoti hai:
    // Agar theme truthy hai → <html> tag par "dark" class add hoti hai
    // warna remove ho jati hai.

    useEffect(()=>{
        if(user){
            fetchUsersChats()
        }else{
            setChats([])
            setSelectedChats(null)
        }
    },[user])

    // Jab bhi user change hota hai:
    // Agar user exist karta hai → chats load karo (fetchUsersChats())
    // Agar user null hai → sab chats clear kar do
    // Is line ki wajah se jab user dummy data se update hota hai, tab chats render hoti hain

    useEffect(()=>{
        fetchUser();
    },[])   

    const value = {
        navigate,fetchUser,user,setUser,chats,setChats,
        selectedChats,setSelectedChats,theme,setTheme
    }
    return <>
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    </>
}

export const useAppContext = () => useContext(AppContext);