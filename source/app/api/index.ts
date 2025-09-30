import {Navigator} from '@passionui/components';
import RestAPI from './restapi';
import AsyncStorage, {
  AsyncStorageStatic,
} from '@react-native-async-storage/async-storage';

class Api {
  navigator?: Navigator;
  http: RestAPI;
  storage: AsyncStorageStatic;

  constructor() {
    this.http = new RestAPI();
    this.storage = AsyncStorage;
  }
}

const instance = new Api();

export default instance;
