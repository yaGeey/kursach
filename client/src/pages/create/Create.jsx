import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import UserInfo from '../../components/UserInfo/UserInfo';
import './Create.css'
import useFetch from '../../hooks/useFetch'
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Oval } from 'react-loader-spinner'
import formatData from '../../utils/formatDate';

function Create() {
   const [loading, setLoading] = useState(false);
   const { user, loading: authLoading, error: authError, dispatch } = useContext(AuthContext);
   const { data, loading: fetchLoading, error: fetchError } = useFetch(`http://localhost:8000/api/users/${user._id}`)
   const navigate = useNavigate();

   const handleClick = async (e) => {
      e.preventDefault();
      const title = document.getElementById('title').value.trim();
      const charterer = document.getElementById('charterer').value.trim();
      const dateEnd = document.getElementById('dateEnd').value;
      const price = document.getElementById('price').value.trim();
      const desc = document.getElementById('desc').value.trim();
      const file = document.getElementById('logo').files[0];

      if (!title || !charterer || !dateEnd || !price || !desc) {
         alert('Заповніть всі поля')
         return
      }

      const formData = new FormData();
      formData.append('title', title);
      formData.append('charterer', charterer);
      formData.append('dateEnd', dateEnd);
      formData.append('price', price);
      formData.append('desc', desc);
      formData.append('owner', user._id);
      if (file) formData.append('tenderImg', file);
      
      try {
         setLoading(true);
         const res = await axios.post('http://localhost:8000/api/tenders/', formData);
         navigate(`/tenders/${res.data._id}`)
      } catch(err) {
         console.log(err)
      }
   }

   
   return (<>
      <Header />
      <div className="wrapper">
         <div className="uContent">
            <div className="uBlob">
               {!fetchLoading && !authLoading &&
                  <UserInfo data={data} />
               }
            </div>

            <div className="uInfo">
               <h1>Створення тендеру</h1>
               <hr className='hrCr'/>
               <form className='Create' encType="multipart/form-data">
                  <input type="text" id='title' placeholder="Назва"/>
                  <input type="text" id='charterer' placeholder="Компанія-замовник" />
                  <input type="text" id='price' placeholder="Вартість" />
                  <textarea rows="4" id='desc' placeholder="Опис" />
                  <div className="dateEnd">
                     <label htmlFor="dateEnd">Дата закінчення:</label>
                     <input type="date" id='dateEnd' placeholder="Дата закінчення" min={formatData(new Date())}/>
                  </div>
                  <div className="logo">
                     <label htmlFor="logo">Логотип (опціонально):</label>
                     <input type="file" id='logo' accept="image/*" name='tenderImg'/>
                  </div>
                  <button onClick={handleClick}>Створити тендер</button>
               </form>
               {loading && <div className="loading">
                  <Oval color='#111' secondaryColor='#222' strokeWidth={3} height={40} width={40} />
               </div>}
            </div>

         </div>
      </div>
      <Footer />
      </>);
}

export default Create;