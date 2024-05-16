import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import useFetch from '../../hooks/useFetch'
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from '../../context/AuthContext';
import './Tender.css'
import { Oval } from 'react-loader-spinner'
import axios from "axios";
import Error from "../../components/Error/Error";
import CardPropos from "../../components/CardPropos/CardPropos";
import Popup from "../../components/Popup/Popup";
import CreatePopup from "../../components/CreatePopup/CreatePopup";
import { set } from "mongoose";

function Tender() {
   const { user } = useContext(AuthContext)
   const [myTender, setMyTender] = useState(false)
   const navigate = useNavigate()

   const [showDelTenderPopup, setShowDelTenderPopup] = useState(false)
   const [showApprovePropPopup, setShowApprovePropPopup] = useState(false)
   const [showCreatePropPopup, setShowCreatePropPopup] = useState(false)
   const [curPropId, setCurPropId] = useState(null)
   const [stopped, setStopped] = useState()
   const [approvedProp, setApprovedProp] = useState(null)
   
   const location = useLocation()
   const id = location.pathname.split('/')[2]
   const {data, loading, error, reFetch: tenderReFetch} = useFetch(`http://localhost:8000/api/tenders/id/${id}`)
   const {data: propos, loading: proposLoading, reFetch: proposReFetch} = useFetch(`http://localhost:8000/api/propos/${id}`)

   const [userData, setUserData] = useState(null)
   const [userLoading, setUserLoading] = useState(true)
   const [deleteLoading, setDeleteLoading] = useState(false)

   //* date
   const [date, setDate] = useState('');
   const [errorDate, setErrorDate] = useState(false)
   useEffect(() => {
      const timeEnd = new Date(data.dateEnd)
      const timeNow = new Date()
      if (timeEnd <= timeNow) {
         setErrorDate(true)
         setDate('Термін закінчився')
      }
      else {
         const time = new Date(timeEnd - timeNow);
         setDate(`${time.getDate()} дн. ${time.getHours()} год.`)
      }
   }, [data])
   
   //* user
   useEffect(() => {
      if (data && data.owner) {
         const fetchUserData = async () => {
            setUserLoading(true);
            const res = await fetch(`http://localhost:8000/api/users/${data.owner}`);
            const userData = await res.json();
            setUserData(userData);
            setUserLoading(false);
         };
         fetchUserData();
      }
   }, [data])

   useEffect(() => {
      if (user && user._id === data.owner) setMyTender(true)
   }, [data, user])

   //* change tender state

   useEffect(() => setStopped(data.stopped), [data])
   useEffect(() => {
      try {
         axios.put(`http://localhost:8000/api/tenders/id/${id}`, {stopped})
      } catch(err) {
         console.warn(err)
      }
   }, [stopped])


   //* tender
   const handleDeleteTender = async () => {
      try {
         setDeleteLoading(true)
         await axios.delete(`http://localhost:8000/api/tenders/id/${id}`)
         navigate('/')
      } catch(err) {
         console.error(err)
      }
   }

   //* propositions
   useEffect(() => {
      try {
         if (data.approvedProp) {
            const fetchApprovedProp = async () => {
               const res = await axios.get(`http://localhost:8000/api/propos?_id=${data.approvedProp}`)
               setApprovedProp(res.data[0])
            }
            fetchApprovedProp()
         }
      } catch(err) {
         console.error(err)
      }
   }, [data])

   const handleDeletePropos = async (id) => {
      try {
         await axios.delete(`http://localhost:8000/api/propos/${id}`)
         proposReFetch()
      } catch(err) {
         console.error(err)
      }
   }
   const handleApprovePopup = (id) => {
      setCurPropId(id)
      setShowApprovePropPopup(true)
   }
   const handleApprovePropos = async () => {
      try {
         await axios.put(`http://localhost:8000/api/propos/${curPropId}`, { approved: true })
         await axios.put(`http://localhost:8000/api/tenders/id/${id}`, { approvedProp: curPropId })
         tenderReFetch()
         proposReFetch()
      } catch(err) {
         console.error(err)
      }
   }

   return (
      <>
      <Header />
      <div className='wrapper'>
         <div className="content">
         {!error ? <>
            {myTender && <div className="editButtons">
               {!errorDate && !data.approvedProp && <button 
                  onClick={() => setStopped(s => !s)}
                  className={stopped ? 'approve' : null}
               >{stopped ? 'Запустити' : 'Призупинити'}</button>}
               <button className="delete" onClick={()=>setShowDelTenderPopup(true)}>Видалити</button>
               {!data.approvedProp && <Link to={`/tenders/${id}/edit`}>
                  <button type="button">Редагувати</button>
               </Link>}
            </div>}

            {!loading ? <>
               <div className="tInfo">
                  <div className="tLeft">
                     <h1 className="title">{data.title}</h1>
                     <span><b>Дата створення: </b>{new Date(data.createdAt).toLocaleDateString()}</span>
                     <span><b>Дата завершення: </b>{new Date(data.dateEnd).toLocaleDateString()}</span>
                     <p>{data.desc}</p>
                     {!userLoading && 
                     <Link to={`/users/${userData._id}`} style={{textDecoration:'none', color:'inherit'}}>
                        <div className="userInfo">
                           {userData.avatar ? <img src={userData.avatar} alt={userData.username} /> : null}
                           <p>{userData.username}</p>
                        </div>
                     </Link>}
                  </div>
                  <div className="tRight">
                     {data.logo && <img src={data.logo} alt={data.title} />}
                     {/* <p><b>Published:</b> {data.published}</p>
                     <p><b>Deadline:</b> {data.deadline}</p>
                     <p><b>Category:</b> {data.category}</p>
                     <p><b>Location:</b> {data.location}</p>
                     <p><b>Phone:</b> {data.phone}</p>
                     <p><b>Email:</b> {data.email}</p>
                     <p><b>Website:</b> {data.website}</p> */}
                     <p>{data.charterer}</p>
                     <h3 className="tPrice">{parseInt(data.price).toLocaleString('fr-FR')} UAH</h3>
                     <div className="cDateEnd">
                        <img className='clock' src="../clock.png" alt="time" />
                        <span className='timeLeft' style={{color: error ? 'red' : null}}>{date}</span>
                     </div>
                  </div>
               </div>

               {!myTender && !data.stopped && !errorDate && !data.approvedProp && user ?
               <button onClick={()=>setShowCreatePropPopup(true)}>Створити пропозицію</button> : null}

               {approvedProp &&
               <div className="tPropositions">
                  <div className="pContent">
                     <h1>Обрана пропозиція</h1>
                     <CardPropos prop={approvedProp} />
                  </div>
               </div>}

               {propos.filter(prop => !prop.approved).length !== 0 && !proposLoading && <>
               <div className="tPropositions">
                  <div className="pContent">
                     <h1>Пропозиції</h1>
                     {propos.map(prop => !prop.approved && (
                        <section className="sectionPropos" key={prop._id}>
                           {myTender && !data.approvedProp && <div className="controls">
                              <button className="delete" onClick={()=>handleDeletePropos(prop._id)}>
                                 <img src="../delete-button.svg" className="svg-but"/>
                              </button>
                              <button className="approve" onClick={()=>handleApprovePopup(prop._id)}>
                                 <img src="../check-mark.svg" className="svg-but"/>
                              </button>
                           </div>}
                           <CardPropos prop={prop} />
                        </section>
                     ))}
                  </div>
               </div> 
               </>}

            </>: null}
            {deleteLoading && <div className="loading">
               <Oval color='#111' secondaryColor='#222' strokeWidth={3} height={40} width={40} />
            </div>} 
            
         {showDelTenderPopup && 
         <Popup message='Ви впевнені? Цю дію більше не буде можливо відмінити'
            onAbort={()=>setShowDelTenderPopup(false)} onSuccess={handleDeleteTender}/> }
         {showApprovePropPopup && 
         <Popup message='Ви впевнені що хочете прийняти цю пропозицію і закінчити тендер? Цю дію більше не буде можливо відмінити'
            onAbort={()=>setShowApprovePropPopup(false)} onSuccess={handleApprovePropos}/> } 

         {showCreatePropPopup &&
         <CreatePopup onAbort={()=>setShowCreatePropPopup(false)} reFetch={proposReFetch}/>}
            
         </>  : <Error error={'404 Not Found'} message={'Page does not exist'}/> }
         </div>
      </div>
      <Footer />
      </>
   );
}

export default Tender;