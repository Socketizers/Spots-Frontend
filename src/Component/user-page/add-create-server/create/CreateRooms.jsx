
import React, {} from "react";
import { Form, FormGroup ,Modal, Button } from "react-bootstrap";
import api from "../../../../app/api";
import Swal from 'sweetalert2';
import logo from "../../../../assets/SPOTSLOGO-PP.png"

function CreateRooms(props) {

  async function createRoom(e) {
    e.preventDefault();
    let body={
    name: e.target.name.value,
    server_id: props.id,
    type:e.target.type.value,
    capacity: e.target.capacity.value, 
    presenter:e.target.presenter.value
    }
    console.log("create room", body);
    api.post('/room',body).then((data)=>{
      console.log('--------->',data.data);
      Swal.fire({
        icon: 'success',
        title: 'Room Has Been Created!',
        showConfirmButton: false,
        timer: 1500
      });
      props.handleClose();
      props.closeServerModal();
    })
  }

 

  return (
    <Modal
      show={props.open}
      onHide={props.handleClose}
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
      >
        <h2>Create Room</h2>
        <img src={logo} width="100"/>
        <Form onSubmit={createRoom} style={{width:'27em',textAlign:'center'}}>
          <FormGroup>
            <Form.Label>Room Name</Form.Label>
            <Form.Control type="text" id="name" />
          </FormGroup>

          <FormGroup>
            <Form.Label>Type</Form.Label>
            <Form.Select id="type">
              <option value="text">Text Chat</option>
              <option value="voice">Media</option>
              <option value="podcast">Podcast</option>
            </Form.Select>
          </FormGroup>

          <FormGroup>
            <Form.Label>Capacity</Form.Label>
            <Form.Control type="number" id="capacity" />
          </FormGroup>

          <FormGroup>
            <Form.Label>Presenter</Form.Label>
            <Form.Control type="number" id="presenter" />
          </FormGroup>

          <Button type="submit" style={{margin:'1em 0', backgroundColor:'#0A95B6'}}>Create Room</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default CreateRooms;

