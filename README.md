# Design Tokens Workflow Series

**Organising Outputs with Style Dictionary**

Welcome to the Design Tokens Workflow Series!

This series of articles explores various aspects of Design Tokens and how to effectively use Style Dictionary in your projects.

Read the full article here: [A Design Tokens Workflow (part 5)](https://www.alwaystwisted.com/articles/a-design-tokens-workflow-part-5)

## Summary

This branch demonstrates how to organise design token outputs into structured folders and files using Style Dictionary. It includes a build script that processes design tokens defined in the W3C Design Tokens format and generates platform-specific stylesheets. Specifically, it generates:

- SCSS files with Sass variables for each token file (`color.scss`, `spacing.scss`, etc.)

The build script is configured to look for design token files in the `src/tokens` directory and output the generated files to the `build/scss` directory.

## Installation

To get started, you’ll need to install Style Dictionary. It can either be installed globally:

```bash
npm install -g style-dictionary
```

Or it can be installed as a dependency of your project. It is most likely that you would install Style Dictionary this way:

```bash
npm install -D style-dictionary
```

## Running Instructions

1. Clone the repository and navigate to the project directory:

```bash
git clone https://github.com/sturobson/Style-Dictionary-Starter/tree/05-Organising-Outputs
cd Style-Dictionary-Starter
```

2. Install the dependencies:

```bash
npm install
```

3. Run the build script to generate the stylesheets:

```bash
npm run build
```

This will generate the following files in the `build/scss` directory based on the design tokens defined in the `src/tokens` directory:

- `color.scss`
- `spacing.scss`

## Where We're At, and Where Can We Go To

We have explored how to organise design token outputs into structured folders and files using Style Dictionary. Covering how design tokens help maintain consistency across platforms by acting as a shared source of truth for your design decisions.

In automating the conversion of tokens into platform-specific formats, Style Dictionary streamlines workflows, reduces errors, and ensures that design guidelines can be implemented accurately and efficiently.

Using a tool like Style Dictionary to automate the process of generating styles and code means you can be confident that your design tokens will always be up-to-date across all platforms. It can simplify the collaboration between designers and developers by providing a unified, consistent source of truth for visual properties, leading to a more cohesive and polished final product.

Now that we’ve seen how to get started with Style Dictionary, there’s much more you can explore. In future articles, we’ll dive deeper into more advanced configurations.

I encourage you to check out the Style Dictionary documentation to learn about its extensive capabilities. You can also explore the example code on my GitHub repository to see the end results and experiment with your own setups.