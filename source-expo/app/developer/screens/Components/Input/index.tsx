import {Linking} from 'react-native';
import {
  ApplicationContext,
  HeaderRightAction,
  Input,
  NavigationButton,
  Screen,
  ScreenContainerProps,
} from '@passionui/components';
import React, {useContext, useState} from 'react';
import Preview from '../../../components/Preview';
import Playground from '../../../components/Playground';
import {PlaygroundProps} from '../../../components/Playground/types';
import {PreviewProps} from '../../../components/Preview/types';

const InputUsage: React.FC<ScreenContainerProps> = ({navigation, example}) => {
  const {theme} = useContext(ApplicationContext);
  const [showPlayground, setShowPlayground] = useState(false);
  const preview: PreviewProps = {
    component: Input,
    data: {
      value: {
        title: 'Value',
        value: [
          {
            value: 'Input value',
          },
        ],
      },
      size: {
        title: 'Size',
        value: [
          {
            value: 'small',
            props: {floatingValue: 'Floating'},
          },
          {
            value: 'medium',
            props: {floatingValue: 'Floating'},
          },
          {
            value: 'large',
            props: {floatingValue: 'Floating'},
          },
        ],
      },
      floatingValue: {
        title: 'Floating Value',
        value: [
          {
            value: 'Floating',
          },
        ],
      },
      floatingIcon: {
        title: 'Floating Icon',
        value: [
          {
            value: 'palette-swatch-outline',
            props: {floatingValue: 'Floating'},
          },
        ],
      },
      floatingIconColor: {
        title: 'Floating Icon Color',
        value: [
          {
            value: theme.colors.primary.default,
            props: {
              floatingValue: 'Floating',
              floatingIcon: 'palette-swatch-outline',
              placeholder: 'Placeholder input',
            },
          },
        ],
      },
      placeholder: {
        title: 'Placeholder',
        value: [
          {
            value: 'Placeholder input',
            props: {floatingValue: 'Floating'},
          },
        ],
      },
      error: {
        title: 'Error',
        value: [
          {
            value: 'Error input',
            props: {floatingValue: 'Floating', value: 'value not correct'},
          },
        ],
      },
      leading: {
        title: 'Leading',
        value: [
          {
            value: 'palette-swatch-outline',
            props: {
              floatingValue: 'Floating',
              placeholder: 'Placeholder input',
            },
          },
        ],
      },
      trailing: {
        title: 'Trailing',
        value: [
          {
            value: 'palette-swatch-outline',
            props: {
              floatingValue: 'Floating',
              placeholder: 'Placeholder input',
            },
          },
        ],
      },
      iconColor: {
        title: 'Icon Color',
        value: [
          {
            value: theme.colors.primary.default,
            props: {
              floatingValue: 'Floating',
              placeholder: 'Placeholder input',
              trailing: 'palette-swatch-outline',
            },
          },
        ],
      },
      required: {
        title: 'Required',
        value: [
          {
            value: true,
            props: {
              floatingValue: 'Floating',
              placeholder: 'Placeholder input',
              trailing: 'palette-swatch-outline',
            },
          },
        ],
      },
      secureTextEntry: {
        title: 'SecureTextEntry',
        value: [
          {
            value: false,
            props: {
              value: '123456',
              floatingValue: 'Floating',
              placeholder: 'Placeholder input',
            },
          },
        ],
      },
      disabled: {
        title: 'Disabled',
        value: [
          {
            value: true,
            props: {
              floatingValue: 'Floating',
              placeholder: 'Placeholder input',
            },
          },
        ],
      },
    },
  };
  const playground: PlaygroundProps = {
    component: Input,
    data: {
      value: {
        value: 'Input value',
        type: 'string',
      },
      size: {
        value: 'small',
        type: 'enum',
        data: ['small', 'medium', 'large'],
      },
      floatingValue: {
        value: 'Floating value',
        type: 'string',
      },
      floatingIcon: {
        value: 'palette-swatch-outline',
        type: 'string',
      },
      floatingIconColor: {
        value: undefined,
        type: 'string',
      },
      placeholder: {
        value: 'Input placeholder',
        type: 'string',
      },
      error: {
        value: 'Input error',
        type: 'string',
      },
      leading: {
        value: 'shape-outline',
        type: 'string',
      },
      trailing: {
        value: 'shape-outline',
        type: 'string',
      },
      iconColor: {
        value: undefined,
        type: 'string',
      },
      secureTextEntry: {
        value: false,
        type: 'bool',
      },
      required: {
        value: false,
        type: 'bool',
      },
      disabled: {
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
        title: 'Input',
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

export default InputUsage;
