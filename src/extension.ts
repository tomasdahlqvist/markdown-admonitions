import * as vscode from 'vscode';
import * as MarkdownIt from 'markdown-it';
import * as markdownItContainer from 'markdown-it-container';
import * as markdownItAdmon from 'markdown-it-admon';

const configSection = 'markdownAdmonitions';

export function activate(context: vscode.ExtensionContext) {

    // On Mac there is no automatic call to render when the theme changes, so we need to manually refresh the preview
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(e => {
        if (e.affectsConfiguration(configSection) || e.affectsConfiguration('workbench.colorTheme')) {
            vscode.commands.executeCommand('markdown.preview.refresh');
        }
    }));

    return {
        extendMarkdownIt(md: MarkdownIt) {
            const config = vscode.workspace.getConfiguration(configSection);
            if (config.get('enable') === true) {
                return markdownItAdmonition(md);
            }
            else {
                return md;
            }
        }
    };
}

const match_regexp = /^(note|tip|info|warning|danger)(\[[^\]]*\])?$/;

export function markdownItAdmonition(md: MarkdownIt) {
    md.use(markdownItContainer, 'admonition-block', {
        validate: function(params: any) {
            return params.trim().match(match_regexp);
        },
        render: function(tokens : any, idx : any) {
            if (tokens[idx].nesting === 1) {

                // Get the current color theme kind
                const darkTheme = vscode.window.activeColorTheme.kind === vscode.ColorThemeKind.Dark;

                // Get the type and title from the info string
                const match = tokens[idx].info.trim().match(match_regexp);
                const type = match[1];

                // Use the custom title if provided, otherwise use the type as the title
                const title = match[2] ? match[2].slice(1, -1) : type;

                // Set the class of the div based on the current theme
                const className = darkTheme ? `${type}` : `${type}-light`;

                // opening tag
                return `<div class="${className}"><div class="admonition-title">${title}</div>`;
            } else {
                // closing tag
                return '</div>\n';
            }
        }
    });
    md.use(markdownItAdmon, {});

    return md;
};
