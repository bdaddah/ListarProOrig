import React from 'react';
import {RootStackParamList} from './types';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

const StackScreen: React.FC<
  NativeStackScreenProps<RootStackParamList, 'Stack'>
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
