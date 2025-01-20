import * as assert from 'assert';
import * as MarkdownIt from 'markdown-it';
import * as extension from '../extension';
import * as vscode from 'vscode';

const md = extension.markdownItAdmonition(new MarkdownIt());

suite('Extension Test Suite', () => {

    vscode.window.showInformationMessage('Start all tests.');

        const tests = [
        {
            name: 'Admonitions - Danger needs double newlines',
            input: `::::danger\n\nNågot fel\n\n:::info\nVarför tre info???\n:::\n::::`,
            expectedOutput: `<div class="danger"><div class="admonition-title">danger</div><p>Något fel</p>\n<div class="info"><div class="admonition-title">info</div><p>Varför tre info???</p>\n</div>\n</div>\n`
        },
        {
            name: 'Admonitions - Fails in markdown-it-fence but works in markdown-it-container',
            input: `::::danger\nNågot fel\n:::info\nVarför tre info???\n:::\n::::`,
            expectedOutput: `<div class="danger"><div class="admonition-title">danger</div><p>Något fel</p>\n<div class="info"><div class="admonition-title">info</div><p>Varför tre info???</p>\n</div>\n</div>\n`
        },
        {
            name: 'Admonitions - Does Not Exist',
            input: `:::doesnotexist\nABC\n:::`,
            expectedOutput: `<p>:::doesnotexist\nABC\n:::</p>\n`
        },
        {
            name: 'Admonitions - Simple danger',
            input: `:::danger\nABC\n:::`,
            expectedOutput: `<div class="danger"><div class="admonition-title">danger</div><p>ABC</p>\n</div>\n`
        },
        {
            name: 'Admonitions - Custom title',
            input: `:::danger[new title]\nABC\n:::`,
            expectedOutput: `<div class="danger"><div class="admonition-title">new title</div><p>ABC</p>\n</div>\n`
        },
        {
            name: 'Admonitions - MkDocs',
            input: `!!! danger\n    Black\n`,
            expectedOutput: `<div class="admonition danger">\n<p class="admonition-title">Danger</p>\n<p>Black</p>\n</div>\n`
        }
    ];

    for (const t of tests) {
        test(t.name, () => {
            const result = md.render(t.input);
            assert.strictEqual(result, t.expectedOutput);
        });
    }
});
