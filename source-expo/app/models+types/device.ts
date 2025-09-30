import * as Device from 'expo-device';
import * as Application from 'expo-application';
import {Platform} from 'react-native';

class DeviceModel {
  osVersion: string;
  brand: string;
  deviceId: string;
  model: string;
  systemName: string;
  systemVersion: string;
  token?: string;

  constructor(data: any) {
    this.osVersion = data.osVersion;
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
        osVersion: Device.osVersion,
        brand: Device.brand,
        deviceId:
          Platform.OS === 'android'
            ? Application.getAndroidId()
            : await Application.getIosIdForVendorAsync(),
        model: Device.modelName,
        systemName: Device.osName,
        systemVersion: Device.osVersion,
      });
    } catch (e) {}
  }
}

export {DeviceModel};
