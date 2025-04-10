import React  from 'react'
import { useUserContext } from '../context/use.user.context'

const Home:React.FC = () => {
  const {user}=useUserContext();
  return (
    <div className='font-bold'>{user ? user.name : 'Guest'}</div>
  )
}

export default Home