import {Linking} from 'react-native';
import {
  ApplicationContext,
  HeaderRightAction,
  NavigationButton,
  Screen,
  ScreenContainerProps,
  Text,
} from '@passionui/components';
import React, {useContext, useState} from 'react';
import Preview from '../../../components/Preview';
import Playground from '../../../components/Playground';
import {PlaygroundProps} from '../../../components/Playground/types';
import {PreviewProps} from '../../../components/Preview/types';

const Typography = [
  'largeTitle',
  'title1',
  'title2',
  'title3',
  'headline',
  'body',
  'callout',
  'subhead',
  'footnote',
  'caption1',
  'caption2',
];

const TextUsage: React.FC<ScreenContainerProps> = ({navigation, example}) => {
  const {theme} = useContext(ApplicationContext);
  const [showPlayground, setShowPlayground] = useState(false);

  const preview: PreviewProps = {
    component: Text,
    data: {
      typography: {
        title: 'Typography',
        value: Typography.map(i => {
          return {
            value: i,
            props: {children: i},
          };
        }),
      },
      color: {
        title: 'Color',
        direction: 'row',
        value: [
          {
            value: theme.colors.text.default,
            props: {children: 'default'},
          },
          {
            value: theme.colors.text.secondary,
            props: {children: 'secondary'},
          },
          {
            value: theme.colors.text.disable,
            props: {children: 'disable'},
          },
          {
            value: theme.colors.text.hint,
            props: {children: 'hint'},
          },
        ],
      },
    },
  };

  const playground: PlaygroundProps = {
    component: Text,
    data: {
      children: {
        value: 'Typography',
        type: 'string',
      },
      typography: {
        value: 'subhead',
        type: 'enum',
        data: Typography,
      },
      color: {
        value: theme.colors.text.default,
        type: 'enum',
        data: [
          theme.colors.text.default,
          theme.colors.text.secondary,
          theme.colors.text.hint,
          theme.colors.text.disable,
        ],
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
        title: 'Text',
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

export default TextUsage;
