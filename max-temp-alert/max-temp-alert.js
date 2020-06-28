'use strict';
var tools = require('../lib/tools');
module.exports = function (RED) {

    function MaxTempAlert(config) {
        RED.nodes.createNode(this, config);
        this.status({});
        var _context = this.context();
        var _node = this;

        this.on('input', function (msg) {
            var _channels = msg.payload.channel;
            var messages = [];
            for (var i = 0; i < _channels.length; i++) {
                var _channel = _channels[i];
                var _activeAlert = _context.get(_channel.number.toString()) || false;

                // Aktiver Channel? channel.temp == 999 ist inaktiv!
                // Keine Kerntemperatur Messung? channel.min == -1 ist eine Kerntemperatur Messung!
                if (_channel.temp < 999 && _channel.min != -1) {
                    if (_channel.temp > _channel.max) {
                        var _newMsg = {};
                        _newMsg.topic = 'MaxTempAlert';
                        _newMsg.payload = {
                            name: _channel.name,
                            maxtemp: _channel.max,
                            currenttemp: _channel.temp,
                            overtemp: (_channel.temp - _channel.max).toFixed(1)
                        };

                        if (config.messageRepeat != true) {
                            _node.send(_newMsg);
                        }

                        if (_activeAlert != true) {
                            _node.status({ fill: 'red', shape: 'dot', text: 'Alert [' + _channel.number + ' - ' + _channel.name + '] at: ' + tools.CurrentTimeStamp() });
                            _activeAlert = true;

                            if (config.messageRepeat === true) {
                                _node.send(_newMsg);
                            }
                        }
                    }
                    else if (_activeAlert != false) {
                        DisableAlert();
                    }
                }
                else if (_activeAlert == true) {
                    DisableAlert();
                }
                _context.set(_channel.number.toString(), _activeAlert);
            }
            function DisableAlert() {
                _node.status({ fill: 'green', shape: 'dot', text: 'Alert ended [' + _channel.number + ' - ' + _channel.name + '] at: ' + tools.CurrentTimeStamp() });
                _activeAlert = false;
            }
        });
    }

    RED.nodes.registerType('MaxTemp Alert', MaxTempAlert);
}