import { useEffect, useState } from 'react';
import getFirebase from './firebase'; // import our getFirebase function

export default function useFirebase() {
  const [instance, setInstance] = useState(null);

  useEffect(() => {
    setInstance(getFirebase());
  }, []);

  return instance;
}