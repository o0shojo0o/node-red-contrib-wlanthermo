'use strict';
var promise = require('bluebird');
var request = require('request');
var tools = require('../lib/tools');
//var syncRequest = require('sync-request'); "sync-request": "^6.0.0",
var net = require('net');

module.exports = function (RED) {

    function WLANThermo(config) {
        RED.nodes.createNode(this, config);
        var _context = this.context();
        var _node = this;
        this.on('input', function (msg) {

            // Check is IP Config?!
            if (config.ip === undefined || config.ip === '') {
                _node.status({ fill: 'red', shape: 'dot', text: 'Please set IP-Address' });
                return;
            }
            // ConnectionState aus dem Contex laden (default false)
            var _connectionState = _context.get('connectionState');

            CheckConnection(config.ip).then(function () {
                request({
                    uri: 'http://' + config.ip + '/data',
                    method: 'GET',
                    json: true
                }, function (error, response, body) {
                    msg.payload = body;
                    _node.send(msg);

                    // Nur setzten wenn der ConnectionState sich aendert
                    if (_connectionState != true) {
                        _node.status({ fill: 'green', shape: 'dot', text: 'Online at: ' + tools.CurrentTimeStamp() });
                        // ConnectionState im Contex speichern
                        _context.set('connectionState', true);
                    }
                });

            }, function (err) {
                // Nur setzten wenn der ConnectionState sich aendert
                if (_connectionState != false) {
                    _node.status({ fill: 'yellow', shape: 'dot', text: 'Offline at: ' + tools.CurrentTimeStamp() });
                    // ConnectionState im Contex speichern
                    _context.set('connectionState', false);
                }


            });




        });
    }

    RED.nodes.registerType('WLAN Thermo', WLANThermo);
}

function CheckConnection(ip) {
    return new promise(function (resolve, reject) {
        var _timeout = 1000;
        var _timer = setTimeout(function () {
            reject('timeout');
            _socket.end();
        }, _timeout);
        var _socket = net.createConnection(80, ip, function () {
            clearTimeout(_timer);
            resolve();
            _socket.end();
        });
        _socket.on('error', function (err) {
            clearTimeout(_timer);
            reject(err);
        });
    });
}