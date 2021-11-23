export type Token = {
  access_token?: string;
  token_type?: string;
  refresh_token?: string;
  expires_in?: string;
};

export enum AdoAuthApiResponseTypes {
  NO_RESULT = 'NO_RESULT',
  NO_TOKENS = 'NO_TOKENS',
  MISSING_CODE = 'MISSING_CODE',
  MISSING_SECRET = 'MISSING_SECRET',
  ADO_REQUEST_ERROR = 'ADO_REQUEST_ERROR',
  SUCCESS = 'SUCCESS',
}

export type AdoAuthApiResponse =
  | {
      code: AdoAuthApiResponseTypes.NO_RESULT;
      error: string;
    }
  | {
      code: AdoAuthApiResponseTypes.NO_TOKENS;
      error: string;
      body?: Token;
    }
  | {
      code: AdoAuthApiResponseTypes.MISSING_CODE;
      message: string;
    }
  | {
      code: AdoAuthApiResponseTypes.MISSING_SECRET;
      message: string;
    }
  | {
      code: AdoAuthApiResponseTypes.ADO_REQUEST_ERROR;
      error: string;
      body?: {
        message?: string;
        stack?: string;
      };
    }
  | {
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
