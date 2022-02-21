var fs = require('fs');
const { exec } = require('child_process');

const toPascalCase = (text) => text.replace(/(^\w|-\w)/g, clearAndUpper);

const clearAndUpper = (text) => text.replace(/-/, '').toUpperCase();

const capitalize = (word) => word.charAt(0).toUpperCase() + word.substring(1);

const toCapitalizedWords = (name) =>
  (name.match(/[A-Za-z][a-z]*/g) || []).map(capitalize).join(' ');

let componentsDir = undefined;
const POTENTIAL_PATHS = ['./components', './src/components'];
// find the path to components dir
POTENTIAL_PATHS.some((path) => {
  if (fs.existsSync(path)) {
    componentsDir = path;
    return true;
  }
  return false;
});

// get component name from first script argument
const kebabComponentName = process.argv[2];
if (!kebabComponentName) {
  console.error('Please provide a component name');
  return 0;
}

// get optional story dir from second script argument
var storyDir = process.argv[3];
if (storyDir === 'o') storyDir = 'organisms';
if (storyDir === 'm') storyDir = 'modules';
if (storyDir === undefined) storyDir = 'atoms';

const componentName = toPascalCase(kebabComponentName);
const storybookName = toCapitalizedWords(componentName);
const componentFileName = `${componentsDir}/${kebabComponentName}/${kebabComponentName}.tsx`;
const storyFileName = `${componentsDir}/${kebabComponentName}/${kebabComponentName}.stories.tsx`;

try {
  fs.mkdirSync(`${componentsDir}/${kebabComponentName}`);
  fs.writeFileSync(
    componentFileName,
    [
      `import { FC } from 'react';\n`,
      `import styled from 'styled-components';\n`,
      `\n`,
      'const Container = styled.div``;\n',
      `\n`,
      `export interface ${componentName}Props {}\n`,
      `\n`,
      `export const ${componentName}: FC<${componentName}Props> = () => <Container></Container>;`,
    ].join('')
  );
  fs.writeFileSync(
    storyFileName,
    [
      `import { Meta, Story } from '@storybook/react';\n`,
      `import { ${componentName}, ${componentName}Props } from './${kebabComponentName}';\n`,
      `\n`,
      `export default {\n`,
      `  title: '${storyDir}/${storybookName}',\n`,
      `  component: ${componentName},\n`,
      `} as Meta;\n`,
      `\n`,
      `const Template: Story<${componentName}Props> = (args) => <${componentName} {...args} />;\n`,
      `export const Primary = Template.bind({});\n`,
      `Primary.args = {};`,
    ].join('')
  );
  console.log('🔨 files made 🔨');

  // open files when completed
  exec(`code ./${storyFileName} && code ./${componentFileName}`);
} catch (e) {
  console.log(e);
}
