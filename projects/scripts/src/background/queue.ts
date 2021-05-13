import PQueue from 'p-queue';

const QUEUE = new PQueue({ concurrency: 1 });

export enum QueuePriority {
  PDV = 0,
  Charon = 1,
}

export default QUEUE;
