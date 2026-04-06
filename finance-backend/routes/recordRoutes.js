const router = require("express").Router();
const auth = require("../middleware/auth");
const role = require("../middleware/role");
const {
    createRecord,
    getRecords,
    updateRecord,
    deleteRecord
} = require("../controllers/recordController");

router.post("/", auth, role("admin", "analyst"), createRecord);
router.get("/", auth, getRecords);
router.put("/:id", auth, role("admin", "analyst"), updateRecord);
router.delete("/:id", auth, role("admin", "analyst"), deleteRecord);

module.exports = router;