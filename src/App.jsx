import { useEffect } from "react";
import Chat from "./components/Chat/Chat";
import Detail from "./components/Detail/Detail";
import List from "./components/List/List";
import Login from "./components/Login/Login";
import Notifications from "./components/Notification/Notifications";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./components/Lib/Firebase";
import { useUserStore } from "./components/Lib/zustand/userStore";
import { useChatStore } from "./components/Lib/zustand/chatStore";

const App = () => {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();

  const { chatId } = useChatStore();
  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
    });

    return () => {
      unSub();
    };
  }, [fetchUserInfo]);

  if (isLoading) return <div className="loading">Loading...</div>;

  return (
    <div className="container">
      {currentUser ? (
        <>
          <List />
          {chatId && <Chat />}
          {chatId && <Detail />}
        </>
      ) : (
        <Login />
      )}
      <Notifications />
    </div>
  );
};

export default App;
