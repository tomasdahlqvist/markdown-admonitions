declare module 'markdown-it-container' {
    import type { MarkdownIt, RendererRule } from 'markdown-it';

    interface ContainerOptions {
        marker?: string;
        validate?: (params: string, markup: string) => boolean;
        render?: RendererRule;
    }

    export default function markdownItContainer(
        md: MarkdownIt,
        name: string,
        options?: ContainerOptions
    ): void;
}
