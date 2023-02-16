var fs = require("fs");
const { exec } = require("child_process");

const toPascalCase = (text) => text.replace(/(^\w|-\w)/g, clearAndUpper);

const clearAndUpper = (text) => text.replace(/-/, "").toUpperCase();

const capitalize = (word) => word.charAt(0).toUpperCase() + word.substring(1);

const toCapitalizedWords = (name) =>
  (name.match(/[A-Za-z][a-z]*/g) || []).map(capitalize).join(" ");

let componentsDir = undefined;
const POTENTIAL_PATHS = [
  "./components",
  "./src/components",
  "./app/components",
];
// find the path to components dir
POTENTIAL_PATHS.some((path) => {
  if (fs.existsSync(path)) {
    componentsDir = path;
    return true;
  }
  return false;
});

// get component name from first script argument
const componentNameInput = process.argv[2];
if (!componentNameInput) {
  console.error("Please provide a component name");
  process.exit(0);
}

// get optional story dir from second script argument
var storyDir = process.argv[3];
if (storyDir === "o") storyDir = "organisms";
if (storyDir === "m") storyDir = "modules";
if (storyDir === undefined) storyDir = "atoms";

const componentName = toPascalCase(componentNameInput);
const componentLocation = `${componentsDir}/${componentName}/${componentName}.tsx`;
const storyLocation = `${componentsDir}/${componentName}/${componentName}.stories.mdx`;
const testLocation = `${componentsDir}/${componentName}/${componentName}.test.tsx`;

try {
  fs.mkdirSync(`${componentsDir}/${componentName}`);

  // component
  fs.writeFileSync(
    componentLocation,
    [
      `import type { FC } from 'react';\n`,
      `\n`,
      `export interface ${componentName}Props {}\n`,
      `\n`,
      `export const ${componentName}: FC<${componentName}Props> = () => <div className=""></div>;`,
    ].join("")
  );

  // story
  fs.writeFileSync(
    storyLocation,
    [
      `import { Canvas, Meta, Story, ArgsTable } from "@storybook/addon-docs";\n`,
      `import { ${componentName} } from "./${componentName}";\n`,
      `\n`,
      `<Meta title="Atoms/${componentName}" component={${componentName}} />\n`,
      `export const Template = (args) => (\n`,
      `<div>\n`,
      `<${componentName} {...args} />\n`,
      `</div>\n`,
      `);\n`,
      `\n`,
      `# ${componentName}\n`,
      `<Canvas>\n`,
      `<Story name="default" args={{}}>\n`,
      `{Template.bind({})}\n`,
      `</Story>\n`,
      `</Canvas>\n`,
      `<ArgsTable of={${componentName}} />\n`,
    ].join("")
  );

  // test
  fs.writeFileSync(
    testLocation,
    [
      `import { render } from "@testing-library/react";`,
      `import { axe } from "vitest-axe";\n`,
      `\n`,
      `import { ${componentName} } from "./${componentName}";`,
      `describe("${componentName} component", () => {`,
      `it.concurrent("does not have accessibility violations", async () => {`,
      `const { baseElement } = render(`,
      `<main>`,
      `<${componentName} />`,
      `</main>`,
      `);`,
      `expect(await axe(baseElement)).toHaveNoViolations();`,
      `});`,
      `});`,
    ].join("")
  );

  console.log("🔨 files made 🔨");

  // format files
  exec(`yarn prettier ./${componentsDir}/${componentName}/ --write`);

  // open files when completed
  exec(
    `code ./${storyLocation} && code ./${componentLocation} && code ./${testLocation}`
  );
} catch (e) {
  console.log(e);
}
