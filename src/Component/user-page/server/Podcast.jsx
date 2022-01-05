import React, { useEffect, useRef, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { If, Then } from "react-if";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import api from "../../../app/api";
function Podcast({ room, peer, ioConnection }) {
  const params = useParams();
  const userInfo = useSelector((state) => state.auth.user);
  const [isUserConnected, setIsUserConnected] = useState(false);
  const [usersConnectedToThisRoom, setUsersConnectedToThisRoom] = useState([]);
  const [isRoomFull, setIsRoomFull] = useState(false);
  const streamRef = useRef();
  const [peers, setPeers] = useState({});
  const [disconnectedUsers, setDisConnectedUsers] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  useEffect(() => {
    (async () => {
      const { data: getUsersConnectedToThisRoom } = await api.get(
        `/connected/room/${room.id}`
      );
      setUsersConnectedToThisRoom(getUsersConnectedToThisRoom);

      setIsUserConnected(
        getUsersConnectedToThisRoom.some(
          ({ fullName }) => fullName === userInfo.fullName
        )
      );
      setIsRoomFull(room.capacity - 1 <= getUsersConnectedToThisRoom.length);
    })();
    return async () => {
      await api.put("/disconnect/room/" + room.id);
      peer.disconnect();
      console.log("cleanup");
    };
  }, [ioConnection, peer, room.capacity, room.id, userInfo.fullName]);

  useEffect(() => {
    disconnectedUser();
  }, []);
  const disconnectedUser = () => {
    ioConnection.on("user-disconnected", async (id) => {
      const { data: getUsersConnectedToThisRoom } = await api.get(
        `/connected/room/${room.id}`
      );
      setDisConnectedUsers((priv) => [...priv, id]);
      console.log(id);
      setUsersConnectedToThisRoom(getUsersConnectedToThisRoom);
    });
    return () => {
      console.log("clean podcast");
    };
  };

  const sitOnCouch = async () => {
    if (isUserConnected && !isRoomFull) return;
    if (peer.disconnected) peer.reconnect();
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
      console.log(userInfo.id === room.presenter);
      if (userInfo.id === room.presenter) {
        console.log(userInfo.id === room.presenter);
        streamRef.current = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        navigator.mediaDevices.getDisplayMedia({ video: true }).then((s) => {
          streamRef.current.addTrack(...s.getVideoTracks());
          console.log(streamRef.current.getTracks());
          joinVideoAndNewUser(streamRef.current, peer);
          answerPeers(streamRef.current);
        });
      } else {
        streamRef.current = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        streamRef.current.getAudioTracks().forEach((track) => {
          track.enabled = false;
        });
        joinVideoAndNewUser(streamRef.current, peer);
        answerPeers(streamRef.current);
      }
    }
  };
  function connectToNewUser(userId, stream) {
    const call = peer.call(userId, stream);
    call?.on("stream", (remoteStream) => {
      setPeers(peer.connections);
    });
    call.on("close", () => {
      if (peers[userId]) {
        peers[userId][0]?.close();
        delete peers[userId];
        setPeers(peers);
      }
    });
  }
  const joinVideoAndNewUser = async (stream, peer) => {
    ioConnection?.on("new_user_joined", async (userInfo, userId) => {
      connectToNewUser(userId, stream, peer);
      console.log("new user");
      const { data: getUsersConnectedToThisRoom } = await api.get(
        `/connected/room/${room.id}`
      );
      setUsersConnectedToThisRoom(getUsersConnectedToThisRoom);
    });
    ioConnection.emit("join_video", userInfo.username, params.id, peer.id);
  };

  const answerPeers = (myStream) => {
    peer.on("call", (call) => {
      call.answer(myStream);
      setPeers(peer.connections);
      call.on("stream", function (remoteStream) {
        setPeers(peer.connections);
      });
    });
  };

  const makeCouch = () => {
    const couches = [];
    let usersOnTheCouch = usersConnectedToThisRoom?.length;
    for (let i = 0; i < room.capacity; i++) {
      // if()
      couches.push(
        <OverlayTrigger
          key={i}
          placement={"top"}
          overlay={
            <Tooltip id={`tooltip`}>
              {isRoomFull
                ? "The Room is Full"
                : isUserConnected
                ? "you already Joined"
                : "Join"}
            </Tooltip>
          }
        >
          <i
            onClick={async () => {
              await sitOnCouch();
            }}
            className="fas fa-couch couches"
            style={{
              padding: "10px",
              fontSize: "50px",
              cursor: "pointer",
              color: usersOnTheCouch > 0 ? "#1FB689" : "#C4C4C4",
            }}
          ></i>
        </OverlayTrigger>
      );
      usersOnTheCouch--;
    }
    return couches;
  };
  return (
    <If condition={room.name + room.id === params.id}>
      <Then>
        <div
          className="chat"
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <div className="presenter">
            {Object.entries(peers).map(([key, arr]) => {
              if (!disconnectedUsers.includes(key)) {
                if (arr[0]?.remoteStream?.getTracks()?.length > 1) {
                  return (
                    <div key={key}>
                      <video
                        autoPlay
                        width={500}
                        ref={(video) => {
                          console.log("new render");
                          if (video) {
                            if (arr[0]?.remoteStream)
                              video.srcObject = arr[0].remoteStream;
                            // console.log(arr[0]?.remoteStream?.getTracks());
                          }
                        }}
                      />
                    </div>
                  );
                }
              } else return null;
            })}
          </div>
          <div className="podcastCont">{makeCouch()}</div>
          {isUserConnected && (
            <div
              className="dis"
              onClick={async () => {
                const {
                  data: { users: disconnectUser },
                } = await api.put("/disconnect/room/" + room.id);
                console.log(disconnectUser);
                setUsersConnectedToThisRoom(disconnectUser);
                peer.disconnect();
                setIsUserConnected(false);
                streamRef.current
                  ?.getTracks()
                  ?.forEach((track) => track.stop());
                setPeers({});
              }}
            >
              <i className="fas fa-phone-slash"></i>
            </div>
          )}
        </div>
        {userInfo.id ===room.presenter? <button onClick={()=>{
            streamRef.current.getAudioTracks()[0].enabled = !streamRef.current.getAudioTracks()[0].enabled
            setIsMuted((muted)=>!muted)
          }} className="media-btn">{isMuted? <i class="fas fa-microphone-alt"></i>:<i class="fas fa-microphone-alt-slash"></i>}</button>: null}
      </Then>
    </If>
  );
}

export default Podcast;
