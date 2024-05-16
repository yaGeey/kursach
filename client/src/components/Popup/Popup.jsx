import './Popup.css'
import { useState } from 'react';

function Popup({ message, onSuccess, onAbort}) {
   const [isVisible, setIsVisible] = useState(true);

   function handleClose() {
      setIsVisible(false);
      setTimeout(() => onAbort(), 150);
   }
   function handleSuccess() {
      setIsVisible(false);
      setTimeout(() => onSuccess(), 150);
   }
   return isVisible ? (
      <div className={`popup ${isVisible ? '' : 'close'}`}>
         <div className='popupContent'>
            <p>{message}</p>
            <div className='popupButtons'>
               <button className='abort' onClick={handleClose}>Ні</button>
               <button className="ok"  onClick={handleSuccess}>Так</button>
            </div>
         </div>
      </div>
   ) : null;
}
export default Popup;