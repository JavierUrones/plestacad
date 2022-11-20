/** Router express que define las rutas relacionadas con el foro de un trabajo académico.
 * @module routes/posts
 * @requires express
 */
/**
 * Router express.
 * @type {object}
 * @const
 */
const router = require("express").Router();

/**
 * Servicio del foro.
 * @type {object}
 * @const
 */
const postService = require("../../services/postService");
/**
 * Middleware para comprobar la autenticación de usuarios.
 * @type {object}
 * @const
 */
const auth = require("../middleware/authMiddleware");

/**
 * Token utils
 * @type {object}
 * @const
 */
const { checkUserInWork, getUserIdFromTokenRequest, checkIsTeacherInWork, checkIsAdmin } = require("../../utils/token")

/**
 * Ordena la lista de posts indicada dado el parámetro orderBy.
 * @param {Post[]} listPosts - lista de los posts a ordenar.
 * @param {string} orderBy - método de ordenación de la lista: "desc", "asc" o "favorites".
 * @returns {Post[]} - Retorna la lista de los posts ordenada.
 */
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

/**
 * @name get/posts/length/:id
 * @function
 * @memberof module:routes/posts
 * @param {string} path - express path
 * @param {callback} middleware - express middleware.
 */
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

/**
 * @name get/posts/:id/:orderBy/:numElems/:pageNumber
 * @function
 * @memberof module:routes/posts
 * @param {string} path - express path
 * @param {callback} middleware - express middleware.
 */
router.get("/posts/:id/:orderBy/:numElems/:pageNumber", auth, async (req, res) => {
  try {
    const id = req.params.id;
    let reqUserId = getUserIdFromTokenRequest(req);
    let userInWork = await checkUserInWork(id, reqUserId);
    if (!userInWork && !await checkIsAdmin(reqUserId)) {
      return res.status(403).send("Access denied");
    }
    const orderBy = req.params.orderBy;
    const numElemsPerPag = parseInt(req.params.numElems);
    const pagNumber = parseInt(req.params.pageNumber);
    //Ordenar la respuesta, devolver el numero de elementos.
    //Cuando se carga, hay que devolver de elementos del paginador.
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

/**
 * @name post/posts/:id
 * @function
 * @memberof module:routes/posts
 * @param {string} path - express path
 * @param {callback} middleware - express middleware.
 */
router.post("/posts/:id", auth, async (req, res) => {
  const idWork = req.params.id;
  const postDto = req.body;
  try {

    let reqUserId = getUserIdFromTokenRequest(req);
    let userInWork = await checkUserInWork(idWork, reqUserId);
    if (!userInWork && !await checkIsAdmin(reqUserId)) {
      return res.status(403).send("Access denied");
    }
    if(postDto.message.trim().length == 0 || postDto.title.trim().length == 0)
      return res.status(400).json({ error: "Title or message not valid."})
    const postSave = await postService.createPost(postDto, idWork);


    res.status(200).send({
      data: postSave,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * @name put/posts/:id/markFavorite
 * @function
 * @memberof module:routes/posts
 * @param {string} path - express path
 * @param {callback} middleware - express middleware.
 */
router.put('/posts/markFavorite', auth, async (req, res) => {
  const postDto = req.body;
  try {
    let postToDelete = await postService.getPostById(postDto.id);

    let reqUserId = getUserIdFromTokenRequest(req);
    let userInWork = await checkUserInWork(postToDelete.workId.toString(), reqUserId);
    if (!userInWork && !await checkIsAdmin(reqUserId)) {
      return res.status(403).send("Access denied");
    }
    const postUpdate = await postService.markAsFavorite(postDto);
    res.status(200).send({
      data: postUpdate
    })
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
})

/**
 * @name get/posts/:id
 * @function
 * @memberof module:routes/posts
 * @param {string} path - express path
 * @param {callback} middleware - express middleware.
 */
router.get("/posts/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const post = await postService.getPostById(id);
    res.status(200).send({
      data: post
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });

  }
});

/**
 * @name get/posts/listInteractions/:id
 * @function
 * @memberof module:routes/posts
 * @param {string} path - express path
 * @param {callback} middleware - express middleware.
 */
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
    return res.status(500).json({ error: error.message });

  }
})

/**
 * @name get/posts/interactions/:id
 * @function
 * @memberof module:routes/posts
 * @param {string} path - express path
 * @param {callback} middleware - express middleware.
 */
router.get("/posts/interactions/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const interaction = await postService.getInteractionsById(id);
    res.status(200).send({
      interaction
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });

  }
});

/**
 * @name delete/posts/:id
 * @function
 * @memberof module:routes/posts
 * @param {string} path - express path
 * @param {callback} middleware - express middleware.
 */
router.delete("/posts/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    let postToDelete = await postService.getPostById(id);
    let reqUserId = getUserIdFromTokenRequest(req);
    let userInWork = await checkUserInWork(postToDelete.workId.toString(), reqUserId);
    if (!userInWork && !await checkIsAdmin(reqUserId)) {
      return res.status(403).send("Access denied");
    }
    let checkIsTeacher = await checkIsTeacherInWork(postToDelete.workId.toString(), reqUserId);
    if((!checkIsTeacher && postToDelete.authorId != reqUserId) && !await checkIsAdmin(reqUserId)){ // si es estudiante y no es el creador del tema, no puede borrarlo.
      return res.status(403).send("Access denied");
    }
    const post = await postService.deletePost(id);
    res.status(200).send({
      post
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });

  }
})

/**
 * @name delete/posts/interaction/:id/:idPost
 * @function
 * @memberof module:routes/posts
 * @param {string} path - express path
 * @param {callback} middleware - express middleware.
 */
router.delete("/posts/interaction/:id/:idPost", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const idPost = req.params.idPost;

    const post = await postService.getPostById(idPost);
    let reqUserId = getUserIdFromTokenRequest(req);
    let userInWork = await checkUserInWork(post.workId.toString(), reqUserId);
    if (!userInWork && !await checkIsAdmin(reqUserId)) {
      return res.status(403).send("Access denied");
    }
    let checkIsTeacher = await checkIsTeacherInWork(post.workId.toString(), reqUserId);
    const interactionToDelete = await postService.getInteractionsById(id);
    if((!checkIsTeacher && interactionToDelete.authorId.toString() != reqUserId) && !await checkIsAdmin(reqUserId)){ // si es estudiante y no es el creador de la interacción, no puede borrarla.
      return res.status(403).send("Access denied");
    }

    var filtered = post.interactions.filter(function (interaction, index, arr) {
      return interaction._id.toString() != id;
    });
    await postService.updateInteractionsPost(idPost, filtered);

    const interaction = await postService.deleteInteraction(id);


    res.status(200).send({
      interaction
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });

  }
})

/**
 * @name put/posts/newInteraction/:id
 * @function
 * @memberof module:routes/posts
 * @param {string} path - express path
 * @param {callback} middleware - express middleware.
 */
router.put('/posts/newInteraction/:id', auth, async (req, res) => {

  try {


    const id = req.params.id;
    const interactionDto = req.body.interaction;

    let postToInteract = await postService.getPostById(id);
    let reqUserId = getUserIdFromTokenRequest(req);
    let userInWork = await checkUserInWork(postToInteract.workId.toString(), reqUserId);
    if (!userInWork && !await checkIsAdmin(reqUserId)) {
      return res.status(403).send("Access denied");
    }

    if(interactionDto.message.trim().length == 0)
      return res.status(400).json({ error: "Interaction message not valid." });
    const postUpdate = await postService.newInteraction(id, interactionDto);




    res.status(200).send({
      data: postUpdate
    })
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
})

module.exports = router;
