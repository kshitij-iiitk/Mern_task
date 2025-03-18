import React, { useContext, useState } from "react";
import axios from "axios";
import { AgentContext } from "../../context/AgentContext";
import styles from "./styles.module.css";

// AgentForm component to add a new agent
// It takes the user ID as a prop to associate the agent with the user

const AgentForm = ({ userId }) => {
  const [agent, setAgent] = useState({
    name: "",
    email: "",
    countryCode: "+1",
    phone: "",
    password: "",
    contacts: [],
  });
  const { setReload } = useContext(AgentContext);

  const handleChange = (e) => {
    setAgent({ ...agent, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submissionData = {
      ...agent,
      phone: `${agent.countryCode}${agent.phone}`,
    };

    delete submissionData.countryCode;

    if (!userId) {
      alert("User ID is missing. Please log in again.");
      return;
    }

    try {
      console.log("Submitting agent data for user:", userId);
      await axios.post(
        `http://localhost:8080/api/addAgent/${userId}`,
        submissionData
      );
      setAgent({
        name: "",
        email: "",
        countryCode: "+1",
        phone: "",
        password: "",
        contacts: [],
      });
      setReload((prev) => prev + 1);
    } catch (error) {
      console.error("Error adding agent:", error);
      alert(
        "Error adding agent: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const countryCodes = [
    { value: "+1", label: "+1 (US/Canada)" },
    { value: "+44", label: "+44 (UK)" },
    { value: "+91", label: "+91 (India)" },
    { value: "+61", label: "+61 (Australia)" },
    { value: "+49", label: "+49 (Germany)" },
    { value: "+33", label: "+33 (France)" },
    { value: "+86", label: "+86 (China)" },
    { value: "+81", label: "+81 (Japan)" },
  ];

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <div className={styles.formGroup}>
        <label>Agent Name</label>
        <input
          type="text"
          name="name"
          value={agent.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={agent.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label>Phone Number</label>
        <div className={styles.phoneInputContainer}>
          <select
            name="countryCode"
            value={agent.countryCode}
            onChange={handleChange}
          >
            {countryCodes.map((code) => (
              <option key={code.value} value={code.value}>
                {code.label}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="phone"
            value={agent.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            required
            pattern="\d{10}"
            title="Phone number must be exactly 10 digits"
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={agent.password}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" className={styles.submitButton}>
        Add Agent
      </button>
    </form>
  );
};

export default AgentForm;
