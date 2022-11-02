export interface IConcosle { 
  text: string | Array<Object> | Object,
  type?: string, 
  debug?: boolean,
  [key: string]: string | boolean | Array<Object> | Object | undefined
}