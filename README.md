# Markdown Admonitions
[![Build Status](https://pokerhandboken.visualstudio.com/github-builder/_apis/build/status%2Ftomasdahlqvist.markdown-admonitions?branchName=main)](https://pokerhandboken.visualstudio.com/github-builder/_build/latest?definitionId=1&branchName=main)
[![Marketplace](https://vsmarketplacebadges.dev/version/tomasdahlqvist.markdown-admonitions.svg)](https://marketplace.visualstudio.com/items?itemName=TomasDahlqvist.markdown-admonitions)

Enables Docusaurus-style admonitions in the VS Code preview.

## Features

Several static site generators for documentation including Docusaurus have support for informational hints in the documentation. This extension allows for the preview to show the Docusaurus style admonitions.

An example is

```
:::note
Remember, the best time to plant a tree was 20 years ago.
The second best time is now. So, plant that code!
:::
```

This and the other divs will be displayed like this in dark mode in VS Code:

![Parallel sample](images/parallel-sample.png)

They can also be stacked:

![Stacked sample](images/stacked-sample.png)

The markdown for the four divs will be shown like above if the extension is enabled. Otherwise they will be four paragraphs of text.

Additional info at [Docusaurus](https://docusaurus.io/docs/markdown-features/admonitions).

Based on [markdown-it](https://github.com/markdown-it/markdown-it) and [markdown-it-container](https://github.com/markdown-it/markdown-it-container).

## Requirements

Runs in Visual Studio Code.

## Extension Settings

This extension contributes the following settings:

* `markdownAdmonitions.enable`: Enable/disable this extension.

## Known Issues

None.
