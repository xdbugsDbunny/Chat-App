import React, { useEffect, useState } from "react";
import styles from "./ChatList.module.css";
import { CiSearch } from "react-icons/ci";
import { FaPlus, FaMinus } from "react-icons/fa";
import AddUser from "./AddUser/AddUser";
import { useUserStore } from "../../Lib/zustand/userStore";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { database } from "../../Lib/Firebase";
import { useChatStore } from "../../Lib/zustand/chatStore";

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [addMode, setMode] = useState(true);
  const [input, setInput] = useState("");
  const { currentUser } = useUserStore();
  const { chatId, changeChat } = useChatStore();

  useEffect(() => {
    const unsub = onSnapshot(
      doc(database, "userchats", currentUser.id),
      async (response) => {
        const items = response.data().chats;

        const promises = items.map(async (item) => {
          const userDocRef = doc(database, "users", item.receiverId);
          const userDocSnap = await getDoc(userDocRef);

          const user = userDocSnap.data();

          return { ...item, user };
        });

        const chatData = await Promise.all(promises);
        setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
      }
    );

    return () => {
      unsub();
    };
  }, [currentUser.id]);

  const handleSelect = async (chat) => {
    const userChats = chats.map((item) => {
      const { user, ...rest } = item;
      return rest;
    });

    const chatIndex = userChats.findIndex(
      (item) => item.chatId === chat.chatId
    );
    userChats[chatIndex].isSeen = true;

    const userChatsRef = doc(database, "userchats", currentUser.id);

    try {
      await updateDoc(userChatsRef, {
        chats: userChats,
      });
      changeChat(chat.chatId, chat.user);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredChats = chats.filter((c) =>
    c.user.username.toLowerCase().includes(input.toLowerCase())
  );

  return (
    <div className={styles.chatList}>
      <div className={styles.search}>
        <div className={styles.searchBar}>
          <CiSearch size={"20px"} color="white" />
          <input
            type="text"
            placeholder="Search"
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        {addMode ? (
          <FaPlus
            className={styles.add}
            onClick={() => setMode((prev) => !prev)}
          />
        ) : (
          <FaMinus
            className={styles.add}
            onClick={() => setMode((prev) => !prev)}
          />
        )}
      </div>
      {filteredChats.map((chat) => (
        <div
          className={styles.item}
          key={chat.chatId}
          onClick={() => handleSelect(chat)}
          style={{
            backgroundColor: chat?.isSeen ? "transparent" : "#5183fe",
          }}
        >
          <img
            src={
              chat.user.blocked.includes(currentUser.id)
                ? "./avatar.png"
                : chat.user.avatar || "./avatar.png"
            }
            alt=""
          />
          <div className={styles.text}>
            <span>{chat.user.username}</span>
            <p>{chat.lastMessage}</p>
          </div>
        </div>
      ))}
      {!addMode && <AddUser />}
    </div>
  );
};

export default ChatList;
