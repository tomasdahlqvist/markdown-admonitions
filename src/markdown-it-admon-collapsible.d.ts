declare module 'markdown-it-admon-collapsible' {
    import type { MarkdownIt, RendererRule } from 'markdown-it';

    interface AdmonitionOptions {
        validate?: (params: string) => boolean;
        render?: RendererRule;
    }

    export default function markdownItAdmon(md: MarkdownIt, options?: AdmonitionOptions): void;
}
