export default function assertExhaustiveSwitchError(_x: never): never {
  throw new Error('Unexpected assertion reached');
}
