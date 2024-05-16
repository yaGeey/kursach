import './auth.css';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

function Register() {
  const [inputError, setInputError] = useState(false)
  const [credentials, setCredentials] = useState({
    username: undefined,
    password: undefined
  })
  const { loading, error, user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate()

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.id]: e.target.value} )
  }

  const handleClick = async () => {
    // handling input
    if (!credentials.username || !credentials.password || !credentials.email) {
      setInputError('Заповніть всі поля')
      return;
    }
    const latinCharRegex = /^[A-Za-z0-9]*$/;
    if (!latinCharRegex.test(credentials.username) || !latinCharRegex.test(credentials.password)) {
      setInputError('Некоректні символи! Використовуйте латиницю та/або цифри')
      return;
    }

    dispatch({type: 'LOGIN_START'});
    try {
      // creating user
      await axios.post('http://localhost:8000/api/auth/register', credentials)

      // logging in
      const resLog = await axios.post('http://localhost:8000/api/auth/login', credentials)
      const { password, isAdmin, ...others } = resLog.data
      dispatch({ type: 'LOGIN_SUCCESS', payload: others });
      console.log(others)
      navigate('/')
    } catch(err) {
      dispatch({type: 'LOGIN_FAILURE', payload: err.response.data})
    }
  }
  
  
  return (
    <div className='auth'>
      <h1>Реєстрація</h1>
      <div className='form'>
        <span style={{ visibility: inputError ? 'visible' : 'hidden' }}>{inputError}!</span>
        <input type="text" placeholder="Логін" onChange={handleChange} id='username'/>
        <input type="email" placeholder="Пошта" onChange={handleChange} id='email'/>
        <input type="password" placeholder="Пароль" onChange={handleChange} id='password'/>
        <button onClick={handleClick} disabled={loading ? true : false}>Створити акаунт</button>
      </div>
    </div>
  );
}

export default Register;