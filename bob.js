var fs = require("fs");
const { exec } = require("child_process");

const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

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

let figmaLink = undefined;
rl.question("What is the figma link?: ", (link) => {
  figmaLink = link;
  rl.close();
});

rl.on("close", () => {
  const componentName = toPascalCase(componentNameInput);
  const componentLocation = `${componentsDir}/${componentName}/${componentName}.tsx`;
  const storyLocation = `${componentsDir}/${componentName}/${componentName}.stories.tsx`;
  const testLocation = `${componentsDir}/${componentName}/${componentName}.test.tsx`;

  try {
    fs.mkdirSync(`${componentsDir}/${componentName}`);
    fs.writeFileSync(
      componentLocation,
      [
        `import { FC } from 'react';\n`,
        `\n`,
        `export interface ${componentName}Props {}\n`,
        `\n`,
        `export const ${componentName}: FC<${componentName}Props> = () => <div className=""></div>;`,
      ].join("")
    );

    fs.writeFileSync(
      storyLocation,
      [
        `import { Canvas, Meta, Story, ArgsTable } from "@storybook/addon-docs";`,
        `import { ${componentName} } from "./${componentName}";`,
        `<Meta title="Atoms/${componentName}" component={${componentName}} />`,
        `export const Template = (args) => (`,
        `<div>`,
        `<${componentName} {...args} />`,
        `</div>`,
        `);`,
        `# ${componentName}`,
        `<Canvas>`,
        `<Story name="default" args={{}}>`,
        `{Template.bind({})}`,
        `</Story>`,
        `</Canvas>`,
        `<ArgsTable of={${componentName}} />`,
      ].join("")
    );

    fs.writeFileSync(
      storyLocation,
      [
        `import { Canvas, Meta, Story, ArgsTable } from "@storybook/addon-docs";`,
        `import { ${componentName} } from "./${componentName}";`,
        `<Meta title="Atoms/${componentName}" component={${componentName}} />`,
        `export const Template = (args) => (`,
        `<div>`,
        `<${componentName} {...args} />`,
        `</div>`,
        `);`,
        `# ${componentName}`,
        `<Canvas>`,
        `<Story name="default" args={{}}>`,
        `{Template.bind({})}`,
        `</Story>`,
        `</Canvas>`,
        `<ArgsTable of={${componentName}} />`,
      ].join("")
    );

    fs.writeFileSync(
      storyLocation,
      [
        `
        import { render } from "@testing-library/react";
        import { axe } from "vitest-axe";
        import { ${componentName} } from "./${componentName}";
        describe("${componentName} component", () => {
          it.concurrent("does not have accessibility violations", async () => {
            const { baseElement } = render(
              <main>
                <${componentName} />
              </main>
            );
            expect(await axe(baseElement)).toHaveNoViolations();
          });
        });
        `,
      ].join("")
    );

    console.log("🔨 files made 🔨");

    // open files when completed
    exec(
      `yarn prettier ./${storyLocation} -w && yarn prettier ./${componentLocation} -w && yarn prettier ./${testLocation} -w`
    );
    exec(
      `code ./${storyLocation} && code ./${componentLocation} && code ./${testLocation}`
    );
  } catch (e) {
    console.log(e);
  }
});
