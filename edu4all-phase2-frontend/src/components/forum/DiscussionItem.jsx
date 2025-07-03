import dayjs from "dayjs";
import { Link } from "react-router-dom";
import styles from "./DiscussionItem.module.css";

export default function DiscussionItem({ discussion }) {
  const getInitial = (username) => {
    return username ? username.charAt(0).toUpperCase() : "U";
  };

  // Decode HTML entities and strip all tags (including <img>)
  const getPlainText = (html) => {
    if (!html) return "";
    // Parse the HTML string into a document
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    // Extract only the text content (this drops all tags and decodes entities)
    return doc.body.textContent.trim();
  };

  const plainDescription = getPlainText(discussion.description);

  return (
    <Link to={`post/${discussion.id}`} className={styles.discussionItem}>
      <div className={styles.icon}>
        <span role="img" aria-label="icon">
          💬
        </span>
      </div>
      <div className={styles.content}>
        <div className={styles.title}>{discussion.title}</div>
        <div className={styles.desc}>{plainDescription}</div>
        <div className={styles.date}>
          {dayjs(discussion.createdAt).format("MMM DD")}
        </div>
      </div>
      <div className={styles.avatar}>
        <div className={styles.initialAvatar}>
          {getInitial(discussion.username)}
        </div>
        <div className={styles.username}>{discussion.username}</div>
      </div>
    </Link>
  );
}
