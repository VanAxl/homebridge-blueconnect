
<p align="center">

<img src="https://0g.citymesh.com/files/Blog/Riiot-Labs/_1400xAUTO_fit_center-center_100/blueriiot-logo.png" width="150">

</p>


# Homebridge Plugin - Blue Connect

Homebridge plugin for BlueRiiot devices.
It reads the Swimming pool temperature, and uses the Blue connect account to retreive online Temperature.

## Installation

to be define ...

## Configurations

The configuration parameters to enable your devices would need to be added to `accessories` section of the Homebridge configuration file. One block is necessary for each Heatzy device.

```json5
{
    ...
            "accessories": [
                {
                    "accessory": "BlueRiiot",
                    "name": "XXX",
                    "username": "XXX@XXX.XXX",
                    "password": "XXX"
                }
            ]
    ...
}
```


#### Parameters

* `accessory ` is required, with `BlueRiit` value.  
* `name` (required) is anything you'd like to use to identify this device. You can always change the name from within the Home app.
* `username` and `password` (required) are the credentials you use in the BlueConnect app.

TO be added : the Swimming Pool ID and the BlueDevice ID.
For the moment, it will display these information on the log of homebridge

