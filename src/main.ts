import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import   morgan from "morgan"
import chalk from "chalk";

export const morganMiddleware = morgan(function (tokens, req, res) {
	const error = "#ff4757"
	const time = "#ff4757"
	if (tokens.status(req, res) >= 400)
		return [
			"\n",
			chalk.hex("#ff4757").bold(">>>>>"),
			chalk.hex("#ffb142").bold("[" + tokens.method(req, res) + "]"),
			chalk.hex("#ff4757").bold(tokens.status(req, res)),
			chalk.hex("#ff4757")(tokens.url(req, res)),
			chalk.hex("#ff4757").bold(tokens["response-time"](req, res) + " ms"),
			chalk.hex("#ff4757").bold("@ " + tokens.date(req, res)),
			/* chalk.yellow(tokens["remote-addr"](req, res)), */
			/* chalk.hex("#ff4757").bold("from " + tokens.referrer(req, res)), */
			/* chalk.hex("#F4D58D")(tokens["user-agent"](req, res)), */
		].join(" ")

	return [
		"\n",
		chalk.hex("#2ed573").bold(">>>>>"),
		chalk.hex("#34ace0").bold("[" + tokens.method(req, res) + "]"),
		chalk.hex("#ffb142").bold(tokens.status(req, res)),
		chalk.hex("#2ed573")(tokens.url(req, res)),
		chalk.hex("#2ed573").bold(tokens["response-time"](req, res) + " ms"),
		chalk.hex("#f78fb3").bold("@ " + tokens.date(req, res)),
		/* 	chalk.yellow(tokens["remote-addr"](req, res)), */
		/* chalk.hex("#fffa65").bold("from " + tokens.referrer(req, res)), */
		/* 	chalk.hex("#1e90ff")(tokens["user-agent"](req, res)), */
	].join(" ")
})
async function bootstrap() {
  const app = await NestFactory.create(AppModule,{
   });

	app.use(morganMiddleware)
  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3011);
}
bootstrap();
