const Post = require("../models/Post");
const PostInteraction = require("../models/PostInteraction");

class PostService {


  async getInteractionsById(id){
    try {
      const interaction = PostInteraction.findById(id);

      return interaction;
    } catch (error) {
      throw error;
    }
  }

  async newInteraction(id, interaction) {
    try {
      console.log("ID", id)
      const interactionDto = new PostInteraction({
        message: interaction.message,
        date: interaction.date,
        authorId: interaction.authorId,
        authorFullName: interaction.authorFullName
      });

      console.log("interaction", interaction)
      const postInteractionSave = await interactionDto.save()

      await Post.findById(id).then(post => {
        console.log("POSTPOSTPOST", post)
        post.interactions.push(postInteractionSave)
        console.log("POSH", post)
        post.save();
      });
      return postInteractionSave;

    } catch (error) {
      throw error;
    }
  }
  async getPostById(id) {
    try {
      const post = Post.findById(id);

      return post;
    } catch (error) {
      throw error;
    }
  }
  async markAsFavorite(postDto) {
    try {
      console.log("POSTDTO", postDto)
      const filter = { _id: postDto.id };
      const update = { isFavorite: postDto.isFavorite };
      let post = await Post.findOneAndUpdate(filter, update);

      return post;
    } catch (error) {
      throw error;
    }
  }

  async getPostsLengthByWorkId(id) {
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
  async getPostsByWorkId(id) {
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

  async createPost(postDto, workId) {
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
      //Se guarda el nuevo trabajo.
      const postSave = await newPost.save();
      return postSave;
    } catch (error) {
      throw error;
    }
  }


}

module.exports = PostService;

