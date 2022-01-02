import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllServers } from "../../features/server/serverSlice";
import cookie from "react-cookies";
import AddCreate from "./add-create-server/AddCreate.m";

function UserHomePage() {
  const servers = useSelector((state) => state.server.servers);
  const dispatcher = useDispatch();
  const [showAddCreateModal, setShowAddCreateModal] = useState(false);

  useEffect(() => {
    if (cookie.load("token")) dispatcher(getAllServers());
  }, []);

  return (
    <div>
      {servers.map((server, index) => {
        return (
          <div
            key={index}
            style={{
              backgroundColor: "black",
              color: "white",
              width: "fit-content",
              padding: "20px",
              margin: "20px",
            }}
          >
            <h3>{server.name}</h3>
            <img
              src={server.image}
              width={"100px"}
              height={"100px"}
              style={{ borderRadius: "50%" }}
            />
          </div>
        );
      })}

      <button onClick={() => setShowAddCreateModal(true)}>
        Add/Creat Server
      </button>

      <AddCreate
        showModal={showAddCreateModal}
        setShowModal={setShowAddCreateModal}
      />
    </div>
  );
}

export default UserHomePage;
