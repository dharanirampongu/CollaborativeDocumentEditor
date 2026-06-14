const Document = require('./models/Document');
const User = require('./models/User');
const { generateSummary, fixGrammar } = require('./utils/aiService');

const socketHandler = (io) => {
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        socket.on('join-document', async (documentId) => {
            socket.join(documentId);
            console.log(`User ${socket.id} joined document: ${documentId}`);
        });

        socket.on('send-changes', (delta) => {
            // delta should contain { documentId, content }
            socket.to(delta.documentId).emit('receive-changes', delta.content);
        });

        socket.on('save-document', async (data) => {
            const { documentId, content, userId } = data;
            const effectiveUserId = userId || '000000000000000000000000';
            try {
                const doc = await Document.findById(documentId);
                if (!doc) return;

                const oldContent = doc.content;
                doc.content = content;

                // AI Summarization Logic
                const lastSummaryContent = doc.lastSummaryContent || '';
                const charDiff = Math.abs(content.length - lastSummaryContent.length);

                if (charDiff > 100 || (!doc.lastSummaryContent && content.length > 0)) {
                    let username = 'Guest';
                    if (userId && userId !== '000000000000000000000000') {
                        const user = await User.findById(userId);
                        if (user) username = user.username;
                    }
                    
                    const summaryText = await generateSummary(lastSummaryContent, content, username);
                    
                    const newActivity = {
                        user: effectiveUserId,
                        text: summaryText,
                        type: 'edit',
                        timestamp: new Date()
                    };
                    
                    doc.activities.push(newActivity);
                    doc.lastSummaryContent = content;
                    
                    // Broadcast the new activity
                    io.to(documentId).emit('activity-updated', newActivity);
                }

                await doc.save();
                console.log(`Document ${documentId} saved (Size diff: ${charDiff})`);
            } catch (error) {
                console.error('Error saving document:', error);
            }
        });

        // --- Decision Polls Events ---
        
        socket.on('create-poll', async (data) => {
            const { documentId, poll } = data;
            try {
                const doc = await Document.findById(documentId);
                if (doc) {
                    doc.polls.push(poll);
                    await doc.save();
                    // Broadcast to everyone in the document including sender to confirm index
                    io.to(documentId).emit('poll-created', doc.polls[doc.polls.length - 1]);
                }
            } catch (error) {
                console.error('Error creating poll:', error);
            }
        });

        socket.on('vote-poll', async (data) => {
            const { documentId, pollId, optionIndex, userId } = data;
            try {
                const doc = await Document.findById(documentId);
                if (doc) {
                    const poll = doc.polls.id(pollId);
                    if (poll && poll.status === 'open') {
                        // Remove existing vote from this user in this poll if any
                        poll.options.forEach(opt => {
                            opt.votes = opt.votes.filter(id => id.toString() !== userId);
                        });
                        // Add new vote
                        poll.options[optionIndex].votes.push(userId);
                        await doc.save();
                        io.to(documentId).emit('poll-updated', poll);
                    }
                }
            } catch (error) {
                console.error('Error voting on poll:', error);
            }
        });

        socket.on('resolve-poll', async (data) => {
            const { documentId, pollId, winnerIndex } = data;
            try {
                const doc = await Document.findById(documentId);
                if (doc) {
                    const poll = doc.polls.id(pollId);
                    if (poll && poll.status === 'open') {
                        const winnerText = poll.options[winnerIndex].text;
                        
                        // 1. Update document content (replace context with winnerText)
                        // This is a simple string replacement for now
                        doc.content = doc.content.replace(poll.context, winnerText);
                        
                        // 2. Close poll
                        poll.status = 'resolved';
                        poll.winner = winnerIndex;
                        
                        await doc.save();
                        
                        // 3. Broadcast changes
                        io.to(documentId).emit('receive-changes', doc.content);
                        io.to(documentId).emit('poll-resolved', poll);
                    }
                }
            } catch (error) {
                console.error('Error resolving poll:', error);
            }
        });

        socket.on('fix-grammar', async (data) => {
            const { text } = data;
            try {
                const suggestion = await fixGrammar(text);
                socket.emit('grammar-fixed', { original: text, suggestion });
            } catch (error) {
                console.error('Error fixing grammar:', error);
            }
        });

        socket.on('cursor-move', (data) => {
            const { documentId, cursorData } = data;
            // Broadcast to everyone else in the document
            socket.to(documentId).emit('cursor-update', {
                userId: socket.id, // Using socket.id as a transient presence ID
                ...cursorData
            });
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
            // Notify others to clear this cursor
            io.emit('user-left', socket.id);
        });
    });
};

module.exports = socketHandler;
