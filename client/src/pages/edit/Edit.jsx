import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import useFetch from '../../hooks/useFetch'
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext, useRef } from "react";
import { AuthContext } from '../../context/AuthContext';
import './Edit.css'
import formatDate from '../../utils/formatDate';
import { Oval } from 'react-loader-spinner'
import axios from "axios";
import Error from "../../components/Error/Error";

function Edit() {
   const { user } = useContext(AuthContext)
   const [myTender, setMyTender] = useState(false)
   const [loading, setLoading] = useState(false)
   const navigate = useNavigate()

   const charterer = useRef(null)
   const fileInput = useRef(null)
   
   const location = useLocation()
   const id = location.pathname.split('/')[2]
   const {data, loading: dataLoading } = useFetch(`http://localhost:8000/api/tenders/id/${id}`)
   const [logo, setLogo] = useState(data.logo)

   useEffect(() => {
      if (user._id === data.owner) setMyTender(true)
      setLogo(data.logo)
   }, [data, user])

   function handleChangeLogo() {
      fileInput.current.click()
   }
   function handleSelectLogo(e) {
      const file = e.target.files[0]
      if (!file) return;
      const newLogo = URL.createObjectURL(file)
      setLogo(newLogo)
   }
   
   async function handleSave() {
      const title = document.getElementById('title').value.trim();
      const dateEnd = document.getElementById('dateEnd').value;
      const desc = document.querySelector('textarea').value.trim();
      const charterer = document.getElementById('charterer').value.trim();
      const price = document.getElementById('price').value.trim();
      
      if (!title || !dateEnd || !charterer || !price) {
         alert('Заповніть всі поля')
         return
      }
      
      const formData = new FormData();
      formData.append('title', title);
      formData.append('dateEnd', dateEnd);
      formData.append('desc', desc);
      formData.append('charterer', charterer);
      formData.append('price', price);
      if (logo !== data.logo) formData.append('logoImg', fileInput.current.files[0]);

      try {
         setLoading(true);
         await axios.put(`http://localhost:8000/api/tenders/id/${id}`, formData)
         navigate(`/tenders/${id}`)
      } catch(err) {
         console.log(err)
      }
   }

   return (
      <>
      <Header />
      <div className='wrapper'>
         <div className="content">
         {myTender ? <>
            {!dataLoading ? <>
            <form encType="multipart/form-data" className="tInfo">
               <div className="tLeftEdit">
                  <input className="title" id='title' defaultValue={data.title}/>
                  <div>
                     <b>Дата створення: </b>{new Date(data.createdAt).toLocaleDateString()}
                  </div>
                  <div>
                     <b>Дата завершення: </b>
                     <input type="date" id='dateEnd' 
                     defaultValue={formatDate(new Date(data.dateEnd))} min={formatDate(new Date)}/>
                  </div>
                  <textarea defaultValue={data.desc}></textarea>
               </div>
               <div className="tRight">
                  <div className="logo">
                     <img src={logo || 'https://via.placeholder.com/150'} alt={data.title} onClick={handleChangeLogo}/>
                     <input type='file' ref={fileInput} style={{display: 'none'}} accept="image/*" name='logoImg' onChange={handleSelectLogo}/>
                     <div className="onHover" onClick={handleChangeLogo}>
                        <img src="/img-select.svg"/>
                     </div>
                  </div>
                  {/* <p><b>Published:</b> {data.published}</p>
                  <p><b>Deadline:</b> {data.deadline}</p>
                  <p><b>Category:</b> {data.category}</p>
                  <p><b>Location:</b> {data.location}</p>
                  <p><b>Phone:</b> {data.phone}</p>
                  <p><b>Email:</b> {data.email}</p>
                  <p><b>Website:</b> {data.website}</p>
                  <p>{data.category}</p>
                  <p>{data.location}</p>
                  <p>{data.email}</p>*/}
                  <textarea id='charterer' ref={charterer} defaultValue={data.charterer} spellCheck="false"/>
                  <input type="number" id='price' defaultValue={data.price} />
                  {loading && <div className="loading">
                  <Oval color='#111' secondaryColor='#222' strokeWidth={3} height={40} width={40} />
                  </div>}
               </div>
            </form>
            <button onClick={handleSave}>Зберегти зміни</button>
            </>: null}
         </> : <Error error={'403 Forbidden'} message={'You are not allowed to do that'}/>}
         </div>
      </div>
      <Footer />
      </>
   );
}

export default Edit;