const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, '../src/pages');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;

    // 1. Find all modal states used in this file
    const states = [];
    const stateRegex = /const\s+\[(is[A-Za-z]+ModalOpen)/g;
    let match;
    while ((match = stateRegex.exec(content)) !== null) {
        if (!states.includes(match[1])) {
            states.push(match[1]);
        }
    }

    if (states.length === 0) return false;

    // 2. Hide main table if any modal is open
    const mainCardStartRegex = /(return\s*\(\s*<div[^>]*>\s*)({\/\*\s*Main Card\s*\*\/}\s*)?(<div className="bg-white rounded-2xl shadow-\[0_4px_20px_rgb\(0,0,0,0\.03\)\] mb-6 overflow-hidden">)/;
    
    if (mainCardStartRegex.test(content) && !content.includes(`{!${states[0]}`)) {
        const cond = states.map(s => `!${s}`).join(' && ');
        content = content.replace(mainCardStartRegex, `$1$2{${cond} && (\n      $3`);
        
        // Find the first modal condition to close the main card wrapper before it
        const firstModalRegex = /(\s*)({\/\*\s*.*Modal.*\s*\*\/}\s*)?({is[A-Za-z]+ModalOpen\s*&&)/;
        content = content.replace(firstModalRegex, `$1)}\n$1$2$3`);
    }

    // 3. Replace the modal wrappers safely using capturing groups
    // This captures the entire content of the inner card so we don't mess up </div> tags.
    const modalRegex = /<div className="fixed inset-0 z-50[^>]*>\s*<div className="bg-white rounded-xl shadow-2xl w-full max-w-[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*\)\}/g;
    
    let replacementCount = 0;
    content = content.replace(modalRegex, (match, innerContent) => {
        replacementCount++;
        return `<div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] w-full flex flex-col mb-6 overflow-hidden">${innerContent}</div>\n      )}`;
    });

    if (replacementCount > 0) {
        // Fix headers
        content = content.replace(/className="relative p-5 border-b border-gray-200 bg-white rounded-t-xl shrink-0[^"]*"/g, 
            `className="relative p-5 border-b border-gray-100 flex justify-between items-center bg-white"`);
        
        // Fix close buttons
        content = content.replace(/className="absolute right-4 top-1\/2 -translate-y-1\/2 (text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors)"/g, 
            `className="$1"`);
            
        // Fix footers
        content = content.replace(/className="p-4 border-t border-gray-100 bg-gray-50\/50 rounded-b-xl flex justify-end/g, 
            `className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-end`);
    }

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        return true;
    }
    return false;
}

const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));
let changedCount = 0;
for (const file of files) {
    const filePath = path.join(pagesDir, file);
    if (processFile(filePath)) {
        console.log(`Updated ${file}`);
        changedCount++;
    }
}
console.log(`Total files updated: ${changedCount}`);
