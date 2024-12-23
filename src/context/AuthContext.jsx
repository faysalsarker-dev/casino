/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";

import useAxios from "../hooks/useAxios/useAxios";
import useAxiosSecure from "../hooks/useAxiosSecure/useAxiosSecure";
import app from "../config/firebase.config";
import { ContextData } from "../utility/ContextData";

const auth = getAuth(app);

const AuthContext = ({ children }) => {
  const axiosCommon = useAxios();
  const axiosSecure = useAxiosSecure();
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Create user with email and password
  const createUser = async (email, password) => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error; // Ensure error is propagated
    } finally {
      setLoading(false);
    }
  };

  // Sign user in with email and password
  const signIn = async (email, password) => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential;
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };


  const resetPassword = async (email) => {
    try {
      setLoading(true);
      const reset = await sendPasswordResetEmail(auth, email);
      return reset;
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };


  // Update user profile name and photo
  const profileUpdate = async (name, photo) => {
    try {
      setLoading(true);
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: photo,
      });
      const updatedUser = {
        ...auth.currentUser,
        displayName: name,
        photoURL: photo,
      };
      setUser(updatedUser);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  // Log out user
  const logOut = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      setUser(null);
      setUserInfo(null);
      await axiosSecure.post("/logout");
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserInfo = async (email) => {
    try {
      const { data } = await axiosCommon.get(`/users/${email}`);
      setUserInfo(data);

      // Generate and store JWT
      const loggedEmail = { email };
      const tokenResponse = await axiosSecure.post("/jwt", loggedEmail);
      if (tokenResponse.data) {
        console.log("Token stored successfully");
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  // Monitor auth state and fetch user data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);

      if (currentUser) {
        setUser(currentUser);
        await fetchUserInfo(currentUser.email);
      } else {
        setUser(null);
        setUserInfo(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const contextData = {
    createUser,
    signIn,
    user,
    userInfo,
    logOut,
    loading,
    profileUpdate,
    resetPassword
  };

  return (
    <ContextData.Provider value={contextData}>
      {children}
    </ContextData.Provider>
  );
};

export default AuthContext;
