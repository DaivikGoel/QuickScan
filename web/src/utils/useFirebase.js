import { useEffect, useState } from 'react';
import getFirebase from './firebase'; // import our getFirebase function
import { onAuthStateChanged } from 'firebase/auth'

export function useFirebase() {
  const [instance, setInstance] = useState(null);

  useEffect(() => {
    setInstance(getFirebase());
  }, []);

  return instance;
}

export const useFBUser = () => {
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const firebase = getFirebase()
    const unlisten = onAuthStateChanged(firebase,
      authUser => {
        authUser
          ? setAuthUser(authUser)
          : setAuthUser(null);
      },
   );
   return () => {
       unlisten();
   }
  }, []);

  return authUser;
}