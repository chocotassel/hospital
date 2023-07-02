class Snowflake {
  private sequence: number;
  private lastTimestamp: number;
  private workerId: number;
  private datacenterId: number;
  private twepoch: number;
  private readonly workerIdBits = 5;
  private readonly datacenterIdBits = 5;
  private readonly maxWorkerId = -1 ^ (-1 << this.workerIdBits);
  private readonly maxDatacenterId = -1 ^ (-1 << this.datacenterIdBits);
  private readonly sequenceBits = 12;
  private readonly workerIdShift = this.sequenceBits;
  private readonly datacenterIdShift = this.sequenceBits + this.workerIdBits;
  private readonly timestampLeftShift = this.sequenceBits + this.workerIdBits + this.datacenterIdBits;
  private readonly sequenceMask = -1 ^ (-1 << this.sequenceBits);

  constructor(workerId: number, datacenterId: number, sequence = 0) {
    // sanity check for workerId
    if (workerId > this.maxWorkerId || workerId < 0) {
      throw new Error('workerId can\'t be greater than maxWorkerId or less than 0');
    }

    // sanity check for datacenterId
    if (datacenterId > this.maxDatacenterId || datacenterId < 0) {
      throw new Error('datacenterId can\'t be greater than maxDatacenterId or less than 0');
    }

    this.twepoch = 1288834974657; // Thu, 04 Nov 2010 01:42:54 GMT
    this.sequence = sequence;
    this.workerId = workerId;
    this.datacenterId = datacenterId;
    this.lastTimestamp = -1;
  }

  nextId(): bigint {
    let timestamp = this.timeGen();

    if (timestamp < this.lastTimestamp) {
      throw new Error(`Clock moved backwards. Refusing to generate id for ${this.lastTimestamp - timestamp} milliseconds`);
    }

    if (this.lastTimestamp === timestamp) {
      this.sequence = (this.sequence + 1) & this.sequenceMask;
      if (this.sequence === 0) {
        timestamp = this.tilNextMillis(this.lastTimestamp);
      }
    } else {
      this.sequence = 0;
    }

    this.lastTimestamp = timestamp;

    return ((BigInt(timestamp) - BigInt(this.twepoch)) << BigInt(this.timestampLeftShift)) |
      (BigInt(this.datacenterId) << BigInt(this.datacenterIdShift)) |
      (BigInt(this.workerId) << BigInt(this.workerIdShift)) |
      BigInt(this.sequence);
  }

  private timeGen(): number {
    return Date.now();
  }

  private tilNextMillis(lastTimestamp: number): number {
    let timestamp = this.timeGen();
    while (timestamp <= lastTimestamp) {
      timestamp = this.timeGen();
    }
    return timestamp;
  }
}



const snowflake = {
  user: new Snowflake(1, 1, 0),
  department: new Snowflake(1, 2, 0),
  office: new Snowflake(1, 3, 0),
  doctor: new Snowflake(1, 4, 0),
  visit: new Snowflake(1, 5, 0),
  role: new Snowflake(1, 6, 0),
  permission: new Snowflake(1, 7, 0),
};
export default snowflake;