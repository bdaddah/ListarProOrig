import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from './types';

const StackScreen: React.FC<
  NativeStackScreenProps<RootStackParamList, 'Dialog'>
> = ({navigation, route}) => {
  const {screen: Component} = route.params;

  const params: any = {
    ...route.params,
    navigation,
  };

  delete params.screen;

  return <Component {...params} />;
};

export default StackScreen;
