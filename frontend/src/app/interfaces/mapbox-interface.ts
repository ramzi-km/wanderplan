export interface MapboxGeocodingResponse {
  type: string;
  query: string[];
  features: MapboxPlaceFeature[];
  attribution: string;
}

export interface MapboxPlaceFeature {
  id: string;
  type: string;
  place_type: string[];
  relevance: number;
  properties: {
    [key: string]: any;
  };
  text: string;
  place_name: string;
  matching_text: string;
  matching_place_name: string;
  center: [number, number];
  geometry: {
    type: string;
    coordinates: [number, number];
    interpolated?: boolean;
    omitted?: boolean;
  };
  address: string;
  context: MapboxContext[];
}

interface MapboxContext {
  id: string;
  text: string;
  wikidata?: string;
  short_code?: string;
}
