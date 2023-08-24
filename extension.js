const vscode = require('vscode');
const axios = require('axios');

const API_URL = "https://api-inference.huggingface.co/models/stabilityai/stablecode-instruct-alpha-3b";
const API_TOKEN = "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";

function activate(context) {
    console.log('Congratulations, your extension "stablecodeAutocomplete" is now active!');

   
let disposable = vscode.commands.registerCommand('stablecodeAutocomplete.autocomplete', async () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const currentLine = editor.document.lineAt(editor.selection.active.line).text.trim();

        // Send the current line to the API
        try {
            const response = await axios.post(API_URL, {
                inputs: currentLine
            }, {
                headers: {
                    Authorization: `Bearer ${API_TOKEN}`
                }
            });

            const generatedText = response.data[0].generated_text;

            // Insert the autocompleted code into the editor
            editor.edit(editBuilder => {
                const position = editor.selection.active;
                const insertPosition = position.with(position.line + 1, 0); // Insert after the current line
                editBuilder.insert(insertPosition, generatedText);
            });
        } catch (error) {
            console.error('API request error:', error);
        }
    }
});

    context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
