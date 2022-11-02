declare const track_v2: {
    inserted: (el: any, binding: {
        arg: any;
    }) => void;
    unbind(el: any, binding: any): void;
};
export declare function setTrackV2Directives(app: any): void;
export default track_v2;
