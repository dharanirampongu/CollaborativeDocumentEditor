const Document = require('../models/Document');

// @desc    Get all documents for a user
// @route   GET /api/docs
// @access  Private
const getDocuments = async (req, res) => {
    const documents = await Document.find({
        $or: [{ owner: req.user.id }, { collaborators: req.user.id }],
    });
    res.json(documents);
};

// @desc    Get global activity for a user
// @route   GET /api/docs/global-activity
// @access  Private
const getGlobalActivity = async (req, res) => {
    try {
        const documents = await Document.find({
            $or: [{ owner: req.user.id }, { collaborators: req.user.id }],
        });

        const allActivities = documents.reduce((acc, doc) => {
            if (!doc.activities) return acc;
            const activitiesWithDoc = doc.activities.map(a => ({
                ...a.toObject(),
                documentTitle: doc.title,
                documentId: doc._id
            }));
            return [...acc, ...activitiesWithDoc];
        }, []);

        // Sort by timestamp desc
        const sortedActivities = allActivities.sort((a, b) => b.timestamp - a.timestamp);
        
        // Return top 15
        res.json(sortedActivities.slice(0, 15));
    } catch (error) {
        console.error('Error in getGlobalActivity:', error);
        res.status(500).json({ message: 'Error fetching global activity' });
    }
};

// @desc    Get document by ID
// @route   GET /api/docs/:id
// @access  Private
const getDocumentById = async (req, res) => {
    const document = await Document.findById(req.params.id);

    if (document) {
        // Check if user is owner or collaborator
        if (
            document.owner.toString() === req.user.id ||
            document.collaborators.some(c => c._id.toString() === req.user.id)
        ) {
            // Populate collaborators to send back username/email
            await document.populate('collaborators', 'username email');
            res.json(document);
        } else {
            res.status(403);
            throw new Error('Not authorized to view this document');
        }
    } else {
        res.status(404);
        throw new Error('Document not found');
    }
};

// @desc    Create new document
// @route   POST /api/docs
// @access  Private
const createDocument = async (req, res) => {
    const { title, content } = req.body;

    if (!title) {
        res.status(400);
        throw new Error('Please add a title');
    }

    const document = await Document.create({
        title,
        content: content || '',
        owner: req.user.id,
    });

    res.status(201).json(document);
};

// @desc    Update document
// @route   PUT /api/docs/:id
// @access  Private
const updateDocument = async (req, res) => {
    const document = await Document.findById(req.params.id);

    if (document) {
        // Check if user is owner or collaborator
        if (
            document.owner.toString() === req.user.id ||
            document.collaborators.includes(req.user.id)
        ) {
            document.title = req.body.title || document.title;
            document.content = req.body.content || document.content;

            const updatedDocument = await document.save();
            res.json(updatedDocument);
        } else {
            res.status(403);
            throw new Error('Not authorized to update this document');
        }
    } else {
        res.status(404);
        throw new Error('Document not found');
    }
};

// @desc    Delete document
// @route   DELETE /api/docs/:id
// @access  Private
const deleteDocument = async (req, res) => {
    const document = await Document.findById(req.params.id);

    if (document) {
        // Only owner can delete
        if (document.owner.toString() === req.user.id) {
            await document.deleteOne();
            res.json({ message: 'Document removed' });
        } else {
            res.status(403);
            throw new Error('Not authorized to delete this document');
        }
    } else {
        res.status(404);
        throw new Error('Document not found');
    }
};

// @desc    Add collaborator to document
// @route   POST /api/docs/:id/collaborators
// @access  Private
const addCollaborator = async (req, res) => {
    const document = await Document.findById(req.params.id);
    const { userId } = req.body;

    if (!document) {
        res.status(404);
        throw new Error('Document not found');
    }

    // Only owner can add collaborators
    if (document.owner.toString() !== req.user.id) {
        res.status(403);
        throw new Error('Only the owner can add collaborators');
    }

    if (document.collaborators.includes(userId)) {
        res.status(400);
        throw new Error('User is already a collaborator');
    }

    if (document.owner.toString() === userId) {
        res.status(400);
        throw new Error('Owner cannot be added as a collaborator');
    }

    document.collaborators.push(userId);
    await document.save();
    
    // Return populated collaborators
    await document.populate('collaborators', 'username email');
    res.json(document.collaborators);
};

// @desc    Remove collaborator from document
// @route   DELETE /api/docs/:id/collaborators/:userId
// @access  Private
const removeCollaborator = async (req, res) => {
    const document = await Document.findById(req.params.id);
    const { userId } = req.params;

    if (!document) {
        res.status(404);
        throw new Error('Document not found');
    }

    // Only owner can remove collaborators
    if (document.owner.toString() !== req.user.id) {
        res.status(403);
        throw new Error('Only the owner can remove collaborators');
    }

    document.collaborators = document.collaborators.filter(
        (c) => c.toString() !== userId
    );
    await document.save();

    // Return populated collaborators
    await document.populate('collaborators', 'username email');
    res.json(document.collaborators);
};

module.exports = {
    getDocuments,
    getDocumentById,
    createDocument,
    updateDocument,
    deleteDocument,
    addCollaborator,
    removeCollaborator,
    getGlobalActivity,
};
