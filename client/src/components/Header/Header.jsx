import { Link, useNavigate } from 'react-router-dom';
import './Header.css'
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

function Header() {
   const { loading, error, user, dispatch } = useContext(AuthContext);
   const navigate = useNavigate();

   const handleLogout = () => {
      navigate('/');
      dispatch({type: 'LOGOUT'})
   }

   return (
      <header>
         <section>
            <Link to='/'>Голова сторінка</Link>
         </section>
         <section className='empty'></section>

         {!loading && <section>
            {user ? <>
            <Link to='/users/me'>Мій акаунт</Link>
            <button onClick={handleLogout}>Вийти</button>
            </>:<>
            <Link to='/login'>Вхід</Link>
            <Link to='/register'>Реєстрація</Link>
            </>}
         </section>}
      </header>
   )
}

export default Header