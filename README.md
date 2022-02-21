# Bob the Component Builder

Stop making component boilerplate and let bob make it for you.

## Add to .rc

Put this into ~/.bashrc or ~/.zshrc. Replacing the dir to where bob.js is located.

```
function bob {
  node ~/replaceme/bob.js $1 $2
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

- sanitise component names
- git workflow?
