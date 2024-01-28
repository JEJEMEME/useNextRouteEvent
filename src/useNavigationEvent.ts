import { useEffect, useRef, useCallback } from 'react';
import Router from 'next/router';
import { LocalStorage } from './LocalStorage';

type NavigationType = 'BROWSER_HISTORY_NAVIGATION' | 'PAGE_CHANGE_NAVIGATION';

interface LastNavigationEvent {
  type: NavigationType;
  oldUrl: string;
}

interface NavigationEvent {
  type: NavigationType;
  oldUrl: string;
  newUrl: string;
  options?: any;
  shallow: boolean;
}

interface NavigationEventHandlers {
  onRouteChangeStart?: (event: NavigationEvent) => void;
  onRouteChangeComplete?: (event: NavigationEvent) => void;
  onWindowBeforeUnload?: (event: BeforeUnloadEvent) => void;
}

const useNextNavigationEvent = (handlers: NavigationEventHandlers) => {
  const handlersRef = useRef(handlers);
  const lastNavigationEventStorage = new LocalStorage<LastNavigationEvent>('lastNavigationEvent');

  const handleNavigationEvent = useCallback((type: NavigationType) => {
    return (url: string, options?: any, shallow = false) => {
      const lastEvent = lastNavigationEventStorage.retrieve() || {
        type: 'PAGE_CHANGE_NAVIGATION',
        oldUrl: ''
      };

      const navigationEvent: NavigationEvent = {
        type: lastEvent.type,
        oldUrl: lastEvent.oldUrl,
        newUrl: url,
        options,
        shallow,
      };

      lastNavigationEventStorage.save({ type, oldUrl: Router.asPath });

      if (type === 'PAGE_CHANGE_NAVIGATION') {
        handlersRef.current.onRouteChangeStart?.(navigationEvent);
      } else {
        handlersRef.current.onRouteChangeComplete?.(navigationEvent);
      }
    };
  }, []);

  useEffect(() => {
    const handleRouteChangeStart = handleNavigationEvent('PAGE_CHANGE_NAVIGATION');
    const handleRouteChangeComplete = handleNavigationEvent('BROWSER_HISTORY_NAVIGATION');

    Router.events.on('routeChangeStart', handleRouteChangeStart);
    Router.events.on('routeChangeComplete', handleRouteChangeComplete);

    const beforePopStateHandler = () => {
      handleNavigationEvent('BROWSER_HISTORY_NAVIGATION')(Router.asPath);
      return true;
    };
    Router.beforePopState(beforePopStateHandler);

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      handlersRef.current.onWindowBeforeUnload?.(event);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      Router.events.off('routeChangeStart', handleRouteChangeStart);
      Router.events.off('routeChangeComplete', handleRouteChangeComplete);
      Router.beforePopState(() => true);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [handleNavigationEvent]);

  return;
};

export default useNextNavigationEvent;
