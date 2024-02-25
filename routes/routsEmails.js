const express = require('express');
const {
    createMail,
    failedMail,
    getDataById,
    rescheduleMail,
    deleteData,
    getAllList
} = require('../controller/service.js');
const router = express.Router();

// Create
router.post('/', createMail);

// Route to list all failed/unsent scheduled emails
router.get('/failed', failedMail);

// Read
router.get('/:id', getDataById);

// Update (Reschedule)
router.put('/:_id/reschedule', rescheduleMail);

// Delete
router.delete('/:id', deleteData);

// List all emails
router.get('/', getAllList);

module.exports = router;