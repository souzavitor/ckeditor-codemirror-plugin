CKEditor Codemirror Plugin
==========================

Plugin to include CodeMirror for source code editing for CKEditor editor. The plugin offers all the conveniences of the simplest CodeMirror.

##Instalation
The plugin does not load CodeMirror scripts automatically , so you need the user to manually make for each desired functionality.

The scripts you need to load from CodeMirror are:
 - 'codemirror/lib/codemirror.js';
 - 'codemirror/mode/css/css.js';
 - 'codemirror/mode/xml/xml.js';
 - 'codemirror/mode/javascript/javascript.js';
 - 'codemirror/mode/htmlmixed/htmlmixed.js';
 - 'codemirror/addon/edit/closetag.js'; (for auto close tags plugin)
 - 'codemirror/addon/edit/trailingspace.js';
 - 'codemirror/addon/comment/comment.js'; (for comment plugin)
 - 'codemirror/addon/fold/foldcode.js'; (for code folding)
 - 'codemirror/addon/fold/foldgutter.js'; (for code folding)
 - 'codemirror/addon/fold/xml-fold.js'; (for code folding)
 - 'codemirror-emmet/dist/emmet.js'; (for codemirror-emmet plugin)

And the styles you need to load are:
 - 'codemirror/lib/codemirror.css';
 - 'codemirror/addon/fold/foldgutter.css'; (for code folding)

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
    showUncommentButton: true,

    // define Emmet output profile
    profile: 'xhtml',

    // Enable beautify code on startup source code mode
    beautify: true    
};
```

##TODO
 - Source Code dialog implementation;
 - Auto load CodeMirror and Beautify scripts;

##License
Licensed under the terms of the MIT License.
