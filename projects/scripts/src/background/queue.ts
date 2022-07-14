import PQueue from 'p-queue';

const QUEUE = new PQueue({ concurrency: 1 });

export default QUEUE;
