export type TextContentType = {
  type: 'text';
  content: {
    heading: string;
  };
};

export type VideoContentType = {
  type: 'video';
  content: {
    source: string;
    heading: string;
  };
};

export type ContentSlide = TextContentType | VideoContentType;