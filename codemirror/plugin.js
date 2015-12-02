(function(){
    CKEDITOR.plugins.add('codemirror', {
        icons: 'searchcode,autoformat,commentselectedrange,uncommentselectedrange,autocomplete',
        lang: 'pt-br,en',
        version: 1.0,
        init: function(editor) {
            if (typeof CodeMirror === 'undefined') {
                throw lang.codemirrorNotDefined;
            }
            var defaultConfig = {
                theme : 'default',
                autoCloseTags: true,
                enableCodeFolding: true,
                lineNumbers: true,
                lineWrapping: true,

                matchTags: true,

                showAutoCompleteButton: true,
                showCommentButton: true,
                showTrailingSpace: true,
                showUncommentButton: true,

                // define Emmet output profile
                profile: 'xhtml',

                beautify: true
            };
            var config = CKEDITOR.tools.extend(defaultConfig, editor.config.codemirror || {}, true);
            var lang = editor.lang.codemirror;

            // SourceEditable class
            var SourceEditable = CKEDITOR.tools.createClass({
                base: CKEDITOR.editable,
                proto: {
                    setData: function (data) {
                        this.setValue(data);
                        if (window["editable_" + this.editor.id] && this.editor.mode === 'source') {
                            window["codemirror_" + this.editor.id].setValue(data);
                        }
                        this.editor.fire('dataReady');
                    },
                    getData: function() {
                        return this.getValue();
                    },
                    // Insertions are not supported in source editable.
                    insertHtml: function () {},
                    insertElement: function () {},
                    insertText: function () {},
                    // Read-only support for textarea.
                    setReadOnly: function(isReadOnly) {
                        this[(isReadOnly ? 'set' : 'remove') + 'Attribute']('readOnly', 'readonly');
                    },
                    editorID: null,
                    detach: function() {
                        window["codemirror_" + this.editorID].toTextArea();

                        // Free Memory on destroy
                        window["editable_" + this.editorID] = null;
                        window["codemirror_" + this.editorID] = null;
                        SourceEditable.baseProto.detach.call(this);
                        this.clearCustomData();
                        this.remove();
                    }
                }
            });

            var loadCodemirror = function (editor) {
                var contentsSpace = editor.ui.space('contents'),
                    textarea = contentsSpace.getDocument().createElement('textarea');

                var ariaLabel = [editor.lang.editor, editor.name].join(',');
                textarea.setAttributes({
                    dir: 'ltr',
                    tabIndex: CKEDITOR.env.webkit ? -1 : editor.tabIndex,
                    'role': 'textbox',
                    'aria-label': ariaLabel
                });
                textarea.addClass('cke_source');
                textarea.addClass('cke_reset');
                textarea.addClass('cke_enable_context_menu');
                editor.ui.space('contents').append(textarea);

                window["editable_" + editor.id] = editor.editable(new SourceEditable(editor, textarea));
                // Fill the textarea with the current editor data.
                window["editable_" + editor.id].setData(editor.getData(1));
                window["editable_" + editor.id].editorID = editor.id;
                editor.fire('ariaWidget', this);

                var sourceAreaElement = window["editable_" + editor.id],
                    holderElement = sourceAreaElement.getParent();

                if (config.lineNumbers && config.enableCodeFolding) {
                    window["foldFunc_" + editor.id] = CodeMirror.newFoldFunction(CodeMirror.tagRangeFinder);
                }

                config.mode = 'htmlmixed';
                config.workDelay = 300;
                config.workTime = 35;
                config.readOnly = editor.readOnly;
                config.lineWrapping = true;
                config.showCursorWhenSelecting = true;
                config.gutters = ["CodeMirror-linenumbers", "CodeMirror-foldgutter"];
                config.tabSize = 4;
                config.indentUnit = 4;
                window["codemirror_" + editor.id] = CodeMirror.fromTextArea(sourceAreaElement.$, config);

                if (config.beautify && typeof html_beautify === 'function') {
                    var options = {
                        indent_size: 4,
                        indent_char: ' ',
                        wrap_line_length: 0
                    };
                    var source = window["codemirror_" + editor.id].getValue();
                    window["codemirror_" + editor.id].setValue(html_beautify(source, options));
                }

                // set height inherit
                window["codemirror_" + editor.id].setSize(null, 'inherit');

                window["codemirror_" + editor.id].on("change", function () {
                    window["codemirror_" + editor.id].save();
                    editor.fire('change', this);
                });


                // Enable Code Folding (Requires 'lineNumbers' to be set to 'true')
                if (config.lineNumbers && config.enableCodeFolding) {
                    window["codemirror_" + editor.id].on("gutterClick", window["foldFunc_" + editor.id]);
                }

                // inherit blur event
                window["codemirror_" + editor.id].on("blur", function () {
                    editor.fire('blur', this);
                });

            };

            var sourcearea = CKEDITOR.plugins.sourcearea;
            editor.addMode('source', function (callback) {
                loadCodemirror(editor);
                callback();
            });

            if (editor.ui.addButton) {
                editor.addCommand('source', sourcearea.commands.source);
                editor.ui.addButton('Source', {
                    label: lang.toolbar,
                    command: 'source',
                    toolbar: 'mode,10'
                });
                if (config.showCommentButton) {
                    editor.addCommand('commentSelectedRange', sourcearea.commands.commentSelectedRange);
                    editor.ui.addButton('CommentSelectedRange', {
                        label: lang.commentSelectedRange,
                        command: 'commentSelectedRange',
                        toolbar: 'mode,60'
                    });
                }
                if (config.showUncommentButton) {
                    editor.addCommand('uncommentSelectedRange', sourcearea.commands.uncommentSelectedRange);
                    editor.ui.addButton('UncommentSelectedRange', {
                        label: lang.uncommentSelectedRange,
                        command: 'uncommentSelectedRange',
                        toolbar: 'mode,70'
                    });
                }
                if (config.showAutoCompleteButton) {
                    editor.addCommand('autoCompleteToggle', sourcearea.commands.autoCompleteToggle);
                    editor.ui.addButton('AutoComplete', {
                        label: lang.autoCompleteToggle,
                        command: 'autoCompleteToggle',
                        toolbar: 'mode,80'
                    });
                }
            }

            editor.on('setData', function(data) {
                if (window["editable_" + data.editor.id] && data.editor.mode === 'source') {
                    window["codemirror_" + data.editor.id].setValue(data.data.dataValue);
                }
            });
        }
    });
    CKEDITOR.plugins.sourcearea = {
        commands: {
            source: {
                modes: {
                    wysiwyg: 1,
                    source: 1
                },
                editorFocus: false,
                readOnly: 1,
                exec: function(editor) {
                    if (editor.mode === 'wysiwyg') {
                        editor.fire('saveSnapshot');
                    }

                    editor.getCommand('source').setState(CKEDITOR.TRISTATE_DISABLED);
                    editor.setMode(editor.mode === 'source' ? 'wysiwyg' : 'source');
                },
                canUndo: false
            },
            commentSelectedRange: {
                modes: {
                    wysiwyg: 0,
                    source: 1
                },
                editorFocus: false,
                readOnly: 0,
                exec: function (editor) {
                    var range = {
                        from: window["codemirror_" + editor.id].getCursor(true),
                        to: window["codemirror_" + editor.id].getCursor(false)
                    };
                    window["codemirror_" + editor.id].blockComment(range.from, range.to);
                },
                canUndo: true
            },
            uncommentSelectedRange: {
                modes: {
                    wysiwyg: 0,
                    source: 1
                },
                editorFocus: false,
                readOnly: 0,
                exec: function(editor) {
                    var range = {
                        from: window["codemirror_" + editor.id].getCursor(true),
                        to: window["codemirror_" + editor.id].getCursor(false)
                    };
                    window["codemirror_" + editor.id].uncomment(range.from, range.to);
                },
                canUndo: true
            },
            autoCompleteToggle: {
                modes: {
                    wysiwyg: 0,
                    source: 1
                },
                editorFocus: false,
                readOnly: 1,
                exec: function (editor) {
                    if (this.state == CKEDITOR.TRISTATE_ON) {
                        window["codemirror_" + editor.id].setOption("autoCloseTags", false);
                    } else if (this.state == CKEDITOR.TRISTATE_OFF) {
                        window["codemirror_" + editor.id].setOption("autoCloseTags", true);
                    }
                    this.toggleState();
                },
                canUndo: true
            }
        }
    };
}());
