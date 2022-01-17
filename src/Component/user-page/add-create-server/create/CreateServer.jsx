import { FormGroup } from "@mui/material";
import React from "react";
import { Form, Modal, Button } from "react-bootstrap";
import api from "../../../../app/api";
import { useDispatch } from "react-redux";
import { getAllServers } from "../../../../features/server/serverSlice";
import logo from "../../../../assets/SPOTSLOGO-PP.png";
import Swal from "sweetalert2";
import { storage } from "../../../../app/firebase";


import "./CreateServer.scss";

function CreateServer(props) {
  const dispatcher = useDispatch();

  async function createServer(e) {
    e.preventDefault();
    const body = {
      name: e.target.name.value,
      description: e.target.description.value,
      category: e.target.category.value,
      public: true,
      image: null,
    };

    const file = document.getElementById("files").files[0];
    try{
    if (file !== undefined) {
      const name = e.target.name.value + "_" + file.name;
      const uploadTask = storage.ref(`servers/${name}`).put(file);
      console.log("uploaded successfully");
      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          console.log(error);
        },
        () => {
          storage
            .ref("servers")
            .child(name)
            .getDownloadURL()
            .then((url) => {
              body.image = url;
              api.post("/user/server", body).then(()=>{
                dispatcher(getAllServers());
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: "Server Created Successfully",
                  showConfirmButton: false,
                  timer: 1500,
                });
              });
            });
        }
      );
    } else {
      api.post("/user/server", body).then(()=>{
        dispatcher(getAllServers());
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Server Created Successfully",
          showConfirmButton: false,
          timer: 1500,
        });
      });
    }


    
      // const file = document.getElementById("files").files[0];
      // const body = new FormData();
      // body.append("name", e.target.name.value);
      // body.append("description", e.target.description.value);
      // body.append("category", e.target.category.value);
      // if (file) body.append("image", file);
      // await api.post("/user/server", body);
      // dispatcher(getAllServers());

      
    }catch (e) {
      Swal.fire({
        title: "Try again please",
        icon: "error",
        confirmButtonText: "Close",
      });
    }
    
  }

  return (
    <Modal
      show={props.showModal}
      onHide={() => props.setShowModal(false)}
      className="serverModal"
      size="lg"
    >
      <Modal.Body
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
        }}
        className="createServerModalBody"
      >
        <h2>Create Server</h2>
        <img src={logo} width="100" alt=""/>
        <Form onSubmit={createServer} style={{width:'27em',textAlign:'center'}}>
          <FormGroup>
            <Form.Label>Server Name</Form.Label>
            <Form.Control
              type="text"
              id="name"
              placeholder="Enter your server Name"
            />
          </FormGroup>

          <FormGroup>
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              id="description"
              placeholder="Brief description about the server"
            />
          </FormGroup>

          <FormGroup>
            <Form.Label>Category</Form.Label>
            <Form.Select id="category">
              <option>General</option>
              <option>Financial</option>
              <option>Career</option>
              <option>Sport</option>
              <option>Entertainment</option>
            </Form.Select>
          </FormGroup>

          <FormGroup>
            <Form.Label>Server Image</Form.Label>
            <Form.Control type="file" id="files" />
          </FormGroup>

          <Button type="submit" style={{margin:'2em 0', backgroundColor:'#0A95B6', border:'none'}}>Create Server</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default CreateServer;
