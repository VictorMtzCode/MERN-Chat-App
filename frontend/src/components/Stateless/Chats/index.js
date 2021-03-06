import "./Chats.css";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Chat } from "../../../context/ChatProvider";
import NewGroupModal from "../Modals/NewGroupModal";
import { getSender } from "../ChatLogic";
import { FiSearch } from "react-icons/fi";
import sadMessage from "../../../assets/images/sad-message.svg";
import Loader from "../Loader";

const Chats = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [loggedUser, setLoggedUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const {
    user,
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
    iPadSearch,
    setiPadSearch,
  } = useContext(Chat);

  const iPadScreen = window.matchMedia("(max-width: 1024px)"); // For conditional rendering on smaller screens

  const fetchChats = async () => {
    setIsLoading(true);
    if (!user) {
      return;
    }

    // Fetch data
    const config = {
      headers: { Authorization: `Bearer ${user.token}` },
    };
    try {
      const { data } = await axios.get("/api/chat", config);
      setChats(data);
      setIsLoading(false);
    } catch (err) {
      console.log(err.message);
    }
  };

  // Capitalize first letter in chat name
  const toUpperCase = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  useEffect(() => {
    setLoggedUser(user);
  });

  // Fetch user again if empty on first render
  useEffect(() => {
    fetchChats();
  }, [loggedUser]);

  console.log(isLoading);
  return (
    <section
      className={
        (selectedChat && iPadScreen.matches) ||
        (selectedChat && iPadSearch) ||
        (!selectedChat && iPadSearch)
          ? "chats-section-ipad"
          : "chats-section"
      }
    >
      <span className="chats-header">
        <h2 className="chats-title">Chats</h2>
        <span className="chats-btns">
          <button className="new-chat-btn" onClick={() => setModalOpen(true)}>
            New Group
          </button>
          {iPadScreen.matches && (
            <FiSearch
              className="chats-search-icon"
              onClick={() => setiPadSearch(true)}
            />
          )}
        </span>
      </span>
      <NewGroupModal modalOpen={modalOpen} setModalOpen={setModalOpen} />
      <>
        {chats.length > 0 && !isLoading ? (
          <div className="single-chats">
            {chats.map((chat) => {
              return (
                <div
                  key={chat._id}
                  className={
                    selectedChat._id === chat._id
                      ? "single-chat active-single-chat"
                      : "single-chat"
                  }
                  onClick={() => {
                    setSelectedChat(chat);
                  }}
                >
                  <p>
                    {user && !chat.isGroupChat
                      ? toUpperCase(getSender(user, chat.users))
                      : chat.chatName}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="no-chats">
            {!isLoading && <h3>No chats</h3>}
            {!isLoading && <img src={sadMessage} alt="sad-message" />}
          </div>
        )}
      </>
      {isLoading && <Loader />}
    </section>
  );
};

export default Chats;
