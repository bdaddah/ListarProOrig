import {Dimensions} from 'react-native';
import {useEffect, useState} from 'react';

const useGridSystem = () => {
  const [numberOfColumns, setNumberOfColumns] = useState(
    Dimensions.get('window').width > 600 ? 24 : 12,
  );

  useEffect(() => {
    const subscription: any = Dimensions.addEventListener('change', () => {
      const newColumns = Dimensions.get('window').width > 600 ? 24 : 12;
      if (newColumns !== numberOfColumns) {
        setNumberOfColumns(newColumns);
      }
    });
    return () => subscription?.remove();
  }, [numberOfColumns]);

  return {numberOfColumns, widthDevice: Dimensions.get('window').width};
};

export {useGridSystem};
