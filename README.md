# node-red-contrib-wlanthermo
[Node-RED](https://nodered.org/) Nodes für die Verarbeitung der [WLANThermo Nano](https://wlanthermo.de/) API.

## Beispiel
![Example](https://www.bastelbunker.de/node-red-contrib-wlanthermo.png)

## Nodes 
### WLAN Thermo Node
Dieser Node fragt die HTTP API des [WLANThermo Nano](https://wlanthermo.de/) ab.


### MaxTemp Alert Node
Dieser Node ist zur Überwachung der Temperatur-Obergrenze gedacht.


### MinTemp Alert Node
Dieser Node ist zur Überwachung der Temperatur-Untergrenze gedacht.


### CoreTemp Warn Node
Dieser Node ist zur Überwachung der Kerntemperatur gedacht.

Wenn ein Kanal eine **Temperatur-Untergrenze von -1** konfiguriert hat, geht dieser Node von einer Kerntemperatur Messung aus!

Die **Diff Temp** gibt an, ab wann gewarnt werden soll, z.B. es ist eine **Temperatur-Obergrenze von 60** konfiguriert und soll ab **55** warnen muss eine **Diff Temp von 5** konfiguriert werden..


### CoreTemp Alert Node
Dieser Node ist zur Überwachung der Kerntemperatur gedacht.

Wenn ein Kanal eine **Temperatur-Untergrenze von -1** konfiguriert hat, geht dieser Node von einer Kerntemperatur Messung aus!


### Battery Alert Node
Dieser Node ist zur Überwachung der Batterie gedacht.
