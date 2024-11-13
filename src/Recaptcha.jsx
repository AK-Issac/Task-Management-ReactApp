// src/components/HumanVerification.jsx
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

// eslint-disable-next-line react/prop-types
function HumanVerification({ onVerify }) {
    const [message, setMessage] = useState('');

    const handleRecaptchaChange = (value) => {
        if (value) {
            setMessage("reCAPTCHA verified successfully!");
            onVerify(true);  // Notify parent component that verification passed
        } else {
            setMessage("Please complete the reCAPTCHA");
            onVerify(false);
        }
    };

    return (
        <div>
            <ReCAPTCHA
                sitekey="6Lev-ngqAAAAAOel5-0v-SIaJQR8h6UhGFd1PDrP"  // replace with your actual site key
                onChange={handleRecaptchaChange}
            />
            <p>{message}</p>
        </div>
    );
}


export default HumanVerification;
