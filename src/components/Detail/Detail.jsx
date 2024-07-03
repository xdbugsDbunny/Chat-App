import React from "react";
import styles from "./Detail.module.css";

import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { FiDownload } from "react-icons/fi";
import { auth, database } from "../Lib/Firebase";
import { useChatStore } from "../Lib/zustand/chatStore";
import { useUserStore } from "../Lib/zustand/userStore";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";

const Detail = () => {
  const { chatid, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } =
    useChatStore();

  const { currentUser } = useUserStore();

  const handleBlock = async () => {
    if (!user) return;
    const userDocRef = doc(database, "users", currentUser.id);

    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      changeBlock();
    } catch (error) {}
  };
  return (
    <div className={styles.detail}>
      <div className={styles.user}>
        <img src={user?.avatar || "./avatar.png"} alt="" />
        <h3>{user?.username}</h3>
        <p>Lorem ipsum dolor</p>
      </div>
      <div className={styles.info}>
        <div className={styles.option}>
          <div className={styles.title}>
            <span>Chat Setting</span>
            <IoIosArrowUp size={"20px"} color="white" className={styles.icon} />
          </div>
        </div>
        <div className={styles.option}>
          <div className={styles.title}>
            <span>Privacy & Help</span>
            <IoIosArrowUp size={"20px"} color="white" className={styles.icon} />
          </div>
        </div>
        <div className={styles.option}>
          <div className={styles.title}>
            <span>Shared Photos</span>
            <IoIosArrowDown
              size={"20px"}
              color="white"
              className={styles.icon}
            />
          </div>
          <div className={styles.photos}>
            <div className={styles.photoItem}>
              <div className={styles.photoDetail}>
                <img src="./bg2.jpg" alt="" />
                <span>Hello Suraj</span>
              </div>
              <FiDownload
                className={styles.downloadIcon}
                size={"20px"}
                color="white"
              />
            </div>
            <div className={styles.photoItem}>
              <div className={styles.photoDetail}>
                <img src="./bg2.jpg" alt="" />
                <span>Hello Suraj</span>
              </div>
              <FiDownload
                className={styles.downloadIcon}
                size={"20px"}
                color="white"
              />
            </div>
            <div className={styles.photoItem}>
              <div className={styles.photoDetail}>
                <img src="./bg2.jpg" alt="" />
                <span>Hello Suraj</span>
              </div>
              <FiDownload
                className={styles.downloadIcon}
                size={"20px"}
                color="white"
              />
            </div>
          </div>
        </div>
        <div className={styles.option}>
          <div className={styles.title}>
            <span>Shared Files</span>
            <IoIosArrowUp size={"20px"} color="white" className={styles.icon} />
          </div>
        </div>
        <button onClick={handleBlock}>
          {isCurrentUserBlocked
            ? "You are Blocked"
            : isReceiverBlocked
            ? "User Blocked"
            : "Block User"}
        </button>
        <button className={styles.logout} onClick={() => auth.signOut()}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Detail;
