const express = require('express');
const router = express.Router();
const {
    getDocuments,
    getDocumentById,
    createDocument,
    updateDocument,
    deleteDocument,
    addCollaborator,
    removeCollaborator,
    getGlobalActivity,
} = require('../controllers/docController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/global-activity', getGlobalActivity);
router.route('/').get(getDocuments).post(createDocument);
router.route('/:id').get(protect, getDocumentById).put(protect, updateDocument).delete(protect, deleteDocument);

router.post('/:id/collaborators', protect, addCollaborator);
router.delete('/:id/collaborators/:userId', protect, removeCollaborator);

module.exports = router;
