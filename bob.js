var fs = require("fs");

function toPascalCase(text) {
  return text.replace(/(^\w|-\w)/g, clearAndUpper);
}

function clearAndUpper(text) {
  return text.replace(/-/, "").toUpperCase();
}

let componentsDir = undefined;
const POTENTIAL_PATHS = ["./components", "./src/components"];

POTENTIAL_PATHS.some((path) => {
  if (fs.existsSync(path)) {
    componentsDir = path;
    return true;
  }
  return false;
});

const kebabComponentName = process.argv[2];
if (!kebabComponentName) {
  console.error("Please provide a component name");
  return 0;
}

const componentName = toPascalCase(kebabComponentName);

try {
  fs.mkdirSync(`${componentsDir}/${kebabComponentName}`);
  fs.writeFileSync(
    `${componentsDir}/${kebabComponentName}/${kebabComponentName}.tsx`,
    [
      `import { FC } from 'react';\n`,
      `\n`,
      `export interface ${componentName}Props {}\n`,
      `\n`,
      `export const ${componentName}: FC<${componentName}Props> = () => <></>;`,
    ].join("")
  );
  fs.writeFileSync(
    `${componentsDir}/${kebabComponentName}/${kebabComponentName}.stories.tsx`,
    [
      `import { Meta, Story } from '@storybook/react';\n`,
      `import { ${componentName}, ${componentName}Props } from './${kebabComponentName}';\n`,
      `\n`,
      `export default {\n`,
      `  title: 'atoms/${componentName}',\n`,
      `  component: ${componentName},\n`,
      `} as Meta;\n`,
      `\n`,
      `const Template: Story<${componentName}Props> = (args) => <${componentName} {...args} />;\n`,
      `export const Primary = Template.bind({});\n`,
      `Primary.args = {};`,
    ].join("")
  );
} catch (e) {
  console.log(e);
}
