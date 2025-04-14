import React, { useEffect, useState } from 'react';
import {useUserContext} from '../context/use.user.context';
import { useNavigate } from 'react-router-dom';

const UserAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigate=useNavigate();
    const {user}=useUserContext();
    const [loading, setLoading]=useState(true);
    const token=localStorage.getItem('token')

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
        if (!user) {
            navigate('/login');
        } else {
            setLoading(false);
        }
    }, [token, user, navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

  return (
    <>{children}</>
  )
}

export default UserAuth