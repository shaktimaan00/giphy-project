'use client'
import { useState } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth'
import { auth } from '@/app/firebase/config'
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const router = useRouter()

  const handleSignIn = async () => {
    try {
      // Check if the user with the provided email exists
      const userExists = await checkIfUserExists(email);

      if (!userExists) {
        alert("incorrect login credentials");
        // router.push('/sign-up');
        return;
      }

      // If the user exists, proceed with sign-in
      const res = await signInWithEmailAndPassword(email, password);
      console.log({ res });
      sessionStorage.setItem('user', true);
      setEmail('');
      setPassword('');
      router.push('/welcome');
    } catch (e) {
      console.error(e);
    }
  };

  // Function to check if a user with the provided email exists
  const checkIfUserExists = async (email) => {
    try {
      const userCredential = await getAuth().fetchSignInMethodsForEmail(email);
      return userCredential.length > 0;
    } catch (error) {
      console.error('Error checking if user exists:', error);
      return false;
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-96">
        <h1 className="text-white text-2xl mb-5">Sign In</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
        />
        <button
          onClick={handleSignIn}
          className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500"
        >
          Sign In
        </button>
        <p className='p-3 text-white'>
          Don't have an Account? <Link className="text-blue" href='./sign-up'>Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
