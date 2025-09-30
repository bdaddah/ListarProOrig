import {RootState} from '@models+types';

export const domainSelect = (state: RootState) => state.application.domain;
export const settingSelect = (state: RootState) => state.application.setting;
export const themeSelect = (state: RootState) => state.application.theme;
export const deviceSelect = (state: RootState) => state.application.device;
export const fontSelect = (state: RootState) => state.application.font;
export const appearanceSelect = (state: RootState) => {
  return state.application.appearance;
};
export const languageSelect = (state: RootState) => state.application.language;
export const userSelect = (state: RootState) => state.authentication.user;
export const homeSelect = (state: RootState) => state.home;
export const discoverySelect = (state: RootState) => state.discovery;
export const blogSelect = (state: RootState) => state.blog;
export const wishlistSelect = (state: RootState) => state.wishlist;
export const searchSelect = (state: RootState) => state.search;
export const listingSelect = (state: RootState) => state.listing;
export const reviewSelect = (state: RootState) => state.review;
export const bookingSelect = (state: RootState) => state.booking;
export const bookingRequestSelect = (state: RootState) => state.booking.request;
