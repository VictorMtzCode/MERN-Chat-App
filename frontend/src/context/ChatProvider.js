import { createContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

export const Chat = createContext();

const ChatContext = ({ children }) => {
  const [user, setUser] = useState(
    localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : {}
  );
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const history = useHistory();

  useEffect(() => {
    if (!user) {
      history.push("/"); // Redirect to login page if user is not signed in
    }
    localStorage.setItem("userInfo", JSON.stringify(user));

    return () => {
      setUser("");
    };
  }, []);

  return (
    <Chat.Provider
      value={{
        user,
        setUser,
        isLoaded,
        setIsLoaded,
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
      }}
    >
      {children}
    </Chat.Provider>
  );
};

export default ChatContext;
