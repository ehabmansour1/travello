import React from "react";
import "./ChatWidget.css";
import { Link } from "react-router-dom";

const ChatWidget = () => {
  return (
    <Link to="/liveChat" className="chat-widget">
      <i className="fas fa-comments"></i>
    </Link>
  );
};

export default ChatWidget;
