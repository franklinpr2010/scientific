
import { createBrowserRouter} from 'react-router-dom'
import {Home} from './pages/home'
import {Login} from './pages/login'
import {Contents} from './pages/contents'
import {Dashboard} from './pages/dashboard'
import {Register} from './pages/register'

import {Layout} from './components/layout'
import { Private } from './routes/Private'
import { Nova } from './pages/dashboard/nova'

const router = createBrowserRouter([
  {
    element: <Layout/>,
    children: [
      
    {
      path: '/',
      element: <Private><Home></Home></Private>
    },

    {
      path: '/content/:id',
      element: <Private><Contents></Contents></Private>
    },

    {
      path: '/dashboard',
      element: <Private><Dashboard></Dashboard></Private>
    },

    {
      path: '/dashboard/nova',
      element: <Private><Nova></Nova></Private>
    }
  
    ]
  }, 

    {
      path: '/login',
      element: <Login></Login>
    },
    {
      path: '/register',
      element: <Register></Register>
    }
  
  
])

export {router};




