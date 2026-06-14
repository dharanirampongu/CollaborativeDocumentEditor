/**
 * AI Service for generating contextual summaries of document edits.
 */

const generateSummary = async (oldContent, newContent, username) => {
    // In a production environment, this would call an LLM API (e.g., OpenAI, Gemini).
    // For this implementation, we simulate the logic by comparing the text.
    
    if (!oldContent) {
        return `${username} started the document.`;
    }

    const oldLen = oldContent.length;
    const newLen = newContent.length;
    const diff = newLen - oldLen;

    // Simple heuristic-based summary generation
    if (Math.abs(diff) > 200) {
        return `${username} made significant structural changes to the document.`;
    }

    if (diff > 0) {
        // Find which part was added (very simplified)
        if (newLen > 50 && !oldContent.includes(newContent.substring(0, 20))) {
             return `${username} restructured the introduction for better flow.`;
        }
        return `${username} added new details and expanded on existing points.`;
    } else if (diff < 0) {
        return `${username} refined the content by removing redundant information.`;
    } else {
        return `${username} edited the document for clarity and style.`;
    }
};

const fixGrammar = async (text) => {
    // Simulated AI grammar correction
    const corrections = {
        "They is": "They are",
        "i": "I",
        "dont": "don't",
        "their going": "they're going",
        "you was": "you were",
        "your welcome": "you're welcome",
        "its a": "it's a",
        "we was": "we were",
    };

    let suggestion = text;
    let foundMatch = false;

    // Check for common errors in the target text
    for (const [error, fix] of Object.entries(corrections)) {
        const regex = new RegExp(`\\b${error}\\b`, 'gi');
        if (regex.test(suggestion)) {
            suggestion = suggestion.replace(regex, fix);
            foundMatch = true;
        }
    }

    if (!foundMatch && text.length > 0) {
        // Fallback for demo purposes if no specific error matched
        suggestion = text.charAt(0).toUpperCase() + text.slice(1);
        if (!suggestion.endsWith('.') && !suggestion.endsWith('?') && !suggestion.endsWith('!')) {
            suggestion += '.';
        }
    }

    return suggestion;
};

module.exports = { generateSummary, fixGrammar };
