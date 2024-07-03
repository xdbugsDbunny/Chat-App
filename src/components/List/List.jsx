import React from "react";
import styles from "./List.module.css";
import UserInfo from "./UserInfo/UserInfo";
import ChatList from "./ChatList/ChatList";
const List = () => {
  return (
    <div className={styles.list}>
      <UserInfo />
      <ChatList />
    </div>
  );
};

export default List;
