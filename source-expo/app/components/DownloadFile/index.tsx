import React, {useEffect, useState} from 'react';
import {Linking, StyleProp, View, ViewStyle} from 'react-native';
import Api from '@api';
import {fileExists, getFileName, getFilePath} from '@utils';

export type DownloadFileProps = {
  style?: StyleProp<ViewStyle>;
  children: any;
  onCompleted: (uri: string) => void;
  link: string;
};

const DownloadFile: React.FC<DownloadFileProps> = ({
  style,
  children,
  onCompleted,
  link,
}) => {
  const [percent, setPercent] = useState(0);
  const [uri, setUri] = useState('');

  useEffect(() => {
    fileExists(link)
      .then(exist => {
        if (exist) {
          const fileName = getFileName(link);
          setUri(getFilePath(fileName));
        }
      })
      .catch(e => {
        Api.navigator?.showToast({message: e.message, type: 'warning'});
      });
  }, [link]);

  /**
   * on upload
   */
  const download = async () => {
    try {
      const result: any = await Api.http.downloadFile(link, {
        onProgress: value => {
          setPercent(value);
        },
      });
      setUri(result);
      onCompleted(result);
    } catch (e: any) {
      Api.navigator?.showToast({message: e.message, type: 'warning'});
    }
  };

  /**
   * open file
   */
  const open = async () => {
    if (uri) {
      try {
        await Linking.openURL(uri);
      } catch (e: any) {
        Api.navigator?.showToast({message: e.message, type: 'warning'});
      }
    }
  };

  return (
    <View style={style}>
      {children?.({percent, uri, download, open}) ?? <View />}
    </View>
  );
};

export {DownloadFile};
