import React, { useEffect, useState } from "react";
import Peer from "peerjs";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
function Media({ rooms, ioConnection }) {
  const addTracker = (peers, track) => {
    console.log(track);
    Object.entries(peers).forEach(([key, arr]) => {
      arr[0].peerConnection.addTrack(track);
      // arr[0].peerConnection.getSenders()[0].replaceTrack(...track);
    });
  };
  const [peers, setPeers] = useState({});

  function connectToNewUser(userId, stream, peer) {
    console.log("connectToNewUser");
    const call = peer.call(userId, stream);
    call.on("stream", (remoteStream) => {
      window.stream = remoteStream;
      setPeers(peer.connections);
    });
    call.on("close", () => {
      console.log("close");
      // video.remove();
    });
  }

  const params = useParams();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.auth.user);
  const [peer, setPeer] = useState(null);
  const [stream, setStream] = useState(null);
  const [tracker, setNewTracker] = useState(false);

  const video = React.useRef();
  const answerPeers = (stream) => {
    peer.on("call", (call) => {
      call.answer(stream);
      setPeers(peer.connections);
    });
  };
  const joinVideoAndNewUser = (stream, peer, savePeers, peers) => {
    ioConnection?.on("new_user_joined", (userInfo, userId) => {
      connectToNewUser(userId, stream, peer, savePeers, peers);
    });
    ioConnection.emit("join_video", userInfo.username, params.id, peer.id);
  };

  useEffect(() => {
    const myPeer = new Peer(undefined, {
      secure: true,
      host: "spotspeer.herokuapp.com",
    });
    setPeer(myPeer);
    // myPeer.connections
    myPeer.on("open", (id) => {
      console.log("My peer id is: ", id);
    });

    return () => {
      myPeer.destroy();
    };
  }, []);

  ioConnection?.on("user-disconnected", (userId) => {
    if (peers[userId]) {
      // setPeers(peer.connections);
    }
  });
  useEffect(() => {
    if (peer?.connections) setPeers(peer?.connections);
  }, [tracker]);
  return (
    <div>
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
      <Button
        onClick={() => {
          if (!stream) {
            navigator.mediaDevices
              .getUserMedia({ audio: true, video: true })
              .then((stream) => {
                setStream(stream);
                joinVideoAndNewUser(stream, peer);
                video.current.srcObject = stream;
                answerPeers(stream);
              });
          } else {
            if (stream.getVideoTracks().length > 0) {
              stream.getVideoTracks().forEach((track) => {
                track.stop();
                stream.removeTrack(track);
              });
            } else
              navigator.mediaDevices.getUserMedia({ video: true }).then((s) => {
                stream.addTrack(s.getVideoTracks()[0]);
              });
            setStream(stream);
          }
        }}
      >
        share video & audio
      </Button>
      <Button
        onClick={() => {
          if (stream) {
            if (stream.getVideoTracks().length > 0) {
              stream.getVideoTracks().forEach((track) => {
                track.stop();
                stream.removeTrack(track);
              });
            } else {
              peer.disconnect();
              navigator.mediaDevices
                .getDisplayMedia({ video: true })
                .then((s) => {
                  stream.addTrack(s.getVideoTracks()[0]);
                  addTracker(peers, stream.getVideoTracks()[0]);
                  joinVideoAndNewUser(stream, peer);
                  answerPeers(stream);
                });
              setStream(stream);
            }
          } else
            navigator.mediaDevices
              .getDisplayMedia({ video: true })
              .then((stream) => {
                setStream(stream);
                joinVideoAndNewUser(stream, peer);
                video.current.srcObject = stream;
                answerPeers(stream);
              });
        }}
      >
        share screen
      </Button>
      <Button
        onClick={() => {
          if (stream) {
            Object.values(peers).forEach((peer) => {
              peer.forEach(({ remoteStream }) =>
                console.log(remoteStream?.getTracks())
              );
            });
            console.log("peers", peer.connections);
            stream.getAudioTracks().forEach((track) => {
              track.enabled = !track.enabled;
            });
            setStream(stream);
          } else {
            navigator.mediaDevices
              .getUserMedia({
                audio: {
                  echoCancellation: true,
                  noiseSuppression: true,
                  sampleRate: 44100,
                  sampleSize: 16,
                  channelCount: 2,
                  latency: 0,
                  volume: 1,
                },
              })
              .then((stream) => {
                setStream(stream);
                joinVideoAndNewUser(stream, peer);
                video.current.srcObject = stream;
                answerPeers(stream);
              });
          }
        }}
      >
        un mute
      </Button>
      {stream && (
        <video
          controls={true}
          autoPlay={true}
          ref={video}
          width={500}
          muted={true}
        />
      )}
      {Object.entries(peers).map(([key, arr]) => {
        arr[arr.length - 1]?.peerConnection?.addEventListener("track", (e) => {
          setNewTracker(true);
        });
        return (
          <video
            key={key}
            autoPlay
            controls={true}
            width={500}
            ref={(video) => {
              if (video) {
                video.srcObject = arr[arr.length - 1]?.remoteStream;
                console.log(arr[arr.length - 1]?.remoteStream?.getTracks());
              }
            }}
          />
        );
      })}
    </div>
  );
}
export default Media;
//
// stream.getVideoTracks()[0].label.split(":")[0] === "screen";
