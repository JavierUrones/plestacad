
/** Servicio encargado de gestionar las tareas.
 * @module services/taskService
 */
/**
 * Modelo Task.
 * @type {object}
 * @const
 */
const Task = require("../models/Task");
/**
 * Modelo TaskClassificator.
 * @type {object}
 * @const
 */
const TaskClassificator = require("../models/TaskClassificator");

/**
 * Servicio de notificaciones.
 * @type {object}
 * @const
 */
const notificationService = require("../services/notificationService");

/**
 * Actualiza una tarea
 * @param {Task} taskDto - datos de la tarea a actualizar
 * @param {string} userIdResponsible - id del usuario responsable
 * @returns Retorna la tarea actualizada
 */
async function updateTask(taskDto, userIdResponsible) {
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

/**
 * Obtiene un apartado de clasificación de tareas por su id
 * @param {*} id - id del apartado de clasificación de tareas
 * @returns Retorna el apartado de clasificación de tareas que coincide con el id
 */
async function getTaskClassificatorById(id) {
    try {
        const taskClassificator = await TaskClassificator.findById(id);
        return taskClassificator;
    } catch (error) {
        throw error;
    }
}

/**
 * Obtiene una tarea por su id
 * @param {string} id - id de la tarea
 * @returns Retorna la tarea que coincide con el id
 */
async function getTaskById(id) {
    try {
        const task = await Task.findById(id);
        return task;
    } catch (error) {
        throw error;
    }
}

/**
 * Obtiene la lista de tareas asociadas a un trabajo académico
 * @param {string} idWork - id del trabajo académico
 * @returns Retorna la lista de tareas asociada al trabajo académico especificado en el id
 */
async function getTasksByWorkId(idWork) {
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

/**
 * Obtiene la lista de apartados de clasificación de tareas de un trabajo académico.
 * @param {string} idWork - id del trabajo académico
 * @returns Retorna la lista de apartados de clasificación de tareas del trabajo académico
 */
async function getTaskClassificatorsByWorkId(idWork) {
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

/**
 * Obtiene la lista de tareas clasificadas en un apartado de clasificación de tareas.
 * @param {string} idTaskClassificator - id del apartado de clasificación de tareas
 * @returns Retorna la lista de tareas clasificadas en el apartado especificado
 */
async function getTasksByTaskClassificator(idTaskClassificator) {
    const tasksAssignedTo = await Task.find({
        'taskClassificatorId': {
            $in: [
                mongoose.Types.ObjectId(idTaskClassificator)
            ]
        }
    });
    return tasksAssignedTo;
}

/**
 * Crea un nuevo apartado de clasificación de tareas.
 * @param {TaskClassificator} taskClassificatorDto - datos del apartado de clasificación
 * @param {string} workId - id del trabajo académico
 * @param {string} userIdResponsible - id del usuario responsable
 * @param {boolean} initialClassificator - flag que indica si debe generarse o no una notificación
 * @returns Retorna el nuevo apartado de clasificación creado
 */
async function createTaskClassificator(taskClassificatorDto, workId, userIdResponsible, initialClassificator) {
    const newTaskClassificator = new TaskClassificator({
        title: taskClassificatorDto.title,
        order: taskClassificatorDto.order,
        workId: workId
    });
    try {
        const taskClassificatorSave = await newTaskClassificator.save();
        if (!initialClassificator)
            notificationService.createNewNotification(workId, "new-task-classificator", userIdResponsible, newTaskClassificator.title);

        return taskClassificatorSave;
    } catch (error) {
        throw error;
    }
}

/**
 * Crea una nueva tarea.
 * @param {Task} taskDto - datos de la nueva tarea
 * @param {string} workId - id del trabajo académico
 * @param {string} userIdResponsible - id del usuario responsable
 * @returns Retorna la nueva tarea creada
 */
async function createTask(taskDto, workId, userIdResponsible) {
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

/**
 * Actualiza la clasificación de una tarea.
 * @param {string} idTask - id de la tarea.
 * @param {string} taskClassificatorId - id del apartado de clasificación donde se va a clasificar la tarea..
 * @param {string} userIdResponsible  - id del usuario responsable
 * @returns Retorna la tarea con el apartado de clasificación actualizado
 */
async function updateTaskClassificatorId(idTask, taskClassificatorId, userIdResponsible) {
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

/**
 * Elimina un apartado de clasificación de tareas a partir de su id.
 * @param {string} id - id del apartado de clasificación de tareas
 * @param {string} workId - id del trabajo académico
 * @param {string} userIdResponsible - id del usuario responsable
 * @param {boolean} initial - flag que indica si debe generar o no una notificación
 * @returns Retorna el apartado de clasificación borrado.
 */
async function deleteTaskClassificator(id, workId, userIdResponsible, initial) {
    try {


        var tasks = await this.getTasksByTaskClassificator(id);
        var tc = await this.getTaskClassificatorById(id);
        //Se desasocian las tareas clasificadas en este clasificador.
        tasks.forEach((task) => {
            task.taskClassificatorId = null;
        });
        var taskClassificator = await TaskClassificator.deleteOne({ _id: id });
        if (!initial)
            notificationService.createNewNotification(workId, "delete-task-classificator", userIdResponsible, tc.title);

        return taskClassificator;
    } catch (error) {
        throw error;
    }
}

/**
 * Elimina una tarea a partir de su id.
 * @param {string} id - id de la tarea
 * @param {string} workId - id del trabajo académico
 * @param {string} userIdResponsible - id del usuario responsable
 * @param {boolean} initial - flag que indica si debe generar o no una notificación
 * @returns Retorna la tarea borrada.
 */
async function deleteTask(id, workId, userIdResponsible, initial) {
    try {
        var taskToDelete = await this.getTaskById(id);
        var task = await Task.deleteOne({ _id: id })
        if (!initial)
            notificationService.createNewNotification(workId, "delete-task", userIdResponsible, taskToDelete.title);

        return task;
    } catch (error) {
        throw error;
    }
}

/**
 * Actualiza el título de un apartado de clasificación de tareas.
 * @param {string} id - id del apartado de clasificación
 * @param {string} title - nuevo título del apartado de clasificación.
 * @returns Retorna el apartado de clasificación actualizado.
 */
async function updateTaskClassificator(id, title) {
    try {
        const filter = { _id: id };
        const update = { title: title };
        let taskClassificator = await TaskClassificator.findOneAndUpdate(filter, update);

        return taskClassificator;
    } catch (error) {
        throw error;
    }
}

/**
 * Actualiza el orden de todos los apartados de clasificación de un trabajo académico cuando otro va a ser borrado.
 * @param {*} id - id del trabajo académico.
 * @param {*} taskClassificatorDeletedId - id del clasificador que se va a borrar.
 * @returns Retorna la lista de apartados de clasificación actualizados.
 */
async function updateTasksClassificatorsOrders(id, taskClassificatorDeletedId) {
    try {
        const tc = await TaskClassificator.findById(taskClassificatorDeletedId);
        const filter = {
            'workId': {
                $in: [
                    mongoose.Types.ObjectId(id)
                ]
            }, order: { $gt: tc.order }
        };
        const update = { $inc: { order: -1 } };
        let taskClassificators = await TaskClassificator.updateMany(filter, update);
        return taskClassificators;
    } catch (error) {
        throw error;
    }
}


/**
 * Actualiza el orden (posición) de un apartado de clasificación.
 * @param {*} id - id del apartado de clasificación.
 * @param {*} idWork - id del trabajo académico al que pertenece al apartado de clasificación.
 * @param {number} newOrder - nuevo orden del apartado de clasificación
 * @returns Retorna un array con el apartado de clasificación actualizado y el resto de apartados de clasificación del trabajo académico el nuevo orden..
 */
async function updateTasksClassificatorOrder(id, idWork, newOrder) {
    try {
        const tempTc = await TaskClassificator.findById(id);
        const replaceOrder = tempTc.order; //salvaguardamos el orden de la posición que va a ser sustituida.

        const existingTc = await TaskClassificator.findOneAndUpdate({
            'order': newOrder,
            'workId': {
                $in: [
                    mongoose.Types.ObjectId(idWork)
                ]
            }
        }, { order: replaceOrder });
        const movedTc = await TaskClassificator.findByIdAndUpdate(id, { "order": newOrder });

        return [movedTc, existingTc];
    } catch (error) {
        throw error;
    }
}




module.exports = {
    updateTask, getTaskClassificatorById, getTaskById, getTaskClassificatorsByWorkId, getTasksByTaskClassificator, getTasksByWorkId,
    updateTasksClassificatorOrder, updateTasksClassificatorsOrders, updateTask, updateTaskClassificator, updateTaskClassificatorId,
    deleteTask, deleteTaskClassificator, createTask, createTaskClassificator
};
