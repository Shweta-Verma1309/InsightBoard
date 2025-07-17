module.exports = (io, socket) => {
  socket.on('joinBoard', (boardId) => {
    socket.join(boardId);
  });

  socket.on('newPost', ({ boardId, post }) => {
    io.to(boardId).emit('newPost', post);
  });

  socket.on('vote', ({ boardId, postId, votes }) => {
    io.to(boardId).emit('voteUpdate', { postId, votes });
  });

  socket.on('newComment', ({ boardId, comment }) => {
    io.to(boardId).emit('newComment', comment);
  });
};
