import React  from 'react'
// import { useUserContext } from '../context/use.user.context'
import AddProjectModal from '../components/AddProjectModal';

const Home:React.FC = () => {
  // const {user}=useUserContext();
  return (
    <div><h1>My Dashboard</h1>
    <AddProjectModal />
</div>
  )
}

export default Home