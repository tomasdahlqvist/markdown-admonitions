# Examples

<!-- spellcheck-off -->

:::note
Remember, the best time to plant a tree was 20 years ago. The second best time is now. So, plant that code!
:::

:::tip
Did you know? The first rule of programming is that there are no rules. Just kidding, please follow best practices.
:::

:::info
Fun fact: The first computer bug was an actual bug. A moth got trapped in a relay of a Mark II computer in 1947.
:::

:::warning
Beware of the programmer who carries a screwdriver. Their debugging might just get a little too physical.
:::

:::danger
Danger! Danger! Too much coffee can lead to seeing code in your dreams. Or is that a feature?
:::

## Admonitions can also be nested

:::::::note
Remember, the best time to plant a tree was 20 years ago. The second best time is now. So, plant that code!

::::::tip
Did you know? The first rule of programming is that there are no rules. Just kidding, please follow best practices.

:::::info
Fun fact: The first computer bug was an actual bug. A moth got trapped in a relay of a Mark II computer in 1947.

::::warning
Beware of the programmer who carries a screwdriver. Their debugging might just get a little too physical.

:::danger
Danger! Danger! Too much coffee can lead to seeing code in your dreams. Or is that a feature?
:::
::::
:::::
::::::
:::::::

## Supporting exclamation marks too

!!! info Black
    then
    !!! warning white are
        all I see
        !!! danger in my infancy
            Red and yellow then came to be

## Collapsible blocks

When an admonition block is started with ??? instead of !!!, the admonition is rendered as an expandable block with a small toggle on the right side:

```markdown
??? note
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla et euismod
    nulla. Curabitur feugiat, tortor non consequat finibus, justo purus auctor
    massa, nec semper lorem quam in massa.
```

??? note
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla et euismod
    nulla. Curabitur feugiat, tortor non consequat finibus, justo purus auctor
    massa, nec semper lorem quam in massa.

Adding a + after the ??? token renders the block expanded:

```markdown
???+ note
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla et euismod
    nulla. Curabitur feugiat, tortor non consequat finibus, justo purus auctor
    massa, nec semper lorem quam in massa.
```

???+ note
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla et euismod
    nulla. Curabitur feugiat, tortor non consequat finibus, justo purus auctor
    massa, nec semper lorem quam in massa.

## Samples from MkDocs

!!! note
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla et
    euismod nulla. Curabitur feugiat, tortor non consequat finibus, justo
    purus auctor massa, nec semper lorem quam in massa.

!!! abstract
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla et
    euismod nulla. Curabitur feugiat, tortor non consequat finibus, justo
    purus auctor massa, nec semper lorem quam in massa.

!!! info
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla et
    euismod nulla. Curabitur feugiat, tortor non consequat finibus, justo
    purus auctor massa, nec semper lorem quam in massa.

!!! tip
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla et
    euismod nulla. Curabitur feugiat, tortor non consequat finibus, justo
    purus auctor massa, nec semper lorem quam in massa.

!!! success
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla et
    euismod nulla. Curabitur feugiat, tortor non consequat finibus, justo
    purus auctor massa, nec semper lorem quam in massa.

!!! question
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla et
    euismod nulla. Curabitur feugiat, tortor non consequat finibus, justo
    purus auctor massa, nec semper lorem quam in massa.

!!! warning
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla et
    euismod nulla. Curabitur feugiat, tortor non consequat finibus, justo
    purus auctor massa, nec semper lorem quam in massa.

!!! failure
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla et
    euismod nulla. Curabitur feugiat, tortor non consequat finibus, justo
    purus auctor massa, nec semper lorem quam in massa.

!!! danger
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla et
    euismod nulla. Curabitur feugiat, tortor non consequat finibus, justo
    purus auctor massa, nec semper lorem quam in massa.

!!! bug
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla et
    euismod nulla. Curabitur feugiat, tortor non consequat finibus, justo
    purus auctor massa, nec semper lorem quam in massa.

!!! example
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla et
    euismod nulla. Curabitur feugiat, tortor non consequat finibus, justo
    purus auctor massa, nec semper lorem quam in massa.

!!! quote
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla et
    euismod nulla. Curabitur feugiat, tortor non consequat finibus, justo
    purus auctor massa, nec semper lorem quam in massa.

!!! unknown
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla et
    euismod nulla. Curabitur feugiat, tortor non consequat finibus, justo
    purus auctor massa, nec semper lorem quam in massa.

:::unknown
*here be dragons*
:::

## Docusaurus custom titles

In `strict-docusaurus` mode, titles are optional and can contain Markdown:

:::note[Remember **this**]{#important .custom-class}
Custom titles can contain Markdown formatting.
:::

Strict Docusaurus mode displays admonition titles in uppercase. In relaxed mode, generated titles remain lowercase.

## Nextcloud admonitions

Set `markdownAdmonitions.mode` to `strict-nextcloud` to accept only Nextcloud admonition keywords:

::: warn
Rendered using the Docusaurus warning style.
:::

::: info
Rendered using the Docusaurus info style.
:::

::: success
Rendered using the Docusaurus tip style.
:::

::: error
Rendered using the Docusaurus danger style.
:::

::: question
Rendered using the Docusaurus note style.
:::
