import React, { useState, useRef , useCallback} from "react";
import Webcam from "react-webcam";
import { storage } from "../../../app/firebase";
import api from "../../../app/api";
import { Modal } from "react-bootstrap";

function MyStory(props) {

  const [file, setFile] = useState("");
  const [videoFile, setVideo] = useState("");
  const [imgSrc, setImgSrc] = useState(null);
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [fileUpload, setFileUpload] = useState(false);

  const videoConstraints = {
    facingMode: "user",
  };

  // ************************ Record Video Handlers  *************************
  // ************************ Start Record  ************************* 
  const handleStartCaptureClick = useCallback(() => {
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

  const handleDataAvailable = useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  // ************************ Stop Record  ************************* 
  const handleStopCaptureClick = useCallback(() => {
    mediaRecorderRef.current.stop();
    setCapturing(false);
  }, [mediaRecorderRef, webcamRef, setCapturing]);

  // ************************ Create Video File  ************************* 
  const handleDownload = useCallback(() => {
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

  // ********************************************************************* 



  // ************************ Take Snapshot Handler  ************************* 
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
    setFile(imageSrc);
  }, [webcamRef, setImgSrc, setFile]);


  // ************************ Handle File Upload Form  ************************* 
  const handleChange = (e) => {
    e.preventDefault();

    let reader = new FileReader();
    reader.onloadend = () => {
      setImgSrc(reader.result);
    };
    reader.readAsDataURL(e.target.files[0]);
    setFile(e.target.files[0]);
    setFileUpload(true);
  };


  // ************************ Upload Recorded Video ************************* 
  const handleUpload = () => {
    const name = +new Date() + "-video";
    const uploadTask = storage.ref(`images/${name}`).put(videoFile, {
      type: "video/webm",
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

  // ************************ Upload File ************************* 
  const handleUploadFile = () => {
    const name = +new Date() + "-" + file.name;
    const uploadTask = storage.ref(`images/${name}`).put(file);
    console.log("uploaded successfully");
    setImgSrc(null);
    setFileUpload(false);
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

  // ************************ Upload Screen Shot ************************* 
  const handleUploadScreen = () => {
    const name = +new Date() + "-base64";
    const uploadTask = storage
      .ref(`images/${name}`)
      .putString(file, "data_url");
    setImgSrc(null);
    setFileUpload(false);
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
    <Modal show={props.open} onHide={props.handleClose} size="lg">
      <Modal.Header closeButton style={{ backgroundColor: "white" }}>
        <Modal.Title>Add Story</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: "white" }}>
        {" "}
        {!!imgSrc ? (
          <>
            <img src={imgSrc} style={{ width: "47.7em" }} alt="" />
            <button
              className="story-btn"
              onClick={() => {
                setImgSrc(null);
                setFileUpload(false);
              }}
            >
              <i class="fas fa-reply"></i>
            </button>
            {!fileUpload && (
              <button className="story-btn" onClick={handleUploadScreen}>
                <i class="fas fa-upload"></i>
              </button>
            )}
          </>
        ) : (
          <>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              style={{ width: "47.7em" }}
            />
            {capturing ? (
              <button className="story-btn" onClick={handleStopCaptureClick}>
                <i class="fas fa-stop"></i>
              </button>
            ) : (
              <>
                <button className="story-btn" onClick={capture}>
                  <i class="fas fa-camera"></i>
                </button>
                <button className="story-btn" onClick={handleStartCaptureClick}>
                  <i class="fas fa-video"></i>
                </button>
              </>
            )}
            {recordedChunks.length > 0 && (
              <>
                <button className="story-btn" onClick={handleDownload}>
                  <i class="fas fa-upload"></i>
                </button>
                <button
                  className="story-btn"
                  onClick={() => {
                    setImgSrc(null);
                    setFileUpload(false);
                    setFile("");
                    setRecordedChunks([]);
                  }}
                >
                  <i class="fas fa-reply"></i>
                </button>
              </>
            )}
          </>
        )}
        {!fileUpload ? (
          !recordedChunks.length > 0 &&
          !capturing &&
          !imgSrc && <input type="file" onChange={handleChange} />
        ) : (
          <button className="story-btn" onClick={handleUploadFile}>
            <i class="fas fa-upload"></i>
          </button>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default MyStory;
