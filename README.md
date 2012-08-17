quarry
======

A little API for querying collections of JavaScript objects.


```javascript
(function () {

  var root = this
    , slice = Array.prototype.slice
    , hasOwn = Object.prototype.hasOwnProperty;

  function objectSlice() {
    var fields = slice.call(arguments)
      , field
      , i = 0
      , n = fields.length
      , result = {};
    while (i < n) {
      field = fields[i];
      i += 1;
      if (hasOwn.call(this, field)) {
        result[field] = this[field];
      }
    }
    return result;
  }

  function extend(source) {
    var field;
    for (field in source) {
      if (hasOwn.call(source, field)) {
        this[field] = source[field];
      }
    }
    return this;
  }

  function cloneObject() {
    return extend.call({}, this);
  }

  function column(field) {
    var item
      , i = 0
      , n = this.length
      , results = new Array();
    while (i < n) {
      item = this[i];
      i += 1;
      results.push(item[field]);
    }
    return results;
  }

  function findOne(query) {
    var item
      , i = 0
      , n = this.length;
    while (i < n) {
      item = this[i];
      i += 1;
      if (smartmatch(item, query)) {
        return item;
      }
    }
  }

  function findAll(query) {
    var item
      , i = 0
      , n = this.length
      , results = new Array();
    while (i < n) {
      item = this[i];
      i += 1;
      if (smartmatch(item, query)) {
        results.push(item);
      }
    }
    return Q(results);
  }

  function groupBy() {
    var fields = slice.call(arguments)
      , item
      , i = 0
      , n = this.length
      , results = new Array()
      , result
      , sliced;
    while (i < n) {
      item = this[i];
      i += 1;
      sliced = objectSlice.apply(item, fields);
      result = findOne.call(results, sliced);
      if (typeof result === 'undefined') {
        sliced._group = Q([item]);
        results.push(sliced);
      } else {
        result._group.push(item);
      }
    }
    return Q(results);
  }

  function reduce(query, sep) {
    var field
      , fieldFn
      , sep = sep || '__'
      , result = {};
    for (fieldFn in query) {
      field = fieldFn.split(sep, 1)[0];
      if (hasOwn.call(query, fieldFn)) {
        result[fieldFn] = query[fieldFn](column.call(this, field));
      }
    }
    return result;
  }

  function mapReduce(query, sep) {
    var item
      , i = 0
      , n = this.length
      , results = [];
    while (i < n) {
      item = this[i];
      i += 1;
      results.push(extend.call(cloneObject.call(item), item._group.reduce(query, sep)));
    }
    return Q(results);
  }

  function asQuarry() {
    this.column = column;
    this.findOne = findOne;
    this.findAll = findAll;
    this.groupBy = groupBy;
    this.reduce = reduce;
    this.mapReduce = mapReduce;
    return this;
  }

  function Q(data) {
    return asQuarry.call(data.slice(0));
  }

  root.Q = Q;

}).call(this);
```