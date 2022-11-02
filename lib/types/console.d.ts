export interface IConcosle {
    text: string;
    type?: string;
    debug?: boolean;
    [key: string]: string | boolean | undefined;
}
