(function(){
  var template = function(data) {
    return '<div class="widget'+ (data.isNew?' widget--new':'') +'">'+
        '<img src="http://widgetic.com' + data.previews.small + '"/>'+
        '<span class="widget_name">'+ data.name + '</span>' +
      '</div>';
  }

  var WidgetListing = function(el) {
    this.el = el;

    this.el.on('click', 'li', this._onWidgetClick.bind(this))
  }

  WidgetListing.prototype.load = function() {
    this.el.html('Loading the widgets!');

    return Widgetic.api('widgets')
      .then(this._onWidgetsLoaded.bind(this))
  };

  WidgetListing.prototype._onWidgetsLoaded = function(widgets) {
    this.el.empty();

    widgets.map(function(widget) {
      var item = $('<li>')
        .html(template(widget))
        .data('widget', widget)
      this.el.append(item)
    }.bind(this))
  };

  WidgetListing.prototype._onWidgetClick = function(ev) {
    var widgetEl = $(ev.currentTarget);
    var widget = widgetEl.data('widget');
    widgetEl
      .addClass('selected')
      .siblings()
      .removeClass('selected');
    this.el.trigger('widget-selected', widget);
  };

  window.WidgetListing = WidgetListing;
}());