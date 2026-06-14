const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please add a title'],
            trim: true,
            maxlength: [100, 'Title cannot be more than 100 characters'],
        },
        content: {
            type: String,
            default: '',
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        collaborators: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        polls: [
            {
                question: { type: String, required: true },
                context: { type: String, required: true }, // The text being replaced
                options: [
                    {
                        text: { type: String, required: true },
                        votes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
                    }
                ],
                status: { type: String, enum: ['open', 'resolved'], default: 'open' },
                winner: { type: Number }, // Index of the winning option
                createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                createdAt: { type: Date, default: Date.now }
            }
        ],
        activities: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                text: { type: String, required: true },
                type: { type: String, default: 'edit' },
                timestamp: { type: Date, default: Date.now }
            }
        ],
        lastSummaryContent: {
            type: String,
            default: ''
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Document', documentSchema);
