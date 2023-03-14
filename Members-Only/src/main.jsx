import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, } from 'react-router-dom';
import App from './App'
import SignUp from './components/SignUp';
import Login from './components/Login';

const router = createBrowserRouter([
  {
    path: '/signUp',
    element: <SignUp />,
  },
  {
    path: '/login',
    element: <Login />
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
