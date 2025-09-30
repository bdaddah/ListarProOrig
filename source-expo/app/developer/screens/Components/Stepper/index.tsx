import {Linking} from 'react-native';
import {
  HeaderRightAction,
  NavigationButton,
  Screen,
  ScreenContainerProps,
  Stepper,
} from '@passionui/components';
import React, {useState} from 'react';
import Preview from '../../../components/Preview';
import Playground from '../../../components/Playground';
import {PlaygroundProps} from '../../../components/Playground/types';
import {PreviewProps} from '../../../components/Preview/types';

const StepperUsage: React.FC<ScreenContainerProps> = ({
  navigation,
  example,
}) => {
  const [showPlayground, setShowPlayground] = useState(false);

  const preview: PreviewProps = {
    component: Stepper,
    data: {
      defaultValue: {
        title: 'Value',
        direction: 'row',
        value: [{defaultValue: 1}, {defaultValue: 99}],
      },
      min: {
        title: 'Min',
        direction: 'row',
        value: [{value: 1, props: {defaultValue: 1, max: 5}}],
      },
      max: {
        title: 'Max',
        direction: 'row',
        value: [{value: 10, props: {defaultValue: 10}}],
      },
    },
  };

  const playground: PlaygroundProps = {
    component: Stepper,
    data: {
      defaultValue: {
        value: 0,
        type: 'number',
      },
      min: {
        value: 1,
        type: 'number',
      },
      max: {
        value: 10,
        type: 'number',
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

export default StepperUsage;
