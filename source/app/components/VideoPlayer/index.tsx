import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  Easing,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import Video from 'react-native-video';
import {Colors, Icon, Styles} from '@passionui/components';
import styles from './styles';

interface VideoPlayerProps {
  url: string;
  style?: ViewStyle;
}

export interface VideoPlayerRef {
  play: () => void;
  pause: () => void;
}

const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(
  ({url, style}, ref) => {
    const videoRef = useRef<any>(null);
    const fadeAnim = useRef(new Animated.Value(1));
    const hideControlsTimeout = useRef<NodeJS.Timeout | null>(null);
    const [paused, setPaused] = useState(false);
    const [muted, setMuted] = useState(false);
    const [show, setShow] = useState(true);

    useImperativeHandle(ref, () => ({
      play: () => setPaused(false),
      pause: () => setPaused(true),
    }));

    useEffect(() => {
      Animated.timing(fadeAnim.current, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      }).start();
    }, []);

    const showControls = () => {
      Animated.timing(fadeAnim.current, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      }).start();

      if (hideControlsTimeout.current) {
        clearTimeout(hideControlsTimeout.current);
      }

      hideControlsTimeout.current = setTimeout(() => {
        Animated.timing(fadeAnim.current, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }).start();
      }, 2000);
    };

    return (
      <View
        style={[styles.container, style]}
        onTouchStart={() => showControls()}>
        <Animated.View
          style={[styles.controlContainer, {opacity: fadeAnim.current}]}>
          {show && (
            <>
              <TouchableOpacity
                style={Styles.paddingS}
                onPress={() => setPaused(prev => !prev)}>
                <Icon name={paused ? 'play' : 'pause'} color={Colors.white} />
              </TouchableOpacity>
              <TouchableOpacity
                style={Styles.paddingS}
                onPress={() => setMuted(prev => !prev)}>
                <Icon
                  name={muted ? 'volume-high' : 'volume-off'}
                  color={Colors.white}
                />
              </TouchableOpacity>
            </>
          )}
          <TouchableOpacity
            style={Styles.paddingS}
            onPress={() => {
              setShow(prev => !prev);
            }}>
            <Icon
              name={show ? 'eye-off-outline' : 'play'}
              color={Colors.white}
            />
          </TouchableOpacity>
        </Animated.View>
        {show && (
          <Video
            ref={videoRef}
            source={{uri: url}}
            style={show ? Styles.full : styles.hidden}
            paused={paused}
            repeat={true}
            muted={muted}
            onEnd={() => setPaused(prev => !prev)}
            resizeMode="cover"
          />
        )}
      </View>
    );
  },
);

export {VideoPlayer};
