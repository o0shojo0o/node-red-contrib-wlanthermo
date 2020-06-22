'use strict';
var promise = require('bluebird');
var request = require('request');
var syncRequest = require('sync-request');
var net = require('net');

module.exports = function (RED) {
    function wlanthermo(config) {
        RED.nodes.createNode(this, config);
        var context = this.context();
        var node = this;
        this.on('input', function (msg) {
            // Debug
            config.ip = '192.168.0.167';
            // Check is IP Config?!
            if (config.ip === undefined || config.ip === '') {
                node.status({ fill: 'red', shape: 'dot', text: 'Please set IP-Address' });
                return;
            }

            checkConnection(config.ip).then(function () {
                request({
                    uri: 'http://' + config.ip + '/data',
                    method: 'GET',
                    json: true
                }, function (error, response, body) {
                    node.warn(response);
                });

            }, function (err) {
                node.status({ fill: 'yellow', shape: 'dot', text: 'Offline at: ' + CurrentTimeStamp() });
            });
        });
    }
}

RED.nodes.registerType('WLANThermo', wlanthermo);


//////////// Tools
function checkConnection(ip) {
    return new promise(function (resolve, reject) {
        var timeout = 1000;
        var timer = setTimeout(function () {
            reject('timeout');
            socket.end();
        }, timeout);
        var socket = net.createConnection(80, ip, function () {
            clearTimeout(timer);
            resolve();
            socket.end();
        });
        socket.on('error', function (err) {
            clearTimeout(timer);
            reject(err);
        });
    });
}

function CurrentTimeStamp() {
    var _current = new Date().toString();
    var _month = _current.split(' ')[1];
    var _day = _current.split(' ')[2];
    var _time = _current.split(' ')[4];

    return _month + ' ' + _day + ', ' + _time;
}