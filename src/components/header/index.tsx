import {useContext} from 'react'
import logoImg from '../../assets/universe.png'
import { Link } from 'react-router-dom'
import { FiUser, FiLogIn } from 'react-icons/fi'
import  '../header/index.css'
import styles from "./index.css"
import { AuthContext } from '../../context/AuthContext'



export function Header() {
  const {signed, loadingAuth} = useContext(AuthContext);


  return (


    <div className="w-full flex items-center justify-center h-16 bg-white drop-shadow mb-4">
    <header className="flex w-full max-w-7xl items-center justify-between px-4 mx-auto">

 
        <Link to="/">
          <img
            src={logoImg}
            alt="Logo do site" />
        </Link>

        {!loadingAuth && signed && (
          <Link to="/dashboard">
            <div className="border-2 rounded-full p-1 border-gray-900">
              <FiUser size={22} color="#000" />
            </div>
          </Link>
        )}

        {!loadingAuth && !signed && (
          <Link to="/login">
            <div className="border-2 rounded-full p-1 border-gray-900">
              <FiLogIn size={22} color="#000" />
            </div>
          </Link>
        )}
      </header>
    </div>
  )
}