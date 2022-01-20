const router = require("express").Router();

router.prototype("/signup", async(req,res) => {
    res.json({
        error: null,
        data: "Sign up"
    })
})

module.exports = router;