import { useState } from 'react';

import AddFriend from './AddFriend';
import MyFriends from './MyFriends';
import FriendRequest from './FriendRequest';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import './Friends.css';

function Friends({ ChangePage }) {
  // User's current friend, read/written to by children components
  const [friends, setFriends] = useState( [] );

  return (
    <div>
      <div className="Friend">
        <AddFriend />
        <MyFriends friends={friends} setFriends={setFriends} ChangePage={ChangePage} />
        <FriendRequest friends={friends} setFriends={setFriends} />
        <Button className="rounded-circle" onClick={() => ChangePage("main", "")}> <FontAwesomeIcon icon={faXmark}/> </Button>
        <br></br>
      </div>
    </div>
  );
}

export default Friends;
