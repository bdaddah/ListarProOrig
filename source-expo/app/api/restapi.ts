import {DownloadParams, GetParams, PostParams} from '@models+types';
import axios, {AxiosInstance} from 'axios';
import * as FileSystem from 'expo-file-system';
import {
  authenticationActions,
  deviceSelect,
  domainSelect,
  store,
  userSelect,
} from '@redux';
import {getCurrentLocation, getFileName, getFilePath} from '@utils';
import {DownloadProgressData} from 'expo-file-system/src/FileSystem.types';

const getToken = () => userSelect(store.getState())?.token;
const getDevice = () => deviceSelect(store.getState());
const getDomain = () => domainSelect(store.getState());

/**
 * https service
 */

class HTTP {
  private http: AxiosInstance;
  private exceptionCode: string[];

  constructor() {
    this.http = this.setupInterceptors();
    this.exceptionCode = ['jwt_auth_bad_iss', 'jwt_auth_invalid_token'];
  }

  /**
   * setup member axios
   *
   * @returns
   * @memberof Api
   */
  setupInterceptors() {
    const api = axios.create({
      timeout: 30000,
    });
    api.interceptors.request.use(
      config => {
        const token = getToken();
        const device = getDevice();
        if (!config.baseURL) {
          config.baseURL = `${getDomain()}/wp-json`;
        }
        console.log('Before Request >>>', config);
        // Add more config before request
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        if (device) {
          config.headers['Device-Id'] = device.deviceId;
          config.headers['Device-Model'] = device.model;
          config.headers['Device-Version'] = device.systemVersion;
          config.headers['Device-Token'] = device.token;
          config.headers.Type = device.systemName;
        }
        return config;
      },
      error => {
        console.log('Error Request >>>', error);
        // Do something with response error
        return error;
      },
    );

    api.interceptors.response.use(
      response => {
        console.log('After Response >>>', response);
        // process more after response
        return response;
      },
      error => {
        console.log('Error Response >>>', error);
        // process more when exception
        const code = error.response?.data?.code;
        if (code && this.exceptionCode.includes(code)) {
          require('./index').default.navigator?.popToTop();
          store.dispatch(authenticationActions.onLogout());
        }
        return Promise.reject(error);
      },
    );
    return api;
  }

  /**
   * get method
   * @param endPoint
   * @param params
   * @param headers
   * @param responseType
   * @param loading
   * @param gps
   * @returns {Promise<unknown>}
   */
  async get(
    endPoint: string,
    {params, headers, responseType, loading = false, gps = false}: GetParams,
  ): Promise<unknown> {
    const requestHeaders = headers ?? {};
    if (loading) {
      require('./index').default.navigator?.showLoading({duration: 30000});
    }
    if (gps) {
      const location = await getCurrentLocation();
      requestHeaders.Latitude = location?.latitude;
      requestHeaders.Longitude = location?.longitude;
    }
    try {
      const response = await this.http.get(endPoint, {
        params: params ?? {},
        headers: requestHeaders,
        responseType: responseType ?? 'json',
      });
      if (loading) {
        require('./index').default.navigator?.hideLoading();
      }
      return Promise.resolve(response.data);
    } catch (error) {
      if (loading) {
        require('./index').default.navigator?.hideLoading();
      }
      return Promise.reject(error);
    }
  }

  /**
   * post method
   * @param endPoint
   * @param params
   * @param headers
   * @param loading
   * @param gps
   * @param onProgress
   * @returns {Promise<unknown>}
   */
  async post(
    endPoint: string,
    {params, headers, loading = false, gps = false, onProgress}: PostParams,
  ): Promise<unknown> {
    const requestHeaders = headers ?? {};
    if (loading) {
      require('./index').default.navigator?.showLoading({duration: 30000});
    }
    if (gps) {
      const location = await getCurrentLocation();
      requestHeaders.Latitude = location?.latitude;
      requestHeaders.Longitude = location?.longitude;
    }
    try {
      const response = await this.http.post(endPoint, params, {
        headers: requestHeaders,
        onUploadProgress: event => {
          const percent = (event.loaded / (event.total as number)) * 100;
          onProgress?.(percent);
        },
      });
      if (loading) {
        require('./index').default.navigator?.hideLoading();
      }

      return Promise.resolve(response.data);
    } catch (error) {
      if (loading) {
        require('./index').default.navigator?.hideLoading();
      }
      return Promise.reject(error);
    }
  }

  /**
   * upload method
   * @param endPoint
   * @param params
   * @param headers
   * @param loading
   * @param onProgress
   * @returns {Promise<unknown>}
   */
  async download(
    endPoint: string,
    {headers, loading = false, onProgress}: DownloadParams,
  ): Promise<unknown> {
    if (loading) {
      require('./index').default.navigator?.showLoading({duration: 30000});
    }

    try {
      const fileName = getFileName(endPoint) ?? Date.now().toString();
      const storePath = getFilePath(fileName);
      const callback = (result: DownloadProgressData) => {
        onProgress?.(
          (result.totalBytesWritten / result.totalBytesExpectedToWrite) * 100,
        );
      };
      const file = FileSystem.createDownloadResumable(
        endPoint,
        storePath,
        {headers},
        callback,
      );
      await file.downloadAsync();
      if (loading) {
        require('./index').default.navigator?.hideLoading();
      }
      return Promise.resolve(storePath);
    } catch (e) {
      if (loading) {
        require('./index').default.navigator?.hideLoading();
      }
      return Promise.reject(e);
    }
  }
}

/**
 * restful api application
 */
export default class RestAPI {
  private http: HTTP;
  private endPoints = {
    login: '/jwt-auth/v1/token',
    authValidate: '/jwt-auth/v1/token/validate',
    user: '/listar/v1/auth/user',
    register: '/listar/v1/auth/register',
    forgotPassword: '/listar/v1/auth/reset_password',
    changeProfile: '/wp/v2/users/me',
    setting: '/listar/v1/setting/init',
    submitSetting: '/listar/v1/place/form',
    home: '/listar/v1/home/init',
    homeWidget: '/listar/v1/home/widget',
    categories: '/listar/v1/category/list',
    discovery: '/listar/v1/category/list_discover',
    withLists: '/listar/v1/wishlist/list',
    addWishList: '/listar/v1/wishlist/save',
    removeWishList: '/listar/v1/wishlist/remove',
    clearWithList: '/listar/v1/wishlist/reset',
    listing: '/listar/v1/place/list',
    deleteProduct: '/listar/v1/place/delete',
    authorList: '/listar/v1/author/listing',
    authorInfo: '/listar/v1/author/overview',
    authorReview: '/listar/v1/author/comments',
    tags: '/listar/v1/place/terms',
    comments: '/listar/v1/comments',
    saveComment: '/wp/v2/comments',
    product: '/listar/v1/place/view',
    saveProduct: '/listar/v1/place/save',
    locations: '/listar/v1/location/list',
    upload: '/wp/v2/media',
    bookingForm: '/listar/v1/booking/form',
    calcPrice: '/listar/v1/booking/cart',
    order: '/listar/v1/booking/order',
    bookingDetail: '/listar/v1/booking/view',
    bookingList: '/listar/v1/booking/list',
    bookingRequestList: '/listar/v1/author/booking',
    bookingCancel: '/listar/v1/booking/cancel_by_id',
    bookingAccept: '/listar/v1/booking/accept_by_id',
    claim: '/listar/v1/claim/submit',
    claimList: '/listar/v1/claim/list',
    claimDetail: '/listar/v1/claim/view',
    claimPay: '/listar/v1/claim/pay',
    claimCancel: '/listar/v1/claim/cancel_by_id',
    claimAccept: '/listar/v1/claim/accept_by_id',
    payment: '/listar/v1/setting/payment',
    blog: '/listar/v1/post/home',
    blogDetail: '/listar/v1/post/view',
    getOTP: '/listar/v1/auth/otp',
    deactivate: '/listar/v1/auth/deactivate',
  };

  constructor() {
    this.http = new HTTP();
  }

  getSetting = () => {
    return this.http.get(this.endPoints.setting, {});
  };

  getHome = () => {
    return this.http.get(this.endPoints.home, {});
  };

  getHomeWidget = (args: GetParams) => {
    return this.http.get(this.endPoints.homeWidget, {...args, gps: true});
  };

  getDiscovery = () => {
    return this.http.get(this.endPoints.discovery, {});
  };

  getBlog = (args: GetParams) => {
    return this.http.get(this.endPoints.blog, args);
  };

  getBlogDetail = (args: GetParams) => {
    return this.http.get(this.endPoints.blogDetail, args);
  };

  getCategory = (args: GetParams) => {
    return this.http.get(this.endPoints.categories, args);
  };

  getLocation = (args: GetParams) => {
    return this.http.get(this.endPoints.locations, {...args, gps: true});
  };

  getWishList = (args: GetParams) => {
    return this.http.get(this.endPoints.withLists, args);
  };

  addWishList = (args: PostParams) => {
    return this.http.post(this.endPoints.addWishList, {...args, loading: true});
  };

  getListing = (args: GetParams) => {
    return this.http.get(this.endPoints.listing, {...args, gps: true});
  };

  clearWishList = () => {
    return this.http.post(this.endPoints.clearWithList, {
      loading: true,
    });
  };

  removeWishList = (args: PostParams) => {
    return this.http.post(this.endPoints.removeWishList, {
      ...args,
      loading: true,
    });
  };

  login = (args: PostParams) => {
    return this.http.post(this.endPoints.login, {
      ...args,
      headers: {'Content-Type': 'multipart/form-data'},
      loading: true,
    });
  };

  forgotPassword = (args: PostParams) => {
    return this.http.post(this.endPoints.forgotPassword, {
      ...args,
      headers: {'Content-Type': 'multipart/form-data'},
      loading: true,
    });
  };

  register = (args: PostParams) => {
    return this.http.post(this.endPoints.register, {
      ...args,
      headers: {'Content-Type': 'multipart/form-data'},
      loading: true,
    });
  };

  editProfile = (args: PostParams) => {
    return this.http.post(this.endPoints.changeProfile, {
      ...args,
      headers: {'Content-Type': 'multipart/form-data'},
      loading: true,
    });
  };

  getUser = (args: GetParams) => {
    return this.http.get(this.endPoints.user, args);
  };

  getReview = (args: GetParams) => {
    return this.http.get(this.endPoints.comments, args);
  };

  saveReview = (args: PostParams) => {
    return this.http.post(this.endPoints.saveComment, {
      ...args,
      headers: {'Content-Type': 'multipart/form-data'},
      loading: true,
    });
  };

  validateToken = () => {
    return this.http.post(this.endPoints.authValidate, {});
  };

  changePassword = (args: PostParams) => {
    return this.http.post(this.endPoints.changeProfile, {
      ...args,
      loading: true,
    });
  };

  requestOTP = (args: PostParams) => {
    return this.http.post(this.endPoints.getOTP, {...args, loading: true});
  };

  deactivateAccount = (args: PostParams) => {
    return this.http.post(this.endPoints.deactivate, {...args, loading: true});
  };

  deleteProduct = (args: PostParams) => {
    return this.http.post(this.endPoints.deleteProduct, {
      ...args,
      loading: true,
    });
  };

  getProduct = (args: GetParams) => {
    return this.http.get(this.endPoints.product, {...args, gps: true});
  };

  getAuthorList = (args: PostParams) => {
    return this.http.get(this.endPoints.authorList, args);
  };

  getAuthorReview = (args: GetParams) => {
    return this.http.get(this.endPoints.authorReview, args);
  };

  getBookingList = (args: GetParams) => {
    return this.http.get(this.endPoints.bookingList, args);
  };

  getRequestBookingList = (args: GetParams) => {
    return this.http.get(this.endPoints.bookingRequestList, args);
  };

  getBookingDetail = (args: GetParams) => {
    return this.http.get(this.endPoints.bookingDetail, {
      ...args,
      loading: true,
    });
  };

  cancelBooking = (args: PostParams) => {
    return this.http.post(this.endPoints.bookingCancel, {
      ...args,
      loading: true,
    });
  };

  acceptBooking = (args: PostParams) => {
    return this.http.post(this.endPoints.bookingAccept, {
      ...args,
      loading: true,
    });
  };

  bookingCalcPrice = (args: PostParams) => {
    return this.http.post(this.endPoints.calcPrice, {...args, loading: true});
  };

  bookingOrder = (args: PostParams) => {
    return this.http.post(this.endPoints.order, {...args, loading: true});
  };

  getBookingForm = (args: GetParams) => {
    return this.http.get(this.endPoints.bookingForm, {...args, loading: true});
  };

  getSubmitSetting = (args: GetParams) => {
    return this.http.get(this.endPoints.submitSetting, args);
  };

  submitListing = (args: PostParams) => {
    return this.http.post(this.endPoints.saveProduct, {
      ...args,
      headers: {'Content-Type': 'multipart/form-data'},
      loading: true,
    });
  };

  submitClaim = (args: PostParams) => {
    return this.http.post(this.endPoints.claim, {...args, loading: true});
  };

  getClaimList = (args: GetParams) => {
    return this.http.get(this.endPoints.claimList, args);
  };

  getClaimDetail = (args: GetParams) => {
    return this.http.get(this.endPoints.claimDetail, {
      ...args,
      loading: true,
    });
  };

  cancelClaim = (args: PostParams) => {
    return this.http.post(this.endPoints.claimCancel, {
      ...args,
      loading: true,
    });
  };

  acceptClaim = (args: PostParams) => {
    return this.http.post(this.endPoints.claimAccept, {
      ...args,
      loading: true,
    });
  };

  paymentClaim = (args: PostParams) => {
    return this.http.post(this.endPoints.claimPay, {
      ...args,
      loading: true,
    });
  };

  getPayment = () => {
    return this.http.get(this.endPoints.payment, {
      loading: true,
    });
  };

  getTags = (args: GetParams) => {
    return this.http.get(this.endPoints.tags, args);
  };

  uploadMedia = (args: PostParams) => {
    return this.http.post(this.endPoints.upload, {
      ...args,
      headers: {'Content-Type': 'multipart/form-data'},
    });
  };

  downloadFile = (url: string, args: PostParams) => {
    return this.http.download(url, args);
  };
}
