# iotcs-create-device-model

Create your own `iotcs-instance.json` file with this structure:

```
{
  "instance": "your IoTCS instance",
  "username": "your username",
  "password": "your password"
}
```

Export all your models from an existing IoTCS instance. Files generated should be similar to:

```
<URN hyphen separated>.json
```

Run this tool with:

```
node register_device_model.js urn-my-device-model.json
```

or to create all your devices in a single call:

```
node register_device_model.js 'urn*.json'
```

If a URN already exists in the instance, the output will be similar to this:

```
Model 'urn:com:oracle:iot:device:estimote:sticker' already exists in the IoTCS instance. Skipping
```

If the device model does not currently exists, it'll be created:

```
Model 'urn:com:oracle:ccasares:iot:device:grovepi:sensors:light' created successfully
```

The code doesn't have error handling stuff, as it's the typical run-one-time tool ;)

Happy IoTCS !!
