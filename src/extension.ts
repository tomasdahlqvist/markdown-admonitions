import * as vscode from 'vscode';
import MarkdownIt from 'markdown-it';
import markdownItContainer from 'markdown-it-container';
import markdownItAdmon from 'markdown-it-admon-collapsible';

const configSection = 'markdownAdmonitions';

type AdmonitionMode =
    | 'relaxed'
    | 'strict-docusaurus'
    | 'strict-nextcloud'
    | 'strict-mkdocs';

type ParsedAdmonition = {
    type: string;
    title: string;
    markdownTitle: boolean;
    id?: string;
    classes: string[];
};

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

const nextcloudRegExp = /^(info|warn|success|error|question)(\[[^\]]*\])?$/;
const nextcloudAliases: Record<string, string> = {
    warn: 'warning',
    success: 'tip',
    error: 'danger',
    question: 'note',
};

function parseAttributes(value: string): { id?: string; classes: string[] } | null {
    let id: string | undefined;
    const classes: string[] = [];
    const tokens = value.trim().split(/\s+/).filter(Boolean);

    for (const token of tokens) {
        const name = token.slice(1);
        if (!/^[A-Za-z0-9_-]+$/.test(name)) {
            return null;
        }

        if (token.startsWith('#')) {
            if (id) {
                return null;
            }
            id = name;
        } else if (token.startsWith('.')) {
            classes.push(name);
        } else {
            return null;
        }
    }

    return { id, classes };
}

function parseDocusaurusAdmonition(info: string): ParsedAdmonition | null {
    const match = info.trim().match(/^(note|tip|info|warning|danger)(.*)$/);
    if (!match) {
        return null;
    }

    let rest = match[2].trimStart();
    let title: string | undefined;
    let attributes: { id?: string; classes: string[] } = { classes: [] };

    if (rest.startsWith('[')) {
        let depth = 0;
        let closingIndex = -1;
        for (let index = 0; index < rest.length; index++) {
            if (rest[index] === '\\') {
                index++;
            } else if (rest[index] === '[') {
                depth++;
            } else if (rest[index] === ']' && --depth === 0) {
                closingIndex = index;
                break;
            }
        }
        if (closingIndex < 0) {
            return null;
        }
        title = rest.slice(1, closingIndex);
        rest = rest.slice(closingIndex + 1).trimStart();
    }

    if (rest.startsWith('{')) {
        const closingIndex = rest.indexOf('}');
        if (closingIndex < 0) {
            return null;
        }
        const parsedAttributes = parseAttributes(rest.slice(1, closingIndex));
        if (!parsedAttributes) {
            return null;
        }
        attributes = parsedAttributes;
        rest = rest.slice(closingIndex + 1).trim();
    }

    if (rest) {
        return null;
    }

    return {
        type: match[1],
        title: title ?? match[1],
        markdownTitle: title !== undefined,
        ...attributes,
    };
}

function parseNextcloudAdmonition(info: string): ParsedAdmonition | null {
    const match = info.trim().match(nextcloudRegExp);
    if (!match) {
        return null;
    }

    const type = nextcloudAliases[match[1]] ?? match[1];
    return {
        type,
        title: match[2] ? match[2].slice(1, -1) : type,
        markdownTitle: false,
        classes: [],
    };
}

function parseAdmonition(info: string, mode: AdmonitionMode): ParsedAdmonition | null {
    switch (mode) {
    case 'relaxed':
        return parseDocusaurusAdmonition(info) ?? parseNextcloudAdmonition(info);
    case 'strict-docusaurus':
        return parseDocusaurusAdmonition(info);
    case 'strict-nextcloud':
        return parseNextcloudAdmonition(info);
    case 'strict-mkdocs':
        return null;
    }
}

export function markdownItAdmonition(md: MarkdownIt) {
    // Register admonition-block container with dynamic validation
    md.use(markdownItContainer, 'admonition-block', {
        validate: function(params: any) {
            const config = vscode.workspace.getConfiguration(configSection);
            const enabled = config.get('enable', true);
            const mode = config.get<AdmonitionMode>('mode', 'relaxed');
            if (!enabled) {
                return false;
            }
            return parseAdmonition(params, mode) !== null;
        },
        render: function(tokens : any, idx : any) {
            if (tokens[idx].nesting === 1) {
                const config = vscode.workspace.getConfiguration(configSection);
                const mode = config.get<AdmonitionMode>('mode', 'relaxed');
                const parsed = parseAdmonition(tokens[idx].info, mode);
                const type = parsed ? parsed.type : tokens[idx].info.trim();
                const title = parsed?.markdownTitle ? md.renderInline(parsed.title) : parsed?.title ?? type;
                const classNames = [type, 'admonition', ...(parsed?.classes ?? [])];
                if (mode === 'strict-docusaurus') {
                    classNames.push('strict-docusaurus');
                }
                if (!darkTheme()) {
                    classNames.push('light');
                }
                const id = parsed?.id ? ` id="${parsed.id}"` : '';
                return `<div${id} class="${classNames.join(' ')}"><p class="admonition-title">${title}</p>`;
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
            const mode = config.get<AdmonitionMode>('mode', 'relaxed');
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
