import { useEffect, useState } from 'react'
import {Link} from "react-router-dom";
import './Home.css'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import useFetch from '../../hooks/useFetch'
import Card from '../../components/Card/Card';
import { Menu, MenuItem } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/slide.css';

function Home() {
   const [search, setSearch] = useState('')
   const [sort, setSort] = useState('Найновіші')
   const {data, loading, reFetch} = useFetch(`http://localhost:8000/api/tenders/${search}`)
   
   const checkDateDif = (item) => {
      const timeEnd = new Date(item.dateEnd)
      const timeNow = new Date()
      return new Date(timeEnd - timeNow).getDate();
   }

   const [sortedData, setSortedData] = useState(data)
   useEffect(() => {
      let defaultArr = [...data.filter(item => !item.approvedProp)]
      let relevant = defaultArr.filter(item => !item.stopped && new Date(item.dateEnd) > new Date())
      let irrelevant = defaultArr.filter(item => item.stopped || new Date(item.dateEnd) < new Date())

      for (let sorted of [relevant, irrelevant]) {
         switch (sort) {
            case 'Найновіші': sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break;
            case 'Найближчі': sorted.sort((a, b) => checkDateDif(a) - checkDateDif(b)); break;
            case 'Найдешевші': sorted.sort((a, b) => a.price - b.price); break;
            case 'Найдорожчі': sorted.sort((a, b) => b.price - a.price); break;
            default: break;
         }
      }
      setSortedData([...relevant, ...irrelevant])
   }, [sort, data])

   const handleKey = (e) =>  (e.key === 'Enter') ? reFetch() : null;

   return (
      <>
      <Header />
      <div className='wrapper'>

         <div className="content">
            <div className="hHead">
               <div className="hSearch">
                  <input type='text' onChange={(e) => setSearch(e.target.value)} onKeyDown={handleKey} placeholder='Знайдіть тендер'/>
                  <button onClick={reFetch}>Пошук</button>
               </div>
               <div className="hSort">
                  <label className='title'>Сортування:</label>
                  <Menu menuButton={<div className='trigger'>{sort}</div>}>
                     <MenuItem onClick={()=>setSort('Найновіші')}>Найновіші</MenuItem>
                     <MenuItem onClick={()=>setSort('Найближчі')}>Найближчі</MenuItem>
                     <MenuItem onClick={()=>setSort('Найдешевші')}>Найдешевші</MenuItem>
                     <MenuItem onClick={()=>setSort('Найдорожчі')}>Найдорожчі</MenuItem>
                  </Menu>
               </div>
            </div>
            
            {!loading && sortedData &&
            sortedData.map((item) => (
               <Card item={item} key={item._id} />
            ))}

         </div>
      </div>
      <Footer />
      </>
   );
}

export default Home;