import {Linking} from 'react-native';
import {
  ApplicationContext,
  HeaderRightAction,
  InputOTP,
  NavigationButton,
  Screen,
  ScreenContainerProps,
} from '@passionui/components';
import React, {useContext, useState} from 'react';
import Preview from '../../../components/Preview';
import Playground from '../../../components/Playground';
import {PlaygroundProps} from '../../../components/Playground/types';
import {PreviewProps} from '../../../components/Preview/types';

const InputOTPUsage: React.FC<ScreenContainerProps> = ({
  navigation,
  example,
}) => {
  const {theme} = useContext(ApplicationContext);
  const [showPlayground, setShowPlayground] = useState(false);
  const preview: PreviewProps = {
    component: InputOTP,
    data: {
      value: {
        title: 'Value',
        value: [
          {
            value: '',
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
    },
  };
  const playground: PlaygroundProps = {
    component: InputOTP,
    data: {
      length: {
        type: 'number',
        value: 6,
      },
      floatingValue: {
        value: 'Floating value',
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

export default InputOTPUsage;
