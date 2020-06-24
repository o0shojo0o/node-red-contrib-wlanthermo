'use strict';
var tools = require('../lib/tools');
module.exports = function (RED) {

    function CoreTempWarn(config) {
        RED.nodes.createNode(this, config);
        var _context = this.context();
        var _node = this;
        var _warnTemp = config.warnTemp < 0 ? 0 : config.warnTemp;
        this.on('input', function (msg) {
            var _channels = msg.payload.channel;

            for (var i = 0; i < _channels.length; i++) {
                var _channel = _channels[i];
                var _activeWarn = _context.get(_channel.number.toString()) || false;

                // Aktiver Channel? channel.temp == 999 ist inaktiv!
                // Channel.min == -1 ist eine Kerntemperatur Messung!
                if (_channel.temp < 999 && _channel.min == -1) {
                    if (_channel.temp >= (_channel.max - _warnTemp) && _channel.temp < _channel.max) {
                        var _newMsg = {};
                        _newMsg.topic = 'CoreTempWarn';
                        _newMsg.payload = {
                            name: _channel.name,
                            coretemp: _channel.max,
                            currenttemp: _channel.temp,
                            difftemp: (_channel.max - _channel.temp).toFixed(1)
                        };
                        _node.send(_newMsg);

                        if (_activeWarn != true) {
                            _node.status({ fill: 'yellow', shape: 'dot', text: 'Warning [' + _channel.number + ' - ' + _channel.name + '] at: ' + tools.CurrentTimeStamp() });
                            _activeWarn = true;
                        }
                    }
                    else if (_activeWarn != false) {
                        DisableWarn();
                    }
                }
                else if (_activeWarn == true) {
                    DisableWarn();
                }
                _context.set(_channel.number.toString(), _activeWarn);
            }

            function DisableWarn() {
                _node.status({ fill: 'green', shape: 'dot', text: 'Warning ended [' + _channel.number + ' - ' + _channel.name + '] at: ' + tools.CurrentTimeStamp() });
                _activeWarn = false;
            }
        });
    }

    RED.nodes.registerType('CoreTemp Warn', CoreTempWarn);
}