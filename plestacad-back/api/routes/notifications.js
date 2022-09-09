const router = require("express").Router();
const NotificationService = require("../../services/notificationService");

const notificationService = new NotificationService();

const auth = require("../middleware/authMiddleware");

router.get("/notification/receiver/:id", auth, async (req, res) => {
    try {
        const idUser = req.params.id;
        const notificationsByUserId = await notificationService.getNotificationsByUserIdReceiver(idUser);

        res.json({
            data: notificationsByUserId
        })
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
);


router.post("/notification", auth, async (req, res) => {
    const notificationDto = req.body;
    try {
        const notificationSave = await notificationService.createNewNotification(notificationDto);
        res.status(200).send({
            data: notificationSave,
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});


router.post("/notification/markAsRead", auth, async (req, res) => {
    const notificationId = req.body.notificationId;
    const userIdReceiver = req.body.userIdReceiver;
    try{
        const notificationRead = await notificationService.markAsRead(notificationId, userIdReceiver);
        res.status(200).send({
            data: notificationRead,
        });
    }catch (error) {
        return res.status(400).json({ error: error.message });
    }
})


module.exports = router;