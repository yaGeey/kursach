import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import useFetch from '../../hooks/useFetch'
import { useLocation, useNavigate, Link } from "react-router-dom";
import './User.css'
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Card from "../../components/Card/Card";
import CardPropos from "../../components/CardPropos/CardPropos";
import UserInfo from "../../components/UserInfo/UserInfo";
import Error from "../../components/Error/Error";

function User() {
   const location = useLocation()
   const id = location.pathname.split('/')[2]
   
   const { user } = useContext(AuthContext);
   const { data: userData, loading: fetchLoading, error: fetchError } = useFetch(`http://localhost:8000/api/users/${id}`)
   const { data: tenderData, loading: tenderLoading } = useFetch(`http://localhost:8000/api/tenders?owner=${id}`)
   const { data: proposData, loading: proposLoading } = useFetch(`http://localhost:8000/api/propos?author=${id}`)
   const [tenderPage, setTenderPage] = useState(true)

   const [sortedTenders, setSortedTenders] = useState([])
   const [sortedPropos, setSortedPropos] = useState([])

   const navigate = useNavigate()
   useEffect(() => {
      if (user && user._id === id) navigate('/users/me')
   }, [])

   //* sorting

   useEffect(() => {
      const activeArr = [...tenderData.filter(item => !item.stopped && !item.approvedProp && new Date() < new Date(item.dateEnd))]
      const inactiveArr = [...tenderData.filter(item => item.stopped || new Date() > new Date(item.dateEnd))]
      const approvedArr = [...tenderData.filter(item => item.approvedProp)]

      for (let arr of [activeArr, inactiveArr, approvedArr])
         arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

      setSortedTenders([...activeArr, ...approvedArr, ...inactiveArr])
   }, [tenderData])

   useEffect(() => {
      const defaultArr = [...proposData.filter(item => !item.approved)]
      const approvedArr = [...proposData.filter(item => item.approved)]

      for (let arr of [defaultArr, approvedArr])
         arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

      setSortedPropos([...defaultArr, ...approvedArr])
   }, [proposData])

   return (
      <>
      <Header />
      <div className='wrapper'>
      {userData ? <>
         <div className="uContent">
            {!fetchLoading && <>
            <div className="uBlob">
               <UserInfo data={userData} onChange={false} />
            </div>

            <div className="uInfo">
               <nav>
                  <span onClick={()=>setTenderPage(true)} className={tenderPage ? 'active' : null}>Тендери</span>
                  <span onClick={()=>setTenderPage(false)} className={!tenderPage ? 'active' : null}>Пропозиції</span>
               </nav>
               <hr />
               <section>
                  {tenderPage ? <>
                     {!tenderLoading && tenderData && sortedTenders.map((item, i) => (
                        <Card item={item} key={i} />
                     ))}
                  </>:<>
                     {!proposLoading && proposData && sortedPropos.map((item, i) => (
                        <Link key={i} to={`/tenders/${item.tenderId}`} 
                        style={{textDecoration: 'none', color: 'inherit', width: "100%", display: 'flex', justifyContent: 'center' }}>
                           <CardPropos prop={item} />
                        </Link>
                     ))}
                  </>}
               </section>
            </div></>}
         </div>
      </> : <Error error='404 Not Found' message='User with this id does not exist' />}
      </div>
      <Footer />
      </>
   );
}

export default User;