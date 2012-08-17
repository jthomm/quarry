quarry
======

A little API for querying collections of JavaScript objects.


```javascript
(function () {

  var root = this;

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
    return results;
  }

  function objectSlice(object, fields) {
    var field
      , i = 0
      , n = fields.length
      , result = {};
    while (i < n) {
      field = fields[i];
      i += 1;
      if (object.hasOwnProperty(field)) {
        result[field] = object[field];
      }
    }
    return result;
  }

  function groupBy(fields) {
    var item
      , i = 0
      , n = this.length
      , results = new Array()
      , result
      , sliced;
    while (i < n) {
      item = this[i];
      i += 1;
      sliced = objectSlice(item, fields);
      result = findOne.call(results, sliced);
      if (typeof result === 'undefined') {
        sliced._group = [item];
        results.push(sliced);
      } else {
        result._group.push(item);
      }
    }
    return results;
  }

  function groupByWhere(fields, query) {
    var item
      , i = 0
      , n = this.length
      , results = new Array()
      , result
      , sliced;
    while (i < n) {
      item = this[i];
      i += 1;
      if (smartmatch(item, query)) {
        sliced = objectSlice(item, fields);
        result = findOne.call(results, sliced);
        if (typeof result === 'undefined') {
          sliced._group = [item];
          results.push(sliced);
        } else {
          result._group.push(item);
        }
      }
    }
    return results;
  }

  function Q(data) {
    return {
      findOne: function () {
        return findOne.apply(data, arguments);
      },
      findAll: function () {
        return findAll.apply(data, arguments);
      },
      groupBy: function () {
        return groupBy.apply(data, arguments);
      },
      groupByWhere: function () {
        return groupByWhere.apply(data, arguments);
      },
    };
  }

  Q.findOne = findOne;
  Q.findAll = findAll;
  Q.objectSlice = objectSlice;
  Q.groupBy = groupBy;
  Q.groupByWhere = groupByWhere;

  root.Q = Q;

}).call(this);
```