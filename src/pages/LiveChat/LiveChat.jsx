import React from 'react';
import styles from './LiveChat.module.css'; // استيراد CSS Module
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faTimes, faExchangeAlt, faPaperPlane, faSmile, faPaperclip } from '@fortawesome/free-solid-svg-icons';

const LiveChat = () => {
  return (
    <div className={styles.background}>
      <div className={styles["gradient-sphere"]}></div>
      <div className={`${styles["gradient-sphere"]} ${styles.secondary}`}></div>

      <div className={styles["chat-container"]}>
        {/* Sidebar */}
        <div className={styles["chat-sidebar"]}>
          <div className={styles["chat-header"]}>
            <h2>Live Support</h2>
            <div className={`${styles["agent-status"]} ${styles.online}`}>
              <span className={styles["status-indicator"]}></span>
              <span className={styles["status-text"]}>Online</span>
            </div>
          </div>

          <div className={styles["chat-conversations"]}>
            <div className={styles["search-box"]}>
              <input
                type="text"
                placeholder="Search conversations..."
                className={styles["search-input"]}
              />
            </div>

            <div className={styles["conversation-list"]} id="conversationList">
              {/* Conversations will be mapped here */}
            </div>
          </div>

          <div className={styles["agent-profile"]}>
            <img src="" alt="Support Agent" className={styles["agent-avatar"]} />
            <div className={styles["agent-info"]}>
              <h4>Support Team</h4>
              <p>Avg. Response Time: 5 min</p>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className={styles["chat-main"]}>
          <div className={styles["chat-header"]}>
            <div className={styles["current-chat-info"]}>
              <h3 id="currentChatName">Select a conversation</h3>
              <p id="currentChatStatus" className={styles["text-muted"]}></p>
            </div>
            <div className={styles["chat-actions"]}>
              <button className={`${styles["btn-secondary"]} ${styles["btn-sm"]}`} id="endChatBtn" style={{ display: 'none' }}>
                <FontAwesomeIcon icon={faTimes} /> End Chat
              </button>
              <button className={`${styles["btn-secondary"]} ${styles["btn-sm"]}`} id="transferChatBtn" style={{ display: 'none' }}>
                <FontAwesomeIcon icon={faExchangeAlt} /> Transfer
              </button>
            </div>
          </div>

          <div className={styles["chat-messages"]} id="chatMessages">
            <div className={styles["chat-welcome"]} id="chatWelcome">
              <FontAwesomeIcon icon={faComments} className={styles["welcome-icon"]} />
              <h2>Welcome to Live Support</h2>
              <p>Select a conversation or start a new one to begin chatting.</p>
            </div>
          </div>

          <div className={styles["chat-input-area"]}>
            <form id="chatForm">
              <input
                type="text"
                id="messageInput"
                className={styles["chat-input"]}
                placeholder="Type your message..."
                disabled
              />
              <button
                type="submit"
                className={`${styles["btn-primary"]} ${styles["send-btn"]}`} // تأكد من أن الكلاسات موجودة
              >
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
              <div className={styles["chat-tools"]}>
                <button type="button" className={styles["tool-btn"]} id="attachmentBtn">
                  <FontAwesomeIcon icon={faPaperclip} />
                </button>
                <button type="button" className={styles["tool-btn"]} id="emojiBtn">
                  <FontAwesomeIcon icon={faSmile} />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Chat Details */}
        <div className={styles["chat-details"]}>
          <div className={styles["customer-info"]}>
            <h3>Customer Details</h3>
            <div className={styles["info-section"]}>
              <div className={styles["info-row"]}>
                <span className={styles["info-label"]}>Name</span>
                <span className={styles["info-value"]} id="customerName">-</span>
              </div>
              <div className={styles["info-row"]}>
                <span className={styles["info-label"]}>Email</span>
                <span className={styles["info-value"]} id="customerEmail">-</span>
              </div>
              <div className={styles["info-row"]}>
                <span className={styles["info-label"]}>Joined</span>
                <span className={styles["info-value"]} id="customerJoined">-</span>
              </div>
            </div>
          </div>

          <div className={styles["conversation-info"]}>
            <h3>Conversation Details</h3>
            <div className={styles["info-section"]}>
              <div className={styles["info-row"]}>
                <span className={styles["info-label"]}>Started</span>
                <span className={styles["info-value"]} id="chatStarted">-</span>
              </div>
              <div className={styles["info-row"]}>
                <span className={styles["info-label"]}>Duration</span>
                <span className={styles["info-value"]} id="chatDuration">-</span>
              </div>
              <div className={styles["info-row"]}>
                <span className={styles["info-label"]}>Category</span>
                <span className={styles["info-value"]} id="chatCategory">-</span>
              </div>
            </div>
          </div>

          <div className={styles["quick-responses"]}>
            <h3>Quick Responses</h3>
            <div className={styles["response-list"]}>
              <button className={styles["response-btn"]}>Hello! How can I help you today?</button>
              <button className={styles["response-btn"]}>I'll look into that for you right away.</button>
              <button className={styles["response-btn"]}>Is there anything else I can help you with?</button>
              <button className={styles["response-btn"]}>Thank you for your patience.</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveChat;
