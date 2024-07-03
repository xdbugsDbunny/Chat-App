import React from "react";
import styles from "./UserInfo.module.css";
import { IoIosMore } from "react-icons/io";
import { IoVideocamOutline } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import { useUserStore } from "../../Lib/zustand/userStore";

const UserInfo = () => {
  const { currentUser } = useUserStore();

  return (
    <div className={styles.userInfo}>
      <div className={styles.user}>
        <img src={currentUser.avatar || "./avatar.png"} alt="" />
        <h2>{currentUser.username}</h2>
      </div>
      <div className={styles.icons}>
        {/* <img src="./more.png" alt="" /> */}
        {/* <img src="./video.png" alt="" />
          <img src="./edit.png" alt="" /> */}
        <IoIosMore size={"20px"} color="white" />
        <IoVideocamOutline size={"20px"} color="white" />
        <FaRegEdit size={"20px"} color="white" />
      </div>
    </div>
  );
};

export default UserInfo;
