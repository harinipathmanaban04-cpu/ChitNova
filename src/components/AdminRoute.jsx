import React from 'react';
import {Navigate,Outlet} from 'react-router-dom';import {useAuth} from '../context/AuthContext';export default function AdminRoute(){const {user,loading}=useAuth();if(loading)return <div className="page-loader">Loading…</div>;return ['admin','agent'].includes(user?.role)?<Outlet/>:<Navigate to="/dashboard" replace/>}
