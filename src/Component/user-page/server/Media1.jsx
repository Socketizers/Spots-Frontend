import React, { useEffect, useRef, useState } from "react";
import { If, Then } from "react-if";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Peer from "simple-peer-light";
import "./roomsStyle.css";
import api from "../../../app/api";

const Video = (props) => {
  const ref = useRef();
  useEffect(() => {
    props.peer.on("stream", (stream) => {
      ref.current.srcObject = stream;
    });
    if (props?.peer?.on)
      props?.peer.on("track", (track, stream) => {
        console.log("track event track=>>", track);
        // stream.addTrack(track, stream);
        ref.current.srcObject = stream;
        console.log("track event stream =>>", stream);
      });
  }, [props.peer]);
  return (
    <video
      playsInline
      autoPlay
      ref={ref}
      style={videoConstraints}
      className="box"
    />
  );
};

const videoConstraints = {
  height: 200,
  width: 300,
  margin: "20px",
};

function Media({ room, ioConnection }) {
  const [sharedScreen, setSharedScreen] = useState(false);
  const [tracker, setTracker] = useState({});
  const [isMuted, setIsMuted] = useState(false);
  const params = useParams();

  const [peers, setPeers] = useState([]);
  const socketRef = useRef(ioConnection);
  const myStream = useRef();

  const peersRef = useRef([]);

  const userInfo = useSelector((state) => state.auth.user);
  const [isUserConnected, setIsUserConnected] = useState(false);
  const [usersConnectedToThisRoom, setUsersConnectedToThisRoom] = useState([]);

  const connectToThisRoom = async () => {
    if (isUserConnected) return;
    const { data: getUsersConnectedToThisRoom } = await api.get(
      `/connected/room/${room.id}`
    );
    if (
      getUsersConnectedToThisRoom.message ===
      "There are no users connected to this server"
    ) {
      await api.put(`/connect/room/${room.id}`);
      const {
        data: { users: usersConnectedToThisRoom },
      } = await api.put(`/connect/room/${room.id}`);
      setUsersConnectedToThisRoom(usersConnectedToThisRoom);
      setIsUserConnected(true);
    } else {
      if (
        !getUsersConnectedToThisRoom.some(
          ({ fullName }) => fullName === userInfo.fullName
        )
      ) {
        const {
          data: { users: usersConnectedToThisRoom },
        } = await api.put(`/connect/room/${room.id}`);
        setUsersConnectedToThisRoom(usersConnectedToThisRoom);
        setIsUserConnected(true);
      } else {
        setUsersConnectedToThisRoom(getUsersConnectedToThisRoom);
        setIsUserConnected(true);
        return;
      }
    }
  };
  useEffect(() => {
    socketRef.current = ioConnection;
    let couther = 0;
    if (params.id === room.name + room.id && couther >= 0) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          // userVideo.current.srcObject = stream;
          socketRef.current.emit("join room", params);
          socketRef.current.on("all users", (users) => {
            const peers = [];
            myStream.current = stream;
            setTracker(stream.getVideoTracks()[0]);

            users.forEach((userID) => {
              const peer = createPeer(userID, socketRef.current.id, stream);
              peersRef.current.push({
                peerID: userID,
                peer,
              }); // push to peersRef
              peers.push(peer); // for
            });
            connectToThisRoom();
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
    }
    return async () => {
      console.log("unmount");
      peers.forEach((peer) => peer.destroy());
      myStream.current?.getTracks()?.forEach((track) => track.stop());
      await api.put("/disconnect/room/" + room.id);
    };
  }, [params]);
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
    peer.on("close", () => console.log());
    peer.on("signal", (signal) => {
      socketRef.current.emit("sending signal", {
        userToSignal,
        callerID,
        signal,
      });
    });
    peer.on("error", (err) => {
      console.log(err);
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
      <If condition={room.name + room.id === params.id}>
        <Then>
          
          <button
            className="media-btn"
            onClick={() => {
              if (!sharedScreen) {
                navigator.mediaDevices
                  .getDisplayMedia({ video: true })
                  .then((stream) => {
                    peers.forEach((peer) => {
                      // peer.removeStream(myStream.current);
                      setSharedScreen(true);
                      peer.replaceTrack(
                        tracker,
                        stream.getVideoTracks()[0],
                        myStream.current
                      );
                      myStream.current.getVideoTracks().forEach((track) => {
                        track.stop();
                      });
                      myStream.current.addTrack(stream.getVideoTracks()[0]);
                      setTracker(stream.getVideoTracks()[0]);
                    });
                  });
              } else {
                navigator.mediaDevices
                  .getUserMedia({ video: true })
                  .then((stream) => {
                    console.log(myStream.current.getVideoTracks());

                    peers.forEach((peer) => {
                      setSharedScreen(false);
                      peer.replaceTrack(
                        tracker,
                        stream.getVideoTracks()[0],
                        myStream.current
                      );

                      myStream.current.getVideoTracks().forEach((track) => {
                        track.stop();
                      });
                    });
                  });
              }
            }}
          >
            {sharedScreen ? (
              <i className="fas fa-video"></i>
            ) : (
              <i className="fas fa-desktop"></i>
            )}
          </button>
          {/* <video muted ref={userVideo} autoPlay playsInline /> */}
          <button
            onClick={() => {
              myStream.current.getAudioTracks()[0].enabled =
                !myStream.current.getAudioTracks()[0].enabled;
              setIsMuted((muted) => !muted);
            }}
            className="media-btn"
          >
            {isMuted ? (
              <i className="fas fa-microphone-alt"></i>
            ) : (
              <i className="fas fa-microphone-alt-slash"></i>
            )}
          </button>
          <div className="wrapper">
            {peers.map((peer, index) => {
              return <Video key={index} peer={peer} />;
            })}
          </div>
        </Then>
      </If>
    </div>
  );
}

export default Media;
