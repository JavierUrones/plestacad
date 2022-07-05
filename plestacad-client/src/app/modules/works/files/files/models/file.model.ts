
export class MyFile {
  path!: string;
  isDirectory!: boolean;
  modification!: string;
  image!: boolean;
  filename!: string;
  children!: MyFile[];
  parent!: string;
  deepLevel!: number;
  size!: number;
}
