import {I18nManager, LayoutAnimation, Platform, UIManager} from 'react-native';
import Geolocation, {GeoCoordinates} from 'react-native-geolocation-service';
import RNRestart from 'react-native-restart';
import * as FileSystem from 'react-native-fs';
import {PERMISSIONS, request} from 'react-native-permissions';
import tinycolor from 'tinycolor2';
import Assets from '@assets';

export function getFileName(uri: string) {
  return uri.substring(uri.lastIndexOf('/') + 1);
}

export async function fileExists(uri: string) {
  const fileName = getFileName(uri);
  return await FileSystem.exists(getFilePath(fileName));
}

export function getFilePath(fileName: string) {
  return `${FileSystem.DocumentDirectoryPath}/${fileName}`;
}

export const enableExperimental = () => {
  if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental?.(true);
  }
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
};

export const getCurrentLocation = (): Promise<GeoCoordinates | undefined> => {
  return new Promise(async resolve => {
    const type = Platform.select({
      ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      default: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    });
    const status = await request(type);
    if (status === 'granted') {
      Geolocation.getCurrentPosition(
        data => {
          resolve(data?.coords);
        },
        () => {
          resolve(undefined);
        },
      );
    } else {
      resolve(undefined);
    }
  });
};

export const convertIcon = (name: string) => {
  if (name.includes('far fa-')) {
    return name?.replace('far fa-', '');
  }
  if (name.includes('fas fa-')) {
    return name?.replace('fas fa-', '');
  }
  if (name.includes('fab fa-')) {
    return name?.replace('fab fa-', '');
  }
  return name;
};

export function validate(
  value = '',
  {
    field = 'Input',
    empty = false,
    match = '',
    email = false,
    number = false,
    phone = false,
    website = false,
    length = 0,
  },
) {
  if (!empty && value?.length === 0) {
    return `${field} is not empty`;
  }
  if (match && match !== value) {
    return `${field} value not match, please check again!`;
  }
  if (email) {
    const regex = new RegExp('[a-z0-9]+@[a-z]+.[a-z]{2,3}');
    const valid = regex.test(value);
    if (!valid) {
      return `${field} is not email, please check again!`;
    }
  }
  if (number) {
    const regex = new RegExp('^[0-9]*$');
    const valid = regex.test(value);
    if (!valid) {
      return `${field} is not number, please check again!`;
    }
  }
  if (phone) {
    const regex = new RegExp('^[0-9]*$');
    const valid = regex.test(value);
    if (!valid) {
      return 'Phone not is number, please check again!';
    }
    if (value?.length !== 10) {
      return 'Phone number is not valid, please check again!';
    }
  }
  if (website) {
    const pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name and extension
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?' + // port
        '(\\/[-a-z\\d%_.~+]*)*' + // path
        '(\\?[;&amp;a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$',
      'i',
    ); // fragment locator

    const result = pattern.test(value);
    if (!result) {
      return `${field} is not website, please check again!`;
    }
  }
  if (length && value.length !== length) {
    return `${field} is need ${length} character!`;
  }
}

export const handleRTL = (language: string) => {
  const isLanguageRTL = (code: string) => {
    switch (code) {
      case 'ar':
      case 'he':
        return true;
      default:
        return false;
    }
  };

  const isRTL = isLanguageRTL(language);
  if (isRTL !== I18nManager.isRTL) {
    I18nManager.forceRTL(isRTL);
    RNRestart.Restart();
  }
};

export function isValidURL(string: string) {
  const res = string.match(
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)/g,
  );
  return res !== null;
}

export function getNational(code: string) {
  switch (code) {
    case 'vi':
      return {
        value: 'vi',
        title: 'Việt Nam',
        icon: Assets.image.vi,
      };
    case 'ar':
      return {
        value: 'ar',
        title: 'Arabic',
        icon: Assets.image.ar,
      };

    case 'da':
      return {
        value: 'da',
        title: 'Danish',
        icon: Assets.image.da,
      };

    case 'de':
      return {
        value: 'de',
        title: 'German',
        icon: Assets.image.de,
      };

    case 'el':
      return {
        value: 'el',
        title: 'Greek',
        icon: Assets.image.el,
      };

    case 'fr':
      return {
        value: 'fr',
        title: 'French',
        icon: Assets.image.fr,
      };

    case 'he':
      return {
        value: 'he',
        title: 'Hebrew',
        icon: Assets.image.he,
      };

    case 'id':
      return {
        value: 'id',
        title: 'Indonesian',
        icon: Assets.image.id,
      };

    case 'ja':
      return {
        value: 'ja',
        title: 'Japanese',
        icon: Assets.image.ja,
      };

    case 'ko':
      return {
        value: 'ko',
        title: 'Korean',
        icon: Assets.image.ko,
      };

    case 'lo':
      return {
        value: 'lo',
        title: 'Lao',
        icon: Assets.image.lo,
      };

    case 'nl':
      return {
        value: 'nl',
        title: 'Dutch',
        icon: Assets.image.nl,
      };

    case 'zh':
      return {
        value: 'zh',
        title: 'Chinese',
        icon: Assets.image.zh,
      };

    case 'fa':
      return {
        value: 'fa',
        title: 'Persian',
        icon: Assets.image.fa,
      };

    case 'km':
      return {
        value: 'km',
        title: 'Cambodian',
        icon: Assets.image.km,
      };

    default:
    case 'en':
      return {
        value: 'en',
        title: 'English',
        icon: Assets.image.en,
      };
  }
}

export function buildColorSchema(inputColor: string) {
  const light = tinycolor(inputColor).lighten(16).toHexString();
  const container = tinycolor(inputColor).lighten(32).toHexString();

  return {
    default: inputColor,
    light: light,
    container: container,
  };
}
