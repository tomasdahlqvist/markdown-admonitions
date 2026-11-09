import * as vscode from 'vscode';
import MarkdownIt from 'markdown-it';
import markdownItContainer from 'markdown-it-container';
import markdownItAdmon from 'markdown-it-admon-collapsible';

const configSection = 'markdownAdmonitions';

export function activate(context: vscode.ExtensionContext) {

    // On Mac there is no automatic call to render when the theme changes, so we need to manually refresh the preview
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(e => {
        if (
            e.affectsConfiguration(configSection) ||
            e.affectsConfiguration('workbench.colorTheme')
        ) {
            vscode.commands.executeCommand('markdown.preview.refresh');
        }
    }));

    return {
        extendMarkdownIt(md: MarkdownIt) {
            return markdownItAdmonition(md);
        }
    };
}

const darkTheme = () => vscode.window.activeColorTheme.kind === vscode.ColorThemeKind.Dark;

// Docusaurus keywords plus mkdocs at the end:
const match_regexp = /^(note|tip|info|warning|danger)(\[[^\]]*\])?$/;

// Nextcloud keywords mapped to their Docusaurus equivalents:
const nextcloudAliases: { [key: string]: string } = {
    warn: 'warning',
    success: 'tip',
    error: 'danger',
    question: 'note',
};
const nextcloud_regexp = /^(warn|success|error|question)(\[[^\]]*\])?$/;

const nextcloudEnabled = () =>
    vscode.workspace.getConfiguration(configSection).get('nextcloud', 'disable') === 'enable';

// Returns [type, title] for a container info string, or null if not matched.
function parseAdmonition(info: string): [string, string] | null {
    const trimmed = info.trim();
    let match = trimmed.match(match_regexp);
    let type: string | undefined = match ? match[1] : undefined;
    if (!match && nextcloudEnabled()) {
        match = trimmed.match(nextcloud_regexp);
        type = match ? nextcloudAliases[match[1]] : undefined;
    }
    if (!match || !type) {
        return null;
    }
    const title = match[2] ? match[2].slice(1, -1) : type;
    return [type, title];
}

export function markdownItAdmonition(md: MarkdownIt) {
    // Register admonition-block container with dynamic validation
    md.use(markdownItContainer, 'admonition-block', {
        validate: function(params: any) {
            const config = vscode.workspace.getConfiguration(configSection);
            const enabled = config.get('enable', true);
            const mode = config.get('mode', 'relaxed');
            if (!enabled) {
                return false;
            }
            if (mode === 'strict-docusaurus') {
                return ['note','tip','info','warning','danger'].includes(params) ||
                    (nextcloudEnabled() && Object.keys(nextcloudAliases).includes(params));
            } else if (mode === 'strict-mkdocs') {
                return false;
            } else {
                return parseAdmonition(params) !== null;
            }
        },
        render: function(tokens : any, idx : any) {
            if (tokens[idx].nesting === 1) {
                const parsed = parseAdmonition(tokens[idx].info);
                const type = parsed ? parsed[0] : tokens[idx].info.trim();
                const title = parsed ? parsed[1] : type;
                const className = darkTheme() ? `${type} admonition` : `${type} light admonition`;
                return `<div class="${className}"><p class="admonition-title">${title}</p>`;
            } else {
                return '</div>\n';
            }
        }
    });

    //probably not necessary, could hide a problem with the markdown-it-admon plugin
    const proxy = (tokens:any, idx:any, options:any, env:any, self:any) => self.renderToken(tokens, idx, options);
    const defaultAdmonOpenRenderer = md.renderer.rules.admonition_open || proxy;

    md.use(markdownItAdmon, {
        validate: function(params: any) {
            const config = vscode.workspace.getConfiguration(configSection);
            const enabled = config.get('enable', true);
            const mode = config.get('mode', 'relaxed');
            if (!enabled) {
                return false;
            }
            if (mode === 'relaxed' || mode === 'strict-mkdocs') {
                const [tag = ''] = params.trim().split(' ', 1);
                return !!tag;
            } else {
                return false;
            }
        },
    });

    md.renderer.rules.collapsible_open = function(tokens, idx, options, env, self) {
        if ( !darkTheme()) {
            tokens[idx].attrJoin("class", "light");
        }
        return defaultAdmonOpenRenderer(tokens, idx, options, env, self);
    };

    md.renderer.rules.admonition_open = function(tokens, idx, options, env, self) {
        if ( !darkTheme()) {
            tokens[idx].attrJoin("class", "light");
        }
        return defaultAdmonOpenRenderer(tokens, idx, options, env, self);
    };

    return md;
};
