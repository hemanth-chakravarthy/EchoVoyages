import React, { useEffect, useState } from 'react';
import CustomerPackActions from '../components/CustomerPackActions';
import AgentPackActions from '../components/AgentPackActions';
import ViewPackage from '../components/ViewPackage';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; 
import { useParams } from 'react-router-dom';

const ViewPage = () => {
    const [role, setRole] = useState('agent');
    const [loading, setLoading] = useState(true); 
    const rolefinder = useParams();

    const token = localStorage.getItem('token');
    const id = jwtDecode(token).id;

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const customerResponse = await axios.get(`http://localhost:5000/customers/${id}`);
                if (customerResponse.data && customerResponse.data.role === 'customer') {
                    setRole('customer');
                } 
                // else {
                //     const agentResponse = await axios.get(`http://localhost:5000/agents/${id}`);
                //     if (agentResponse.data && agentResponse.data.role === 'travel agency') {
                //         setRole('travel agency');
                //     }
                // }
            } catch (error) {
                console.error('Error fetching user role:', error);
                alert('Error fetching user details');
            } finally {
                setLoading(false);
            }
        };
        fetchUserRole();
    }, [id]);

    if (loading) {
        return <p>Loading...</p>; 
    }

    return (
        <div>
            <ViewPackage />
            {role === 'customer' && <CustomerPackActions />}
            {role !== 'customer' && <AgentPackActions />}
            {!role && <p>No role found for the current user.</p>}
        </div>
    );
};

export default ViewPage;
