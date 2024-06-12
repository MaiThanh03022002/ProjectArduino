import {Link} from "react-router-dom";
import "./Header.css"

export default function Header(){
    return(
        <nav className="Navitems">
            <Link className="home" to={'/'}><h1 className="home-h1">IoT và ứng dụng</h1></Link>
            <ul>
                <li>
                    <Link className="nav-link" to={'/'}>
                        <i className="fa-solid">Dashboard</i> 
                    </Link>
                </li>
                <li className="nav-link-ul"> 
                    <i  className="fa-solid"><Link className="nav-link" to={'/sensor'}>Sensor Data</Link></i> 
                </li>
                <li>
                    <Link className="nav-link" to={'/action'}>
                        <i className="fa-solid">Action</i> 
                    </Link>
                </li>
                <li>
                        <>
                        <Link className="nav-link" to={'/profile'}>
                            <i className="fa-solid">Profile</i> 
                        </Link></>
                </li>
            </ul>
        </nav>
    );

}