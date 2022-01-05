import React, { useEffect, useRef, useState } from "react";
import { If, Then } from "react-if";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Peer from "simple-peer-light";
import "./roomsStyle.css";
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
  return <video playsInline autoPlay ref={ref} style={videoConstraints} />;
};

const videoConstraints = {
  height: 400,
  width: 400,
};

function Media({ room, ioConnection }) {
  const userInfo = useSelector((state) => state.auth.user);

  const [sharedScreen, setSharedScreen] = useState(false);
  const [tracker, setTracker] = useState({});

  const params = useParams();

  const [peers, setPeers] = useState([]);
  const socketRef = useRef(ioConnection);
  const myStream = useRef();
  const userVideo = useRef();
  const peersRef = useRef([]);

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

    return () => {
      console.log("unmount");
      peers.forEach((peer) => peer.destroy());
      myStream.current?.getTracks()?.forEach((track) => track.stop());
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
          {peers.map((peer, index) => {
            return <Video key={index} peer={peer} />;
          })}
          <button
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
            {sharedScreen ? "Share Camera" : "Share Screen"}
          </button>
          {/* <video muted ref={userVideo} autoPlay playsInline /> */}
        </Then>
      </If>
    </div>
  );
}

export default Media;
