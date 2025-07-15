export default function assertExhaustiveSwitchError(x: never): never {
  throw new Error(`Unexpected assertion reached: ${x}`);
}
