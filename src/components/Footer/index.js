import React from 'react';
import './index.css'; // Assuming you have a CSS file for styling
// import TradeMark from '../../assets/img10.png'
import Popup from 'reactjs-popup';
import Cookies from 'js-cookie';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../Context/userContext'
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
            }
            const response = await fetch(`${process.env.REACT_APP_API_URL}/checkuser`, options);
            const data = await response.json();
            console.log(data);
            if (data.exist === true && data.regstatus === "approved") {
                return true;
            }
            else if (data.exist === true && data.regstatus === "pending") {
                return "pending";
            }
            else if (data.exist === true && data.regstatus === "rejected") {
                return "rejected";
            }
            else
                return false;
        }
        catch (Err) {
            console.log(`Error Occurred : ${Err}`);
        }
    }


    const checkAdmin = async (email) => {
        try {
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            }
            const response = await fetch(`${process.env.REACT_APP_API_URL}/checkadmin`, options);
            const data = await response.json();
            console.log(data);

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
            }
            else
                return false;
        }
        catch (Err) {
            console.log(`Error Occurred : ${Err}`);
        }
    }

    const checkSubAdmin = async (email) => {
        try {
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            }
            const response = await fetch(`${process.env.REACT_APP_API_URL}/checksubadmin`, options);
            const data = await response.json();
            console.log(data);
            if (data.exist === true) {
                loginUser(data.user);
                const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data.user.accessItems), process.env.REACT_APP_SECRET_KEY).toString();
                localStorage.setItem(process.env.REACT_APP_ENCRYPTED_KEY, encryptedData);
                return true;
            }
            else
                return false;
        }
        catch (Err) {
            console.log(`Error Occurred : ${Err}`);
        }
    }
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

                                <GoogleOAuthProvider clientId="911721135973-kigmnep4rtnio28bjgg6arg1t9itiftj.apps.googleusercontent.com">
                                    <GoogleLogin
                                        onSuccess={async (credentialResponse) => {
                                            Cookies.set("userId", credentialResponse.credential);
                                            const { email } = jwtDecode(credentialResponse.credential);
                                            const res1 = await checkAdmin(email);
                                            const res2 = await checkSubAdmin(email);
                                            if (res1 === true || res2 === true)
                                                navigate("/dashboard", { replace: true });
                                            else
                                                alert("You are not authorized to access the content");
                                        }}
                                        onError={() => {
                                            console.log("Login Failed");
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

