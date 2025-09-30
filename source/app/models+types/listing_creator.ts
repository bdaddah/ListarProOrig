import React from 'react';
import {
  ProductDetail1,
  ProductDetail2,
  ProductDetail3,
  ProductDetail4,
  ProductDetailDefault,
} from '@screens';

interface ListingStyleFactory {
  createProductDetail(): React.ElementType;
}

class ListingCreator {
  type: string;

  constructor(type: string) {
    this.type = type;
  }

  create(): ListingStyleFactory {
    switch (this.type) {
      case 'professional_1':
        return new Professional1();
      case 'professional_2':
        return new Professional2();
      case 'professional_3':
        return new Professional3();
      case 'professional_4':
        return new Professional4();
      default:
        return new BasicStyle();
    }
  }
}

class BasicStyle implements ListingStyleFactory {
  createProductDetail() {
    return ProductDetailDefault;
  }
}

class Professional1 implements ListingStyleFactory {
  createProductDetail() {
    return ProductDetail1;
  }
}

class Professional2 implements ListingStyleFactory {
  createProductDetail() {
    return ProductDetail2;
  }
}

class Professional3 implements ListingStyleFactory {
  createProductDetail() {
    return ProductDetail3;
  }
}

class Professional4 implements ListingStyleFactory {
  createProductDetail() {
    return ProductDetail4;
  }
}

export {ListingCreator};
