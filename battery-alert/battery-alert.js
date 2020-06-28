'use strict';
var tools = require('../lib/tools');
module.exports = function (RED) {

    function BatteryAlert(config) {
        RED.nodes.createNode(this, config);
        this.status({});
        var _context = this.context();
        var _node = this;
        var _alertLvl = config.alertLvl < 0 ? 0 : config.alertLvl;

        this.on('input', function (msg) {
            var _batLvl = msg.payload.system.soc;
            var _activeAlert = _context.get('activeAlert') || false;

            if (_batLvl <= _alertLvl) {
                var _newMsg = {};
                _newMsg.topic = config.name;
                _newMsg.payload = _batLvl;

                if (config.messageRepeat != true) {
                    _node.send(_newMsg);
                }

                if (_activeAlert != true) {
                    _node.status({ fill: 'red', shape: 'dot', text: 'Alert ' + _batLvl + '% at: ' + tools.CurrentTimeStamp() });
                    _activeAlert = true;
                    if (config.messageRepeat === true) {
                        _node.send(_newMsg);
                    }
                }
            }
            else if (_activeAlert != false) {
                _node.status({ fill: 'green', shape: 'dot', text: 'Alert ended at: ' + tools.CurrentTimeStamp() });
                _activeAlert = false;
            }
            _context.set('activeAlert', _activeAlert);
        });
    }
    RED.nodes.registerType('Battery Alert', BatteryAlert);
}