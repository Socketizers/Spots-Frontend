import React from "react";
import { OverlayTrigger, Popover , Button } from "react-bootstrap";

function OtherUser() {
  return  <OverlayTrigger
  trigger="click"
  key=''
  placement='left'
  overlay={
    <Popover id={`popover-positioned`}>
      <Popover.Header as="h3">{`Popover`}</Popover.Header>
      <Popover.Body>
        <strong>Holy guacamole!</strong> Check this info.
      </Popover.Body>
    </Popover>
  }
>
  <Button variant="secondary">Addfriend</Button>
</OverlayTrigger>
  
}

export default OtherUser;
