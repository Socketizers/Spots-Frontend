import React, {useState, useEffect} from "react";
import {useDispatch , useSelector} from "react-redux";
import { getFriendsList } from "../../features/friends/friendsSlice";
import FriendList from "./friends/FriendList";
import {storage} from "../../app/firebase";
import api from "../../app/api";


function UserHomePage() {
const [file, setFile] = useState('');
  const dispatcher = useDispatch();

const handleChange = e => {
  e.preventDefault();
  setFile(e.target.files[0]);
};

const handleUpload = () => {
  const name = +new Date() + "-" + file.name;
  const uploadTask = storage.ref(`images/${name}`).put(file);
  console.log('uploaded successfully')
  uploadTask.on(   "state_changed",
  snapshot => {},
  error => {
    console.log(error);
  },
    () => {
      storage
        .ref("images")
        .child(name)
        .getDownloadURL()
        .then(url => {
          const body = {};
          body[name]= url;
          api.put(`/story/${name}`, body);
        });
    }
  );
};

  useEffect(()=>{ 
    dispatcher(getFriendsList());
    }, [ ]);
    
  return <div>User Home Page
    <h2>Add Story</h2>
      <input type="file" onChange={handleChange} />
      <button onClick={handleUpload}>Upload</button>

    <FriendList/>
  </div>;
}

export default UserHomePage;
