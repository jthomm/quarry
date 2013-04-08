(function () {

  /* Requisite helpers */

  var root = this
    , slice = Array.prototype.slice
    , shift = Array.prototype.shift
    , hasOwn = Object.prototype.hasOwnProperty
  ;

  function objectSlice(object, properties) {
    // Requires `hasOwn`
    var property
      , i = 0
      , n = properties.length
      , result = {}
    ;
    while (i < n) {
      property = properties[i];
      i += 1;
      if (hasOwn.call(object, property)) {
        result[property] = object[property];
      }
    }
    return result;
  }



  /* Main course */

  function select() {
    // Requires `shift`
    var query = shift.call(arguments)
      , item
      , i = 0
      , n = this.length
      , results = []
    ;
    if (typeof query === 'undefined') {
      return this;
    }
    while (i < n) {
      item = this[i];
      i += 1;
      if (smartmatch(item, query)) {
        results.push(item);
      }
    }
    return select.apply(results, arguments);
  }

  function project() {
    // Requires `slice`, `objectSlice`
    var properties = slice.call(arguments)
      , item
      , i = 0
      , n = this.length
      , sliced
      , results = []
    ;
    while (i < n) {
      item = this[i];
      i += 1;
      sliced = objectSlice(item, properties);
      if (!smartmatch(results, sliced)) {
        results.push(sliced);
      }
    }
    return results;
  }

  function groupBy() {
    // Requires `project`, `slice`
    var projected = project.apply(this, arguments)
      , item
      , i = 0
      , n = projected.length
      , selected
    ;
    while (i < n) {
      item = projected[i];
      selected = this.select(item);
      item._data = selected;
      i += 1;
    }
    return projected;
  }



  /* Mixin goodness */

  function asQuarry() {
    this.select = select;
    this.project = project;
    this.groupBy = groupBy;
    return this;
  }

  function Q(data) {
    return asQuarry.call(data.slice(0));
  }

  root.Q = Q;

}).call(this);
