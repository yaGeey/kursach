import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import useFetch from '../../hooks/useFetch'
import { useNavigate, Link } from "react-router-dom";
import './User.css'
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Card from "../../components/Card/Card";
import CardPropos from "../../components/CardPropos/CardPropos";
import UserInfo from "../../components/UserInfo/UserInfo";

function UserMe() {
   const { user, loading: authLoading, error: authError, dispatch } = useContext(AuthContext);
   const { data: userData, loading: fetchLoading, error: fetchError } = useFetch(`http://localhost:8000/api/users/${user._id}`)
   const { data: tenderData, loading: tenderLoading } = useFetch(`http://localhost:8000/api/tenders?owner=${user._id}`)
   const { data: proposData, loading: proposLoading } = useFetch(`http://localhost:8000/api/propos?author=${user._id}`)
   const [tenderPage, setTenderPage] = useState(true)

   const [sortedTenders, setSortedTenders] = useState([])
   const [sortedPropos, setSortedPropos] = useState([])

   const navigate = useNavigate()
   const handleClick = () => {
      navigate('/create')
   }
   
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

      setSortedPropos([...approvedArr, ...defaultArr])
   }, [proposData])


   return (
      <>
      <Header />
      <div className='wrapper'>
         <div className="uContent">
            {!fetchLoading && !authLoading && <>
            <div className="uBlob">
               <UserInfo data={userData} onChange={true}/>
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
                     <button onClick={handleClick}>Створити тендер</button>
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
      </div>
      <Footer />
      </>
   );
}

export default UserMe;