const router = require("express").Router();
const Post = require("../../models/Post");
const PostService = require("../../services/postService");



const postService = new PostService();

const auth = require("../middleware/authMiddleware");
const { sendNewNotification } = require('../../utils/socket-io');

orderList = function (listPost, orderBy) {
  if (orderBy == "desc") {

    listPost.sort(function (a, b) {
      return new Date(b.lastMessageDate) - new Date(a.lastMessageDate);
    });
    return listPost;
  } else if (orderBy == "asc") {
    listPost.sort(function (a, b) {
      return new Date(a.lastMessageDate) - new Date(b.lastMessageDate);
    });
    return listPost;
  } else if (orderBy == "favorites") {
    listPost.sort(function (a, b) {
      return Number(b.isFavorite) - Number(a.isFavorite);
    });
    return listPost;
  } else {
    throw new Error("Order value not recognized.");
  }
};


router.get("/posts/length/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const length = await postService.getPostsLengthByWorkId(id);
    res.json({
      data: {
        length,
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
router.get("/posts/:id/:orderBy/:numElems/:pageNumber", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const orderBy = req.params.orderBy;
    const numElemsPerPag = parseInt(req.params.numElems);
    const pagNumber = parseInt(req.params.pageNumber);
    //Ordenar la respuesta, devolver el numero de elementos.
    // Cuando se carga, hay que devolver de elementos del paginador.

    //Calcular elementos totales. Dividir entre el número de páginas y mostrar el número de elementos de páginas.

    const listsPosts = await postService.getPostsByWorkId(id);
    const orderedList = orderList(listsPosts, orderBy);

    const totalElements = orderedList.length;
    var elementsInPage;
    const totalPages = parseInt(totalElements / numElemsPerPag);
    if ((pagNumber > 1 && totalPages == 0) || pagNumber > totalPages + 1) {
      return res.status(400).json({ error: "Error in page request" });
    } else if (numElemsPerPag > totalElements) {
      elementsInPage = orderedList;
    } else {
      const indexElements = (pagNumber - 1) * numElemsPerPag;
      elementsInPage = orderedList.slice(
        indexElements,
        indexElements + numElemsPerPag
      );
    }
    res.json({
      data: {
        elementsInPage,
        numElems: orderedList.length,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post("/posts/:id", auth, async (req, res) => {
  const idWork = req.params.id;
  const postDto = req.body;
  try {
    const postSave = await postService.createPost(postDto, idWork);


    res.status(200).send({
      data: postSave,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});


router.put('/posts/markFavorite', auth, async (req, res) => {
  const postDto = req.body;
  try {
    const postUpdate = await postService.markAsFavorite(postDto);
    res.status(200).send({
      data: postUpdate
    })
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
})


router.get("/posts/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const post = await postService.getPostById(id);
    res.status(200).send({
      data: post
    });

  } catch (error) {
    return res.status(400).json({ error: error.message });

  }
});

router.get("/posts/listInteractions/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const interactionListIds = await postService.getPostById(id);

    var interactions = []
    await interactionListIds.interactions.forEach(async element => {
      var interaction = (postService.getInteractionsById(element._id.toString()));
      interactions.push(interaction)
    });

    Promise.all(interactions).then(values => {
      res.status(200).send({
        values
      });
    });


  } catch (error) {
    return res.status(400).json({ error: error.message });

  }
})

router.get("/posts/interactions/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const interaction = await postService.getInteractionsById(id);
    res.status(200).send({
      interaction
    });

  } catch (error) {
    return res.status(400).json({ error: error.message });

  }
});


router.delete("/posts/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const post = await postService.delete(id);
    res.status(200).send({
      post
    });

  } catch (error) {
    return res.status(400).json({ error: error.message });

  }
})

router.delete("/posts/interaction/:id/:idPost", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const idPost = req.params.idPost;

    const post = await postService.getPostById(idPost);
    var filtered = post.interactions.filter(function (interaction, index, arr) {
      return interaction._id.toString() != id;
    });
    await postService.updateInteractionsPost(idPost, filtered);

    const interaction = await postService.deleteInteraction(id);
    console.log(post.interactions)


    res.status(200).send({
      interaction
    });

  } catch (error) {
    return res.status(400).json({ error: error.message });

  }
})

router.put('/posts/newInteraction/:id', auth, async (req, res) => {

  try {
    const id = req.params.id;
    const interactionDto = req.body.interaction;
    const postUpdate = await postService.newInteraction(id, interactionDto);




    res.status(200).send({
      data: postUpdate
    })
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
})

module.exports = router;
