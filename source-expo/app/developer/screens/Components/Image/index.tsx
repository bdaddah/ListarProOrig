import {Linking} from 'react-native';
import {
  HeaderRightAction,
  Image,
  NavigationButton,
  Radius,
  Screen,
  ScreenContainerProps,
} from '@passionui/components';
import React, {useState} from 'react';
import Preview from '../../../components/Preview';
import Playground from '../../../components/Playground';
import {PlaygroundProps} from '../../../components/Playground/types';
import {PreviewProps} from '../../../components/Preview/types';

const ImageUsage: React.FC<ScreenContainerProps> = ({navigation, example}) => {
  const [showPlayground, setShowPlayground] = useState(false);

  const uri = `https://source.unsplash.com/random/${Date.now()}`;
  const preview: PreviewProps = {
    component: Image,
    data: {
      source: {
        title: 'Source',
        value: [
          {
            value: {uri},
            props: {
              style: {
                height: 160,
                width: '100%',
                borderRadius: Radius.M,
              },
            },
          },
          {
            value: {uri},
            props: {
              style: {
                height: 160,
                width: '100%',
                borderRadius: Radius.M,
              },
            },
          },
        ],
      },
      resizeMode: {
        title: 'Resize Mode',
        value: [
          {
            value: 'contain',
            props: {
              source: {uri},
              style: {
                height: 160,
                width: '100%',
                borderRadius: Radius.M,
              },
            },
          },
          {
            value: 'cover',
            props: {
              source: {uri},
              style: {
                height: 160,
                width: '100%',
                borderRadius: Radius.M,
              },
            },
          },
          {
            value: 'stretch',
            props: {
              source: {uri},
              style: {
                height: 160,
                width: '100%',
                borderRadius: Radius.M,
              },
            },
          },
          {
            value: 'center',
            props: {
              source: {uri},
              style: {
                height: 160,
                width: '100%',
                borderRadius: Radius.M,
              },
            },
          },
        ],
      },
    },
  };

  const playground: PlaygroundProps = {
    component: Image,
    data: {
      source: {
        value: {
          uri: `https://source.unsplash.com/random/${Date.now()}`,
        },
        type: 'object',
      },
      resizeMode: {
        value: 'contain',
        type: 'enum',
        data: ['contain', 'cover', 'stretch', 'center'],
      },
      loading: {
        value: true,
        type: 'bool',
      },
      style: {
        value: {
          height: 160,
          width: '100%',
          borderRadius: Radius.M,
        },
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
        title: 'Image',
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

export default ImageUsage;
