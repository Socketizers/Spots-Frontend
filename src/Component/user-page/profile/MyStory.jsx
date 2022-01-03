import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Webcam from "react-webcam";
import { storage } from "../../../app/firebase";
import api from "../../../app/api";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "background.paper",
  border: "0px solid #000",
  boxShadow: 24,
  p: 4,
};

function MyStory(props) {
  const [file, setFile] = useState("");
  const [videoFile, setVideo] = useState("");
  const [imgSrc, setImgSrc] = React.useState(null);
  const webcamRef = React.useRef(null);
  const mediaRecorderRef = React.useRef(null);
  const [capturing, setCapturing] = React.useState(false);
  const [recordedChunks, setRecordedChunks] = React.useState([]);

  const videoConstraints = {
    facingMode: "user",
  };
  const handleStartCaptureClick = React.useCallback(() => {
    setCapturing(true);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm",
    });
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
  }, [webcamRef, setCapturing, mediaRecorderRef]);

  const handleDataAvailable = React.useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const handleStopCaptureClick = React.useCallback(() => {
    mediaRecorderRef.current.stop();
    setCapturing(false);
  }, [mediaRecorderRef, webcamRef, setCapturing]);

  const handleDownload = React.useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks);
      setVideo(blob);
      handleUpload();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      a.href = url;
      a.download = "react-webcam-stream-capture.webm";
      window.URL.revokeObjectURL(url);
      setRecordedChunks([]);
    }
  }, [recordedChunks, setVideo]);

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
    setFile(imageSrc);
  }, [webcamRef, setImgSrc, setFile]);

  const handleChange = (e) => {
    e.preventDefault();

    let reader = new FileReader();
    reader.onloadend=()=>{
      setImgSrc(reader.result);
    }
    reader.readAsDataURL(e.target.files[0])
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    const name = +new Date() + "-video";
    const uploadTask = storage.ref(`images/${name}`).put(videoFile, {
      type: "video/webm"
    });
    console.log("uploaded successfully");
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref("images")
          .child(name)
          .getDownloadURL()
          .then((url) => {
            const body = {};
            body[name] = url;
            api.put(`/story/${name}`, body);
          });
      }
    );
  };
  const handleUploadFile = () => {
    const name = +new Date() + "-" + file.name;
    const uploadTask = storage.ref(`images/${name}`).put(file);
    console.log("uploaded successfully");
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref("images")
          .child(name)
          .getDownloadURL()
          .then((url) => {
            const body = {};
            body[name] = url;
            api.put(`/story/${name}`, body);
          });
      }
    );
  };
  const handleUploadScreen = () => {
    const name = +new Date() + "-base64";
    const uploadTask = storage
      .ref(`images/${name}`)
      .putString(file, "data_url");
    console.log("uploaded successfully");
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref("images")
          .child(name)
          .getDownloadURL()
          .then((url) => {
            const body = {};
            body[name] = url;
            api.put(`/story/${name}`, body);
          });
      }
    );
  };

  
  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Add Story
        </Typography>
        {!!imgSrc ? (
          <>
            <img src={imgSrc} />
            <button onClick={() => setImgSrc(null)}>Retake</button>
            <button onClick={handleUploadScreen}>Upload</button>
          </>
        ) : (
          <>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
            />
            {capturing ? (
              <button onClick={handleStopCaptureClick}>Stop Capture</button>
            ) : (
              <>
                <button onClick={capture}>Capture photo</button>
                <button onClick={handleStartCaptureClick}>Start Capture</button>
              </>
            )}
            {recordedChunks.length > 0 && (
              <button onClick={handleDownload}>Upload</button>
            )}
          </>
        )}

        <Typography id="modal-modal-description" sx={{ mt: 2 }}></Typography>
        <input type="file" onChange={handleChange} />
        <button onClick={handleUploadFile}>Upload</button>
      </Box>
    </Modal>
  );
}

export default MyStory;
