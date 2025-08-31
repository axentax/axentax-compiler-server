declare module 'axentax-compiler/dist/conductor.js' {
  export interface AllowAnnotation {
    name: string;
    dualIdRestrictions: number[];
  }

  export interface ChordDicMap {
    [key: string]: any;
  }

  export interface MapSeed {
    [key: string]: any;
  }

  export interface ErrorInfo {
    message: string;
    line: number;
    linePos: number;
    token: string | null;
  }

  export interface Conduct {
    syntax: string;
    settings: any;
    regionLength: number;
    bpmPosList: any[];
    clickPointList: any[];
    flash: any;
    dic: any;
    mixesList: any[];
    warnings: any[];
    extensionInfo: any;
    locationInfoList: any[];
    braceLocationInfoList: any[];
    styleObjectBank: any;
    allowAnnotations: AllowAnnotation[];
  }

  export interface ConvertToObj {
    id: number;
    error: ErrorInfo | null;
    response: Conduct | null;
    midi?: ArrayBuffer;
    midiRequest?: boolean;
    compileMsec?: number;
  }

  export class Conductor {
    static convert(
      syntax: string,
      allowAnnotations: AllowAnnotation[],
      chordDic: ChordDicMap,
      mapSeed: MapSeed,
      isValidOnly: boolean
    ): any;

    static convertToObj(
      hasStyleCompile: boolean,
      hasMidiBuild: boolean,
      syntax: string,
      allowAnnotation: AllowAnnotation[],
      chordDic: ChordDicMap,
      mapSeed: MapSeed
    ): ConvertToObj;
  }
}
