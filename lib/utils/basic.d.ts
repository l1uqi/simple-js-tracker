import { IConcosle, ICustomOptions } from "../types/index";
export declare const cConsole: (params: IConcosle) => void;
export declare const filterParams: (data: ICustomOptions) => ICustomOptions;
export declare function isValidKey(key: string | number | symbol, object: object): key is keyof typeof object;
export declare const getheatMap: (x: number, y: number) => string;
export declare const urlIsLong: (url: string) => boolean;
export declare const compareVersion: (version1: string, version2: string) => 0 | 1 | -1;
