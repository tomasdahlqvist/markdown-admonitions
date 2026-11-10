import assert from 'assert';
import MarkdownIt, { type MarkdownIt as MarkdownItParser } from 'markdown-it';
import { markdownItAdmonition } from '../extension';
import * as vscode from 'vscode';

const md = markdownItAdmonition(new MarkdownIt());
const config = vscode.workspace.getConfiguration('markdownAdmonitions');
const originalMode = config.get<string | undefined>('mode');

async function renderWithMode(mode: string, input: string): Promise<string> {
    await config.update('mode', mode, vscode.ConfigurationTarget.Global);
    return md.render(input);
}

suite('Extension Test Suite', () => {

    vscode.window.showInformationMessage('Start all tests.');

    suiteSetup(async function() {
        this.timeout(10000);
        await config.update('mode', 'relaxed', vscode.ConfigurationTarget.Global);
    });

    suiteTeardown(async function() {
        this.timeout(10000);
        await config.update('mode', originalMode, vscode.ConfigurationTarget.Global);
    });

    test('Activation extends the supplied Markdown-it parser', async () => {
        const extension = vscode.extensions.getExtension<{
            extendMarkdownIt(parser: MarkdownItParser): MarkdownItParser;
        }>('tomasdahlqvist.markdown-admonitions');
        assert.ok(extension);
        const api = await extension.activate();
        const parser = new MarkdownIt();
        assert.strictEqual(api.extendMarkdownIt(parser), parser);
        assert.strictEqual(
            parser.render(':::note\nText\n:::'),
            '<div class="note admonition"><p class="admonition-title">note</p><p>Text</p>\n</div>\n'
        );
    });

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

    test('Strict Docusaurus accepts canonical keywords without titles', async () => {
        const result = await renderWithMode('strict-docusaurus', `:::note\nText\n:::`);
        assert.strictEqual(result, `<div class="note admonition strict-docusaurus"><p class="admonition-title">note</p><p>Text</p>\n</div>\n`);
    });

    test('Strict Docusaurus supports Markdown titles and ID/class attributes', async () => {
        const result = await renderWithMode('strict-docusaurus', `:::note[Remember **this**]{#important .custom-class}\nText\n:::`);
        assert.strictEqual(result, `<div id="important" class="note admonition custom-class strict-docusaurus"><p class="admonition-title">Remember <strong>this</strong></p><p>Text</p>\n</div>\n`);
    });

    test('Strict Docusaurus rejects unknown attributes', async () => {
        const result = await renderWithMode('strict-docusaurus', `:::note{onclick=alert}\nText\n:::`);
        assert.strictEqual(result, `<p>:::note{onclick=alert}\nText\n:::</p>\n`);
    });

    test('Relaxed mode maps Nextcloud keywords to Docusaurus styles', async () => {
        const result = await renderWithMode('relaxed', `:::success\nText\n:::`);
        assert.strictEqual(result, `<div class="tip admonition"><p class="admonition-title">tip</p><p>Text</p>\n</div>\n`);
    });

    test('Relaxed mode keeps generated Docusaurus titles lowercase', async () => {
        const result = await renderWithMode('relaxed', `:::note\nText\n:::`);
        assert.strictEqual(result, `<div class="note admonition"><p class="admonition-title">note</p><p>Text</p>\n</div>\n`);
    });

    test('Strict Nextcloud maps all keywords to Docusaurus styles', async () => {
        const mappings: [string, string][] = [
            ['info', 'info'],
            ['warn', 'warning'],
            ['success', 'tip'],
            ['error', 'danger'],
            ['question', 'note'],
        ];
        for (const [keyword, type] of mappings) {
            const result = await renderWithMode('strict-nextcloud', `:::${keyword}\nText\n:::`);
            assert.ok(result.startsWith(`<div class="${type} admonition">`), keyword);
        }
    });

    test('Strict Nextcloud supports custom titles', async () => {
        const result = await renderWithMode('strict-nextcloud', `:::warn[Use caution]\nText\n:::`);
        assert.strictEqual(result, `<div class="warning admonition"><p class="admonition-title">Use caution</p><p>Text</p>\n</div>\n`);
    });

    test('Strict Nextcloud rejects Docusaurus-only keywords', async () => {
        const result = await renderWithMode('strict-nextcloud', `:::tip\nText\n:::`);
        assert.strictEqual(result, `<p>:::tip\nText\n:::</p>\n`);
    });

    test('Strict MkDocs rejects Docusaurus fenced admonitions', async () => {
        const result = await renderWithMode('strict-mkdocs', `:::note\nText\n:::`);
        assert.strictEqual(result, `<p>:::note\nText\n:::</p>\n`);
    });

    test('Strict Nextcloud rejects MkDocs admonitions', async () => {
        const result = await renderWithMode('strict-nextcloud', `!!! info\n    Text\n`);
        assert.strictEqual(result.includes('class="admonition'), false);
    });
});
