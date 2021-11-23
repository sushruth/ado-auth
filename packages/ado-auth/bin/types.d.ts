#!/usr/bin/env node
/// <reference types="node" />
declare module "src/lib/constants" {
    export const SERVER_TIMEOUT = 60000;
    export const SERVER_PORT = 35287;
    export const DEFAULT_HOST = "https://ado-auth.vercel.app";
    export const CLIENT_ID = "54DC9EFD-680A-4B1E-8066-D669BC6A5D09";
    export const AUTH_DELIMITER = ":_authToken=";
}
declare module "src/lib/types" {
    export type Token = {
        access_token?: string;
        token_type?: string;
        refresh_token?: string;
        expires_in?: string;
    };
    export enum AdoAuthApiResponseTypes {
        NO_RESULT = "NO_RESULT",
        NO_TOKENS = "NO_TOKENS",
        MISSING_CODE = "MISSING_CODE",
        MISSING_SECRET = "MISSING_SECRET",
        ADO_REQUEST_ERROR = "ADO_REQUEST_ERROR",
        SUCCESS = "SUCCESS"
    }
    export type AdoAuthApiResponse = {
        code: AdoAuthApiResponseTypes.NO_RESULT;
        error: string;
    } | {
        code: AdoAuthApiResponseTypes.NO_TOKENS;
        error: string;
        body?: Token;
    } | {
        code: AdoAuthApiResponseTypes.MISSING_CODE;
        message: string;
    } | {
        code: AdoAuthApiResponseTypes.MISSING_SECRET;
        message: string;
    } | {
        code: AdoAuthApiResponseTypes.ADO_REQUEST_ERROR;
        error: string;
        body?: {
            message?: string;
            stack?: string;
        };
    } | {
        code: AdoAuthApiResponseTypes.SUCCESS;
        body: Token;
    };
    export type TokenStore = Token & {
        expires_on: string;
    };
    export type YarnRcRegistryPart = {
        npmRegistries?: {
            [K in string]?: {
                npmAlwaysAuth?: boolean;
                npmAuthToken?: string;
            };
        };
    };
    export type CliOptions = {
        debug?: boolean;
        port: string;
        host: string;
        clientId: string;
    };
}
declare module "src/lib/writeAdoRc" {
    import { Token } from "src/lib/types";
    export function writeAdoRc(rcPath: string, response: Token): void;
}
declare module "src/logger/logger" {
    class Logger {
        debugEnabled: boolean;
        debugPrefix: string;
        enableDebug: () => void;
        disableDebug: () => void;
        debug: (message?: unknown, ...optionalParams: unknown[]) => void;
    }
    export const logger: Logger;
}
declare module "src/api-stuff/getJsonBody" {
    import { IncomingMessage } from 'http';
    export function getJsonBody<D>(req: IncomingMessage): Promise<D | undefined>;
}
declare module "src/api-stuff/server" {
    import { CliOptions, Token } from "src/lib/types";
    export function listenForTokenFromTheWebsite(config: CliOptions): Promise<Token>;
}
declare module "src/api-stuff/auth" {
    import { CliOptions } from "src/lib/types";
    export function auth(rcPath: string, config: CliOptions): Promise<import("src/lib/types").Token>;
}
declare module "src/api-stuff/simpleFetch" {
    import https from 'https';
    export function simpleFetchJson<ResponseData, RequestBody = unknown>(url: string, method: https.RequestOptions['method'], bodyObject: RequestBody): Promise<ResponseData | undefined>;
}
declare module "src/api-stuff/refetch" {
    import { CliOptions, TokenStore } from "src/lib/types";
    export function refetch(data: TokenStore, rcPath: string, config: CliOptions): Promise<import("src/lib/types").Token | undefined>;
}
declare module "src/file-stuff/prepare.types" {
    import { TokenStore } from "src/lib/types";
    export enum PrepareTypes {
        refetch = 0,
        fetch = 1,
        noop = 2
    }
    export type PrepareReturn = {
        type: PrepareTypes.refetch;
        data: TokenStore;
    } | {
        type: PrepareTypes.fetch;
    } | {
        type: PrepareTypes.noop;
        data: TokenStore;
    };
}
declare module "src/file-stuff/prepare" {
    import { PrepareReturn } from "src/file-stuff/prepare.types";
    export function prepare(rcPath: string): PrepareReturn;
}
declare module "src/write-rc/npmrc" {
    import { Token } from "src/lib/types";
    type WriteNpmrcParams = {
        npmrcPath: string;
        registries: Set<string>;
        token: Token;
    };
    export function writeNpmrc({ npmrcPath, registries, token }: WriteNpmrcParams): void;
}
declare module "src/write-rc/yarn2rc" {
    import { Token } from "src/lib/types";
    type Yarn2RcParams = {
        yarnrcPath: string;
        registries: Set<string>;
        token: Token;
    };
    export function writeYarn2rc({ registries, token, yarnrcPath }: Yarn2RcParams): void;
}
declare module "src/lib/readConfig" {
    export function readConfig(): Set<string>;
}
declare module "src/lib/operate" {
    import { CliOptions } from "src/lib/types";
    export function operate(config: CliOptions): Promise<void>;
}
declare module "src/cli" {
    export * from "src/api-stuff/auth";
    export * from "src/api-stuff/refetch";
    export * from "src/api-stuff/server";
    export * from "src/file-stuff/prepare";
    export * from "src/file-stuff/prepare.types";
    export * from "src/lib/operate";
    export * from "src/lib/readConfig";
    export * from "src/lib/types";
    export * from "src/lib/writeAdoRc";
    export * from "src/write-rc/npmrc";
    export * from "src/write-rc/yarn2rc";
}
