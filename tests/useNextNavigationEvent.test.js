import { renderHook } from '@testing-library/react-hooks';
import useNextNavigationEvent from '../src/useNavigationEvent';
import Router from 'next/router';

jest.mock('next/router', () => require('next-router-mock'));

describe('useNextNavigationEvent', () => {
  it('should handle route change start', () => {
    const onRouteChangeStart = jest.fn();
    const handlers = { onRouteChangeStart };

    renderHook(() => useNextNavigationEvent(handlers));
    Router.push('/new-page');

    expect(onRouteChangeStart).toHaveBeenCalledWith(expect.any(Object));
  });
});
