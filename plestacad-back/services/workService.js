const Work = require("../models/Work");

class WorkService {


  async getAllWorks() {
    try {
      const listWorks = Work.find({});
      return listWorks;
    } catch (error) {
      throw error;
    }
  }


  async getWorkById(id) {
    try {
      const workById = Work.findById(id)
      return workById;
    } catch (error) {
      throw error;
    }
  }

  async createWork(workDto) {
    const newWork = new Work({
      title: workDto.title,
      authorId: workDto.authorId,
      teachers: workDto.teachers,
      students: workDto.students,
      category: workDto.category,
      description: workDto.description,
      course: workDto.course
    });

    try {
      //Se guarda el nuevo trabajo.
      const workSave = await newWork.save();
      return workSave;
    } catch (error) {
      throw error;
    }
  }
  

  async getWorksByStudentId(id){
    try{
      const listWorks  = await Work.find({
        'students': { $in: [
            mongoose.Types.ObjectId(id)
        ]}
      })
      return listWorks;
    } catch(error){
      throw error;
    }
  }

  async getWorksByTeacherId(id){
    try{
      const listWorks  = await Work.find({
        'teachers': { $in: [
            mongoose.Types.ObjectId(id)
        ]}
      })
      return listWorks;
    } catch(error){
      throw error;
    }
  }



  async getWorksByStudentIdAndCategory(id, category){
    try{
      console.log(category)
      console.log(id)

      const listWorks  = await Work.find({
        'category': category,
        'students': { $in: [
            mongoose.Types.ObjectId(id)
        ]}
      })
      return listWorks;
    } catch(error){
      throw error;
    }
  }


  async getWorksByTeacherIdAndCategory(id, category){
    try{
      console.log(category)
      console.log(id)

      const listWorks  = await Work.find({
        'category': category,
        'teachers': { $in: [
            mongoose.Types.ObjectId(id)
        ]}
      })
      return listWorks;
    } catch(error){
      throw error;
    }
  }

}


module.exports = WorkService;
