const { generateSummary, fixGrammar } = require('./Backend/src/utils/aiService');

async function test() {
    console.log("Testing AI Service...");
    
    const s1 = await generateSummary("", "This is the start of a great story.", "Alice");
    console.log("Test 1 (Initial):", s1);

    const s2 = await generateSummary("This is the start of a great story.", "This is the beginning of a magnificent tale that spans generations and worlds.", "Bob");
    console.log("Test 2 (Minor change):", s2);

    const s3 = await generateSummary("This is the start of a great story.", "Once upon a time, there was a king who lived in a castle in the clouds and loved to eat pancakes every morning.", "Charlie");
    console.log("Test 3 (Restructure):", s3);

    console.log("\nTesting Grammar Correction...");
    const g1 = await fixGrammar("They is going");
    console.log("Grammar 1 (Subject-verb):", g1);

    const g2 = await fixGrammar("i dont know");
    console.log("Grammar 2 (Capitalization/Punctuation):", g2);

    const g3 = await fixGrammar("your welcome for its a good thing");
    console.log("Grammar 3 (Homophones):", g3);
}

test().catch(err => console.error(err));
