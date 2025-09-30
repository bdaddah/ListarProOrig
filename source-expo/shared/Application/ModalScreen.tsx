import React, {useContext, useEffect, useMemo, useRef} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {
  ApplicationContext,
  Icon,
  Radius,
  RootStackParamList,
  SizedBox,
  Styles,
  Text,
} from '../index';

const ModalScreen: React.FC<
  NativeStackScreenProps<RootStackParamList, 'Modal'>
> = props => {
  useEffect(() => {
    return () => {
      props.route.params?.onDismiss?.();
    };
  }, [props.route.params]);

  if (props.route?.params?.isBottomSheet) {
    return <BottomSheet {...props} />;
  }
  return <Modal {...props} />;
};

const Modal: React.FC<NativeStackScreenProps<RootStackParamList, 'Modal'>> = ({
  navigation,
  route,
}) => {
  const {navigator} = useContext(ApplicationContext);
  const {screen: Component, barrierDismissible} = route.params;

  const params: any = {
    ...route.params,
    navigation,
  };
  delete params.screen;

  const onDismiss = () => {
    if (barrierDismissible) {
      return;
    }
    navigator?.pop();
  };

  return (
    <KeyboardAvoidingView
      style={Styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.container}>
        <Pressable
          style={styles.modalSpaceHorizontal}
          onPress={() => onDismiss()}
        />
        <View style={styles.modalCenterStage}>
          <Pressable
            style={styles.modalSpaceVertical}
            onPress={() => onDismiss()}
          />
          <View style={styles.modalContent}>
            <Component {...params} />
          </View>
          <Pressable
            style={styles.modalSpaceVertical}
            onPress={() => onDismiss()}
          />
        </View>
        <Pressable
          style={styles.modalSpaceHorizontal}
          onPress={() => onDismiss()}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const BottomSheet: React.FC<
  NativeStackScreenProps<RootStackParamList, 'Modal'>
> = ({navigation, route}) => {
  const {
    screen: Component,
    title,
    onClose,
    backgroundColor,
    snapPoint = 'automatic',
  } = route.params;
  const {theme, navigator} = useContext(ApplicationContext);

  const params: any = {
    ...route.params,
    navigation,
  };

  delete params.screen;

  const {bottom} = useSafeAreaInsets();
  const initialSnapPoints = useMemo(() => {
    if (snapPoint === 'automatic') {
      return ['50%', '92%'];
    } else if (snapPoint === 'content') {
      return undefined;
    } else {
      return [snapPoint];
    }
  }, [snapPoint]);

  const bottomSheetRef = useRef<any>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    bottomSheetRef.current?.present();
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handleComponent = () => (
    <View style={styles.indicatorContainer}>
      <View
        style={[
          styles.indicator,
          {backgroundColor: theme.colors.border.default},
        ]}
      />
    </View>
  );

  const backdropComponent = (backdropProps: any) => (
    <BottomSheetBackdrop
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      {...backdropProps}
    />
  );

  const headerSheet = () => {
    return (
      <View
        style={[
          styles.sheetHeader,
          {backgroundColor: theme.colors.background.surface},
        ]}>
        <SizedBox width={40} />
        <View style={Styles.flexCenter}>
          <Text typography={'callout'} fontWeight={'bold'}>
            {title}
          </Text>
        </View>
        <SizedBox width={40}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              bottomSheetRef.current?.dismiss();
              onClose?.();
            }}>
            <Icon name={'close'} color={theme.colors.text.default} size={24} />
          </TouchableOpacity>
        </SizedBox>
      </View>
    );
  };

  const color = backgroundColor ?? theme.colors.background.default;
  const height = snapPoint === 'content' ? undefined : '100%';
  return (
    <SafeAreaView style={Styles.flex}>
      <BottomSheetModal
        ref={bottomSheetRef}
        onDismiss={() => {
          if (mountedRef.current) {
            navigator?.pop();
          }
        }}
        enableDynamicSizing={snapPoint === 'content'}
        snapPoints={initialSnapPoints}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="none"
        stackBehavior="push"
        android_keyboardInputMode="adjustResize"
        handleComponent={handleComponent}
        backdropComponent={backdropComponent}>
        <BottomSheetView
          style={[
            styles.sheetContainer,
            {
              backgroundColor: color,
              paddingBottom: bottom,
              height,
            },
          ]}>
          {headerSheet()}
          <Component {...params} />
        </BottomSheetView>
      </BottomSheetModal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, flexDirection: 'row'},
  modalContent: {
    maxWidth: '100%',
    maxHeight: '80%',
  },
  modalCenterStage: {
    maxWidth: '90%',
  },
  modalSpaceHorizontal: {
    flex: 1,
    minWidth: '5%',
  },
  modalSpaceVertical: {
    flex: 1,
    minHeight: '10%',
  },
  sheetHeader: {flexDirection: 'row', height: 56},
  closeButton: {
    height: 32,
    width: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  sheetContainer: {
    width: '100%',
    borderTopLeftRadius: Radius.M,
    borderTopRightRadius: Radius.M,
    overflow: 'hidden',
  },
  indicatorContainer: {
    width: '100%',
    height: 4,
    position: 'absolute',
    top: -8,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  indicator: {
    width: 64,
    height: '100%',
    borderRadius: Radius.S,
  },
});

export default ModalScreen;
