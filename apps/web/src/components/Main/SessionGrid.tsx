'use client'
import { Session } from '@/types';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import SessionCard from './SessionCard';

const SessionGrid = () => {
    const [dbSessions, setDbSessions] = useState<Session[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const res = await axios.get('/api/getsessions');
                console.log('Session fetched:', res.data.session);
                const sortedSessions = res.data.session.sort((a: Session, b: Session) => {
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                });
                setDbSessions(sortedSessions);
            } catch (error) {
                console.error('Error fetching sessions:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSessions();
    }, []);

    return (
        <>
            <div className='w-full h-10 text-white py-4'>
                Projects
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-2">
                {isLoading ? (
                    <div className="text-white">Loading sessions...</div>
                ) : (
                    dbSessions.map((session) => (
                        <SessionCard key={session.id} Details={session} />
                    ))
                )}
            </div>
        </>

    );
};

export default SessionGrid;
