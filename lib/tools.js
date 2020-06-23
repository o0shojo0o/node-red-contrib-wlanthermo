'use strict';

module.exports = {
    CurrentTimeStamp: function () {
        var _current = new Date().toString();
        var _month = _current.split(' ')[1];
        var _day = _current.split(' ')[2];
        var _time = _current.split(' ')[4];

        return _month + ' ' + _day + ', ' + _time;
    }
};
