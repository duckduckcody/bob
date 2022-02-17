## TODO

- open newly created component in storybook

## Add to .rc

put this into ~/.bashrc or ~/.zshrc. Replacing the dir to where bob.js is located.

```
function bob {
  node ~/replaceme/bob.js $1
}
```

now within any project you can run

```
bob componentName
```
