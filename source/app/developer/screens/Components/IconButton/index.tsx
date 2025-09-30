import {Linking} from 'react-native';
import {
  HeaderRightAction,
  IconButton,
  NavigationButton,
  Screen,
  ScreenContainerProps,
} from '@passionui/components';
import React, {useState} from 'react';
import Preview from '../../../components/Preview';
import Playground from '../../../components/Playground';
import {PlaygroundProps} from '../../../components/Playground/types';
import {PreviewProps} from '../../../components/Preview/types';

const Types = ['primary', 'tonal', 'secondary', 'outline', 'disabled'];

const IconButtonUsage: React.FC<ScreenContainerProps> = ({
  navigation,
  example,
}) => {
  const [showPlayground, setShowPlayground] = useState(false);

  const preview: PreviewProps = {
    component: IconButton,
    data: {
      type: {
        title: 'Type',
        direction: 'row',
        value: Types.map(i => {
          return {
            value: i,
            props: {icon: 'palette-swatch-outline'},
          };
        }),
      },
      color: {
        title: 'Color',
        direction: 'row',
        value: Types.map(i => {
          return {
            value: '#088F8F',
            props: {type: i, icon: 'palette-swatch-outline'},
          };
        }),
      },
      icon: {
        title: 'Icon',
        direction: 'row',
        value: [
          {
            value: 'palette-swatch-outline',
          },
          {
            value: 'shape-outline',
          },
          {
            value: 'transition',
          },
        ],
      },
      size: {
        title: 'Size',
        direction: 'row',
        value: [
          {
            value: 'small',
            props: {icon: 'palette-swatch-outline'},
          },
          {
            value: 'medium',
            props: {icon: 'palette-swatch-outline'},
          },
          {
            value: 'large',
            props: {icon: 'palette-swatch-outline'},
          },
        ],
      },
      shape: {
        title: 'Shape',
        direction: 'row',
        value: [
          {
            value: 'circle',
            props: {icon: 'palette-swatch-outline'},
          },
          {
            value: 'rounded',
            props: {icon: 'palette-swatch-outline'},
          },
        ],
      },
    },
  };

  const playground: PlaygroundProps = {
    component: IconButton,
    data: {
      type: {
        value: 'primary',
        type: 'enum',
        data: Types,
      },
      color: {
        value: '#088F8F',
        type: 'string',
      },
      icon: {
        value: 'palette-swatch-outline',
        type: 'string',
      },
      size: {
        value: 'large',
        type: 'enum',
        data: ['small', 'large'],
      },
      useHaptic: {
        value: false,
        type: 'bool',
      },
    },
  };
  const renderContent = () => {
    if (showPlayground) {
      return <Playground {...playground} />;
    }
    return <Preview {...preview} />;
  };

  const openCode = () => {
    try {
      Linking.openURL(example);
    } catch (e) {}
  };

  return (
    <Screen
      enableKeyboardAvoidingView={true}
      navigation={navigation}
      options={{
        title: 'Icon',
        headerRight: props => (
          <HeaderRightAction {...props}>
            <NavigationButton
              icon={'file-edit-outline'}
              onPress={() => setShowPlayground(!showPlayground)}
            />
            <NavigationButton icon={'xml'} onPress={openCode} />
          </HeaderRightAction>
        ),
      }}>
      {renderContent()}
    </Screen>
  );
};

export default IconButtonUsage;
