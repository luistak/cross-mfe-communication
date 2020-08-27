In this article, I'm going to explain some ways to communicate between multiple applications and a particular way that I have chosen to use in my current project and work.

If you are not familiar with the `micro frontends` concept and architectures I suggest you take a look at these amazing articles:
- https://microfrontends.com
- https://micro-frontends.org
- https://martinfowler.com/articles/micro-frontends.html

There are several reasons for choosing a micro frontend architecture maybe your app has grown too much and there are so many teams coding on the same repo/codebase but one of the most common use cases is the decoupled logic of a certain domain of an App.

Following this logic, _a good architecture is one in which micro frontends are decoupled and do not need to frequently communicate_ but there are some things that micro frontends might share or communicate like functions, components, some logic or state.

### Sharing code
![Draw of a package](https://res.cloudinary.com/daiqkausy/image/upload/v1598440578/packages.png)

For functions, components and common logics could be placed on a third package and imported on each app.

And for creating a package there are several approaches I won't dive deep on it, but I'll leave you some examples:
- [Creating a simple typescript library](https://www.tsmean.com/articles/how-to-write-a-typescript-library/)
- [Creating a react component library](https://blog.harveydelaney.com/creating-your-own-react-component-library/)
- [Creating a component library with Lerna](https://claritydev.net/blog/building-component-library-with-docz-and-lerna/)
- [Using a Zero-config CLI for TypeScript package development (TSDX)](http://tsdx.io/)

### Sharing state

But what about a shared state? Why would someone need to share state between multiple apps?

Let's use a real-world example, imagine this e-commerce:
![Ecommerce wireframe with the main app, cart, item details, advertising, and suggestion microfrontends](https://res.cloudinary.com/daiqkausy/image/upload/c_scale,w_800/v1590442756/ecommerce_1_svqcdc.png)

Each square represents a micro frontend with a specific domain or functionality and could be using any framework.

![Ecommerce wireframe with two micro frontends pointing an arrow to the cart microfrontend](https://res.cloudinary.com/daiqkausy/image/upload/c_scale,w_800/v1590442758/full_ljpnls.png)

Adding some content we notice some parts of the app that might need to share some data or state like:

- Both item detail and suggested items might need to communicate and inform the cart when an item has been added
- The suggested items could use the current items in the cart to suggest another item based on some complex algorithms
- Item detail could show a message when the current item is already on the cart

_If two micro frontends are frequently passing state between each other, consider merging them. The disadvantages of micro frontends are enhanced when your micro frontends are not isolated modules._ this quote from [single-spa](https://single-spa.js.org/docs/recommended-setup#ui-state) docs it's awesome, maybe the suggested items could be merged with item detail but what if they need to be indifferent apps?

Well for those use cases I have tried 5 different modes:
1. [Web Workers](#web-workers)
2. [Props and callbacks](#props-callbacks)
3. [Custom Events](#custom-events)
4. [Pub Sub library(windowed-observable)](#windowed-observable)
5. [Custom implementation](#custom-implementation)

**Comparison table**
- ✅ 1st-class, built-in, and simple
- 💛 Good but could be better
- 🔶 Tricky and easy to mess up
- 🛑 Complex and difficult

|Criteria|Web workers|Props and callbacks|Custom Events|windowed-observable|Custom implementation|
|--- |--- |--- |--- |--- |--- |
|Setup|🛑|✅|✅|✅|🔶|
|Api|🔶|💛|💛|✅|🔶|
|Framework Agnostic|✅|✅|✅|✅|🔶|
|Customizable|✅|✅|✅|✅|🔶|

### Web Workers <a name="web-workers"></a>

I have created an example to illustrate a simple communication between two micro frontends with a dummy web worker using [`workerize-loader`](https://github.com/developit/workerize-loader) and [`create-micro-react-app`](https://github.com/matheusmr13/create-micro-react-app) also known as `crma` to setup the react micro frontends.

This example is a [`monorepo`](https://en.wikipedia.org/wiki/Monorepo) with 2 micro frontends, 1 container app, and a shared library exposing the worker.

#### Worker 📦
```js
let said = [];

export function say(message) {
  console.log({ message, said });

  said.push(message)

  // This postMessage communicates with everyone listening to this worker
  postMessage(message);
}
```

#### Container app
The container app is sharing the custom `worky` web worker.

```jsx
...
import worky from 'worky';

window.worky = worky;

...
```

You should be thinking 🤔
> But why don't you import this `worky` on every micro frontend?

When importing a library from the node_modules and using it in different apps every `worker.js` will have a different hash after bundled.

![worker debug](https://res.cloudinary.com/daiqkausy/image/upload/v1598454411/workers.png)

So each app will have a different worker since they're not the same, I'm sharing the same instance using the window but there are different approaches.

#### Microfrontend 1️⃣
```jsx
const { worky } = window;

function App() {
  const [messages, setMessages] = useState([]);

  const handleNewMessage = (message) => {
    if (message.data.type) {
      return;
    }

    setMessages((currentMessages) => currentMessages.concat(message.data));
  };

  useEffect(() => {
    worky.addEventListener('message', handleNewMessage);

    return () => {
      worky.removeEventListener('message', handleNewMessage)
    }
  }, [handleNewMessage]);

  return (
    <div className="MF">
      <h3>Microfrontend 1️⃣</h3>
      <p>New messages will be displayed below 👇</p>
      <div className="MF__messages">
        {messages.map((something, i) => <p key={something + i}>{something}</p>)}
      </div>
    </div>
  );
}
```

#### Microfrontend 2️⃣
```jsx
const { worky } = window;

function App() {
  const handleSubmit = (e) => {
    e.preventDefault();

    const { target: form } = e;
    const input = form?.elements?.something;
    
    worky.say(input.value);
    form.reset();
  }

  return (
    <div className="MF">
      <h3>Microfrontend 2️⃣</h3>
      <p>⌨️ Use this form to communicate with the other microfrontend</p>
      <form onSubmit={handleSubmit}>
        <input type="text" name="something" placeholder="Type something in here"/>
        <button type="submit">Communicate!</button>
      </form>
    </div>
  );
}
```

You can dive deep into this example in [this repository](https://github.com/luistak/cross-mfe-communication/tree/master/workerized).

#### Pros ✅
 - According to [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) *The advantage of this is that laborious processing can be performed in a separate thread, allowing the main (usually the UI) thread to run without being blocked/slowed down.*

#### Cons ❌
 - Complex setup
 - Verbose API
 - Difficult to share the same worker between multiple micro frontends without using a window

### Props and callbacks <a name="props-callbacks"></a>

When using react components you could always [lift the state](https://reactjs.org/docs/lifting-state-up.html) using props and callbacks, and this is an awesome approach to share small interactions between micro frontends.

I have created an example to illustrate a simple communication between two micro frontends using [`crma`](https://github.com/matheusmr13/create-micro-react-app) to set up the react micro frontends.

This example is a [`monorepo`](https://en.wikipedia.org/wiki/Monorepo) with 2 micro frontends and one container app.

#### Container app
I have lifted up the state to the container app and passed `messages` as a prop and `handleNewMessage` as a callback.

```jsx
const App = ({ microfrontends }) => {
  const [messages, setMessages] = useState([]);

  const handleNewMessage = (message) => {
    setMessages((currentMessages) => currentMessages.concat(message));
  };

  return (
    <main className="App">
      <div className="App__header">
        <h1>⚔️ Cross microfrontend communication 📦</h1>
        <p>Workerized example</p>
      </div>
      <div className="App__content">
        <div className="App__content-container">
          {
            Object.keys(microfrontends).map(microfrontend => (
              <Microfrontend
                key={microfrontend}
                microfrontend={microfrontends[microfrontend]}
                customProps={{
                  messages,
                  onNewMessage: handleNewMessage,
                }}
              />
            ))
          }
        </div>
      </div>
    </main>
  );
}
```

#### Microfrontend 1️⃣
```jsx
function App({ messages = [] }) {
  return (
    <div className="MF">
      <h3>Microfrontend 1️⃣</h3>
      <p>New messages will be displayed below 👇</p>
      <div className="MF__messages">
        {messages.map((something, i) => <p key={something + i}>{something}</p>)}
      </div>
    </div>
  );
}
```

#### Microfrontend 2️⃣
```jsx
function App({ onNewMessage }) {
  const handleSubmit = (e) => {
    e.preventDefault();

    const { target: form } = e;
    const input = form?.elements?.something;
    
    onNewMessage(input.value);
    form.reset();
  }

  ...
}
```

You can dive deep into this example in [this repository](https://github.com/luistak/cross-mfe-communication/tree/master/propsandcallbacks).

#### Pros ✅
 - Simple api
 - Simple setup
 - Customizable

#### Cons ❌
 - Difficult to set up when there are multiple frameworks(Vue, angular, react, svelte)
 - Whenever a property changes the whole micro frontend will be rerendered

### Custom Events <a name="custom-events"></a>
Using Synthetic events is one of the most common ways to communicate using `eventListeners` and [`CustomEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).

I have created an example to illustrate a simple communication between two micro frontends, this example is a [`monorepo`](https://en.wikipedia.org/wiki/Monorepo) with 2 micro frontends and 1 container app using [`crma`](https://github.com/matheusmr13/create-micro-react-app) to set up the react micro frontends.

#### Microfrontend 1️⃣
```jsx
function App() {
  const [messages, setMessages] = useState([]);

  const handleNewMessage = (event) => {
    setMessages((currentMessages) => currentMessages.concat(event.detail));
  };

  useEffect(() => {  
    window.addEventListener('message', handleNewMessage);

    return () => {
      window.removeEventListener('message', handleNewMessage)
    }
  }, [handleNewMessage]);

  ...
}
```

#### Microfrontend 2️⃣
```jsx
function App({ onNewMessage }) {
  const handleSubmit = (e) => {
    e.preventDefault();

    const { target: form } = e;
    const input = form?.elements?.something;
    
    const customEvent = new CustomEvent('message', { detail: input.value });
    window.dispatchEvent(customEvent)
    form.reset();
  }

  ...
}
```

You can dive deep into this example in [this repository](https://github.com/luistak/cross-mfe-communication/tree/master/customEvents).

#### Pros ✅
 - Simple Setup
 - Customizable
 - Framework agnostic
 - Micro frontends don’t need to know their parents

#### Cons ❌
 - Verbose custom events api

### Windowed observable <a name="windowed-observable"></a>

In this new era of "micro" services, apps, and frontends there is one thing in common, distributed systems.
And looking at the microservices environment a pretty much popular communication mode is pub/subs queues just like the AWS SQS and SNS services.
Since every micro frontend and the container are at the `window`, I decided using the `window` to hold a global communication using a pub/sub implementation, so I created this library mixing two concerns pub/sub-queues and Observables, called [`windowed-observable`](https://github.com/luistak/windowed-observable).

Exposing an Observable attached to a topic to publish, retrieve, and listen to new events on its topic.

Common usage

```javascript
import { Observable } from 'windowed-observable';

// Define a specific context namespace
const observable = new Observable('cart-items');

const observer = (item) => console.log(item);

// Add an observer subscribing to new events on this observable
observable.subscribe(observer)

// Unsubscribing
observable.unsubscribe(observer);

...

// On the publisher part of the app
const observable = new Observable('cart-items');
observable.publish({ id: 1234, name: 'Mouse Gamer XyZ', quantity: 1 });
```

In this library there are more features like retrieving the latest event published, getting a list with every event, clearing every event, and more!

Using `windowed-observable` on the same app example:

#### Microfrontend 1️⃣
```jsx

const observable = new Observable('messages');

function App() {
  const [messages, setMessages] = useState([]);

  const handleNewMessage = (newMessage) => {
    setMessages((currentMessages) => currentMessages.concat(newMessage));
  };

  useEffect(() => {  
    observable.subscribe(handleNewMessage);

    return () => {
      observable.unsubscribe(handleNewMessage)
    }
  }, [handleNewMessage]);

  ...
}
```

#### Microfrontend 2️⃣
```jsx
function App() {
  const handleSubmit = (e) => {
    e.preventDefault();

    const { target: form } = e;
    const input = form?.elements?.something;
    observable.publish(input.value);
    form.reset();
  }

  ...
}
```

You can dive deep in those examples in [this repository](https://github.com/luistak/windowed-observable).

Feel free to take a look and also use it ❤️
- [windowed-observable](https://github.com/luistak/windowed-observable)
- [react-windowed-observable](https://github.com/luistak/windowed-observable/tree/master/packages/react)

#### Pros ✅
 - Simple api
 - Simple setup
 - Pretty much customizable
 - Namespace events isolation
 - Extra features to retrieve dispatched events
 - Open source ❤️

### Custom implementation <a name="custom-implementation"></a>

After all of these examples you could also merge some of them and create your custom implementation, using **your abstractions** encapsulating your app needs, but these options could be tricky and easy to mess up.

## Conclusion
There is no perfect or best solution, my suggestion is to [avoid hasty abstractions](https://kentcdodds.com/blog/aha-programming/) and tries to use the simplest solution like props and callbacks if it does not suit to your needs try the other one until it feels good!

Comment below which one you prefer and why 🚀