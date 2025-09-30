import {Linking} from 'react-native';
import {
  Badge,
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

const BadgeUsage: React.FC<ScreenContainerProps> = ({navigation, example}) => {
  const [showPlayground, setShowPlayground] = useState(false);

  const preview: PreviewProps = {
    component: Badge,
    data: {
      label: {
        title: 'Label',
        direction: 'row',
        value: [{value: '9'}, {value: 'closed'}],
      },
      type: {
        title: 'Type',
        direction: 'row',
        value: [{value: 'dot'}, {value: 'default'}],
      },
    },
  };

  const playground: PlaygroundProps = {
    component: Badge,
    data: {
      label: {
        value: 'label',
        type: 'string',
      },
      type: {
        value: 'default',
        type: 'enum',
        data: ['default', 'dot'],
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
        title: 'Tag',
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

export default BadgeUsage;
