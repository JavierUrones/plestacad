const Task = require("../models/Task");
const TaskClassificator = require("../models/TaskClassificator");
const NotificationService = require("../services/notificationService");
const notificationService = new NotificationService();

class TaskService {

    async updateTask(taskDto, userIdResponsible) {
        try {
            const filter = { _id: taskDto._id };
            const update = { title: taskDto.title, description: taskDto.description, start: taskDto.start, end: taskDto.end, taskClassificatorId: taskDto.taskClassificatorId, userAssignedId: taskDto.userAssignedId };
            let task = await Task.findOneAndUpdate(filter, update);
            notificationService.createNewNotification(task.workId, "update-task", userIdResponsible, task.title);

            return task;
        } catch (error) {
            throw error;
        }
    }

    async getTaskClassificatorById(id) {
        try {
            const taskClassificator = await TaskClassificator.findById(id);
            return taskClassificator;
        } catch (error) {
            throw error;
        }
    }

    async getTaskById(id) {
        try {
            const task = await Task.findById(id);
            return task;
        } catch (error) {
            throw error;
        }
    }

    async getTasksByWorkId(idWork) {
        try {
            const tasks = await Task.find({
                'workId': {
                    $in: [
                        mongoose.Types.ObjectId(idWork)
                    ]
                }
            });
            return tasks;
        } catch (error) {
            throw error;
        }
    }

    async getTaskClassificatorsByWorkId(idWork) {
        try {
            const taskClassificators = await TaskClassificator.find({
                'workId': {
                    $in: [
                        mongoose.Types.ObjectId(idWork)
                    ]
                }
            });

            return taskClassificators;
        } catch (error) {
            throw error;
        }
    }

    async getTasksByTaskClassificator(idTaskClassificator) {
        const tasksAssignedTo = await Task.find({
            'taskClassificatorId': {
                $in: [
                    mongoose.Types.ObjectId(idTaskClassificator)
                ]
            }
        });
        return tasksAssignedTo;
    }


    async createTaskClassificator(taskClassificatorDto, workId, userIdResponsible) {
        const newTaskClassificator = new TaskClassificator({
            title: taskClassificatorDto.title,
            order: taskClassificatorDto.order,
            workId: workId
        });
        try {
            const taskClassificatorSave = await newTaskClassificator.save();
            notificationService.createNewNotification(workId, "new-task-classificator", userIdResponsible, newTaskClassificator.title);

            return taskClassificatorSave;
        } catch (error) {
            throw error;
        }
    }

    async createTask(taskDto, workId, userIdResponsible) {
        const newTask = new Task({
            title: taskDto.title,
            description: taskDto.description,
            start: taskDto.start,
            end: taskDto.end,
            userAssignedId: taskDto.userAssignedId,
            taskClassificatorId: taskDto.taskClassificatorId,
            workId: workId
        });

        try {
            const taskSave = await newTask.save();
            notificationService.createNewNotification(workId, "new-task", userIdResponsible, newTask.title);

            return taskSave;
        } catch (error) {
            throw error;
        }
    }

    async updateTaskClassificatorId(idTask, taskClassificatorId, userIdResponsible) {
        try {
            const filter = { _id: idTask };
            const update = { taskClassificatorId: taskClassificatorId };
            let task = await Task.findOneAndUpdate(filter, update);
            notificationService.createNewNotification(task.workId.toString(), "moved-task", userIdResponsible, task.title);

            return task;
        } catch (error) {
            throw error;
        }
    }


    async deleteTaskClassificator(id, workId, userIdResponsible) {
        try {


            var tasks = await this.getTasksByTaskClassificator(id);
            var tc = await this.getTaskClassificatorById(id);
            console.log(id, tasks.length)
            //Se desasocian las tareas clasificadas en este clasificador.
            tasks.forEach((task) => {
                task.taskClassificatorId = null;
            });
            var taskClassificator = await TaskClassificator.deleteOne({ _id: id });
            notificationService.createNewNotification(workId, "delete-task-classificator", userIdResponsible, tc.title);

            return taskClassificator;
        } catch (error) {
            throw error;
        }
    }

    async deleteTask(id, workId, userIdResponsible){
        try {
            var taskToDelete = await this.getTaskById(id);
            var task = await Task.deleteOne({ _id: id })
            notificationService.createNewNotification(workId, "delete-task", userIdResponsible, taskToDelete.title);

            return task;
        } catch (error) {
            throw error;
        }
    }

    async updateTaskClassificator(id, title) {
        try {
            const filter = { _id: id };
            const update = { title: title };
            let taskClassificator = await TaskClassificator.findOneAndUpdate(filter, update);

            return taskClassificator;
        } catch (error) {
            throw error;
        }
    }

    async updateTasksClassificatorsOrders(id, taskClassificatorDeletedId) {
        try {
            const tc = await TaskClassificator.findById(taskClassificatorDeletedId);

            console.log("tc", tc)



            const filter = { order: { $gt: tc.order } };
            const update = { $inc: { order: -1 } };
            let taskClassificator = await TaskClassificator.updateMany(filter, update);
            console.log(taskClassificator.modifiedCount)
            return taskClassificator;
        } catch (error) {
            throw error;
        }
    }



    async updateTasksClassificatorOrder(id, idWork, newOrder) {
        try {
            const tempTc = await TaskClassificator.findById(id);
            const replaceOrder = tempTc.order; //salvaguardamos el orden de la posición que va a ser sustituida.
            console.log("1", replaceOrder)
            console.log("1", newOrder)

            const existingTc = await TaskClassificator.findOneAndUpdate({
                'order': newOrder,
                'workId': {
                    $in: [
                        mongoose.Types.ObjectId(idWork)
                    ]
                }
            }, { order: replaceOrder });
            const movedTc = await TaskClassificator.findByIdAndUpdate(id, { "order": newOrder });

            console.log(existingTc)
            return [movedTc, existingTc];
        } catch (error) {
            throw error;
        }
    }

}



module.exports = TaskService;
