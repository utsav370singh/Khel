import React from 'react';
import { FaFacebookF, FaInstagram, FaTwitter, FaGoogle, FaLinkedin } from 'react-icons/fa'; 
import './login.css';

const Login = () => {
  return (
    <div className="login-container">
      <div className="login-left">
        <h1>Keep it special</h1>
        <p>Capture your passion in a unique way.</p>
        <div className="social-icons">
          <a  href="tjrtumyue"  target="_blank"  rel="noopener noreferrer"  className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition ease-in-out duration-300" >
            <FaFacebookF size={40} className="text-red-400 dark:text-red-300" />
          </a>
          <a  href="https://www.instagram.com/utsav_xingh/"  target="_blank"  rel="noopener noreferrer"  className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition ease-in-out duration-300" >
            <FaInstagram size={40} className="text-red-400 dark:text-red-300" />
          </a>
          <a  href="https://x.com/UtsavSingh25"  target="_blank"  rel="noopener noreferrer"  className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition ease-in-out duration-300" >
            <FaTwitter size={40} className="text-blue-400 dark:text-blue-300" />
          </a>
        </div>
      </div>
      <div className="login-right">
      <a href="TournamentForm"><img src="./images/logo.jpg" alt="Sports Korner" className="login-logo"/></a>
        <div className="social-login">
          <a href="#facebook" className="social-icon">
            <FaFacebookF size={32} />
          </a>
          <a href="#google" className="social-icon">
            <FaGoogle size={32}/>
          </a>
          <a href="#linkedin" className="social-icon">
            <FaLinkedin size={32}/>
          </a>
        </div>
        <p className="or">or use your email account</p>
        <form className="login-form">
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <button type="submit" className="sign-in-button">SIGN IN</button>
        </form>
        <div className="login-footer">
          <a href="#forgot-password">Forgot your password?</a>
          <a href="#create-account">Create Account</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
