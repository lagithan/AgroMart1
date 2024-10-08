import React, { useState, useEffect, useContext } from "react";
import "./Overview.css";
import axios from "axios";
import { UserContext } from "./Userdata";

const Overview = ({ details = {} }) => {
  const { user_data } = useContext(UserContext);
  console.log(user_data.phonenumber);
  
  const [formData, setFormData] = useState({
    Name: user_data.name,
    Email: user_data.email,
    PhoneNo: user_data.phonenumber,
  });

  const [savedaddress, setSavedAddress] = useState({
    addressLine1: "",
    addressLine2: "",
    addressLine3: ""
  });

  const [addressData, setAddressData] = useState({
    addressLine1: savedaddress.addressLine1,
    addressLine2: savedaddress.addressLine2,
    addressLine3: savedaddress.addressLine3,
  });

  const [savedDetails, setSavedDetails] = useState({
    Name: user_data.name,
    Email: user_data.email,
    PhoneNo: user_data.phonenumber,
  });

  const [Errors, setErrors] = useState({});
  const [editAccount, setEditAccount] = useState(false);
  const [editAddress, setEditAddress] = useState(false);

  useEffect(() => {
    if (details.Name) {
      setFormData({
        Name: details.Name || "",
        Email: details.Email || "",
        PhoneNo: details.PhoneNo || "",
      });
      setSavedDetails({
        Name: details.Name || "",
        Email: details.Email || "",
        PhoneNo: details.PhoneNo || "",
      });
    }
  }, [details]);

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (confirmDelete) {
      try {
        await axios.delete(
          `http://localhost:5000/userprofile/delete/${user_data.id}`
        );
        alert("Your account has been deleted successfully.");
        window.location.href = "/login"; // Adjust the URL as needed
      } catch (error) {
        console.error("Error deleting account", error);
        alert("Failed to delete account. Please try again.");
      }
    }
  };

  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    validateField(name, value);
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let newError = "";

    if (value.trim() === "") {
      newError = `${name} is required`;
    } else if (name === "Name" && /\d/.test(value)) {
      newError = `${name} cannot contain numbers`;
    } else if (name === "PhoneNo" && /[^0-9]/.test(value)) {
      newError = "Phone number can only contain numbers";
    } else if (name === "Email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      newError = "Invalid email address";
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: newError,
    }));
  };

  const handleAccountSave = async () => {
    const isValid =
      Object.values(Errors).every((Error) => Error === "") &&
      formData.Name &&
      formData.Email &&
      formData.PhoneNo;
    if (isValid) {
      setEditAccount(false);

      try {
        await axios.put(
          `http://localhost:5000/userprofile/update/${user_data.id}`,
          {
            username: formData.Name,
            email: formData.Email,
            phonenumber: formData.PhoneNo,
          }
        );

        setSavedDetails(formData); // Update savedDetails after successful save
        console.log("Updated details successfully");
      } catch (error) {
        console.error("Error updating details", error);
      }
    } else {
      alert("Please fix the Errors before saving.");
    }
  };

  const handleAddressSave = async () => {
    
    try {
      await axios.post("http://localhost:5000/userprofile/createaddress", {
        userid: user_data.id,
        addressData,
      });
    } catch (error) {
      alert('User can save one address only ');
    } finally {
      setEditAddress(false);
    }
  };

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/userprofile/getaddress/${user_data.id}`
        );

        const address=response.data
        setSavedAddress({...savedaddress,addressLine1:address.address1,addressLine2:address.address2,addressLine3:address.address3});
        console.log(savedaddress);
      } catch (error) {
        console.error("Error occurred while fetching address", error);
      }
    };

    fetchAddress();
  });

  return (
    <div className="userprofile">
      <h1 className="head">My Profile</h1>
      <div className="overview">
        <h1 className="Mainhead1">Overview</h1>
        <div className="overview-item">
          <span>Name: {savedDetails.Name}</span>
          <br />
          <span>Email: {savedDetails.Email}</span>
          <br />
          <span>Mobile/Phone: {savedDetails.PhoneNo}</span>
          <br />
          <span>
            Address: {savedaddress.addressLine1 || "N/A"},{" "}
            {savedaddress.addressLine2 || "N/A"},{" "}
            {savedaddress.addressLine3 || "N/A"}
          </span>
          <br />
        </div>

        <div className="buttons-container">
          <button
            className="Mainbutton1"
            onClick={() => setEditAccount(true)}
            style={{ marginRight: "10px" }}
          >
            Edit personal details
          </button>
          <button className="Mainbutton1" onClick={() => setEditAddress(true)}>
            Edit address details
          </button>

          <button className="Mainbutton1" onClick={handleDeleteAccount}>
            Delete Account
          </button>
        </div>

        {editAccount && (
          <div className="modal">
            <div className="modal-content">
              <button
                className="close-button"
                onClick={() => setEditAccount(false)}
              >
                &times;
              </button>
              <h2>Edit Personal details</h2>
              <div className="form">
                <div className="form-group">
                  <label htmlFor="Name">
                    User Name<span>*</span>
                  </label>
                  <input
                    type="text"
                    name="Name"
                    id="Name"
                    value={formData.Name}
                    onChange={handleAccountChange}
                    className={Errors.Name ? "Error" : ""}
                  />
                  {Errors.Name && (
                    <p className="Error-message1">{Errors.Name}</p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="PhoneNo">
                    Phone / mobile<span>*</span>
                  </label>
                  <input
                    type="text"
                    name="PhoneNo"
                    id="PhoneNo"
                    value={formData.PhoneNo}
                    onChange={handleAccountChange}
                    className={Errors.PhoneNo ? "Error" : ""}
                  />
                  {Errors.PhoneNo && (
                    <p className="Error-message1">{Errors.PhoneNo}</p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="Email">
                    Email<span>*</span>
                  </label>
                  <input
                    type="text"
                    name="Email"
                    id="Email"
                    value={formData.Email}
                    onChange={handleAccountChange}
                    className={Errors.Email ? "Error" : ""}
                  />
                  {Errors.Email && (
                    <p className="Error-message1">{Errors.Email}</p>
                  )}
                </div>

                <button className="mainbutton2" onClick={handleAccountSave}>
                  Save Account
                </button>
                <button
                  className="mainbutton2"
                  onClick={() => setEditAccount(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Address Modal */}
        {editAddress && (
          <div className="modal">
            <div className="modal-content">
              <button
                className="close-button"
                onClick={() => setEditAddress(false)}
              >
                &times;
              </button>
              <h2>Edit Address details</h2>
              <div className="form">
                <div className="form-group">
                  <label htmlFor="addressLine1">
                    Street No <span></span>
                  </label>
                  <input
                    type="text"
                    name="addressLine1"
                    id="addressLine1"
                    value={addressData.addressLine1}
                    onChange={handleAddressChange}
                    className={Errors.addressLine1 ? "Error" : ""}
                  />
                  {Errors.addressLine1 && (
                    <p className="Error-message1">{Errors.addressLine1}</p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="addressLine2">Street name</label>
                  <input
                    type="text"
                    name="addressLine2"
                    id="addressLine2"
                    value={addressData.addressLine2}
                    onChange={handleAddressChange}
                    className={Errors.addressLine2 ? "Error" : ""}
                  />
                  {Errors.addressLine2 && (
                    <p className="Error-message1">{Errors.addressLine2}</p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="addressLine3">District</label>
                  <input
                    type="text"
                    name="addressLine3"
                    id="addressLine3"
                    value={addressData.addressLine3}
                    onChange={handleAddressChange}
                    className={Errors.addressLine3 ? "Error" : ""}
                  />
                  {Errors.addressLine3 && (
                    <p className="Error-message1">{Errors.addressLine3}</p>
                  )}
                </div>

                <button className="mainbutton2" onClick={handleAddressSave}>
                  Save Address
                </button>
                <button
                  className="mainbutton2"
                  onClick={() => setEditAddress(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Overview;
