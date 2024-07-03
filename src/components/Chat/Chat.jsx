import React, { useState, useEffect, useRef } from "react";
import styles from "./Chat.module.css";
import EmojiPicker from "emoji-picker-react";
import {
  FaPhoneAlt,
  FaVideo,
  FaInfoCircle,
  FaImages,
  FaCamera,
  FaMicrophone,
} from "react-icons/fa";

import { MdEmojiEmotions } from "react-icons/md";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { database } from "../Lib/Firebase";
import { useChatStore } from "../Lib/zustand/chatStore";
import { useUserStore } from "../Lib/zustand/userStore";
import upload from "../Lib/Upload";

const Chat = () => {
  const [chat, setChat] = useState();

  const [openEmoji, setOpenEmoji] = useState(false);

  const [text, setText] = useState("");

  const [img, setImg] = useState({
    file: null,
    url: "",
  });

  const { currentUser } = useUserStore();

  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } =
    useChatStore();

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpenEmoji(false);
  };

  const handleImage = (e) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const unSub = onSnapshot(doc(database, "chats", chatId), (response) => {
      setChat(response.data());
    });

    return () => {
      unSub();
    };
  }, [chatId]);

  const handleSend = async () => {
    if (text === "") return;
    console.log(text);

    let imgUrl = null;

    try {
      if (img.file) {
        imgUrl = await upload(img.file);
      }

      await updateDoc(doc(database, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date(),
          ...(imgUrl && { img: imgUrl }),
        }),
      });

      const userIDs = [currentUser.id, user.id];

      userIDs.forEach(async (id) => {
        const userChatsRef = doc(database, "userchats", id);
        const userChatSnapShot = await getDoc(userChatsRef);

        if (userChatSnapShot.exists()) {
          const userChatsData = userChatSnapShot.data();

          const chatIndex = userChatsData.chats.findIndex(
            (c) => c.chatId === chatId
          );
          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].isSeen =
            id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
          });
        }
      });
    } catch (error) {
      console.log(error);
    }

    setImg({
      file: null,
      url: "",
    });

    setText("");
  };
  return (
    <div className={styles.chat}>
      {/* Top Part */}
      <div className={styles.top}>
        <div className={styles.user}>
          <img src={user?.avatar || "./avatar.png"} alt="" />
          <div className={styles.text}>
            <span>{user?.username}</span>
            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit.</p>
          </div>
          <div className={styles.icons}>
            <FaPhoneAlt size={"20px"} color="white" />
            <FaVideo size={"20px"} color="white" />
            <FaInfoCircle size={"20px"} color="white" />
          </div>
        </div>
      </div>

      {/* Center Part */}
      <div className={styles.center}>
        {chat?.messages?.map((message) => (
          <>
            <div
              className={
                message.senderId === currentUser?.id
                  ? `${styles.message} ${styles.own}`
                  : `${styles.message}`
              }
              key={message?.createdAt}
            >
              <img src="./avatar.png" alt="" />
              <div className={styles.text}>
                {message.img && <img src={message.img} alt="" />}
                <p>{message.text}</p>
                {/* <span>{message.createdAt}</span> */}
              </div>
            </div>
            <div ref={endRef}></div>
          </>
        ))}
        {img.url && (
          <div className={`${styles.message} ${styles.own}`}>
            <div className={styles.text}>
              <img src={img.url} alt="" />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Part */}
      <div className={styles.bottom}>
        <div className={styles.icons}>
          <label htmlFor="file">
            <FaImages
              size={"20px"}
              color="white"
              style={{ cursor: "pointer" }}
            />
          </label>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleImage}
          />
          <FaCamera size={"20px"} color="white" style={{ cursor: "pointer" }} />
          <FaMicrophone
            size={"20px"}
            color="white"
            style={{ cursor: "pointer" }}
          />
        </div>
        <input
          type="text"
          value={text}
          placeholder={ (isCurrentUserBlocked || isReceiverBlocked) ? "You Cannot Send a Message":"Type a message..."}
          onChange={(e) => setText(e.target.value)}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        />
        <div className={styles.emoji}>
          <MdEmojiEmotions
            size={"30px"}
            color="white"
            style={{ cursor: "pointer" }}
            onClick={() => setOpenEmoji((prev) => !prev)}
          />
          <div className={styles.picker}>
            <EmojiPicker open={openEmoji} onEmojiClick={handleEmoji} />
          </div>
        </div>
        <button
          className={styles.sendButton}
          onClick={handleSend}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
