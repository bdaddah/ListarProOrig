import {Linking} from 'react-native';
import {
  HeaderRightAction,
  NavigationButton,
  Screen,
  ScreenContainerProps,
  Switch,
} from '@passionui/components';
import React, {useState} from 'react';
import Preview from '../../../components/Preview';
import Playground from '../../../components/Playground';
import {PlaygroundProps} from '../../../components/Playground/types';
import {PreviewProps} from '../../../components/Preview/types';

const SwitchUsage: React.FC<ScreenContainerProps> = ({navigation, example}) => {
  const [showPlayground, setShowPlayground] = useState(false);

  const preview: PreviewProps = {
    component: Switch,
    data: {
      value: {
        title: 'Value',
        value: [{value: true}, {value: false}],
      },
      disabled: {
        title: 'Disabled',
        value: [
          {
            value: true,
            props: {
              value: true,
            },
          },
          {
            value: true,
            props: {
              value: false,
            },
          },
        ],
      },
    },
  };

  const playground: PlaygroundProps = {
    component: Switch,
    data: {
      value: {
        value: true,
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
        title: 'Switch',
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

export default SwitchUsage;
