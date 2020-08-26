let said = [];

export function say(message) {
  console.log({ message, said });

  said.push(message)

  postMessage(message);
}