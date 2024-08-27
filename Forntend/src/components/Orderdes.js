// Orderdes.js
import React, { useState } from 'react';
import './popup.css';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Orderdes = ({ item, setselectitem, userId }) => {
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  const handleChange = (event) => {
    setQuantity(event.target.value);
  };

  const handleAddToCart = async () => {
    try {
      await axios.post('/cart/add-to-cart', { // Updated URL
        userId,
        productId: item._id,
        quantity
      });
      alert('Item added to cart successfully');
    } catch (error) {
      alert('Failed to add item to cart');
      console.error(error);
    }
  };
  

  const handleBuyNow = () => {
    navigate("/index/orderform", { 
      state: { 
        selectedItem: { 
          ...item, 
          quantity: Number(quantity)
        } 
      } 
    });
  };

  return (
    <div className='back-drop'>
      <div className='order-popup'>
        <img className='desc-img' src={item.image.url} alt="Product image" />
        <div className='popup-content'>
          <CloseIcon fontSize='large' className='pop-close-btn' onClick={() => setselectitem({})} />
          <h2 className='popup-h'>{item.name}</h2>
          <h3 style={{ fontSize: '22px', fontFamily: 'poppins' }}>Description</h3>
          <p style={{ fontSize: '15px', height: '150px', overflow: 'hidden' }}>
            {item.description}
          </p>
          <h4 style={{ color: 'green', fontFamily: 'poppins', fontWeight: '500', marginTop: '10px' }}>Available</h4>
          <FormControl sx={{ m: 0, minWidth: 120 }}>
            <Select
              className='number-input'
              value={quantity}
              onChange={handleChange}
              sx={{
                height: 35,
                '.MuiSelect-select': {
                  padding: '0 14px',
                },
                '.MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
              }}
            >
              {Array.from({ length: item.quantity }, (_, i) => i + 1).map((num) => (
                <MenuItem key={num} value={num}>{num}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <h3 style={{ fontSize: '24px', fontFamily: 'poppins', marginTop: '10px', lineHeight: '1' }}>
            Rs.{item.price} (1pcs)
          </h3>
          <h2 className='popup-h' style={{ color: 'green', fontSize: '26px', marginTop: '10px' }}>
            Total Rs.{item.price * quantity}
          </h2>
          <div className='popup-btn'>
            <button className='addcart-btn' onClick={handleAddToCart}><ShoppingCartOutlinedIcon fontSize="medium" /> Add to cart</button>
            <button className='buy-btn' onClick={handleBuyNow}><LocalMallOutlinedIcon fontSize="medium" /> Buy now</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orderdes;
