import React, {useContext, useRef, useState} from 'react';

import {
  ApplicationContext,
  Colors,
  Icon,
  Image,
  Input,
  Popup,
  Radius,
  Screen,
  ScreenContainerProps,
  Shadow,
  SheetPicker,
  SizedBox,
  Spacing,
  Styles,
  Switch,
} from '@passionui/components';
import {useSelector} from 'react-redux';
import {ListTitle} from '@components';
import {View} from 'react-native';
import {getNational} from '@utils';
import {
  appearanceSelect,
  applicationActions,
  domainSelect,
  languageSelect,
} from '@redux';
import {Settings} from '@configs';
import styles from './styles';
import {SettingTheme, Splash} from '@screens';

const Setting: React.FC<ScreenContainerProps> = ({navigation}) => {
  const {theme, navigator, translate} = useContext(ApplicationContext);
  const language = useSelector(languageSelect);
  const appearance = useSelector(appearanceSelect);
  const currentDomain = useSelector(domainSelect);
  const domain = useRef('');
  const [notification, setNotification] = useState<boolean>(true);

  /**
   * on language
   */
  const onLanguage = () => {
    navigator?.showBottomSheet({
      title: translate('change_language'),
      screen: () => (
        <SheetPicker
          data={Settings.languageSupport.map(i => {
            return {
              ...getNational(i),
              icon: (
                <Image source={getNational(i).icon} style={styles.iconTheme} />
              ),
            };
          })}
          selected={getNational(language)}
          onSelect={index => {
            navigator?.pop();
            applicationActions.onChangeLanguage(
              Settings.languageSupport[index],
            );
          }}
          renderItem={undefined}
        />
      ),
    });
  };

  /**
   * on notification
   */
  const onNotification = () => {
    const data = [
      {title: translate('on'), value: true},
      {title: translate('off'), value: false},
    ];
    navigator?.showBottomSheet({
      title: translate('notification'),
      screen: () => (
        <SheetPicker
          data={data}
          selected={{
            title: notification ? translate('on') : translate('off'),
            value: notification,
          }}
          onSelect={index => {
            navigator?.pop();
            setNotification(data[index].value);
          }}
          renderItem={undefined}
        />
      ),
    });
  };

  /**
   * on theme
   */
  const onTheme = () => {
    navigator?.push({screen: SettingTheme});
  };

  /**
   * on change domain
   */
  const onChangeDomain = () => {
    applicationActions.onChangeDomain(domain.current, () => {
      navigator?.reset({screen: Splash});
    });
  };

  /**
   * on dark mode
   */
  const onDarkMode = () => {
    const data = [
      {title: translate('always_on'), value: 'always_on'},
      {title: translate('always_off'), value: 'always_off'},
      {title: translate('system_theme'), value: 'system_theme'},
    ];
    navigator?.showBottomSheet({
      title: translate('dark_mode'),
      screen: () => (
        <SheetPicker
          data={data}
          selected={{
            title: translate(appearance),
            value: appearance,
          }}
          onSelect={index => {
            navigator?.pop();
            applicationActions.onDarkMode(data[index].value);
          }}
          renderItem={undefined}
        />
      ),
    });
  };

  /**
   * on font
   */
  const onFont = () => {
    navigator?.showBottomSheet({
      title: translate('font'),
      screen: () => (
        <SheetPicker
          data={Settings.fontSupport.map(i => {
            return {title: i, value: i};
          })}
          selected={{title: theme.font, value: theme.font}}
          onSelect={index => {
            navigator?.pop();
            applicationActions.onChangeFont(Settings.fontSupport[index]);
          }}
          renderItem={undefined}
        />
      ),
    });
  };

  /**
   * on domain
   */
  const onDomain = () => {
    domain.current = currentDomain;
    navigator?.showModal({
      screen: () => (
        <Popup
          title={translate('domain')}
          description={
            <Input
              defaultValue={domain.current}
              floatingValue={translate('domain')}
              placeholder={translate('input_domain')}
              onChangeText={value => {
                domain.current = value;
              }}
            />
          }
          primary={{
            title: translate('yes'),
            onPress: onChangeDomain,
          }}
          secondary={{
            title: translate('close'),
            onPress: () => {},
          }}
        />
      ),
    });
  };

  return (
    <Screen
      navigation={navigation}
      enableKeyboardAvoidingView={true}
      options={{title: translate('setting')}}
      style={Styles.paddingM}
      scrollable={true}>
      <View
        style={[
          Shadow.light,
          {
            backgroundColor: theme.colors.background.surface,
            padding: Spacing.M,
            borderRadius: Radius.M,
          },
        ]}>
        <ListTitle
          leading={
            <View style={[styles.icon, {backgroundColor: Colors.blue_08}]}>
              <Icon name={'web'} color={Colors.blue_04} />
            </View>
          }
          title={translate('language')}
          description={getNational(language).title}
          descriptionPosition={'right'}
          onPress={onLanguage}
        />
        <SizedBox height={Spacing.M} />
        <ListTitle
          leading={
            <View style={[styles.icon, {backgroundColor: Colors.red_08}]}>
              <Icon name={'bell-outline'} color={Colors.red_04} />
            </View>
          }
          title={translate('notification')}
          description={
            <Switch
              value={notification}
              onChange={() => setNotification(!notification)}
            />
          }
          descriptionPosition={'right'}
          onPress={onNotification}
        />
        <SizedBox height={Spacing.M} />
        <ListTitle
          leading={
            <View style={[styles.icon, {backgroundColor: Colors.violet_08}]}>
              <Icon name={'format-color-fill'} color={Colors.violet_04} />
            </View>
          }
          description={
            <View
              style={[
                styles.iconTheme,
                {backgroundColor: theme.colors.primary.default},
              ]}
            />
          }
          descriptionPosition={'right'}
          title={translate('theme')}
          onPress={onTheme}
        />
        <SizedBox height={Spacing.M} />
        <ListTitle
          leading={
            <View style={[styles.icon, {backgroundColor: Colors.indigo_08}]}>
              <Icon name={'brightness-4'} color={Colors.indigo_04} />
            </View>
          }
          description={translate(appearance)}
          descriptionPosition={'right'}
          title={translate('dark_mode')}
          onPress={onDarkMode}
        />
        <SizedBox height={Spacing.M} />
        <ListTitle
          leading={
            <View style={[styles.icon, {backgroundColor: Colors.gold_08}]}>
              <Icon name={'format-font'} color={Colors.gold_04} />
            </View>
          }
          title={translate('font')}
          description={theme.font}
          descriptionPosition={'right'}
          onPress={onFont}
        />
      </View>
      <SizedBox height={Spacing.M} />
      <View
        style={[
          Shadow.light,
          {
            backgroundColor: theme.colors.background.surface,
            padding: Spacing.M,
            borderRadius: Radius.M,
          },
        ]}>
        <ListTitle
          leading={
            <View style={[styles.icon, {backgroundColor: Colors.blue_08}]}>
              <Icon name={'web'} color={Colors.blue_04} />
            </View>
          }
          title={translate('domain')}
          description={currentDomain}
          descriptionPosition={'right'}
          onPress={onDomain}
        />
        <SizedBox height={Spacing.M} />
        <ListTitle
          leading={
            <View style={[styles.icon, {backgroundColor: Colors.gold_08}]}>
              <Icon name={'information-outline'} color={Colors.gold_04} />
            </View>
          }
          title={translate('version')}
          description={Settings.appVersion}
          descriptionPosition={'right'}
          onPress={() => {}}
        />
      </View>
    </Screen>
  );
};

export {Setting};
