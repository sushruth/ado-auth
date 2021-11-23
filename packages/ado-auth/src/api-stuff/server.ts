import chalk from "chalk";
import http, { Server } from "http";
import ora from "ora";
import { SERVER_TIMEOUT } from "../lib/constants";
import { CliOptions, Token } from "../lib/types";
import { logger } from "../logger/logger";
import { getJsonBody } from "./getJsonBody";

export function listenForTokenFromTheWebsite(config: CliOptions) {
  const spinner = ora({
    isEnabled: logger.debugEnabled,
    prefixText: logger.debugPrefix,
  });

  return new Promise<Token>((resolve, reject) => {
    const server: Server = http.createServer(async (req, res) => {
      if (!req.method) {
        // Probably just for typing. Do not respond if there is no method.
        return res.end();
      }

      res.setHeader("Access-Control-Allow-Origin", config.host);
      res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "content-type");

      if (/POST/i.test(req.method)) {
        const token = await getJsonBody<Token>(req);

        if (token && token.access_token) {
          res.setHeader("Content-Type", "application/json");
          resolve(token);
          clearTimeout(timeoutToReject);
          res.end(JSON.stringify({ status: "OK" }));

          spinner.succeed("Received the token");
          return server.close();
        }
      }

      res.writeHead(200);

      return res.end();
    });

    const timeoutToReject = setTimeout(() => {
      spinner.fail("Could not retrieve token within 60 seconds");

      reject(new Error("Token retrieval took too long"));

      return server.close();
    }, SERVER_TIMEOUT);

    logger.debug(
      "Started server at",
      chalk.bold.green(`http://localhost:${config.port}`)
    );
    server.listen(config.port);
    spinner.start("listening to POST request from the ado-auth site");
  });
}
