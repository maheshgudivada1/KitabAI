import React from 'react';
import './index.css'; // Assuming you have a CSS file for styling
import Popup from 'reactjs-popup';
import Cookies from 'js-cookie';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../Context/userContext';
import CryptoJS from 'crypto-js';

const Footer = () => {
    const navigate = useNavigate();
    const { loginUser } = useUser();

    const checkUser = async (email) => {
        try {
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            };
            const response = await fetch(`http://localhost:3001/checkuser`, options);
            const data = await response.json();
            console.log("Check User Response:", data);
            if (data.exist === true && data.regstatus === "approved") {
                return true;
            } else if (data.exist === true && data.regstatus === "pending") {
                return "pending";
            } else if (data.exist === true && data.regstatus === "rejected") {
                return "rejected";
            } else {
                return false;
            }
        } catch (Err) {
            console.error(`Error checking user: ${Err}`);
            alert(`Error checking user: ${Err.message}`);
            return false;
        }
    };

    const checkAdmin = async (email) => {
        try {
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            };
            const response = await fetch(`http://localhost:3001/checkadmin`, options);
            const data = await response.json();
            console.log("Check Admin Response:", data);

            if (data.exist === true) {
                loginUser(data.user);
                const encryptedData = CryptoJS.AES.encrypt(JSON.stringify([
                    "Dashboard",
                    "Business",
                    "System",
                    "Tickets",
                    "Feedback",
                    "Collections",
                    "Admin",
                    "Conversations"
                ]), process.env.REACT_APP_SECRET_KEY).toString();
                localStorage.setItem(process.env.REACT_APP_ENCRYPTED_KEY, encryptedData);
                return true;
            } else {
                return false;
            }
        } catch (Err) {
            console.error(`Error checking admin: ${Err}`);
            alert(`Error checking admin: ${Err.message}`);
            return false;
        }
    };

    const checkSubAdmin = async (email) => {
        try {
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            };
            const response = await fetch(`http://localhost:3001/checksubadmin`, options);
            const data = await response.json();
            console.log("Check SubAdmin Response:", data);

            if (data.exist === true) {
                loginUser(data.user);
                const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data.user.accessItems), process.env.REACT_APP_SECRET_KEY).toString();
                localStorage.setItem(process.env.REACT_APP_ENCRYPTED_KEY, encryptedData);
                return true;
            } else {
                return false;
            }
        } catch (Err) {
            console.error(`Error checking sub-admin: ${Err}`);
            alert(`Error checking sub-admin: ${Err.message}`);
            return false;
        }
    };

    const handleGoogleLogin = async (credentialResponse) => {
        try {
            const { email } = jwtDecode(credentialResponse.credential);
            console.log("Decoded Email:", email);
            const userExists = await checkUser(email);

            if (userExists === true) {
                const isAdmin = await checkAdmin(email);
                const isSubAdmin = await checkSubAdmin(email);

                if (isAdmin || isSubAdmin) {
                    const token = credentialResponse.credential;
                    Cookies.set("jwtToken", token, { expires: 7 }); // Set token to expire in 7 days
                    navigate("/dashboard", { replace: true });
                } else {
                    alert("You are not authorized to access the content");
                }
            } else {
                alert("User does not exist or is not approved");
            }
        } catch (error) {
            console.error("Login failed:", error);
            alert("Login failed");
        }
    };

    return (
        <footer className="footer-container">
            {/* KitabAI Container */}
            <div className="footer-section aishaala">
                <h2>KitabAI</h2>
                <p className="about-us">About Us</p>
            </div>
            {/* Office Container */}
            <div className="footer-section office">
                <h2>Office</h2>
                <p>Head Office</p>
                <p>804, 5th Cross, 4th Block</p>
                <p> Koramangala, Bengaluru-560095</p>
                <p>contact@KitabAI.com</p>
                <p>Branch Office </p>
                <p>293 Saidulajab Western Marg, New Delhi-110030</p>
            </div>

            {/* Quick Links Container */}
            <div className="footer-section quick-links">
                <h2>Quick Links</h2>
                <p>Blog</p>
                <Popup
                    trigger={<p>Admin</p>}
                    modal
                    nested
                >
                    {close => (
                        <div style={{ width: '300px', height: '150px' }} className="flex flex-col justify-center p-6 text-center bg-gray-800 text-white w-[90%] max-w-md h-auto rounded-lg shadow-lg">
                            <div className="flex flex-col items-center mt-4">
                                <GoogleOAuthProvider clientId="126357156450-tqno9kgndoft3nnbm56of9k9bj8sbrdc.apps.googleusercontent.com">
                                    <GoogleLogin
                                        onSuccess={handleGoogleLogin}
                                        onError={() => {
                                            console.log("Login Failed");
                                            alert("Login Failed");
                                        }}
                                    />
                                </GoogleOAuthProvider>
                            </div>
                        </div>
                    )}
                </Popup>
            </div>

            {/* Legal Stuff Container */}
            <div className="footer-section legal-stuff">
                <h2>Legal Stuff</h2>
                <p>Privacy Policy</p>
                <p>Terms of Service</p>
                <p>Refunds</p>
                <p>Disclaimer</p>
            </div>
        </footer>
    );
};

export default Footer;