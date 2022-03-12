import "./NewGroupModal.css";
import { AiFillCloseCircle } from "react-icons/ai";
import { useContext, useState } from "react";
import { Chat } from "../../../context/ChatProvider";
import axios from "axios";
import { SearchedModalUser } from "../SearchedUser";
import AddedToGroupBadge from "../AddedToGroupBadge";

const NewGroupModal = ({ modalOpen, setModalOpen }) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [addToGroupError, setAddToGroupError] = useState("");
  const [fillInputsError, setFillInputsError] = useState("");
  const [renameGroupError, setRenameGroupError] = useState("");
  const { user, chats, setChats } = useContext(Chat);

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      setSearchResults([]);
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);
      if (data.length === 0) {
        setAddToGroupError("User not found"); // Set Error if user not found in database
      }
      setSearchResults(data);
    } catch (err) {
      console.log(err.message);
    }
  };
  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      setAddToGroupError("");
      setFillInputsError("Please enter all fields"); // Error if any input is empty
      return;
    }

    if (groupChatName.length > 15) {
      setRenameGroupError("Max chat name length is 15"); // Error if password is too long
      return;
    }

    if (selectedUsers.length < 2) {
      setAddToGroupError("At least 2 users must be added"); // Error if user list is too short to form group
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      const { data } = await axios.post(
        "/api/chat/group",
        {
          chatName: groupChatName,
          users: JSON.stringify(selectedUsers.map((user) => user._id)),
        },
        config
      );

      setChats([data, ...chats]);
      setModalOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = (selectedUser) => {
    setSelectedUsers(
      selectedUsers.filter((selected) => selected._id !== selectedUser._id)
    );
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      setFillInputsError("");
      setAddToGroupError("User already being added");
      return;
    }

    return setSelectedUsers([...selectedUsers, userToAdd]);
  };

  return (
    <div
      className={
        modalOpen
          ? "new-group-modal-container modal-active"
          : "new-group-modal-container"
      }
    >
      <div className="new-group-modal">
        <AiFillCloseCircle
          className="close-modal-btn"
          onClick={() => {
            setModalOpen(false);
            setSearch("");
            setGroupChatName("");
            setAddToGroupError("");
            setFillInputsError("");
            setRenameGroupError("");
          }}
        />
        <h1 className="modal-header">Create New Group Chat</h1>
        <form className="modal-form">
          <div className="new-gc-name-input-container">
            <input
              type="text"
              placeholder="Chat Name"
              value={groupChatName}
              onFocus={() => setRenameGroupError("")}
              onChange={(e) => setGroupChatName(e.target.value)}
              className="modal-input"
            />
            <p className="add-to-gc-error">{renameGroupError}</p>
          </div>
          <div className="new-gc-addusers-container">
            <input
              type="text"
              placeholder="Add Users To Group"
              className="modal-input"
              value={search}
              onFocus={() => {
                setAddToGroupError("");
                setFillInputsError("");
              }}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <p className="add-to-gc-error">{addToGroupError}</p>
            <p className="add-to-gc-error">{fillInputsError}</p>
          </div>
        </form>
        <div className="user-badges">
          {selectedUsers.map((selectedUser) => {
            return (
              <AddedToGroupBadge
                key={selectedUser._id}
                selectedUser={selectedUser}
                handleDelete={() => handleDelete(selectedUser)}
              />
            );
          })}
        </div>
        {searchResults?.slice(0, 4).map((user) => {
          return (
            <SearchedModalUser
              key={user._id}
              searchedUser={user}
              onClick={() => handleGroup(user)}
            />
          );
        })}
        <button className="modal-submit-btn" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default NewGroupModal;
