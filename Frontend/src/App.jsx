import { useState } from 'react'
import SideBar from './components/SideBar'
import { Route, Routes, useLocation } from 'react-router-dom'
import ChatBox from './components/ChatBox'
import Credits from './pages/credits'
import Community from './pages/community'
import { assets } from './assets/assets'
import Loading from './pages/loading'
import Login from './pages/login'
import "./assets/prism.css" 
import './App.css'  
import { useAppContext } from './context/AppContext'

function App() {

  const [ismenuOpen,setIsMenuOpen] = useState(false);
  const {pathname} = useLocation();
  const {user} = useAppContext();

  if(pathname === "/loading") return <Loading />

  return (
    <>
    {!ismenuOpen && <img src={assets.menu_icon} className='absolute top-3 left-3 w-8 h-8 cursor-pointer md:hidden 
    not-dark:invert' onClick={()=>setIsMenuOpen(true)} />}
    {user ? (
      <div className='dark:bg-gradient-to-b from-[#242124] to-[#000000] dark:text-white' >
      <div className='flex h-screen w-screen'>
      <SideBar ismenuOpen={ismenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <Routes>
        <Route path='/' element={<ChatBox />}  />
        <Route path='/credits' element={<Credits />}  />
        <Route path='/community' element={<Community />}  />
      </Routes>
      </div>
    </div>
    ) : (
      <div className='bg-gradient-to-b from-[#242124] to-[#000000] flex items-center justify-center h-screen w-screen'>
        <Login />
      </div>
    )}
    </>
  )
}

export default App
