/* eslint-disable react/prop-types */
import { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import './UserInfo.css';

function UserInfo({ data, onChange }) {
   const [avatar, setAvatar] = useState()
   const input = useRef(null);

   const handleChangeAvatar = () => {
      if (onChange) input.current.click();
   }
   const handleSelect = async () => {
      const file = input.current.files[0];
      if (!file) return; 

      const formData = new FormData();
      formData.append('userImg', file);
      formData.append('id', data._id);
      const res = await axios.post('http://localhost:8000/api/users/avatar', formData)
      setAvatar(res.data.avatar)
   }

   useEffect(() => {
      setAvatar(data.avatar ? data.avatar : "https://via.placeholder.com/150")
   }, [data])

   return (
      <>
      <div className="uAvatar">
         <form encType="multipart/form-data">
            <input type='file' ref={input} style={{display: 'none'}} accept="image/*" name='userImg' onChange={handleSelect}/>
         </form>
         <div className="image" onClick={handleChangeAvatar}>
            <img className='logo' src={avatar} alt={data.username} />
            {onChange && <div className="onHover" >
               <img src="/img-select.svg"/>
            </div>}
         </div>
         <span className="uName">{data.username}</span>
      </div>
      {data.bio && <p><span>Про себе:</span><br/>{data.bio}</p>}
      <p><span>Дата створення:</span><br/>{new Date(data.createdAt).toLocaleDateString()}</p>
      {data.email && <p><span>Пошта:</span><br/>{data.email}</p>}
      </>
   );
}
export default UserInfo;