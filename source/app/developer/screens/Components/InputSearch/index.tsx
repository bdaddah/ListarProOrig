import {Linking} from 'react-native';
import {
  ApplicationContext,
  HeaderRightAction,
  InputSearch,
  NavigationButton,
  Screen,
  ScreenContainerProps,
} from '@passionui/components';
import React, {useContext, useState} from 'react';
import Preview from '../../../components/Preview';
import Playground from '../../../components/Playground';
import {PlaygroundProps} from '../../../components/Playground/types';
import {PreviewProps} from '../../../components/Preview/types';

const InputSearchUsage: React.FC<ScreenContainerProps> = ({
  navigation,
  example,
}) => {
  const {theme} = useContext(ApplicationContext);
  const [showPlayground, setShowPlayground] = useState(false);
  const preview: PreviewProps = {
    component: InputSearch,
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
            props: {value: 'Input value'},
          },
          {
            value: 'medium',
            props: {value: 'Input value'},
          },
          {
            value: 'large',
            props: {value: 'Input value'},
          },
        ],
      },
      useShadow: {
        title: 'Use Shadow',
        value: [
          {
            value: false,
            props: {value: 'Input value'},
          },
          {
            value: true,
            props: {value: 'Input value', size: 'large'},
          },
        ],
      },
      placeholder: {
        title: 'Placeholder',
        value: [
          {
            value: 'Placeholder input',
          },
        ],
      },
      icon: {
        title: 'Icon',
        value: [
          {
            value: 'palette-swatch-outline',
            props: {
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
              placeholder: 'Placeholder input',
              icon: 'palette-swatch-outline',
            },
          },
        ],
      },
    },
  };

  const playground: PlaygroundProps = {
    component: InputSearch,
    data: {
      value: {
        value: 'Input value',
        type: 'string',
      },
      size: {
        value: 'small',
        type: 'enum',
        data: ['small', 'large'],
      },
      useShadow: {
        value: false,
        type: 'bool',
      },
      placeholder: {
        value: 'Input placeholder',
        type: 'string',
      },
      icon: {
        value: 'palette-swatch-outline',
        type: 'string',
      },
      iconColor: {
        value: theme.colors.primary.default,
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
        title: 'InputSearch',
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

export default InputSearchUsage;
