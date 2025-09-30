import {Linking} from 'react-native';
import {
  HeaderRightAction,
  NavigationButton,
  Screen,
  ScreenContainerProps,
  Steps,
} from '@passionui/components';
import React, {useState} from 'react';
import Preview from '../../../components/Preview';
import Playground from '../../../components/Playground';
import {PlaygroundProps} from '../../../components/Playground/types';
import {PreviewProps} from '../../../components/Preview/types';

const StepsUsage: React.FC<ScreenContainerProps> = ({navigation, example}) => {
  const [showPlayground, setShowPlayground] = useState(false);

  const preview: PreviewProps = {
    component: Steps,
    data: {
      size: {
        title: 'Size',
        value: [
          {
            value: 'small',
            props: {
              steps: [
                {
                  title: 'ABC',
                  description: 'Description',
                  time: '18:20',
                },
                {
                  title: 'ABC',
                  description: 'Description',
                  time: '18:20',
                },
                {
                  title: 'ABC',
                  description: 'Description',
                  time: '18:20',
                },
                {
                  title: 'ABC',
                  description: 'Description',
                  time: '18:20',
                },
              ],
            },
          },
          {
            value: 'large',
            props: {
              steps: [
                {
                  title: 'ABC',
                  description: 'Description',
                  time: '18:20',
                },
                {
                  title: 'ABC',
                  description: 'Description',
                  time: '18:20',
                },
                {
                  title: 'ABC',
                  description: 'Description',
                  time: '18:20',
                },
                {
                  title: 'ABC',
                  description: 'Description',
                  time: '18:20',
                },
              ],
            },
          },
        ],
      },
      activeIndex: {
        title: 'Index Active',
        value: [
          {
            value: 1,
            props: {
              steps: [
                {
                  title: 'ABC',
                  description: 'Description',
                  time: '18:20',
                },
                {
                  title: 'ABC',
                  description: 'Description',
                  time: '18:20',
                },
                {
                  title: 'ABC',
                  description: 'Description',
                  time: '18:20',
                },
                {
                  title: 'ABC',
                  description: 'Description',
                  time: '18:20',
                },
              ],
            },
          },
          {
            value: 2,
            props: {
              steps: [
                {
                  title: 'ABC',
                  description: 'Description',
                  time: '18:20',
                },
                {
                  title: 'ABC',
                  description: 'Description',
                  time: '18:20',
                },
                {
                  title: 'ABC',
                  description: 'Description',
                  time: '18:20',
                },
                {
                  title: 'ABC',
                  description: 'Description',
                  time: '18:20',
                },
              ],
            },
          },
        ],
      },
      direction: {
        title: 'Direction',
        value: [
          {
            value: 'horizontal',
            props: {
              activeIndex: 2,
              steps: [
                {
                  title: 'ABC',
                  description: 'Description',
                  time: '18:20',
                },
                {
                  title: 'ABC',
                  description: 'Description',
                  time: '18:20',
                },
                {
                  title: 'ABC',
                  description: 'Description',
                  time: '18:20',
                },
                {
                  title: 'ABC',
                  description: 'Description',
                  time: '18:20',
                },
              ],
            },
          },
          {
            value: 'vertical',
            props: {
              activeIndex: 2,
              steps: [
                {
                  title: 'ABC',
                  description: 'Description',
                  time: '18:20',
                },
                {
                  title: 'ABC',
                  description: 'Description',
                  time: '18:20',
                },
                {
                  title: 'ABC',
                  description: 'Description',
                  time: '18:20',
                },
                {
                  title: 'ABC',
                  description: 'Description',
                  time: '18:20',
                },
              ],
            },
          },
        ],
      },
    },
  };
  const playground: PlaygroundProps = {
    component: Steps,
    data: {
      size: {
        value: 'small',
        type: 'enum',
        data: ['small', 'large'],
      },
      activeIndex: {
        value: 0,
        type: 'number',
      },
      direction: {
        value: 'horizontal',
        type: 'enum',
        data: ['horizontal', 'vertical'],
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
        title: 'Divider',
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

export default StepsUsage;
