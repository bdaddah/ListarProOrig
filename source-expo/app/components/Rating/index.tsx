import React from 'react';
import {AirbnbRating} from 'react-native-ratings';

type RatingProps = {
  rate: number;
  size?: number;
  disabled?: boolean;
  onFinishRating?: (rate: number) => void;
};

const Rating: React.FC<RatingProps> = ({
  rate,
  size = 12,
  disabled,
  onFinishRating,
}) => {
  const more = {starStyle: {margin: size / 10}};
  return (
    <AirbnbRating
      count={5}
      size={size}
      defaultRating={rate}
      showRating={false}
      isDisabled={disabled}
      onFinishRating={onFinishRating}
      {...more}
    />
  );
};

export {Rating};
