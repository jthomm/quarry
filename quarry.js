(function () {

  /* Requisite functions */

  var root = this
    , shift = Array.prototype.shift
    , slice = Array.prototype.slice
  ;

  function objectSlice(object, properties) {
    var property
      , i = 0
      , n = properties.length
      , result = {}
    ;
    while (i < n) {
      property = properties[i];
      i += 1;
      if (object.hasOwnProperty(property)) {
        result[property] = object[property];
      }
    }
    return result;
  }

  function mergeObjects() {
    var objects = slice.call(arguments)
      , object
      , i = 0
      , n = objects.length
      , property
      , result = {}
    ;
    while (i < n) {
      object = objects[i];
      i += 1;
      for (property in object) {
        if (object.hasOwnProperty(property)) {
          result[property] = object[property];
        }
      }
    }
    return result;
  }

  function getValues(objects, property) {
    var object
      , i = 0
      , n = this.length
      , results = []
    ;
    while (i < n) {
      object = objects[i];
      i += 1;
      if (object.hasOwnProperty(property)) {
        results.append(object[property]);
      }
    }
    return results;
  }



  /* Main course */

  function select() {
    var object
      , i = 0
      , n = this.length
      , results = []
      , query = shift.call(arguments)
    ;
    if (typeof query === 'undefined') {
      return this;
    }
    while (i < n) {
      object = this[i];
      i += 1;
      if (smartmatch(object, query)) {
        results.push(object);
      }
    }
    return select.apply(results, arguments);
  }

  function project() {
    var object
      , i = 0
      , n = this.length
      , results = []
      , sliced
      , properties = slice.call(arguments)
    ;
    while (i < n) {
      object = this[i];
      i += 1;
      sliced = objectSlice(object, properties);
      if (!smartmatch(results, sliced)) {
        results.push(sliced);
      }
    }
    return results;
  }

  function groupBy() {
    var object
      , i = 0
      , n = this.length
      , results = []
      , sliced
      , group
      , properties = slice.call(arguments)
    ;
    while (i < n) {
      object = this[i];
      i += 1;
      sliced = objectSlice(object, properties);
      group = select.call(results, sliced)[0];
      if (typeof group === 'undefined') {
        sliced.$ = [object];
        results.push(sliced);
      } else {
        group.$.push(object);
      }
    }
    return results;
  }

  function join(objects, properties) {
    var object
      , i = 0
      , n = this.length
      , results = []
      , sliced
      , source
    ;
    while (i < n) {
      object = this[i];
      i += 1;
      sliced = objectSlice(object, properties);
      source = select.call(objects, sliced)[0];
      if (typeof source !== 'undefined') {
        results.push(mergeObjects(object, source));
      }
    }
    return results;
  }



  /* Mixin goodness */

  function asQuarry() {
    this.select = select;
    this.project = project;
    this.groupBy = groupBy;
    this.join = join;
    return this;
  }

  function Q(data) {
    return asQuarry.call(data.slice(0));
  }

  root.Q = Q

}).call(this);
