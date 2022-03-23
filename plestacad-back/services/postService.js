const Post = require("../models/Post")

class PostService {
    async getPostsByWorkId(id){
        try{
          const listPosts  = await Post.find({
            'workId': { $in: [
                mongoose.Types.ObjectId(id)
            ]}
          })
          return listPosts;
        } catch(error){
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

