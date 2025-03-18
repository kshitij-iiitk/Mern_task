import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AgentContext } from "../../context/AgentContext";
import styles from "./styles.module.css";

// AgentList component to display the list of agents and their contacts
// It fetches the agents data from the server and displays it in a list

const AgentList = ({ userId }) => {
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const { reload, setReload } = useContext(AgentContext);

  useEffect(() => {
    if (!userId) return;

    const fetchAgents = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/getAgents/${userId}`
        );
        setAgents(response.data.agents);
      } catch (error) {
        console.error("Error fetching agents:", error);
        alert("Failed to fetch agents.");
      }
    };

    fetchAgents();
  }, [userId, reload]);

  const handleDeleteAgent = async (agentId) => {
    if (!window.confirm("Are you sure you want to delete this agent?")) return;

    try {
      await axios.delete(
        `http://localhost:8080/api/deleteAgent/${userId}/${agentId}`
      );
      setAgents(agents.filter((agent) => agent._id !== agentId));
      setReload((prev) => !prev);
    } catch (error) {
      console.error("Error deleting agent:", error);
      alert("Failed to delete agent.");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Agents List</h2>
      {agents.length === 0 ? (
        <p className={styles.noAgents}>No agents available.</p>
      ) : (
        <ul className={styles.list}>
          {agents.map((agent) => (
            <li key={agent._id} className={styles.listItem}>
              <div className={styles.listItemHeader}>
                <div>
                  <p className={styles.agentName}>{agent.name}</p>
                  <p className={styles.agentEmail}>{agent.phone}</p>
                  <p className={styles.agentEmail}>{agent.email}</p>
                </div>
                <div className={styles.buttonGroup}>
                  <button
                    onClick={() =>
                      setSelectedAgent(
                        selectedAgent === agent._id ? null : agent._id
                      )
                    }
                    className={`${styles.button} ${styles.show}`}
                  >
                    {selectedAgent === agent._id
                      ? "Hide Contacts"
                      : "Show Contacts"}
                  </button>
                  <button
                    onClick={() => handleDeleteAgent(agent._id)}
                    className={`${styles.button} ${styles.delete}`}
                  >
                    Delete
                  </button>
                </div>
              </div>

              {selectedAgent === agent._id && (
                <div className={styles.contactsContainer}>
                  {agent.contacts.length > 0 ? (
                    <table className={styles.contactTable}>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Phone</th>
                          <th>Note</th>
                        </tr>
                      </thead>
                      <tbody>
                        {agent.contacts.map((contact, index) => (
                          <tr key={index}>
                            <td>{contact.firstName}</td>
                            <td>{contact.phoneNumber}</td>
                            <td>{contact.note}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>No contacts available.</p>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AgentList;
