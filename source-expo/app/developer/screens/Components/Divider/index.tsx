import {Linking} from 'react-native';
import {
  ApplicationContext,
  Divider,
  HeaderRightAction,
  NavigationButton,
  Screen,
  ScreenContainerProps,
} from '@passionui/components';
import React, {useContext, useState} from 'react';
import Preview from '../../../components/Preview';
import Playground from '../../../components/Playground';
import {PlaygroundProps} from '../../../components/Playground/types';
import {PreviewProps} from '../../../components/Preview/types';

const DividerUsage: React.FC<ScreenContainerProps> = ({
  navigation,
  example,
}) => {
  const {theme} = useContext(ApplicationContext);
  const [showPlayground, setShowPlayground] = useState(false);
  const preview: PreviewProps = {
    component: Divider,
    data: {
      type: {
        title: 'Type',
        value: [
          {
            value: 'line',
          },
          {
            value: 'dash',
          },
        ],
      },
      size: {
        title: 'Size',
        value: [
          {
            value: 1,
          },
          {
            value: 2,
          },
        ],
      },
      direction: {
        title: 'Direction',
        value: [
          {
            value: 'horizontal',
          },
          {
            value: 'vertical',
            props: {
              style: {
                height: 48,
              },
            },
          },
        ],
      },
      color: {
        title: 'Color',
        value: [
          {
            value: theme.colors.primary.default,
            props: {groupValue: 'option'},
          },
          {
            value: theme.colors.secondary.default,
          },
        ],
      },
    },
  };

  const playground: PlaygroundProps = {
    component: Divider,
    data: {
      type: {
        value: 'line',
        type: 'enum',
        data: ['line', 'dash'],
      },
      size: {
        value: 1,
        type: 'number',
      },
      direction: {
        value: 'horizontal',
        type: 'enum',
        data: ['horizontal', 'enum'],
      },
      color: {
        value: undefined,
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

export default DividerUsage;
