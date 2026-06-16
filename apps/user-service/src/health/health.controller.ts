import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

interface PingRequest {
  message: string;
}

interface PingReply {
  message: string;
  service: string;
}

@Controller()
export class HealthController {
  // health.proto の service Health / rpc Ping に対応する gRPC ハンドラ。
  @GrpcMethod('Health', 'Ping')
  ping(data: PingRequest): PingReply {
    return {
      message: `pong (received: ${data.message ?? ''})`.trim(),
      service: 'user-service',
    };
  }
}
