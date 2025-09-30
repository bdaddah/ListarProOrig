import {Linking} from 'react-native';
import {
  Button,
  HeaderRightAction,
  NavigationButton,
  Screen,
  ScreenContainerProps,
} from '@passionui/components';
import React, {useState} from 'react';
import Preview from '../../../components/Preview';
import Playground from '../../../components/Playground';
import {PlaygroundProps} from '../../../components/Playground/types';
import {PreviewProps} from '../../../components/Preview/types';

const Types = ['primary', 'tonal', 'outline', 'text', 'disabled', 'gradient'];

const ButtonUsage: React.FC<ScreenContainerProps> = ({navigation, example}) => {
  const [showPlayground, setShowPlayground] = useState(false);

  const preview: PreviewProps = {
    component: Button,
    data: {
      type: {
        title: 'Type',
        value: Types.map(i => {
          return {
            value: i,
          };
        }),
      },
      color: {
        title: 'Color',
        value: Types.map(i => {
          return {
            value: '#088F8F',
            props: {type: i},
          };
        }),
      },
      size: {
        title: 'Size',
        value: [
          {
            value: 'small',
          },
          {
            value: 'medium',
          },
          {
            value: 'large',
          },
        ],
      },
      leading: {
        title: 'Leading',
        value: [
          {
            value: 'palette-swatch-outline',
            props: {type: 'primary'},
          },
          {
            value: 'palette-swatch-outline',
            props: {type: 'tonal'},
          },
          {
            value: 'palette-swatch-outline',
            props: {type: 'outline'},
          },
          {
            value: 'palette-swatch-outline',
            props: {type: 'text'},
          },
          {
            value: 'palette-swatch-outline',
            props: {type: 'disabled'},
          },
        ],
      },
      trailing: {
        title: 'Trailing',
        value: [
          {
            value: 'palette-swatch-outline',
          },
        ],
      },
      round: {
        title: 'Round',
        value: [
          {
            value: true,
            props: {type: 'primary'},
          },
          {
            value: true,
            props: {type: 'tonal'},
          },
          {
            value: true,
            props: {type: 'outline'},
          },
          {
            value: true,
            props: {type: 'text'},
          },
          {
            value: true,
            props: {type: 'disabled'},
          },
        ],
      },
      loading: {
        title: 'Loading',
        value: [
          {
            value: true,
            props: {type: 'primary'},
          },
          {
            value: true,
            props: {type: 'tonal'},
          },
          {
            value: true,
            props: {type: 'outline'},
          },
          {
            value: true,
            props: {type: 'text'},
          },
          {
            value: true,
            props: {type: 'disabled'},
          },
        ],
      },
    },
  };

  const playground: PlaygroundProps = {
    component: Button,
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
      size: {
        value: 'medium',
        type: 'enum',
        data: ['small', 'medium', 'large'],
      },
      leading: {
        value: 'palette-swatch-outline',
        type: 'string',
      },
      trailing: {
        value: 'transition',
        type: 'string',
      },
      round: {
        value: false,
        type: 'bool',
      },
      loading: {
        value: false,
        type: 'bool',
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
        title: 'Button',
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

export default ButtonUsage;
