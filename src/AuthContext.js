import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { useToast } from "@chakra-ui/react";
import { getValue } from "./db/rtdb";
import md5 from "md5";
import { auth } from "./db/firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const email = user.email;

            const encryptedEmail = md5(email);
            const emailPath = `whitelist/${encryptedEmail}`;
            const whitelistSnap = await getValue(emailPath);

            if (!whitelistSnap) {
                await signOut(auth);
                toast({
                    title: "Access Denied",
                    description: "Your email is not whitelisted.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
                return;
            }

            toast({
                title: "Login Successful",
                description: `Welcome ${user.displayName}!`,
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            console.error("Login failed: ", error);
            toast({
                title: "Login Failed",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            toast({
                title: "Logged Out",
                description: "You have successfully logged out.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            console.error("Logout failed: ", error);
            toast({
                title: "Logout Failed",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            loading, 
            handleGoogleLogin, 
            handleLogout 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
