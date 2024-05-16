/* eslint-disable react/prop-types */
import './CardPropos.css';
import { Link } from 'react-router-dom';
import useFetch from '../../hooks/useFetch'

function CardPropos({ prop }) {
   const {data: userData} = useFetch(`http://localhost:8000/api/users/${prop.author}`)

   return (
      <div className={`cardPropos ${prop.approved && 'approvedPropos'}`}>
         <div className="cpLeft">
            <div className='cpInfo'>
               <span>Дата створення: {new Date(prop.createdAt).toLocaleDateString()}</span>
               <span className="desc">{prop.desc}</span>
               <Link to={`/users/${userData._id}`} style={{textDecoration:'none', color:'inherit'}}>
                  <div className="userInfo">
                     {userData.avatar ? <img src={userData.avatar} alt={userData.username} /> : null}
                     <p>{userData.username}</p>
                  </div>
               </Link>
            </div>
         </div>
         <div className="cpRight">
            <h3 className="cpPrice">{parseInt(prop.price).toLocaleString('fr-FR')} UAH</h3>
         </div>
      </div>
   );
}
export default CardPropos;