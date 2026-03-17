function CommentList({ comments }) {
  if (!comments || comments.length === 0) {
    return <p className="text-gray-500">No comments yet.</p>;
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment._id} className="p-4 border rounded-lg bg-white shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold text-gray-800">
              {comment.userId?.name || "Anonymous"}
            </h4>
            <span className="text-sm text-gray-500">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="text-gray-700">{comment.message}</p>
        </div>
      ))}
    </div>
  );
}

export default CommentList;
