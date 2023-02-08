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
  const readableName = toCapitalizedWords(componentName);
  const componentFileName = `${componentsDir}/${componentName}/${componentName}.tsx`;
  const storyFileName = `${componentsDir}/${componentName}/${componentName}.stories.tsx`;

  try {
    fs.mkdirSync(`${componentsDir}/${componentName}`);
    fs.writeFileSync(
      componentFileName,
      [
        `import { FC } from 'react';\n`,
        `import styled from 'styled-components';\n`,
        `\n`,
        "const Container = styled.div``;\n",
        `\n`,
        `export interface ${componentName}Props {}\n`,
        `\n`,
        `export const ${componentName}: FC<${componentName}Props> = () => <Container></Container>;`,
      ].join("")
    );
    fs.writeFileSync(
      storyFileName,
      [
        `import { Meta, Story } from '@storybook/react';\n`,
        `import { withDesign } from 'storybook-addon-designs';\n`,
        `import { ${componentName}, ${componentName}Props } from './${componentName}';\n`,
        `\n`,
        `export default {\n`,
        `  title: '${storyDir}/${readableName}',\n`,
        `  component: ${componentName},\n`,
        `  decorators: [withDesign],\n`,
        `  parameters: {\n`,
        `    design: {\n`,
        `      type: 'figma',\n`,
        `      url: '${figmaLink}',\n`,
        `    },\n`,
        `  },\n`,
        `} as Meta;\n`,
        `\n`,
        `const Template: Story<${componentName}Props> = (args) => <${componentName} {...args} />;\n`,
        `export const Primary = Template.bind({});\n`,
        `Primary.args = {};`,
      ].join("")
    );
    console.log("🔨 files made 🔨");

    // open files when completed
    exec(`code ./${storyFileName} && code ./${componentFileName}`);
  } catch (e) {
    console.log(e);
  }
});
