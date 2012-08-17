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

  function combine() {
    var objects = slice.call(arguments)
      , item
      , i = 0
      , n = objects.length
      , field
      , result = {};
    while (i < n) {
      item = objects[i];
      i += 1;
      for (field in item) {
        if (hasOwn.call(item, field)) {
          result[field] = item[field];
        }
      }
    }
    return result;
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

  function loseAll(query) {
    var item
      , i = 0
      , n = this.length
      , results = new Array();
    while (i < n) {
      item = this[i];
      i += 1;
      if (!smartmatch(item, query)) {
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
        sliced._group = [item];
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

  function reduceBy(fields, query, sep) {
    var q = groupBy.apply(this, fields)
      , item
      , i = 0
      , n = q.length
      , results = [];
    while (i < n) {
      item = q[i];
      i += 1;
      results.push(combine(item, reduce.call(item._group, query, sep));
    }
    return Q(results);
  }

  function asQuarry() {
    this.column = column;
    this.findOne = findOne;
    this.findAll = findAll;
    this.groupBy = groupBy;
    this.reduce = reduce;
    this.reduceBy = reduceBy;
    return this;
  }

  function Q(data) {
    return asQuarry.call(data.slice(0));
  }

  root.Q = Q;

}).call(this);
```