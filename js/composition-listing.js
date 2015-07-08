(function() {
  var template = function(data) {
    return '<div class="widget'+ (data.isNew?' widget--new':'') +'">'+
        '<img src="http://widgetic.com' + data.previews.small + '"/>'+
        '<span class="widget_name">'+ data.name + '</span>' +
      '</div>';
  }

  var CompositionListing = function(el) {
    this.el = el;

    this.el.on('click', 'li', this._onCompositionClick.bind(this))

    this.el.html('Select a widget to list the available compositions!');
  }
  
  CompositionListing.EDIT = 0;
  CompositionListing.NEW  = 1;

  CompositionListing.prototype.load = function(widget) {
    this.widget = widget;

    return Widgetic.api('compositions', {widget_id: widget.id})
      .then(this._onCompositionsLoaded.bind(this))
  };

  CompositionListing.prototype.refresh = function() {
    this.load(this.widget);
  }

  CompositionListing.prototype._onCompositionsLoaded = function(compositions) {
    this.el.empty()
    
    compositions.map(function(composition) {
      var item = $('<li>')
        .html(template({previews: this.widget.previews, name: composition.name}))
        .data('composition', composition)
      this.el.append(item)
    }.bind(this))

    var item = $('<li>')
      .html(template({isNew: true, previews: this.widget.previews, name: 'Create new composition'}))
      .data('widget', this.widget)
    this.el.append(item)
  }

  CompositionListing.prototype._onCompositionClick = function(ev) {
    var composition = $(ev.currentTarget).data('composition');
    if(composition) {
      this.el.trigger('composition-selected', composition, CompositionListing.EDIT);
    } else {
      this.el.trigger('composition-selected', $(ev.currentTarget).data('widget'), CompositionListing.NEW);
    }
  };

  window.CompositionListing = CompositionListing;
}());