declare const track: {
    inserted: (el: any, binding: {
        arg: any;
    }) => void;
    unbind(el: any, binding: any): void;
};
export declare function setTrackDirectives(app: any): void;
export default track;
