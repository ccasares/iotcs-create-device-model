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

Happy IoTCS !!
