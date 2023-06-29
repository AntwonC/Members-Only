import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import '/styles/Navbar.css';


const Navbar = () => {

    return (
        <div>
            <nav className='navbarContainer'>
                <nav className='navbarLinksContainer'>
                    <Link to={'/login'}>
                        <button className='buttonElement'>Login</button>
                    </Link>

                    <Link to={'/signUp'}>
                        <button className='buttonElement'>Sign-Up</button>
                    </Link>

                    <Link to={'/'}>
                        <button className='buttonElement'>Home</button>
                    </Link>
                </nav>
            </nav>
        </div>
    )
}

export default Navbar;