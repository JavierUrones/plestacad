const Notification = require("../models/Notification");

const WorkService = require("../services/workService");
const workService = new WorkService();
const UserService = require("../services/userService");

const userService = new UserService();
const { sendNewNotification } = require("../utils/socket-io");
class NotificationService {

    async getNotificationById(id){
        try{
            const notification = await Notification.findById(id);
            return notification;
        } catch(error){
            throw error;
        }
    }


    async getNotificationsByUserIdReceiver(idUser) {
        try {
            const listNotifications = await Notification.find({
                'usersIdReceivers': {
                    $in: [
                        mongoose.Types.ObjectId(idUser)
                    ]
                }
            });


            const listNotificationsToReturn = []
            for await (const  notification of listNotifications){
                //extraer titulo del trabajo y nombre del usuario responsable.
                let user = await userService.getUserById(notification.userIdResponsible.toString());
                let work = await workService.getWorkById(notification.workId.toString());
                let userFullnameResponsible = user.name + " " + user.surname;
                let workTitle = work.title;
                
                listNotificationsToReturn.push({_id: notification._id, description: notification.description, workId: notification.workId, userIdResponsible: notification.userIdResponsible, usersIdReceivers: notification.usersIdReceivers, date: notification.date, workTitle: workTitle, userFullnameResponsible: userFullnameResponsible, mainContent: notification.mainContent})
            }

            return listNotificationsToReturn;

        } catch (error) {
            throw error;
        }
    }


    async createNewNotification(workId, description, userIdResponsible, mainContent) {
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

            console.log(newNotificationDto)
            const notificationSave = await newNotificationDto.save();


            for await (const userIdReceiver of newNotificationDto.usersIdReceivers) {
                sendNewNotification(userIdReceiver.toString());
            };
            

            return notificationSave;
        } catch (error) {
            throw error;
        }
    }

    async markAsRead(idNotification, userIdReceiver){
        try{
            const notification = await this.getNotificationById(idNotification);

            console.log("before", notification)
            notification.usersIdReceivers = notification.usersIdReceivers.filter(id => id!=userIdReceiver);
            console.log("after", notification.usersIdReceivers.length)

            if(notification.usersIdReceivers.length == 0) //si ya todos los usuarios han leido la notificacion, se borra del sistema.
                await Notification.findByIdAndDelete(idNotification);
            else{
                // se actualiza la lista de los recibidores, si ya se ha comprobado que quedan usuarios sin leerla.
                await notification.save();
            }
            sendNewNotification(userIdReceiver.toString()); //se manda notificación de que se han actualizado las notificaciones pendientes.
            return notification;
        }catch(error){
            throw error;
        }
    }

}



module.exports = NotificationService;
