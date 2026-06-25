import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { AppModule } from "./app.module";
import fastifyCookie from "@fastify/cookie";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  //フロントエンドからのアクセスを許可
  app.enableCors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  const fastifyInstance = app.getHttpAdapter().getInstance();
  await fastifyInstance.register(fastifyCookie, {
    secret: "COOKIE_SIGN_SECRET_XYZ",
  });

  const port = Number(process.env.PORT ?? 4000);
  await app.listen(port, "0.0.0.0");
  // eslint-disable-next-line no-console
  console.log(`[bff] GraphQL ready at http://localhost:${port}/graphql`);
}

bootstrap();
