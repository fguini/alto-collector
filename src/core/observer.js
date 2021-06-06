export default function Observer() {
  let nextId = 1;
  const messages = [];
  const oneTimeSubscribers = [];
  const subscribers = [];

  function once(handler, receivePersisted = true) {
    oneTimeSubscribers.push(handler);
    if (receivePersisted && messages.length)
      messages.forEach(message => handler(message));
  }

  function subscribe(handler) {
    const id = nextId++;
    if (messages.length) messages.forEach(message => handler(message));
    subscribers.push({ id, handler });
    return id;
  }

  function unsubscribe(id) {
    const index = subscribers.findIndex(subscriber => subscriber.id === id);
    if (index > -1) subscribers.splice(index, 1);
  }

  function publish(message, persist) {
    if (persist) messages.push(message);
    if (subscribers.length)
      subscribers.forEach(subscriber => {
        try {
          subscriber.handler(message);
        } catch (error) {
          console.error('Error publishing to subscriber ', subscribers.id);
          unsubscribe(subscriber.id);
        }
      });
    if (oneTimeSubscribers.length) {
      oneTimeSubscribers.forEach(handler => {
        try {
          handler(message);
        } catch (error) {
          console.error('Error publishing to one time subscriber ');
        }
      });
      flushOneTimeSubscribersSubscribers();
    }
  }

  function flushMessages() {
    messages.splice(0);
  }

  function flushOneTimeSubscribersSubscribers() {
    oneTimeSubscribers.splice(0);
  }

  function flushSubscribers() {
    subscribers.splice(0);
    flushOneTimeSubscribersSubscribers();
  }

  function flush(emptySubscribers = true, emptyMessages = false) {
    if (emptySubscribers) flushSubscribers();
    if (emptyMessages) flushMessages();
  }

  function hasSubscribers() {
    return subscribers.length || oneTimeSubscribers.length;
  }

  return {
    flush,
    hasSubscribers,
    once,
    publish,
    subscribe,
    unsubscribe,
  };
}
