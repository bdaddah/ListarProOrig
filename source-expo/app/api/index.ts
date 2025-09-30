import {Navigator} from '@passionui/components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RestAPI from './restapi';

class Api {
  navigator?: Navigator;
  http: RestAPI;
  storage: typeof AsyncStorage;

  constructor() {
    this.http = new RestAPI();
    this.storage = AsyncStorage;
  }
}

const instance = new Api();

export default instance;
