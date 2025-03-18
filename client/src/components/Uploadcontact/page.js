import { useState, useContext } from "react";
import axios from "axios";
import { AgentContext } from "../../context/AgentContext";
import styles from "./styles.module.css";

// UploadContacts component to allow users to upload a CSV file with contacts
// It takes the user ID as a prop to associate the contacts with the user

const UploadContacts = ({ userId }) => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const { setReload } = useContext(AgentContext);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `http://localhost:8080/api/uploadContacts/${userId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setMessage(response.data.message);
      setFile(null);
      setReload((prev) => prev + 1);
    } catch (error) {
      setMessage(error.response?.data?.error || "File upload failed.");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Upload Contacts</h2>
      <input
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={handleFileChange}
        className={styles.input}
      />
      <button onClick={handleUpload} className={styles.button}>
        Upload
      </button>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};

export default UploadContacts;
