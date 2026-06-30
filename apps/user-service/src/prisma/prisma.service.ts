import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
<<<<<<< HEAD
import { PrismaClient } from "../../node_modules/.prisma/client";
=======
import { PrismaClient } from "../../src/generated/client";
>>>>>>> 5cdad52d7ee095ff09da183eb6165ae5dfd3813f

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
