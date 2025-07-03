import DiscussionItem from "./DiscussionItem";

export default function DiscussionList({ discussions }) {
  return (
    <div>
      {discussions.map((discussion) => (
        <DiscussionItem key={discussion.id} discussion={discussion} />
      ))}
    </div>
  );
}