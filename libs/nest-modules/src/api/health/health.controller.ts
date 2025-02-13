import { Controller, Get } from '@nestjs/common';

import { HealthService } from './health.service';

@Controller()
export class HealthController {
  constructor(private readonly service: HealthService) {}

  @Get('')
  health() {
    return this.service.health();
  }

  @Get('ping')
  ping() {
    return this.service.ping();
  }
}

export default HealthController;
