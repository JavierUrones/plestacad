/** Servicio encargado de gestionar las notificaciones.
 * @module services/notificationService
 */

/**
 * Modelo Notification.
 * @type {object}
 * @const
 */
const Notification = require("../models/Notification");

/**
 * Work service
 * @type {object}
 * @const
 */
const workService = require("../services/workService");

/**
 * User service
 * @type {object}
 * @const
 */
const userService = require("../services/userService");

/**
 * Socket.io utils
 * @type {object}
 * @const
 */
const { sendNewNotification } = require("../utils/socket-io");


/**
 * Obtener notificación por id.
 * @param {string} id - id de la notificación
 * @returns {Notification} Retorna la notificación.
 */
async function getNotificationById(id) {
    try {
        const notification = await Notification.findById(id);
        return notification;
    } catch (error) {
        throw error;
    }
}
/**
 * Obtener lista de notificaciones por id del trabajo académico.
 * @param {string} id - id del trabajo académico.
 * @returns Retorna la lista de notificaciones asociadas al trabajo académico.
 */
async function getNotificationsByWorkId(id) {
    try {
        const notifications = await Notification.find({
            'workId': id
        });
        return notifications;
    } catch (error) {
        throw error;
    }
}

/**
 * Borra la notificación indicada.
 * @param {string} id - id de la notificación.
 * @returns Retorna la notificación borrada.
 */
async function deleteNotificationById(id) {
    try {
        const notification = await Notification.findByIdAndDelete(id);
        return notification;
    } catch (error) {
        throw error;
    }
}




async function getNotificationsByUserIdReceiver(idUser) {
    try {
        const listNotifications = await Notification.find({
            'usersIdReceivers': {
                $in: [
                    mongoose.Types.ObjectId(idUser)
                ]
            }
        });


        const listNotificationsToReturn = []
        for await (const notification of listNotifications) {
            //extraer titulo del trabajo y nombre del usuario responsable.
            let user = await userService.getUserById(notification.userIdResponsible.toString());
            let work = await workService.getWorkById(notification.workId.toString());
            let userFullnameResponsible = user.name + " " + user.surname;
            let workTitle = work.title;

            listNotificationsToReturn.push({ _id: notification._id, description: notification.description, workId: notification.workId, userIdResponsible: notification.userIdResponsible, usersIdReceivers: notification.usersIdReceivers, date: notification.date, workTitle: workTitle, userFullnameResponsible: userFullnameResponsible, mainContent: notification.mainContent })
        }

        return listNotificationsToReturn;

    } catch (error) {
        throw error;
    }
}


async function createNewNotification(workId, description, userIdResponsible, mainContent) {
    const newNotificationDto = new Notification({
        description: description,
        date: new Date(),
        userIdResponsible: userIdResponsible,
        workId: workId,
        mainContent: mainContent
    });
    try {
        const work = await workService.getWorkById(workId);

        newNotificationDto.usersIdReceivers = work.teachers.concat(work.students); //reciben la notificación los alumnos y profesores del trabajo académico.

        const notificationSave = await newNotificationDto.save();


        for await (const userIdReceiver of newNotificationDto.usersIdReceivers) {
            sendNewNotification(userIdReceiver.toString());
        };


        return notificationSave;
    } catch (error) {
        throw error;
    }
}

async function markAsRead(idNotification, userIdReceiver) {
    try {
        const notification = await this.getNotificationById(idNotification);

        notification.usersIdReceivers = notification.usersIdReceivers.filter(id => id != userIdReceiver);

        if (notification.usersIdReceivers.length == 0) //si ya todos los usuarios han leido la notificacion, se borra del sistema.
            await Notification.findByIdAndDelete(idNotification);
        else {
            // se actualiza la lista de los recibidores, si ya se ha comprobado que quedan usuarios sin leerla.
            await notification.save();
        }
        sendNewNotification(userIdReceiver.toString()); //se manda notificación de que se han actualizado las notificaciones pendientes.
        return notification;
    } catch (error) {
        throw error;
    }
}





module.exports = { getNotificationsByWorkId, getNotificationById, markAsRead, createNewNotification, getNotificationsByUserIdReceiver, deleteNotificationById };
