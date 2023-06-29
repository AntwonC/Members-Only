import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import '/styles/NavbarDashboard.css';

const NavbarDashboard = ({ logoutLogic , name, createMessage}) => {


    return (
        <div>
            <nav className='navbarContainer'>
                <nav className='navbarLinksContainer'>
                    <nav className='leftSide'>
                        <nav className='dashboardUserName'>{name}</nav>
                    </nav>

                    <nav className='rightSide'>
                        <nav className="buttonElement" onClick={createMessage}>Create Message</nav>
                        <Link to={'/'}>
                            <button className='buttonElement' onClick={logoutLogic}>Logout</button>
                        </Link>
                    </nav>
                </nav>
            </nav>
        </div>
    )
}

export default NavbarDashboard;