"use client"
// Import necessary libraries and components
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getFirestore, collection, query, getDoc, doc } from 'firebase/firestore';
import { auth } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';
import "./favourite.css"

// Function to fetch starred GIFs from Firestore
const getStarredGIFs = async (userId) => {
    const db = getFirestore();
    const userDocRef = doc(db, 'users', userId);

    try {
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            const starredGIFs = userData.starredGIFs || [];
            return starredGIFs;
        } else {
            console.log('User document does not exist for userId:', userId);
            return [];
        }
    } catch (error) {
        console.error('Error getting starred GIFs:', error);
        return [];
    }
};


// FavoritesPage component
const FavoritesPage = () => {
    const [user] = useAuthState(auth);
    const [favoriteGIFs, setFavoriteGIFs] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const fetchFavoriteGIFs = async () => {
            try {
                // Check if the user is authenticated
                if (!user) {
                    console.error('User is not authenticated.');
                    alert('User is not authenticated. Sign up first!!')
                    // router.push('./login');
                    return;
                }

                // Fetch user's starred GIFs from Firestore
                const userStarredGIFs = await getStarredGIFs(user.uid);
                setFavoriteGIFs(userStarredGIFs);
            } catch (error) {
                console.error('Error fetching favorite GIFs:', error);
            }
        };

        // Fetch favorite GIFs when the component mounts
        fetchFavoriteGIFs();
        // console.log({ favoriteGIFs });
    }, [user]);

    return (
        <div className='main-container'>
            <h1>My Starred GIFs</h1>
            <div className='container'>
                {favoriteGIFs.map((gif) => (
                    <div className='gifimg' key={gif.id}>
                        <img src={gif.url} alt={gif.title} />
                        <p>Uploaded by: {gif.upload_by}</p>
                        <p>Title: {gif.title}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FavoritesPage;
