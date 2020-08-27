In this article, I'm going to explain some ways to communicate between multiple applications and a particular way that I have chosen to use in my current project and work.

If you are not familiar with the `micro frontends` concept and architectures I suggest you take a look at these amazing articles:
- [martinflowler.com](https://martinfowler.com/articles/micro-frontends.html)
- [microfrontends.com](https://microfrontends.com/)
- [microfrontends.org](https://micro-frontends.org/)

There are several reasons for choosing a micro frontend architecture maybe your app has grown too much and there are so many teams coding on the same repo/codebase but one of the most common use cases is the decoupled logic of a certain domain of an App.

Following this logic, _a good architecture is one in which micro frontends are decoupled and do not need to frequently communicate_ but there are some things that micro frontends might share or communicate like functions, components, some logic or state.

### Sharing code
![Draw of a package](https://res.cloudinary.com/daiqkausy/image/upload/v1590444030/package_2_w842fw.png)

For functions, components and common logics could be placed on a third package and imported on each app

And for creating a package there are several approaches I won't deep dive on it, but I'll leave you some examples:
- [Small typescript library](https://www.tsmean.com/articles/how-to-write-a-typescript-library/)
- [React component library](https://blog.harveydelaney.com/creating-your-own-react-component-library/)
- [Component library with Lerna](https://claritydev.net/blog/building-component-library-with-docz-and-lerna/)

### Sharing state

But what about a shared state? Why would someone need to share state between multiple apps?

Let's use a real-world example, imagine this e-commerce:
![Ecommerce wireframe with the main app, cart, item details, advertising, and suggestion microfrontends](https://res.cloudinary.com/daiqkausy/image/upload/c_scale,w_800/v1590442756/ecommerce_1_svqcdc.png)

Each square represents a micro frontend with a specific domain or functionality and could be using any framework

![Ecommerce wireframe with two micro frontends pointing an arrow to the cart microfrontend](https://res.cloudinary.com/daiqkausy/image/upload/c_scale,w_800/v1590442758/full_ljpnls.png)

Adding some content we notice some parts of the app that might need to share some data or state like:

- Both item detail and suggested items might need to communicate and inform the cart when an item has been added
- The suggested items could use the current items in the cart to suggest another item based on some complex algorithms
- Item detail could show a message when the current item is already on the cart

_If two micro frontends are frequently passing state between each other, consider merging them. The disadvantages of micro frontends are enhanced when your micro frontends are not isolated modules._ this quote from [single-spa](https://single-spa.js.org/docs/recommended-setup#ui-state) docs it's awesome, maybe the suggested items could be merged with item detail but what if they really need to be in different apps?

Well for this use cases I have tried 5 different modes:
1. [Web Workers](#web-workers)
2. [Props and callbacks](#props-callbacks)
3. [Custom Events](#custom-events)
4. [Post Messages](#post-messages)
5. [Creating a new implementation](#windowed-observable)

### Web Workers <a name="web-workers"></a>

```javascript
TODO: Add my experience, pros, and cons
```

### Props and callbacks <a name="props-callbacks"></a>

```javascript
TODO: Add some react examples, pros, and cons
```

### Custom Events <a name="custom-events"></a>
```javascript
TODO: Add some examples, experience, pros, and cons
```

### Post Messages <a name="post-messages"></a>
```javascript
TODO: Add some examples, experience, pros, and cons
```

### Creating a new implementation <a name="windowed-observable"></a>

On this new era of "micro" services, apps and front ends there is one thing in common, distributed systems.

And looking at the microservices environment a pretty much popular communication mode is pub/subs queues just like the aws SQS and SNS services

Since every micro frontend and the container are at the `window`, I decided using the `window` to hold a global communication using a pub/sub implementation

So I created this library mixing two concerns pub/sub queues and Observables, called `windowed-observable`

Exposing an Observable and a name of your topic as a parameter, and use this observable to publish, retrieve, and listen to new events on it's topic

Common usage

```javascript
TODO: Add example
```

Retrieving last events

```javascript
TODO: Add example
```

React usage

```javascript
TODO: Add example
```

Creating your own abstraction using `windowed-observable`

```javascript
TODO: Add some text explaining why, and some examples
```


Pros
`TODO: Add some pros and a list`


Feel free to take a look and also use it <3
- [Github](https://github.com/luistak/windowed-observable)
- [NPM](https://www.npmjs.com/package/windowed-observable)


`TODO: Add source articles`
















