let said = [];

export function say(something) {
  console.log({ something, said });

  said.push(something)

  postMessage(something);
}