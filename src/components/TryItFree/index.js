import React, { useState } from 'react';
import "./index.css"

const TryItFree = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    organization: '',
    purpose: '',
    contactNumber: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else {
      // Store data in localStorage
      localStorage.setItem('userForm', JSON.stringify(formData));
      alert('Form submitted successfully!');
    }
  };

  return (
    <div className="try-it-free">
      <h2 className="heading">Free Plan</h2>
      <h3 className="sub-heading">Create your Task Tracker account and start using Backlog for free</h3>
      <p className="already-account">
        Already have a Task Tracker Account? <a href="#">Log in to try Backlog.</a>
      </p>

      <div className="form-container">
        <div className="step-indicator">
          <div className="circle">1</div>
          <hr className={step === 2 ? 'line-active' : ''} />
          <div className="circle">2</div>
        </div>

        {step === 1 && (
          <div className="form step1">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            <button onClick={handleNext}>Next</button>
          </div>
        )}

        {step === 2 && (
          <div className="form step2">
            <input
              type="text"
              name="organization"
              placeholder="Organization Name"
              value={formData.organization}
              onChange={handleChange}
            />
            <input
              type="text"
              name="purpose"
              placeholder="Purpose"
              value={formData.purpose}
              onChange={handleChange}
            />
            <input
              type="text"
              name="contactNumber"
              placeholder="Contact Number"
              value={formData.contactNumber}
              onChange={handleChange}
            />
            <button onClick={handleNext}>Submit</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TryItFree;
