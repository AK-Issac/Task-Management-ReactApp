// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import './Connexion.css';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import ReCAPTCHA from 'react-google-recaptcha';
import { useNavigate } from 'react-router-dom';
import { db, auth } from "../../../Firebase";

export function Connexion() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    password: '',
    confirmPassword: '',
    profilePhoto: null
  });
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState('');
  const [recaptchaVerified, setRecaptchaVerified] = useState(false);
  const navigate = useNavigate();

  const toggleForm = () => setIsLogin(!isLogin);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value
    });
  };

  const handleRecaptchaChange = (value) => setRecaptchaVerified(!!value);

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!recaptchaVerified) {
      alert("Please verify reCAPTCHA");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      await sendEmailVerification(user);
      alert("Signup successful! Please check your email to confirm registration.");

      await setDoc(doc(db, "users", user.uid), {
        username: formData.username,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        email: formData.email
      });

      navigate('/formulaire');
    } catch (err) {
      alert(`Signup failed: ${err.message}`);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      alert("Login successful!");
      navigate('/formulaire');
    } catch (err) {
      alert(`Login failed: ${err.message}`);
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      const result = await signInWithPopup(auth, provider);
      alert("Login successful!");
      const user = result.user;

      const docRef = doc(db, "users", user.uid);
      await setDoc(docRef, {
        username: user.displayName,
        email: user.email,
        provider: provider.providerId
      }, { merge: true });

      navigate('/formulaire');
    } catch (err) {
      alert(`Login failed: ${err.message}`);
    }
  };

  return (
    <main className='Connexion'>
    <div className="container">
      <button className="toggle-button" onClick={toggleForm}>
        {isLogin ? "Switch to Signup" : "Switch to Login"}
      </button>

      {/* Login Form */}
      <div className={`form ${isLogin ? "" : "hidden"}`}>
        <h2>Login</h2>
        <form onSubmit={handleLoginSubmit}>
          <div className="input-field">
            <input type="email" name="email" placeholder="Enter Your Email" onChange={handleInputChange} required />
            <div className="underline"></div>
          </div>
          <div className="input-field">
            <input type="password" name="password" placeholder="Enter Your Password" onChange={handleInputChange} required />
            <div className="underline"></div>
          </div>
          {/* Disable button if reCAPTCHA not verified */}
          <input type="submit" value="Continue" disabled={!recaptchaVerified} />
        </form>
      </div>

      {/* Signup Form */}
      <div className={`form ${isLogin ? "hidden" : ""}`}>
        <h2>Signup</h2>
        <form onSubmit={handleSignupSubmit}>
          <div className="input-field">
            <input 
              type="text" 
              name="username" 
              placeholder="Enter Your Username" 
              onChange={handleInputChange} 
              required 
            />
            <div className="underline"></div>
          </div>
          
          <div className="input-field">
            <input 
              type="date" 
              name="dateOfBirth" 
              placeholder="Date of Birth" 
              onChange={handleInputChange} 
              required 
            />
            <div className="underline"></div>
          </div>
          
          <div className="input-field">
            <select 
              name="gender" 
              onChange={handleInputChange} 
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <div className="underline"></div>
          </div>

          <div className="input-field">
            <input 
              type="email" 
              name="email" 
              placeholder="Enter Your Email" 
              onChange={handleInputChange} 
              required 
            />
            <div className="underline"></div>
          </div>
          
          <div className="input-field">
            <input 
              type="password" 
              name="password" 
              placeholder="Enter Your Password" 
              onChange={handleInputChange} 
              required 
            />
            <div className="underline"></div>
          </div>

          <div className="input-field">
            <input 
              type="password" 
              name="confirmPassword" 
              placeholder="Confirm Your Password" 
              onChange={handleInputChange} 
              required 
            />
            <div className="underline"></div>
          </div>

          <div className="input-field">
            <input 
              type="file" 
              name="profilePhoto" 
              onChange={handleInputChange} 
              accept="image/*" 
            />
            <div className="underline"></div>
          </div>

          {/* Disable submit button if reCAPTCHA is not verified */}
          <input type="submit" value="Sign Up" disabled={!recaptchaVerified} />
        </form>
      </div>

      <div className="footer">
        {/* reCAPTCHA */}
        <ReCAPTCHA sitekey="6Lev-ngqAAAAAOel5-0v-SIaJQR8h6UhGFd1PDrP" onChange={handleRecaptchaChange} />
        <span>Or Connect With Social Media</span>
        <div className="social-fields">
          <div className="social-field github">
            <a href="#" onClick={() => handleSocialLogin(new GithubAuthProvider())}>
              <i className="fab fa-github"></i> Sign in with Github
            </a>
          </div>
          <div className="social-field google">
            <a href="#" onClick={() => handleSocialLogin(new GoogleAuthProvider())}>
              <i className="fab fa-google"></i> Sign in with Google
            </a>
          </div>
        </div>
      </div>
    </div>
    </main>
  );
}