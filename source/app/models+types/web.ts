class WebViewModel {
  url: string;
  handlerUrl: string[];
  callbackUrl?: (url: string) => void;
  dismissOnHandle: boolean;
  title: string;
  clearCookie: boolean;

  constructor(data: any) {
    this.url = data.url ?? '';
    this.handlerUrl = data.handlerUrl ?? [];
    this.callbackUrl = data.callbackUrl;
    this.dismissOnHandle = data.dismissOnHandle ?? true;
    this.title = data.title ?? '';
    this.clearCookie = data.clearCookie ?? false;
  }
}

export {WebViewModel};
