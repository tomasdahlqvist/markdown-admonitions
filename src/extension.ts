import * as vscode from 'vscode';
import * as MarkdownIt from 'markdown-it';
import * as markdownItContainer from 'markdown-it-container';

export function activate(context: vscode.ExtensionContext) {
    return {
        extendMarkdownIt(md: MarkdownIt) {
            const config = vscode.workspace.getConfiguration('markdownAdmonitions');
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
    return md.use(markdownItContainer, 'admonition-block', {
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
};
