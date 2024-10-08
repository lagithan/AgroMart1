

import React, { useState,useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios
import './addpaymentmethods.css';
import { UserContext } from './Userdata';

const AddPaymentMethod = () => {
  const{user_data,isregistered} =useContext(UserContext)
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // State to manage loading state

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    const cardNameRegex = /^[A-Za-z\s]+$/;
    const cardNumberRegex = /^\d{12}$/;
    const expiryDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    const cvvRegex = /^\d{3}$/;

    if (!cardNameRegex.test(cardName)) {
      newErrors.cardName = 'Card name should contain only letters and spaces.';
    }
    if (!cardNumberRegex.test(cardNumber)) {
      newErrors.cardNumber = 'Card number should be exactly 12 digits.';
    }
    if (!expiryDateRegex.test(expiryDate)) {
      newErrors.expiryDate = 'Expiry date should be in MM/YY format.';
    }
    if (!cvvRegex.test(cvv)) {
      newErrors.cvv = 'CVV should be exactly 3 digits.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true); // Set loading state to true
      const paymentMethod = {
        userid:user_data.id,
        cardName,
        cardNumber,
        expiryDate,
        cvv
      };
       console.log(paymentMethod)
      try {
        const response = await axios.post('http://localhost:5000/payment/add', paymentMethod, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 201) {
          console.log('Payment Method saved:', response.data);

          // Clear the form after successful submission
          setCardName('');
          setCardNumber('');
          setExpiryDate('');
          setCvv('');

          // Navigate to the Saved component after form submission
          navigate('/index/saved');
        } else {
          console.error('Failed to save payment method:', response.statusText);
        }
      } catch (error) {
        console.error('Error occurred while saving payment method:', error);
      } finally {
        setLoading(false); // Set loading state to false
      }
    }
  };

  return (
    <div className="payment-method-box">
      <h3>Add Payment Method</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="cardName">Card Name</label>
          <input
            type="text"
            id="cardName"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            required
          />
          {errors.cardName && <div className="error-message">{errors.cardName}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="cardNumber">Card Number</label>
          <input
            type="text"
            id="cardNumber"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            required
          />
          {errors.cardNumber && <div className="error-message">{errors.cardNumber}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="expiryDate">Expiry Date</label>
          <input
            type="text"
            id="expiryDate"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            required
            placeholder="MM/YY"
          />
          {errors.expiryDate && <div className="error-message">{errors.expiryDate}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="cvv">CVV</label>
          <input
            type="text"
            id="cvv"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            required
          />
          {errors.cvv && <div className="error-message">{errors.cvv}</div>}
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Card'}
        </button>
      </form>
    </div>
  );
};

export default AddPaymentMethod;