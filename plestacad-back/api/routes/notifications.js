/** Router express que define las rutas relacionadas con las notificaciones del sistema.
 * @module routes/notifications
 * @requires express
 */
/**
 * Router express.
 * @type {object}
 * @const
 */
const router = require("express").Router();
/**
 * Servicio de notificaciones.
 * @type {object}
 * @const
 */
const notificationService = require("../../services/notificationService");

/**
 * Middleware para comprobar la autenticación de usuarios.
 * @type {object}
 * @const
 */
const auth = require("../middleware/authMiddleware");

/**
 * @name get/notification/receiver/:id/
 * @function
 * @memberof module:routes/notifications
 * @param {string} path - express path
 * @param {callback} middleware - express middleware.
 */
router.get("/notification/receiver/:id", auth, async (req, res) => {
    try {
        const idUser = req.params.id;
        const notificationsByUserId = await notificationService.getNotificationsByUserIdReceiver(idUser);

        res.json({
            data: notificationsByUserId
        })
    }
    catch (error) {
        console.log("ERROR" , error)
        return res.status(500).json({ error: error.message });
    }
}
);

/**
 * @name post/notification/
 * @function
 * @memberof module:routes/notifications
 * @param {string} path - express path
 * @param {callback} middleware - express middleware.
 */
router.post("/notification", auth, async (req, res) => {
    const notificationDto = req.body;
    try {
        const notificationSave = await notificationService.createNewNotification(notificationDto);
        res.status(200).send({
            data: notificationSave,
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

/**
 * @name post/notification/markAsRead
 * @function
 * @memberof module:routes/notifications
 * @param {string} path - express path
 * @param {callback} middleware - express middleware.
 */
router.post("/notification/markAsRead", auth, async (req, res) => {
    const notificationId = req.body.notificationId;
    const userIdReceiver = req.body.userIdReceiver;
    try{
        let notification = await notificationService.getNotificationById(notificationId);
        if(!notification.usersIdReceivers.includes(userIdReceiver))
            return res.status(403).send("User not allowed to mark as read notification");
        const notificationRead = await notificationService.markAsRead(notificationId, userIdReceiver);
        res.status(200).send({
            data: notificationRead,
        });
    }catch (error) {
        console.log("error not", error.message)

        return res.status(500).json({ error: error.message });
    }
})


module.exports = router;