(function() {
  var App = function(el) {
    this.el = el;

    this.loginArea          = new LoginArea(this.el.find('.login-area'));
    this.widgetListing      = new WidgetListing(this.el.find('.widget-listing'));
    this.compositionListing = new CompositionListing(this.el.find('.composition-listing'));
    this.editArea           = new EditArea(this.el.find('.edit-area'), this.el.find('.edit-area_status'));

    this.el.on('login-success',        this._onLoginSuccess.bind(this))
    this.el.on('widget-selected',      this._onWidgetSelected.bind(this))
    this.el.on('composition-selected', this._onCompositionSelected.bind(this))
    this.el.on('composition-saved',    this._refresh.bind(this))
    this.el.on('composition-deleted',  this._refresh.bind(this))
  }

  App.prototype._onLoginSuccess = function() {
    this.el.removeClass('init')
    this.el.addClass('loggedIn')
    this.widgetListing.load();
  };

  App.prototype._onWidgetSelected = function(ev, widget) {
    this.compositionListing.load(widget);
  };

  App.prototype._onCompositionSelected = function(ev, data) {
    var composition = data.composition
    var widget = data.widget
    var type = data.type
    switch (type) {
      case CompositionListing.EDIT:
        this.editArea.edit(composition);
        break;
      default:
      case CompositionListing.NEW:
        this.editArea.new(widget);
        break;
    }
  };

  App.prototype._refresh = function() {
    this.compositionListing.refresh();
  };

  window.App = App;
}());