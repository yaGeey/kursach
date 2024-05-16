import './Card.css'
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Card({ item }) {
   const [date, setDate] = useState('');
   const [error, setError] = useState(false);
   
   useEffect(() => {
      // check for time
      const timeEnd = new Date(item.dateEnd)
      const timeNow = new Date()
      if (timeEnd <= timeNow) {
         setError(true)
         setDate('Термін закінчився')
      }
      else {
         const time = new Date(timeEnd - timeNow);
         setDate(`${time.getDate()} дн. ${time.getHours()} год.`)
      }
   }, [])

   return (
      <>
      <Link to={`/tenders/${item._id}`} 
               style={{textDecoration: 'none', color: 'inherit', width: "100%", display: 'flex', justifyContent: 'center' }}>
      <div className={`Card ${error || item.stopped ? 'stopped' : 'active'} ${item.approvedProp && 'approved'}`}>
         <div className="cLeft">
            <div className='cLogo'>
               {item.logo && <img src={item.logo} alt="logo"/>}
            </div>
            <div className="cInfo">
               <h1>{item.title}</h1>
               <span>Дата створення: {new Date(item.createdAt).toLocaleDateString()}</span>
               <span>Дата закінчення: {new Date(item.dateEnd).toLocaleDateString()}</span>
               <span className="order">{item.charterer}</span>
            </div>
         </div>
         <div className="cRight">
            <h3 className="cPrice">{parseInt(item.price).toLocaleString('fr-FR')} UAH</h3>
            <div className="cDateEnd">
               <img src="../clock.png" alt="time" />
               <span style={{color: error ? 'red' : null}}>{date}</span>
            </div>
         </div>
      </div>
      </Link>
      </>
   )
}
export default Card

Card.propTypes = {
   item: PropTypes.object.isRequired,
};