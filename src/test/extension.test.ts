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
            expectedOutput: `<div class="danger admonition"><p class="admonition-title">danger</p><p>Något fel</p>\n<div class="info admonition"><p class="admonition-title">info</p><p>Varför tre info???</p>\n</div>\n</div>\n`
        },
        {
            name: 'Admonitions - Fails in markdown-it-fence but works in markdown-it-container',
            input: `::::danger\nNågot fel\n:::info\nVarför tre info???\n:::\n::::`,
            expectedOutput: `<div class="danger admonition"><p class="admonition-title">danger</p><p>Något fel</p>\n<div class="info admonition"><p class="admonition-title">info</p><p>Varför tre info???</p>\n</div>\n</div>\n`
        },
        {
            name: 'Admonitions - Does Not Exist',
            input: `:::doesnotexist\nABC\n:::`,
            expectedOutput: `<p>:::doesnotexist\nABC\n:::</p>\n`
        },
        {
            name: 'Admonitions - Simple danger',
            input: `:::danger\nABC\n:::`,
            expectedOutput: `<div class="danger admonition"><p class="admonition-title">danger</p><p>ABC</p>\n</div>\n`
        },
        {
            name: 'Admonitions - Custom title',
            input: `:::danger[new title]\nABC\n:::`,
            expectedOutput: `<div class="danger admonition"><p class="admonition-title">new title</p><p>ABC</p>\n</div>\n`
        },
        {
            name: 'Admonitions - MkDocs',
            input: `!!! danger\n    Black\n`,
            expectedOutput: `<div class="admonition danger">\n<p class="admonition-title">Danger</p>\n<p>Black</p>\n</div>\n`
        },
        {
            name: 'Admonitions - MkDocs unknown',
            input: `!!! unknown Title\n    Lorem ipsum\n`,
            expectedOutput: `<div class="admonition unknown">\n<p class="admonition-title">Title</p>\n<p>Lorem ipsum</p>\n</div>\n`
        },
        {
            name: 'Admonitions - MkDocs question',
            input: `??? danger\n    Black\n`,
            expectedOutput: `<details class="admonition danger">\n<summary class="admonition-title">Danger</summary>\n<p>Black</p>\n</details>\n`
        },
        {
            name: 'Admonitions - MkDocs unknown question',
            input: `???+ unknown Title\n    Lorem ipsum\n`,
            expectedOutput: `<details class="admonition unknown" open="">\n<summary class="admonition-title">Title</summary>\n<p>Lorem ipsum</p>\n</details>\n`
        }
    ];

    for (const t of tests) {
        test(t.name, () => {
            const result = md.render(t.input);
            assert.strictEqual(result, t.expectedOutput);
        });
    }
});
