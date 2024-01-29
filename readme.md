# useNextRouteEvent

`useNextRouteEvent` is a React hook designed to facilitate handling browser and page navigation events in Next.js applications. This hook provides an easy way to interact with Next.js Router events and respond to various browser events, like `beforeunload`, by executing custom handler functions.

## Installation

To install using NPM:

```
npm install use-next-route-event
```

To install using Yarn:

```
yarn add use-next-route-event
```

## Usage

Utilize the `useNextRouteEvent` hook to register handlers for Next.js router events. Here's a basic usage example:

```javascript
import useNavigationEvent from 'use-next-route-event';

function MyApp() {
  // Define your event handlers
  const eventHandlers = {
    onRouteChangeStart: (event) => {
      console.log('Route change started:', event);
    },
    onRouteChangeComplete: (event) => {
      console.log('Route change completed:', event);
    },
    onWindowBeforeUnload: (event) => {
      // Perform any necessary cleanup or checks before the window unloads
    }
  };

  // Use the hook in your component
  useNavigationEvent(eventHandlers);

  return (
    // Your component JSX
  );
}
```

## Future Plans

This package is based heavily on [tresorama/use-next-navigation-event](https://github.com/tresorama/use-next-navigation-event/) and will continue to evolve with additional code for handling a variety of browser events.

## License

This project is licensed under the MIT License.
