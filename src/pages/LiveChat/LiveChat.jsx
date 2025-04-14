import React, { useState, useEffect, useRef } from "react";
import { useFirebase } from "../../contexts/FirebaseContext";
import { db } from "../../firebase";

import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  orderBy,
  serverTimestamp,
  doc,
  updateDoc,
  getDoc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { getAIResponse } from "../../services/aiChatbot";
import styles from "./LiveChat.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faRobot,
  faUser,
  faHeadset,
  faEnvelope,
  faPhone,
  faCalendar,
  faTrash,
  faArrowLeft,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

const LiveChat = () => {
  const { user, getUserData } = useFirebase();
  const [userRole, setUserRole] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatType, setChatType] = useState("ai"); // 'ai' or 'human'
  const [loading, setLoading] = useState(true);
  const [supportRequests, setSupportRequests] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [activeRequest, setActiveRequest] = useState(null);
  const [adminProfile, setAdminProfile] = useState(null);
  const [userProfiles, setUserProfiles] = useState({});
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Scroll when messages change

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        const userData = await getUserData(user.uid);
        setUserRole(userData?.role || "user");
        if (userData?.role === "admin") {
          const adminDoc = await getDoc(doc(db, "users", user.uid));
          if (adminDoc.exists()) {
            setAdminProfile(adminDoc.data());
          }
        }
        setLoading(false);
      }
    };
    fetchUserRole();
  }, [user, getUserData]);

  useEffect(() => {
    if (userRole === "admin") {
      // Listen for support requests
      const q = query(
        collection(db, "support_requests"),
        where("status", "in", ["pending", "accepted"])
      );
      const unsubscribe = onSnapshot(q, async (snapshot) => {
        const requests = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSupportRequests(requests);

        // Fetch user profiles for all requests
        const profiles = {};
        for (const request of requests) {
          if (!userProfiles[request.userId]) {
            const userDoc = await getDoc(doc(db, "users", request.userId));
            if (userDoc.exists()) {
              profiles[request.userId] = userDoc.data();
            }
          }
        }
        setUserProfiles((prev) => ({ ...prev, ...profiles }));
      });
      return () => unsubscribe();
    } else if (userRole === "user") {
      // Set up listener for AI chat messages when user is chatting with AI
      if (chatType === "ai") {
        const q = query(
          collection(db, "chats", "ai_chat", "messages"),
          orderBy("timestamp", "asc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const chatMessages = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setMessages(chatMessages);
        });

        return () => unsubscribe();
      } else if (activeChat) {
        // Human support chat listening logic remains the same
        const q = query(
          collection(db, "chats", activeChat, "messages"),
          orderBy("timestamp", "asc")
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const chatMessages = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setMessages(chatMessages);
        });
        return () => unsubscribe();
      }
    }
  }, [userRole, activeChat, chatType]);

  useEffect(() => {
    if (userRole === "admin" && activeChat) {
      // Listen for messages in the active chat
      const q = query(
        collection(db, "chats", activeChat, "messages"),
        orderBy("timestamp", "asc")
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const chatMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(chatMessages);
      });
      return () => unsubscribe();
    }
  }, [userRole, activeChat]);

  // Hide footer when component mounts and show it when unmounts
  useEffect(() => {
    const footer = document.querySelector("footer");
    if (footer) {
      footer.style.display = "none";
    }

    return () => {
      if (footer) {
        footer.style.display = "block";
      }
    };
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageToSend = newMessage;
    setNewMessage(""); // Clear input immediately

    if (userRole === "user") {
      if (chatType === "ai") {
        // Send user message
        await addDoc(collection(db, "chats", "ai_chat", "messages"), {
          text: messageToSend,
          senderId: user.uid,
          senderName: user.displayName || "User",
          timestamp: serverTimestamp(),
          type: "user",
        });

        setIsTyping(true);
        const aiResponse = await getAIResponse(messageToSend);
        setIsTyping(false);

        // Send AI response
        await addDoc(collection(db, "chats", "ai_chat", "messages"), {
          text: aiResponse.message,
          senderId: "ai",
          senderName: "AI Assistant",
          timestamp: serverTimestamp(),
          type: "ai",
          tours: aiResponse.tours,
        });
      } else {
        // Send message to human support
        await addDoc(collection(db, "chats", activeChat, "messages"), {
          text: messageToSend,
          senderId: user.uid,
          senderName: user.displayName || "User",
          timestamp: serverTimestamp(),
          type: "user",
        });
      }
    } else if (userRole === "admin" && activeChat) {
      // Admin sending message
      await addDoc(collection(db, "chats", activeChat, "messages"), {
        text: messageToSend,
        senderId: user.uid,
        senderName: "Support Agent",
        timestamp: serverTimestamp(),
        type: "admin",
      });
    }
  };

  const requestHumanSupport = async () => {
    if (userRole === "user") {
      const request = {
        userId: user.uid,
        userName: user.displayName || "User",
        timestamp: serverTimestamp(),
        status: "pending",
      };

      const docRef = await addDoc(collection(db, "support_requests"), request);
      setActiveChat(docRef.id);
      setChatType("human");
    }
  };

  const acceptSupportRequest = async (requestId) => {
    if (userRole === "admin") {
      await updateDoc(doc(db, "support_requests", requestId), {
        status: "accepted",
        agentId: user.uid,
        acceptedAt: serverTimestamp(),
      });
      setActiveChat(requestId);
      setActiveRequest(requestId);
    }
  };

  const handleClearChat = async () => {
    if (userRole === "user") {
      if (chatType === "ai") {
        // Clear AI chat
        const messagesRef = collection(db, "chats", "ai_chat", "messages");
        const snapshot = await getDocs(messagesRef);
        const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
        await Promise.all(deletePromises);
        setMessages([]);
      } else if (activeChat) {
        // Clear human support chat
        const messagesRef = collection(db, "chats", activeChat, "messages");
        const snapshot = await getDocs(messagesRef);
        const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
        await Promise.all(deletePromises);
        setMessages([]);
      }
    } else if (userRole === "admin" && activeChat) {
      // Clear admin chat
      const messagesRef = collection(db, "chats", activeChat, "messages");
      const snapshot = await getDocs(messagesRef);
      const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      setMessages([]);
    }
  };

  const handleReturnToAI = () => {
    setChatType("ai");
    setActiveChat(null);
    setMessages([]);
  };

  const handleDeleteChat = async () => {
    if (userRole === "admin" && activeChat) {
      try {
        // Delete all messages in the chat
        const messagesRef = collection(db, "chats", activeChat, "messages");
        const snapshot = await getDocs(messagesRef);
        const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
        await Promise.all(deletePromises);

        // Delete the support request
        await deleteDoc(doc(db, "support_requests", activeChat));

        // Reset state
        setActiveChat(null);
        setMessages([]);
        setActiveRequest(null);
      } catch (error) {
        console.error("Error deleting chat:", error);
      }
    }
  };

  const formatMessage = (text) => {
    // Split the text by double stars and format accordingly
    const parts = text.split(/(\*\*.*?\*\*)/g);

    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        // Remove the stars and wrap in bold
        const content = part.slice(2, -2);
        return (
          <React.Fragment key={index}>
            <br />
            <strong>{content}</strong>
          </React.Fragment>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading chat...</p>
      </div>
    );
  }

  return (
    <div className={styles.background}>
      <div className={styles["gradient-sphere"]}></div>
      <div className={`${styles["gradient-sphere"]} ${styles.secondary}`}></div>

      <div className={styles["chat-container"]}>
        {userRole === "admin" ? (
          <>
            <div className={styles["chat-sidebar"]}>
              <div className={styles["admin-profile"]}>
                <div className={styles["admin-avatar"]}>
                  {adminProfile?.photoURL ? (
                    <img src={adminProfile.photoURL} alt="Admin" />
                  ) : (
                    <FontAwesomeIcon icon={faUser} />
                  )}
                </div>
                <div className={styles["admin-info"]}>
                  <h3>{adminProfile?.displayName || "Admin"}</h3>
                  <p>{adminProfile?.email}</p>
                </div>
              </div>
              <div className={styles["chat-header"]}>
                <h2>
                  <FontAwesomeIcon icon={faHeadset} /> Support Requests
                </h2>
              </div>
              <div className={styles["chat-conversations"]}>
                {supportRequests.length === 0 ? (
                  <div className={styles["no-requests"]}>
                    <p>No pending support requests</p>
                  </div>
                ) : (
                  supportRequests.map((request) => {
                    const userProfile = userProfiles[request.userId];
                    return (
                      <div
                        key={request.id}
                        className={`${styles["request-item"]} ${
                          activeRequest === request.id ? styles.active : ""
                        }`}
                        onClick={() => {
                          if (request.status === "accepted") {
                            setActiveChat(request.id);
                            setActiveRequest(request.id);
                          }
                        }}
                      >
                        <div className={styles["request-info"]}>
                          <div className={styles["user-header"]}>
                            <div className={styles["user-avatar"]}>
                              {userProfile?.photoURL ? (
                                <img
                                  src={userProfile.photoURL}
                                  alt={userProfile.displayName}
                                />
                              ) : (
                                <FontAwesomeIcon icon={faUser} />
                              )}
                            </div>
                            <div className={styles["user-details"]}>
                              <p className={styles["user-email"]}>
                                <FontAwesomeIcon icon={faEnvelope} />{" "}
                                {userProfile?.email || "No email"}
                              </p>
                            </div>
                          </div>
                          <div className={styles["request-meta"]}>
                            <p>
                              <FontAwesomeIcon icon={faCalendar} />
                              Requested:{" "}
                              {new Date(
                                request.timestamp?.toDate()
                              ).toLocaleString()}
                            </p>
                            {userProfile?.phoneNumber && (
                              <p>
                                <FontAwesomeIcon icon={faPhone} />
                                {userProfile.phoneNumber}
                              </p>
                            )}
                          </div>
                          <p className={styles["request-status"]}>
                            Status:{" "}
                            <span className={styles[request.status]}>
                              {request.status}
                            </span>
                          </p>
                        </div>
                        {request.status === "pending" && (
                          <button
                            className={styles["accept-btn"]}
                            onClick={(e) => {
                              e.stopPropagation();
                              acceptSupportRequest(request.id);
                            }}
                          >
                            Accept Request
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
            <div className={styles["chat-main"]}>
              {activeChat ? (
                <>
                  <div className={styles["chat-header"]}>
                    <div className={styles["header-left"]}>
                      <h2>
                        <FontAwesomeIcon icon={faHeadset} /> Support Chat
                      </h2>
                    </div>
                    <div className={styles["header-actions"]}>
                      <button
                        className={styles["clear-chat-btn"]}
                        onClick={handleClearChat}
                      >
                        <FontAwesomeIcon icon={faTrash} /> Clear Chat
                      </button>
                      <button
                        className={styles["delete-chat-btn"]}
                        onClick={handleDeleteChat}
                      >
                        <FontAwesomeIcon icon={faTimes} /> Delete Chat
                      </button>
                    </div>
                  </div>
                  <div className={styles["chat-messages"]}>
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`${styles.message} ${
                          message.type === "admin"
                            ? styles.sent
                            : styles.received
                        }`}
                      >
                        <div className={styles["message-header"]}>
                          <span className={styles["sender-name"]}>
                            {message.type === "admin"
                              ? "Support Agent"
                              : message.senderName}
                          </span>
                          <span className={styles["message-time"]}>
                            {new Date(
                              message.timestamp?.toDate()
                            ).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className={styles["message-content"]}>
                          {formatMessage(message.text)}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                  <div className={styles["chat-input-area"]}>
                    <form onSubmit={handleSendMessage}>
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className={styles["chat-input"]}
                        placeholder="Type your message..."
                      />
                      <button type="submit" className={styles["send-btn"]}>
                        <FontAwesomeIcon icon={faPaperPlane} />
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className={styles["chat-welcome"]}>
                  <h2>Welcome to Support Dashboard</h2>
                  <p>Select a support request to begin chatting.</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className={styles["chat-main"]}>
            <div className={styles["chat-header"]}>
              <div className={styles["header-left"]}>
                {chatType === "human" && (
                  <button
                    className={styles["return-btn"]}
                    onClick={handleReturnToAI}
                  >
                    <FontAwesomeIcon icon={faArrowLeft} />
                  </button>
                )}
                <h2>
                  {chatType === "ai" ? (
                    <>
                      <FontAwesomeIcon icon={faRobot} /> AI Assistant
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faHeadset} /> Human Support
                    </>
                  )}
                </h2>
              </div>
              <button
                className={styles["clear-chat-btn"]}
                onClick={handleClearChat}
              >
                <FontAwesomeIcon icon={faTrash} /> Clear Chat
              </button>
            </div>
            <div className={styles["chat-messages"]}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`${styles.message} ${
                    message.type === "user" ? styles.sent : styles.received
                  }`}
                >
                  <div className={styles["message-header"]}>
                    <span className={styles["sender-name"]}>
                      {message.type === "user" ? "You" : message.senderName}
                    </span>
                    <span className={styles["message-time"]}>
                      {new Date(
                        message.timestamp?.toDate()
                      ).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className={styles["message-content"]}>
                    {formatMessage(message.text)}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className={styles["typing-indicator"]}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className={styles["chat-input-area"]}>
              <form onSubmit={handleSendMessage}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className={styles["chat-input"]}
                  placeholder="Type your message..."
                />
                <button type="submit" className={styles["send-btn"]}>
                  <FontAwesomeIcon icon={faPaperPlane} />
                </button>
              </form>
              {chatType === "ai" && (
                <button
                  className={styles["request-human-btn"]}
                  onClick={requestHumanSupport}
                >
                  <FontAwesomeIcon icon={faHeadset} /> Request Human Support
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveChat;
