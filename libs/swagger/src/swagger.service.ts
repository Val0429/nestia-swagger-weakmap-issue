/*
 * File: swagger.service.ts
 * File Created: 2023-09-22 10:34:16
 * Author: Val Liu <valuis0429@gmail.com>
 *
 * -----
 * Last Modified: 2023-09-25 05:00:38
 * Modified By: Val Liu
 * -----
 */

import { AppHost } from "@app/app-host";
import { Injectable, Optional } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SwaggerModule } from "@nestjs/swagger";
import * as fs from "fs";
import NESTIA_CONFIG from "nestia.config";
import * as path from "path";

@Injectable()
export class SwaggerService {
    constructor(
        private readonly appHost: AppHost,
        @Optional() private readonly config: ConfigService,
    ) {}

    onModuleInit() {
        /// swagger output path should be defined
        const swaggerPath = NESTIA_CONFIG.swagger?.output;
        if (swaggerPath == undefined) {
            return;
        }
        const loc = path.resolve(swaggerPath);

        /// initial config only if swagger enable, and also file exists
        if (
            this.config &&
            this.config.get<boolean>("SWAGGER_ENABLE") &&
            fs.existsSync(loc)
        ) {
            const uri = this.config.get<string>("SWAGGER_URI") ?? "swagger";
            const docs = JSON.parse(fs.readFileSync(loc, "utf-8"));
            SwaggerModule.setup(uri, this.appHost.app, docs);
        }
    }
}
