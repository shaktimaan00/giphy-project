"use client"
// pages/index.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactLoading from 'react-loading';
import styled from 'styled-components';

import { getFirestore, doc, updateDoc, arrayUnion, arrayRemove, getDoc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { signOut } from 'firebase/auth';
import './welcome.css'
import Link from 'next/link';


const GIPHY_API_KEY = process.env.NEXT_PUBLIC_GIPHY_API_KEY;
const GIPHY_API_URL = 'https://api.giphy.com/v1/gifs';

const Container = styled.div`
  display: flex;
  gap: 25px;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const Input = styled.input`
  width: 400px;
  margin-bottom: 20px;
  padding: 10px;
  font-size: 16px;
  border: 2px solid #9e9e9e;
  border-radius: 8px;
  background: #eee;
  outline: none;
`;

const GalleryContainer = styled.div`
    display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 4fr));
  gap: 20px;
`;

const GifImage = styled.img`
  width: 75x;
  height: 113px;
  border-radius: 8px;
  cursor: pointer;
  padding: 4px;
  background-color: #000;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.1);
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const PaginationButton = styled.button`
  padding: 10px;
  margin: 0 5px;
  font-size: 16px;
  cursor: pointer;
  background-color: #00BFFF;
  color: #fff;
  border: none;
  border-radius: 5px;
  outline: none;

  &:hover {
    background-color: #0080FF;
  }
`;

const GifContainer = styled.div`
  position: relative;
`;

const StarButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: transparent;
  border: none;
  cursor: pointer;
`;

const Home = () => {
    const [gifs, setGifs] = useState([]);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [starredGIFs, setStarredGIFs] = useState([]); // State to track starred GIFs


    const [user] = useAuthState(auth);
    const router = useRouter();

    // if (!user) {
    //     router.push('/login');
    // }
    // console.log({user});

    useEffect(() => {
        const searchGifs = async () => {
            if (query.trim() === '') {
                setGifs([]);
                return;
            }

            setLoading(true);

            try {
                const response = await axios.get(`${GIPHY_API_URL}/search`, {
                    params: {
                        api_key: GIPHY_API_KEY,
                        q: query,
                        limit: 8, // Number of GIFs per page
                        offset: offset,
                    },
                });

                const fetchedGifs = response.data.data;
                console.log({ fetchedGifs });
                setGifs((prevGifs) => [...prevGifs, ...fetchedGifs]);
            } catch (error) {
                console.error('Error fetching GIFs:', error);
            } finally {
                setLoading(false);
            }
        };

        searchGifs();
    }, [query, offset]);

    const loadMoreGifs = () => {
        setOffset((prevOffset) => prevOffset + 12);
    };

    const isGifStarred = (gif) => {
        return starredGIFs.some((starredGIF) => starredGIF.id === gif.id);
    };

    const toggleStar = async (gif) => {
        try {
            const userId = user ? user.uid : null;
            const gifObject = {
                id: gif.id,
                title: gif.title,
                url: gif.images.fixed_height.url,
                upload_by: gif.username,
                user_id: userId,
                // Add other properties you want to store
            };

            // Get the current user's ID

            // if (!userId) {
            //     // Handle the case where there is no authenticated user
            //     console.error('No authenticated user.');
            //     return;
            // }

            const userRef = doc(getFirestore(), 'users', userId);
            const userDoc = await getDoc(userRef);

            if (!userDoc.exists()) {
                // Create the document if it doesn't exist
                await setDoc(userRef, { starredGIFs: [] });
            }

            // Check if the GIF is already starred
            const userDocData = userDoc.data() || {}; // Add null check
            const isStarred = (userDocData.starredGIFs || []).some(
                (starredGIF) => starredGIF.id === gifObject.id
            );

            if (isStarred) {
                // If already starred, unstar it
                setStarredGIFs((prevStarredGIFs) =>
                    prevStarredGIFs.filter((starredGIF) => starredGIF.id !== gifObject.id)
                );
                await updateDoc(userRef, {
                    starredGIFs: arrayRemove(gifObject),
                });
                console.log('Unstar:', gifObject);
            } else {
                // If not starred, star it
                setStarredGIFs((prevStarredGIFs) => [...prevStarredGIFs, gifObject]);
                await updateDoc(userRef, {
                    starredGIFs: arrayUnion(gifObject),
                });
                console.log('Star:', gifObject);
            }
        } catch (error) {
            console.error('Error updating starred GIFs:', error);
        }
    };


    // setStarredGIFs((prevStarredGIFs) =>
    //     prevStarredGIFs.filter((starredGIF) => starredGIF !== gifUrl)
    // );
    // setStarredGIFs((prevStarredGIFs) => [...prevStarredGIFs, gifUrl]);

    return (
        <Container>
            <div className='container1'>
                <button onClick={() => {
                    signOut(auth)
                    sessionStorage.removeItem('user')
                    router.push("./login");
                    // window.location.reload();
                }} className='btn'>
                    Log out
                </button>
                <Link href="./favourites" className='btn'>To Favorites</Link>
            </div>
            <p>To star any GIF, click on the small black star icon and to check favroites click</p>
            <Input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for GIFs..."
            />

            {loading && (
                <ReactLoading type="spin" color="#00BFFF" height={50} width={50} />
            )}

            {!loading && gifs.length === 0 && (
                <div>No GIFs found. Try a different search term.</div>
            )}

            {!loading && gifs.length > 0 && (
                <>
                    <GalleryContainer className="flex">
                        {gifs.map((gif) => (
                            <GifContainer key={gif.id}>
                                <GifImage src={gif.images.fixed_height.url} alt={gif.title} />
                                <div>
                                    <p>Uploaded by: {gif.username}</p>
                                    <p>Title: {gif.title}</p>
                                </div>
                                <StarButton onClick={() => toggleStar(gif)}>
                                    {isGifStarred(gif) ? '⭐️' : '☆'}
                                </StarButton>
                            </GifContainer>
                        ))}
                    </GalleryContainer>



                    <PaginationContainer>
                        <PaginationButton onClick={loadMoreGifs}>Load More</PaginationButton>
                    </PaginationContainer>
                </>
            )}
        </Container>
    );
};

export default Home;
