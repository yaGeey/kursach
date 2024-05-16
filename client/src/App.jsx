import { Routes, Route } from 'react-router-dom'

import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Home from './pages/home/Home'
import Tender from './pages/tender/Tender'
import UserMe from './pages/user/UserMe'
import User from './pages/user/User'
import Create from './pages/create/Create'
import Edit from './pages/edit/Edit'
import Error from './components/Error/Error'

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/tenders/:id' element={<Tender />} />
        <Route path='/tenders/:id/edit' element={<Edit />} />
        <Route path='/create' element={<Create />} />
        <Route path='/users/me' element={<UserMe />} />
        <Route path='/users/:id' element={<User />} />
        <Route path='*' exact={true} element={<Error error={'404 Not Found'} message={'Page does not exist'}/>} />
      </Routes>
    </>
  )
}

export default App
