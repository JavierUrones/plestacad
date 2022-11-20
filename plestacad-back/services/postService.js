/** Servicio encargado de gestionar las notificaciones.
 * @module services/postService
 */
/**
 * Modelo Post.
 * @type {object}
 * @const
 */
const Post = require("../models/Post");
/**
 * Modelo PostInteraction.
 * @type {object}
 * @const
 */
const PostInteraction = require("../models/PostInteraction");
/**
 * Servicio de notificaciones.
 * @type {object}
 * @const
 */
const notificationService = require("./notificationService");

/**
 * Borra un post.
 * @param {string} id - id del post.
 * @returns {Post} Retorna el post borrado.
 */
async function deletePost(id) {
  try {
    var post = await this.getPostById(id);
    await post.interactions.forEach(async (interaction) => {
      await this.deleteInteraction(interaction._id.toString())
    })
    var post = await Post.deleteOne({ _id: id })
    return post;
  } catch (error) {
    throw error;
  }
}

/**
 * Borra una respuesta a un post.
 * @param {string} id - id  de la respuesta.
 * @returns {PostInteraction} Retorna la respuesta borrada..
 */
async function deleteInteraction(id) {
  try {
    var interaction = await PostInteraction.deleteOne({ _id: id })
    return interaction;
  } catch (error) {
    throw error;
  }
}
/**
 * Obtiene una respuesta por su id.
 * @param {string} id - id  de la respuesta.
 * @returns {PostInteraction} Retorna la respuesta asociada al id.
 */
async function getInteractionsById(id) {
  try {
    const interaction = PostInteraction.findById(id);

    return interaction;
  } catch (error) {
    throw error;
  }
}

/**
 * Crea una nueva respuesta.
 * @param {string} id - id del post.
 * @param {PostInteraction} interaction - datos de la interacción a crear..
 * @returns {PostInteraction} Retorna la respuesta asociada al id.
 */
async function newInteraction(id, interaction) {
  try {

    const interactionDto = new PostInteraction({
      message: interaction.message,
      date: interaction.date,
      authorId: interaction.authorId,
      authorFullName: interaction.authorFullName
    });

    const postInteractionSave = await interactionDto.save()

    const post = await Post.findById(id).then(post => {
      post.interactions.push(postInteractionSave)
      post.save();
      notificationService.createNewNotification(post.workId, "new-interaction", interactionDto.authorId, post.title);

    });

    return post;

  } catch (error) {
    throw error;
  }
}

/**
 * Obtiene el post por id.
 * @param {string} id - id del post.
 * @returns {Post} Retorna el post asociado al id.
 */
async function getPostById(id) {
  try {
    const post = await Post.findById(id);
    return post;
  } catch (error) {
    throw error;
  }
}
/**
 * Marca como favorito un post.
 * @param {Post} postDto - datos del post.
 * @returns {Post} Retorna el post marcado como favorito.
 */
async function markAsFavorite(postDto) {
  try {
    const filter = { _id: postDto.id };
    const update = { isFavorite: postDto.isFavorite };
    let post = await Post.findOneAndUpdate(filter, update);

    return post;
  } catch (error) {
    throw error;
  }
}

/**
 * Actualiza las respuestas de un post.
 * @param {string} id - id del post.
 * @param {PostInteraction[]} interactions - lista de las respuestas a actualizar.
 * @returns {Post} Retorna el post actualizado.
 */
async function updateInteractionsPost(id, interactions) {
  try {
    const filter = { _id: id };
    const update = { interactions: interactions };
    let post = await Post.findOneAndUpdate(filter, update);

    return post;
  } catch (error) {
    throw error;
  }
}

/**
 * Obtiene el número de posts publicados en un trabajo académico.
 * @param {string} id - id del trabajo académico.
 * @returns Retorna el número de posts de un trabajo académico..
 */
async function getPostsLengthByWorkId(id) {
  try {
    const listsPost = await Post.find({
      'workId': {
        $in: [
          mongoose.Types.ObjectId(id)
        ]
      }
    });
    return listsPost.length;
  } catch (error) {
    throw error;
  }
}

/**
 * Obtiene la lista de posts por id del trabajo académico.
 * @param {string} id - id del trabajo académico.
 * @returns {Post[]} Retorna la lista de posts del trabajo académico.
 */
async function getPostsByWorkId(id) {
  try {
    const listPosts = await Post.find({
      'workId': {
        $in: [
          mongoose.Types.ObjectId(id)
        ]
      }
    })
    return listPosts;
  } catch (error) {
    throw error;
  }
}

/**
 * Crea un nuevo post en un trabajo académico.
 * @param {Post} postDto - datos del post a crear.
 * @param {string} id - id del trabajo académico.
 * @returns {Post} Retorna el post creado.
 */
async function createPost(postDto, workId) {
  const newPost = new Post({
    title: postDto.title,
    message: postDto.message,
    authorId: postDto.authorId,
    workId: workId,
    creationDate: postDto.creationDate,
    lastMessageDate: postDto.creationDate,
    isFavorite: postDto.isFavorite,
    interactions: []
  });
  try {
    //Se guarda el nuevo post.
    const postSave = await newPost.save();
    //se crea la notificación respectiva.
    await notificationService.createNewNotification(workId, "new-post", newPost.authorId, newPost.title);

    return postSave;
  } catch (error) {
    throw error;
  }
}

module.exports = { getInteractionsById, deleteInteraction, getPostById, newInteraction, markAsFavorite, getPostsByWorkId, getPostsLengthByWorkId, updateInteractionsPost, deletePost, createPost, };

