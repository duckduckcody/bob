# Bob the Component Builder

Stop making component boilerplate and let bob make it for you.

## Add to .rc

Put this into ~/.bashrc or ~/.zshrc. Replacing the dir to where bob.js is located.

```
function bob {
  node ~/replaceme/bob/bob.js $1 $2
}
```

Now within any project you can run

```
bob componentName
```

Optionally add an argument to name the story path prefix.

For example:

```
bob componentName aCustomPath
```

will make a story with a title of `aCustomPath/componentName`.

The second argument is optional and defaults to `atoms`.

`m` will create the component in the `modules` path.

`o` will create the component in the `organisms` path.

## TODO

- `bob update` which just syncs with the main branch
- sanitise component names
- git workflow?
- make a new branch (checkout dev, make name with feature/ prefix, publish branch, open new PR)
- undo command, reverts last made component
- place all items in prop interface into exploded list in component
- allow for a bob.config file
