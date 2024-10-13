// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { PhoneAuthProvider, signInWithCredential } from "firebase/auth";

import { getAuth, signInWithPhoneNumber, RecaptchaVerifier, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Firebase configuration object
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
  };
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// OTP Login
export const sendOTP = (phoneNumber) => {
    const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
            console.log('recaptcha resolved..')
        }
    });
    console.log(auth);
    
  return signInWithPhoneNumber(auth, phoneNumber,  recaptchaVerifier);
};
export const verifyOTP = async (verificationId, code) => {
    try {
      const credential = PhoneAuthProvider.credential(verificationId, code);
      const userCredential = await signInWithCredential(auth, credential); // Sign in with the credential
      return userCredential;
    } catch (error) {
      console.error("Error verifying OTP:", error);
      throw error; // Rethrow the error to handle it in your app
    }
  };

// Google Social Login
export const googleLogin = () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};
