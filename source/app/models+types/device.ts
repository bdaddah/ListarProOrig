import DeviceInfo from 'react-native-device-info';

class DeviceModel {
  brand: string;
  deviceId: string;
  model: string;
  systemName: string;
  systemVersion: string;
  token?: string;

  constructor(data: any) {
    this.brand = data.brand;
    this.deviceId = data.deviceId;
    this.model = data.model;
    this.systemName = data.systemName;
    this.systemVersion = data.systemVersion;
    this.token = data.token;
  }

  static async fromDeviceInfo() {
    try {
      return new DeviceModel({
        brand: DeviceInfo.getBrand(),
        deviceId: await DeviceInfo.getUniqueId(),
        model: DeviceInfo.getModel(),
        systemName: DeviceInfo.getSystemName(),
        systemVersion: DeviceInfo.getSystemVersion(),
      });
    } catch (e) {}
  }
}

export {DeviceModel};
