import React, { useEffect, useState } from "react";
import Peer from "peerjs";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
function Media({ rooms, ioConnection }) {
  const params = useParams();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.auth.user);
  const [peer, setPeer] = useState(null);
  const [stream, setStream] = useState(null);
  const [tracker, setNewTracker] = useState(false);
  const [peers, setPeers] = useState({});
  const [calls, setCalls] = useState([]);
  const [remoteStreams, setRemoteStreams] = useState([]);

  const addTracker = (peer, stream) => {
    joinVideoAndNewUser(stream.clone(), peer);
    answerPeers(stream.clone());
    setPeer(peer);
  };
  function replaceStream(peerConnection, mediaStream) {
    for (const sender of peerConnection.getSenders()) {
      if (sender.track.kind === "audio") {
        if (mediaStream.getAudioTracks().length > 0) {
          sender.replaceTrack(mediaStream.getAudioTracks()[0]);
        }
      }
      if (sender.track.kind === "video") {
        if (mediaStream.getVideoTracks().length > 0) {
          sender.replaceTrack(mediaStream.getVideoTracks()[0]);
        }
      }
    }
  }
  function connectToNewUser(userId, stream, peer) {
    console.log("connectToNewUser");
    console.log("call", stream);

    const call = peer.call(userId, stream);
    setCalls((prev) => [...prev, call]);
    call.peerConnection.addEventListener("track", async (event) => {
      console.log(event);
      setPeers(peer.connections);
    });
    call.on("stream", (remoteStream) => {
      console.log("incoming", remoteStream);
      window.stream = remoteStream;
      setPeers(peer.connections);
    });
    call.on("close", () => {
      console.log("close");
      if (peers[userId]) {
        peers[userId][0]?.close();
        delete peers[userId];
        setPeers(peers);
      }
    });
  }

  const video = React.useRef();
  const answerPeers = (myStream) => {
    console.log(stream);
    peer.on("call", (call) => {
      if (call.peerConnection) {
        setCalls((prev) => [...prev, call]);
        call.peerConnection.addEventListener("track", async (event) => {
          console.log(event.streams);
          setPeers(peer.connections);
        });
      }
      console.log("ans", myStream);
      call.answer(myStream);
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

    myPeer.on("open", (id) => {
      console.log("My peer id is: ", id);
    });
    myPeer?.on("disconnected", (peerId) => {
      console.log("disconnected", peerId);
      if (ioConnection) ioConnection?.emit("peer-disconnect", peerId);
    });
    return () => {
      myPeer.destroy();
    };
  }, [ioConnection]);

  // peer?.on("error", (err) => {
  //   console.log(err);
  // });
  ioConnection?.on("user-disconnected", (userId) => {
    if (peer.connections[userId]) {
      peer?.connections[userId][0]?.close();
      console.log(peer?.connections[userId][0]?.close);
      delete peers[userId];
      // delete peer.connections[userId];
      setPeers(peers);
      console.log(peer.connections);
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
          // if (stream) {
          //   if (stream.getVideoTracks().length > 0) {
          //     stream.getVideoTracks().forEach((track) => {
          //       track.stop();
          //       stream.removeTrack(track);
          //     });
          //   } else {
          //     navigator.mediaDevices
          //       .getDisplayMedia({ video: true })
          //       .then((s) => {
          //         stream.addTrack(s.getVideoTracks()[0]);
          //         // joinVideoAndNewUser(stream, peer);
          //         // answerPeers(stream);
          //         setStream(stream);
          //         addTracker(peers, stream.getVideoTracks()[0], stream);
          //   Object.values(peers).forEach((peer) => {
          //     // console.log(peer[0]);
          //     // console.log(
          //     //   peer[0].peerConnection.getSenders().setStreams()
          //     // );
          //     // peer[0].localStream.getTracks = stream;
          //   });
          // });
          //   }
          // } else
          // peer.disconnect();
          navigator.mediaDevices.getDisplayMedia({ video: true }).then((s) => {
            console.log("bef", stream);
            // s.addTrack(...stream.getTracks());
            // stream.removeTrack(...stream.getTracks());
            // s.getVideoTracks().forEach((track) => {
            //   Object.values(peers).forEach((peer) =>
            //     peer[0].peerConnection.addTrack(track)
            //   );
            //   // calls.forEach((peer) =>
            //   //   peer.peerConnection.addTrack(track, stream)
            //   // );
            // });
            stream.addTrack(...s.getVideoTracks());
            // setStream(s);
            video.current.srcObject = stream;
            addTracker(peer, stream);
          });
        }}
      >
        share screen
      </Button>
      <Button
        onClick={() => {
          if (stream) {
            // Object.values(peers).forEach((peer) => {
            //   peer.forEach(({ remoteStream }) =>
            //     console.log(remoteStream?.getTracks())
            //   );
            // });

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
      <Button
        onClick={() => {
          peer.disconnect();
          console.log(peer);
          console.log(peers);
          console.log(peer.connections);
        }}
      >
        disconnect
      </Button>
      <Button
        onClick={() => {
          window.peer = peer;
          console.log(stream.getTracks());
          console.log(peers);
          console.log(peer.connections);
        }}
      >
        get peers
      </Button>
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
              console.log("new render");
              if (video) {
                if (arr[0]?.remoteStream) video.srcObject = arr[0].remoteStream;
                // console.log(arr[0]?.remoteStream?.getTracks());
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
