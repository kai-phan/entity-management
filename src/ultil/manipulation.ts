import { This } from './entity.ts';

export class Manipulation {
  update<Instance extends This<typeof Manipulation>>(
    this: Instance,
    data: Partial<Instance>,
  ): Instance {
    return Object.assign(this, data);
  }
}
