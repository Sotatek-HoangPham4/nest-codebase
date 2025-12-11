export abstract class BaseSeedTask {
  abstract run(): Promise<void>;
}
