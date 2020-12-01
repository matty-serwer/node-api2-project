const express = require("express");
const Post = require("./../../data/db");

const router = express.Router();

module.exports = router;

router.get("/", (req, res) => {
  const { query } = req;
  Post.find(query)
    .then((posts) => {
      res.json(posts);
    })
    .catch((error) => {
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." });
    });
});

router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (post.id) {
        res.status(200).json(post);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json({ error: "The post information could not be retrieved." });
    });
});

router.get("/:id/comments", (req, res) => {
  Post.findPostComments(req.params.id)
    .then((comments) => {
      // console.log(comments);
      if (comments.length > 0) {
        res.status(200).json(comments);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json({ error: "The comments information could not be retrieved." });
    });
});

router.post("/", (req, res) => {
  if (!req.body.title || !req.body.contents) {
    res
      .status(400)
      .json({
        errorMessage: "Please provide title and contents for the post.",
      });
  }
  Post.insert(req.body)
    .then((post) => {
      res.status(201).json(post);
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json({
          error: "There was an error while saving the post to the database",
        });
    });
});

router.post("/:id/comments", (req, res) => {
    if(!req.body.text) {
        res.status(400).json({ errorMessage: "Please provide text for the comment." })
    }
    const comment = {...req.body, 'post_id': req.params.id}
    Post.insertComment(comment)
        .then(com => {
            res.status(201).json(com);
        })
        .catch((error) => {
            console.log(error);
            if(error.errno === 19) {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            } else {
                res.status(500).json({ error: "There was an error while saving the comment to the database" })
            }
            
        })
})

module.exports = router;
