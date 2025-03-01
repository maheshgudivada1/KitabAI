import React from 'react';
import './index.css';
import Popup from 'reactjs-popup';
import Cookies from 'js-cookie';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../Context/UserContext';
import CryptoJS from 'crypto-js';

const Footer = () => {
  const navigate = useNavigate();
  const { loginUser } = useUser();

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
      console.log("Admin Check Response:", data);

      if (data.exist === true) {
        loginUser({ ...data.user, role: 'admin' }); // Ensure role is set
        const encryptedData = CryptoJS.AES.encrypt(JSON.stringify([
          "Admin",
        ]), "gH8#lM3@2pN%Xr!WqT7^kZ$5uA9&e1B").toString();
        localStorage.setItem("h4pyLZVdXxC5z6BQJUR7L6jG8zK6z1T7U0E1zWUJmNE", encryptedData);
        return true;
      }
      return false;
    } catch (Err) {
      console.error(`Error Occurred : ${Err}`);
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
      console.log("SubAdmin Check Response:", data);
      if (data.exist === true) {
        loginUser({ ...data.user, role: 'subadmin' }); // Ensure role is set
        const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data.user.accessItems), "gH8#lM3@2pN%Xr!WqT7^kZ$5uA9&e1B").toString();
        localStorage.setItem("h4pyLZVdXxC5z6BQJUR7L6jG8zK6z1T7U0E1zWUJmNE", encryptedData);
        return true;
      }
      return false;
    } catch (Err) {
      console.error(`Error Occurred : ${Err}`);
    }
  };

  return (
    <footer className="footer-container">
      <div className="footer-section aishaala">
        <h2>KitabAI</h2>
        <p className="about-us">About Us</p>
      </div>
      <div className="footer-section office">
        <h2>Office</h2>
        <p>Head Office</p>
        <p>804, 5th Cross, 4th Block</p>
        <p>Koramangala, Bengaluru-560095</p>
        <p>contact@KitabAI.com</p>
        <p>Branch Office</p>
        <p>293 Saidulajab Western Marg, New Delhi-110030</p>
      </div>
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
                <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
                  <GoogleLogin
                    onSuccess={async (credentialResponse) => {
                      Cookies.set("userId", credentialResponse.credential);
                      const { email } = jwtDecode(credentialResponse.credential);
                      const res1 = await checkAdmin(email);
                      const res2 = await checkSubAdmin(email);
                      if (res1 || res2)
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





