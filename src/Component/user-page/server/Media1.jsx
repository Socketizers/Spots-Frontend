import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Peer from "simple-peer-light";

const Video = (props) => {
  const ref = useRef();
  console.log(props?.peer);
  useEffect(() => {
    props.peer.on("stream", (stream) => {
      ref.current.srcObject = stream;
    });
    if (props?.peer?.on)
      props?.peer.on("track", (track, stream) => {
        ref.current.srcObject = stream;
        console.log(stream);
      });
  }, [props.peer]);

  return <video playsInline autoPlay ref={ref} />;
};

const videoConstraints = {
  height: window.innerHeight / 2,
  width: window.innerWidth / 2,
};

function Media({ rooms, ioConnection }) {
  const userInfo = useSelector((state) => state.auth.user);

  const params = useParams();
  const navigate = useNavigate();

  const [peers, setPeers] = useState([]);
  const socketRef = useRef(ioConnection);
  const myStream = useRef();
  const userVideo = useRef();
  const peersRef = useRef([]);
  const [roomID, setRoomID] = useState(null);
  useEffect(() => {
    setRoomID(params.id);
  }, [params.id]);

  useEffect(() => {
    socketRef.current = ioConnection;
    if (roomID)
      navigator.mediaDevices
        .getDisplayMedia({ video: true, audio: true })
        .then((stream) => {
          userVideo.current.srcObject = stream;
          socketRef.current.emit("join room", roomID);
          socketRef.current.on("all users", (users) => {
            const peers = [];
            myStream.current = stream;
            users.forEach((userID) => {
              const peer = createPeer(userID, socketRef.current.id, stream);
              peersRef.current.push({
                peerID: userID,
                peer,
              }); // push to peersRef
              peers.push(peer); // for
            });
            setPeers(peers);
          });

          socketRef.current.on("user joined", (payload) => {
            const peer = addPeer(payload.signal, payload.callerID, stream);
            peersRef.current.push({
              peerID: payload.callerID,
              peer,
            });

            setPeers((users) => [...users, peer]);
          });

          socketRef.current.on("receiving returned signal", (payload) => {
            const item = peersRef.current.find((p) => p.peerID === payload.id);
            item.peer.signal(payload.signal);
          });
        });
    // return () => {
    //   console.log("unmount");
    //   peers.forEach((peer) => peer.destroy());
    // };
  }, [ioConnection, roomID]);

  function onClosePeer(peerID) {
    const filteredPeers = peers.filter((peer) => peer.id !== peerID);
    peersRef.current = filteredPeers;
    setPeers(filteredPeers);
  }
  function createPeer(userToSignal, callerID, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });
    // peer.on("close", () => onClosePeer(peer.id));
    peer.on("signal", (signal) => {
      socketRef.current.emit("sending signal", {
        userToSignal,
        callerID,
        signal,
      });
    });

    return peer;
  }

  function addPeer(incomingSignal, callerID, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("returning signal", { signal, callerID });
    });
    // peer.on("close", () => onClosePeer(peer.id));

    peer.signal(incomingSignal);
    return peer;
  }

  return (
    <div>
      return (
      <>
        Media
        {rooms?.map((room, index) => {
          return (
            <div key={index}>
              <div
                onClick={() => {
                  navigate("/rooms/" + room.name + room.id);
                }}
              >
                {room.name}
              </div>
            </div>
          );
        })}
      </>
      <video muted ref={userVideo} autoPlay playsInline />
      {roomID &&
        peers.map((peer, index) => {
          return <Video key={index} peer={peer} />;
        })}
      <button
        onClick={() => {
          navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then((stream) => {
              peers.forEach((peer) => {
                console.log(peer);
                myStream.current.addTrack(stream.getAudioTracks()[0]);
                console.log(myStream.current);
                // peer.removeStream(myStream.current);
                peer.addTrack(
                  myStream.current.getAudioTracks()[0],
                  myStream.current
                );
              });
            });
        }}
      >
        change audio
      </button>
    </div>
  );
}

export default Media;
