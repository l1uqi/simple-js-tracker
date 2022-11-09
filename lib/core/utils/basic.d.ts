import { ICustomOptions } from "../types/index";
export declare const filterParams: (data: ICustomOptions) => ICustomOptions;
export declare const getheatMap: (x: number, y: number) => string;
export declare const urlIsLong: (url: string) => boolean;
export declare const GenNonDuplicateID: () => string;
export declare const compareVersion: (version1: string, version2: string) => 0 | 1 | -1;
export declare const getPagePerformance: () => any;
export declare const sleep: (ms: any) => Promise<unknown>;
