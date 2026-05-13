import React, { useState } from 'react';

function CommentInput({ onSubmit }) {
  const [comment, setComment] = useState('');

  const handleInputChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      onSubmit(comment); // Pass the comment to the parent component
      setComment(''); // Clear the input field
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-4">
      <textarea
        value={comment}
        onChange={handleInputChange}
        placeholder="Write a comment..."
        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-600"
        rows="4"
      ></textarea>
      <button
        type="submit"
        className="mt-2 bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
      >
        Post Comment
      </button>
    </form>
  );
}

export default CommentInput;