const express = require('express');
const cors = require('cors');
const server = express();

// import routers
const postsRouter = require('./posts/posts-router');

server.use(cors()) // for cors errors
server.use(express.json()) // for parsing json in reqs
server.use('/api/posts', postsRouter)

server.get('/', (req, res) => {
    res.send(`
      <h2>Matty's Message Board API</h>
      <p>Welcome</p>
    `);
  });

  module.exports = server