const Work = require("../models/Work");
const WorkRequest = require("../models/WorkRequest");

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

  async deleteWork(id){
    try{
      let work = await Work.deleteOne({_id: id});
      return work;
    } catch(error){
      throw error;
    }
  }

  async updateWork(workDto) {
    try {
      const filter = { _id: workDto.id };
      const update = {
        title: workDto.title,
        authorId: workDto.authorId,
        teachers: workDto.teachers,
        students: workDto.students,
        category: workDto.category,
        description: workDto.description,
        course: workDto.course,
        classified: workDto.classified
      };

      let work = await Work.findOneAndUpdate(filter, update);

      return work;
    } catch (error) {
      throw error;
    }
  }

  async deleteWorkRequest(id) {
    try {
      var workRequest = await WorkRequest.deleteOne({ _id: id })
      return workRequest;
    } catch (error) {
      throw error;
    }
  }

  async getWorksByStudentId(id) {
    try {
      const listWorks = await Work.find({
        'students': {
          $in: [
            mongoose.Types.ObjectId(id)
          ]
        }
      })
      return listWorks;
    } catch (error) {
      throw error;
    }
  }

  async getWorksByTeacherId(id) {
    try {
      const listWorks = await Work.find({
        'teachers': {
          $in: [
            mongoose.Types.ObjectId(id)
          ]
        }
      })
      return listWorks;
    } catch (error) {
      throw error;
    }
  }



  async getWorksByStudentIdAndCategory(id, category) {
    try {


      const listWorks = await Work.find({
        'category': category,
        'students': {
          $in: [
            mongoose.Types.ObjectId(id)
          ]
        }
      })
      return listWorks;
    } catch (error) {
      throw error;
    }
  }


  async getWorksByTeacherIdAndCategory(id, category) {
    try {

      const listWorks = await Work.find({
        'category': category,
        'teachers': {
          $in: [
            mongoose.Types.ObjectId(id)
          ]
        }
      })
      return listWorks;
    } catch (error) {
      throw error;
    }
  }

  async generateWorkRequest(idWork, userIdReceiver, userIdSender, role) {
    const newWorkRequest = new WorkRequest({
      workId: idWork,
      userIdReceiver: userIdReceiver,
      userIdSender: userIdSender,
      role: role,
      date: new Date()
    });

    try {
      //Se guarda el nuevo trabajo.
      const workRequestSave = await newWorkRequest.save();
      return workRequestSave;
    } catch (error) {
      throw error;
    }
  }

  async getWorkRequestsByUserReceiverId(id) {
    try {

      const listRequests = await WorkRequest.find({
        'userIdReceiver': id
      })
      return listRequests;
    } catch (error) {
      throw error;
    }
  }


  async getWorkRequestsByWorkId(id) {
    try {

      const listRequests = await WorkRequest.find({
        'workId': id
      })
      return listRequests;
    } catch (error) {
      throw error;
    }
  }



  async deleteUserFromWork(workId, userId, type){
    try {

      const work = await Work.findById(workId);
      console.log("work before", work)
      if(type=="student"){
        work.students = work.students.filter((student) => student.toString() != userId.toString())
      }
      if(type=="teacher"){
        work.teachers = work.teachers.filter((teacher) => teacher.toString() != userId.toString())
      }
      console.log("work after", work)

      work.save();
      return work;
    } catch (error) {
      throw error;
    }
  }
}



module.exports = WorkService;
