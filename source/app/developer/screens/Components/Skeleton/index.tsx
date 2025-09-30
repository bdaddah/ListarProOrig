import {Linking} from 'react-native';
import {
  HeaderRightAction,
  NavigationButton,
  Screen,
  ScreenContainerProps,
  Skeleton,
} from '@passionui/components';
import React, {useState} from 'react';
import Preview from '../../../components/Preview';
import Playground from '../../../components/Playground';
import {PlaygroundProps} from '../../../components/Playground/types';
import {PreviewProps} from '../../../components/Preview/types';

const SkeletonUsage: React.FC<ScreenContainerProps> = ({
  navigation,
  example,
}) => {
  const [showPlayground, setShowPlayground] = useState(false);
  const preview: PreviewProps = {
    component: Skeleton,
    data: {
      style: {
        title: 'Style',
        value: [
          {
            value: {width: '100%', height: 160},
          },
          {
            value: {width: 160, height: 160},
          },
        ],
      },
    },
  };

  const playground: PlaygroundProps = {
    component: Skeleton,
    data: {
      style: {
        value: {width: '100%', height: 160},
        type: 'object',
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
        title: 'Skeleton',
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

export default SkeletonUsage;
