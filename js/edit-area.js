(function() {
  var EditArea = function(el, status) {
    this.el = el;
    this.status = status;

    this.widgetArea    = this.el.find('.widget-area');
    this.editorArea    = this.el.find('.editor-area');
    this.nameInput     = this.el.find('input.name');
    this.widthInput    = this.el.find('input.width');
    this.heightInput   = this.el.find('input.height');
    this.embedCodeArea = this.el.find('.embed-code-area');

    this.el.on('click', '.save', function() {
      if(this.showEditor) {
        this.editor.save();
      } else {
        this.widget.save();
      }
    }.bind(this));

    this.el.on('click', '.delete', this._onDeleteClicked.bind(this));

    this.el.on('change', '.name', function(ev) {
      this.widget.setName(this.nameInput.val());
    }.bind(this));

    this.el.on('change', '.width', function(ev) {
      this.widgetArea.width(parseInt(this.widthInput.val()));
    }.bind(this));

    this.el.on('change', '.height', function(ev) {
      this.widgetArea.height(parseInt(this.heightInput.val()));
    }.bind(this));

    this.el.on('click', '.toggle-editor', this._onToggleClick.bind(this));
  }

  EditArea.prototype.new = function(widget) {
    this.currentComposition = null;
    this.currentWidget = widget;
    this.el.removeClass('init')

    this.toggleEditor(false);

    this.nameInput.val('');
    this.widthInput.val(widget.width)
    this.heightInput.val(widget.height)

    this.widgetArea.css({
      width: widget.width,
      height: widget.height
    });

    this.status.text('- New composition for: ' + widget.name);

    this._hideEmbedCode();

    if(this.widget)  { this.widget.close() }
    this.widget = Widgetic.UI.composition(
      this.widgetArea[0], {
        widget_id: widget.id,
        wait_editor_init: true
      }
    );

    this.widget.on('save', this._onSave.bind(this));
  };

  EditArea.prototype.edit = function(composition) {
    this.currentComposition = composition;
    this.el.removeClass('init')

    this.toggleEditor(false);

    this.nameInput.val(composition.name);
    this.widthInput.val(composition.width)
    this.heightInput.val(composition.height)

    this.widgetArea.css({
      width: composition.width,
      height: composition.height
    });

    this.status.text('- Editing composition: ' + composition.name);

    this._showEmbedCode(composition);

    if(this.widget)  { this.widget.close() }
    this.widget = new Widgetic.UI.composition(
      this.widgetArea[0], composition.id
    );

    this.widget.on(Widgetic.EVENTS.COMPOSITION_SAVED, this._onSave.bind(this));
  };

  EditArea.prototype.setWidget = function(widget) {
    this.currentWidget = widget
  }

  EditArea.prototype.toggleEditor = function(show) {
    this.showEditor = !this.showEditor
    if(typeof show !== 'undefined') { this.showEditor = show; }

    if(this.showEditor) {
      this._showEditor();
    } else {
      this._hideEditor()
    }

    this.el.toggleClass('edit-area--with-editor', this.showEditor)
  }

  EditArea.prototype._onSave = function(composition) {
    this.currentComposition = composition;
    this.toggleEditor(false);
    this.el.trigger('composition-saved', composition)
    this._showEmbedCode(composition);
  };

  EditArea.prototype._onDeleteClicked = function() {
    if(!this.currentComposition) {
      window.alert('The current composition is not saved!');
      return;
    }

    if(window.confirm('Are you sure you want to delete the composition?')) {
      Widgetic.api('compositions/' + this.currentComposition.id, 'DELETE')
        .then(function() {
          this.el.trigger('composition-deleted');
          this.new(this.currentWidget);
        }.bind(this));
    }
  }

  EditArea.prototype._onToggleClick = function() {
    this.toggleEditor();
  }

  EditArea.prototype._showEditor = function() {
    if(!this.widget) return;
    if(this.editor) return;

    this.editor = new Widgetic.UI.editor(
      this.editorArea[0], this.widget
    );
  }

  EditArea.prototype._hideEditor = function() {
    if(!this.editor) return;
    
    this.editor.close();
    this.editor = null;
  }

  EditArea.prototype._hideEmbedCode = function() {    
    this.embedCodeArea.hide();
  };

  EditArea.prototype._showEmbedCode = function(composition) {
    this.embedCodeArea.show();
    var code = '<a href="https://widgetic.com/widgets/'+ this.currentWidget.category +'/'+ this.currentWidget.slug +'/" class="widgetic-composition" data-id="'+ composition.id +'" data-width="'+ this.widthInput.val() + '" data-height="'+ this.heightInput.val() + '" data-resize="allow-scale-down">'+ this.currentWidget.name +'</a>';
    this.embedCodeArea.find('code').text(code);
  }

  window.EditArea = EditArea;
}());