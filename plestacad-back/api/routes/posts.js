const router = require("express").Router();
const PostService = require("../../services/postService");

const postService = new PostService();

orderList = function (listPost, orderBy) {
  if (orderBy == "desc") {
    console.log("desc");

    listPost.sort(function (a, b) {
      return new Date(b.lastMessageDate) - new Date(a.lastMessageDate);
    });
    return listPost;
  } else if (orderBy == "asc") {
    console.log("asc");
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
router.get("/posts/:id/:orderBy/:numElems/:pageNumber", async (req, res) => {
  try {
    const id = req.params.id;
    const orderBy = req.params.orderBy;
    const numElemsPerPag = parseInt(req.params.numElems);
    const pagNumber = parseInt(req.params.pageNumber);
    //Ordenar la respuesta, devolver el numero de elementos.
    // Cuando se carga, hay que devolver de elementos del paginador.

    //Calcular elementos totales. Dividir entre el número de páginas y mostrar el número de elementos de páginas.

    const listsPosts = await postService.getPostsByWorkId(id);
    console.log(listsPosts);
    const orderedList = orderList(listsPosts, orderBy);
    console.log("ORDER", orderedList);

    const totalElements = orderedList.length;
    var elementsInPage;
    const totalPages = parseInt(totalElements / numElemsPerPag);
    console.log("TOTAL PAGES", totalPages);
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

router.post("/posts/:id", async (req, res) => {
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

module.exports = router;
