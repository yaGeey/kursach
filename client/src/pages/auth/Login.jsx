import './auth.css';
import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

function Login() {
  const [inputError, setInputError] = useState(false)
  const [credentials, setCredentials] = useState({
    username: undefined,
    password: undefined
  })
  const { loading, error, user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate()
  
  useEffect(() => {
    setInputError(error)
  }, [error])

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.id]: e.target.value} )
  }
  
  const handleClick = async () => {
    setInputError(false)
    // handling input
    if (!credentials.username || !credentials.password ) {
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
      const res = await axios.post('http://localhost:8000/api/auth/login', credentials)
      const { password, isAdmin, ...others } = res.data
      dispatch({ type: 'LOGIN_SUCCESS', payload: others });
      console.log(others)
      navigate('/')
    } catch(err) {
      dispatch({type: 'LOGIN_FAILURE', payload: err.response.data})
    }
  }

  return (
    <div className='auth'>
      <h1>Увійдіть на сайт</h1>
      <div className='form'> 
        <span style={{ visibility: inputError ? 'visible' : 'hidden' }}>{inputError}!</span>
        <input type="text" placeholder="Логін" onChange={handleChange} id='username'/>
        <input type="password" placeholder="Пароль" onChange={handleChange} id='password'/>
        <button onClick={handleClick}>Увійти</button>
      </div>
    </div>
  );
}

export default Login;