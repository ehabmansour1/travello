import React from 'react';
import './LiveChat.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faTimes, faExchangeAlt, faPaperPlane, faSmile, faPaperclip } from '@fortawesome/free-solid-svg-icons';

const LiveSupport = () => {
  return (
    <div className="background">
      <div className="gradient-sphere"></div>
      <div className="gradient-sphere secondary"></div>

      <div className="chat-container">
        {/* Sidebar */}
        <div className="chat-sidebar">
          <div className="chat-header">
            <h2>Live Support</h2>
            <div className="agent-status online">
              <span className="status-indicator"></span>
              <span className="status-text">Online</span>
            </div>
          </div>

          <div className="chat-conversations">
            <div className="search-box">
              <input type="text" placeholder="Search conversations..." className="search-input" />
            </div>

            <div className="conversation-list" id="conversationList">
              {/* Conversations will be mapped here */}
            </div>
          </div>

          <div className="agent-profile">
            <img src="" alt="Support Agent" className="agent-avatar" />
            <div className="agent-info">
              <h4>Support Team</h4>
              <p>Avg. Response Time: 5 min</p>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="chat-main">
          <div className="chat-header">
            <div className="current-chat-info">
              <h3 id="currentChatName">Select a conversation</h3>
              <p id="currentChatStatus" className="text-muted"></p>
            </div>
            <div className="chat-actions">
              <button className="btn-secondary btn-sm" id="endChatBtn" style={{ display: 'none' }}>
                <FontAwesomeIcon icon={faTimes} /> End Chat
              </button>
              <button className="btn-secondary btn-sm" id="transferChatBtn" style={{ display: 'none' }}>
                <FontAwesomeIcon icon={faExchangeAlt} /> Transfer
              </button>
            </div>
          </div>

          <div className="chat-messages" id="chatMessages">
            <div className="chat-welcome" id="chatWelcome">
              <FontAwesomeIcon icon={faComments} className="welcome-icon" />
              <h2>Welcome to Live Support</h2>
              <p>Select a conversation or start a new one to begin chatting.</p>
            </div>
          </div>

          <div className="chat-input-area">
            <form id="chatForm">
              
              <input
                type="text"
                id="messageInput"
                className="chat-input"
                placeholder="Type your message..."
                disabled
              />
              <button type="submit" className="btn-primary send-btn" disabled>
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
              <div className="chat-tools">
                <button type="button" className="tool-btn" id="attachmentBtn">
                  <FontAwesomeIcon icon={faPaperclip} />
                </button>
                <button type="button" className="tool-btn" id="emojiBtn">
                  <FontAwesomeIcon icon={faSmile} />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Chat Details */}
        <div className="chat-details">
          <div className="customer-info">
            <h3>Customer Details</h3>
            <div className="info-section">
              <div className="info-row">
                <span className="info-label">Name</span>
                <span className="info-value" id="customerName">-</span>
              </div>
              <div className="info-row">
                <span className="info-label">Email</span>
                <span className="info-value" id="customerEmail">-</span>
              </div>
              <div className="info-row">
                <span className="info-label">Joined</span>
                <span className="info-value" id="customerJoined">-</span>
              </div>
            </div>
          </div>

          <div className="conversation-info">
            <h3>Conversation Details</h3>
            <div className="info-section">
              <div className="info-row">
                <span className="info-label">Started</span>
                <span className="info-value" id="chatStarted">-</span>
              </div>
              <div className="info-row">
                <span className="info-label">Duration</span>
                <span className="info-value" id="chatDuration">-</span>
              </div>
              <div className="info-row">
                <span className="info-label">Category</span>
                <span className="info-value" id="chatCategory">-</span>
              </div>
            </div>
          </div>

          <div className="quick-responses">
            <h3>Quick Responses</h3>
            <div className="response-list">
              <button className="response-btn">Hello! How can I help you today?</button>
              <button className="response-btn">I'll look into that for you right away.</button>
              <button className="response-btn">Is there anything else I can help you with?</button>
              <button className="response-btn">Thank you for your patience.</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveSupport;
