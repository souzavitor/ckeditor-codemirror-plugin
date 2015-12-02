CKEditor Codemirror Plugin
==========================

Plugin to include CodeMirror for source code editing for CKEditor editor. The plugin offers all the conveniences of the simplest CodeMirror.

##Instalation
The plugin does not load CodeMirror scripts automatically , so you need the user to manually make for each desired functionality.

1. Extract the contents of the codemirror folder into the "plugins" folder of CKEditor;
2. In the CKEditor configuration file (./config.js) add the following code: `config.extraPlugins = 'codemirror';`;

##Configurations
To configure the codemirror plugin you can use following options:

```
config.codemirror = {
    // Set this to the theme you wish to use (codemirror themes)
    theme: 'default',

    // Whether or not you want tags to automatically close themselves
    autoCloseTags: true,

    // Whether or not you wish to enable code folding (requires 'lineNumbers' to be set to 'true')
    enableCodeFolding: true,

    // Whether or not you want to show line numbers
    lineNumbers: true,

    // Whether or not you want to use line wrapping
    lineWrapping: true,

    // Whether or not you want to highlight matching tags
    matchTags: true,

    // Whether or not to show the comment button on the toolbar
    showCommentButton: true,

    // Whether or not to show the format button on the toolbar
    showFormatButton: true,

    // Whether or not to show Trailing Spaces
    showTrailingSpace: true,

    // Whether or not to show the uncomment button on the toolbar
    showUncommentButton: true    
};
```

##License
Licensed under the terms of the MIT License.
