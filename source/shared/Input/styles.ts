import {StyleSheet} from 'react-native';
import {Radius, Spacing} from '../Consts';

export default StyleSheet.create({
  //input style
  input: {
    width: '100%',
    paddingLeft: Spacing.M,
    height: '100%',
  },
  wrapper: {
    width: '100%',
  },
  smallContainer: {
    borderRadius: Radius.S,
    borderWidth: 1,
    height: 48,
  },
  mediumContainer: {
    borderWidth: 1,
    borderRadius: Radius.S,
    height: 56,
  },
  largeContainer: {
    borderWidth: 1,
    borderRadius: Radius.S,
    height: 64,
  },
  floatingView: {
    position: 'absolute',
    top: -10,
    zIndex: 2,
    left: Spacing.S,
    paddingHorizontal: Spacing.S,
    flexDirection: 'row',
    borderRadius: Radius.XS,
  },
  floatingIcon: {marginLeft: Spacing.XS},
  errorIcon: {marginRight: Spacing.XS},
  errorView: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    overflow: 'hidden',
  },
  inputView: {
    justifyContent: 'space-between',
    flex: 1,
  },
  iconView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: Spacing.XS,
    marginRight: Spacing.M,
  },
  icon: {
    width: 24,
    height: 24,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  //text area style
  textAreaView: {
    flex: 1,
  },
  textArea: {
    paddingRight: Spacing.XS,
    paddingVertical: Spacing.XS,
    fontSize: 15,
  },
  textAreaWrapper: {
    borderWidth: 1,
    borderRadius: Radius.S,
    paddingVertical: Spacing.S,
    paddingLeft: Spacing.M,
    paddingRight: Spacing.S,
  },
  countingView: {
    position: 'absolute',
    bottom: Spacing.S,
    right: Spacing.S,
  },
  rowArea: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: Spacing.XS,
  },

  //SearchInput
  searchInputWrapper: {
    flexDirection: 'row',
    borderRadius: Radius.XL,
    alignItems: 'center',
    width: '100%',
  },
  searchInputSmall: {
    height: 32,
    marginLeft: Spacing.S,
    flex: 1,
    paddingVertical: Spacing.XS,
  },
  searchInputMedium: {
    height: 36,
    marginLeft: Spacing.S,
    flex: 1,
    paddingVertical: Spacing.XS,
  },
  searchInputLarge: {
    height: 48,
    marginLeft: Spacing.S,
    flex: 1,
    paddingVertical: Spacing.XS,
  },
  //MoneyInput
  moneyInput: {
    width: '100%',
    paddingLeft: Spacing.M,
    height: '100%',
    fontSize: 20,
    paddingVertical: Spacing.S,
    fontWeight: 'bold',
  },
  //OTP
  otpWrapper: {
    width: '100%',
    marginTop: Spacing.M,
  },
  otpInput: {
    height: 56,
    borderRadius: Radius.S,
    borderWidth: 1,
  },
  otpFloatingView: {
    position: 'absolute',
    top: -Spacing.S,
    alignSelf: 'center',
    paddingHorizontal: Spacing.S,
  },
  otpInputsView: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpTextInput: {
    opacity: 0,
  },
  otpCaret: {
    height: 15,
    width: 2,
    alignSelf: 'center',
  },
  otpItem: {width: 12, height: 1.5},
  otpContainer: {width: 12},
});
