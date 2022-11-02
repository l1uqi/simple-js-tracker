import { IConcosle } from "../types/index";
export declare function isValidKey(key: string | number | symbol, object: object): key is keyof typeof object;
export declare const initParamsConsole: (params: any) => Promise<void>;
export declare const cConsole: (params: IConcosle) => void;
