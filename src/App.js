import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import baseUrl from "./baseUrl";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get(`${baseUrl}/get-users`)
      .then((res) => setUsers(res.data))
      .catch((err) => console.log(err));
  }, []);

  const deleteUser = (id) => {
    axios
      .delete(`${baseUrl}/delete/${id}`)
      .then(() => {
        setUsers(users.filter((user) => user._id !== id));
      })
      .catch((err) => console.log(err));
  };

  const updateUser = (id, updatedData) => {
    axios
      .put(`${baseUrl}/update/${id}`, updatedData)
      .then((res) => {
        const updatedUsers = users.map((user) =>
          user._id === id ? { ...user, ...res.data } : user
        );
        setUsers(updatedUsers);
      })
      .catch((err) => console.log(err));
  };

  const [editableUsers, setEditableUsers] = useState({});

  const toggleEdit = (id) => {
    setEditableUsers((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="App">
      <h1>READ</h1>

      {users &&
        users.length > 0 &&
        users.map((user) => {
          return (
            <div key={user._id}>
              {!editableUsers[user._id] ? (
                <div>
                  <h3>
                    {user.name} {user.lastName}
                  </h3>
                  <button onClick={() => deleteUser(user._id)}>Delete</button>
                  <button onClick={() => toggleEdit(user._id)}>Edit</button>
                </div>
              ) : (
                <div>
                  <input
                    placeholder="name"
                    value={user.name}
                    onChange={(e) =>
                      updateUser(user._id, { ...user, name: e.target.value })
                    }
                  />
                  <input
                    placeholder="last name"
                    value={user.lastName}
                    onChange={(e) =>
                      updateUser(user._id, {
                        ...user,
                        lastName: e.target.value,
                      })
                    }
                  />
                  <button onClick={() => toggleEdit(user._id)}>Done</button>
                </div>
              )}
            </div>
          );
        })}

      <button onClick={() => navigate("create")}>Create</button>
    </div>
  );
}

export default App;
