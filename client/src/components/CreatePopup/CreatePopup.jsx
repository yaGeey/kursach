import './CreatePopup.css'
import { useState, useContext } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

function CreatePopup({ onAbort, reFetch }) {
   const [isVisible, setIsVisible] = useState(true);

   const { user } = useContext(AuthContext)
   const location = useLocation()
   const id = location.pathname.split('/')[2]

   const createProposition = async () => {
      try {
         const desc = document.getElementById('textarea').value.trim();
         const price = document.getElementById('price').value.trim();
         if (!desc || !price) {
            alert('Заповніть всі поля');
            return;
         }
         await axios.post(`http://localhost:8000/api/propos/`, {
            desc: desc,
            price: price,
            author: user._id,
            tenderId: id
         })
         reFetch()
      } catch(err) {
         console.error(err)
      }

      onClose();
   }
   
   function onClose() {
      setIsVisible(false);
      setTimeout(() => onAbort(), 150);
   }
   return (
      <div className={`popup ${isVisible ? '' : 'close'}`}>
         <div className='crPopupContent'>
            <main>
               <textarea id='textarea' placeholder="Опис пропозиції" />
               <input id='price' type="number" placeholder="Ціна"/>
            </main>
            <div className='crPopupButtons'>
               <button className='abort' onClick={onClose}>Відхилити</button>
               <button className="ok"  onClick={createProposition}>Створити</button>
            </div>
         </div>
      </div>
   );
}
export default CreatePopup;