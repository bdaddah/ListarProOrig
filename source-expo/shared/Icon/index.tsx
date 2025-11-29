import React, {useContext} from 'react';
import {ImageURISource} from 'react-native';
import {FontAwesome5, FontAwesome, MaterialCommunityIcons} from '@expo/vector-icons';
import {ApplicationContext, IconProps, Image} from '../index';

const Icon: React.FC<IconProps> = ({type, name, size = 24, color, ...rest}) => {
  const {theme} = useContext(ApplicationContext);

  let Component;
  switch (type) {
    case 'FontAwesome5':
      Component = FontAwesome5;
      break;
    case 'FontAwesome':
      Component = FontAwesome;
      break;
    default:
      Component = MaterialCommunityIcons;
      break;
  }

  if (type === 'Image') {
    return (
      <Image
        source={name as ImageURISource}
        style={{width: size, height: size}}
        resizeMode={'contain'}
        {...rest}
      />
    );
  }

  return (
    <Component
      {...rest}
      name={name as string}
      size={size}
      color={color ?? theme.colors.text.default}
    />
  );
};

export {Icon};
