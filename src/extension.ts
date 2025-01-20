import * as vscode from 'vscode';
import MarkdownIt from 'markdown-it';
import markdownItFence from 'markdown-it-fence';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "fenced-div" is now active!');

    let disposable = vscode.commands.registerCommand('fenced-div.helloWorld', () => {
        vscode.window.showInformationMessage('Hello World from new fenced-div!');
    });

    context.subscriptions.push(disposable);

    return {
        extendMarkdownIt(md: MarkdownIt) {
			return md
			.use(markdownItFence, 'info', {
				marker: ':',
				validate: function(params: any) {
					return params.trim().match(/^info$/);
				},
				render: function(tokens : any, idx : any) {
					return `<div class="info">${md.render(tokens[idx].content)}</div>`;
				}
			})
			.use(markdownItFence, 'tip', {
				marker: ':',
				validate: function(params: any) {
					return params.trim().match(/^tip$/);
				},
				render: function(tokens : any, idx : any) {
					return `<div class="tip">${md.render(tokens[idx].content)}</div>`;
				}
			})
			.use(markdownItFence, 'warning', {
				marker: ':',
				validate: function(params: any) {
					return params.trim().match(/^warning$/);
				},
				render: function(tokens : any, idx : any) {
					return `<div class="warning">${md.render(tokens[idx].content)}</div>`;
				}
			});
		}
	};
}