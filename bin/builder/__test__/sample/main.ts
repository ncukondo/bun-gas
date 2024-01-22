import { hello } from "./module.ts";

/**
 * Just a simple function that says hello.
 * @param name 
 */
const sayHello = (name: string) => {
  console.log(`Hello ${name}!`);
}


export { sayHello, hello };
