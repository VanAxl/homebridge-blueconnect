
<p align="center">

<img src="https://0g.citymesh.com/files/Blog/Riiot-Labs/_1400xAUTO_fit_center-center_100/blueriiot-logo.png" width="150">

</p>


# Homebridge Plugin - Blue Connect

Homebridge plugin for BlueRiiot devices.
It reads the Swimming pool temperature, using the BlueConnect account to retreive Temperature, sent to the Blueriiot cloud by the Device.

## Installation

npm install VanAxl/homebridge-blueconnect

## Configurations

The configuration parameters need to be added to `accessories` section of the Homebridge configuration file.

```json5
{
    ...
            "accessories": [
                {
                    "accessory": "BlueRiiot",
                    "name": "XXX",
                    "email": "XXX@XXX.XXX",
                    "password": "XXX",
                    "swimmingpoolid": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
                    "bluedeviceserial": "00000000"
                }
            ]
    ...
}
```


#### Parameters

* `accessory ` is required, with `BlueRiiot` value.  
* `name` (required) is anything you'd like to use to identify this device. You can always change the name from within the Home app.
* `email` and `password` (required) are the credentials you use in the BlueConnect app.

To Get the value in config section for : the <i>Swimming Pool ID</i> and the <i>BlueDevice ID</i>.
=> for the moment, if these parameters are not written in the config file, these IDs will be displayed in the homebridge log console during homebridge startup, so you can copy/paste it in the config section.

