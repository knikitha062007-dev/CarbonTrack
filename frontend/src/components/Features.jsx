import {
    FaCar,
    FaBolt,
    FaShoppingCart,
    FaUtensils
} from "react-icons/fa";

function Features(){

    return(

<section className="features">

<div className="card">
<FaCar className="icon"/>
<h3>Transport</h3>
<p>Track daily travel emissions.</p>
</div>

<div className="card">
<FaBolt className="icon"/>
<h3>Electricity</h3>
<p>Monitor power consumption.</p>
</div>

<div className="card">
<FaUtensils className="icon"/>
<h3>Food</h3>
<p>Measure food related emissions.</p>
</div>

<div className="card">
<FaShoppingCart className="icon"/>
<h3>Shopping</h3>
<p>Analyze your purchases.</p>
</div>

</section>

    )

}

export default Features;