import {CmsField} from 'netlify-cms-core';

import {COLORS} from '../../../shared/src/constants/colors';
import {
  CARD_FIELD,
  ID_FIELD,
  VIDEO_FIELD_WITH_AUDIO,
  NAME_FIELD,
  PUBLISHED_FIELD,
  VIDEO_FIELD,
} from './common';
import {
  CONTENT_SLIDE,
  HOST_NOTES,
  HOST_SLIDE,
  REFLECTION_SLIDE,
  SHARING_SLIDE,
} from './slides';

const INTRO_PORTAL: CmsField = {
  label: 'Intro Portal',
  name: 'introPortal',
  widget: 'object',
  collapsed: true,
  required: false,
  i18n: true,
  fields: [
    {...VIDEO_FIELD_WITH_AUDIO, label: 'Video Loop', name: 'videoLoop'},
    {...VIDEO_FIELD, label: 'Video End', name: 'videoEnd'},
    HOST_NOTES,
  ],
};

const OUTRO_PORTAL: CmsField = {
  label: 'Outro Portal',
  name: 'outroPortal',
  widget: 'object',
  collapsed: true,
  required: false,
  i18n: true,
  fields: [{...VIDEO_FIELD_WITH_AUDIO, label: 'Video', name: 'video'}],
};

const THEME: CmsField = {
  label: 'Theme',
  name: 'theme',
  widget: 'object',
  collapsed: true,
  required: false,
  i18n: true,
  fields: [
    {
      label: 'Text Color',
      name: 'textColor',
      widget: 'select',
      multiple: false,
      i18n: 'duplicate',
      default: COLORS.ACTION,
      options: [
        {label: 'Light', value: COLORS.WHITE},
        {label: 'Dark', value: COLORS.BLACK},
      ],
      required: false,
    },
    {
      label: 'Background Color',
      name: 'backgroundColor',
      widget: 'color',
      i18n: 'duplicate',
      required: false,
    },
  ],
};

const EXERCISE_FIELDS: Array<CmsField> = [
  ID_FIELD,
  NAME_FIELD,
  PUBLISHED_FIELD,
  CARD_FIELD,
  THEME,
  INTRO_PORTAL,
  OUTRO_PORTAL,
  {
    label: 'Slides',
    name: 'slides',
    widget: 'list',
    i18n: true,
    types: [CONTENT_SLIDE, REFLECTION_SLIDE, SHARING_SLIDE, HOST_SLIDE],
  },
];

export default EXERCISE_FIELDS;
