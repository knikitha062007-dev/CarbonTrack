import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { FaLeaf } from "react-icons/fa";
import { Link } from "react-router-dom";

function Navbar() {



    return(

<nav className="navbar">

<div className="logo">
<FaLeaf/>
<span>CarbonTracker</span>
</div>

<ul className="nav-links">

<li>Home</li>
<li>Features</li>
<li>About</li>
<li>Contact</li>

</ul>

<div className="nav-buttons">

<Link to="/login">
<button className="login-btn">
Login
</button>
</Link>

<Link to="/register">
<button className="start-btn">
Get Started
</button>
</Link>

</div>

</nav>

    )

}

export default Navbar;